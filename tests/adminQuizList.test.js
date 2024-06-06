import { adminQuizList } from "../src/quiz";
import { adminAuthRegister} from "../src/auth";
import { adminQuizCreate } from "../src/quiz";
import { getData } from "../src/dataStore";
import { clear } from "../src/other";
clear()
var idfor86 = adminAuthRegister("86@163.com", "1111aaaa", "sin", "zano");
var idfor721 = adminAuthRegister("721@163.com", "ciallo111", "ning", "ning");
var idforno = adminAuthRegister ("aaa@163.con", "11111aaa", "no", "quiz");

var quiz1for86 = adminQuizCreate(idfor86.authUserId, "1111", "");
var quiz2for86 = adminQuizCreate(idfor86.authUserId, "2222", "");
var quiz3for86 = adminQuizCreate(idfor86.authUserId, "3333", "");

var quiz1for721 = adminQuizCreate(idfor721.authUserId, "4444", "")
var quiz2for721 = adminQuizCreate(idfor721.authUserId, "5555", "")

var idfornoone = 1;
while (idfornoone === idfor721.authUserId && idfor86.authUserId === idfornoone && idforno.authUserId === idfornoone) idfornoone++;

test("no such a user", () => {
  expect(adminQuizList(idfornoone)).toEqual({ error: "can not find such a member" })
})

test("quizzes for the one have no quiz", () => {
  expect(adminQuizList(idforno.authUserId)).toEqual({ quizzes: [] });
})
test("quizzes for the one have lot of quizzes", () => {
  expect(adminQuizList(idfor86.authUserId)).toEqual({
    quizzes: [{
      name: "1111",
      quizId: quiz1for86.quizId
    },
    {
      name: "2222",
      quizId: quiz2for86.quizId
    },
    {
      name: "3333",
      quizId: quiz3for86.quizId
    }
    ]
  });
})
test("quizzes for the one have some quizzes", () => {
  expect(adminQuizList(idfor721.authUserId)).toEqual({
    quizzes: [{
      name: "4444",
      quizId: quiz1for721.quizId
    },
    {
      name: "5555",
      quizId: quiz2for721.quizId
    }
    ]
  });
})
