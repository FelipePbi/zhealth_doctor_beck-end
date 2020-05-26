import './bootstrap';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';

import routes from './routes';
import './database';

// Limite de 200 Request a cada 10 min.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
});

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(logger('dev'));
    this.server.use(limiter);
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(bodyParser.urlencoded({ extended: false }));
  }

  routes() {
    this.server.use('/api', routes);
  }
}

export default new App().server;
