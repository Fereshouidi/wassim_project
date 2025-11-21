import { io } from "socket.io-client";

const fromVercel = "https://wassim-project-back-end.onrender.com/api";
const fromCodeIp = "http://192.168.10.148:3001/api"
const fromLocalHost = "http://localhost:3001/api"

// export const socketFromVercel = "https://wassim-project-back-end.vercel.app";
// export const socketFromCodeIp = "http://192.168.1.104:3001"
// export const socketFromLocalHost = "http://localhost:3001"

export const backEndUrl = fromVercel;
// export const socket = io(socketFromVercel, {
//   autoConnect: true,
//   transports: ["websocket"]
// });

