const CONTEXT_NOT_FOUND = (contextName: string) => `Context "${contextName}" does not exists.`;
const MISSING_CURRENT_CONTEXT = 'No context is set as current, please set a current context.';
export const NO_CONTEXTS_SAVED = `These are your options to specify in the CLI what Otto file should be used:
	- You can provide a path to the Otto file: otto <command> path/to/file/otto.yml
	- You can provide URL to the Otto file: otto <command> https://example.com/path/to/file/otto.yml
	- You can also pass a saved context that points to your Otto file: otto <command> context-name
	- In case you did not specify a context that you want to use, the CLI checks if there is a default context and uses it. To set default context run: otto config context use mycontext
	- In case you did not provide any reference to Otto file and there is no default context, the CLI detects if in your current working directory you have files like otto.json, otto.yaml, otto.yml. Just rename your file accordingly.
`;

class ContextError extends Error {
  constructor() {
    super();
    this.name = 'ContextError';
  }
}

export class MissingContextFileError extends ContextError {
  constructor() {
    super();
    this.message = NO_CONTEXTS_SAVED;
  }
}

export class MissingCurrentContextError extends ContextError {
  constructor() {
    super();
    this.message = MISSING_CURRENT_CONTEXT;
  }
}

export class ContextNotFound extends ContextError {
  constructor(contextName: string) {
    super();
    this.message = CONTEXT_NOT_FOUND(contextName);
  }
}
