import * as fs from 'fs'
const dataStoreFile = "./src/dataStoreFile.json"
/////////////////////////////////////////////////////////////
///////////////////type definition start here////////////////
/////////////////////////////////////////////////////////////
export type Id = number;

///////////definition of type question
export type answer = {
  answerId : number,
  answer : string,
  colour : string,
  correct : boolean
}
export type question = {
  questionId : number,
  question : string,
  duration : number,
  points : 5,
  answers: answer[]
}
/////////definition of type question

///////////definition of type user
export type user = {
  name : string,
  nameFirst? : string,
  nameLast ? : string,
  authUserId : number,
  email : string,
  password : string,
  numSuccessfulLogins:  number,                 // This should be 0 at first
  numFailedPasswordsSinceLastLogin: number,     // This should be 0 at first
  quizzesUserHave : Id[],
  quizzesUserDeleted : Id[],
  pastPassword : string[],
}
///////////definition of type user

/////////definition of type quiz
export type quiz = {
  quizId : number,
  name : string,
  description? : string | undefined | null,
  timeCreated : number,
  timeLastEdited : number
  numQuizQuestion : number                    //this is used to count the num of questions.
  questions : question[]
};
/////////definition of type quiz

/////////definition of type users and quizzes
export type users = {
  [authUserId : number] : user;
}
export type quizzes = {
  [quizId : number] : quiz
};
/////////definition of type users and quizzes

/////////definition of type data, session, and tokenUserIdList
// export type data = { 
//   users : users,
//   quizzes : quizzes 
// };

export type tokenUserIdList = {
  [token : string] : number
}
export type data = { 
  users : users,
  quizzes : quizzes,
  quizzesDeleted : quizzes,
  tokenUserIdList : tokenUserIdList
};

///////////////////////////////////////////
let data : data  = {
  users : {},
  quizzes : {},
  quizzesDeleted : {},
  tokenUserIdList : {},
};
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
////DATA DEFINE FINISHED //////////////// DATA DEFINE FINISHED////
//////////////////////////////////////////////////////////////////
function isdata (data : any) : boolean{
  return true;
}
function setJSONbyDataStore() {
  fs.writeFileSync(dataStoreFile, JSON.stringify(data), "utf-8");
}
function setDataStorebyJSON() {
  let json = JSON.parse(fs.readFileSync(dataStoreFile, "utf-8"))
  if (isdata(json))
    data = json;
  return data;
}
function findUserIdByToken (Token : string) {  
  if (Token.length === 0) return NaN;
  if (data.tokenUserIdList[Token]) {
    return data.tokenUserIdList[Token];
  } else {
    return NaN;
  }
}
function getData() : data {
  return data;
}
// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData : data) {
  data = newData;
}
export {setDataStorebyJSON, setJSONbyDataStore, findUserIdByToken, getData, setData};