import express, { Application } from 'express';
import initPages from './pages';
import './shared/database';

const app: Application = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');
initPages(app);

app.listen(8080, () => {
  console.log('App is listening on port 8080!');
});
