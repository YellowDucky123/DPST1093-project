import { getData } from "./dataStore";
import { createId } from "./helpers";

export function listSessions(userId: number, quizId: number) {
    /*
    code
    */
    return {};
}

export function startSession(userId: number, quizId: number, autoStartNum: number) {
    let data = getData();
    let data_session = {
        id: createId(data.Sessions),
        autoStartNum: number,
        state : QuizSessionState,
        atQuestion : number,
        players: Player[],
        metadata: quiz,
        results: QuizSessionResults,
        messages: message[],
    }

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