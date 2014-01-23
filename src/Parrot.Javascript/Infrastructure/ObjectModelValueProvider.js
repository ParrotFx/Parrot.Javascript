var Parrot;
(function (Parrot) {
    ///<reference path="../parser.ts" />
    ///<reference path="ValueTypeProvider.ts" />
    ///<reference path="exceptions.ts" />
    (function (Infrastructure) {
        var ObjectModelValueProvider = (function () {
            function ObjectModelValueProvider() {
                this.ValueTypeProvider = new Parrot.Infrastructure.ValueTypeProvider();
            }
            ObjectModelValueProvider.prototype.GetValue = function (host, model, type, property) {
                var valueType = type;
                if (valueType == null) {
                    var temp = this.GetValueType(property);
                    property = temp.Property;
                    valueType = temp.Type;
                }

                switch (valueType) {
                    case 0 /* StringLiteral */:
                    case 3 /* Keyword */:
                        return {
                            Value: property,
                            Result: true
                        };
                    case 2 /* Local */:
                        return {
                            Value: model,
                            Result: true
                        };
                    case 1 /* Property */:
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
            };

            ObjectModelValueProvider.prototype.GetModelProperty = function (model, property) {
                if (property != null) {
                    var stringProperty = property;
                    var parameters = stringProperty.split(".");

                    if (model == null && parameters.length != 1) {
                        throw new Parrot.Infrastructure.NullReferenceException(parameters[0]);
                    }

                    if (parameters[0].length > 0) {
                        for (var key in model) {
                            if (key == parameters[0]) {
                                var tempObject = model[key];
                                if (parameters.length == 1) {
                                    return {
                                        Value: tempObject,
                                        Result: true
                                    };
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
            };

            ObjectModelValueProvider.prototype.GetValueType = function (property) {
                if (property != null) {
                    var result = this.ValueTypeProvider.GetValue(property);
                    return {
                        Property: result.Value,
                        Type: result.Type
                    };
                }

                return {
                    Property: property,
                    Type: 3 /* Keyword */
                };
            };
            return ObjectModelValueProvider;
        })();
        Infrastructure.ObjectModelValueProvider = ObjectModelValueProvider;
    })(Parrot.Infrastructure || (Parrot.Infrastructure = {}));
    var Infrastructure = Parrot.Infrastructure;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=ObjectModelValueProvider.js.map
