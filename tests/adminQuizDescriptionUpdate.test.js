import { adminQuizDescriptionUpdate } from '../src/quiz.js'
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
    data.users = {
        '123': {
            name: 'kelvin',
            authUserId: 123
        }
    }
    setData(data);
    expect(adminQuizDescriptionUpdate(124, 'quiz', 'kelvin')).toEqual("error: 'User Id invalid'");
});

test('Quiz Id Invalid test: ', () => {
    let data = getData();
    data.users = {
        123: {
            authUserId: 123
        }
    }
    data.quizzes = {
        '123': {
            quizId: 123
        },
        '145': {
            quizId: 145
        }
    }
    setData(data);
    expect(adminQuizDescriptionUpdate(123, 542, 'kelvin')).toEqual("error: 'Quiz Id invalid'");
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

    expect(adminQuizDescriptionUpdate(123, 145, 'kelvin')).toEqual("error: 'This user does not own this quiz'");
});

test('Description too long', () => {
    let input = [];
    for(let i = 0; i < 101; i++) {
        input += 'a';
    }
    expect(adminQuizDescriptionUpdate(123,145, input)).toEqual("error: 'Description too long'");
})

test('correct implementation: ', () => {
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
    let input = [];
    for(let i = 1; i <= 90; i++) {
        input = input + 'a';
    }
    expect(adminQuizDescriptionUpdate(123,145,input)).toEqual({});
})