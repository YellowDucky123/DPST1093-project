/*
export type Id = number;


export type user = {
  name : string,
  nameFirst? : string,
  nameLast ? : string,

  authUserId : number,
  email : string,
  password : string,

  numSuccessfulLogins:  number,                 // This should be 0 at first
  numFailedPasswordsSinceLastLogin: number,     // This should be 0 at first
  
  quizzesUserHave : Id[],

  pastPassword : string[];
}

export type users = {
  [authUserId : number] : user;
}

export type quiz = {
  quizId : number,
  name : string,

  description? : string | undefined | null,

  timeCreated : number,
  timeLastEdited : number  
};

export type quizzes = {
  [quizId : number] : quiz
};

export type data = { 
  users : users,
  quizzes : quizzes 
};

*/
let data /*: data*/  = {
  users : {},
  quizzes : {}
};
//////////////////////////////////////////////////////////////////
////DATA DEFINE FINISHED //////////////// DATA DEFINE FINISHED////
//////////////////////////////////////////////////////////////////
// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData) {
  data = newData;
}

export { getData, setData };
