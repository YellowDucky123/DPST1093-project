import { setData } from './dataStore';

// clear the whole thing
export function clear() {
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
