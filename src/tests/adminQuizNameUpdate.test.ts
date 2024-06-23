import { 
    adminQuizNameUpdate, 
    adminQuizCreate
} from '../quiz';
import { adminAuthRegister } from '../auth';
import { clear } from '../other';

beforeEach(() => {
    clear();
});   

afterEach(() => {
    clear();
}); 

test('user Id Invalid test: ', () => {
    adminAuthRegister('test@email.com', 'testpass', 'Kelvin', 'Yoga');
    expect(adminQuizNameUpdate(124, 521, 'kelvin')).toEqual( { error: 'User Id invalid' });
});

test('Quiz Id Invalid test: ', () => {
    //make a quiz 
    const uid = adminAuthRegister('kelvin@email.com', 'testpass', 'Kelvin', 'Yoga');
    if(typeof uid == 'boolean') throw 'strange error';
    if("error" in uid) throw "strange error";

    const qid = adminQuizCreate(uid.authUserId, 'newQuiz', 'this is a description');



    expect(adminQuizNameUpdate(uid.authUserId, qid.quizId + 1, 'kelvin')).toEqual({ error: 'Quiz Id invalid' });
});

test('User no ownership over quiz test: ', () => {
    const uid = adminAuthRegister('kelvin@email.com', 'testpass', 'Kelvin', 'Yoga');
    if(typeof uid == 'boolean') throw 'strange error';
    if("error" in uid) throw "strange error";

    adminQuizCreate(uid.authUserId, 'newQuiz', 'this is a description');


    //make another user to make another quiz, that first user does not have
    const uid2 = adminAuthRegister('new@email.com', 'testpass', 'new', 'person');
    if(typeof uid2 == 'boolean') throw 'strange error';
    if("error" in uid2) throw "strange error";

    const qid = adminQuizCreate(uid2.authUserId, 'newQuiz', 'this is a description');

    expect(adminQuizNameUpdate(uid.authUserId, qid.quizId, 'kelvin')).toEqual({ error: 'This user does not own this quiz' });
});

test('Name contains invalid characters test: ', () => {
    expect(adminQuizNameUpdate(123,124, 'k@#lvin')).toEqual({ error: 'Invalid character used in name' });
});

test('Name too short test: ', () => {
    expect(adminQuizNameUpdate(null, null, 'ke')).toEqual({ error: 'Invalid name length' });
});

test('Name too long test: ', () => {
    expect(adminQuizNameUpdate(null, null, 'lllllllllllllllllllllllllllllll')).toEqual({ error: 'Invalid name length' });
});

test('Correct implementation', () => {
    const uid = adminAuthRegister('kelvin@email.com', 'testpass', 'Kelvin', 'Yoga');
    if(typeof uid == 'boolean') throw 'strange error';
    if("error" in uid) throw "strange error";

    const qid = adminQuizCreate(uid.authUserId, 'newQuiz', 'this is a description');

    expect(adminQuizNameUpdate(uid.authUserId, qid.quizId, 'updated')).toEqual({});
})