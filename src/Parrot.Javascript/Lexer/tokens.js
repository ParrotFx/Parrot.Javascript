var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Parrot;
(function (Parrot) {
    /// <reference path="token.ts" />
    /// <reference path="tokenType.ts" />
    (function (Lexer) {
        var AtToken = (function (_super) {
            __extends(AtToken, _super);
            function AtToken(index) {
                _super.call(this, index, "@", 19 /* At */);
            }
            return AtToken;
        })(Parrot.Lexer.Token);
        Lexer.AtToken = AtToken;

        var QuotedStringLiteralToken = (function (_super) {
            __extends(QuotedStringLiteralToken, _super);
            function QuotedStringLiteralToken(index, content) {
                _super.call(this, index, content, 2 /* QuotedStringLiteral */);
            }
            return QuotedStringLiteralToken;
        })(Parrot.Lexer.Token);
        Lexer.QuotedStringLiteralToken = QuotedStringLiteralToken;

        var StringLiteralPipeToken = (function (_super) {
            __extends(StringLiteralPipeToken, _super);
            function StringLiteralPipeToken(index, content) {
                _super.call(this, index, content, 14 /* StringLiteralPipe */);
            }
            return StringLiteralPipeToken;
        })(Parrot.Lexer.Token);
        Lexer.StringLiteralPipeToken = StringLiteralPipeToken;

        var PlusToken = (function (_super) {
            __extends(PlusToken, _super);
            function PlusToken(index) {
                _super.call(this, index, "+", 12 /* Plus */);
            }
            return PlusToken;
        })(Parrot.Lexer.Token);
        Lexer.PlusToken = PlusToken;

        var GreaterThanToken = (function (_super) {
            __extends(GreaterThanToken, _super);
            function GreaterThanToken(index) {
                _super.call(this, index, ">", 11 /* GreaterThan */);
            }
            return GreaterThanToken;
        })(Parrot.Lexer.Token);
        Lexer.GreaterThanToken = GreaterThanToken;

        var CloseParenthesisToken = (function (_super) {
            __extends(CloseParenthesisToken, _super);
            function CloseParenthesisToken(index) {
                _super.call(this, index, ")", 7 /* CloseParenthesis */);
            }
            return CloseParenthesisToken;
        })(Parrot.Lexer.Token);
        Lexer.CloseParenthesisToken = CloseParenthesisToken;

        var CloseBracesToken = (function (_super) {
            __extends(CloseBracesToken, _super);
            function CloseBracesToken(index) {
                _super.call(this, index, "}", 10 /* CloseBrace */);
            }
            return CloseBracesToken;
        })(Parrot.Lexer.Token);
        Lexer.CloseBracesToken = CloseBracesToken;

        var OpenBracesToken = (function (_super) {
            __extends(OpenBracesToken, _super);
            function OpenBracesToken(index) {
                _super.call(this, index, "{", 9 /* OpenBrace */);
            }
            return OpenBracesToken;
        })(Parrot.Lexer.Token);
        Lexer.OpenBracesToken = OpenBracesToken;

        var EqualToken = (function (_super) {
            __extends(EqualToken, _super);
            function EqualToken(index) {
                _super.call(this, index, "=", 18 /* Equal */);
            }
            return EqualToken;
        })(Parrot.Lexer.Token);
        Lexer.EqualToken = EqualToken;

        var CloseBracketToken = (function (_super) {
            __extends(CloseBracketToken, _super);
            function CloseBracketToken(index) {
                _super.call(this, index, "]", 5 /* CloseBracket */);
            }
            return CloseBracketToken;
        })(Parrot.Lexer.Token);
        Lexer.CloseBracketToken = CloseBracketToken;

        var OpenBracketToken = (function (_super) {
            __extends(OpenBracketToken, _super);
            function OpenBracketToken(index) {
                _super.call(this, index, "[", 4 /* OpenBracket */);
            }
            return OpenBracketToken;
        })(Parrot.Lexer.Token);
        Lexer.OpenBracketToken = OpenBracketToken;

        var OpenParenthesisToken = (function (_super) {
            __extends(OpenParenthesisToken, _super);
            function OpenParenthesisToken(index) {
                _super.call(this, index, "(", 6 /* OpenParenthesis */);
            }
            return OpenParenthesisToken;
        })(Parrot.Lexer.Token);
        Lexer.OpenParenthesisToken = OpenParenthesisToken;

        var CommaToken = (function (_super) {
            __extends(CommaToken, _super);
            function CommaToken(index) {
                _super.call(this, index, ",", 8 /* Comma */);
            }
            return CommaToken;
        })(Parrot.Lexer.Token);
        Lexer.CommaToken = CommaToken;

        var IdentifierToken = (function (_super) {
            __extends(IdentifierToken, _super);
            function IdentifierToken(index, content, type) {
                _super.call(this, index, content, type);
            }
            return IdentifierToken;
        })(Parrot.Lexer.Token);
        Lexer.IdentifierToken = IdentifierToken;

        var WhitespaceToken = (function (_super) {
            __extends(WhitespaceToken, _super);
            function WhitespaceToken(index, content, type) {
                _super.call(this, index, content, type);
            }
            return WhitespaceToken;
        })(Parrot.Lexer.Token);
        Lexer.WhitespaceToken = WhitespaceToken;
    })(Parrot.Lexer || (Parrot.Lexer = {}));
    var Lexer = Parrot.Lexer;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=tokens.js.map
