import { adminQuizList } from "../quiz";
import { adminAuthRegister} from "../auth";
import { adminQuizCreate } from "../quiz";
import { clear } from "../other";
clear()
var idfor86 = adminAuthRegister("86@163.com", "1111aaaa", "sin", "zano");
var idfor721 = adminAuthRegister("721@163.com", "ciallo111", "ning", "ning");
var idforno = adminAuthRegister ("aaa@163.con", "11111aaa", "no", "quiz");
if (typeof idfor721 === "boolean" || typeof idfor86 === "boolean" || typeof idforno === "boolean") throw "strange error"
if( "error" in idfor721 || "error" in idfor86 || "error" in idforno) throw "strange error"

var quiz1for86 = adminQuizCreate(idfor86.authUserId, "1111", "");
var quiz2for86 = adminQuizCreate(idfor86.authUserId, "2222", "");
var quiz3for86 = adminQuizCreate(idfor86.authUserId, "3333", "");

var quiz1for721 = adminQuizCreate(idfor721.authUserId, "4444", "")
var quiz2for721 = adminQuizCreate(idfor721.authUserId, "5555", "")
if (typeof quiz1for721 === "boolean" || typeof quiz1for86 === "boolean" || typeof quiz2for721 === "boolean" || typeof quiz2for86 === "boolean" || typeof quiz3for86 === "boolean")
if ("error" in quiz1for721 || "error" in quiz1for86 || "error" in quiz2for721 || "error" in quiz2for86 || "error" in quiz3for86) throw "error"
var idfornoone = 1;

while (idfornoone === idfor721.authUserId || idfor86.authUserId === idfornoone || idforno.authUserId === idfornoone) idfornoone++;

test("no such a user", () => {
  expect(adminQuizList(idfornoone)).toEqual({ error: "can not find such a member" })
})

test("quizzes for the one have no quiz", () => {
  if (typeof idforno === "boolean") throw "strange error"
  if("error" in idforno) throw "strange error"
  expect(adminQuizList(idforno.authUserId)).toEqual({ quizzes: [] });
})
test("quizzes for the one have lot of quizzes", () => {
  if (typeof idfor86 === "boolean") throw "strange error"
  if( "error" in idfor86 ) throw "strange error"
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
  if (typeof idfor721 === "boolean") throw "strange error"
  if ( "error" in idfor721 ) throw "strange error"
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
