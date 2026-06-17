/**
 * Normalises PreToolUse payloads from Claude Code and Cursor 2.4+ into a
 * shared shape: { tool, filePath, newContent }. Returns null if the payload
 * is not a Write/Edit, has an unknown shape, or is missing fields — caller
 * should fail-open in that case.
 */
export function normalisePayload(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const toolName = raw.tool_name ?? raw.toolName;
  if (toolName !== 'Write' && toolName !== 'Edit') return null;

  const input = raw.tool_input ?? raw.toolInput ?? {};
  const filePath = input.file_path ?? input.filePath;
  // Write uses `content`; Edit uses `new_string`.
  const newContent = input.content ?? input.new_string ?? input.newString;

  if (!filePath || typeof newContent !== 'string') return null;
  return { tool: toolName, filePath, newContent };
}
