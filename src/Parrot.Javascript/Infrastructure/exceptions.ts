module Parrot.Infrastructure {
    export class ArgumentException {
        private Argument: string;
        constructor(argument: string) {
            this.Argument = argument;
        }
    }

    export class NullReferenceException {
        private Parameter: string;
        constructor(parameter: string) {
            this.Parameter = parameter;
        }
    }
}