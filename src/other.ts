import { setData } from './dataStore';

function clear() {
  const newData = {
    users: {},
    quizzes: {},
    quizzesDeleted: {},
    tokenUserIdList: {},
    Sessions: {},
    playerData: {}
  };

  setData(newData);
  return {};
}

export { clear };
