export type Constructor<T extends object = object> = new (...args: any[]) => T;

export type MaybeClass<T extends object> =
	| Constructor<T>
	| {
			default: Constructor<T>;
	  }
	| {
			[k: string]: Constructor<T>;
	  };
