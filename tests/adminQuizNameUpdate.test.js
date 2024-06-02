import { adminQuizNameUpdate } from '../src/quiz.js'
import { getData, setData } from '../src/dataStore.js'
import { clear } from '../src/other.js'

beforeEach(() => {
    clear();
});   

afterEach(() => {
    clear();
}); 

test('user Id Invalid test: ', () => {
    let data = getData();
    data.users.user1 = {
        name: 'kelvin',
        authUserId: 123
    }
    setData(data);
    expect(adminQuizNameUpdate(124, 'quiz', 'kelvin')).toEqual("error: 'User Id invalid'");
});

test('Quiz Id Invalid test: ', () => {
    let data = getData();
    data.users = {
        123: {
            authUserId: 123
        }
    }
    data.quizzes = {
        quiz1: {
            quizId: 123
        },
        quiz2: {
            quizId: 145
        }
    }
    setData(data);
    expect(adminQuizNameUpdate(123, 542, 'kelvin')).toEqual("error: 'Quiz Id invalid'");
});

test('User no ownership over quiz test: ', () => {
    let data = getData();
    data.users = {
        '123': {
            authUserId: 123,
            quizzesUserHave : ['124']
        }
    }
    data.quizzes = {
        '124': {
            quizId: 124
        },
        '145': {
            quizId: 145
        }
    }
    setData(data);

    expect(adminQuizNameUpdate(123, 145, 'kelvin')).toEqual("error: 'This user does not own this quiz'");
});

test('Name contains invalid characters test: ', () => {
    expect(adminQuizNameUpdate(123,124, 'k@#lvin')).toEqual("error: 'Invalid character used in name'");
});

test('Name too short test: ', () => {
    expect(adminQuizNameUpdate(null, null, 'ke')).toEqual("error: 'Invalid name length'");
});

test('Name too long test: ', () => {
    expect(adminQuizNameUpdate(null, null, 'lllllllllllllllllllllllllllllll')).toEqual("error: 'Invalid name length'");
});

test('Correct implementation', () => {
    let data = getData();
    data.users = {
        '123': {
            nameFirst : 'kelvin',
            nameLast  : 'yoga',

            authUserId : 123,
            email : 'kelvin@test.com',
            password : 'password',

            numSuccessfulLogins:  2,
            numFailedPasswordsSinceLastLogin : 0,

            quizzesUserHave : [145],
        }
    } 
    data.quizzes = {
        '145': {
            QuizId          : 145,
            name            : 'test',

            description     : 'description',

            timeCreated     : 1400,
            timeLastEdited  : 1500
        }
    }

    expect(adminQuizNameUpdate(123, 145, 'updated')).toEqual({});
})