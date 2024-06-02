import { getData, setData } from './dataStore.js'
import { userIdValidator } from './helpers.js'
import { quizIdValidator } from './helpers.js'
import { quizOwnership } from './helpers.js'
import { isNameAlphaNumeric } from './helpers.js'
import { nameLen } from './helpers.js'
import { description_length_valid } from './helpers.js'

export function adminQuizCreate( authUserId, name, description ) {
    return {
        quizId: 2
    }
}

export function adminQuizRemove( authUserId, name, description ) {
    return {}
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

export function adminQuizInfo( authUserId, quizId ) {
    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',
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
    let data_q = wh_data.quizzes;

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

