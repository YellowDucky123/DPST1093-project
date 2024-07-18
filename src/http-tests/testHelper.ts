import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

// Register user function for http testing.
// Returns token, if error occurs, return the result
export function registerUser(email: string, password: string, nameFirst: string, nameLast: string) {
    const res = request(
        'POST',
        SERVER_URL + '/v1/admin/auth/register',
        {
            json: {
                email: email,
                password: password,
                nameFirst: nameFirst,
                nameLast: nameLast
            }
        }
    );
    const token = JSON.parse(res.body as string).token;
  
    if('error' in res) {
        return res;
    } else {
        return token;
    }
}
  