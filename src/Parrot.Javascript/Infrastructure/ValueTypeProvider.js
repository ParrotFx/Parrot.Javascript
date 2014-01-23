var Parrot;
(function (Parrot) {
    ///<reference path="../parser.ts" />
    (function (Infrastructure) {
        var ValueTypeResult = (function () {
            function ValueTypeResult(type, value) {
                this.Type = type;
                this.Value = value;
            }
            return ValueTypeResult;
        })();
        Infrastructure.ValueTypeResult = ValueTypeResult;

        var ValueTypeProvider = (function () {
            function ValueTypeProvider() {
                this.keywordHandlers = [];
                this.keywordHandlers["this"] = function (s) {
                    return new ValueTypeResult(2 /* Local */, "this");
                };
                this.keywordHandlers["false"] = function (s) {
                    return new ValueTypeResult(2 /* Local */, false);
                };
                this.keywordHandlers["true"] = function (s) {
                    return new ValueTypeResult(2 /* Local */, true);
                };
                this.keywordHandlers["null"] = function (s) {
                    return new ValueTypeResult(2 /* Local */, null);
                };
            }
            ValueTypeProvider.prototype.GetValue = function (value) {
                var result = new ValueTypeResult(0 /* StringLiteral */, null);
                if (value == null) {
                    return result;
                }

                if (this.IsWrappedInQuotes(value)) {
                    result.Type = 0 /* StringLiteral */;
                    result.Value = value.substring(1, 1 + value.length - 2);
                } else {
                    if (this.keywordHandlers[value] != null) {
                        result = this.keywordHandlers[value](value);
                    } else {
                        result.Type = 1 /* Property */;
                        result.Value = value;
                    }
                }

                return result;
            };

            ValueTypeProvider.prototype.IsWrappedInQuotes = function (value) {
                return (this.StartsWith(value, "\"") || this.StartsWith(value, "'"));
            };

            ValueTypeProvider.prototype.StartsWith = function (source, value) {
                return source.length > 0 && source.charAt(0) == value;
            };
            return ValueTypeProvider;
        })();
        Infrastructure.ValueTypeProvider = ValueTypeProvider;
    })(Parrot.Infrastructure || (Parrot.Infrastructure = {}));
    var Infrastructure = Parrot.Infrastructure;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=ValueTypeProvider.js.map
