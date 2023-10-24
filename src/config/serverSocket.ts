import { Server } from "socket.io";
import { Server as ServerHttp } from "http";
import { Payload, verifyToken } from "../lib/jwt";

const sessionsStore: Map<string, Payload> = new Map();

interface ServerToClientEvents {
  login: (user: Payload) => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  user: Payload;
}

export default class ServerSocket {
  private io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  constructor(server: ServerHttp) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    this.addMiddlewares();
    this.addEvents();
  }

  addEvents() {
    this.io.on("connection", (socket) => {
      console.log("New client connected", socket.data.user._id);

      socket.join(socket.data.user._id);

      socket.emit("login", socket.data.user);

      socket.on("disconnect", async () => {
        const matchingSockets = await this.io
          .in(socket.data.user._id)
          .allSockets();
        const isDisconnectedAll = matchingSockets.size === 0;
        if (isDisconnectedAll) {
          console.log("user disconnected", socket.data.user._id);
          sessionsStore.delete(socket.data.user._id);
        }
      });
    });
  }

  addMiddlewares() {
    this.io.use((socket, next) => {
      const idUser = socket.handshake.auth.user;
      const payload = verifyToken(idUser);
      if (!payload) return next(new Error("Authentication error"));
      const user = sessionsStore.get(payload._id);
      if (!user) {
        sessionsStore.set(payload._id, payload);
      }
      socket.data.user = payload;
      next();
    });
  }
}
