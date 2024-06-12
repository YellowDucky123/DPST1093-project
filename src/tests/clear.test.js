import { clear } from '../src/other.js'

test('testing clear', () => {
    expect(clear()).toEqual({
        users: {},
        quizzes: {}
    })
})