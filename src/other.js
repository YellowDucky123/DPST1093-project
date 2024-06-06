import { setData } from './dataStore.js'

function clear() {
    console.log("clear");
    const newData = {
        users: {},
        quizzes: {}
    }

    setData(newData);
    return {};
}

export { clear };