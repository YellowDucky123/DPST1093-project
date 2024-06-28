import { adminQuestionCreate, adminQuizCreate } from './quiz'
import { adminAuthRegister } from './auth'
import { exit } from 'process';

let authid = adminAuthRegister('test@gmail.com', 'pa223ssd', 'kelvin', 'yoga');
if('error' in authid) {
    console.log(authid);
    exit;
}
console.log(authid)
let id = JSON.stringify(authid);
console.log(id.slice(14,19));
let qid = adminQuizCreate(parseInt(id), 'new name', 'dno');

console.log(adminQuestionCreate(parseInt(id), qid.quizId, {
    question: "Who is the Monarch of England?",
    duration: 4,
    points: 5,
    answers: [
        {
            answer: "Prince Charles",
            answerId
            correct: true
        }
    ]
}))