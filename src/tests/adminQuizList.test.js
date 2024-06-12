import { setData, getData } from "../dataStore";
import { adminQuizList } from "../quiz";

setData({
  users: {
    111: {
      name: "test",
      authUserId: 111,
      email: "aofaij@???.com",
      password: "1111",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0,
      quizzesUserHave: [111, 222, 333]
    },
    222: {
      name: "jest",
      authUserId: 222,
      email: "wq;pqoergn@???.com",
      password: "2222",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0,
      quizzesUserHave: []
    },
    444 : {
      name: "jest",
      authUserId: 444,
      email: "wq;woejgergn@???.com",
      password: "2222",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0,
      quizzesUserHave: [111, 222]
    }
  },
  quizzes: {
    111: {
      quizId: 111,
      name: "114514",
      timeCreated: 11,
      timeLastEdited: 11
    },
    222: {
      quizId: 222,
      name: "wpigjj",
      timeCreated: 11,
      timeLastEdited: 11
    },
    333: {
      quizId: 333,
      name: "wjldbv",
      timeCreated: 11,
      timeLastEdited: 11
    }
  }
})

test("no such a user", () => {
  expect(adminQuizList(333)).toEqual({ error: "can not find such a member" })
})

test("quizzes for the one have no quiz", () => {
  expect(adminQuizList(222)).toEqual({ quizzes: [] });
})
test("quizzes for the one have lot of quizzes", () => {
  expect(adminQuizList(111)).toEqual({
    quizzes: [{
      name: "114514",
      quizId: 111
    },
    {
      name: "wpigjj",
      quizId: 222
    },
    {
      name: "wjldbv",
      quizId: 333
    }
    ]
  });
})
test("quizzes for the one have some quizzes", () => {
  expect(adminQuizList(444)).toEqual({
    quizzes: [{
      name: "114514",
      quizId: 111
    },
    {
      name: "wpigjj",
      quizId: 222
    }
    ]
  });
})