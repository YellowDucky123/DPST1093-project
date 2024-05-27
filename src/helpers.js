import { getData } from './dataStore.js'

export function userIdValidator(UserId) {
    let wh_data = getData();
    let data = wh_data.users;
    for(const i in data) {
        let id = parseInt(i);
        if(id === UserId) {
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
        let id = parseInt(i);
        if(id === quizId) {
            return true;
        }
    }

    console.log("error: 'Quiz Id invalid'");

    return false;
}

export function quizOwnership(userId, quizId) {
    let wh_data = getData();
    let q_data = wh_data.quizzes;
    let owned_quizzes = wh_data['users'][userId]['quizzesUserHave'];
    let flag = 0;

    for(const i in q_data) {
        if(`${i}` == quizId) {
            let q_name = q_data[i]['name'];

            for(const n of owned_quizzes) {
                if(n == q_name) return true;
            }
            
            console.log("error: 'This user does not own this quiz'");
            return false;
        }
    }
}

export function nameLen(name) {
    if(name.length < 3) {
        return false;
    }
    else if(name.length > 30) {
        return false;
    }

    return true;
}

export function isNameAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123) && // lower alpha (a-z)
          !(code == ' ')) { // space ' '
        console.log("error: 'Invalid character used in name'");   
        return false;
      }
    }
    return true;
  };