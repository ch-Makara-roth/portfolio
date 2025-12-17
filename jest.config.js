module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|remark-gfm|remark-parse|remark-rehype|mdast-util-from-markdown|mdast-util-to-string|mdast-util-to-hast|mdast-util-to-markdown|mdast-util-gfm|mdast-util-gfm-autolink-literal|mdast-util-gfm-footnote|mdast-util-gfm-strikethrough|mdast-util-gfm-table|mdast-util-gfm-task-list-item|mdast-util-find-and-replace|mdast-util-phrasing|micromark|micromark-core-commonmark|micromark-util-[^/]+|micromark-factory-[^/]+|micromark-extension-gfm|micromark-extension-gfm-autolink-literal|micromark-extension-gfm-footnote|micromark-extension-gfm-strikethrough|micromark-extension-gfm-table|micromark-extension-gfm-tagfilter|micromark-extension-gfm-task-list-item|decode-named-character-reference|rehype-raw|rehype-prism-plus|rehype-sanitize|hast-util-sanitize|prismjs|devlop|hast-util-to-jsx-runtime|comma-separated-tokens|space-separated-tokens|property-information|estree-util-is-identifier-name|hast-util-whitespace|unist-util-position|vfile-message|vfile|unist-util-stringify-position|html-url-attributes|trim-lines|unist-util-visit|unist-util-visit-parents|unist-util-is|unified|bail|is-plain-obj|trough|ccount|escape-string-regexp|markdown-table|zwitch|longest-streak)/)',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1',
    '^rehype-raw$': '<rootDir>/__mocks__/rehype-raw.js',
    '^rehype-prism-plus$': '<rootDir>/__mocks__/rehype-prism-plus.js',
  },
}