import request from 'sync-request-curl';
import config from '../config.json';
import { adminQuizNameUpdate } from '../quiz';

const OK = 200;
const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

describe('Update Quiz Name http test: ', () => {
    test('test succesfull: ', () => {
        const res = request(
            'PUT',
            SERVER_URL + '/v1/admin/quiz/:quizId/name',
            {
                json: {

                }
            }
        )
        const result = JSON.parse(res.body as string);
        expect(res.statusCode).toBe(OK);
        expect(result).toStrictEqual({});
    });

    test('invalid questionId: ', () => {
        const res = request(
            'PUT',
            SERVER_URL + '/v1/admin/quiz/:quizId/name',
            {
                json: {

                }
            }
        )
    })
});
