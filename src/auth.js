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
function adminUserDetails(authUserId) {
    return { 
        user: {
          userId: 1,
          name: 'Jar Jar Brinks',
          email: 'mesasosorry@naboo.com.au',
          numSuccessfulLogins: 3,
          numFailedPasswordsSinceLastLogin: 1,
        }
    }
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
