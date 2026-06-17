const RAW = {
  button: 'rawButton',
  input: 'rawInput',
  select: 'rawSelect',
  textarea: 'rawTextarea',
};

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Forbid raw interactive HTML elements when an IDS equivalent exists.' },
    messages: {
      rawButton: 'Use <UdsButton label="..."> instead of <button>.',
      rawInput: 'Use <UdsInput> instead of <input>.',
      rawSelect: 'Use <UdsSelect> instead of <select>.',
      rawTextarea: 'Use <UdsTextarea> instead of <textarea>.',
      rawAnchorWithHandler: 'Use <UdsButton variant="link"> instead of <a onClick>.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const name = node.name.name;
        if (RAW[name]) {
          context.report({ node, messageId: RAW[name] });
          return;
        }
        if (name === 'a' && node.attributes.some((a) => a.type === 'JSXAttribute' && a.name.name === 'onClick')) {
          context.report({ node, messageId: 'rawAnchorWithHandler' });
        }
      },
    };
  },
};
