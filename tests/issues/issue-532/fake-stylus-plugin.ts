import type { Plugin } from 'prettier';

/**
 * Stand-in for a third-party stylus plugin.
 *
 * It drops the optional colon after property names (`color: red` -> `color red`),
 * which is valid stylus either way, so the output shows that the plugin ran.
 * `prettier-plugin-stylus` drops these colons as well and declares the same language.
 */
export const fakeStylusPlugin: Plugin<string> = {
  languages: [
    {
      name: 'Stylus',
      parsers: ['stylus'],
      extensions: ['.styl'],
    },
  ],
  parsers: {
    stylus: {
      parse: (text) => text,
      astFormat: 'fake-stylus',
      locStart: () => 0,
      locEnd: (text: string) => text.length,
    },
  },
  printers: {
    'fake-stylus': {
      print: (path) => path.node.trim().replaceAll(/^(\s*[\w-]+):\s+/gm, '$1 '),
    },
  },
};
