// import { Id } from "./dataStore.ts"
import { setData, getData } from "./dataStore.js";
function someNewFeature(array) {
    for (const item of array) {
        console.log(item);
    }
}

/*********************************************************************************************|
|*Given an admin user's "authUserId", return details about the user.                         *|
|*********************************************************************************************|
|*attention: "name" is the first and last name concatenated with a single space between them *|
|*********************************************************************************************/

export function adminUserDetails(authUserId) {
    let dataStore = getData();
    let data = dataStore.users[authUserId];
    if (data === undefined) {
        return {error : "can not find such a member"};
    }
    if (user.name === undefined) {
        user.name = user.nameFirst + " " + nameLast;
    }
    return {
        user : {
          userId: data.authUserId,
          name: data.name,
          email: data.email,
          numSuccessfulLogin: data.numSuccessfulLogin,
          numFailedPasswordsSinceLastLogin: data.numFailedPasswordsSinceLastLogin,
        }
    };
}

function adminAuthRegister(email, password, nameFirst, nameLast) {
    return {
        authUserId: 1
    };
}

function adminAuthLogin(email, password) {
    return {
        authUserId: 1
    };
}
