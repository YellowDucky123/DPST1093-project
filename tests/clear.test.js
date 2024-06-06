import { clear } from '../src/other.js'
import { adminAuthRegister } from '../src/auth.js'
import { getData } from '../src/dataStore.js'
import { adminQuizCreate } from '../src/quiz.js'

test('testing clear --- return value', () => {
    expect(clear()).toEqual({})
})

test('testing clear --- clean users', () => {
    adminAuthRegister("ell@163.com", "1111aaaa", "test1", "name1");
    adminAuthRegister("wi@163.com", "1111aaaa", "test2", "name2");
    expect(getData()).toEqual({users : {}, quizzes : {}})
})

test('testing clear --- clean quizzes', () => {
    let testUserId = adminAuthRegister("ell@163.com", "1111aaaa", "test1", "name1");
    adminQuizCreate(testUserId.authUserId, "test", "")
    expect(getData()).toEqual({users : {}, quizzes : {}})
})