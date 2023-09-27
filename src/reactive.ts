import { ReactiveOptions, ReactiveSubscriber } from './types';

export const reactive = <T>(
  value: T,
  { middleware, shouldChange }: ReactiveOptions<T> = {}
) => {
  const subscribers = new Set<ReactiveSubscriber<T>>();

  const proxy = new Proxy(
    { value },
    {
      set(target, property, newValue: T) {
        if (property !== 'value') {
          return false;
        }

        let prev = target.value as T;
        let current = newValue;

        if (middleware) {
          current = middleware(prev, newValue);
        }

        if (shouldChange && !shouldChange?.(prev, current)) {
          return true;
        }

        target[property] = current;
        subscribers.forEach((subscriber) => subscriber(current));
        return true;
      },
    }
  );

  const subscribe = (subscriber: ReactiveSubscriber<T>) => {
    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
  };

  return (subscriber: ReactiveSubscriber<T>) => {
    return { proxy, unsubscribe: subscribe(subscriber) };
  };
};
