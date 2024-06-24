import { getData, question, setData } from './dataStore'
import { findAuthUserIdByEmail, userIdValidator } from './helpers'
import { quizIdValidator } from './helpers'
import { quizOwnership } from './helpers'
import { isNameAlphaNumeric } from './helpers'
import { nameLen } from './helpers'
import { description_length_valid } from './helpers'
import { isUsedQuizName } from './helpers'
import { customAlphabet } from 'nanoid'
export function adminQuizCreate(authUserId: number, name: string, description: string) {
    if (userIdValidator(authUserId) === false) {
        return { error: 'adminQuizCreate: invalid user id' }
    }
    if (nameLen(name) === false) {
        return { error: 'adminQuizCreate: invalid quiz name length' }
    }
    if (isNameAlphaNumeric(name) === false) {
        return { error: 'adminQuizCreate: quiz name contains invalid letters' }
    }
    if (description_length_valid(description) === false) {
        return { error: 'adminQuizCreate: quiz description is too long' }
    }
    if (isUsedQuizName(name) === false) {
        return { error: 'adminQuizCreate: quiz name already used by another user' }
    }

    const data = getData();
    const quizId = Object.keys(data.quizzes).length + 1;

    let d = new Date();
    const time = d.getTime();
    let questions : Array<question> = [];
    const new_data = {
        quizId: quizId,
        name: name,
        timeCreated: time,
        timeLastEdited: time,
        description: description,
        numQuizQuestion : 0,
        questions : questions,
    }

    data.quizzes[quizId] = new_data;
    data.users[authUserId].quizzesUserHave.push(quizId)
    setData(data)
    return { quizId : quizId }
}

export function adminQuizRemove(authUserId: number, quizId: number) {
    if (userIdValidator(authUserId) === false) {
        return { error: 'adminQuizRemove: invalid user id' }
    }
    if (quizIdValidator(quizId) === false) {
        return { error: 'adminQuizRemove: invalid quiz id' }
    }
    if (quizOwnership(authUserId, quizId) === false) {
        return { error: 'adminQuizRemove: you do not own this quiz' }
    }
    let data = getData();
    delete data.quizzes[quizId];
    setData(data);

    return {}
}

export function adminQuizInfo(authUserId: number, quizId: number) {
    if (userIdValidator(authUserId) == false) {
        return { error: 'adminQuizInfo: invalid user id' }
    }
    if (quizIdValidator(quizId) == false) {
        return { error: 'adminQuizInfo: invalid quiz id' }
    }
    if (quizOwnership(authUserId, quizId) == false) {
        return { error: 'adminQuizInfo: you do not own this quiz' }
    }

    const data = getData();

    return {
        quizId : data.quizzes[quizId].quizId,
        name : data.quizzes[quizId].name,
        timeCreated : data.quizzes[quizId].timeCreated,
        timeLastEdited : data.quizzes[quizId].timeLastEdited,
        description : data.quizzes[quizId].description
    }
//  return data.quizzes[quizId]
    /*for (const item in data.quizzes) {
        if (item.quizId === quizId) {
            return item;
        }
    }*/
}

/*********************************************************************************************|
|*Given an admin user's "authUserId", return details about the user.                          |
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them**|
\*********************************************************************************************/
export function adminQuizList(authUserId: number) {
    let quizzes = [];
    let datas = getData();
    if (datas.users[authUserId] === undefined) {
        return { error: "can not find such a member" };
    }
    let dataBase = datas.users[authUserId];
    console.log("here");
    console.log(dataBase);
    console.log(dataBase.quizzesUserHave);
    for (const Id of dataBase.quizzesUserHave) {
        quizzes.push({
            quizId: Id,
            name: datas.quizzes[Id].name
        })
    }
    return { quizzes: quizzes }
}

export function adminQuizTransfer (quizId : number, fromId : number, sendToEmail : string) {
    let userId = findAuthUserIdByEmail(sendToEmail);
    let data = getData();
    if (!userId) {
        return { error: 'This email does not exist' };
    }
    if (data.users[fromId].email === sendToEmail) {
        return { error: 'You cannot transfer to yourself' };
    }
    if (!data.users[fromId].quizzesUserHave.includes(quizId)) {
        return { error: 'You do not own this quiz' };
    }
    data.users[userId].quizzesUserHave.push(quizId);
    console.log(userId)
    console.log(data.users[userId].quizzesUserHave, "\n")
    data.users[fromId].quizzesUserHave.splice(data.users[fromId].quizzesUserHave.indexOf(quizId), 1);
    console.log(data);
    setData(data);
    return {}
}
function checkQuestionInfo (quizId : number, question : question) {
    // Get the data from the dataStore
    let data = getData();
    // Check if the question has a valid length
    if (!("question" in question) || question.question.length < 5 || question.question.length > 50) return { error: 'Invalid question length' };
    // Check if the answers number is valid
    if (!("answers" in question) || question.answers.length < 2 || question.answers.length > 6) return { error: 'Invalid answer length' };
    // Check if the duration is valid
    if (!("duration" in question) || question.duration < 0) return { error: 'Invalid duration' };

    // Calculate the total duration of the quiz
    let count = 0;
    for (const question of data.quizzes[quizId].questions) count += question.duration;
    // Check if the quiz duration exceeds 3 minutes
    if (count + question.duration > 180) return { error: 'Quiz duration exceeds 3 minutes' };
    // Check if the points are valid
    if (!("points" in question) || question.points < 1 || question.points > 10) return { error: 'Invalid points' };
    // Check if the answers have a valid length
    if (question.answers.filter((answer) => (answer.answer.length < 1 || answer.answer.length > 30))) return { error: 'Invalid answer length' };
    // Check if there are any duplicate answers
    for (let i = 0; i < question.answers.length; i++) {
        for (let j = i + 1; j < question.answers.length; j++) {
            if (question.answers[i].answer === question.answers[j].answer) {
                return { error: 'Duplicate answer' };
            }
        }
    }
    // Check if there is at least one correct answer
    if (question.answers.filter((answer) => (answer.correct === true)).length === 0) return { error: 'No correct answer' }
}
export function adminQuestionCreate(authUserId: number, quizId: number, question : question) {
    // Error checks
    if (!checkQuestionInfo(quizId, question)) {
        return { error: 'Invalid question' };
    }
    if (!userIdValidator(authUserId)) {
        return { error: 'User Id invalid' };
    }
    if (!quizIdValidator(quizId)) {
        return { error: 'Quiz Id invalid' };
    }
    if (!quizOwnership(authUserId, quizId)) {
        return { error: 'This user does not own this quiz' };
    }
    // If no errors then create question
    let data = getData();
    // creating Id for question
    const nanoId = customAlphabet("01234567890", 3);
    let questionId = parseInt(nanoId())
    questionId = questionId * Math.pow(10,quizId.toString().length) + quizId;
    console.log("creating unique question id")
    while (1) {
        if (data.quizzes[quizId].questions.every(question => (question.questionId !== questionId * Math.pow(10,quizId.toString().length) + quizId))) {
            break;
        }
        questionId = parseInt(nanoId())
    }
    console.log("question id: " + questionId)
    for (let answer of question.answers) {
        answer.answerId = parseInt(nanoId()) * Math.pow(10,quizId.toString().length) + quizId;
        while (1) {
            if (data.quizzes[quizId].questions.every(question => (question.answers.every(answer => (answer.answerId !== answer.answerId * Math.pow(10,quizId.toString().length) + quizId))))) {
                break;
            }
        }
    }
    data.quizzes[quizId].questions.push(question);
    data.quizzes[quizId].numQuizQuestion++;
    setData(data);
    return { questionId };
}
export function adminQuizNameUpdate(authUserId: number, quizId: number, name: string) {
    // Error checks
    if (!nameLen(name)) {
        return { error: 'Invalid name length'};
    }
    if (!isNameAlphaNumeric(name)) {
        return {error: 'Invalid character used in name'};
    }
    if (!userIdValidator(authUserId)) {
        return {error: 'User Id invalid'};
    }
    if (!quizIdValidator(quizId)) {
        return {error: 'Quiz Id invalid'};
    }
    if (!quizOwnership(authUserId, quizId)) {
        return {error: 'This user does not own this quiz'};
    }
    if (isUsedQuizName(name) === false) {
        return { error: 'adminQuizCreate: quiz name already used by another user' }
    }

    // If no errors then update name
    let wh_data = getData();
    let data_q = wh_data.quizzes;

    data_q[quizId]['name'] = `${name}`;
    wh_data.quizzes = data_q;

    setData(wh_data);

    return {}
}

export function adminQuizDescriptionUpdate(authUserId: number, quizId: number, description: string) {
    if (!description_length_valid(description)) {
        return { error : 'Description too long'};
    }
    if (!userIdValidator(authUserId)) {
        return { error: 'User Id invalid' };
    }
    if (!quizIdValidator(quizId)) {
        return { error: 'Quiz Id invalid' };
    }
    if (!quizOwnership(authUserId, quizId)) {
        return { error: 'This user does not own this quiz' };
    }

    let wh_data = getData();
    let data_q = wh_data.quizzes;

    data_q[quizId]['description'] = `${description}`;
    wh_data.quizzes = data_q;

    setData(wh_data);

    return {}
}

export function duplicateQuiz(quizId: number) {
    return {}
}

export function deleteQuestion(quizId: number, questionId: number) {
    return {}
}

export function moveQuestion(quizId: number, questionId: number) {
    return {}
}
