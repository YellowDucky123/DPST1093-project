import request from 'sync-request-curl';
import config from '../config.json';

const OK = 200;
//const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const port = config.port;
const url = config.url;
request('DELETE', `${url}:${port}/v1/clear`)
afterAll(() => {request('DELETE', `${url}:${port}/v1/clear`)})

describe('/v1/admin/quiz/List', () => {
  let token : {token : string}
  let user = {
    "email": "test@unsw.edu.au",
    "password": "testingUsed123",
    "nameFirst": "test",
    "nameLast": "test"
  }
  test("the one who doesn't logined", ()=>{
    let res = request('GET', `${url}:${port}/v1/admin/quiz/List`, {qs : token})
    expect(res.statusCode).toBe(TOKEN_ERROR)
    res = request('GET', `${url}:${port}/v1/admin/quiz/List`)
    expect(res.statusCode).toBe(TOKEN_ERROR)
  })
  test("the one with no quizzes", () => {
    let res = request('POST', `${url}:${port}/v1/admin/auth/register`, {json : user})
    token = JSON.parse(res.body as string)    
    res = request('GET', `${url}:${port}/v1/admin/quiz/List`, {qs : token})
    expect(res.statusCode).toBe(OK)
    expect(JSON.parse(res.body as string)).toEqual({quizzes : []})
  })
  test("the one with quizzes", () => {
    let res = request('POST', `${url}:${port}/v1/admin/quiz`, {json : {token : token.token, quizName : "test", description : ""}})
    let quizId = JSON.parse(res.body as string).quizId
    res = request('POST', `${url}:${port}/v1/admin/quiz`, {json : {token : token.token, quizName : "test1", description : ""}})
    let quizId1 = JSON.parse(res.body as string).quizId
    res = request('POST', `${url}:${port}/v1/admin/quiz`, {json : {token : token.token, quizName : "test2", description : ""}})
    let quizId2 = JSON.parse(res.body as string).quizId
    res = request('GET', `${url}:${port}/v1/admin/quiz/List`, {qs : token})
    expect(res.statusCode).toBe(OK)
    expect(JSON.parse(res.body as string)).toEqual({
      quizzes : [
        {quizId : quizId, name : "test"}, 
        {quizId : quizId1, name : "test1"}, 
        {quizId : quizId2, name : "test2"}
      ]
    })
  })
})