// Do not delete this file
import { echo } from './echo.js';
import { clear } from './other.js';
// We will be using the Jest framework for our testing in this course. For more information and examples, go to https://jestjs.io/docs/getting-started

// This defines the Test Suite for all 'echo' related tests
describe('Test Echo', () => {
  
  // This defines the set-up that takes place before each test.
  // Usually this would be things like registering a user and retreiving the authUserId - or registering a user and creating a quiz.
  // for now, this example will just run a clear
  beforeEach(() => {
    clear();
  });

  // Similar to beforeEach, this defines what to do after each test. 
  // It is not really required for your tests in iteration 0, but might be useful for iteration 1.
  afterEach(() => {
    clear();
  });
  
  // Next you test normal operations of the function with some inputs and expected outputs.
  test('Test successful echo', () => {
    let result = echo('1');
    expect(result).toBe('1');
    result = echo('abc');
    expect(result).toBe('abc');
  });

  // Sometimes, you may need to test a lot of input output conditions at once. 
  // Instead of writing it out individually like the previous example
  //    you can write it out together with an array of objects using test.each()
  test.each([
    { input: '1', expected: '1' },
    { input: 'abc', expected: 'abc' },
  ])("echo('$input') => '$expected'", ({ input, expected }) => {
    expect(echo(input)).toEqual(expected);
  });


  // Next you test known error cases of the function with some incorrect input and expected error output.
  test('Test invalid echo', () => {
    expect(echo({ echo: 'echo' })).toMatchObject({ error: expect.any(String) });
  });
});