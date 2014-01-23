/// <reference path="./lexer/token.ts"/>
/// <reference path="./lexer/tokenType.ts"/>
module Parrot {
    export class Stream {
        private _list: Lexer.Token[];
        private _index: number;
        private _count: number;

        constructor(source: Lexer.Token[]) {
            this._list = source;
            this._count = source.length;
            this._index = -1;
        }

        public Peek(): Lexer.Token {
            var temp = this._index + 1;
            while (temp < this._count) {
                if (this._list[temp].Type != Lexer.TokenType.Whitespace) {
                    return this._list[temp];
                }

                temp++;
            }

            return null;
        }

        public GetNextNoReturn() {
            this._index++;
            while (this._index < this._count && this._list[this._index].Type == Lexer.TokenType.Whitespace) {
                this._index++;
            }
        }

        public NextNoReturn() {
            this.GetNextNoReturn();
        }

        public Next(): Lexer.Token {
            this._index++;
            while (this._index < this._count) {
                if (this._list[this._index].Type != Lexer.TokenType.Whitespace) {
                    return this._list[this._index];
                }

                this._index++;
            }

            return null;
        }
    }
}