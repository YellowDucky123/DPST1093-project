import { clear } from '../other'
import { adminAuthRegister } from '../auth'
import { getData } from '../dataStore'
import { adminQuizCreate } from '../quiz'

test('testing clear --- return value', () => {
    expect(clear()).toEqual({})
})

test('testing clear --- clean users', () => {
    adminAuthRegister("ell@163.com", "1111aaaa", "test1", "name1");
    adminAuthRegister("wi@163.com", "1111aaaa", "test2", "name2");
    expect(getData()).toEqual({users : {}, quizzes : {}, quizzesDeleted:{}, tokenUserIdList:{}})
})

test('testing clear --- clean quizzes', () => {
    let testUserId = adminAuthRegister("ell@163.com", "1111aaaa", "test1", "name1");
    adminQuizCreate(testUserId.authUserId, "test", "")
    expect(getData()).toEqual({users : {}, quizzes : {}, quizzesDeleted:{}, tokenUserIdList:{}})
})