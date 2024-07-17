import { answer, getData, question, quiz, setData, getSessionData, getPlayerData, QuizSessionState, message } from './dataStore';
import { questionFinder, findAuthUserIdByEmail, userIdValidator, deletedQuizIdValidator, deletedQuizOwnership, createQuestionId, getCurrentTime, isPlayerExist, urlCheck } from './helpers';
import { quizIdValidator } from './helpers';
import { quizOwnership } from './helpers';
import { isNameAlphaNumeric } from './helpers';
import { nameLen } from './helpers';
import { descriptionLengthValid } from './helpers';
import { isUsedQuizName } from './helpers';
import { customAlphabet } from 'nanoid';
import { createId } from './helpers';
import HTTPError from 'http-errors';
import { countSessionNotEnd } from './helpers';

/** *******************************************************************************************|
|            |
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them**|
\*********************************************************************************************/

export function adminQuizCreate(authUserId: number, name: string, description: string) {
  if (userIdValidator(authUserId) === false) {
    throw HTTPError(401, "Invalid user id");
  }
  if (nameLen(name) === false) {
    throw HTTPError(400, 'Invalid name length');
  }
  if (isNameAlphaNumeric(name) === false) {
    throw HTTPError(400, 'Quiz name contains invalid letters');
  }
  if (descriptionLengthValid(description) === false) {
    throw HTTPError(400, 'Invalid quiz description length');
  }
  if (isUsedQuizName(name, authUserId) === false) {
    throw HTTPError(400, 'Quiz name is already used');
  }

  const data = getData();
  const quizId = createId(data.quizzes);

  const time = Math.floor(new Date().getTime() / 1000);
  const questions: Array<question> = [];
  const newData: quiz = {
    quizId: quizId,
    name: name,
    timeCreated: time,
    timeLastEdited: time,
    description: description,
    numQuizQuestion: 0,
    questions: questions,
    imgUrl: ''
  };

  data.quizzes[quizId] = newData;
  data.users[authUserId].quizzesUserHave.push(quizId);
  setData(data);
  return { quizId: quizId };
}

export function adminQuizRemove(authUserId: number, quizId: number) {
  if (userIdValidator(authUserId) === false) {
    throw HTTPError(401, "Invalid user id");
  }
  if (quizIdValidator(quizId) === false) {
    throw HTTPError(403, "Invalid quiz id");
  }
  if (quizOwnership(authUserId, quizId) === false) {
    throw HTTPError(403, 'You do not own this quiz');
  }
  if (countSessionNotEnd(quizId) != 0) {
    throw HTTPError(400, "All sessions for this quiz must be in END state");
  }

  const data = getData();
  data.quizzesDeleted[quizId] = data.quizzes[quizId];
  data.users[authUserId].quizzesUserDeleted.push(quizId);

  delete data.quizzes[quizId];
  const index = data.users[authUserId].quizzesUserHave.indexOf(quizId);
  data.users[authUserId].quizzesUserHave.splice(index, 1);

  setData(data);

  return {};
}

export function adminQuizInfo(authUserId: number, quizId: number) {
  if (userIdValidator(authUserId) === false) {
    throw HTTPError(401, "Invalid user id");
  }
  if (quizIdValidator(quizId) === false) {
    throw HTTPError(403, "Invalid quiz id");
  }
  if (quizOwnership(authUserId, quizId) === false) {
    throw HTTPError(403, 'You do not own this quiz');
  }

  const data = getData();
  const quiz = data.quizzes[quizId];
  const ans = {
    quizId: quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
    numQuestions: quiz.questions.length,
    questions: getQuestionsInfo(quizId),
    duration: countDuration(quizId)
  };
  return ans;
}

function countDuration(quizId: number) {
  let duration = 0;
  for (const question of getData().quizzes[quizId].questions) {
    duration += question.duration;
  }
  return duration;
}

function getQuestionsInfo(quizId: number) {
  const Questions = getData().quizzes[quizId].questions;
  const ans: question[] = [];
  for (const question of Questions) {
    ans.push({
      questionId: question.questionId,
      question: question.question,
      duration: question.duration,
      points: question.points,
      answers: getanswers(question),
      playerTime: question.playerTime,
    });
  }
  return ans;
}
function getanswers(question: question) {
  const ans: answer[] = [];
  for (const answer of question.answers) {
    ans.push({
      answerId: answer.answerId ? answer.answerId : question.answers.indexOf(answer),
      answer: answer.answer,
      colour: answer.colour ? answer.colour : "black",
      correct: answer.correct
    });
  }
  return ans;
}

/** *******************************************************************************************|
|*Given an admin user's "authUserId", return details about the user.                          |
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them**|
\*********************************************************************************************/
export function adminQuizList(authUserId: number) {
  const quizzes: { quizId: number, name: string }[] = [];
  const datas = getData();
  if (datas.users[authUserId] === undefined) {
    return { error: 'can not find such a member' };
  }
  const dataBase = datas.users[authUserId];

  for (const Id of dataBase.quizzesUserHave) {
    quizzes.push({
      quizId: Id,
      name: datas.quizzes[Id].name
    });
  }
  return { quizzes: quizzes };
}

export function adminQuizTransfer(quizId: number, fromId: number, sendToEmail: string) {
  const userId = findAuthUserIdByEmail(sendToEmail);
  const data = getData();
  if (!userId) {
    return { error: 'This email does not exist' };
  }
  if (data.users[fromId].email === sendToEmail) {
    return { error: 'You cannot transfer to yourself' };
  }
  if (!data.users[fromId].quizzesUserHave.includes(quizId)) {
    return { error: 'You do not own this quiz' };
  }
  if (!isUsedQuizName(data.quizzes[quizId].name, userId)) {
    return { error: 'Quiz ID refers to a quiz that has a name that is already used by the target user' };
  }
  data.users[userId].quizzesUserHave.push(quizId);
  console.log(userId);
  console.log(data.users[userId].quizzesUserHave, '\n');
  data.users[fromId].quizzesUserHave.splice(data.users[fromId].quizzesUserHave.indexOf(quizId), 1);
  console.log(data);
  setData(data);
  return {};
}
function checkQuestionInfo(quizId: number, question: question) {
  // Get the data from the dataStore
  const data = getData();
  // Check if the question has a valid length
  if (!('question' in question) || question.question.length < 5 || question.question.length > 50) return { error: 'Invalid question length' };
  // Check if the answers number is valid
  if (!('answers' in question) || question.answers.length < 2 || question.answers.length > 6) return { error: 'Invalid answers number' };
  // Check if the duration is valid
  if (!('duration' in question) || question.duration < 0) return { error: 'Invalid duration' };

  // Calculate the total duration of the quiz
  let count = 0;
  for (const question of data.quizzes[quizId].questions) count += question.duration;
  // Check if the quiz duration exceeds 3 minutes
  if (count + question.duration > 180) return { error: 'Quiz duration exceeds 3 minutes' };
  // Check if the points are valid
  if (!('points' in question) || question.points < 1 || question.points > 10) return { error: 'Invalid points' };
  // Check if the answers have a valid length
  if (question.answers.filter((answer) => (answer.answer.length < 1 || answer.answer.length > 30)).length > 0) return { error: 'Invalid answer length' };
  // Check if there are any duplicate answers
  for (let i = 0; i < question.answers.length; i++) {
    for (let j = i + 1; j < question.answers.length; j++) {
      if (question.answers[i].answer === question.answers[j].answer) {
        return { error: 'Duplicate answer' };
      }
    }
  }
  // Check if there is at least one correct answer
  if (question.answers.filter((answer) => (answer.correct === true)).length === 0) return { error: 'No correct answer' };
  return {};
}
export function adminQuestionCreate(authUserId: number, quizId: number, question: question) {
  // Error checks
  if (!quizOwnership(authUserId, quizId)) {
    return { error: 'This user does not own this quiz' };
  }
  let error: { error?: string };
  if ('error' in (error = checkQuestionInfo(quizId, question))) {
    return error;
  }
  // If no errors then create question
  const data = getData();
  // creating Id for question
  const nanoId = customAlphabet('01234567890', 3);
  const questionId = createQuestionId(quizId);
  console.log('question id: ' + questionId);
  for (const answer of question.answers) {
    answer.answerId = parseInt(nanoId()) * Math.pow(10, quizId.toString().length) + quizId;
    while (1) {
      if (data.quizzes[quizId].questions.every(question => (question.answers.every(answer => (answer.answerId !== answer.answerId * Math.pow(10, quizId.toString().length) + quizId))))) {
        break;
      }
    }
  }
  const ans: question = {
    questionId: questionId,
    question: question.question,
    duration: question.duration,
    points: question.points,
    answers: getanswers(question),
    playerTime: []
  };
  data.quizzes[quizId].questions.push(ans);
  data.quizzes[quizId].numQuizQuestion++;
  setData(data);
  return { questionId };
}
export function adminQuizNameUpdate(authUserId: number, quizId: number, name: string) {
  // Error checks
  if (!nameLen(name)) {
    throw HTTPError(400, 'Invalid name length');
  }
  if (!isNameAlphaNumeric(name)) {
    throw HTTPError(400, 'Invalid character used in name');
  }
  if (!userIdValidator(authUserId)) {
    throw HTTPError(401, 'User Id invalid');
  }
  if (!quizIdValidator(quizId)) {
    throw HTTPError(403, 'Quiz Id invalid');
  }
  if (!quizOwnership(authUserId, quizId)) {
    throw HTTPError(403, 'This user does not own this quiz');
  }
  if (name === getData().quizzes[quizId].name) {
    throw HTTPError(400, "New name can't be the same");
  }
  if (isUsedQuizName(name, authUserId) === false) {
    throw HTTPError(403, 'adminQuizCreate: quiz name already used by another user');
  }

  // If no errors then update name
  const whData = getData();
  const dataQ = whData.quizzes;

  dataQ[quizId].name = `${name}`;
  whData.quizzes = dataQ;

  setData(whData);

  return {};
}

export function adminQuizDescriptionUpdate(authUserId: number, quizId: number, description: string) {
  if (!descriptionLengthValid(description)) {
    throw HTTPError(400, 'Description too long');
  }
  if (!userIdValidator(authUserId)) {
    throw HTTPError(401, 'User Id invalid');
  }
  if (!quizIdValidator(quizId)) {
    throw HTTPError(403, 'Quiz Id invalid');
  }
  if (!quizOwnership(authUserId, quizId)) {
    throw HTTPError(403, 'This user does not own this quiz');
  }

  const whData = getData();
  const dataQ = whData.quizzes;

  dataQ[quizId].description = `${description}`;
  whData.quizzes = dataQ;

  setData(whData);

  return {};
}

export function duplicateQuestion(authUserId: number, quizId: number, questionId: number) {
  if (!userIdValidator(authUserId)) {
    throw HTTPError(401, 'User Id invalid');
  }
  if (!quizIdValidator(quizId)) {
    throw HTTPError(403, 'Quiz Id invalid');
  }
  if (!quizOwnership(authUserId, quizId)) {
    throw HTTPError(403, 'This user does not own this quiz');
  }
  if (!questionFinder(quizId, questionId)) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  let quesId;
  const data = getData();
  const qs = data.quizzes[quizId].questions;
  for (const d of qs) {
    if (d.questionId === questionId) {
      const DupQ = JSON.parse(JSON.stringify(d));
      quesId = createQuestionId(quizId);
      DupQ.questionId = quesId;

      qs.splice(qs.indexOf(d) + 1, 0, DupQ);
      break;
    }
  }

  data.quizzes[quizId].questions = qs;
  data.quizzes[quizId].timeLastEdited = getCurrentTime();
  setData(data);

  return { newQuestionId: quesId };
}

export function deleteQuestion(authUserId: number, quizId: number, questionId: number) {
  if (!userIdValidator(authUserId)) {
    throw HTTPError(401, 'User Id invalid');
  }
  if (!quizIdValidator(quizId)) {
    throw HTTPError(403, 'Quiz Id invalid');
  }
  if (!quizOwnership(authUserId, quizId)) {
    throw HTTPError(403, 'This user does not own this quiz');
  }
  if (!questionFinder(quizId, questionId)) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }
  if (countSessionNotEnd(quizId) != 0) {
    throw HTTPError(400, 'some sessions related to this quiz has not ended yet');
  }

  const data = getData();
  const qs = data.quizzes[quizId].questions;
  for (const d of qs) {
    if (d.questionId === questionId) {
      qs.splice(qs.indexOf(d), 1);
      break;
    }
  }
  data.quizzes[quizId].questions = qs;
  data.quizzes[quizId].timeLastEdited = getCurrentTime();
  setData(data);

  return {};
}

export function moveQuestion(authUserId: number, quizId: number, questionId: number, newPos: number) {
  if (!userIdValidator(authUserId)) {
    throw HTTPError(401, 'User Id invalid');
  }
  if (!quizIdValidator(quizId)) {
    throw HTTPError(403, 'Quiz Id invalid');
  }
  if (!quizOwnership(authUserId, quizId)) {
    throw HTTPError(403, 'This user does not own this quiz');
  }
  if (!questionFinder(quizId, questionId)) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  const data = getData();
  const qs = data.quizzes[quizId].questions;
  if (newPos < 0 || newPos > qs.length - 1) {
    return { error: 'Invalid new position' };
  }

  for (const d of qs) {
    if (d.questionId === questionId) {
      if (newPos === qs.indexOf(d)) {
        return { error: "Can't move to the same position" };
      }
      qs.splice(qs.indexOf(d), 1);
      qs.splice(newPos, 0, d);
      break;
    }
  }
  data.quizzes[quizId].questions = qs;
  data.quizzes[quizId].timeLastEdited = getCurrentTime();
  setData(data);

  return {};
}

export function adminViewDeletedQuizzes(authUserId: number) {
  if (!userIdValidator(authUserId)) {
    throw HTTPError(401, "Invalid user id");
  }

  const data = getData();
  const list = data.users[authUserId].quizzesUserDeleted;

  interface quiz {
    quizId: number,
    name: string
  }
  const ret: quiz[] = [];
  for (const id of list) {
    ret.push({
      quizId: id,
      name: data.quizzesDeleted[id].name
    });
  }
  return {
    quizzes: ret
  };
}

export function adminRestoreQuiz(authUserId: number, quizId: number) {
  if (userIdValidator(authUserId) === false) {
    throw HTTPError(401, "Invalid user id");
  }
  if (deletedQuizIdValidator(quizId) === false) {
    throw HTTPError(400, "Invalid quiz id");
  }
  if (deletedQuizOwnership(authUserId, quizId) === false) {
    throw HTTPError(403, 'You do not own this quiz');
  }

  const data = getData();

  const name = data.quizzesDeleted[quizId].name;
  const description: string = data.quizzesDeleted[quizId].description as string;

  const ans = adminQuizCreate(authUserId, name, description);
  if ('error' in ans) {
    return { error: 'creation failed' };
  }

  delete data.quizzesDeleted[quizId];
  const index = data.users[authUserId].quizzesUserDeleted.indexOf(quizId);
  data.users[authUserId].quizzesUserDeleted.splice(index, 1);

  setData(data);

  return {};
}

export function adminQuizPermDelete(authUserId: number, quizIds: number[]) {
  if (userIdValidator(authUserId) === false) {
    throw HTTPError(401, "Invalid user id");
  }
  for (const item of quizIds) {
    if (deletedQuizIdValidator(item) === false) {
      throw HTTPError(400, 'Cannot locate quizId');
    }
    if (deletedQuizOwnership(authUserId, item) === false) {
      throw HTTPError(403, 'You do not own this quiz');
    }
  }
  const data = getData();
  for (const item of quizIds) {
    if (data.users[authUserId].quizzesUserDeleted.includes(item) === false) {
      return { error: 'Target quiz id does not exist' };
    }
  }

  for (const item of quizIds) {
    const index = data.users[authUserId].quizzesUserDeleted.indexOf(item);
    data.users[authUserId].quizzesUserDeleted.splice(index, 1);

    delete data.quizzesDeleted[item];
  }

  setData(data);

  return {};
}

export function adminQuizQuestionUpdate(userId: number, quizId: number, questionId: number, questionBody: object, token: string) {
  if (!questionFinder(quizId, questionId)) {
    return { error: 'Question Id does not refer to a valid question within this quiz' };
  }
  const data = getData();
  const questions = data.quizzes[quizId].questions;
  let i;
  for (i = 0; i < questions.length; i++) {
    if (questionId === questions[i].questionId) {
      break;
    }
  }
  if (!("question" in questionBody && typeof questionBody.question === "string")) {
    return { error: "a question is required" };
  }
  if ((questionBody.question.length < 5 || questionBody.question.length > 50)) {
    return { error: 'Question string is less than 5 characters in length or greater than 50 characters in length' };
  }
  if (!("answers" in questionBody && Array.isArray(questionBody.answers))) {
    return { error: "answers are required" };
  }
  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return { error: 'The question has more than 6 answers or less than 2 answers' };
  }
  if (!("duration" in questionBody && typeof questionBody.duration === "number")) {
    return { error: "a duration is required" };
  }
  if (questionBody.duration <= 0) {
    return { error: 'The question duration is not a positive number' };
  }
  if (questionBody.duration > 180) {
    return { error: 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes' };
  }
  if (!("points" in questionBody && typeof questionBody.points === "number")) {
    return { error: "points is required" };
  }
  if (questionBody.points < 1 || questionBody.points > 10) {
    return { error: 'The points awarded for the question are less than 1 or greater than 10' };
  }
  for (let j = 0; j < questionBody.answers.length; j++) {
    if (questionBody.answers[j].answer.length < 1 || questionBody.answers[j].answer.length > 50) {
      return { error: 'An answer string is less than 1 character in length or greater than 50 characters in length' };
    }
  }
  if (data.quizzes[quizId].questions[i].question === questionBody.question) {
    for (let num1 = 0; num1 < data.quizzes[quizId].questions[i].answers.length; num1++) {
      for (let num2 = 0; num2 < questionBody.answers.length; num2++) {
        if (data.quizzes[quizId].questions[i].answers[num1].answer === questionBody.answers[num2].answer) {
          return { error: 'There are duplicate answers in this question' };
        }
      }
    }
  }
  let check = 0;
  for (let num3 = 0; num3 < questionBody.answers.length; num3++) {
    if (questionBody.answers[num3].correct === true) {
      check = 1;
    }
  }
  if (check === 0) {
    return { error: 'There is no correct answer in this question' };
  }
  questions[i].question = questionBody.question;
  questions[i].answers = questionBody.answers;
  questions[i].duration = questionBody.duration;
  questions[i].points = questionBody.points;
  questions[i].questionId = questionId;
  setData(data);
  return {};
}

export function updateQuizThumbnail(userId: number, quizId: number, imgUrl: string) {
    if(urlCheck(imgUrl) === false) {
        throw HTTPError(400, "invalid image url");
    }
    if(quizOwnership(userId, quizId) === false) {
        throw HTTPError(403, "You do not own this quiz");
    }

    let data = getData();
    data.quizzes[quizId].imgUrl = imgUrl;

    setData(data);

    return {};
}

// returns the result of a question
export function questionResults(playerId: number, questionPosition: number) {
  const QData = getSessionData();
  const PData = getPlayerData();

  if (!isPlayerExist(playerId)) {
    throw HTTPError(400, 'player does not exist');
  }
  const curSessionId = PData[playerId].sessionId;
  const session = QData[curSessionId];

  if (questionPosition > session.atQuestion) {
    throw HTTPError(400, 'have not reached there yet');
  }
  if (session.metadata.questions.length + 1 < questionPosition) {
    throw HTTPError(400, 'question does not exist');
  }
  if (session.state !== QuizSessionState.ANSWER_SHOW) {
    throw HTTPError(400, 'invalid State');
  }

  const questions = session.metadata.questions;
  const q = questions[questionPosition - 1];
  const obj = {
    questionId: q.questionId,
    playersCorrectList: [
      // what is this?
    ],
    averageAnswerTime: 45,
    percentCorrect: 54
  };

  return {};
}

// returns the whole chat of the session the player is in
export function allMessagesInSession(playerId: number) {
  if (!isPlayerExist(playerId)) {
    throw HTTPError(400, 'player does not exist');
  }
  const p = getPlayerData();
  const sesData = getSessionData();

  const curSessionId = p[playerId].sessionId;
  return sesData[curSessionId].messages;
}

// send a chat message
export function sendChat(playerId: number, body) {
  if (!isPlayerExist(playerId)) {
    throw HTTPError(400, 'player does not exist');
  }
  if (body.message.messageBody.length === 0 || body.message.messageBody.length > 100) {
    throw HTTPError(400, 'message length invalid');
  }

  const players = getPlayerData();
  const message: message = {
    messageBody: body.message.messageBody,
    playerId: playerId,
    playerName: players[playerId].name,
    timeSent: Date.now()
  };

  const curSessionId = players[playerId].sessionId;
  const sesData = getSessionData();
  sesData[curSessionId].messages.push(message);

  return {};
}


// Victor's parts

export function statusPlayer(playerId: number) {
  if (!isPlayerExist(playerId)) {
    return { error: "playerId does not exist" }
  }
  let playerData = getPlayerData();
  let sessionId = playerData[playerId].sessionId;
  let session = getSessionData();
  let newSession = session[sessionId];
  const data = {
    "state": newSession.state,
    "numQuestions": newSession.metadata.numQuizQuestion,
    "atQuestion": newSession.atQuestion
  }
  return data;
}

export function isQuestionValid(questionPosition: number, questionNumber: number) {
  if (questionPosition < 1) {
    return false;
  }
  if (questionPosition > questionNumber) {
    return false;
  }
  return true;
}

export function currentQuestionPosition(playerId: number, questionPosition: number) {
  if (!isPlayerExist(playerId)) {
    return { error: "playerId does not exist" }
  }
  let playerData = getPlayerData();
  let sessionId = playerData[playerId].sessionId;
  let session = getSessionData();
  let newSession = session[sessionId];
  if (!isQuestionValid(questionPosition, newSession.metadata.numQuizQuestion)) {
    return { error: "questionBody is not valid" }
  }
  if (newSession.state === QuizSessionState.LOBBY || newSession.state === QuizSessionState.END) {
    return { error: "QuizSessionState is in LOBBY or END" };
  }
  if (newSession.atQuestion !== questionPosition) {
    return { error: "questionPosition is not the same as atQuestion" }
  }
  let data = playerData[playerId].questionAnswered[questionPosition];
  return data;
}

export function answerSubmission(playerId: number, questionPosition: number, answerIds: answer[]) {
  if (!isPlayerExist(playerId)) {
    return { error: "playerId does not exist" }
  }
  let playerData = getPlayerData();
  let sessionId = playerData[playerId].sessionId;
  let session = getSessionData();
  let newSession = session[sessionId];
  let newPaste = playerData[playerId].questionAnswered[questionPosition];
  if (!isQuestionValid(questionPosition, newSession.metadata.numQuizQuestion)) {
    return { error: "questionBody is not valid" }
  }
  if (newSession.state !== QuizSessionState.QUESTION_OPEN) {
    return { error: "Session is not in QUESTION_OPEN state" };
  }
  if (newSession.atQuestion !== questionPosition) {
    return { error: "questionPosition is not the same as atQuestion" }
  }
  let check = 0;
  for (let i = 0; i < newPaste.answers.length; i++) {
    for (const id of answerIds) {
      if (newPaste.answers[i] === id) {
        check = 1;
      }
    }
  }
  if (check === 1) {
    return { error: "Answer IDs are not valid for this particular question" }
  }
  let newCheck = 0;
  for (let i = 0; i < answerIds.length; i++) {
    for (let j = 0; j < answerIds.length; j++) {
      if (answerIds[j].answerId === answerIds[i].answerId) {
        newCheck = 1;
      }
    }
  }
  if (newCheck === 1) {
    return { error: "There are duplicate answer IDs provided" };
  }
  if (answerIds.length < 1) {
    return { error: "Less than 1 answer ID submitted" };
  }
  playerData[playerId].questionAnswered[questionPosition - 1].answers = answerIds;
  return {};
}

export function playerResults(playerId: number) {
  if (!isPlayerExist(playerId)) {
    return { error: "playerId does not exist" }
  }
  let playerData = getPlayerData();
  let sessionId = playerData[playerId].sessionId;
  let session = getSessionData();
  let newSession = session[sessionId];
  if (newSession.state !== QuizSessionState.END) {
    return { error: "Session is not in FINAL_RESULTS state" }
  }
  return newSession.results
}