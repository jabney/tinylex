All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2018-01-02
- Documentation and example updates

## [0.2.0] - 2018-01-02
- Add options and 'throwOnMismatch' option
- Add better lex error reporting
- Null out member variables when lexer is consumed
- Fix last token undefined issue.
- Restructure 'lex' to call scan in a loop and return 'EOF' as the last token.
- Generate source maps
- Null check match[1] in string specifier
- Return false from _handleMatches if tokens list is empty

## [0.1.0] - 2018-01-01
Initial version
