import { defineMarkdocConfig, nodes, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  nodes: {
    link: {
      ...nodes.link,
      attributes: {
        ...nodes.link.attributes,
        target: { type: String, default: '_blank' },
        rel: { type: String, default: 'noopener noreferrer' },
      },
    },
  },
});
