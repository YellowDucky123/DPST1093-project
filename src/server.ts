import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

//our imports below:
import { adminQuizNameUpdate,
         adminQuizDescriptionUpdate,
         deleteQuestion,
         moveQuestion,
         duplicateQuestion
} from './quiz';
import {adminAuthRegister, adminAuthLogin} from './auth';
import { tokenUserIdList, getData } from './dataStore';
import { ToktoId } from './helpers';
import { string } from 'yaml/dist/schema/common/string';

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
  const {email, password, nameFirst, nameLast} = req.body;
  const result = adminAuthRegister(email, password, nameFirst, nameLast);
  if ('error' in result) {
    res.status(400).json({error: `${result.error}`});
  }
  else {
    const token = Math.floor(10000 + Math.random() * 90000).toString();
    getData().tokenUserIdList.push({token: token, userId: result.authUserId});
    return res.status(200).json({token : token});
  }
});

// Log an admin user
app.post('/v1/admin/auth/login', async(req: Request, res: Response) => {
  const {email, password} = req.body;
  try {
    const result = adminAuthLogin(email, password);
    if ('error' in result) {
      return res.status(400).json({ error: `${result.error}`});
    }
    else {
      const token = Math.floor(10000 + Math.random() * 90000).toString();
      result.authUserId
      return res.status(200).json({token : token});
    }
  }
  catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({error: 'Server error'});
  }
})

//update quiz name
app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const newName = req.body.name;
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);
  
  let result = adminQuizNameUpdate(userId, quizId, newName);
  if('error' in result) {
    if(result.error === 'Invalid name length') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error === 'Invalid character used in name') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    if(result.error === 'Invalid name length') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error === 'Invalid character used in name') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error === 'User Id invalid') {
      res.status(401).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error === 'Quiz Id invalid') {
      res.status(401).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error === 'adminQuizCreate: quiz name already used by another user') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).send(JSON.stringify({}));
})

//update quiz description
app.put('/v1/admin/quiz/:quizId/description', (req: Request, res: Response) => {
app.put('/v1/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const newDescription = req.body.description;
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);
  let result = adminQuizDescriptionUpdate(userId, quizId, newDescription);

  if('error' in result) {
    if(result.error === 'Description too long') {
      res.status(400).send(JSON.stringify({ error: 'Description too long' }))
    }
    else if(result.error === 'User Id invalid') {
      res.status(401).send(JSON.stringify({ error: 'User Id invalid' }))
    }
    else if(result.error === 'Quiz Id invalid') {
      res.status(401).send(JSON.stringify({ error: 'Quiz Id invalid' }))
    }
    else if(result.error === 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: 'This user does not own this quiz' }))
    }
  }
  res.status(200).send(JSON.stringify({}));
})

//duplicate question
app.post('/v1/admin/quiz/:quizId/question/:questionId/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);

  let result = duplicateQuestion(userId, quizId, questionId);
  if('error' in result) {
    if(result.error == 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error == 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
})

//delete question
app.delete('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.body.token;
  const userId: number = findUserIdByToken(token);

  let result = deleteQuestion(userId, quizId, questionId);
  if('error' in result) {
    if(result.error == 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error == 'This user does not own this quiz') {
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
    if(result.error == 'Question Id does not refer to a valid question within this quiz') {
      res.status(400).send(JSON.stringify({ error: `${result.error}` }));
    }
    else if(result.error == 'This user does not own this quiz') {
      res.status(403).send(JSON.stringify({ error: `${result.error}` }));
    }
  }
  res.status(200).send(JSON.stringify({}));
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
  server.close(() => console.log('Shutting down server gracefully.'));
});
