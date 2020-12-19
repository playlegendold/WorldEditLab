import express, { Application, Request, Response } from 'express';

const app: Application = express();
app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
  res.render('index', { message: 'Welcome to WorldEditLab!' });
});

app.listen(8080, () => {
  console.log('App is listening on port 8080!');
});
