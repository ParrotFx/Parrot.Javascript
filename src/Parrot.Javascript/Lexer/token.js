var Parrot;
(function (Parrot) {
    ///<reference path="./tokenType.ts" />
    (function (Lexer) {
        var Token = (function () {
            function Token(index, content, type) {
                this.Index = index;
                this.Content = content;
                this.Type = type;
            }
            return Token;
        })();
        Lexer.Token = Token;
    })(Parrot.Lexer || (Parrot.Lexer = {}));
    var Lexer = Parrot.Lexer;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=token.js.map
