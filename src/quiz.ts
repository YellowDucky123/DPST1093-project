import { getData, setData } from './dataStore'
import { userIdValidator } from './helpers'
import { quizIdValidator } from './helpers'
import { quizOwnership } from './helpers'
import { isNameAlphaNumeric } from './helpers'
import { nameLen } from './helpers'
import { description_length_valid } from './helpers'
import { isUsedQuizName } from './helpers'

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

    const new_data = {
        quizId: quizId,
        name: name,
        timeCreated: time,
        timeLastEdited: time,
        description: description
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
    for (const Id of dataBase.quizzesUserHave) {
        quizzes.push({
            quizId: Id,
            name: datas.quizzes[Id].name
        })
    }
    return { quizzes: quizzes }
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

