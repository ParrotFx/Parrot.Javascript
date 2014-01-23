///<reference path="../parser.ts" />
///<reference path="ValueTypeProvider.ts" />
///<reference path="exceptions.ts" />
module Parrot.Infrastructure {
    export class ObjectModelValueProvider {
        private ValueTypeProvider: ValueTypeProvider;

        constructor() {
            this.ValueTypeProvider = new ValueTypeProvider();
        }

        public GetValue(host: any[], model: any, type: ValueType, property: any): { Value: any; Result: boolean } {
            var valueType = type;
            if (valueType == null) {
                var temp = this.GetValueType(property);
                property = temp.Property;
                valueType = temp.Type;
            }

            switch (valueType) {
                case ValueType.StringLiteral:
                case ValueType.Keyword:
                    return {
                        Value: property,
                        Result: true
                    };
                case ValueType.Local:
                    return {
                        Value: model,
                        Result: true
                    };
                case ValueType.Property:
                    if (model != null) {
                        var result = this.GetModelProperty(model, property);
                        if (result.Result == true) {
                            return result;
                        }
                    }

                    if (host != null) {
                        var result = this.GetModelProperty(host, property);
                        if (result.Result == true) {
                            return result;
                        }
                    }
                    break;
            }

            return {
                Value: null,
                Result: false
            };
        }

        private GetModelProperty(model: any, property: any): { Value: any; Result: boolean } {
            if (property != null) {
                var stringProperty = property;
                var parameters: string[] = stringProperty.split(".");

                if (model == null && parameters.length != 1) {
                    throw new NullReferenceException(parameters[0]);
                }

                if (parameters[0].length > 0) {
                    for (var key in model) {
                        if (key == parameters[0]) {
                            var tempObject = model[key];
                            if (parameters.length == 1) {
                            return {
                                    Value: tempObject,
                                    Result: true
                                }
                        }

                            return this.GetModelProperty(tempObject, parameters.slice(1).join("."));
                        }
                    }

                    if (model["__locals"] != undefined && model["__locals"] != null) {
                        var locals = model["__locals"];
                        for (var i = locals.Length - 1; i >= 0; i--) {
                            var local = locals[i];
                            var result = this.GetModelProperty(local, property);
                            if (result.Result == true) {
                                return result;
                            }
                        }
                    }
                } else {
                    return {
                        Value: model,
                        Result: true
                    };
                }
            }

            return {
                Value: null,
                Result: false
            };
        }

        private GetValueType(property: any): { Property: any; Type: ValueType } {
            if (property != null) {
                var result = this.ValueTypeProvider.GetValue(property);
                return {
                    Property: result.Value,
                    Type: result.Type
                };
            }

            return {
                Property: property,
                Type: ValueType.Keyword
            };
        }
    }
}