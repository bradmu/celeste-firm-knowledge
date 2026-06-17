import { Fragment } from 'react';

/**
 * Hand-written sample responses standing in for a real LLM call. Each
 * template is a structured list of blocks so the chat page can render them
 * with the same typography conventions as the Figma (Lora serif paragraphs,
 * Geist for lists, mid-content horizontal rule).
 *
 * Keyword routing keeps the demo feeling responsive without committing to
 * an actual API call: M&A-flavoured prompts get an M&A walkthrough, tax
 * prompts get a tax-research walkthrough, and everything else gets a
 * generic "here's how I'd approach it" template.
 *
 * Swap any of this for a real `fetch('/api/chat')` later; the rendering
 * shape is what matters for the prototype.
 */

type Block =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'divider' };

type CannedResponse = {
  /** The chat-page top-bar title for this conversation. */
  title: string;
  blocks: Block[];
};

const MA_KEYWORDS = [
  'm&a',
  'acquisition',
  'merger',
  'add-on',
  'addon',
  'target',
  'silver oak',
  'silver lake',
  'deal',
  'sponsor',
  'roll-up',
  'rollup',
];

const TAX_KEYWORDS = [
  'tax',
  'irc',
  'deduction',
  'transfer pricing',
  'restructuring',
  'reorg',
];

const LITIGATION_KEYWORDS = [
  'litigation',
  'matter',
  'case',
  'court',
  'discovery',
  'precedent',
];

function matches(prompt: string, keywords: string[]): boolean {
  const lower = prompt.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function deriveTitle(prompt: string, fallback: string): string {
  // First clause or first ~40 chars, whichever is shorter.
  const trimmed = prompt.trim().replace(/[?.!]+$/, '');
  if (trimmed.length === 0) return fallback;
  const firstClause = trimmed.split(/[,.;:?!]/)[0] ?? trimmed;
  const titleSource = firstClause.length < 60 ? firstClause : trimmed;
  if (titleSource.length <= 40) return titleSource;
  return titleSource.slice(0, 38).trim() + '…';
}

function mAndAResponse(prompt: string): CannedResponse {
  return {
    title: deriveTitle(prompt, 'M&A analysis'),
    blocks: [
      {
        kind: 'paragraph',
        text: `Nice — I'll build a practical, lower-middle-market list tailored to your question and the broader healthcare M&A playbook. I looked at recent deal flow, current sponsor activity, and adjacent service lines that have been the most active integration targets in 2024–2025, then narrowed to a focused set of plausible candidates. I've included a one-line rationale for each. If you want, I can then (a) produce a ranked scorecard for the list, (b) draft outreach copy, or (c) build a short diligence checklist for any targets you pick.`,
      },
      { kind: 'heading', text: 'Background (quick facts I used)' },
      {
        kind: 'list',
        items: [
          'Sponsor focus on lower-middle-market healthcare services (typically $15–150M revenue), with active interest in home-based care, infusion/specialty pharmacy, and ancillary services.',
          'M&A pace in healthcare services through 2024–2025 has been driven by roll-up strategies and strategic buyers seeking geographic or payer-mix complementarity. Multiples have compressed slightly from 2021 peaks but remain elevated for high-quality assets.',
          'Several large incumbents have spun off non-core service lines, creating a steady supply of carve-out candidates that fit a roll-up thesis.',
        ],
      },
      { kind: 'divider' },
      {
        kind: 'heading',
        text: '10 potential add-on opportunities (US healthcare focus)',
      },
      {
        kind: 'paragraph',
        text: 'Note: the list emphasises complementary, roll-up-friendly targets that expand geography, payer mix, or adjacent services. Names below are illustrative — verify current ownership and revenue band before outreach.',
      },
      {
        kind: 'list',
        items: [
          'Regional home-health provider with 4–6 branches in the Southeast — fills a geography gap and provides immediate scale for ancillary cross-sell.',
          'Infusion-therapy operator with a strong oncology mix — recurring revenue and growing payer demand for at-home infusion.',
          'Specialty pharmacy targeting rare disease and oncology — high-margin scripts and natural cross-sell to existing patient base.',
          'Outpatient rehab/PT chain in a fragmented metro market — predictable EBITDA and a textbook tuck-in candidate.',
          'Dental services organisation (DSO) with 8–12 locations in two states — payer mix is well diversified and de novo growth is feasible.',
          'Behavioural health outpatient group — strong tailwinds from parity legislation and consistent reimbursement.',
          'Wound-care services provider operating in skilled-nursing settings — niche, high-acuity, and underserved by the larger consolidators.',
          'Hospice and palliative-care operator in the Mountain West — geography complement to existing home-care assets.',
          'Medical-staffing platform focused on allied health — adjacent service-line bet with strong unit economics.',
          'Revenue-cycle management (RCM) firm serving small/mid-size physician practices — sticky SaaS-like revenue and obvious cost-takeout angle.',
        ],
      },
    ],
  };
}

function taxResponse(prompt: string): CannedResponse {
  return {
    title: deriveTitle(prompt, 'Tax analysis'),
    blocks: [
      {
        kind: 'paragraph',
        text: `Here's a structured pass at the question. I started from the relevant IRC sections, then pulled the most recent IRS guidance and the firm's prior memos that addressed comparable fact patterns. I've flagged the items where reasonable practitioners disagree so you can prioritise where to spend partner review time.`,
      },
      { kind: 'heading', text: 'Key authorities and prior firm memos' },
      {
        kind: 'list',
        items: [
          'Primary statutory anchor: IRC § 368 (reorganisations) — specifically the (a)(1)(A) and (a)(1)(F) variants depending on the structure.',
          'Treasury regulations: Treas. Reg. § 1.368-2 for continuity of business enterprise; Treas. Reg. § 1.368-1(d) for the COBE analysis.',
          'Most relevant prior firm memo: "Cross-border F reorg — step-transaction risk" (2024). Same facts, different jurisdiction.',
          'IRS guidance: Rev. Rul. 2024-XX provides the most recent comfort on staged reorganisations.',
        ],
      },
      { kind: 'divider' },
      { kind: 'heading', text: 'Practical considerations and open questions' },
      {
        kind: 'paragraph',
        text: 'A few items I would want to pressure-test before issuing a tax opinion:',
      },
      {
        kind: 'list',
        items: [
          'Step-transaction risk — are the proposed steps sufficiently independent, or will they be collapsed?',
          'State tax treatment — federal treatment as a reorganisation does not necessarily preserve state-level tax efficiency.',
          'Foreign tax credit utilisation if any subsidiary is outside the US.',
          'Reporting timeline — Form 8023/8883 timing if a § 338(h)(10) election is in scope.',
        ],
      },
    ],
  };
}

function litigationResponse(prompt: string): CannedResponse {
  return {
    title: deriveTitle(prompt, 'Matter analysis'),
    blocks: [
      {
        kind: 'paragraph',
        text: `Quick read on the matter. I pulled prior firm precedents that addressed comparable issues and surfaced the most relevant authorities. Below is a working framework; the items in bold are ones I'd flag for partner review before relying on them in a brief.`,
      },
      { kind: 'heading', text: 'Comparable precedents' },
      {
        kind: 'list',
        items: [
          'Firm matter (2023): same circuit, similar fact pattern around standing — court denied summary judgment.',
          'Public precedent: most recent Circuit opinion narrowed the test we have historically relied on.',
          'Settlement data: comparable matters in this venue have resolved within 9–14 months of filing.',
        ],
      },
      { kind: 'divider' },
      { kind: 'heading', text: 'Recommended next steps' },
      {
        kind: 'list',
        items: [
          'Pull the firm precedent and confirm whether the procedural posture matches.',
          'Map the new Circuit standard to our existing brief outline — flag any sections that need a rewrite.',
          'Draft a short memo for the partner outlining the two strongest arguments and the gating risks.',
        ],
      },
    ],
  };
}

function genericResponse(prompt: string): CannedResponse {
  return {
    title: deriveTitle(prompt, 'Analysis'),
    blocks: [
      {
        kind: 'paragraph',
        text: `Here's how I'd approach this. I'm working from public context plus a few patterns I see across similar engagements; for anything firm-specific you'll want to enable the relevant connectors and resources below so I can ground the answer in your actual data.`,
      },
      { kind: 'heading', text: 'Initial framing' },
      {
        kind: 'list',
        items: [
          'Restate the question in operational terms — what decision does the answer need to support?',
          'List the data sources that would change the answer most if connected.',
          'Identify the team members who would normally weigh in, so we can route the result.',
        ],
      },
      { kind: 'divider' },
      { kind: 'heading', text: 'Suggested workstream' },
      {
        kind: 'paragraph',
        text: `Based on a quick scan, the most productive next step is to enable a small set of connectors and reference materials so the next pass of the analysis can cite firm-specific facts. The module below surfaces the resources I'd reach for first.`,
      },
    ],
  };
}

export function getCannedResponse(prompt: string): CannedResponse {
  if (matches(prompt, MA_KEYWORDS)) return mAndAResponse(prompt);
  if (matches(prompt, TAX_KEYWORDS)) return taxResponse(prompt);
  if (matches(prompt, LITIGATION_KEYWORDS)) return litigationResponse(prompt);
  return genericResponse(prompt);
}

/**
 * Renders the structured response into the chat page. Typography mirrors
 * the Figma:
 *   • paragraphs in Lora at 16/28
 *   • headings in Lora SemiBold at 18
 *   • list items in Geist
 *   • horizontal rule between major sections
 */
export function CannedResponseBody({ response }: { response: CannedResponse }) {
  return (
    <div className="flex flex-col gap-3">
      {response.blocks.map((block, idx) => (
        <Fragment key={idx}>
          {block.kind === 'paragraph' ? (
            <p className="font-serif text-base leading-7 text-foreground">
              {block.text}
            </p>
          ) : null}

          {block.kind === 'heading' ? (
            <h3 className="font-serif text-[18px] font-semibold leading-7 text-foreground">
              {block.text}
            </h3>
          ) : null}

          {block.kind === 'list' ? (
            <ul className="list-disc pl-6 text-base leading-7 text-foreground marker:text-muted-foreground">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="font-sans">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          {block.kind === 'divider' ? (
            <hr className="my-2 border-t border-border" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export type { CannedResponse };
