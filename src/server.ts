import express, { json, Request, Response } from 'express';
import { findUserIdByToken, question, setDataStorebyJSON, setJSONbyDataStore } from './dataStore' ;
import { adminUserDetails, adminUserDetailsUpdate } from './auth';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { adminQuizList, adminQuizTransfer, adminQuestionCreate } from './quiz';
// set up data
setDataStorebyJSON()

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

app.get("/v1/admin/user/details",(req : Request, res : Response) => {
  let token = req.query.token as string
  if (!token) {
    res.status(401).json({error : "A token is required"})
    return;
  }
  let UserId;
  if (!(UserId = findUserIdByToken(token))) {
    res.status(401).json({error : "token incorrect or not found"})
  } else {
    let ans = adminUserDetails(UserId)
    if ("error" in ans) {
      res.status(401).json(ans)
    } else {
      res.status(200).json(ans)
    }
  }
})
app.get("/v1/admin/quiz/list",(req : Request, res : Response) => {
  let token = req.query.token as string
  if (!token) {
    res.status(401).json({error : "A token is required"})
    return;
  }
  let UserId;
  if (!(UserId = findUserIdByToken(token))) {
    res.status(401).json({error : "token incorrect or not found"})
  } else {
    let ans = adminQuizList(UserId)
    if ("error" in ans) {
      res.status(401).json(ans)
    } else {
      res.status(200).json(ans)
    }
  }
})
app.put("/v1/admin/user/details",(req : Request, res : Response) => {
  const token = req.body.token as string;
  const email = req.body.email as string;
  const nameFirst = req.body.nameFirst as string;
  const nameLast = req.body.nameLast as string;
  if (!token) {
    res.status(400).json({error : "A token is required"});
    return ;
  }
  if (!email || !nameFirst || !nameLast) {
    res.status(401).json({error : "Missing some contents"});
    return;
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({error : "token incorrect or not found"});
    return;
  }
  let ans = adminUserDetailsUpdate(UserId, email, nameFirst, nameLast)
  if ("error" in ans) {
    res.status(401).json(ans);
  } else {
    res.status(200).json(ans);
  }
})
app.post('/v1/admin/quiz/:quizid/transfer', (req : Request, res : Response) => {
  const token = req.body.token as string;
  const userEmail = req.body.userEmail as string;
  const quizId = parseInt(req.params.quizid);
  if (!token) {
    res.status(401).json({error : "A token is required"});
  }
  if (!quizId || !userEmail) {
    res.status(400).json({error : "Missing some contents"});
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
app.post('/v1/admin/quiz/:quizId/question', (req : Request, res : Response) => {
  const token = req.body.token as string;
  const questionBody : question = req.body.questionBody;
  const quizId = parseInt(req.params.quizId as string);
  if (!token) {
    res.status(401).json({error : "A correct token is required"});
  }
  if (!quizId || !questionBody) {
    res.status(400).json({error : "Missing some contents"});
  }
  const UserId = findUserIdByToken(token)
  if (!UserId) {
    res.status(401).json({error : "token incorrect or not found"});
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
