import * as fs from 'fs'
const dataStoreFile = "./src/dataStoreFile.json"
/////////////////////////////////////////////////////////////
///////////////////type definition start here////////////////
/////////////////////////////////////////////////////////////
export type Id = number;
function isId(id: any): boolean {
  if (id && typeof id === "number") {
    return true;
  }
  return false;
}
///////////definition of type question
export type answer = {
  answerId: number,
  answer: string,
  colour: string,
  correct: boolean
}
function isanswer(answer: any): boolean {
  if (answer.answerId && typeof answer.answerId === "number"
    && answer.answer && typeof answer.answer === "string" && answer.answer.length >= 1 && answer.answer.length <= 30
    && answer.colour && typeof answer.colour === "string"
    && answer.correct && typeof answer.correct === "boolean") {
    return true;
  }
  return false;
}
export type question = {
  questionId: number,
  question: string,
  duration: number,
  points: number,
  answers: answer[]
}
function isAnswers(answers: any): boolean {
  if (answers && Array.isArray(answers) && answers.every(isanswer)
    && answers.filter((answer) => (answer.correct === true))) {
    return true;
  }

  return false;
}
function isQuestion(question: any): boolean {
  if (question.questionId && typeof question.questionId === "number"
    && question.question && typeof question.question === "string" && question.question.length >= 5 && question.question.length <= 50
    && question.duration && typeof question.duration === "number" && question.duration > 0
    && question.points && typeof question.points === "number" && question.points > 0 && question.points <= 10
    && question.answers && Array.isArray(question.answers) && isAnswers(question.answers)) {
    return true;
  }
}
/////////definition of type question

///////////definition of type user
export type user = {
  name: string,
  nameFirst?: string,
  nameLast?: string,
  authUserId: number,
  email: string,
  password: string,
  numSuccessfulLogins: number,                 // This should be 0 at first
  numFailedPasswordsSinceLastLogin: number,     // This should be 0 at first
  quizzesUserHave: Id[],
  quizzesUserDeleted: Id[],
  pastPassword: string[],
}
function isUser(user: any): boolean {
  if (user.authUserId && typeof user.authUserId === "number"
    && user.email && typeof user.email === "string"
    && user.password && typeof user.password === "string"
    && user.name && typeof user.name === "string"
    && "numSuccessfulLogins" in user && typeof user.numSuccessfulLogins === "number"
    && "numFailedPasswordsSinceLastLogin" in user && typeof user.numFailedPasswordsSinceLastLogin === "number"
    && user.quizzesUserHave && Array.isArray(user.quizzesUserHave)
    && user.quizzesUserDeleted && Array.isArray(user.quizzesUserDeleted)
    && user.pastPassword && Array.isArray(user.pastPassword)) {
    return true;
  }
  console.log(typeof user.numFailedPasswordsSinceLastLogin)
  //console.log('user is not valid, which is \n' , user , '\n');
  return false;
}
///////////definition of type user

/////////definition of type quiz
export type quiz = {
  quizId: number,
  name: string,
  description?: string | undefined | null,
  timeCreated: number,
  timeLastEdited: number
  numQuizQuestion: number                    //this is used to count the num of questions.
  questions: question[]
};
function isQuestions(questions: any): boolean {
  if (questions.every(isQuestion)) return true;
  return false;
}
function isQuiz(quiz: any): boolean {
  if (quiz.quizId && typeof quiz.quizId === "number"
    && quiz.name && typeof quiz.name === "string"
    && quiz.timeCreated && typeof quiz.timeCreated === "number"
    && quiz.timeLastEdited && typeof quiz.timeLastEdited === "number"
    && quiz.numQuizQuestion && typeof quiz.numQuizQuestion === "number"
    && quiz.questions && Array.isArray(quiz.questions) && isQuestions(quiz.questions)
  ) {
    if ("description" in quiz && typeof quiz.description !== "string") return false;
    return true;
  }
  console.log("quiz is not valid, which is \n", quiz, "\n");
  return false;
}
/////////definition of type quiz

/////////definition of type users and quizzes
export type users = {
  [authUserId: number]: user;
}
function isUsers(users: any): boolean {
  for (let userId in users) {
    if (!isUser(users[userId])) {
      console.log("error in users");
      console.log()
      return false
    };
  }
  console.log("users check pass");
  return true;
}
export type quizzes = {
  [quizId: number]: quiz
};
function isQuizzes(quizzes: any): boolean {
  for (let quizId in quizzes) {
    if (!isQuiz(quizzes[quizId])) {
      console.log("error in quizzes");
      return false
    };
  }
  console.log("quizzes check pass");
  return true;
}
/////////definition of type users and quizzes

/////////definition of type data and tokenUserIdList
export type tokenUserIdList = {
  [token: string]: number
}
function isTokenUserIdList(tokenUserIdList: any): boolean {
  for (let token in tokenUserIdList) {
    if (!tokenUserIdList[token] || typeof tokenUserIdList[token] !== "number") {
      console.log("error in tokenUserIdList")
      return false;
    }
  }
  console.log("tokenUserIdList check pass");
  return true;
}
export type data = {
  users: users,
  quizzes: quizzes,
  quizzesDeleted: quizzes,
  tokenUserIdList: tokenUserIdList
};
function isdata(data: any): boolean {
  if (data.users && data.quizzes && data.quizzesDeleted && data.tokenUserIdList) {
    if (isUsers(data.users) && isQuizzes(data.quizzes) && isQuizzes(data.quizzesDeleted) && isTokenUserIdList(data.tokenUserIdList)) {
      console.log("data check pass");
      return true;
    }
  }
  return false;
}
///////////////////////////////////////////
let data: data = {
  users: {},
  quizzes: {},
  quizzesDeleted: {},
  tokenUserIdList: {},
};
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
////DATA DEFINE FINISHED //////////////// DATA DEFINE FINISHED////
//////////////////////////////////////////////////////////////////

function setJSONbyDataStore() {
  console.log(`saving data into ${dataStoreFile}, please wait.`)
  fs.writeFileSync(dataStoreFile, JSON.stringify(data), "utf-8");
}
function setDataStorebyJSON() {
  let json = JSON.parse(fs.readFileSync(dataStoreFile, "utf-8"))
  if (isdata(json)) {
    return data = json;
  }
  console.log("data store broken, please check it and fix it");
  throw "error in data store";
}
function findUserIdByToken(Token: string) {
  console.log("finding user id by token (from function 'findUserIdByToken')")
  if (Token.length === 0) return NaN;
  let data = getData();
  if (data.tokenUserIdList[Token]) {
    console.log("found success")
    return data.tokenUserIdList[Token];
  } else {
    console.log(`%cnot found the userId, ${Token} might not refer to an current logged user`, 'color : red;')
    return NaN;
  }
}

function findTokenByUserId(userId: number) {
  console.log("finding token by user id (from function 'findTokenByUserId')")
  const data = getData();
  const tokenList = Object.keys(data.tokenUserIdList);
  for (const [key, value] of Object.entries(data.tokenUserIdList)) {
    if (value === userId)
      return key;
  }
  return null;
}

function getData(): data {
  return data;
}
// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: data) {
  data = newData;
}

function checkDuplicateToken(token: string) {
  const data = getData();
  const tokenList = Object.keys(data.tokenUserIdList);
  for (const [key, value] of Object.entries(data.tokenUserIdList)) {
    if (key === token)
      return true;
  }
  return false;
}
export {
  setDataStorebyJSON,
  setJSONbyDataStore,
  findUserIdByToken,
  getData, setData,
  findTokenByUserId,
  checkDuplicateToken
};
