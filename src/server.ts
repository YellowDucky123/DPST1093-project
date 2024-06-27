import express, { json, Request, Response } from 'express';
import {
  findUserIdByToken,
  question,
  setDataStorebyJSON,
  setJSONbyDataStore,
  getData,
  setData
} from './dataStore';
import { adminUserDetails, adminUserDetailsUpdate, adminAuthRegister, adminAuthLogin, adminUserPasswordUpdate } from './auth';
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
  adminQuizCreate
} from './quiz';
// set up data
setDataStorebyJSON()
//our imports below:
import { clear } from './other';

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

app.delete("/v1/clear", (req:Request, res : Response) => {
  clear()
  res.status(200).json({})
})

app.get("/v1/admin/user/details", (req: Request, res: Response) => {
  let token = req.query.token as string
  if (!token) {
    res.status(401).json({ error: "A token is required" })
    return;
  }
  let UserId;
  if (!(UserId = findUserIdByToken(token))) {
    res.status(401).json({ error: "token incorrect or not found" })
  } else {
    let ans = adminUserDetails(UserId)
    if ("error" in ans) {
      res.status(401).json(ans)
    } else {
      res.status(200).json(ans)
    }
  }
})
app.get("/v1/admin/quiz/list", (req: Request, res: Response) => {
  let token = req.query.token as string
  if (!token) {
    res.status(401).json({ error: "A token is required" })
    return;
  }
  let UserId;
  if (!(UserId = findUserIdByToken(token))) {
    res.status(401).json({ error: "token incorrect or not found" })
  } else {
    let ans = adminQuizList(UserId)
    if ("error" in ans) {
      res.status(401).json(ans)
    } else {
      res.status(200).json(ans)
    }
  }
})
app.put("/v1/admin/user/details", (req: Request, res: Response) => {
  const token = req.body.token as string;
  const email = req.body.email as string;
  const nameFirst = req.body.nameFirst as string;
  const nameLast = req.body.nameLast as string;
  if (!token) {
    res.status(400).json({ error: "A token is required" });
    return;
  }
  if (!email || !nameFirst || !nameLast) {
    res.status(401).json({ error: "Missing some contents" });
    return;
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({ error: "token incorrect or not found" });
    return;
  }
  let ans = adminUserDetailsUpdate(UserId, email, nameFirst, nameLast)
  if ("error" in ans) {
    res.status(401).json(ans);
  } else {
    res.status(200).json(ans);
  }
})
app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const userEmail = req.body.userEmail as string;
  const quizId = parseInt(req.params.quizid);
  if (!token) {
    res.status(401).json({ error: "A token is required" });
  }
  if (!quizId || !userEmail) {
    res.status(400).json({ error: "Missing some contents" });
    return;
  }
  const UserId = findUserIdByToken(token)
  const ans = adminQuizTransfer(quizId, UserId, userEmail);
  let status = 200;
  if ("error" in ans) {
    if (ans.error === "You do not own this quiz") {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
})
app.post('/v1/admin/quiz/:quizId/question', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const questionBody: question = req.body.questionBody;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({ error: "A correct token is required" });
  }
  if (!quizId || !questionBody) {
    res.status(400).json({ error: "Missing some contents" });
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({ error: "token incorrect or not found" });
    return;
  }
  const ans = adminQuestionCreate(UserId, quizId, questionBody);
  let status = 200;
  if ("error" in ans) {
    if (ans.error === "This user does not own this quiz") {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
})

app.post('/v1/admin/quiz/', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const name = req.body.name as string;
  const description = req.body.description as string;
  if (!token) {
    res.status(401).json({ error: "A correct token is required" });
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({ error: "token incorrect or not found" });
    return;
  }
  const ans = adminQuizCreate(UserId, name, description);
  let status = 200;
  if ("error" in ans) {
    if (ans.error === "Quiz name or descrption invalid") {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
})

app.delete('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({ error: "A correct token is required" });
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({ error: "token incorrect or not found" });
    return;
  }
  const ans = adminQuizRemove(UserId, quizId);
  let status = 200;
  if ("error" in ans) {
    if (ans.error === "This user does not own this quiz") {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
})

app.get('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({ error: "A correct token is required" });
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({ error: "token incorrect or not found" });
    return;
  }
  const ans = adminQuizInfo(UserId, quizId);
  let status = 200;
  if ("error" in ans) {
    if (ans.error === "This user does not own this quiz") {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
})

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.body.token as string;
  if (!token) {
    res.status(401).json({ error: "A correct token is required" });
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({ error: "token incorrect or not found" });
    return;
  }
  const ans = adminViewDeletedQuizzes(UserId);
  let status = 200;
  if ("error" in ans) {
    if (ans.error === "UserId invalid") {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
})

app.post('/v1/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({ error: "A correct token is required" });
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({ error: "token incorrect or not found" });
    return;
  }
  const ans = adminRestoreQuiz(UserId, quizId);
  let status = 200;
  if ("error" in ans) {
    if (ans.error === "UserId invalid") {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
})

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({ error: "A correct token is required" });
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({ error: "token incorrect or not found" });
    return;
  }
  const ans = adminQuizPermDelete(UserId, quizId);
  let status = 200;
  if ("error" in ans) {
    if (ans.error === "UserId invalid") {
      status = 403;
    } else {
      status = 400;
    }
  }
  res.status(status).json(ans);
})

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
    res.status(400).json({ error: `${result.error}` });
  }
  else {
    const token = Math.floor(10000 + Math.random() * 90000).toString();
    if ("authUserId" in result) {
      getData().tokenUserIdList[token] = result.authUserId;
      return res.status(200).json({ token: token });
    }
  }
});

// Log an admin user
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = adminAuthLogin(email, password);
  if ('error' in result) {
    return res.status(400).json({ error: `${result.error}` });
  }
  else {
    const token = Math.floor(10000 + Math.random() * 90000).toString();
    getData().tokenUserIdList[token] = result.authUserId;
    return res.status(200).json({ token: token });
  }
})

// Log out an admin user
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const userId = findUserIdByToken(token);
  if (!userId) {
    return res.status(401).json({ error: "Token is empty or invalid (does not refer to valid logged in user session)" });
  }
  let data = getData()
  delete(data.tokenUserIdList[token]);
  setData(data);
  return res.status(200).json({});
})

// Update the password of this admin user.
app.put('/v1/admin/auth/password', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const oldPassword = req.body.oldPassword as string;
  const newPassword = req.body.newPassword as string;
  const userId = findUserIdByToken(token);
  if (!userId) {
    return res.status(401).json({ error: "Token is empty or invalid (does not refer to valid logged in user session)" });
  }
  const ans = adminUserPasswordUpdate(userId, oldPassword, newPassword);
  let status = 200;
  if ("error" in ans) {
    status = 400;
  }
  return res.status(status).json(ans);
})

//update quiz name
app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const newName = req.body.name;
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);

  let result = adminQuizNameUpdate(userId, quizId, newName);
  if('error' in result) {
    if(!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    }
    else if (result.error === 'Invalid name length') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if (result.error === 'Invalid character used in name') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if (result.error === 'User Id invalid') {
      res.status(401).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error === 'Quiz Id invalid') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if (result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if (result.error === 'adminQuizCreate: quiz name already used by another user') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).json({});
})

//update quiz description
app.put('/v1/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const newDescription = req.body.description;
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);
  let result = adminQuizDescriptionUpdate(userId, quizId, newDescription);

  if('error' in result) {
    if(!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    }
    else if(result.error === 'Description too long') {
      res.status(400).send(JSON.stringify({ error: 'Description too long' }))
    }
    else if (result.error === 'User Id invalid') {
      res.status(401).send(JSON.stringify({ error: 'User Id invalid' }))
    }
    else if(result.error === 'Quiz Id invalid') {
      res.status(400).send(JSON.stringify({ error: 'Quiz Id invalid' }))
    }
    else if (result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: 'This user does not own this quiz' }))
    }
  }
  res.status(200).send(JSON.stringify({}));
})

// Update quiz question
app.put('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const { token, questionBody } = req.body;
  const userId = findUserIdByToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'userId not found' });
  }  
  let result = adminQuizQuestionUpdate(userId, quizId, questionId, questionBody);
  let status = 200;
  if ('error' in result) {
    if (result.error == 'This user does not own this quiz') {
      status = 403;
    } else {
      status = 400;
    }
  }
  return res.status(status).json(result);
})

//duplicate question
app.post('/v1/admin/quiz/:quizId/question/:questionId/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);

  let result = duplicateQuestion(userId, quizId, questionId);
  if('error' in result) {
    if(!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    }
    else if(result.error == 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if (result.error == 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).send(JSON.stringify({}));
})

//delete question
app.delete('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);

  let result = deleteQuestion(userId, quizId, questionId);
  if('error' in result) {
    if(!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    }
    else if(result.error == 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if (result.error == 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).send(JSON.stringify({}));
})

//move quiz question
app.put('/v1/admin/quiz/:quizId/question/:questionId/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.body.token;
  const newPosition = req.body.newPosition;
  const userId: number = findUserIdByToken(token);

  let result = moveQuestion(userId, quizId, questionId, newPosition);
  if('error' in result) {
    if(!findUserIdByToken(token)) {
      res.status(401).send(JSON.stringify({ error: 'Token is empty or invalid' }));
    }
    else if(result.error == 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if (result.error == 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).send(JSON.stringify({}));
})

//rids the server of everything
app.delete('/v1/clear', (req: Request, res: Response) => {
  let result = clear();
  res.status(200).send(JSON.stringify(result));
})

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
    setJSONbyDataStore()
    console.log('Shutting down server gracefully.')
  });
});
