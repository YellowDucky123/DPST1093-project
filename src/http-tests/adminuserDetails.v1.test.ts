import request from 'sync-request-curl';
import config from '../config.json';
import exp from 'constants';
import { parse } from 'path';

const OK = 200;
//const INPUT_ERROR = 400;
const TOKEN_ERROR = 401;
const port = config.port;
const url = config.url;
request('DELETE', `${url}:${port}/v1/clear`)
describe("Tests for 'get' /v1/admin/user/details", () => {
  let token1 = { token: "1" };
  // test when no token sent
  test("no token send", () => {
    const res = request('GET', `${url}:${port}/v1/admin/user/details`);
    let ans = JSON.parse(res.body as string)
    expect(ans).toEqual({ error: "A token is required" });
    expect(res.statusCode).toBe(401)
  })
  //test when token is not valid
  test("send unused token", () => {
    const res = request('GET', `${url}:${port}/v1/admin/user/details`, {qs : token1});
    let ans = JSON.parse(res.body as string)
    expect(ans).toEqual({ error: "token incorrect or not found" });
    expect(res.statusCode).toBe(401)
  })
  //test when token suitable
  test('Should return 200 OK', () => {
    let user = {
    "email": "test@unsw.edu.au",
    "password": "testingUsed123",
    "nameFirst": "test",
    "nameLast": "test"
    }
    let res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, { json: user });
    token1 = JSON.parse(res1.body as string);
    const res = request('GET', `${url}:${port}/v1/admin/user/details`, { qs: token1 });
    expect(res.statusCode).toBe(OK);
    let list = JSON.parse(res.body as string);
    expect("user" in list).toBe(true)
    let content = list.user
    expect(typeof content.userId).toBe("number");
    expect(content.name).toBe("test test");
    expect(content.email).toBe("test@unsw.edu.au");
    expect(content.numSuccessfulLogins).toBe(1);
    expect(content.numFailedPasswordsSinceLastLogin).toBe(0);
  })
})
request('DELETE', `${url}:${port}/v1/clear`)