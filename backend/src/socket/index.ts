import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env';
import { SOCKET_EVENTS } from '../types';
import { setSocketServer } from './events';

export function initSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on(SOCKET_EVENTS.JOIN, ({ assignmentId }: { assignmentId: string }) => {
      if (assignmentId) {
        socket.join(`assignment:${assignmentId}`);
      }
    });
  });

  setSocketServer(io);
  return io;
}
