///<reference path="./tokenType.ts" />
module Parrot.Lexer {
    export class Token {
        Type: TokenType;
        Content: string;
        Index: number;

        constructor(index: number, content: string, type: TokenType) {
            this.Index = index;
            this.Content = content;
            this.Type = type;
        }
    }
}