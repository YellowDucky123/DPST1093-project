import request from 'sync-request-curl';
import config from './config.json';
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

const res = request(
  'PUT',
  SERVER_URL + `/v1/admin/quiz/${qId.quizId}/name`,
  {
    json: {
      token: tId.token,
      quizId: qId.quizId,
      name: 'new name'
    },
    timeout: 100
  }
);
const result = JSON.parse(res.body as string);