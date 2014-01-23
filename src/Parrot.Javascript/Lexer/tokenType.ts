module Parrot.Lexer {
    export enum TokenType {
        Start,
        Identifier,
        QuotedStringLiteral,
        StringLiteral,
        OpenBracket,
        CloseBracket,
        OpenParenthesis,
        CloseParenthesis,
        Comma,
        OpenBrace,
        CloseBrace,
        GreaterThan,
        Plus,
        Whitespace,
        StringLiteralPipe,
        CommentLine,
        CommentStart,
        CommentEnd,
        Equal,
        At
    }
}