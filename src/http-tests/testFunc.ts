import request from 'sync-request-curl';
import config from '../config.json';
import { QuizSessionAction } from '../dataStore';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

export function testRegisterUser(email: string, password: string, nameFirst: string, nameLast: string) {
    const res = request(
        'POST',
        SERVER_URL + '/v1/admin/auth/register',
        {
            json: {
                email: email,
                password: password,
                nameFirst: nameFirst,
                nameLast: nameLast
            }
        }
    );
    const token = JSON.parse(res.body as string).token;

    if ('error' in res) {
        return res;
    } else {
        return token;
    }
}

export function testCreateQuiz(token: string, name: string, description: string) {
    const result = request(
        'POST',
        SERVER_URL + '/v2/admin/quiz',
        {
            headers: {
                token: token
            },
            json: {
                name: name,
                description: description
            }
        }
    );

    return result;
}

export function testAdminLogout(token: string) {
    const result = request(
        'POST',
        SERVER_URL + '/v2/admin/auth/logout',
        {
            headers: {
                token: token
            }
        }
    );

    return result;
}

export function testAdminUserPassword(token: string, oldPassword: string, newPassword: string) {
    const result = request(
        'PUT',
        SERVER_URL + '/v2/admin/user/password',
        {
            headers: {
                token: token
            },
            json: {
                oldPassword: oldPassword,
                newPassword: newPassword
            }
        }
    );

    return result;
}

export function testUpdateThumbnail(token: string, quizId: number, imgUrl: string) {
    const result = request(
        'PUT',
        SERVER_URL + '/v1/admin/quiz/' + quizId + '/thumbnail',
        {
            headers: {
                token: token
            },
            json: {
                quizId: quizId,
                imgUrl: imgUrl
            }
        }
    );

    return result;
}

export function testCreateQuestion(token: string, quizId: number, questionBody: object) {
    const result = request(
        'POST',
        SERVER_URL + '/v2/admin/quiz/' + quizId + '/question',
        {
            headers: {
                token: token
            },
            json: {
                quizId: quizId,
                questionBody: questionBody
            }
        }
    );

    return result;
}

export function testStartSession(token: string, quizId: number, autoStartNum: number) {
    const result = request(
        'POST',
        SERVER_URL + '/v1/admin/quiz/' + quizId + '/session/start',
        {
            headers: {
                token: token
            },
            json: {
                quizId: quizId,
                autoStartNum: autoStartNum
            }
        }
    );

    return result;
}

export function testSessionState(token: string, quizId: number, sessionId: number, action: QuizSessionAction) {
    const result = request(
        'PUT',
        SERVER_URL + '/v1/admin/quiz/' + quizId + '/session/' + sessionId,
        {
            headers: {
                token: token
            },
            json: {
                quizId: quizId,
                sessionId: sessionId,
                action: action
            }
        }
    );

    return result;
}

export function testQuizInfo(token: string, quizId: number) {
    const result = request(
        'GET',
        SERVER_URL + '/v2/admin/quiz/' + quizId,
        {
            headers: {
                token: token
            },
            json: {
                quizId: quizId
            }
        }
    );

    return result;
}

export function testSessionInfo(token: string, quizId: number, sessionId: number) {
    const result = request(
        'GET',
        SERVER_URL + '/v1/admin/quiz/' + quizId + '/session/' + sessionId,
        {
            headers: {
                token: token
            },
            json: {
                quizId: quizId,
                sessionId: sessionId
            }
        }
    );

    return result;
}

export function testListSessions(token: string, quizId: number) {
    const result = request(
        'GET',
        SERVER_URL + '/v1/admin/quiz/' + quizId + '/sessions',
        {
            headers: {
                token: token
            },
            json: {
                quizId: quizId
            }
        }
    );

    return result;
}

export function testJoinSession(sessionId: number, name: string) {
    const result = request(
        'POST',
        SERVER_URL + '/v1/player/join',
        {
            json: {
                sessionId: sessionId,
                name: name
            }
        }
    );

    return result;
}

export function testSubmitAnswer(playerId: number, questionPosition: number, answerIds: number[]) {
    const result = request(
        'PUT',
        SERVER_URL + '/v1/player/' + playerId + '/question/' + questionPosition + '/answer',
        {
            json: {
                playerId: playerId,
                questionPosition: questionPosition,
                answerIds: answerIds
            }
        }
    );

    return result;
}

export function playerStatus(playerId: number, questionPosition: number, answerIds: number[]) {
    const result = request(
        'PUT',
        SERVER_URL + '/v1/player/' + playerId + '/question/' + questionPosition + '/answer',
        {
            json: {
                playerId: playerId,
                questionPosition: questionPosition,
                answerIds: answerIds
            }
        }
    );

    return result;
}