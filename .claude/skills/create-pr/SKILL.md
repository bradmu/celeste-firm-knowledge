---
name: create-pr
description: 'Create a pull request in Azure DevOps for the current branch targeting main. Generates a title and description from commits and changed files. Use when the user asks to create a PR, open a pull request, or submit their branch for review.'
---

# Create PR Skill

Creates a pull request in Azure DevOps for the current branch, generating a structured title and description from commits and the diff.

## Prerequisites

- Azure CLI installed and authenticated (`az login`)
- Azure DevOps CLI extension installed (`az extension add --name azure-devops`)

---

## Step 1: Get Authentication Token

```bash
TOKEN=$(az account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798 --query accessToken -o tsv)
```

If this fails, tell the user to run `az login` first and stop.

---

## Step 2: Parse Repo Details

```bash
REMOTE=$(git remote get-url origin)
ORG=$(echo "$REMOTE" | sed 's|.*dev.azure.com/||' | cut -d'/' -f1)
PROJECT=$(echo "$REMOTE" | sed 's|.*dev.azure.com/[^/]*/||' | cut -d'/' -f1)
REPO=$(echo "$REMOTE" | sed 's|.*/_git/||')
BRANCH=$(git branch --show-current)
TARGET_BRANCH="main"
```

---

## Step 3: Check for Existing PR

```bash
EXISTING_PR=$(az repos pr list \
  --organization "https://dev.azure.com/$ORG" \
  --project "$PROJECT" \
  --repository "$REPO" \
  --source-branch "$BRANCH" \
  --status active \
  --output json 2>/dev/null | jq '.[0]')
```

If an active PR already exists, tell the user the PR number and URL, and suggest running `/update-pr` instead. Stop.

---

## Step 4: Collect Branch Change Information

```bash
git fetch origin "$TARGET_BRANCH" 2>/dev/null
COMMITS=$(git log --oneline "origin/$TARGET_BRANCH"..HEAD)
CHANGED_FILES=$(git diff --name-only "origin/$TARGET_BRANCH"..HEAD)
DIFF=$(git diff "origin/$TARGET_BRANCH"..HEAD)
```

If there are no commits ahead of `origin/main`, tell the user there is nothing to PR and stop.

---

## Step 5: Generate PR Title and Description

**Title:** Extract a Jira/work item reference from the branch name if present (e.g. `DES-1234` from `DES-1234-my-feature` → title starts with `DES-1234:`). Keep the title under 72 characters and make it descriptive of the overall change.

**Description:** Generate a structured markdown description:

```markdown
## Summary

[1–3 sentence summary of what this PR does and why]

## Changes

- [Specific change 1]
- [Specific change 2]
- ...

## Testing

- [ ] Built and tested locally
- [ ] Existing tests pass
- [ ] [Any specific scenarios worth calling out]

## Notes for reviewers

[Any relevant context, gotchas, or areas to focus on — omit section if nothing notable]
```

---

## Step 6: Check for Draft Flag

If the user passed `--draft`, set `IS_DRAFT=true`, otherwise `IS_DRAFT=false`.

---

## Step 7: Create the PR via Azure DevOps REST API

Escape the generated title and description as valid JSON strings before inserting them.

```bash
DRAFT_VALUE="false"  # or "true" if --draft was passed

cat > /tmp/create-pr-payload.json << ENDJSON
{
  "title": "GENERATED_TITLE",
  "description": "GENERATED_DESCRIPTION",
  "sourceRefName": "refs/heads/$BRANCH",
  "targetRefName": "refs/heads/$TARGET_BRANCH",
  "isDraft": $DRAFT_VALUE
}
ENDJSON

RESPONSE=$(curl -s -X POST \
  "https://dev.azure.com/$ORG/$PROJECT/_apis/git/repositories/$REPO/pullRequests?api-version=7.1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/create-pr-payload.json)

PR_ID=$(echo "$RESPONSE" | jq -r '.pullRequestId')
PR_URL="https://dev.azure.com/$ORG/$PROJECT/_git/$REPO/pullrequest/$PR_ID"
```

If `PR_ID` is null or empty, show the full API response to the user and stop.

---

## Step 8: Output

Tell the user:

- PR number and full URL (make it clickable in markdown)
- The generated title
- A brief summary of what's in the PR (number of commits, files changed)
- Whether it was created as a draft
