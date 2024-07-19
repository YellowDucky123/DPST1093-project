import request from 'sync-request-curl';
import config from '../config.json';

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
  
    if('error' in res) {
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

export function testUpdateThumbnail(token: string, quizId: number, imgUrl: string) {
    const result = request(
        'PUT',
        SERVER_URL + '/v1/admin/quiz/'+quizId+'/thumbnail',
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
        SERVER_URL + '/v2/admin/quiz/'+quizId+'/question',
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
        SERVER_URL + '/v1/admin/quiz/'+quizId+'/session/start',
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

export function testSessionState(token: string, quizId: number, sessionId: number, action: string) {
    const result = request(
        'PUT',
        SERVER_URL + '/v1/admin/quiz/'+quizId+'/session/'+sessionId,
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