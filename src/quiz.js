import { getData, setData } from './dataStore.js'
import { userIdValidator } from './helpers.js'
import { quizIdValidator } from './helpers.js'
import { quizOwnership } from './helpers.js'
import { isNameAlphaNumeric } from './helpers.js'
import { nameLen } from './helpers.js'
import { description_length_valid } from './helpers.js'

export function adminQuizCreate( authUserId, name, description ) {
    if(userIdValidator(authUserId) == false){
        return {error: 'adminQuizCreate: invalid user id'}
    }
    if(nameLen(name) == false){
        return {error: 'adminQuizCreate: invalid quiz name length'}
    }
    if(isNameAlphaNumeric(name) == false){
        return {error: 'adminQuizCreate: quiz name contains invalid letters'}
    }
    if(description_length_valid(name) == false){
        return {error: 'adminQuizCreate: quiz description too long'}
    }
    if(isUsedQuizName(name) == true){
        return {error: 'adminQuizCreate: quiz name already used by another user'}
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

    setData(new_data);
    return {quizId}
}

export function adminQuizRemove( authUserId, quizId) {
    if(userIdValidator(authUserId) == false){
        return {error: 'adminQuizRemove: invalid user id'}
    }
    if(quizIdValidator(quizId) == false){
        return {error: 'adminQuizRemove: invalid quiz id'}
    }
    if(quizOwnership(authUserId, quizId) == false){
        return {error: 'adminQuizRemove: you do not own this quiz'}
    }

    return {}
}

export function adminQuizInfo( authUserId, quizId ) {
    if(userIdValidator(authUserId) == false){
        return {error: 'adminQuizInfo: invalid user id'}
    }
    if(quizIdValidator(quizId) == false){
        return {error: 'adminQuizInfo: invalid quiz id'}
    }
    if(quizOwnership(authUserId, quizId) == false){
        return {error: 'adminQuizInfo: you do not own this quiz'}
    }

    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',
    }
}

/*********************************************************************************************|
|*Given an admin user's "authUserId", return details about the user.                          |
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them**|
\*********************************************************************************************/
export function adminQuizList ( authUserId ) {
    return {
        quizzes: [
            {
                quizId: 1,
                name: 'My Quiz',
            }
        ]
    }
}


export function adminQuizNameUpdate(authUserId, quizId, name) {
    // Error checks
    if(!nameLen(name)) {
        return "error: 'Invalid name length'";
    }
    if(!isNameAlphaNumeric(name)) {
        return "error: 'Invalid character used in name'";
    }
    if(!userIdValidator(authUserId)) {
        return "error: 'User Id invalid'";
    }
    if(!quizIdValidator(quizId)) {
        return "error: 'Quiz Id invalid'";
    }
    if(!quizOwnership(authUserId, quizId)) {
        return "error: 'This user does not own this quiz'";
    }

    // If no errors then update name
    let wh_data = getData();
    let data_q = data.quizzes;

    data_q[quizId]['name'] = `${name}` ;
    wh_data.quizzes = data_q;

    setData(wh_data);

    return {}
}

export function adminQuizDescriptionUpdate(authUserId, quizId, description) {
    if(!description_length_valid(description)) {
        return "error: 'Description too long'";
    }
    if(!userIdValidator(authUserId)) {
        return "error: 'User Id invalid'";
    }
    if(!quizIdValidator(quizId)) {
        return "error: 'Quiz Id invalid'";
    }
    if(!quizOwnership(authUserId, quizId)) {
        return "error: 'This user does not own this quiz'";
    }

    let wh_data = getData();
    let data_q = wh_data.quizzes;

    data_q[quizId]['description'] = `${description}`;
    wh_data.quizzes = data_q;

    setData(wh_data);

    return {}
}

