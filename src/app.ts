import express, {
  Application, NextFunction, Request, Response,
} from 'express';
import { urlencoded, json } from 'body-parser';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { initPages } from './pages';
import './shared/database';
import { initAuth } from './shared/auth';
import { errorHandler } from './shared/helpers/errorHandler';

dotenv.config();

const app: Application = express();

if (process.env.NODE_ENV === 'production') {
  app.use(((req: Request, res: Response, next: NextFunction) => {
    const firstPathArgument = req.url.substr(1).split(/\//)[0].toLowerCase();
    const cachePaths = ['images', 'scripts', 'styles'];
    if (cachePaths.includes(firstPathArgument)) {
      res.setHeader('Cache-Control', 'public, max-age=900');
      res.setHeader('Expires', new Date(Date.now() + 900).toUTCString());
    }
    next();
  }));
}

app.use(express.static('public'));
app.use(fileUpload({
  abortOnLimit: true,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}));
app.use(urlencoded({ extended: true }));
app.use(json());

initAuth(app);

app.set('view engine', 'ejs');
initPages(app);

app.use(errorHandler);

const { PORT = 8080 } = process.env;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
