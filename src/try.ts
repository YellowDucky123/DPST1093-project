import request from 'sync-request-curl';
import config from './config.json';


const port = config.port;
const url = config.url;
const path = url + ":" + port;

request('POST', path + '/v1/admin/auth/register', {
  json : {
    "email": "hayden.smith@unsw.edu.au",
    "password": "haydensmith123",
    "nameFirst": "Hayden",
    "nameLast": "Smith"
  }
})
