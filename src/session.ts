import { getData, message, Player, playerResults, QuizSession, QuizSessionResults, QuizSessionState } from "./dataStore";
import { createId } from "./helpers";

export function listSessions(userId: number, quizId: number) {
    /*
    code
    */
    return {};
}

export function startSession(userId: number, quizId: number, autoStartNum: number) {
    let data = getData();

    const results: QuizSessionResults =  {
        usersRankedbyScore: [],
        questionResults: []
    };

    let data_session: QuizSession = {
        id: createId(data.Sessions),
        autoStartNum: autoStartNum,
        state : QuizSessionState.LOBBY,
        atQuestion : 1,
        players: [],
        metadata: data.quizzes[quizId],
        results: results,
        messages: [],
    }

    data.Sessions[data_session.id] = data_session;

    return {};
}

export function updateSessionState(userId: number, quizId: number, sessionId: number, action: string) {
    /*
    code
    */

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