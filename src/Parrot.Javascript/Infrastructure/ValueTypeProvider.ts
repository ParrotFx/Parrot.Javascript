///<reference path="../parser.ts" />
module Parrot.Infrastructure {
    export class ValueTypeResult {
        Type: ValueType;
        Value: any;
        constructor(type: ValueType, value: any) {
            this.Type = type;
            this.Value = value;
        }
    }

    export class ValueTypeProvider {
        keywordHandlers: any[];

        constructor() {
            this.keywordHandlers = [];
            this.keywordHandlers["this"] = function (s) { return new ValueTypeResult(ValueType.Local, "this"); };
            this.keywordHandlers["false"] = function (s) { return new ValueTypeResult(ValueType.Local, false); };
            this.keywordHandlers["true"] = function (s) { return new ValueTypeResult(ValueType.Local, true); };
            this.keywordHandlers["null"] = function (s) { return new ValueTypeResult(ValueType.Local, null); };
        }

        public GetValue(value: string) {
            var result = new ValueTypeResult(ValueType.StringLiteral, null);
            if (value == null) {
                return result;
            }

            if (this.IsWrappedInQuotes(value)) {
                result.Type = ValueType.StringLiteral;
                result.Value = value.substring(1, 1 + value.length - 2);
            } else {
                if (this.keywordHandlers[value] != null) {
                    result = this.keywordHandlers[value](value);
                } else {
                    result.Type = ValueType.Property;
                    result.Value = value;
                }
            }

            return result;
        }

        private IsWrappedInQuotes(value: string): boolean {
            return (this.StartsWith(value, "\"") || this.StartsWith(value, "'"));
        }

        private StartsWith(source: string, value: string): boolean {
            return source.length > 0 && source.charAt(0) == value;
        }

    }
}