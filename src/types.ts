export type ReactiveMiddleware<T> = (oldValue: T, newValue: T) => T;

export type ShouldChange<T> = (oldValue: T, newValue: T) => boolean;

export type ReactiveSubscriber<T> = (value: T) => void;

export interface ReactiveOptions<T> {
  middleware?: ReactiveMiddleware<T>;
  shouldChange?: ShouldChange<T>;
}
