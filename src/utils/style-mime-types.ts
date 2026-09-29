import type { BuiltInParserName, Plugin, SupportLanguage } from 'prettier';
import type { AttributeToken } from 'pug-lexer';

const wrappingQuotesRe: RegExp = /(^(["'`]))|((["'`])$)/g;

// Matches style types to the required parser for them
// Note: Types not listed here (e.g. `sass` or `stylus`) are only formatted if
//       another loaded plugin provides a parser for them
const styleTypeToParserMap: Map<string, BuiltInParserName> = new Map([
  ['css', 'css'],
  ['text/css', 'css'],
  ['less', 'less'],
  ['text/less', 'less'],
  ['scss', 'scss'],
  ['text/scss', 'scss'],
]);

/**
 * Decides which parser to format style contents with.
 *
 * @param typeAttrToken Type token of the style tag.
 * @param plugins Loaded plugins, used to find parsers for non-builtin types.
 * @returns Parser name to parse contents with.
 */
export function getStyleParserName(
  typeAttrToken?: AttributeToken,
  plugins: ReadonlyArray<string | URL | Plugin> = [],
): string | undefined {
  // Omission means CSS
  if (!typeAttrToken) {
    return 'css';
  }

  const typeRaw: string | boolean = typeAttrToken.val;
  // If it's not a string, best not do anything
  if (typeof typeRaw !== 'string') {
    return;
  }

  const type: string = typeRaw.replaceAll(wrappingQuotesRe, '').toLowerCase();

  // Empty type is equivalent to omission
  if (!type) {
    return 'css';
  }

  const builtInParser: BuiltInParserName | undefined =
    styleTypeToParserMap.get(type);
  if (builtInParser) {
    return builtInParser;
  }

  // Match languages of other plugins (e.g. `prettier-plugin-stylus`)
  // the same way prettier matches the `lang` attribute of vue style blocks
  const name: string = type.replace(/^text\//, '');
  for (const plugin of plugins) {
    if (typeof plugin !== 'object' || plugin instanceof URL) {
      continue;
    }

    const language: SupportLanguage | undefined = plugin.languages?.find(
      ({ name: languageName, aliases, extensions }) =>
        languageName.toLowerCase() === name ||
        aliases?.includes(name) === true ||
        extensions?.includes(`.${name}`) === true,
    );
    if (language?.parsers[0]) {
      return language.parsers[0];
    }
  }

  return;
}
