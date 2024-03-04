export type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export type MaybeClass<T extends {}> =
	| Constructor<T>
	| {
			default: Constructor<T>;
	  }
	| {
			[k: string]: Constructor<T>;
	  };
