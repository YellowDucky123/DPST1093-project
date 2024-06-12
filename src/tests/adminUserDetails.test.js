import { adminUserDetails } from '../src/auth'
import { setData } from '../src/dataStore.js'
import { clear } from '../src/other.js'

clear();
setData({
  users: {
    111: {
      name: "test",
      authUserId: 111,
      email: "aofaij@???.com",
      password: "1111",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0,
      quizzesUserHave: []
    },
    222: {
      name: "jest",
      authUserId: 222,
      email: "wq;pqoergn@???.com",
      password: "2222",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0,
      quizzesUserHave: []
    }
  },
  quizzes: {
    111: {
      quizId: 111,
      name: "114514",
      timeCreated: 11,
      timeLastEdited: 11
    },
  }
})

test("no such a member", () => {
  expect(adminUserDetails(1)).toEqual({ error: "can not find such a member" });
})
test("get the detail of some one", () => {
  expect(adminUserDetails(111)).toEqual({
    user: {
      userId: 111,
      name: "test",
      email: "aofaij@???.com",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  })
})
test("get detail of another one", () => {
  expect(adminUserDetails(222)).toEqual({
    user: {
      userId: 222,
      name: "jest",
      email: "wq;pqoergn@???.com",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  })
})
test("get detail of another one", () => {
  expect(adminUserDetails(222)).toEqual({
    user: {
      userId: 222,
      name: "jest",
      email: "wq;pqoergn@???.com",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  })
})
