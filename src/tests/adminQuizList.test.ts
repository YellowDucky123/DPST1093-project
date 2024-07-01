import { adminQuizList } from '../quiz';
import { adminAuthRegister } from '../auth';
import { adminQuizCreate } from '../quiz';
import { clear } from '../other';
clear();
const idfor86 = adminAuthRegister('86@163.com', '1111aaaa', 'sin', 'zano');
const idfor721 = adminAuthRegister('721@163.com', 'ciallo111', 'ning', 'ning');
const idforno = adminAuthRegister('aaa@163.con', '11111aaa', 'no', 'quiz');
if (!('authUserId' in idfor721)) throw Error;
if (!('authUserId' in idfor86)) throw Error;
if (!('authUserId' in idforno)) throw Error;

const quiz1for86 = adminQuizCreate(idfor86.authUserId, '1111', '');
const quiz2for86 = adminQuizCreate(idfor86.authUserId, '2222', '');
const quiz3for86 = adminQuizCreate(idfor86.authUserId, '3333', '');

const quiz1for721 = adminQuizCreate(idfor721.authUserId, '4444', '');
const quiz2for721 = adminQuizCreate(idfor721.authUserId, '5555', '');
if (typeof quiz1for721 === 'boolean' || typeof quiz1for86 === 'boolean' || typeof quiz2for721 === 'boolean' || typeof quiz2for86 === 'boolean' || typeof quiz3for86 === 'boolean') { if ('error' in quiz1for721 || 'error' in quiz1for86 || 'error' in quiz2for721 || 'error' in quiz2for86 || 'error' in quiz3for86) throw Error; }
let idfornoone = 1;

while (idfornoone === idfor721.authUserId || idfor86.authUserId === idfornoone || idforno.authUserId === idfornoone) idfornoone++;

test('no such a user', () => {
  expect(adminQuizList(idfornoone)).toEqual({ error: 'can not find such a member' });
});

test('quizzes for the one have no quiz', () => {
  if (!('authUserId' in idforno)) {
    console.log('creating UserId  falsed');
    throw Error;
  }
  expect(adminQuizList(idforno.authUserId)).toEqual({ quizzes: [] });
});
test('quizzes for the one have lot of quizzes', () => {
  if (typeof idfor86 === 'boolean') throw Error;
  if ('error' in idfor86) throw Error;
  if (!('authUserId' in idfor86)) {
    console.log('creating UserId  falsed');
    throw Error;
  }
  expect(adminQuizList(idfor86.authUserId)).toEqual({
    quizzes: [{
      name: '1111',
      quizId: quiz1for86.quizId
    },
    {
      name: '2222',
      quizId: quiz2for86.quizId
    },
    {
      name: '3333',
      quizId: quiz3for86.quizId
    }
    ]
  });
});
test('quizzes for the one have some quizzes', () => {
  if (typeof idfor721 === 'boolean') throw Error;
  if ('error' in idfor721) throw Error;
  if (!('authUserId' in idfor721)) {
    console.log('creating UserId  falsed');
    throw Error;
  }
  expect(adminQuizList(idfor721.authUserId)).toEqual({
    quizzes: [{
      name: '4444',
      quizId: quiz1for721.quizId
    },
    {
      name: '5555',
      quizId: quiz2for721.quizId
    }
    ]
  });
});
