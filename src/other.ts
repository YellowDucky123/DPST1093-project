import { setData } from './dataStore';

// clear the whole thing
export function clear() {
  const newData = {
    users: {},
    quizzes: {},
    quizzesDeleted: {},
    tokenUserIdList: {},
    Sessions: {},
    playerData: {}
  };

  setData(newData);
  return {};
}

export function initiateNextQuizSessionQuestion(quizSessionId) {
  /*
  code
  */

  return {}
}

export function generateCurrentQuizSessionFinalResults(quizSessionId) {
  /*
  code
  */

  return {}
}

export function endQuizSession(quizSessionId) {
  /*
  code
  */

  return {}
}

export function openQuizSessionQuestion(quizSessionId) {
  /*
  code
  */

  return {}
}

export function closeCurrentQuizSessionQuestion(quizSessionId) {
  /*
  code
  */

  return {}
}

export function generateCurrentQuizSessionQuestionResults(quizSessionId) {
  /*
  code
  */

  return {}  
}

export function gotoQuizSessionQuestionAnswer(quizSessionId) {
  /*
  code
  */

  return {} 
}

export function gotoQuizSessionFinalResults(quizSessionId) {
  /*
  code
  */

  return {} 
}