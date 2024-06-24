import { setData } from './dataStore'

function clear() {
    const newData = {
        users : {},
        quizzes : {},
        quizzesDeleted : {},
        tokenUserIdList : {}
    }

    setData(newData);
    return {};
}

export { clear };