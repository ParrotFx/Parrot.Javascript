///<reference path="tokens.ts" />
module Parrot.Lexer {
    export class Tokenizer {
        _tokens: Token[];
        _currentIndex: number;
        _source: string;

        constructor(source: string) {
            this._source = source;
            this._currentIndex = 0;
        }

        private HasAvailableTokens(): boolean {
            return this._currentIndex < this._source.length;
        }

        private Peek(): string {
            var character = this._source.charAt(this._currentIndex);
            return character;
        }

        private Consume(): string {
            if (this._currentIndex >= this._source.length) {
                throw new EndOfStreamException();
            }

            var character = this._source.charAt(this._currentIndex);
            this._currentIndex++;
            return character;
        }

        private ConsumeIdentifier(): string {
            var identifier = "";
            var character = this.Peek();
            while (this.IsIdTail(character)) {
                this.Consume();
                identifier += character;
                character = this.Peek();
            }

            return identifier;
        }

        private ConsumeWhitespace(): string {
            var whitespace = "";
            var character = this.Peek();
            while (this.IsWhitespace(character)) {
                this.Consume();
                whitespace += character;
                character = this.Peek();
            }

            return whitespace;
        }

        private ConsumeUntilNewLineOrEndOfStream(): string {
            var result = "";
            var character = this.Peek();
            while (!this.IsNewLine(character)) {
                try {
                    this.Consume();
                    result += character;
                    character = this.Peek();
                } catch (EndOfStreamException) {
                    break;
                }
            }

            return result;
        }

        private ConsumeQuotedStringLiteral(quote: string): string {
            var result = this.Consume();;
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
        }

        private IsNewLine(character: string) {
            return character == "\r" || character == "\n"
        }

        private GetNextToken(): Token {
            if (this.HasAvailableTokens()) {
                var currentCharacter = this.Peek();

                if (this.IsIdentifierHead(currentCharacter)) {
                    var token = new IdentifierToken(this._currentIndex, this.ConsumeIdentifier(), TokenType.Identifier);
                    return token;
                }

                if (this.IsWhitespace(currentCharacter)) {
                    return new WhitespaceToken(this._currentIndex, this.ConsumeWhitespace(), TokenType.Whitespace);
                }

                switch (currentCharacter) {
                    case ',': //this is for the future
                        this.Consume();
                        return new CommaToken(this._currentIndex);
                    case '(': //parameter list start
                        this.Consume();
                        return new OpenParenthesisToken(this._currentIndex);
                    case ')': //parameter list end
                        this.Consume();
                        return new CloseParenthesisToken(this._currentIndex);
                    case '[': //attribute list start
                        this.Consume();
                        return new OpenBracketToken(this._currentIndex);
                    case ']': //attribute list end
                        this.Consume();
                        return new CloseBracketToken(this._currentIndex);
                    case '=': //attribute assignment, raw output
                        this.Consume();
                        return new EqualToken(this._currentIndex);
                    case '{': //child block start
                        this.Consume();
                        return new OpenBracesToken(this._currentIndex);
                    case '}': //child block end
                        this.Consume();
                        return new CloseBracesToken(this._currentIndex);
                    case '>': //child assignment
                        this.Consume();
                        return new GreaterThanToken(this._currentIndex);
                    case '+': //sibling assignment
                        this.Consume();
                        return new PlusToken(this._currentIndex);
                    case '|': //string literal pipe
                        return new StringLiteralPipeToken(this._currentIndex, this.ConsumeUntilNewLineOrEndOfStream());
                    case '"': //quoted string literal
                        return new QuotedStringLiteralToken(this._currentIndex, this.ConsumeQuotedStringLiteral("\""));
                    case '\'': //quoted string literal
                        return new QuotedStringLiteralToken(this._currentIndex, this.ConsumeQuotedStringLiteral("\'"));
                    case '@': //Encoded output
                        this.Consume();
                        return new AtToken(this._currentIndex);
                    case '^':
                        this.Consume();
                        return new CarotToken(this._currentIndex);
                    case '\0':
                        return null;
                    default:
                        throw new UnexpectedTokenException("Unexpected token: " + currentCharacter);
                }
            }

            return null;
        }

        private IsWhitespace(character: string): boolean {
            return character == "\r" || character == "\n" || character == " " || character == "\f" || character == "\t" || character == "\u000B";
        }

        private IsIdentifierHead(character: string): boolean {
            var isLetter = /[a-zA-Z]/;
            return character.match(isLetter) != null || character == "_" || character == "#" || character == ".";
        }

        private IsIdTail(character: string): boolean {
            var isNumber = /[0-9]/;
            return character.match(isNumber) != null || this.IsIdentifierHead(character) || character == ":" || character == "-";
        }

        private Tokenize(): Token[] {
            var token: Token;
            var _tokens: Token[] = [];
            while ((token = this.GetNextToken()) != null) {
                _tokens.push(token);
            }

            return _tokens;
        }

        public Tokens(): Token[] {
            return this.Tokenize();
        }
    }

    export class EndOfStreamException {
        private Message: string;
        constructor() {
            this.Message = "Unexpected end of stream";
        }
    }

    export class UnexpectedTokenException {
        private Message: string;
        constructor(message: string) {
            this.Message = message;
        }
    }
}