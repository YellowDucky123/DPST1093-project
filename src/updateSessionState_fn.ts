import HTTPError from 'http-errors';
import { QuizSessionAction, QuizSessionState, getState } from './dataStore';
import {initiateNextQuizSessionQuestion, generateCurrentQuizSessionFinalResults, endQuizSession, openQuizSessionQuestion, closeCurrentQuizSessionQuestion
    , generateCurrentQuizSessionQuestionResults, gotoQuizSessionQuestionAnswer, gotoQuizSessionFinalResults
} from './session'

// lets assume all the error checks for quiz and quizSessionId have been done and this is the helper function
export function updateSesionState(quizSessionId: number, newAction: QuizSessionAction) {
    // check if action is valid
    if (!(Object.values(QuizSessionAction).includes(newAction))) {
        throw HTTPError(400, 'Action does not exist');
    }
    // check if we can do this action?
    // TODO: write a helper function to get the current state
    const currentQuizSessionState = getState(quizSessionId);

    if(!actionAllowed(currentQuizSessionState, newAction)) {
        throw HTTPError(400, 'Action not permitted in current state');
    }

    // if an action is allowed, then proceed with action
    // make a switch statement that handles each action here
    switch(currentQuizSessionState) {
        case QuizSessionState.LOBBY:
            if (newAction === QuizSessionAction.NEXT_QUESTION) {
                // go to question countdown helper function
                // TODO :: write a helper function to start the next quiz session question 
                initiateNextQuizSessionQuestion(quizSessionId);
            } else if (newAction === QuizSessionAction.END){
                // TODO :: write a helper function to generate the final results 
                generateCurrentQuizSessionFinalResults(quizSessionId);
                // TODO :: write a helper function to end a quizSession
                endQuizSession(quizSessionId);
            } else {
                // unexpected action - shouldn't happen, makes the check above redundant
                return HTTPError(400, 'Action not permitted in current state');
            }
            break;
        case QuizSessionState.QUESTION_COUNTDOWN:
            if (newAction === QuizSessionAction.SKIP_COUNTDOWN) {
                // go to question countdown helper function
                // TODO :: write a helper function to skip the countdown and go to question open)
                openQuizSessionQuestion(quizSessionId);
            } else if (newAction === QuizSessionAction.END){
                // the question is open but hasn't gathered answers yet
                // we need to close the question, generate final results and end the session
                closeCurrentQuizSessionQuestion(quizSessionId);
                // TODO :: write a helper function to generate the final results 
                generateCurrentQuizSessionFinalResults(quizSessionId);
                // TODO :: write a helper function to end a quizSession
                endQuizSession(quizSessionId);
            } else {
                // unexpected action - shouldn't happen
                return HTTPError(400, 'Action not permitted in current state');
            }
            break;
        case QuizSessionState.QUESTION_OPEN:
            if (newAction === QuizSessionAction.GO_TO_ANSWER) {
                // close the question, generate results and go to answers
                // TODO :: write a helper function to close the question
                // TODO :: write a helper function to go to the answers
                closeCurrentQuizSessionQuestion(quizSessionId);
                generateCurrentQuizSessionQuestionResults(quizSessionId);
                gotoQuizSessionQuestionAnswer(quizSessionId);
            } else if (newAction === QuizSessionAction.END){
                // the question is open so some answers may have been gathered
                // we need to close the question, gather the results for this question, generate final results and end the session
                generateCurrentQuizSessionQuestionResults(quizSessionId);
                closeCurrentQuizSessionQuestion(quizSessionId);
                // TODO :: write a helper function to generate the final results 
                generateCurrentQuizSessionFinalResults(quizSessionId);
                // TODO :: write a helper function to end a quizSession
                endQuizSession(quizSessionId);
            } else {
                // unexpected action - shouldn't happen
                return HTTPError(400, 'Action not permitted in current state');
            }
            break;
        case QuizSessionState.QUESTION_CLOSE:
            // this may have been done as part of normal question operations, but just in case
            closeCurrentQuizSessionQuestion(quizSessionId);
            // generate results for current question
            generateCurrentQuizSessionQuestionResults(quizSessionId);
            if (newAction === QuizSessionAction.NEXT_QUESTION) {
                // go to question countdown helper function
                // TODO :: write a helper function to start the next quiz session question 
                initiateNextQuizSessionQuestion(quizSessionId);
            } else if (newAction === QuizSessionAction.GO_TO_ANSWER) {
                gotoQuizSessionQuestionAnswer(quizSessionId);
            } else if (newAction === QuizSessionAction.GO_TO_FINAL_RESULTS) {
                // generate and go to final results
                // TODO :: write a helper function to handle final results generation
                generateCurrentQuizSessionFinalResults(quizSessionId);
                // TODO :: write a helper function to go to final results
                gotoQuizSessionFinalResults(quizSessionId);
            } else if (newAction === QuizSessionAction.END){
                // question is close and results have been generated, just need final results
                // TODO :: write a helper function to handle final results generation
                generateCurrentQuizSessionFinalResults(quizSessionId);
                // TODO :: write a helper function to end a quizSession
                endQuizSession(quizSessionId);
            } else {
                // unexpected action - shouldn't happen, makes the check above redundant
                return HTTPError(400, 'Action not permitted in current state');
            }
            break;
        case QuizSessionState.ANSWER_SHOW:
            if (newAction === QuizSessionAction.NEXT_QUESTION) {
                // go to question countdown helper function
                // TODO :: write a helper function to start the next quiz session question 
                initiateNextQuizSessionQuestion(quizSessionId);
            } else if (newAction === QuizSessionAction.GO_TO_FINAL_RESULTS) {
                // generate and go to final results
                // TODO :: write a helper function to handle final results generation
                generateCurrentQuizSessionFinalResults(quizSessionId);
                // TODO :: write a helper function to go to final results
                gotoQuizSessionFinalResults(quizSessionId);
            } else if (newAction === QuizSessionAction.END){
                // question is closed and results have been generated, just need final results
                // TODO :: write a helper function to handle final results generation
                generateCurrentQuizSessionFinalResults(quizSessionId);
                // TODO :: write a helper function to end a quizSession
                endQuizSession(quizSessionId);
            } else {
                // unexpected action - shouldn't happen, makes the check above redundant
                return HTTPError(400, 'Action not permitted in current state');
            }
            break;
        case QuizSessionState.FINAL_RESULTS:
            if (newAction === QuizSessionAction.END){
                // all results have been collected
                endQuizSession(quizSessionId);
            } else {
                // unexpected action - shouldn't happen, makes the check above redundant
                return HTTPError(400, 'Action not permitted in current state');
            }
            break;
        case QuizSessionState.END:
            // nothing happens here
            break;
        default:
            console.log("invalid state");
            return HTTPError(400, 'Invalid State');
    }
    
}

function actionAllowed(currentQuizSessionState: QuizSessionState, newAction: QuizSessionAction) {
    switch(currentQuizSessionState) {
        case QuizSessionState.LOBBY:
            if (newAction === QuizSessionAction.SKIP_COUNTDOWN || newAction === QuizSessionAction.GO_TO_ANSWER || newAction === QuizSessionAction.GO_TO_FINAL_RESULTS) {
                return false;
            }
            break;
        case QuizSessionState.QUESTION_COUNTDOWN:
            if (newAction === QuizSessionAction.NEXT_QUESTION || newAction === QuizSessionAction.GO_TO_ANSWER || newAction === QuizSessionAction.GO_TO_FINAL_RESULTS) {
                return false;
            }
            break;
        case QuizSessionState.QUESTION_OPEN:
            if (newAction === QuizSessionAction.SKIP_COUNTDOWN || newAction === QuizSessionAction.NEXT_QUESTION || newAction === QuizSessionAction.GO_TO_FINAL_RESULTS) {
                return false;
            }
            break;
        case QuizSessionState.QUESTION_CLOSE:
            if (newAction === QuizSessionAction.SKIP_COUNTDOWN) {
                return false;
            }
            break;
        case QuizSessionState.ANSWER_SHOW:
            if (newAction === QuizSessionAction.SKIP_COUNTDOWN || newAction === QuizSessionAction.GO_TO_ANSWER) {
                return false;
            }
            break;
        case QuizSessionState.FINAL_RESULTS:
            if (newAction != QuizSessionAction.END) {
                return false;
            }
            break;
        case QuizSessionState.END:
            return false;
            break;
        default:
            console.log("wrong state!");
            return false;
    }
    
    return true;
}
