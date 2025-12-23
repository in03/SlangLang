/*
 * SlangLang syntax highlighting for Highlight.js
 * Auto-generated from lexer.js
 */
export default function(hljs) {
  const KEYWORDS = {
    keyword: 'if or otherwise make tracks scoffin dealin pass the from every in til fully sick full got prep barbie with and fair go serve on howbout',
    built_in: 'crikey grab at chuck lot mates call bugger suss gimme another shrimp ditch drop last first snag sheepshear top up tossin noice oi',
    type: 'flamin frothin spewin esky tuckshop empty',
    literal: 'yeah nah nothin empty',
  };

  const OPERATORS = 'is then tops cops equals not as plus minus times dividedby';

  const SLANG_STRING = {
    className: 'string',
    begin: /\bbloody\b/,
    end: /\bmate\b|(?=[,\.!\?]|$)/,
    contains: [
      { className: 'keyword', begin: /\b(bloody|mate)\b/ }
    ]
  };

  const QUOTED_STRING = {
    className: 'string',
    begin: '"',
    end: '"',
    contains: [
      hljs.BACKSLASH_ESCAPE
    ]
  };

  const NUMBER = {
    className: 'number',
    begin: /-?\b\d+(\.\d+)?\b/
  };

  const COMMENT = {
    className: 'comment',
    begin: /#/,
    end: /$/
  };

  return {
    name: 'SlangLang',
    aliases: ['slang'],
    keywords: KEYWORDS,
    contains: [
      COMMENT,
      QUOTED_STRING,
      SLANG_STRING,
      NUMBER,
      {
        className: 'operator',
        begin: new RegExp('\\b(' + OPERATORS.split(' ').join('|') + ')\\b')
      },
      {
        className: 'title.function',
        begin: /\bprep\s+/,
        end: /\s+barbie/,
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: 'punctuation',
        begin: /[–,:\.!\?]/
      }
    ]
  };
}
