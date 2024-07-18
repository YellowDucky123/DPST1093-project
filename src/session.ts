import { getData, getSessionData, message, Player, playerResults, QuizSession, QuizSessionResults, QuizSessionState, setData, setSessionData } from "./dataStore";
import { createId, quizIdValidator, quizOwnership, countSessionNotEnd } from "./helpers";
import HTTPError from 'http-errors';

export function listSessions(userId: number, quizId: number) {
    if(quizOwnership(userId, quizId) === false) {
        throw HTTPError(403, "You do not own this quiz");
    }

    const data = getData();
    let active: number[] = [];
    let inactive: number[] = [];

    for(const item in data.Sessions) {
        if(data.Sessions[item].metadata.quizId === quizId) {
            if(data.Sessions[item].state === QuizSessionState.END) {
                inactive.push(data.Sessions[item].id);
            } else {
                active.push(data.Sessions[item].id);
            }
        }
    }
    return {
        "activeSessions": active,
        "inactiveSessions": inactive
    };
}

function checkQuizQuestionEmpty(quizId: number) {
    const data = getData();
    if(data.quizzes[quizId].questions.length === 0) {
        return false;
    } else {
        return true;
    }
}

export function startSession(userId: number, quizId: number, autoStartNum: number) {
  if(autoStartNum > 50) {
    throw HTTPError(400, "autoStartNum is greater than 50");
  }
  if(countSessionNotEnd(quizId) >= 10) {
    throw HTTPError(400, "A maximum of 10 session can be exist");
  }
  if(checkQuizQuestionEmpty(quizId) === false) {
    throw HTTPError(400, "The quiz does not have any questions");
  }
  if(quizIdValidator(quizId) === false) {
    throw HTTPError(403, "Invalid quizId");
  }
  if(quizOwnership(userId, quizId) === false) {
    throw HTTPError(403, "You do not own this quiz");
  }
    const data = getData();

  const results: QuizSessionResults = {
    usersRankedbyScore: [],
    questionResults: []
  };

  const data_session: QuizSession = {
    id: createId(data.Sessions),
    autoStartNum: autoStartNum,
    state: QuizSessionState.LOBBY,
    atQuestion: 0,
    players: [],
    metadata: data.quizzes[quizId],
    results: results,
    messages: [],
    currentTimerId: 0
  };

  data.Sessions[data_session.id] = data_session;

  return {};
}

export function initiateNextQuizSessionQuestion(quizSessionId: number) {
  /*
    code Kei
    */
    let data = getData();
    data.Sessions[quizSessionId].atQuestion++;
    data.Sessions[quizSessionId].state = QuizSessionState.QUESTION_COUNTDOWN;
    const timerId = setTimeout(() => {openQuizSessionQuestion(quizSessionId)}, 3 * 1000);
    data.Sessions[quizSessionId].currentTimerId = timerId[Symbol.toPrimitive]();
    setData(data);

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
   let data = getData();
   clearTimeout(data.Sessions[quizSessionId].currentTimerId);
   data.Sessions[quizSessionId].state = QuizSessionState.END;

   setData(data);

  return {};
}

export function openQuizSessionQuestion(quizSessionId: number) {
  /*
    code Kelvin
    */
    let sesData = getSessionData();
    clearTimeout(sesData[quizSessionId].currentTimerId);
    sesData[quizSessionId].state = QuizSessionState.QUESTION_OPEN;
    sesData[quizSessionId].currentTimerId = setTimeout(() => closeCurrentQuizSessionQuestion(quizSessionId), sesData[quizSessionId].metadata.questions[sesData[quizSessionId].atQuestion - 1].duration * 1000)[Symbol.toPrimitive]()
    setSessionData(sesData);
  
    return {}
}
  
export function closeCurrentQuizSessionQuestion(quizSessionId: number) {
    /*
    code Kelvin
    */
   let sesData = getSessionData();
   clearTimeout(sesData[quizSessionId].currentTimerId);
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
