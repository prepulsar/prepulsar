import { reactive } from './reactive';
import { ReactiveOptions } from './types';

const subscriberMock = jest.fn();
const middlewareMock = jest.fn(
  (prev: number, newValue: number) => newValue * 2
);

describe('reactive', () => {
  it('should create a reactive object with an initial value', () => {
    const reactiveState = reactive(11);
    const subscription = reactiveState(subscriberMock);

    expect(subscription.proxy).toEqual({ value: 11 });
  });
  it('should create a reactive object with an initial value', () => {
    const reactiveState = reactive(11);
    const subscription = reactiveState(subscriberMock);

    expect(subscription.proxy).toEqual({ value: 11 });
  });

  it('should notify subscribers when the value changes', () => {
    const reactiveState = reactive(11);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 22;
    expect(subscriberMock).toHaveBeenCalledWith(22);
    expect(subscriberMock).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
  });

  it('should apply middleware function when provided', () => {
    const reactiveState = reactive(11, {
      middleware: middlewareMock,
    });

    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 33;

    expect(middlewareMock).toHaveBeenNthCalledWith(1, 11);
    expect(middlewareMock).toHaveBeenNthCalledWith(2, 33);
    expect(subscription.proxy).toEqual({ value: 33 });
  });

  it('should not update value if middleware returns false', () => {
    const reactiveState = reactive(11, {
      middleware: (prev: number, newValue: number) => 1
    });
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 22;
    expect(subscription.proxy).toEqual({ value: 1 });
  });

  it('should allow value change if shouldChange returns true', () => {
    const reactiveState = reactive(11, {
      shouldChange: () => true // Allow value change
    });
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 22;
    expect(subscription.proxy).toEqual({ value: 22 });
  });

  it('should not update value if shouldChange returns false', () => {
    const options: ReactiveOptions<number> = {
      shouldChange: () => false
    };
    const reactiveState = reactive(11, options);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 22;
    expect(subscription.proxy).toEqual({ value: 11 });
  });

  it('should unsubscribe a subscriber', () => {
    const reactiveState = reactive(11);
    const subscription = reactiveState(subscriberMock);

    subscription.proxy.value = 22;

    subscription.unsubscribe();
    subscription.proxy.value = 33;
    
    expect(subscription.proxy).toEqual({ value: 33 });
    expect(subscriberMock).toHaveBeenCalledTimes(1);
  });

  it('should not update the value if the key assignment is not performed on "value"', () => {
    const reactiveState = reactive(11);
    const subscription = reactiveState(subscriberMock);

    try {
      // @ts-ignore
      subscription.proxy.value1 = 22;
    } catch (error: any) {
      expect(subscription.proxy).toEqual({ value: 11 });
      expect(error.message).toBe("'set' on proxy: trap returned falsish for property 'value1'");
    }
  });
});
