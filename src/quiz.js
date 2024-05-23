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
    return {}
}

export function adminQuizDescriptionUpdate(authUserId, quizId, description) {
    return {}
}

