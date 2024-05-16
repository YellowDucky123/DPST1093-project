function someNewFeature(array) {
    for (const item of array) {
        console.log(item);
    }
}

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