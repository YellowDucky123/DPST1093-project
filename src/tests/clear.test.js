import { clear } from '../src/other.ts'
import { adminAuthRegister } from '../src/auth.ts'
import { getData } from '../src/dataStore.ts'
import { adminQuizCreate } from '../src/quiz.ts'

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