import { adminUserDetails } from '../src/auth'
import { clear } from '../src/other.js'
import { adminAuthRegister } from '../src/auth';

clear();
var idfor86 = adminAuthRegister("86@163.com", "1111aaaa", "sin", "zano");
var idfor721 = adminAuthRegister("721@163.com", "ciallo111", "ning", "ning")

test("no such a member", () => {
  let i = 1
  for (i; i === idfor721.authUserId && i === idfor86.authUserId ; i++);
  expect(adminUserDetails(i)).toEqual({ error: "can not find such a member" });
})
test("get the detail of some one", () => {
  expect(adminUserDetails(idfor721.authUserId)).toEqual({
    user: {
      userId : idfor721.authUserId,
      name: "ning ning",
      email: "721@163.com",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  })
})
test("get detail of another one", () => {
  expect(adminUserDetails(idfor86.authUserId)).toEqual({
    user: {
      userId: idfor86.authUserId,
      name: "sin zano",
      email: "86@163.com",
      numSuccessfulLogin: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  })
})
clear()