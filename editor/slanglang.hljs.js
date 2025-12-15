/*
 * SlangLang syntax highlighting for Highlight.js
 * Auto-generated from lexer.js
 */
export default function(hljs) {
  const KEYWORDS = {
    keyword: '',
    built_in: '',
    type: '',
    literal: 'yeah nah nothin empty',
  };

  const OPERATORS = '';

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
