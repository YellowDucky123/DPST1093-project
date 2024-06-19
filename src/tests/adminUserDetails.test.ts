import { adminUserDetails } from '../auth'
import { clear } from '../other'
import { adminAuthRegister } from '../auth';

clear();
var idfor86 = adminAuthRegister("86@163.com", "1111aaaa", "sin", "zano");
var idfor721 = adminAuthRegister("721@163.com", "ciallo111", "ning", "ning")
if (typeof idfor721 === "boolean" || typeof idfor86 === "boolean") throw "strange error"
if( "error" in idfor721 || "error" in idfor86) throw "strange error"

test("no such a member", () => {
  if (typeof idfor721 === "boolean" || typeof idfor86 === "boolean") throw "strange error"
  if( "error" in idfor721 || "error" in idfor86) throw "strange error"
  let i = 1
  for (i; i === idfor721.authUserId || i === idfor86.authUserId ; i++);
  expect(adminUserDetails(i)).toEqual({ error: "can not find such a member" });
})
test("get the detail of some one", () => {
  if (typeof idfor721 === "boolean") throw "strange error"
  if( "error" in idfor721) throw "strange error"
  expect(adminUserDetails(idfor721.authUserId)).toEqual({
    user: {
      userId : idfor721.authUserId,
      name: "ning ning",
      email: "721@163.com",
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  })
})
test("get detail of another one", () => {
  if ( typeof idfor86 === "boolean") throw "strange error"
  if( "error" in idfor86) throw "strange error"
  expect(adminUserDetails(idfor86.authUserId)).toEqual({
    user: {
      userId: idfor86.authUserId,
      name: "sin zano",
      email: "86@163.com",
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  })
})
