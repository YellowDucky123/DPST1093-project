import { adminAuthRegister, adminUserPasswordUpdate } from "../src/auth";

let idForPasswordShort = adminAuthRegister("PasswordToShort@163.com", "a111111", "Password", "Short");
let idForPasswordNumOnly = adminAuthRegister("PasswordOnlynum@163.com", "1111111111111111111111", "Password", "OnlyNumber")
let idForPasswordcharacterOnly = adminAuthRegister("PasswordOnlyChar@163.com", "aaaaaaaaaaaaaaaa", "Password", "OnlyChar" )
let idForCommonOne = adminAuthRegister("commonMan@163.com", "Suitable123", "common", "human")

test("Change password correctly", ()=>{
  expect(adminUserPasswordUpdate(idForCommonOne, "Suitable123", "suitable456")).toEqual({});
})