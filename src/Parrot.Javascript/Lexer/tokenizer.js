var Parrot;
(function (Parrot) {
    ///<reference path="tokens.ts" />
    (function (Lexer) {
        var Tokenizer = (function () {
            function Tokenizer(source) {
                this._source = source;
                this._currentIndex = 0;
            }
            Tokenizer.prototype.HasAvailableTokens = function () {
                return this._currentIndex < this._source.length;
            };

            Tokenizer.prototype.Peek = function () {
                var character = this._source.charAt(this._currentIndex);
                return character;
            };

            Tokenizer.prototype.Consume = function () {
                if (this._currentIndex >= this._source.length) {
                    throw new EndOfStreamException();
                }

                var character = this._source.charAt(this._currentIndex);
                this._currentIndex++;
                return character;
            };

            Tokenizer.prototype.ConsumeIdentifier = function () {
                var identifier = "";
                var character = this.Peek();
                while (this.IsIdTail(character)) {
                    this.Consume();
                    identifier += character;
                    character = this.Peek();
                }

                return identifier;
            };

            Tokenizer.prototype.ConsumeWhitespace = function () {
                var whitespace = "";
                var character = this.Peek();
                while (this.IsWhitespace(character)) {
                    this.Consume();
                    whitespace += character;
                    character = this.Peek();
                }

                return whitespace;
            };

            Tokenizer.prototype.ConsumeUntilNewLineOrEndOfStream = function () {
                var result = "";
                var character = this.Peek();
                while (!this.IsNewLine(character)) {
                    try  {
                        this.Consume();
                        result += character;
                        character = this.Peek();
                    } catch (EndOfStreamException) {
                        break;
                    }
                }

                return result;
            };

            Tokenizer.prototype.ConsumeQuotedStringLiteral = function (quote) {
                var result = this.Consume();
                ;
                var character = this.Peek();
                while (true) {
                    while (character != quote) {
                        this.Consume();
                        result += character;
                        character = this.Peek();
                    }
                    result += this.Consume();
                    if (this.Peek() != quote) {
                        break;
                    }
                    this.Consume();
                    character = this.Peek();
                }

                //result += this.Consume();
                return result;
            };

            Tokenizer.prototype.IsNewLine = function (character) {
                return character == "\r" || character == "\n";
            };

            Tokenizer.prototype.GetNextToken = function () {
                if (this.HasAvailableTokens()) {
                    var currentCharacter = this.Peek();

                    if (this.IsIdentifierHead(currentCharacter)) {
                        var token = new Parrot.Lexer.IdentifierToken(this._currentIndex, this.ConsumeIdentifier(), 1 /* Identifier */);
                        return token;
                    }

                    if (this.IsWhitespace(currentCharacter)) {
                        return new Parrot.Lexer.WhitespaceToken(this._currentIndex, this.ConsumeWhitespace(), 13 /* Whitespace */);
                    }

                    switch (currentCharacter) {
                        case ',':
                            this.Consume();
                            return new Parrot.Lexer.CommaToken(this._currentIndex);
                        case '(':
                            this.Consume();
                            return new Parrot.Lexer.OpenParenthesisToken(this._currentIndex);
                        case ')':
                            this.Consume();
                            return new Parrot.Lexer.CloseParenthesisToken(this._currentIndex);
                        case '[':
                            this.Consume();
                            return new Parrot.Lexer.OpenBracketToken(this._currentIndex);
                        case ']':
                            this.Consume();
                            return new Parrot.Lexer.CloseBracketToken(this._currentIndex);
                        case '=':
                            this.Consume();
                            return new Parrot.Lexer.EqualToken(this._currentIndex);
                        case '{':
                            this.Consume();
                            return new Parrot.Lexer.OpenBracesToken(this._currentIndex);
                        case '}':
                            this.Consume();
                            return new Parrot.Lexer.CloseBracesToken(this._currentIndex);
                        case '>':
                            this.Consume();
                            return new Parrot.Lexer.GreaterThanToken(this._currentIndex);
                        case '+':
                            this.Consume();
                            return new Parrot.Lexer.PlusToken(this._currentIndex);
                        case '|':
                            return new Parrot.Lexer.StringLiteralPipeToken(this._currentIndex, this.ConsumeUntilNewLineOrEndOfStream());
                        case '"':
                            return new Parrot.Lexer.QuotedStringLiteralToken(this._currentIndex, this.ConsumeQuotedStringLiteral("\""));
                        case '\'':
                            return new Parrot.Lexer.QuotedStringLiteralToken(this._currentIndex, this.ConsumeQuotedStringLiteral("\'"));
                        case '@':
                            this.Consume();
                            return new Parrot.Lexer.AtToken(this._currentIndex);
                        case '\0':
                            return null;
                        default:
                            throw new UnexpectedTokenException("Unexpected token: " + currentCharacter);
                    }
                }

                return null;
            };

            Tokenizer.prototype.IsWhitespace = function (character) {
                return character == "\r" || character == "\n" || character == " " || character == "\f" || character == "\t" || character == "\u000B";
            };

            Tokenizer.prototype.IsIdentifierHead = function (character) {
                var isLetter = /[a-zA-Z]/;
                return character.match(isLetter) != null || character == "_" || character == "#" || character == ".";
            };

            Tokenizer.prototype.IsIdTail = function (character) {
                var isNumber = /[0-9]/;
                return character.match(isNumber) != null || this.IsIdentifierHead(character) || character == ":" || character == "-";
            };

            Tokenizer.prototype.Tokenize = function () {
                var token;
                var _tokens = [];
                while ((token = this.GetNextToken()) != null) {
                    _tokens.push(token);
                }

                return _tokens;
            };

            Tokenizer.prototype.Tokens = function () {
                return this.Tokenize();
            };
            return Tokenizer;
        })();
        Lexer.Tokenizer = Tokenizer;

        var EndOfStreamException = (function () {
            function EndOfStreamException() {
                this.Message = "Unexpected end of stream";
            }
            return EndOfStreamException;
        })();
        Lexer.EndOfStreamException = EndOfStreamException;

        var UnexpectedTokenException = (function () {
            function UnexpectedTokenException(message) {
                this.Message = message;
            }
            return UnexpectedTokenException;
        })();
        Lexer.UnexpectedTokenException = UnexpectedTokenException;
    })(Parrot.Lexer || (Parrot.Lexer = {}));
    var Lexer = Parrot.Lexer;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=tokenizer.js.map
