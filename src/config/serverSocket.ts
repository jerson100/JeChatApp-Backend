import { Server } from "socket.io";
import { Server as ServerHttp } from "http";
import { Payload, verifyToken } from "../lib/jwt";
import { Friend } from "../types/Friend";
import FriendService from "../services/FriendService";
import { User } from "../types/User";
import HandlerRequestError from "../lib/handlerRequestError";

const sessionsStore: Map<string, Payload> = new Map();

interface ServerToClientEvents {
  login: (user: Payload) => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  changeStatusFriend: (friend: Friend) => void;
  removeRequest: (idFriend: string) => void;
  stateChangeInSearch: (friend: Friend) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  changeStatusFriend: (friend: Friend, toIdUser: string) => void;
  getRequest: (callback: (request: Friend[]) => void) => void;
  acceptRequest: (friend: Friend, callback: (error?: string) => void) => void;
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

      socket.join(socket.data.user._id); // room == idUser

      socket.emit("login", socket.data.user);

      socket.on("changeStatusFriend", (friend, toIdUser) => {
        const receiverUserId = friend.receiverUserId as User;
        const senderUserId = friend.senderUserId as User;
        if (friend.connected) {
          this.io
            .to([receiverUserId._id as string, senderUserId._id as string])
            .emit("removeRequest", friend._id as string);
        } else {
          socket.to(toIdUser).emit("changeStatusFriend", friend);
        }
        this.io
          .to([receiverUserId._id as string, senderUserId._id as string])
          .emit("stateChangeInSearch", friend);
      });

      socket.on("acceptRequest", async (friend, callback) => {
        if (!friend.connected) {
          try {
            const updatedFriend = await FriendService.updateFriend({
              _id: friend._id as string,
              connected: true,
            });
            const receiverUserId = updatedFriend.receiverUserId as User;
            const senderUserId = updatedFriend.senderUserId as User;
            this.io
              .to(receiverUserId._id.toString())
              .emit("removeRequest", updatedFriend._id as string);

            this.io
              .to([receiverUserId._id.toString(), senderUserId._id.toString()])
              .emit("stateChangeInSearch", updatedFriend);
            callback();
          } catch (e) {
            console.log(e);
            if (e instanceof HandlerRequestError) {
              callback(e.message);
            }
          }
        }
      });

      socket.on("getRequest", async (fn) => {
        const request = await FriendService.getRequestByIdUser(
          socket.data.user._id as string
        );
        fn(request);
      });

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
