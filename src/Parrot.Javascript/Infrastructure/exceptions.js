var Parrot;
(function (Parrot) {
    (function (Infrastructure) {
        var ArgumentException = (function () {
            function ArgumentException(argument) {
                this.Argument = argument;
            }
            return ArgumentException;
        })();
        Infrastructure.ArgumentException = ArgumentException;

        var NullReferenceException = (function () {
            function NullReferenceException(parameter) {
                this.Parameter = parameter;
            }
            return NullReferenceException;
        })();
        Infrastructure.NullReferenceException = NullReferenceException;
    })(Parrot.Infrastructure || (Parrot.Infrastructure = {}));
    var Infrastructure = Parrot.Infrastructure;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=exceptions.js.map
