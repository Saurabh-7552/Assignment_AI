import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error-handler';
import { env } from './config/env';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;
