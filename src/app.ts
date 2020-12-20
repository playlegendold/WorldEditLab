import express, { Application } from 'express';
import bodyParser from 'body-parser';
import initPages from './pages';
import './shared/database';
import { initAuth } from './shared/auth';

const app: Application = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

initAuth(app);

app.set('view engine', 'ejs');
initPages(app);

app.listen(8080, () => {
  console.log('App is listening on port 8080!');
});
