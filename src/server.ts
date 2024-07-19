import express, { json, Request, Response } from 'express';
import {
  findUserIdByToken,
  question,
  setDataStorebyJSON,
  setJSONbyDataStore,
  getData,
  checkDuplicateToken,
  findTokenByUserId
} from './dataStore';
import {
  adminUserDetails,
  adminUserDetailsUpdate,
  adminAuthRegister,
  adminAuthLogin,
  adminAuthLogout,
  adminUserPasswordUpdate
} from './auth';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import {
  adminQuizList,
  adminQuizTransfer,
  adminQuestionCreate,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  deleteQuestion,
  moveQuestion,
  duplicateQuestion,
  adminQuizRemove,
  adminQuizInfo,
  adminViewDeletedQuizzes,
  adminRestoreQuiz,
  adminQuizPermDelete,
  adminQuizQuestionUpdate,
  adminQuizCreate,
  updateQuizThumbnail,
  questionResults,
  allMessagesInSession,
  sendChat,
  statusPlayer,
  currentQuestionPosition,
  answerSubmission,
  playerResults
} from './quiz';
import {
  getCSVFormatResult,
  getSessionResult,
  getSessionStatus,
  listSessions,
  newPlayerJoinSession,
  startSession
} from './session';

import { updateSesionState } from './updateSessionState_fn';
// set up data
setDataStorebyJSON();
// our imports below:

import { clear } from './other';
import HTTPError from 'http-errors';
import { quizIdValidator, quizOwnership, sessionIdValidator } from './helpers';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.body.token as string;
  if (!token) {
    return res.status(401).json({ error: 'A token is required' });
  }
  const ans = adminAuthLogout(token);
  if ('error' in ans) {
    return res.status(401).json(ans);
  }
  return res.status(200).json(ans);
});

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.header('token');
  if (!token) {
    throw HTTPError(401, 'A token is required');
  }
  const ans = adminAuthLogout(token);
  if ('error' in ans) {
    throw HTTPError(401, ans.error);
  }
  res.status(200).json(ans);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const oldPassword = req.body.oldPassword as string;
  const newPassword = req.body.newPassword as string;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing some contents' });
  }
  if (!token) {
    return res.status(401).json({ error: 'A token is required' });
  }
  const userId = findUserIdByToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'the token is incorrect or not found' });
  }
  const ans = adminUserPasswordUpdate(userId, oldPassword, newPassword);
  if ('error' in ans) {
    return res.status(400).json(ans);
  }
  return res.status(200).json(ans);
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const token = req.header('token');
  const oldPassword = req.body.oldPassword as string;
  const newPassword = req.body.newPassword as string;
  if (!oldPassword || !newPassword) {
    throw HTTPError(400, 'Missing some contents');
  }
  if (!token) {
    throw HTTPError(401, 'A token is required');
  }
  const userId = findUserIdByToken(token);
  if (!userId) {
    throw HTTPError(401, 'the token is incorrect or not found');
  }
  const ans = adminUserPasswordUpdate(userId, oldPassword, newPassword);
  if ('error' in ans) {
    throw HTTPError(400, ans.error);
  }
  res.status(200).json(ans);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  clear();
  res.status(200).json({});
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    res.status(401).json({ error: 'A token is required' });
    return;
  }
  let UserId;
  if (!(UserId = findUserIdByToken(token))) {
    res.status(401).json({ error: 'token incorrect or not found' });
  } else {
    const ans = adminUserDetails(UserId);
    if ('error' in ans) {
      res.status(401).json(ans);
    } else {
      res.status(200).json(ans);
    }
  }
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  if (!token) {
    throw HTTPError(401, 'A token is required');
  }
  let UserId;
  if (!(UserId = findUserIdByToken(token))) {
    throw HTTPError(401, 'token incorrect or not found');
  } else {
    const ans = adminUserDetails(UserId);
    if ('error' in ans) {
      throw HTTPError(401, 'token incorrect or not found');
    } else {
      res.status(200).json(ans);
    }
  }
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    res.status(401).json({ error: 'A token is required' });
    return;
  }
  let UserId;
  if (!(UserId = findUserIdByToken(token))) {
    res.status(401).json({ error: 'token incorrect or not found' });
  } else {
    const ans = adminQuizList(UserId);
    if ('error' in ans) {
      res.status(401).json(ans);
    } else {
      res.status(200).json(ans);
    }
  }
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  if (!token) {
    throw HTTPError(401, 'A token is required');
  }
  let UserId;
  if (!(UserId = findUserIdByToken(token))) {
    throw HTTPError(401, 'token incorrect or not found');
  } else {
    const ans = adminQuizList(UserId);
    if ('error' in ans) {
      throw HTTPError(401, ans.error);
    } else {
      res.status(200).json(ans);
    }
  }
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const email = req.body.email as string;
  const nameFirst = req.body.nameFirst as string;
  const nameLast = req.body.nameLast as string;
  if (!token) {
    res.status(401).json({ error: 'A token is required' });
    return;
  }
  if (!email || !nameFirst || !nameLast) {
    res.status(400).json({ error: 'Missing some contents' });
    return;
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
    return;
  }
  const ans = adminUserDetailsUpdate(UserId, email, nameFirst, nameLast);
  if ('error' in ans) {
    res.status(400).json(ans);
  } else {
    res.status(200).json(ans);
  }
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const email = req.body.email as string;
  const nameFirst = req.body.nameFirst as string;
  const nameLast = req.body.nameLast as string;
  if (!token) {
    throw HTTPError(401, 'A token is required');
  }
  if (!email || !nameFirst || !nameLast) {
    throw HTTPError(400, 'Missing some contents');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'token incorrect or not found');
  }
  const ans = adminUserDetailsUpdate(UserId, email, nameFirst, nameLast);
  if ('error' in ans) {
    throw HTTPError(400, ans.error);
  } else {
    res.status(200).json(ans);
  }
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const userEmail = req.body.userEmail as string;
  const quizId = parseInt(req.params.quizid);
  if (!token) {
    res.status(401).json({ error: 'A token is required' });
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
  }
  if (!quizId) {
    res.status(403).json({ error: 'You must provide a quizId' });
    return;
  }
  if (!userEmail) {
    res.status(400).json({ error: 'You must provide a valid email' });
    return;
  }

  const ans = adminQuizTransfer(quizId, UserId, userEmail);
  let status = 200;
  if ('error' in ans) {
    if (ans.error === 'You do not own this quiz') {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
});

app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const userEmail = req.body.userEmail as string;
  const quizId = parseInt(req.params.quizid);
  if (!token) {
    throw HTTPError(401, 'A token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'token incorrect or not found');
  }
  if (!quizId) {
    throw HTTPError(403, 'You must provide a quizId');
  }
  if (!userEmail) {
    throw HTTPError(400, 'You must provide a valid email');
  }
  const ans = adminQuizTransfer(quizId, UserId, userEmail);

  if ('error' in ans) {
    if (ans.error === 'You do not own this quiz') {
      throw HTTPError(403, ans.error);
    } else {
      throw HTTPError(400, ans.error);
    }
  }
  res.status(200).json(ans);
});
app.post('/v1/admin/quiz/:quizId/question', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const questionBody: question = req.body.questionBody;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({ error: 'A correct token is required' });
  }
  if (!quizId || !questionBody) {
    res.status(400).json({ error: 'Missing some contents' });
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
    return;
  }
  const ans = adminQuestionCreate(UserId, quizId, questionBody);
  let status = 200;
  if ('error' in ans) {
    if (ans.error === 'This user does not own this quiz') {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
});

app.post('/v2/admin/quiz/:quizId/question', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const questionBody: question = req.body.questionBody;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  if (!quizId || !questionBody) {
    throw HTTPError(400, 'Missing some contents');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'token incorrect or not found');
  }
  const ans = adminQuestionCreate(UserId, quizId, questionBody);
  if ('error' in ans) {
    if (ans.error === 'This user does not own this quiz') {
      throw HTTPError(403, ans.error);
    } else {
      throw HTTPError(400, ans.error);
    }
  }
  res.status(200).json(ans);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req : Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const sessionid = parseInt(req.params.sessionid);
  if (!token) throw HTTPError(401, 'a token is required');
  const userid = findUserIdByToken(token);
  if (!userid) throw HTTPError(401, 'token not correct');
  if (quizId === undefined) throw HTTPError(403, 'a quizid is required');
  if (sessionid === undefined) throw HTTPError(400, 'a sessionid is required');
  const ans = getSessionStatus(userid, quizId, sessionid);
  res.status(200).json(ans);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid/results', (req : Request, res : Response) => {
  const token = req.headers.token as string;
  const quizid = parseInt(req.params.quizid);
  const sessionid = parseInt(req.params.sessionid);

  if (!token) throw HTTPError(401, 'a token is required');
  const userid = findUserIdByToken(token);
  if (!userid) throw HTTPError(401, 'token invalid');

  if (!quizid) throw HTTPError(403, 'a quizid is required');
  if (!sessionid) throw HTTPError(400, 'a sessionid is required');

  const ans = getSessionResult(userid, quizid, sessionid);
  res.status(200).json(ans);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid/results/csv', (req : Request, res : Response) => {
  const token = req.headers.token as string;
  const quizid = parseInt(req.params.quizid);
  const sessionid = parseInt(req.params.sessionid);

  if (!token) throw HTTPError(401, 'a token is required');
  const userid = findUserIdByToken(token);
  if (!userid) throw HTTPError(401, 'token invalid');

  if (!quizid) throw HTTPError(403, 'a quizid is required');
  if (!sessionid) throw HTTPError(400, 'a sessionid is required');

  const csvlink = getCSVFormatResult(userid, quizid, sessionid);
  res.status(200).json(csvlink);
});

app.get('/v1/download/:filename', (res : Response, req : Request) => {
  const filename = req.params.filename;
  res.download(`./result/csv/${filename}`, filename, (err) => {
    if (err) throw HTTPError(404, 'file not found');
  });
});

app.post('/v1/player/join', (req : Request, res : Response) => {
  const sessionid = parseInt(req.body.sessionId);
  const userName = req.body.name as string;
  if (sessionid === undefined) throw HTTPError(400, 'a sessionid is required');
  if (userName === undefined) throw HTTPError(400, 'a username is required');
  return res.json(newPlayerJoinSession(sessionid, userName));
  // res.status(200).json(ans)
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const name = req.body.name as string;
  const description = req.body.description as string;
  if (!token) {
    res.status(401).json({ error: 'A correct token is required' });
    return;
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
    return;
  }
  const ans = adminQuizCreate(UserId, name, description);
  let status = 200;
  if ('error' in ans) {
    status = 400;
  }
  res.status(status).json(ans);
});

// Version 2: adminQuizCreate
app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const name = req.body.name as string;
  const description = req.body.description as string;
  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(adminQuizCreate(UserId, name, description));
});

app.delete('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.query.quizId as string);
  if (!token) {
    res.status(401).json({ error: 'A correct token is required' });
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
    return;
  }
  const ans = adminQuizRemove(UserId, quizId);
  let status = 200;
  if ('error' in ans) {
    status = 403;
  }
  res.status(status).json(ans);
});

// Version 2: adminQuizRemove
app.delete('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.query.quizId as string);
  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(adminQuizRemove(UserId, quizId));
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    res.status(401).json({ error: 'A correct token is required' });
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
    return;
  }
  const ans = adminViewDeletedQuizzes(UserId);
  let status = 200;
  if ('error' in ans) {
    status = 401;
  }
  res.status(status).json(ans);
});

// Version 2: View deleted quizzes
app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(adminViewDeletedQuizzes(UserId));
});

app.get('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({ error: 'A correct token is required' });
    return;
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
    return;
  }
  const ans = adminQuizInfo(UserId, quizId);
  let status = 200;
  if ('error' in ans) {
    if (ans.error === 'adminQuizInfo: you do not own this quiz') {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
});

// Version 2: adminQuizInfo
app.get('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(adminQuizInfo(UserId, quizId));
});

app.post('/v1/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({ error: 'A correct token is required' });
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
    return;
  }
  const ans = adminRestoreQuiz(UserId, quizId);
  let status = 200;
  if ('error' in ans) {
    if (ans.error === 'adminRestoreQuiz: you do not own this quiz') {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
});

// Version 2: adminQuizRestore
app.post('/v2/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(adminRestoreQuiz(UserId, quizId));
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizIds = (req.query.quizIds as string[]).map(Number);
  if (!token) {
    res.status(401).json({ error: 'A correct token is required' });
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    res.status(401).json({ error: 'token incorrect or not found' });
    return;
  }
  const ans = adminQuizPermDelete(UserId, quizIds);
  let status = 200;
  if ('error' in ans) {
    if (ans.error === 'adminQuizPermDelete: you do not own this quiz') {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
});

// Version 2: adminQuizPermDelete
app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizIds = (req.query.quizIds as string[]).map(Number);
  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(adminQuizPermDelete(UserId, quizIds));
});
// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  const ret = echo(data);
  if ('error' in ret) {
    res.status(400);
  }
  return res.json(ret);
});

// Register a new admin user
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const result = adminAuthRegister(email, password, nameFirst, nameLast);
  if ('error' in result) {
    res.status(400).json(result);
  } else {
    let token = Math.floor(10000 + Math.random() * 90000).toString();
    while (checkDuplicateToken(token)) {
      token = Math.floor(10000 + Math.random() * 90000).toString();
    }
    if ('authUserId' in result) {
      getData().tokenUserIdList[token] = result.authUserId;
    }
    return res.status(200).json({ token: token });
  }
});

app.post('/v2/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const result = adminAuthRegister(email, password, nameFirst, nameLast);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    let token = Math.floor(10000 + Math.random() * 90000).toString();
    while (checkDuplicateToken(token)) {
      token = Math.floor(10000 + Math.random() * 90000).toString();
    }
    if ('authUserId' in result) {
      getData().tokenUserIdList[token] = result.authUserId;
    }
    return res.status(200).json({ token: token });
  }
});

// Log an admin user

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = adminAuthLogin(email, password);
  if ('error' in result) {
    return res.status(400).json(result);
  } else {
    let token = findTokenByUserId(result.authUserId);
    if (!token) {
      token = Math.floor(10000 + Math.random() * 90000).toString();
      while (checkDuplicateToken(token)) {
        token = Math.floor(10000 + Math.random() * 90000).toString();
      }
    }
    getData().tokenUserIdList[token] = result.authUserId;
    return res.status(200).json({ token: token });
  }
});

app.post('/v2/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = adminAuthLogin(email, password);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  } else {
    let token = findTokenByUserId(result.authUserId);
    if (!token) {
      token = Math.floor(10000 + Math.random() * 90000).toString();
      while (checkDuplicateToken(token)) {
        token = Math.floor(10000 + Math.random() * 90000).toString();
      }
    }
    getData().tokenUserIdList[token] = result.authUserId;
    return res.status(200).json({ token: token });
  }
});

// Update quiz question
app.put('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const { token, questionBody } = req.body;
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }
  const userId = findUserIdByToken(token);
  if (!userId) {
    return res.status(403).json({ error: 'This user does not own this quiz' });
  }
  const result = adminQuizQuestionUpdate(userId, quizId, questionId, questionBody, token);
  if ('error' in result) {
    return res.status(400).json(result);
  }
  return res.status(200).json(result);
});

// Update quiz question
app.put('/v2/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const questionBody = req.body;
  const token = req.header('token');
  if (!token) {
    throw HTTPError(401, 'Token not found');
  }
  const userId = findUserIdByToken(token);
  if (!userId) {
    throw HTTPError(403, 'This user does not own this quiz');
  }
  const result = adminQuizQuestionUpdate(userId, quizId, questionId, questionBody, token);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.status(200).json(result);
});

// update quiz name
app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const newName = req.body.name;
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);

  const result = adminQuizNameUpdate(userId, quizId, newName);
  if ('error' in result) {
    if (!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    } else if (result.error === 'Invalid name length') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'Invalid character used in name') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === "New name can't be the same") {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'User Id invalid') {
      res.status(401).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'Quiz Id invalid') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'adminQuizCreate: quiz name already used by another user') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).json({});
});

// update quiz name version2
app.put('/v2/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const newName = req.body.name;
  const token = req.headers.token as string;
  const userId: number = findUserIdByToken(token);

  return res.json(adminQuizNameUpdate(userId, quizId, newName));
});

// update quiz description version 1
app.put('/v1/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const newDescription = req.body.description;
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);
  const result = adminQuizDescriptionUpdate(userId, quizId, newDescription);

  if ('error' in result) {
    if (!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    } else if (result.error === 'Description too long') {
      res.status(400).send(JSON.stringify({ error: 'Description too long' }));
    } else if (result.error === 'User Id invalid') {
      res.status(401).send(JSON.stringify({ error: 'User Id invalid' }));
    } else if (result.error === 'Quiz Id invalid') {
      res.status(403).send(JSON.stringify({ error: 'Quiz Id invalid' }));
    } else if (result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: 'This user does not own this quiz' }));
    }
  }
  res.status(200).send(JSON.stringify({}));
});

// update quiz description version 2
app.put('/v2/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const newDescription = req.body.description;
  const token = req.headers.token as string;
  const userId: number = findUserIdByToken(token);
  return res.json(adminQuizDescriptionUpdate(userId, quizId, newDescription));
});

// duplicate question version 1
app.post('/v1/admin/quiz/:quizId/question/:questionId/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);

  const result = duplicateQuestion(userId, quizId, questionId);
  if ('error' in result) {
    if (!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    } else if (result.error === 'Quiz Id invalid') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).send(JSON.stringify(result));
});

// duplicate question version 2
app.post('/v2/admin/quiz/:quizId/question/:questionId/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.headers.token as string;
  const userId: number = findUserIdByToken(token);

  return res.json(duplicateQuestion(userId, quizId, questionId));
});

// delete question version 1
app.delete('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = String(req.query.token);
  const userId: number = findUserIdByToken(token);

  const result = deleteQuestion(userId, quizId, questionId);
  if ('error' in result) {
    if (!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    } else if (result.error === 'Quiz Id invalid') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).send(JSON.stringify({}));
});

// delete question version 2
app.delete('/v2/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.headers.token as string;
  const userId: number = findUserIdByToken(token);

  return res.json(deleteQuestion(userId, quizId, questionId));
});

// move quiz question version 1
app.put('/v1/admin/quiz/:quizId/question/:questionId/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.body.token;
  const newPosition = req.body.newPosition;
  const userId: number = findUserIdByToken(token);

  const result = moveQuestion(userId, quizId, questionId, newPosition);
  if ('error' in result) {
    if (!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    } else if (result.error === 'Quiz Id invalid') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === 'Invalid new position') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    } else if (result.error === "Can't move to the same position") {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).send(JSON.stringify({}));
});

// move quiz question version 2
app.put('/v2/admin/quiz/:quizId/question/:questionId/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.headers.token as string;
  const newPosition = req.body.newPosition;
  const userId: number = findUserIdByToken(token);

  return res.json(moveQuestion(userId, quizId, questionId, newPosition));
});

// -------------------------------------- Iteration 3 ------------------------------------

app.put('/v1/admin/quiz/:quizId/thumbnail', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizId);
  const imgUrl = req.body.imgUrl as string;

  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(updateQuizThumbnail(UserId, quizId, imgUrl));
});

app.get('/v1/admin/quiz/:quizId/sessions', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizId);

  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(listSessions(UserId, quizId));
});

app.post('/v1/admin/quiz/:quizId/session/start', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizId);
  const autoStartNum = parseInt(req.body.autoStartNum);

  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return res.json(startSession(UserId, quizId, autoStartNum));
});

// update the session's state
app.put('/v1/admin/quiz/:quizId/session/:sessionId', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizId);
  const sessionId = parseInt(req.params.sessionId);
  const action = req.body.action;

  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const userId = findUserIdByToken(token);

  if (quizIdValidator(quizId) === false) {
    throw HTTPError(403, 'Quiz does not exist');
  }
  if (quizOwnership(userId, quizId) === false) {
    throw HTTPError(403, 'You do not own this quiz');
  }
  if (sessionIdValidator(sessionId) === false) {
    throw HTTPError(400, 'Invalid sessionid');
  }

  return res.json(updateSesionState(sessionId, action));
});

// return question results
app.get('/v1/player/:playerId/question/:questionPosition/results', (req: Request, res: Response) => {
  const token = req.headers.token as string;

  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'token incorrect or not found');
  }

  const { playerId, questionPosition } = req.params;
  return questionResults(parseInt(playerId), parseInt(questionPosition));
});

// views all messages in the session
app.get('/v1/player/:playerId/chat', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const playerId = parseInt(req.params.playerId);

  if (!findUserIdByToken(token)) {
    throw HTTPError(401, 'token incorrect or not found');
  }

  return allMessagesInSession(playerId);
});

// player sends a chat message
app.post('/v1/player/:playerId/chat', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const playerId = parseInt(req.params.playerId);
  const messageBody = req.body.message;
  console.log(messageBody);
  if (!token) {
    throw HTTPError(401, 'A correct token is required');
  }
  const UserId = findUserIdByToken(token);
  if (!UserId) {
    throw HTTPError(401, 'Token incorrect or not found');
  }

  return sendChat(playerId, messageBody.message);
});

// Victor's part

// Status of guest player in session
app.get('/v1/player/:playerId', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const token = req.header('token');
  if (!findUserIdByToken(token)) {
    throw HTTPError(401, 'token incorrect or not found');
  }
  const result = statusPlayer(playerId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.status(200).json(result);
});

app.get('/v1/player/:playerId/question:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const questionPosition = parseInt(req.params.questionposition);
  const token = req.header('token');
  if (!findUserIdByToken(token)) {
    throw HTTPError(401, 'token incorrect or not found');
  }
  const result = currentQuestionPosition(playerId, questionPosition);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.status(200).json(result);
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const questionPosition = parseInt(req.params.questionPosition);
  const answerIds = (req.body.answerIds as string[]).map(Number);

  const result = answerSubmission(playerId, questionPosition, answerIds);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.status(200).json(result);
});

app.get('/v1/player/:playerId/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const token = req.header('token');
  if (!findUserIdByToken(token)) {
    throw HTTPError(401, 'token incorrect or not found');
  }
  const result = playerResults(playerId);
});
// --------------------------------------------------------------------------
// rids the server of everything
app.delete('/v2/clear', (req: Request, res: Response) => {
  return res.json(clear());
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    setJSONbyDataStore();
    console.log('Shutting down server gracefully.');
  });
});
