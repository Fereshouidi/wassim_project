import { io } from "socket.io-client";

export const socketFromVercel = "https://wassim-project-back-end.vercel.app";
export const socketFromCodeIp = "http://10.207.213.49:3001"
export const socketFromLocalHost = "http://localhost:3001"

const socket = io(socketFromVercel, {
  autoConnect: true,
  // transports: ["websocket"]
});

export default socket;
