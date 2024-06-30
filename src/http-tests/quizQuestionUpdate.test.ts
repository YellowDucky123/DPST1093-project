import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { getData } from '../dataStore';
import { get } from 'http';

const SERVER_URL = `${url}:${port}`;
const adminUserRegister = `${SERVER_URL}/v1/admin/auth/register`;
const createNewQuiz = `${SERVER_URL}/v1/admin/quiz`;
beforeAll(() => {
    request('DELETE', SERVER_URL + '/v1/clear');
});

beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear');
})

describe('Quiz question update', () => {
    test('should return 200, correct input', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
            token: token,
            questionBody: {
                question: "hello word",
                duration: 9,
                points: 4,
                answers: [
                    {
                        answer: "yess",
                        correct: true
                    },
                    {
                        answer: "nos",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(200);
        expect(result).toStrictEqual({});
    });

    test('should return 400, icorrect questionId input', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;


        let new_details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes2",
                        correct: true
                    },
                    {
                        answer: "no2",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId + 1}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'Question Id does not refer to a valid question within this quiz' });
    });

    test('should return 400, incorrect question length', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
            token: token,
            questionBody: {
                question: "h",
                duration: 9,
                points: 4,
                answers: [
                    {
                        answer: "yess",
                        correct: true
                    },
                    {
                        answer: "nos",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'Question string is less than 5 characters in length or greater than 50 characters in length' });
    });

    test('should return 400, incorrect answer length', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;

        let new_details = {
            token: token,
            questionBody: {
                question: "hello new world",
                duration: 9,
                points: 4,
                answers: [
                    {
                        answer: "yess",
                        correct: true
                    },
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'The question has more than 6 answers or less than 2 answers' });
    });

    test('should return 400, question duration is not a positive number', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;


        let new_details = {
            token: token,
            questionBody: {
                question: "hello new world",
                duration: -9,
                points: 4,
                answers: [
                    {
                        answer: "yess",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'The question duration is not a positive number' });
    });

    test('should return 400, question duration is not a positive number', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
            token: token,
            questionBody: {
                question: "hello new world",
                duration: 181,
                points: 4,
                answers: [
                    {
                        answer: "yess",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes' });
    });

    test('should return 400, incorrect points awarded for the question', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
            token: token,
            questionBody: {
                question: "hello new world",
                duration: 23,
                points: 0,
                answers: [
                    {
                        answer: "yess",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'The points awarded for the question are less than 1 or greater than 10' });
    });

    test('should return 400, incorrect length for the answer', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
            token: token,
            questionBody: {
                question: "hello new world",
                duration: 23,
                points: 2,
                answers: [
                    {
                        answer: "",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'An answer string is less than 1 character in length or greater than 50 characters in length' });
    });

    test('should return 400, answer strings are duplicate', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'There are duplicate answers in this question' });
    });

    test('should return 400, there is no correct answers', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
            token: token,
            questionBody: {
                question: "hello  new world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: false
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(400);
        expect(result).toStrictEqual({ error: 'There is no correct answer in this question' });
    });

    test('should return 401, not found token', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(401);
        expect(result).toStrictEqual({ error: 'Token not found' });
    });

    test('should return 403, This user does not own this quiz', () => {

        const user = {
            email: 'test@163.com',
            password: '123456aaaa',
            nameFirst: 'Victor',
            nameLast: 'Xiao'
        }
        let response = request('POST', adminUserRegister, {
            json: user
        });
        let token = JSON.parse(response.body as string).token;

        let quiz_data = {
            "token": token,
            "name": "My Quiz Name",
            "description": "A description of my quiz"
        }
        let quiz_res = request('POST', createNewQuiz, {
            json: quiz_data
        })
        let quiz_id = JSON.parse(quiz_res.body as string).quizId;

        let details = {
            token: token,
            questionBody: {
                question: "hello world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        let createQuizRes = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question`, {
            json: details
        })
        let questionId = JSON.parse(createQuizRes.body as string).questionId;



        let new_details = {
            token: token + 1,
            questionBody: {
                question: "hello  new world",
                duration: 10,
                points: 5,
                answers: [
                    {
                        answer: "yes",
                        correct: true
                    },
                    {
                        answer: "no",
                        correct: false
                    }
                ]
            }
        }
        const res = request('PUT', SERVER_URL + `/v1/admin/quiz/${quiz_id}/question/${questionId}`, {
            json: new_details
        });

        let result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(403);
        expect(result).toStrictEqual({ error: 'This user does not own this quiz' });
    });
})