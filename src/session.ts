import { customAlphabet } from 'nanoid';
import { answer, getData, setData, getSessionData, message, Player, playerResults, question, questionResults, quiz, QuizSession, QuizSessionResults, QuizSessionState, Sessions, setSessionData, QuizSessionAction } from './dataStore';
import { createId, quizIdValidator, quizOwnership, countSessionNotEnd } from './helpers';
import HTTPError from 'http-errors';
import config from './config.json';
const path = config.url + ':' + config.port;
import * as fs from 'fs';
export function listSessions(userId: number, quizId: number) {
  if (quizOwnership(userId, quizId) === false) {
    throw HTTPError(403, 'You do not own this quiz');
  }

  const data = getData();
  const active: number[] = [];
  const inactive: number[] = [];

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
    activeSessions: active,
    inactiveSessions: inactive
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
  const data = getData();
  // error check
  if (!quizIdValidator(quizId)) throw HTTPError(403, 'Invalid quizId');
  if (!quizOwnership(userId, quizId)) throw HTTPError(403, 'You do not own this quiz');
  if (data.Sessions[sessionid] === undefined) throw HTTPError(400, 'Invalid sessionid');
  if (data.Sessions[sessionid].metadata.quizId !== quizId) throw HTTPError(400, 'Invalid sessionid');
  const Sessiondata = data.Sessions[sessionid];
  return {
    state: Sessiondata.state,
    atQuestion: Sessiondata.atQuestion,
    players: Sessiondata.players,
    metadata: getMetadata(quizId, Sessiondata.metadata)
  };
}
function getMetadata(quizid : number, metadata : quiz) {
  return {
    quizId: metadata.quizId,
    name: metadata.name,
    timeCreated: metadata.timeCreated,
    timeLastEdited: metadata.timeLastEdited,
    description: metadata.description ? metadata.description : undefined,
    numQuestions: metadata.questions.length,
    questions: getMetaQuestions(quizid, metadata.questions),
    thumbnailUrl: metadata.imgUrl,
    duration: getQuizDuration(metadata.questions)
  };
}
function getQuizDuration(questions : question[]) {
  let ans = 0;
  for (const question of questions) {
    ans += question.duration;
  }
  return ans;
}
function getMetaQuestions (quizid : number, metadata : question[]) {
  const ans = [];
  for (const question of metadata) {
    ans.push({
      questionId: question.questionId,
      question: question.question,
      duration: question.duration,
      thumbnailUrl: getData().quizzes[quizid].imgUrl,
      points: question.points,
      answers: getAnswers(question.answers),
      playerTime: question.playerTime
    });
  }
  return ans;
}
function getAnswers(answers : answer[]) {
  const ans: answer[] = [];
  for (const answer of answers) {
    ans.push({
      answerId: answer.answerId ? answer.answerId : answers.indexOf(answer),
      answer: answer.answer,
      colour: answer.colour ? answer.colour : 'black',
      correct: answer.correct
    });
  }
  return ans;
}

export function newPlayerJoinSession(sessionid : number, userName : string) {
  const data = getData();
  if (data.Sessions[sessionid] === undefined || data.Sessions[sessionid].state !== QuizSessionState.LOBBY) {
    throw HTTPError(400, 'Session does not exist or is not in lobby');
  }
  if (data.Sessions[sessionid].players.filter((player) => { player.name === userName; }).length !== 0) {
    throw HTTPError(400, 'userName has used');
  }
  const player : Player = {
    id: getNewPlayerId(),
    name: userName,
    sessionId: sessionid,
    questionAnswered: [],
    score: 0,
  };
  data.Sessions[sessionid].players.push(player);
  data.playerData[player.id] = player;
  setData(data);
  return { playerId: player.id };
}

function getNewPlayerId() {
  const data = getData();
  const nanoid = customAlphabet('0123456789', 5);
  let id = parseInt(nanoid());
  while (1) {
    if (data.playerData[id] === undefined) {
      return id;
    }
    id = parseInt(nanoid());
  }
}

export function getSessionResult(userId : number, quizId : number, sessionid : number) {
  const data = getData();
  // error check
  if (data.quizzes[quizId] === undefined) throw HTTPError(403, 'Invalid quizId');
  if (quizOwnership(userId, quizId)) throw HTTPError(403, 'You do not own this quiz');
  if (data.Sessions[sessionid] === undefined) throw HTTPError(400, 'Invalid sessionid');
  if (data.Sessions[sessionid].metadata.quizId !== quizId) throw HTTPError(400, 'Invalid sessionid');
  if (data.Sessions[sessionid].state !== QuizSessionState.FINAL_RESULTS) throw HTTPError(400, 'Game status error');
  return {
    usersRankedByScore: getUsersRankedByScore(data.Sessions[sessionid].results.usersRankedbyScore),
    questionResults: getQuestionResults(data.Sessions[sessionid].results.questionResults)
  };
}
export function getCSVFormatResult(userId : number, quizId : number, sessionid : number) {
  const data = getData();
  // error check
  if (data.quizzes[quizId] === undefined) throw HTTPError(403, 'Invalid quizId');
  if (quizOwnership(userId, quizId)) throw HTTPError(403, 'You do not own this quiz');
  if (data.Sessions[sessionid] === undefined) throw HTTPError(400, 'Invalid sessionid');
  if (data.Sessions[sessionid].metadata.quizId !== quizId) throw HTTPError(400, 'Invalid sessionid');
  if (data.Sessions[sessionid].state !== QuizSessionState.FINAL_RESULTS) throw HTTPError(400, 'Game status error');

  const CSVString = getCSVResult(data.Sessions[sessionid].players.concat(), data.Sessions[sessionid].results.questionResults);
  fs.writeFileSync(`./result/csv/${quizId}_${sessionid}.csv`, CSVString);
  return { url: path + '/v1/download/' + `${quizId}_${sessionid}.csv` };
}
function getCSVResult(players : Player[], questionResults : questionResults[]) : string {
  let ans = '';
  let header = 'player';
  let count = 1;
  for (count = 1; count < questionResults.length + 1; count++) {
    header += `,question${count}score,question${count}rank`;
  }
  players = players.sort((a, b) => a.name.localeCompare(b.name));
  const lines : {
    [userName : string] : {
      [question : number] : {
        rank : number,
        score : number
      }
    }
  } = {};
  for (const player of players) {
    lines[player.name] = {};
  }
  for (const questionResult of questionResults) {
    const questionid = questionResult.questionId;
    const playerAnsweredList = players.filter((a) => a.questionAnswered[questionid] !== undefined);
    const playerDurationList = playerAnsweredList
      .sort((a, b) => a.questionAnswered[questionid].duration - b.questionAnswered[questionid].duration);
    const sortedPlayersCorrectList = playerDurationList.filter((a) => questionResult.playersCorrectList.find((b) => b === a.name) !== undefined);
    const score = playerAnsweredList[0].questionAnswered[questionResult.questionId].points;
    for (const player of sortedPlayersCorrectList) {
      lines[player.name][questionResults.indexOf(questionResult)] = {
        rank: sortedPlayersCorrectList.indexOf(player) + 1,
        score: Math.round(score / (sortedPlayersCorrectList.indexOf(player) + 1) * 10) / 10
      };
    }
    for (const player in lines) {
      if (lines[player][questionResults.indexOf(questionResult)] === undefined) {
        if (playerAnsweredList.find((a) => a.name === player) !== undefined) {
          lines[player][questionResults.indexOf(questionResult)] = {
            rank: sortedPlayersCorrectList.length + 1,
            score: 0
          };
        } else {
          lines[player][questionResults.indexOf(questionResult)] = {
            rank: 0,
            score: 0
          };
        }
      }
    }
  }
  const linesToStrings = [];
  for (const player in lines) {
    let newString = `${player}`;
    for (const data in lines[player]) {
      newString += `,${lines[player][data].score},${lines[player][data].rank}`;
    }
    linesToStrings.push(newString);
  }
  ans = header + '\n' + linesToStrings.join('\n') + '\n' + 'X,Y,Z,...\nX,Y,Z,...\nX,Y,Z,...\n';
  return ans;
}
function getUsersRankedByScore(users : playerResults[]) {
  const ans: playerResults[] = [];
  for (const user of users) {
    ans.push({
      name: user.name,
      score: user.score ? user.score : 0,
    });
  }
  ans.sort((a, b) => b.score - a.score);
  return ans;
}
function getQuestionResults(questionResults : questionResults[]) {
  const ans: questionResults[] = [];
  for (const questionResult of questionResults) {
    ans.push({
      questionId: questionResult.questionId,
      playersCorrectList: questionResult.playersCorrectList,
      averageAnswerTime: questionResult.averageAnswerTime,
      percentCorrect: questionResult.percentCorrect
    });
  }
}
export function startSession(userId: number, quizId: number, autoStartNum: number) {
  if (autoStartNum > 50) {
    throw HTTPError(400, 'autoStartNum is greater than 50');
  }
  if (countSessionNotEnd(quizId) >= 10) {
    throw HTTPError(400, 'A maximum of 10 session can be exist');
  }
  if (checkQuizQuestionEmpty(quizId) === false) {
    throw HTTPError(400, 'The quiz does not have any questions');
  }
  if (quizIdValidator(quizId) === false) {
    throw HTTPError(403, 'Invalid quizId');
  }
  if (quizOwnership(userId, quizId) === false) {
    throw HTTPError(403, 'You do not own this quiz');
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

  return { sessionId: data_session.id };
}

export function initiateNextQuizSessionQuestion(quizSessionId: number) {
  /*
    code Kei
    */
  const data = getData();
  data.Sessions[quizSessionId].atQuestion++;
  data.Sessions[quizSessionId].state = QuizSessionState.QUESTION_COUNTDOWN;
  const timerId = setTimeout(() => { openQuizSessionQuestion(quizSessionId); }, 3 * 1000);
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
  const data = getData();
  const results = data.Sessions[quizSessionId].results;
  results.usersRankedbyScore = calculateRank(results.questionResults);
  setData(data);

  return results;
}

export function endQuizSession(quizSessionId: number) {
  /*
    code Kei
    */
  const data = getData();
  clearTimeout(data.Sessions[quizSessionId].currentTimerId);
  data.Sessions[quizSessionId].state = QuizSessionState.END;

  setData(data);

  return {};
}

export function openQuizSessionQuestion(quizSessionId: number) {
  /*
    code Kelvin
    */
  const sesData = getSessionData();
  clearTimeout(sesData[quizSessionId].currentTimerId);
  sesData[quizSessionId].state = QuizSessionState.QUESTION_OPEN;
  sesData[quizSessionId].currentTimerId = setTimeout(() => closeCurrentQuizSessionQuestion(quizSessionId), sesData[quizSessionId].metadata.questions[sesData[quizSessionId].atQuestion - 1].duration * 1000)[Symbol.toPrimitive]();
  setSessionData(sesData);

  return {};
}

export function closeCurrentQuizSessionQuestion(quizSessionId: number) {
  /*
    code Kelvin
    */
  const sesData = getSessionData();
  clearTimeout(sesData[quizSessionId].currentTimerId);
  sesData[quizSessionId].state = QuizSessionState.QUESTION_CLOSE;
  setSessionData(sesData);

  return {};
}

export function generateCurrentQuizSessionQuestionResults(quizSessionId: number) {
  /*
  code Yuxuan
  */
  const data = getData();
  const session = data.Sessions[quizSessionId];
  const correctAnswer = session.metadata.questions[session.atQuestion - 1].answers.filter((answer) => (answer.correct === true));
  const questionid = session.metadata.questions[session.atQuestion - 1].questionId;
  const players = session.players;

  const playersCorrectList = [];
  for (const player of players) {
    let answersid;
    for (const question of player.questionAnswered) {
      if (question.questionId === questionid) {
        answersid = question.answers.map((answer) => answer.answerId);
      }
    }
    let check = true;
    if (answersid === undefined) {
      check = false;
    } else if (answersid.length !== correctAnswer.length) {
      check = false;
    } else {
      for (const answer of correctAnswer) {
        if (answersid.filter((ans) => (ans !== answer.answerId)).length === 0) {
          check = false;
        }
      }
    }
    if (check) {
      playersCorrectList.push(player.name);
    }
  }
  let totaltime : number;
  Object.values(session.metadata.questions[questionid].playerTime).every(function (time) { totaltime += time.duration; });
  const averageAnswerTime = totaltime / Object.values(session.metadata.questions[questionid].playerTime).length;
  const percentCorrect = Math.round(playersCorrectList.length / players.length * 1000) / 10;
  session.results.questionResults.push({
    questionId: questionid,
    playersCorrectList: playersCorrectList,
    averageAnswerTime: averageAnswerTime,
    percentCorrect: percentCorrect
  });
  data.Sessions[questionid] = session;
  setData(data);
  return {};
}

export function gotoQuizSessionQuestionAnswer(quizSessionId: number) {
  /*
    code Yuxuan
    */
  const session = getSessionData();
  session[quizSessionId].state = QuizSessionState.ANSWER_SHOW;
  setSessionData(session);
  return {};
}

export function gotoQuizSessionFinalResults(quizSessionId: number) {
  /*
    code Victor
    */
  const data = getData();
  const quizSession = data.Sessions[quizSessionId];
  const finalResults = generateCurrentQuizSessionFinalResults(quizSessionId);
  quizSession.state = QuizSessionState.FINAL_RESULTS;
  setSessionData(data);
  return {
    quizSessionId: quizSessionId,
    finalResults: finalResults,
  };
}
