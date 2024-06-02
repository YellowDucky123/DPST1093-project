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
    data.users.user1 = {
        name: 'kelvin',
        authUserId: 123
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
        quiz1: {
            quizId: 123
        },
        quiz2: {
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