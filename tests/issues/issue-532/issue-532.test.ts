import { plugin } from 'src/index';
import { compareFiles } from 'tests/common';
import { describe, expect, it } from 'vitest';
import { fakeStylusPlugin } from './fake-stylus-plugin';

describe('Issues', () => {
  describe('issue #532', () => {
    it('should format style tags based on their type attribute', async () => {
      const { actual, expected } = await compareFiles(import.meta.url);
      expect(actual).toBe(expected);
    });

    it('should format style tags with parsers from other plugins', async () => {
      const { actual, expected } = await compareFiles(import.meta.url, {
        source: 'stylus-sass.unformatted.pug',
        target: 'stylus-sass.formatted.pug',
        formatOptions: {
          plugins: [plugin, fakeStylusPlugin],
        },
      });
      expect(actual).toBe(expected);
    });
  });
});
