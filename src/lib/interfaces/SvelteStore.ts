declare type Subscriber<T> = (value: T) => void;
/** Unsubscribes from value updates. */
declare type Unsubscriber = () => void;
/** Callback to update a value. */
declare type Updater<T> = (value: T) => T;
/** Cleanup logic callback. */
declare type Invalidator<T> = (value?: T) => void;

export interface SvelteStore<T> {
  subscribe(run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber;

  set?(value: T): void;

  update?(updater: Updater<T>): void;
}

export interface VegemiteStore<T, M = any> extends SvelteStore<T> {
  on<K extends keyof M>(event: K | "*", handle: (state: T) => void);

  dispatch<K extends keyof M>(event: K | "*", updater?: Updater<T>);

  listen(subscriber: () => void);

  listen(event, subscriber: () => void);

  pick?<T>(path: string): SvelteStore<T>;

  get(): T;
}
