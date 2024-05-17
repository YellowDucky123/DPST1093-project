```javascript
let data = {
    users : {
        user/*I suggest use authUserId as key*/ : { 
            
            //name : nameFirst + nameLast,
            nameFirst : string,
            nameLast  : string,

            authUserId : number,
            email : string,
            password : string,

            numSuccessfulLogins:  number,
            numFailedPasswordsSinceLastLogin : number,

            quizzesUserHave : ['quizId1', 'quizId2', .......],
        },
        user2 : {
            /*
                just like the upper one
            */
        }
    },
    quizzes : {
        quiz1 /*I suggest use quizId as keys*/ : {
            QuizId          : number,
            nume            : string,

            description     : string,

            timeCreated     : number/time,
            timeLastEdited  : number/time
        },
        quiz2 : {
            /*
                just like the upper one
            */
        }
    }
    // TODO: insert your data structure that contains 
    // users + quizzes here
}
```

[Optional] short description: 

# 1. namePart :
# name = nameFirst + namelast       # User's fullname    # this is the description for user name
# name          :   string          # name of quiz       # this is the description for a quiz
# nameFrist     :   string          # User's firstname
# nameLast      :   string          # User's lastname

# 2. authenticationPart:
# email         :   string          # User's email
# password      :   string          # User's password
# nameFirst     :   string          # User's firstname
# nameLast      :   string          # User's lastname
# authUserId    :   number          # User's Id
# numSuccessfulLogins:  number      # I guess just like the description of name
# numFailedPasswordsSinceLastLogin : number     # I guess just like the description of name
# user          :   struct          # The return value of fuction 'adminUserDetails'

# 3. QuizPart :
# quizId        :   number          # Quiz's Id
# Description   :   string          # Description for Quiz (?) (As my assume)
# quizzes       :   struct          # The return value of function 'adminQuizList'

# 4. TimePart :
# timeCreated   :   number/time     # When did the Quiz created
# timeLastEdited:   number/time     # When did the Quiz be edited

# 5. structurePart :
#       1. quizzes   # the quizzes we have recorded, apart of data
# quizzes : {
#   QuizId          : number,
#   name            : string,
#   description     : string,
#   timeCreated     : number/time,
#   timeLastEdited  : number/time
# },
#       2. user     # the user that we have recoirded, apart of users
# user : {
#   nameFirst : string,
#   nameLast  : string,
#
#   authUserId : number,
#   email : string,
#   password : string,
#
#   numSuccessfulLogins:  number,
#   numFailedPasswordsSinceLastLogin : number,
#
#   quizzesUserHave : ['quizId1', 'quizId2', .......],
# }
#       3. users     # a list of user
# users : {
#   user1 : {
#       /*datas that a user have*/
#   }
#   user2 : {
#       /*datas that a user have*/
#   }
#   ...........
#   ...........
# }
#       4. data      # this is the space for us to save datas, All datas could be saved here and then be used efficiently
# data : {
#    users : {
#       /*datas that users contain*/
#    },
#   quizzes : {
#       /*datas that quizzes contain*/ 
#   }
# }
#       #####the struct below just to introduce the struct that functions return, which are different with upper 
#       5. quizzes   # the return value of function adminQuizList # this is difference with the struct before
#   quizzes : [
#    {
#       {
#           quizId: number,
#           name: string,
#       }
#    },
#    ........ ,
#    ........ ,
# ]
#       6. user      # the return value of function adminUserDetails, which contain a part of the imformation of user #  this is difference with the struct before
# user : {
#   userId                              : number,
#   name                                : string, # this is fullname which is nameFirst + nameLast
#   email                               : string,
#   numSuccessfulLogins                 : number,
#   numFailedPasswordsSinceLastLogin    : number,
# }
#       7. return value of fuction adminQuizInfo
# { quizId: 1,
#   name: 'My Quiz',
#   timeCreated: 1683125870,
#   timeLastEdited: 1683125871,
#   description: 'This is my quiz',
# }