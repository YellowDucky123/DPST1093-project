import { getData, getSessionData, message, Player, playerResults, QuizSession, QuizSessionResults, QuizSessionState, setSessionData } from "./dataStore";
import { createId } from "./helpers";

let timer;

export function listSessions(userId: number, quizId: number) {
  /*
    code
    */
  return {};
}

export function startSession(userId: number, quizId: number, autoStartNum: number) {
  const data = getData();

  const results: QuizSessionResults = {
    usersRankedbyScore: [],
    questionResults: []
  };

  const data_session: QuizSession = {
    id: createId(data.Sessions),
    autoStartNum: autoStartNum,
    state: QuizSessionState.LOBBY,
    atQuestion: 1,
    players: [],
    metadata: data.quizzes[quizId],
    results: results,
    messages: [],
  };

  data.Sessions[data_session.id] = data_session;

  return {};
}

export function initiateNextQuizSessionQuestion(quizSessionId: number) {
  /*
    code Kei
    */

  return {};
}

export function generateCurrentQuizSessionFinalResults(quizSessionId: number) {
  /*
    code Victor
    */

  return {};
}

export function endQuizSession(quizSessionId: number) {
  /*
    code Kei
    */

  return {};
}

export function openQuizSessionQuestion(quizSessionId: number) {
  /*
    code Kelvin
    */
    clearTimeout(timer);
    let sesData = getSessionData();
    sesData[quizSessionId].state = QuizSessionState.QUESTION_OPEN;
    setSessionData(sesData);
  
    return {}
  }
  
  export function closeCurrentQuizSessionQuestion(quizSessionId: number) {
    /*
    code Kelvin
    */
   let sesData = getSessionData();
   sesData[quizSessionId].state = QuizSessionState.QUESTION_CLOSE;
   setSessionData(sesData);
  
    return {}
  }
  
  export function generateCurrentQuizSessionQuestionResults(quizSessionId: number) {
    /*
    code Yuxuan
    */

  return {};
}

export function gotoQuizSessionQuestionAnswer(quizSessionId: number) {
  /*
    code Yuxuan
    */

  return {};
}

export function gotoQuizSessionFinalResults(quizSessionId: number) {
  /*
    code Victor
    */

  return {};
}
