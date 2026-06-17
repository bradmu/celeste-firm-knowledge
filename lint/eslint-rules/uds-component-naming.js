export default {
  meta: {
    type: 'problem',
    docs: { description: 'Warn on Uds* JSX tags not present in the installed component manifest.' },
    messages: { unknownUds: 'Component <{{name}}> is not in the IDS component manifest.' },
    schema: [{
      type: 'object',
      properties: { components: { type: 'array', items: { type: 'string' } } },
      additionalProperties: false,
    }],
  },
  create(context) {
    const allowed = new Set(context.options[0]?.components ?? []);
    if (allowed.size === 0) return {};
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const name = node.name.name;
        if (!name.startsWith('Uds')) return;
        if (allowed.has(name)) return;
        context.report({ node, messageId: 'unknownUds', data: { name } });
      },
    };
  },
};
