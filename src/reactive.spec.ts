import { reactive } from './reactive';
import { ReactiveOptions } from './types';

const subscriberMock = jest.fn();
const middlewareMock = jest.fn((prev: number, newValue: number) => newValue * 2);

describe('reactive', () => {
  it('should create a reactive object with an initial value', () => {
    const reactiveState = reactive(42);
    const subscription = reactiveState(subscriberMock);

    expect(subscription.proxy).toEqual({ value: 42 });
  });

  it('should notify subscribers when the value changes', () => {
    const reactiveState = reactive(42);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 99;
    expect(subscriberMock).toHaveBeenCalledWith(99);
    expect(subscriberMock).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
  });

  it('should apply middleware function when provided', () => {
    const options: ReactiveOptions<number> = {
      middleware: middlewareMock,
    };
    const reactiveState = reactive(42, options);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 77;
    expect(middlewareMock).toHaveBeenCalledWith(42, 77);
    expect(subscription.proxy).toEqual({ value: 154 });
  });

  it('should not update value if middleware returns false', () => {
    const options: ReactiveOptions<number> = {
      middleware: (prev: number, newValue: number) => {
        return 1;
      },
    };
    const reactiveState = reactive(42, options);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 99;
    expect(subscription.proxy).toEqual({ value: 1 });
  });

  it('should allow value change if shouldChange returns true', () => {
    const options: ReactiveOptions<number> = {
      shouldChange(prev: number, newValue: number) {
        return true; // Allow value change
      },
    };
    const reactiveState = reactive(42, options);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 99;
    expect(subscription.proxy).toEqual({ value: 99 });
  });

  it('should not update value if shouldChange returns false', () => {
    const options: ReactiveOptions<number> = {
      shouldChange(prev: number, newValue: number) {
        return false;
      },
    };
    const reactiveState = reactive(42, options);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 99;
    expect(subscription.proxy).toEqual({ value: 42 });
  });

  it('should unsubscribe a subscriber', () => {
    const reactiveState = reactive(42);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 99;
    subscription.unsubscribe();

    subscription.proxy.value = 123;
    expect(subscriberMock).toHaveBeenCalledTimes(1);
  });
});