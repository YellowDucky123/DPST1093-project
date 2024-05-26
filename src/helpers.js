import { getData } from './dataStore.js'

export function userIdValidator(UserId) {
    let wh_data = getData();
    let data = wh_data.users;
    for(const i in data) {
        if(data[i]['authUserId'] === UserId) {
            return true;
        }
    }

    console.log("error: 'User Id invalid'");

    return false;
}

export function quizIdValidator(quizId) {
    let wh_data = getData();
    let data = wh_data.quizzes;
    for(const i in data) {
        if(data[i][QuizId] === quizId) {
            return true;
        }
    }

    console.log("error: 'Quiz Id invalid'");

    return false;
}

export function quizOwnership(userId, quizId) {
    let wh_data = getData();
    let q_data = wh_data.quizzes;
    let owned_quizzes = wh_data.users.userId.quizzesUserHave;
    let flag = 0;

    for(const i in q_data) {
        if(`${i}` == quizId) {
            let q_name = q_data[i]['name'];

            for(const n of owned_quizzes) {
                if(n == q_name) return true;
            }
            
            console.log("error 'This user does not own this quiz'");
            return false;
        }
    }
}