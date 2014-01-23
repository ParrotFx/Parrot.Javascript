var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="stream.ts" />
///<reference path="parserError.ts" />
///<reference path="./lexer/tokenizer.ts" />
///<reference path="./lexer/tokentype.ts" />
var Parrot;
(function (Parrot) {
    var ParrotDocument = (function () {
        function ParrotDocument() {
            this.Errors = [];
            this.Children = [];
        }
        return ParrotDocument;
    })();
    Parrot.ParrotDocument = ParrotDocument;

    var Parser = (function () {
        function Parser() {
            this.Errors = [];
        }
        Parser.prototype.Parse = function (stream) {
            try  {
                var document = new ParrotDocument();
                var tokenizer = new Parrot.Lexer.Tokenizer(stream);
                var tokens = tokenizer.Tokens();
                var tokenStream = new Parrot.Stream(tokens);

                var parent = this;

                this.ParseStream(tokenStream, function (s) {
                    for (var i in s) {
                        parent.ParseStatementErrors(s[i]);
                        document.Children.push(s[i]);
                    }
                });
            } catch (e) {
                this.Errors.push(e);
            }
            document.Errors = this.Errors;

            return document;
        };

        Parser.prototype.ParseStatementErrors = function (statement) {
            if (statement.Errors.length > 0) {
                for (var i in statement.Errors) {
                    var error = statement.Errors[i];
                    error.Index += statement.Index;
                    this.Errors.push(error);
                }
            }
        };

        Parser.prototype.ParseStream = function (stream, callback) {
            while (stream.Peek() != null) {
                var token = stream.Peek();
                switch (token.Type) {
                    case 3 /* StringLiteral */:
                    case 14 /* StringLiteralPipe */:
                    case 2 /* QuotedStringLiteral */:
                    case 1 /* Identifier */:
                    case 4 /* OpenBracket */:
                    case 6 /* OpenParenthesis */:
                    case 18 /* Equal */:
                    case 19 /* At */:
                        var statement = this.ParseStatement(stream);
                        callback(statement);
                        break;
                    default:
                        this.Errors.push(new UnexpectedToken(token));
                        stream.Next();
                        break;
                }
            }
        };

        Parser.prototype.ParseStatement = function (stream) {
            var previousToken = stream.Peek();
            if (previousToken == null) {
                this.Errors.push(new EndOfStream());
                return [];
            }

            var tokenType = previousToken.Type;
            var identifier = null;

            switch (tokenType) {
                case 1 /* Identifier */:
                    //standard identifier
                    identifier = stream.Next();
                    break;
                case 4 /* OpenBracket */:
                case 6 /* OpenParenthesis */:
                    break;
                case 3 /* StringLiteral */:
                case 14 /* StringLiteralPipe */:
                case 2 /* QuotedStringLiteral */:
                    //string statement
                    identifier = stream.Next();
                    break;
                case 19 /* At */:
                    stream.NextNoReturn();
                    identifier = stream.Next();
                    break;
                case 18 /* Equal */:
                    stream.NextNoReturn();
                    identifier = stream.Next();
                    break;
                default:
                    this.Errors.push(new UnexpectedToken(previousToken));
                    return [];
            }

            var statement;
            var tail = null;

            var exit = false;

            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                if (token == null) {
                    break;
                }

                switch (token.Type) {
                    case 6 /* OpenParenthesis */:
                    case 4 /* OpenBracket */:
                    case 9 /* OpenBrace */:
                        tail = this.ParseStatementTail(stream);
                        break;
                    case 11 /* GreaterThan */:
                        stream.NextNoReturn();
                        tail = this.ParseSingleStatementTail(stream, tail);
                        break;
                    case 14 /* StringLiteralPipe */:
                        if (!(previousToken instanceof Parrot.Lexer.StringLiteralPipeToken)) {
                            tail = this.ParseSingleStatementTail(stream, tail);
                            break;
                        }
                    default:
                        this.GetStatementFromToken(identifier, tail, null);
                        exit = true;
                        break;
                }
            }
            statement = this.GetStatementFromToken(identifier, tail, previousToken);

            var list = [];
            list.push(statement);

            while (stream.Peek() != null) {
                if (stream.Peek().Type == 12 /* Plus */) {
                    stream.NextNoReturn();
                    var siblings = this.ParseStatement(stream);
                    for (var i in siblings) {
                        list.push(siblings[i]);
                    }
                } else {
                    break;
                }
            }

            return list;
        };

        Parser.prototype.GetStatementFromToken = function (identifier, tail, previousToken) {
            var value = identifier != null ? identifier.Content : "";
            if (identifier != null) {
                switch (identifier.Type) {
                    case 3 /* StringLiteral */:
                    case 2 /* QuotedStringLiteral */:
                        return new StringLiteral(value, tail, identifier.Index);

                    case 14 /* StringLiteralPipe */:
                        return new StringLiteralPipe(value.substring(1), tail, identifier.Index);
                }
            }

            if (previousToken != null) {
                switch (previousToken.Type) {
                    case 19 /* At */:
                        return new EncodedOutput(value, null, previousToken.Index);
                    case 18 /* Equal */:
                        return new RawOutput(value, null, previousToken.Index);
                }
            }

            return new Statement(value, tail, identifier.Index);
        };

        Parser.prototype.ParseSingleStatementTail = function (stream, tail) {
            var statementList = this.ParseStatement(stream);
            if (!tail) {
                tail = new StatementTail();
            }
            tail.Children = statementList;

            return tail;
        };

        Parser.prototype.ParseStatementTail = function (stream) {
            var additional = new Array(3);

            var exit = false;

            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                switch (token.Type) {
                    case 6 /* OpenParenthesis */:
                        additional[1] = this.ParseParameters(stream);
                        break;
                    case 4 /* OpenBracket */:
                        additional[0] = this.ParseAttributes(stream);
                        break;
                    case 11 /* GreaterThan */:
                        additional[2] = this.ParseChild(stream);
                        break;
                    case 9 /* OpenBrace */:
                        additional[2] = this.ParseChildren(stream);
                        exit = true;
                        break;
                    default:
                        exit = true;
                        break;
                }
            }

            var tail = new StatementTail();
            tail.Attributes = additional[0];
            tail.Parameters = additional[1];
            tail.Children = additional[2];

            return tail;
        };

        Parser.prototype.ParseChild = function (stream) {
            var child = [];
            stream.NextNoReturn();

            var exit = false;

            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                if (token == null) {
                    break;
                }

                var statements = this.ParseStatement(stream);
                for (var i in statements) {
                    child.push(statements[i]);
                }
                exit = true;
            }

            return child;
        };

        Parser.prototype.ParseChildren = function (stream) {
            var statements = [];

            stream.NextNoReturn();
            var exit = false;
            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                if (token == null) {
                    break;
                }

                switch (token.Type) {
                    case 12 /* Plus */:
                        break;
                    case 10 /* CloseBrace */:
                        stream.NextNoReturn();
                        exit = true;
                        break;
                    default:
                        var s = this.ParseStatement(stream);
                        for (var i in s) {
                            statements.push(s[i]);
                        }
                        break;
                }
            }

            return statements;
        };

        Parser.prototype.ParseParameters = function (stream) {
            var list = [];

            stream.NextNoReturn();

            var exit = false;

            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                if (token == null) {
                    break;
                }

                switch (token.Type) {
                    case 1 /* Identifier */:
                    case 2 /* QuotedStringLiteral */:
                    case 14 /* StringLiteralPipe */:
                        list.push(this.ParseParameter(stream));
                        break;
                    case 8 /* Comma */:
                        //another parameter - consume this
                        stream.NextNoReturn();
                        break;
                    case 7 /* CloseParenthesis */:
                        //consume close parenthesis
                        stream.NextNoReturn();
                        exit = true;
                        break;
                    default:
                        //read until )
                        this.Errors.push(new UnexpectedToken(token));
                        return list;
                }
            }

            return list;
        };

        Parser.prototype.ParseParameter = function (stream) {
            var identifier = stream.Next();
            switch (identifier.Type) {
                case 14 /* StringLiteralPipe */:
                case 2 /* QuotedStringLiteral */:
                case 3 /* StringLiteral */:
                case 1 /* Identifier */:
                    break;
                default:
                    //invalid token
                    this.Errors.push(new UnexpectedToken(identifier));

                    //throw new ParserException(identifier);
                    return null;
            }

            //reduction
            return new Parameter(identifier.Content);
        };

        Parser.prototype.ParseAttributes = function (stream) {
            stream.Next();

            var attributes = [];

            var token = null;

            var exit = false;

            while (stream.Peek() != null && !exit) {
                token = stream.Peek();
                if (token == null) {
                    break;
                }

                switch (token.Type) {
                    case 1 /* Identifier */:
                        attributes.push(this.ParseAttribute(stream));
                        break;
                    case 5 /* CloseBracket */:
                        //consume close bracket
                        stream.NextNoReturn();
                        exit = true;
                        break;
                    default:
                        //invalid token
                        this.Errors.push(new AttributeIdentifierMissing(token.Index));

                        //throw new ParserException(token);
                        exit = true;
                }
            }

            return attributes;
        };

        Parser.prototype.ParseAttribute = function (stream) {
            var identifier = stream.Next();
            var equalsToken = stream.Peek();
            if (equalsToken != null && equalsToken.Type == 18 /* Equal */) {
                stream.NextNoReturn();
                var valueToken = stream.Peek();
                if (valueToken == null) {
                    //TODO: Errors.Add(stream.Next());
                    this.Errors.push(new UnexpectedToken(identifier));
                    return new Attribute(identifier.Content, null);
                    //throw new ParserException(string.Format("Unexpected end of stream"));
                }

                if (valueToken.Type == 5 /* CloseBracket */) {
                    //then it's an invalid declaration
                    this.Errors.push(new AttributeValueMissing(valueToken.Index));
                }

                var value = this.ParseStatement(stream)[0];

                //force this as an attribute type
                if (value == null) {
                } else {
                    switch (value.Name) {
                        case "true":
                        case "false":
                        case "null":
                            value = new StringLiteral("\"" + value.Name + "\"", null, 0);
                            break;
                    }
                }

                //reduction
                return new Attribute(identifier.Content, value);
            }

            //single attribute only
            return new Attribute(identifier.Content, null);
        };
        return Parser;
    })();
    Parrot.Parser = Parser;

    var AttributeValueMissing = (function (_super) {
        __extends(AttributeValueMissing, _super);
        function AttributeValueMissing(index) {
            _super.call(this);
            this.Index = index;
            this.Message = "Attribute must have a value";
        }
        return AttributeValueMissing;
    })(Parrot.ParserError);
    Parrot.AttributeValueMissing = AttributeValueMissing;

    var AttributeIdentifierMissing = (function (_super) {
        __extends(AttributeIdentifierMissing, _super);
        function AttributeIdentifierMissing(index) {
            _super.call(this);
            this.Index = index;
            this.Message = "Invalid attribute name";
        }
        return AttributeIdentifierMissing;
    })(Parrot.ParserError);
    Parrot.AttributeIdentifierMissing = AttributeIdentifierMissing;

    var EndOfStream = (function (_super) {
        __extends(EndOfStream, _super);
        function EndOfStream() {
            _super.call(this);
            this.Message = "Unexpected end of file.";
        }
        return EndOfStream;
    })(Parrot.ParserError);
    Parrot.EndOfStream = EndOfStream;

    var UnexpectedToken = (function (_super) {
        __extends(UnexpectedToken, _super);
        function UnexpectedToken(token) {
            _super.call(this);
            this.Type = token.Type;
            this.Token = token.Content;
            this.Index = token.Index;

            this.Message = "Unexpected token: " + this.Type;
        }
        return UnexpectedToken;
    })(Parrot.ParserError);
    Parrot.UnexpectedToken = UnexpectedToken;

    var Statement = (function () {
        function Statement(name, tail, index) {
            this.Index = index;
            this.Parameters = [];
            this.Attributes = [];
            this.Children = [];
            this.IdentifierParts = [];
            this.Errors = [];
            this.Name = null;

            var container = this;

            if (this.IndexOfAny(name, [".", "#", ":"]) > -1) {
                this.GetIdentifierParts(name, function (part) {
                    switch (part.Type) {
                        case 0 /* Id */:
                            if (part.Name.length == 0) {
                                container.Errors.push(new MissingIdDeclaration(part.Index - 1, 1));
                            } else if (container.AnyAttributes(function (a) {
                                return a.Key == "id";
                            })) {
                                container.Errors.push(new MultipleIdDeclarations(part.Name, part.Index - 1, part.Name.length + 1));
                            } else {
                                var literal = new StringLiteral("\"" + part.Name + "\"", null, 0);
                                container.AddAttribute(new Attribute("id", literal));
                            }
                            break;
                        case 1 /* Class */:
                            if (part.Name.length == 0) {
                                container.Errors.push(new MissingClassDeclaration(1, 1));
                            } else {
                                var literal = new StringLiteral("\"" + part.Name + "\"", null, 0);
                                container.AddAttribute(new Attribute("class", literal));
                            }
                            break;
                        case 3 /* Type */:
                            var literal = new StringLiteral("\"" + part.Name + "\"", null, 0);
                            container.AddAttribute(new Attribute("type", literal));
                            break;
                        case 2 /* Literal */:
                            container.Name = part.Name ? part.Name : null;
                            break;
                    }

                    container.IdentifierParts.push(part);
                });
            } else {
                container.Name = name;
            }

            this.ParseStatementTail(tail);
        }
        Statement.prototype.AnyAttributes = function (callback) {
            for (var i in this.Attributes) {
                if (callback(this.Attributes[i])) {
                    return true;
                }
            }

            return false;
        };

        Statement.prototype.ParseStatementTail = function (tail) {
            if (tail != null) {
                if (tail.Parameters != null) {
                    this.Parameters = tail.Parameters;
                }

                if (tail.Attributes != null) {
                    for (var i in this.Attributes) {
                        tail.Attributes.push(this.Attributes[i]);
                    }

                    this.Attributes = tail.Attributes;
                }

                if (tail.Children != null) {
                    this.Children = tail.Children;
                }
            }
        };

        Statement.prototype.AddAttribute = function (node) {
            this.Attributes.push(node);
        };

        Statement.prototype.IdentifierTypeFromCharacter = function (character, currentType) {
            switch (character) {
                case ":":
                    return 3 /* Type */;
                case "#":
                    return 0 /* Id */;
                case ".":
                    return 1 /* Class */;
            }

            return currentType;
        };

        Statement.prototype.GetIdentifierParts = function (source, callback) {
            var index = 0;
            var partType = 2 /* Literal */;
            var nextType = 4 /* None */;

            for (var i = 0; i < source.length; i++) {
                nextType = this.IdentifierTypeFromCharacter(source.charAt(i), nextType);

                if (nextType != 4 /* None */) {
                    var identifier = new Identifier();
                    identifier.Name = source.substring(index, index + (i - index));
                    identifier.Type = partType;
                    identifier.Index = index;
                    identifier.Length = i - index;

                    callback(identifier);

                    index = i + 1;
                    partType = nextType;
                    nextType = 4 /* None */;
                }
            }

            var identifier = new Identifier();
            identifier.Name = source.substring(index);
            identifier.Type = partType;
            identifier.Index = index;

            callback(identifier);
        };

        Statement.prototype.IndexOfAny = function (source, chars) {
            for (var i in chars) {
                var index = source.indexOf(chars[i]);
                if (index != -1) {
                    return index;
                }
            }

            return -1;
        };
        return Statement;
    })();
    Parrot.Statement = Statement;

    var MissingIdDeclaration = (function (_super) {
        __extends(MissingIdDeclaration, _super);
        function MissingIdDeclaration(index, length) {
            _super.call(this);
            this.Index = index;
            this.Length = length;
            this.Message = "Missing Id declaration";
        }
        return MissingIdDeclaration;
    })(Parrot.ParserError);
    Parrot.MissingIdDeclaration = MissingIdDeclaration;

    var MissingClassDeclaration = (function (_super) {
        __extends(MissingClassDeclaration, _super);
        function MissingClassDeclaration(index, length) {
            _super.call(this);
            this.Index = index;
            this.Length = length;
            this.Message = "Missing Class declaration";
        }
        return MissingClassDeclaration;
    })(Parrot.ParserError);
    Parrot.MissingClassDeclaration = MissingClassDeclaration;

    var MultipleIdDeclarations = (function (_super) {
        __extends(MultipleIdDeclarations, _super);
        function MultipleIdDeclarations(id, index, length) {
            _super.call(this);
            this.Id = id;
            this.Index = index;
            this.Length = length;
            this.Message = "Element may not have more than one id";
        }
        return MultipleIdDeclarations;
    })(Parrot.ParserError);
    Parrot.MultipleIdDeclarations = MultipleIdDeclarations;

    var Parameter = (function () {
        function Parameter(value) {
            this.Value = value;
            this.CalculatedValue = value;
        }
        Parameter.prototype.IsWrappedInQuotes = function () {
            return (this.StartsWith(this.Value, "\"") || this.StartsWith(this.Value, "'"));
        };

        Parameter.prototype.StartsWith = function (source, value) {
            return source.length > 0 && source.charAt(0) == value;
        };
        return Parameter;
    })();
    Parrot.Parameter = Parameter;

    var StatementTail = (function () {
        function StatementTail() {
        }
        return StatementTail;
    })();
    Parrot.StatementTail = StatementTail;

    var Attribute = (function () {
        function Attribute(key, value) {
            this.Key = key;
            this.Value = value;
        }
        return Attribute;
    })();
    Parrot.Attribute = Attribute;

    var Identifier = (function () {
        function Identifier() {
        }
        return Identifier;
    })();
    Parrot.Identifier = Identifier;

    (function (IdentifierType) {
        IdentifierType[IdentifierType["Id"] = 0] = "Id";
        IdentifierType[IdentifierType["Class"] = 1] = "Class";
        IdentifierType[IdentifierType["Literal"] = 2] = "Literal";
        IdentifierType[IdentifierType["Type"] = 3] = "Type";
        IdentifierType[IdentifierType["None"] = 4] = "None";
    })(Parrot.IdentifierType || (Parrot.IdentifierType = {}));
    var IdentifierType = Parrot.IdentifierType;

    (function (ValueType) {
        ValueType[ValueType["StringLiteral"] = 0] = "StringLiteral";
        ValueType[ValueType["Property"] = 1] = "Property";
        ValueType[ValueType["Local"] = 2] = "Local";
        ValueType[ValueType["Keyword"] = 3] = "Keyword";
    })(Parrot.ValueType || (Parrot.ValueType = {}));
    var ValueType = Parrot.ValueType;

    (function (StringLiteralPartType) {
        StringLiteralPartType[StringLiteralPartType["Literal"] = 0] = "Literal";
        StringLiteralPartType[StringLiteralPartType["Encoded"] = 1] = "Encoded";
        StringLiteralPartType[StringLiteralPartType["Raw"] = 2] = "Raw";
    })(Parrot.StringLiteralPartType || (Parrot.StringLiteralPartType = {}));
    var StringLiteralPartType = Parrot.StringLiteralPartType;

    var StringLiteralPart = (function () {
        function StringLiteralPart(type, data, index) {
            this.Type = type;
            this.Data = data;
            this.Index = index;
            this.Length = data.length;
        }
        return StringLiteralPart;
    })();
    Parrot.StringLiteralPart = StringLiteralPart;

    var StringLiteral = (function (_super) {
        __extends(StringLiteral, _super);
        function StringLiteral(value, tail, index) {
            _super.call(this, "string", tail, index);

            this.Values = [];
            this.ValueType = 0 /* StringLiteral */;

            if (this.IsWrappedInQuotes(value)) {
                this.ValueType = 0 /* StringLiteral */;
                value = value.substring(1, 1 + value.length - 2);
            } else if (value == "this") {
                this.ValueType = 2 /* Local */;
            } else if (value == "null" || value == "true" || value == "false") {
                this.ValueType = 3 /* Keyword */;
            } else {
                this.ValueType = 1 /* Property */;
            }

            if (this.ValueType == 0 /* StringLiteral */) {
                this.Values = this.Parse(value);
            }
        }
        StringLiteral.prototype.StartsWith = function (source, value) {
            return source.length > 0 && source.charAt(0) == value;
        };

        StringLiteral.prototype.IsWrappedInQuotes = function (value) {
            return (this.StartsWith(value, "\"") || this.StartsWith(value, "'"));
        };

        StringLiteral.prototype.Parse = function (source) {
            var parts = [];
            var tempCounter = 0;
            var c = new Array(source.length);

            for (var i = 0; i < source.length; i++) {
                if (source.charAt(i) == "@" || source.charAt(i) == "=") {
                    var comparer = source.charAt(i);
                    var comparerType = (comparer == "@" ? 1 /* Encoded */ : 2 /* Raw */);

                    i++;

                    if (source.charAt(Math.min(source.length - 1, i)) == comparer) {
                        c[tempCounter++] = comparer;
                    } else if (this.IsIdentifierHead(source.charAt(i))) {
                        if (tempCounter > 0) {
                            parts.push(new StringLiteralPart(0 /* Literal */, c.join(""), i - tempCounter));
                        }

                        tempCounter = 0;
                        var word = "";
                        for (; i < source.length; i++, tempCounter++) {
                            if (!this.IsIdTail(source.charAt(i))) {
                                break;
                            }

                            word += source.charAt(i);
                        }

                        if (word.charAt(word.length - 1) == ".") {
                            word = word.substring(0, word.length - 1);
                            parts.push(new StringLiteralPart(comparerType, word, i - tempCounter));
                            tempCounter = 0;
                            c[tempCounter++] = ".";
                        } else {
                            parts.push(new StringLiteralPart(comparerType, word, i - tempCounter));
                            tempCounter = 0;
                        }

                        if (i < source.length) {
                            c[tempCounter++] = source.charAt(i);
                        }
                    } else {
                        c[tempCounter++] = comparer;
                        i -= 1;
                    }
                } else {
                    c[tempCounter++] = source.charAt(i);
                }
            }

            if (tempCounter > 0) {
                parts.push(new StringLiteralPart(0 /* Literal */, c.join(""), source.length - tempCounter));
            }

            return parts;
        };

        StringLiteral.prototype.IsIdentifierHead = function (character) {
            var isLetter = /[a-zA-Z]/;
            return character.match(isLetter) != null || character == "_" || character == "#" || character == ".";
        };

        StringLiteral.prototype.IsIdTail = function (character) {
            var isNumber = /[0-9]/;
            return character.match(isNumber) != null || this.IsIdentifierHead(character) || character == ":" || character == "-";
        };
        return StringLiteral;
    })(Statement);
    Parrot.StringLiteral = StringLiteral;

    var StringLiteralPipe = (function (_super) {
        __extends(StringLiteralPipe, _super);
        function StringLiteralPipe(value, tail, index) {
            _super.call(this, "\"" + value + "\"", tail, index);
        }
        return StringLiteralPipe;
    })(StringLiteral);
    Parrot.StringLiteralPipe = StringLiteralPipe;

    var EncodedOutput = (function (_super) {
        __extends(EncodedOutput, _super);
        function EncodedOutput(variableName, tail, index) {
            _super.call(this, "\"@" + variableName + "\"", tail, index);
        }
        return EncodedOutput;
    })(StringLiteral);
    Parrot.EncodedOutput = EncodedOutput;

    var RawOutput = (function (_super) {
        __extends(RawOutput, _super);
        function RawOutput(variableName, tail, index) {
            _super.call(this, "\"=" + variableName + "\"", tail, index);
        }
        return RawOutput;
    })(StringLiteral);
    Parrot.RawOutput = RawOutput;
})(Parrot || (Parrot = {}));
//# sourceMappingURL=parser.js.map
