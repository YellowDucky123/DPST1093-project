import { setData } from './dataStore.js'

function clear() {
    const newData = {
        users: {},
        quizzes: {}
    }

    setData(newData);
    return {};
}

export { clear };