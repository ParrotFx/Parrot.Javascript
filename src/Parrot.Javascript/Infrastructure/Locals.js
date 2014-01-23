var Parrot;
(function (Parrot) {
    (function (Infrastructure) {
        var Locals = (function () {
            function Locals(host) {
                this._host = host;

                //check for locals
                if (this._host["__locals"] != undefined && this._host["__locals"] != null) {
                    this._locals = this._host["__locals"];
                } else {
                    this._locals = [];
                }
            }
            Locals.prototype.push = function (value) {
                this._locals.push(value);
                this._host["__locals"] = this._locals;
            };

            Locals.prototype.pop = function () {
            };
            return Locals;
        })();
        Infrastructure.Locals = Locals;
    })(Parrot.Infrastructure || (Parrot.Infrastructure = {}));
    var Infrastructure = Parrot.Infrastructure;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=Locals.js.map
