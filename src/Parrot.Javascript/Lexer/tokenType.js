var Parrot;
(function (Parrot) {
    (function (Lexer) {
        (function (TokenType) {
            TokenType[TokenType["Start"] = 0] = "Start";
            TokenType[TokenType["Identifier"] = 1] = "Identifier";
            TokenType[TokenType["QuotedStringLiteral"] = 2] = "QuotedStringLiteral";
            TokenType[TokenType["StringLiteral"] = 3] = "StringLiteral";
            TokenType[TokenType["OpenBracket"] = 4] = "OpenBracket";
            TokenType[TokenType["CloseBracket"] = 5] = "CloseBracket";
            TokenType[TokenType["OpenParenthesis"] = 6] = "OpenParenthesis";
            TokenType[TokenType["CloseParenthesis"] = 7] = "CloseParenthesis";
            TokenType[TokenType["Comma"] = 8] = "Comma";
            TokenType[TokenType["OpenBrace"] = 9] = "OpenBrace";
            TokenType[TokenType["CloseBrace"] = 10] = "CloseBrace";
            TokenType[TokenType["GreaterThan"] = 11] = "GreaterThan";
            TokenType[TokenType["Plus"] = 12] = "Plus";
            TokenType[TokenType["Whitespace"] = 13] = "Whitespace";
            TokenType[TokenType["StringLiteralPipe"] = 14] = "StringLiteralPipe";
            TokenType[TokenType["CommentLine"] = 15] = "CommentLine";
            TokenType[TokenType["CommentStart"] = 16] = "CommentStart";
            TokenType[TokenType["CommentEnd"] = 17] = "CommentEnd";
            TokenType[TokenType["Equal"] = 18] = "Equal";
            TokenType[TokenType["At"] = 19] = "At";
            TokenType[TokenType["Caret"] = 20] = "Caret";
        })(Lexer.TokenType || (Lexer.TokenType = {}));
        var TokenType = Lexer.TokenType;
    })(Parrot.Lexer || (Parrot.Lexer = {}));
    var Lexer = Parrot.Lexer;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=tokenType.js.map
