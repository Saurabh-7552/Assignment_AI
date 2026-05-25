import 'dotenv/config';
import http from 'http';
import app from './app';
import { connectDb } from './config/db';
import { env } from './config/env';
import { initSocket } from './socket';
import { startAssignmentEventBridge } from './socket/assignment-events.bridge';

async function main(): Promise<void> {
  await connectDb();

  const httpServer = http.createServer(app);
  initSocket(httpServer);
  startAssignmentEventBridge();

  httpServer.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
