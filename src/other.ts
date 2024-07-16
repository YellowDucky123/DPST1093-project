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

export function initiateNextQuizSessionQuestion(quizSessionId: number) {
  /*
  code
  */

  return {}
}

export function generateCurrentQuizSessionFinalResults(quizSessionId: number) {
  /*
  code
  */

  return {}
}

export function endQuizSession(quizSessionId: number) {
  /*
  code
  */

  return {}
}

export function openQuizSessionQuestion(quizSessionId: number) {
  /*
  code
  */

  return {}
}

export function closeCurrentQuizSessionQuestion(quizSessionId: number) {
  /*
  code
  */

  return {}
}

export function generateCurrentQuizSessionQuestionResults(quizSessionId: number) {
  /*
  code
  */

  return {}  
}

export function gotoQuizSessionQuestionAnswer(quizSessionId: number) {
  /*
  code
  */

  return {} 
}

export function gotoQuizSessionFinalResults(quizSessionId: number) {
  /*
  code
  */

  return {} 
}