import { answer, getData, getSessionData, message, Player, playerResults, question, questionResults, quiz, QuizSession, QuizSessionResults, QuizSessionState, Sessions, setSessionData } from "./dataStore";
import { createId, quizIdValidator, quizOwnership } from "./helpers";
import HTTPError from 'http-errors';

export function listSessions(userId: number, quizId: number) {
  if (quizOwnership(userId, quizId) === false) {
    throw HTTPError(403, "You do not own this quiz");
  }

  const data = getData();
  let active: number[] = [];
  let inactive: number[] = [];

  for (const item in data.Sessions) {
    if (data.Sessions[item].metadata.quizId === quizId) {
      if (data.Sessions[item].state === QuizSessionState.END) {
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
  if (data.quizzes[quizId].questions.length === 0) {
    return false;
  } else {
    return true;
  }
}
export function getSessionStatus(userId : number, quizId : number, sessionid : number) {
  let data = getData();
  // error check
  if (data.quizzes[quizId] === undefined) throw HTTPError(403, "Invalid quizId");
  if (!quizOwnership(userId, quizId)) throw HTTPError(403, "You do not own this quiz");
  if (data.Sessions[sessionid] === undefined) throw HTTPError(400, "Invalid sessionid");
  if (data.Sessions[sessionid].metadata.quizId !== quizId) throw HTTPError(400, "Invalid sessionid");
  let Sessiondata = data.Sessions[sessionid];
  return {
    state : Sessiondata.state,
    atQuestion : Sessiondata.atQuestion,
    players : Sessiondata.players,
    metadata : getMetadata(quizId, Sessiondata.metadata)
  }
}
function getMetadata(quizid : number, metadata : quiz) {
  return {
    quizId : metadata.quizId,
    name : metadata.name,
    timeCreated : metadata.timeCreated,
    timeLastEdited : metadata.timeLastEdited,
    description : metadata.description? metadata.description : undefined,
    numQuestions : metadata.questions.length,
    questions : getMetaQuestions(quizid, metadata.questions),
    thumbnailUrl : metadata.imgUrl,
    duration : getQuizDuration(metadata.questions)
  }
}
function getQuizDuration(questions : question[]) { 
  let ans = 0;
  for (const question of questions) {
    ans += question.duration;
  }
  return ans;
}
function getMetaQuestions (quizid : number, metadata : question[]) {
  let ans = [];
  for (const question of metadata) {
    ans.push({
      questionId : question.questionId,
      question : question.question,
      duration : question.duration, 
      thumbnailUrl : getData().quizzes[quizid].imgUrl,
      points : question.points,
      answers : getAnswers(question.answers)
    })
  }
  return ans;
}
function getAnswers(answers : answer[]) {
  let ans = [];
  for (const answer of answers) {
    ans.push({
      answerId : answer.answerId ? answer.answerId : answers.indexOf(answer),
      answer : answer.answer,
      colour : answer.colour ? answer.colour : "black",
      correct : answer.correct
    });
  }
  return ans;
}
export function getSessionResult(userId : number, quizId : number, sessionid : number) {
  let data = getData();
  // error check
  if (data.quizzes[quizId] === undefined) throw HTTPError(403, "Invalid quizId");
  if (quizOwnership(userId, quizId)) throw HTTPError(403, "You do not own this quiz");
  if (data.Sessions[sessionid] === undefined) throw HTTPError(400, "Invalid sessionid");
  if (data.Sessions[sessionid].metadata.quizId !== quizId) throw HTTPError(400, "Invalid sessionid");
  if (data.Sessions[sessionid].state !== QuizSessionState.FINAL_RESULTS) throw HTTPError (400, "Game status error");
  return {
    usersRankedByScore : getUsersRankedByScore(data.Sessions[sessionid].results.usersRankedbyScore),
    questionResults : getQuestionResults(data.Sessions[sessionid].results.questionResults)
  }
}
function getUsersRankedByScore(users : playerResults[]) {
  let ans = []
  for (const user of users) {
    ans.push({
      name : user.name,
      score : user.score ? user.score : 0,
    })
  }
  ans.sort((a,b) => b.score - a.score);
  return ans;
}
function getQuestionResults(questionResults : questionResults[]) {
  let ans = [];
  for (const questionResult of questionResults) {
    ans.push({
      questionId : questionResult.questionId,
      playersCorrectList : questionResult.playersCorrectList,
      averageAnswerTime : questionResult.averageAnswerTime,
      percentCorrect : questionResult.percentCorrect
    })
  }
}
export function startSession(userId: number, quizId: number, autoStartNum: number) {
  if (autoStartNum > 50) {
    throw HTTPError(400, "autoStartNum is greater than 50");
  }
  if (countSessionNotEnd(quizId) >= 10) {
    throw HTTPError(400, "A maximum of 10 session can be exist");
  }
  if (checkQuizQuestionEmpty(quizId) === false) {
    throw HTTPError(400, "The quiz does not have any questions");
  }
  if (quizIdValidator(quizId) === false) {
    throw HTTPError(403, "Invalid quizId");
  }
  if (quizOwnership(userId, quizId) === false) {
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

function calculateRank(questionResults: any[]) {
  return questionResults.sort((a, b) => b.score - a.score);
}
export function generateCurrentQuizSessionFinalResults(quizSessionId: number) {
  /*
    code Victor
    */
  let data = getData();
  const results = data.Sessions[quizSessionId].results
  results.usersRankedbyScore = calculateRank(results.questionResults)
  setData(data);

  return results;
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
  let data = getData();
  const quizSession = data.Sessions[quizSessionId];
  const finalResults = generateCurrentQuizSessionFinalResults(quizSessionId);
  quizSession.state = QuizSessionState.FINAL_RESULTS;
  setSessionData(data);
  return {
    quizSessionId: quizSessionId,
    finalResults: finalResults,
  };
}
