/// <reference path="./lexer/token.ts"/>
/// <reference path="./lexer/tokenType.ts"/>
var Parrot;
(function (Parrot) {
    var Stream = (function () {
        function Stream(source) {
            this._list = source;
            this._count = source.length;
            this._index = -1;
        }
        Stream.prototype.Peek = function () {
            var temp = this._index + 1;
            while (temp < this._count) {
                if (this._list[temp].Type != 13 /* Whitespace */) {
                    return this._list[temp];
                }

                temp++;
            }

            return null;
        };

        Stream.prototype.GetNextNoReturn = function () {
            this._index++;
            while (this._index < this._count && this._list[this._index].Type == 13 /* Whitespace */) {
                this._index++;
            }
        };

        Stream.prototype.NextNoReturn = function () {
            this.GetNextNoReturn();
        };

        Stream.prototype.Next = function () {
            this._index++;
            while (this._index < this._count) {
                if (this._list[this._index].Type != 13 /* Whitespace */) {
                    return this._list[this._index];
                }

                this._index++;
            }

            return null;
        };
        return Stream;
    })();
    Parrot.Stream = Stream;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=stream.js.map
