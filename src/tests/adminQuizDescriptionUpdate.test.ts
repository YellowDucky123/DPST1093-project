import { adminQuizDescriptionUpdate } from '../quiz'
import { adminQuizCreate } from '../quiz';
import { adminAuthRegister } from '../auth';
import { clear } from '../other'

beforeEach(() => {
    clear();
});   

afterEach(() => {
    clear();
}); 


test('user Id Invalid test: ', () => {
    adminAuthRegister('test@email.com', 'testpass1', 'Kelvin', 'Yoga');
    expect(adminQuizDescriptionUpdate(124, 521, 'kelvin')).toEqual( { error: 'User Id invalid' });
});

test('Quiz Id Invalid test: ', () => {
    //make a quiz 
    const uid = adminAuthRegister('kelvin@email.com', 'testpass1', 'Kelvin', 'Yoga');
    if(!("authUserId" in uid)) {
        console.log("creating UserId  falsed")
        throw "create false"
    }
    const qid = adminQuizCreate(uid.authUserId, 'newQuiz', 'this is a description');



    expect(adminQuizDescriptionUpdate(uid.authUserId, qid.quizId + 1, 'kelvin')).toEqual({ error: 'Quiz Id invalid' });
});

test('User no ownership over quiz test: ', () => {
    const uid = adminAuthRegister('kelvin@email.com', 'testpass1', 'Kelvin', 'Yoga');
    if(!("authUserId" in uid)) {
        console.log("creating UserId  falsed")
        throw "create error"
    }
    adminQuizCreate(uid.authUserId, 'newQuiz', 'this is a description');


    //make another user to make another quiz, that first user does not have
    const uid2 = adminAuthRegister('new@email.com', 'testpass1', 'new', 'person');
    if(typeof uid2 == 'boolean') throw 'strange error';
    if("error" in uid2) throw "strange error";
    if(!("authUserId" in uid2)) {
        console.log("creating UserId  falsed")
        throw "create error"
    }
    const qid = adminQuizCreate(uid2.authUserId, 'newQuiz', 'this is a description');

    expect(adminQuizDescriptionUpdate(uid.authUserId, qid.quizId, 'kelvin')).toEqual({ error: 'This user does not own this quiz' });
});

test('Description too long', () => {
    let input: any = [];
    for(let i = 0; i < 101; i++) {
        input[i] += 'a';
    }
    expect(adminQuizDescriptionUpdate(123,145, input.toString())).toEqual( { error: 'Description too long'});
})

test('correct implementation: ', () => {
    // let data = getData();
    // data.users = {
    //     '123': {
    //         nameFirst : 'kelvin',
    //         nameLast  : 'yoga',

    //         authUserId : 123,
    //         email : 'kelvin@test.com',
    //         password : 'password',

    //         numSuccessfulLogins:  2,
    //         numFailedPasswordsSinceLastLogin : 0,

    //         quizzesUserHave : [145],
    //     }
    // } 
    // data.quizzes = {
    //     '145': {
    //         QuizId          : 145,
    //         name            : 'test',

    //         description     : 'description',

    //         timeCreated     : 1400,
    //         timeLastEdited  : 1500
    //     }
    // }

    const uid = adminAuthRegister('kelvin@email.com', 'testpass1', 'Kelvin', 'Yoga');
    if(!("authUserId" in uid)) {
        console.log("creating UserId  falsed")
        throw "create error"
    }
    const qid = adminQuizCreate(uid.authUserId, 'newQuiz', 'this is a description');

    let input: any = [];
    for(let i = 1; i <= 90; i++) {
        input = input + 'a';
    }

    expect(adminQuizDescriptionUpdate(uid.authUserId,qid.quizId,input.toString())).toEqual({});
})