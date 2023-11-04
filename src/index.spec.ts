import * as modules from '.';

it('should export all modules', () => {
    expect(Object.keys(modules)).toEqual(['reactive']);
});