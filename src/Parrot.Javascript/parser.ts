///<reference path="stream.ts" />
///<reference path="parserError.ts" />
///<reference path="./lexer/tokenizer.ts" />
///<reference path="./lexer/tokentype.ts" />
module Parrot {
    export class ParrotDocument {
        public Errors: ParserError[];
        public Children: Statement[];

        constructor() {
            this.Errors = [];
            this.Children = [];
        }
    }

    export class Parser {
        public Errors: ParserError[];

        constructor() {
            this.Errors = [];
        }

        public Parse(stream: string) {
            try {
                var document = new ParrotDocument();
                var tokenizer = new Lexer.Tokenizer(stream);
                var tokens = tokenizer.Tokens();
                var tokenStream = new Stream(tokens);

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
        }

        private ParseStatementErrors(statement: Statement) {
            if (statement.Errors.length > 0) {
                for (var i in statement.Errors) {
                    var error = statement.Errors[i];
                    error.Index += statement.Index;
                    this.Errors.push(error);
                }
            }
        }

        private ParseStream(stream: Stream, callback) {
            while (stream.Peek() != null) {
                var token = stream.Peek();
                switch (token.Type) {
                    case Lexer.TokenType.StringLiteral:
                    case Lexer.TokenType.StringLiteralPipe:
                    case Lexer.TokenType.QuotedStringLiteral:
                    case Lexer.TokenType.Identifier:
                    case Lexer.TokenType.OpenBracket:
                    case Lexer.TokenType.OpenParenthesis:
                    case Lexer.TokenType.Equal:
                    case Lexer.TokenType.At:
                        var statement = this.ParseStatement(stream);
                        callback(statement);
                        break;
                    default:
                        this.Errors.push(new UnexpectedToken(token));
                        stream.Next();
                        break;
                    //throw new ParserException(token);
                }
            }
        }

        private ParseStatement(stream: Stream): Statement[] {
            var previousToken = stream.Peek();
            if (previousToken == null) {
                this.Errors.push(new EndOfStream());
                return [];
            }

            var tokenType = previousToken.Type;
            var identifier: Lexer.Token = null;

            switch (tokenType) {
                case Lexer.TokenType.Identifier:
                    //standard identifier
                    identifier = stream.Next();
                    break;
                case Lexer.TokenType.OpenBracket:
                case Lexer.TokenType.OpenParenthesis:
                    //ignore these
                    break;
                case Lexer.TokenType.StringLiteral:
                case Lexer.TokenType.StringLiteralPipe:
                case Lexer.TokenType.QuotedStringLiteral:
                    //string statement
                    identifier = stream.Next();
                    break;
                case Lexer.TokenType.At:
                    stream.NextNoReturn();
                    identifier = stream.Next();
                    break;
                case Lexer.TokenType.Equal:
                    stream.NextNoReturn();
                    identifier = stream.Next();
                    break;
                default:
                    this.Errors.push(new UnexpectedToken(previousToken));
                    return [];
                //throw new ParserException(stream.Peek());
            }

            var statement: Statement;
            var tail: StatementTail = null;

            var exit: boolean = false;

            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                if (token == null) {
                    break;
                }

                switch (token.Type) {
                    case Lexer.TokenType.OpenParenthesis:
                    case Lexer.TokenType.OpenBracket:
                    case Lexer.TokenType.OpenBrace:
                        tail = this.ParseStatementTail(stream);
                        break;
                    case Lexer.TokenType.GreaterThan:
                        stream.NextNoReturn();
                        tail = this.ParseSingleStatementTail(stream, tail);
                        break;
                    case Lexer.TokenType.StringLiteralPipe:
                        if (!(previousToken instanceof Lexer.StringLiteralPipeToken)) {
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

            var list: Statement[] = [];
            list.push(statement);

            while (stream.Peek() != null) {
                if (stream.Peek().Type == Lexer.TokenType.Plus) {
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

        }

        private GetStatementFromToken(identifier: Lexer.Token, tail: StatementTail, previousToken: Lexer.Token): Statement {

            var value = identifier != null ? identifier.Content : "";
            if (identifier != null) {
                switch (identifier.Type) {
                    case Lexer.TokenType.StringLiteral:
                    case Lexer.TokenType.QuotedStringLiteral:
                        return new StringLiteral(value, tail, identifier.Index);

                    case Lexer.TokenType.StringLiteralPipe:
                        return new StringLiteralPipe(value.substring(1), tail, identifier.Index);
                }
            }

            if (previousToken != null) {
                switch (previousToken.Type) {
                    case Lexer.TokenType.At:
                        return new EncodedOutput(value, null, previousToken.Index);
                    case Lexer.TokenType.Equal:
                        return new RawOutput(value, null, previousToken.Index);
                }
            }

            return new Statement(value, tail, identifier.Index);
        }

        private ParseSingleStatementTail(stream: Stream, tail: StatementTail) {
            var statementList = this.ParseStatement(stream);
            if (!tail) {
                tail = new StatementTail();
            }
            tail.Children = statementList;

            return tail;
        }

        private ParseStatementTail(stream: Stream) {
            var additional: any[] = new Array(3);

            var exit: boolean = false;

            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                switch (token.Type) {
                    case Lexer.TokenType.OpenParenthesis:
                        additional[1] = this.ParseParameters(stream);
                        break;
                    case Lexer.TokenType.OpenBracket:
                        additional[0] = this.ParseAttributes(stream);
                        break;
                    case Lexer.TokenType.GreaterThan:
                        additional[2] = this.ParseChild(stream);
                        break;
                    case Lexer.TokenType.OpenBrace:
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
        }

        private ParseChild(stream: Stream): Statement[] {
            var child: Statement[] = [];
            stream.NextNoReturn();

            var exit: boolean = false;

            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                if (token == null) { break; }

                var statements = this.ParseStatement(stream);
                for (var i in statements) {
                    child.push(statements[i]);
                }
                exit = true;
            }

            return child;
        }

        private ParseChildren(stream: Stream): Statement[] {
            var statements: Statement[] = [];

            stream.NextNoReturn();
            var exit: boolean = false;
            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                if (token == null) { break; }

                switch (token.Type) {
                    case Lexer.TokenType.Plus:
                        break;
                    case Lexer.TokenType.CloseBrace:
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
        }

        private ParseParameters(stream: Stream): Parameter[] {
            var list: Parameter[] = [];

            stream.NextNoReturn();

            var exit: boolean = false;

            while (stream.Peek() != null && !exit) {
                var token = stream.Peek();
                if (token == null) { break; }

                switch (token.Type) {
                    case Lexer.TokenType.Identifier:
                    case Lexer.TokenType.QuotedStringLiteral:
                    case Lexer.TokenType.StringLiteralPipe:
                        list.push(this.ParseParameter(stream));
                        break;
                    case Lexer.TokenType.Comma:
                        //another parameter - consume this
                        stream.NextNoReturn();
                        break;
                    case Lexer.TokenType.CloseParenthesis:
                        //consume close parenthesis
                        stream.NextNoReturn();
                        exit = true;
                        break;
                    default:
                        //read until )
                        this.Errors.push(new UnexpectedToken(token));
                        return list;
                    //throw new ParserException(token);
                }
            }

            return list;
        }

        private ParseParameter(stream: Stream): Parameter {
            var identifier = stream.Next();
            switch (identifier.Type) {
                case Lexer.TokenType.StringLiteralPipe:
                case Lexer.TokenType.QuotedStringLiteral:
                case Lexer.TokenType.StringLiteral:
                case Lexer.TokenType.Identifier:
                    break;
                default:
                    //invalid token
                    this.Errors.push(new UnexpectedToken(identifier));
                    //throw new ParserException(identifier);
                    return null;
            }

            //reduction
            return new Parameter(identifier.Content);
        }

        private ParseAttributes(stream: Stream): Attribute[] {

            stream.Next();

            var attributes: Attribute[] = [];

            var token: Lexer.Token = null;

            var exit: boolean = false;

            while (stream.Peek() != null && !exit) {
                token = stream.Peek();
                if (token == null) { break; }

                switch (token.Type) {
                    case Lexer.TokenType.Identifier:
                        attributes.push(this.ParseAttribute(stream));
                        break;
                    case Lexer.TokenType.CloseBracket:
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
        }

        private ParseAttribute(stream: Stream): Attribute {
            var identifier = stream.Next();
            var equalsToken: Lexer.Token = stream.Peek();
            if (equalsToken != null && equalsToken.Type == Lexer.TokenType.Equal) {
                stream.NextNoReturn();
                var valueToken: Lexer.Token = stream.Peek();
                if (valueToken == null) {
                    //TODO: Errors.Add(stream.Next());
                    this.Errors.push(new UnexpectedToken(identifier));
                    return new Attribute(identifier.Content, null);
                    //throw new ParserException(string.Format("Unexpected end of stream"));
                }

                if (valueToken.Type == Lexer.TokenType.CloseBracket) {
                    //then it's an invalid declaration
                    this.Errors.push(new AttributeValueMissing(valueToken.Index));
                }

                var value: Statement = this.ParseStatement(stream)[0];
                //force this as an attribute type
                if (value == null) {
                }
                else {
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
        }
    }

    export class AttributeValueMissing extends ParserError {
        constructor(index: number) {
            super();
            this.Index = index;
            this.Message = "Attribute must have a value";
        }
    }

    export class AttributeIdentifierMissing extends ParserError {
        constructor(index: number) {
            super();
            this.Index = index;
            this.Message = "Invalid attribute name";
        }
    }

    export class EndOfStream extends ParserError {
        constructor() {
            super();
            this.Message = "Unexpected end of file.";
        }
    }

    export class UnexpectedToken extends ParserError {
        Type: Lexer.TokenType;
        Token: string;

        constructor(token: Lexer.Token) {
            super();
            this.Type = token.Type;
            this.Token = token.Content;
            this.Index = token.Index;

            this.Message = "Unexpected token: " + this.Type;
        }
    }

    export class Statement {
        public Name: string;
        public Parameters: Parameter[];
        public Attributes: Attribute[];
        public Children: Statement[];
        public Index: number;
        public Length: number;
        public IdentifierParts: Identifier[];
        public Errors: ParserError[];

        constructor(name: string, tail: StatementTail, index: number) {
            this.Index = index;
            this.Parameters = [];
            this.Attributes = [];
            this.Children = [];
            this.IdentifierParts = [];
            this.Errors = [];
            this.Name = null;

            var container = this;

            if (this.IndexOfAny(name, [".", "#", ":"]) > -1) {
                this.GetIdentifierParts(name, function (part: Identifier) {
                    switch (part.Type) {
                        case IdentifierType.Id:
                            if (part.Name.length == 0) {
                                container.Errors.push(new MissingIdDeclaration(part.Index - 1, 1));
                            } else if (container.AnyAttributes(function (a) { return a.Key == "id"; })) {
                                container.Errors.push(new MultipleIdDeclarations(part.Name, part.Index - 1, part.Name.length + 1));
                            } else {
                                var literal = new StringLiteral("\"" + part.Name + "\"", null, 0);
                                container.AddAttribute(new Attribute("id", literal));
                            }
                            break;
                        case IdentifierType.Class:
                            if (part.Name.length == 0) {
                                container.Errors.push(new MissingClassDeclaration(1, 1));
                            } else {
                                var literal = new StringLiteral("\"" + part.Name + "\"", null, 0);
                                container.AddAttribute(new Attribute("class", literal));
                            }
                            break;
                        case IdentifierType.Type:
                            var literal = new StringLiteral("\"" + part.Name + "\"", null, 0);
                            container.AddAttribute(new Attribute("type", literal));
                            break;
                        case IdentifierType.Literal:
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

        private AnyAttributes(callback) {
            for (var i in this.Attributes) {
                if (callback(this.Attributes[i])) {
                    return true;
                }
            }

            return false;
        }

        private ParseStatementTail(tail: StatementTail) {
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
        }

        private AddAttribute(node: Attribute) {
            this.Attributes.push(node);
        }

        private IdentifierTypeFromCharacter(character: string, currentType: IdentifierType): IdentifierType {

            switch (character) {
                case ":":
                    return IdentifierType.Type;
                case "#":
                    return IdentifierType.Id;
                case ".":
                    return IdentifierType.Class;
            }

            return currentType;
        }

        private GetIdentifierParts(source: string, callback) {
            var index = 0;
            var partType: IdentifierType = IdentifierType.Literal;
            var nextType: IdentifierType = IdentifierType.None;

            for (var i = 0; i < source.length; i++) {
                nextType = this.IdentifierTypeFromCharacter(source.charAt(i), nextType);

                if (nextType != IdentifierType.None) {
                    var identifier = new Identifier();
                    identifier.Name = source.substring(index, index + (i - index));
                    identifier.Type = partType;
                    identifier.Index = index;
                    identifier.Length = i - index;

                    callback(identifier);

                    index = i + 1;
                    partType = nextType;
                    nextType = IdentifierType.None;
                }
            }

            var identifier = new Identifier();
            identifier.Name = source.substring(index);
            identifier.Type = partType;
            identifier.Index = index;

            callback(identifier);
        }

        private IndexOfAny(source: string, chars: string[]): number {
            for (var i in chars) {
                var index: number = source.indexOf(chars[i]);
                if (index != -1) {
                    return index;
                }
            }

            return -1;
        }
    }

    export class MissingIdDeclaration extends ParserError {
        constructor(index: number, length: number) {
            super();
            this.Index = index;
            this.Length = length;
            this.Message = "Missing Id declaration";
        }
    }

    export class MissingClassDeclaration extends ParserError {
        constructor(index: number, length: number) {
            super();
            this.Index = index;
            this.Length = length;
            this.Message = "Missing Class declaration";
        }
    }

    export class MultipleIdDeclarations extends ParserError {
        public Id: string;

        constructor(id: string, index: number, length: number) {
            super();
            this.Id = id;
            this.Index = index;
            this.Length = length;
            this.Message = "Element may not have more than one id";
        }
    }

    export class Parameter {
        public Value: string;
        public CalculatedValue: string;

        constructor(value: string) {
            this.Value = value;
            this.CalculatedValue = value;
        }

        public IsWrappedInQuotes(): boolean {
            return (this.StartsWith(this.Value, "\"") || this.StartsWith(this.Value, "'"));
        }

        private StartsWith(source: string, value: string): boolean {
            return source.length > 0 && source.charAt(0) == value;
        }

    }

    export class StatementTail {
        public Parameters: Parameter[];
        public Attributes: Attribute[];
        public Children: Statement[];
    }

    export class Attribute {
        public Key: string;
        public Value: Statement;

        constructor(key: string, value: Statement) {
            this.Key = key;
            this.Value = value;
        }
    }

    export class Identifier {
        Name: string;
        Index: number;
        Length: number;
        Type: IdentifierType;
    }

    export enum IdentifierType {
        Id,
        Class,
        Literal,
        Type,
        None
    }

    export enum ValueType {
        StringLiteral,
        Property,
        Local,
        Keyword
    }

    export enum StringLiteralPartType {
        Literal,
        Encoded,
        Raw
    }

    export class StringLiteralPart {
        public Data: string;
        public Type: StringLiteralPartType;
        public Index: number;
        public Length: number;

        constructor(type: StringLiteralPartType, data: string, index: number) {
            this.Type = type;
            this.Data = data;
            this.Index = index;
            this.Length = data.length;
        }
    }

    export class StringLiteral extends Statement {
        public Values: StringLiteralPart[];
        public ValueType: ValueType;

        constructor(value: string, tail: StatementTail, index: number) {
            super("string", tail, index);

            this.Values = [];
            this.ValueType = ValueType.StringLiteral;

            if (this.IsWrappedInQuotes(value)) {
                this.ValueType = ValueType.StringLiteral;
                value = value.substring(1, 1 + value.length - 2);
            } else if (value == "this") {
                this.ValueType = ValueType.Local;
            } else if (value == "null" || value == "true" || value == "false") {
                this.ValueType = ValueType.Keyword;
            } else {
                this.ValueType = ValueType.Property;
            }

            if (this.ValueType == ValueType.StringLiteral) {
                this.Values = this.Parse(value);
            }
        }

        private StartsWith(source: string, value: string): boolean {
            return source.length > 0 && source.charAt(0) == value;
        }

        private IsWrappedInQuotes(value: string): boolean {
            return (this.StartsWith(value, "\"") || this.StartsWith(value, "'"));
        }

        private Parse(source: string): StringLiteralPart[] {
            var parts: StringLiteralPart[] = [];
            var tempCounter: number = 0;
            var c: string[] = new Array(source.length);

            for (var i: number = 0; i < source.length; i++) {
                if (source.charAt(i) == "@" || source.charAt(i) == "=") {
                    var comparer: string = source.charAt(i);
                    var comparerType: StringLiteralPartType = (comparer == "@" ? StringLiteralPartType.Encoded : StringLiteralPartType.Raw);

                    i++;

                    if (source.charAt(Math.min(source.length - 1, i)) == comparer) {
                        c[tempCounter++] = comparer;
                    }
                    else if (this.IsIdentifierHead(source.charAt(i))) {
                        if (tempCounter > 0) {
                            parts.push(new StringLiteralPart(StringLiteralPartType.Literal, c.join(""), i - tempCounter));
                        }

                        tempCounter = 0;
                        var word: string = "";
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
                        }
                        else {
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
                parts.push(new StringLiteralPart(StringLiteralPartType.Literal, c.join(""), source.length - tempCounter));
            }

            return parts;
        }

        private IsIdentifierHead(character: string): boolean {
            var isLetter: RegExp = /[a-zA-Z]/;
            return character.match(isLetter) != null || character == "_" || character == "#" || character == ".";
        }

        private IsIdTail(character: string): boolean {
            var isNumber: RegExp = /[0-9]/;
            return character.match(isNumber) != null || this.IsIdentifierHead(character) || character == ":" || character == "-";
        }

    }

    export class StringLiteralPipe extends StringLiteral {
        constructor(value: string, tail: StatementTail, index: number) {
            super("\"" + value + "\"", tail, index);
        }
    }

    export class EncodedOutput extends StringLiteral {
        constructor(variableName: string, tail: StatementTail, index: number) {
            super("\"@" + variableName + "\"", tail, index);
        }
    }

    export class RawOutput extends StringLiteral {
        constructor(variableName: string, tail: StatementTail, index: number) {
            super("\"=" + variableName + "\"", tail, index);
        }
    }
}