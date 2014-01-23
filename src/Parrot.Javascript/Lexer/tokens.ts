/// <reference path="token.ts" />
/// <reference path="tokenType.ts" />
module Parrot.Lexer {
    export class AtToken extends Token {
        constructor(index: number) {
            super(index, "@", TokenType.At);
        }
    }

    export class QuotedStringLiteralToken extends Token {
        constructor(index: number, content: string) {
            super(index, content, TokenType.QuotedStringLiteral);
        }
    }

    export class StringLiteralPipeToken extends Token {
        constructor(index: number, content: string) {
            super(index, content, TokenType.StringLiteralPipe);
        }
    }

    export class PlusToken extends Token {
        constructor(index: number) {
            super(index, "+", TokenType.Plus);
        }
    }

    export class GreaterThanToken extends Token {
        constructor(index: number) {
            super(index, ">", TokenType.GreaterThan);
        }
    }

    export class CloseParenthesisToken extends Token {
        constructor(index: number) {
            super(index, ")", TokenType.CloseParenthesis);
        }
    }

    export class CloseBracesToken extends Token {
        constructor(index: number) {
            super(index, "}", TokenType.CloseBrace);
        }
    }

    export class OpenBracesToken extends Token {
        constructor(index: number) {
            super(index, "{", TokenType.OpenBrace);
        }
    }

    export class EqualToken extends Token {
        constructor(index: number) {
            super(index, "=", TokenType.Equal);
        }
    }

    export class CloseBracketToken extends Token {
        constructor(index: number) {
            super(index, "]", TokenType.CloseBracket);
        }
    }

    export class OpenBracketToken extends Token {
        constructor(index: number) {
            super(index, "[", TokenType.OpenBracket);
        }
    }

    export class OpenParenthesisToken extends Token {
        constructor(index: number) {
            super(index, "(", TokenType.OpenParenthesis);
        }
    }

    export class CommaToken extends Token {
        constructor(index: number) {
            super(index, ",", TokenType.Comma);
        }
    }

    export class IdentifierToken extends Token {
        constructor(index: number, content: string, type: TokenType) {
            super(index, content, type);
        }
    }

    export class WhitespaceToken extends Token {
        constructor(index: number, content: string, type: TokenType) {
            super(index, content, type);
        }
    }
}