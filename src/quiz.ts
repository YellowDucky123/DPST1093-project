import { create } from 'domain'
import { findUserIdByToken, getData, question, quiz, setData } from './dataStore'
import { questionFinder, findAuthUserIdByEmail, userIdValidator, deletedQuizIdValidator, deletedQuizOwnership, createQuestionId } from './helpers'
import { quizIdValidator } from './helpers'
import { quizOwnership } from './helpers'
import { isNameAlphaNumeric } from './helpers'
import { nameLen } from './helpers'
import { description_length_valid } from './helpers'
import { isUsedQuizName } from './helpers'
import { customAlphabet } from 'nanoid'
import { createId } from './helpers'

/*********************************************************************************************|
|            |
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them**|
\*********************************************************************************************/

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
    if (isUsedQuizName(name, authUserId) === false) {
        return { error: 'adminQuizCreate: quiz name already used by another user' }
    }

    const data = getData();
    const quizId = createId(data.quizzes);

    let d = new Date();
    const time = d.getTime();
    let questions: Array<question> = [];
    const new_data: quiz = {
        quizId: quizId,
        name: name,
        timeCreated: time,
        timeLastEdited: time,
        description: description,
        numQuizQuestion: 0,
        questions: questions,
    }

    data.quizzes[quizId] = new_data;
    data.users[authUserId].quizzesUserHave.push(quizId)
    setData(data)
    return { quizId: quizId }
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
    data.quizzesDeleted[quizId] = data.quizzes[quizId];
    data.users[authUserId].quizzesUserDeleted.push(quizId);

    delete data.quizzes[quizId];
    const index = data.users[authUserId].quizzesUserHave.indexOf(quizId);
    data.users[authUserId].quizzesUserHave.splice(index, 1);

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

    return data.quizzes[quizId];
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

    for (const Id of dataBase.quizzesUserHave) {
        quizzes.push({
            quizId: Id,
            name: datas.quizzes[Id].name
        })
    }
    return { quizzes: quizzes }
}

export function adminQuizTransfer(quizId: number, fromId: number, sendToEmail: string) {
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
    if (!isUsedQuizName(data.quizzes[quizId].name, userId)) {
        return { error: "Quiz ID refers to a quiz that has a name that is already used by the target user" }
    }
    data.users[userId].quizzesUserHave.push(quizId);
    console.log(userId)
    console.log(data.users[userId].quizzesUserHave, "\n")
    data.users[fromId].quizzesUserHave.splice(data.users[fromId].quizzesUserHave.indexOf(quizId), 1);
    console.log(data);
    setData(data);
    return {}
}
function checkQuestionInfo(quizId: number, question: question) {
    // Get the data from the dataStore
    let data = getData();
    // Check if the question has a valid length
    if (!("question" in question) || question.question.length < 5 || question.question.length > 50) return { error: 'Invalid question length' };
    // Check if the answers number is valid
    if (!("answers" in question) || question.answers.length < 2 || question.answers.length > 6) return { error: 'Invalid answers number' };
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
    if (question.answers.filter((answer) => (answer.correct === true)).length === 0) return { error: 'No correct answer' }
    return {}
}
export function adminQuestionCreate(authUserId: number, quizId: number, question: question) {
    // Error checks
    if (!quizOwnership(authUserId, quizId)) {
        return { error: 'This user does not own this quiz' };
    }
    let error: { error?: string }
    if ("error" in (error = checkQuestionInfo(quizId, question))) {
        return error;
    }
    // If no errors then create question
    let data = getData();
    // creating Id for question
    const nanoId = customAlphabet("01234567890", 3);
    let questionId = createQuestionId(quizId);
    console.log("question id: " + questionId)
    for (let answer of question.answers) {
        answer.answerId = parseInt(nanoId()) * Math.pow(10, quizId.toString().length) + quizId;
        while (1) {
            if (data.quizzes[quizId].questions.every(question => (question.answers.every(answer => (answer.answerId !== answer.answerId * Math.pow(10, quizId.toString().length) + quizId))))) {
                break;
            }
        }
    }
    question.questionId = questionId;
    data.quizzes[quizId].questions.push(question);
    data.quizzes[quizId].numQuizQuestion++;
    setData(data);
    return { questionId };
}
export function adminQuizNameUpdate(authUserId: number, quizId: number, name: string) {
    // Error checks
    if (!nameLen(name)) {
        return { error: 'Invalid name length' };
    }
    if (!isNameAlphaNumeric(name)) {
        return { error: 'Invalid character used in name' };
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
    if (name === getData().quizzes[quizId].name) {
        return {}
    }
    if (isUsedQuizName(name, authUserId) === false) {
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
        return { error: 'Description too long' };
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

export function duplicateQuestion(authUserId: number, quizId: number, questionId: number) {
    if (!userIdValidator(authUserId)) {
        return { error: 'User Id invalid' };
    }
    if (!quizIdValidator(quizId)) {
        return { error: 'Quiz Id invalid' };
    }
    if (!quizOwnership(authUserId, quizId)) {
        return { error: 'This user does not own this quiz' };
    }
    if (!questionFinder(quizId, questionId)) {
        return { error: 'Question Id does not refer to a valid question within this quiz' };
    }

    let ques_id;
    const data = getData();
    let qs = data.quizzes[quizId].questions;
    for (const d of qs) {
        if (d.questionId === questionId) {
            let Dup_q = JSON.parse(JSON.stringify(d));
            ques_id = createQuestionId(quizId);
            Dup_q.questionId = ques_id;

            qs.splice(qs.indexOf(d) + 1, 0, Dup_q);
            break;
        }
    }

    data.quizzes[quizId].questions = qs;
    setData(data);

    return { questionId: ques_id };
}

export function deleteQuestion(authUserId: number, quizId: number, questionId: number) {
    if (!userIdValidator(authUserId)) {
        return { error: 'User Id invalid' };
    }
    if (!quizIdValidator(quizId)) {
        return { error: 'Quiz Id invalid' };
    }
    if (!quizOwnership(authUserId, quizId)) {
        return { error: 'This user does not own this quiz' }
    }
    if (!questionFinder(quizId, questionId)) {
        return { error: 'Question Id does not refer to a valid question within this quiz' };
    }

    const data = getData();
    let qs = data.quizzes[quizId].questions;
    for (const d of qs) {
        if (d.questionId === questionId) {
            qs.splice(qs.indexOf(d), 1);
            break;
        }
    }
    data.quizzes[quizId].questions = qs;
    setData(data);

    return {}
}

export function moveQuestion(authUserId: number, quizId: number, questionId: number, newPos: number) {
    if (!userIdValidator(authUserId)) {
        return { error: 'User Id invalid' };
    }
    if (!quizIdValidator(quizId)) {
        return { error: 'Quiz Id invalid' };
    }
    if (!quizOwnership(authUserId, quizId)) {
        return { error: 'This user does not own this quiz' }
    }
    if (!questionFinder(quizId, questionId)) {
        return { error: 'Question Id does not refer to a valid question within this quiz' };
    }

    const data = getData();
    const qs = data.quizzes[quizId].questions;
    for (const d of qs) {
        if (d.questionId === questionId) {
            qs.splice(qs.indexOf(d), 1)
            qs.splice(newPos, 0, d);
            break;
        }
    }
    data.quizzes[quizId].questions = qs;
    setData(data);

    return {}
}

export function adminViewDeletedQuizzes(authUserId: number) {
    if (!userIdValidator(authUserId)) {
        return { error: 'User Id invalid' };
    }

    const data = getData();
    const list = data.users[authUserId].quizzesUserDeleted;

    interface quiz {
        quizId: number,
        name: string
    };
    let ret: quiz[] = [];
    for (const id of list) {
        ret.push({
            quizId: id,
            name: data.quizzesDeleted[id].name
        })
    }
    return {
        quizzes: ret
    };
}

export function adminRestoreQuiz(authUserId: number, quizId: number) {
    if (userIdValidator(authUserId) == false) {
        return { error: 'adminRestoreQuiz: invalid user id' }
    }
    if (deletedQuizIdValidator(quizId) == false) {
        return { error: 'adminRestoreQuiz: invalid quiz id' }
    }
    if (deletedQuizOwnership(authUserId, quizId) == false) {
        return { error: 'adminRestoreQuiz: you do not own this quiz' }
    }

    const data = getData();

    const name = data.quizzesDeleted[quizId].name;
    const description = data.quizzesDeleted[quizId].description;

    const ans = adminQuizCreate(authUserId, name, description);
    if ("error" in ans) {
        return { "error": "creation failed" }
    }

    delete data.quizzesDeleted[quizId];
    const index = data.users[authUserId].quizzesUserDeleted.indexOf(quizId);
    data.users[authUserId].quizzesUserDeleted.splice(index, 1);

    setData(data);

    return {};
}

export function adminQuizPermDelete(authUserId: number, quizIds: number[]) {
    if (userIdValidator(authUserId) == false) {
        return { error: 'adminQuizPerDelete: invalid user id' }
    }
    for (const item of quizIds) {
        if (deletedQuizIdValidator(item) == false) {
            return { error: 'adminQuizPerDelete: invalid quiz id' }
        }
        if (deletedQuizOwnership(authUserId, item) == false) {
            return { error: 'adminQuizPerDelete: you do not own this quiz' }
        }

    }
    const data = getData();
    for (const item of quizIds) {
        if (data.users[authUserId].quizzesUserDeleted.includes(item) === false) {
            return { error: 'Target quiz id does not exist' }
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

export function adminQuizQuestionUpdate(userId: number, quizId: number, questionId: number, questionBody: any, token: string): any {
    if (!questionFinder(quizId, questionId)) {
        return { error: 'Question Id does not refer to a valid question within this quiz' };
    }
    let data = getData();
    let questions = data.quizzes[quizId].questions
    let i;
    for (i = 0; i < questions.length; i++) {
        if (questionId === questions[i].questionId) {
            break;
        }
    }
    if (questionBody.question.length < 5 || questionBody.question.length > 50) {
        return { error: 'Question string is less than 5 characters in length or greater than 50 characters in length' };
    }
    if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
        return { error: 'The question has more than 6 answers or less than 2 answers' };
    }
    if (questionBody.duration <= 0) {
        return { error: 'The question duration is not a positive number' }
    }
    if (questionBody.duration > 180) {
        return { error: 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes' };
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
        for (let num_1 = 0; num_1 < data.quizzes[quizId].questions[i].answers.length; num_1++) {
            for (let num_2 = 0; num_2 < questionBody.answers.length; num_2++) {
                if (data.quizzes[quizId].questions[i].answers[num_1].answer === questionBody.answers[num_2].answer) {
                    return { error: 'There are duplicate answers in this question' };
                }
            }
        }
    }
    let check = 0;
    for (let num_3 = 0; num_3 < questionBody.answers.length; num_3++) {
        if (questionBody.answers[num_3].correct === true) {
            check = 1;
        }
    }
    if (check === 0) {
        return { error: 'There is no correct answer in this question' };
    }
    //if (data.quizzes[] != token)
    /*
    if (!quizOwnership(userId, quizId)) {
        return { error: 'This user does not own this quiz' };
    }*/

    questions[i].question = questionBody.question;
    questions[i].answers = questionBody.answers;
    questions[i].duration = questionBody.duration;
    questions[i].points = questionBody.points;
    questions[i].questionId = questionBody.questionId
    setData(data);
    return {};
}