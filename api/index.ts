import { io } from "socket.io-client";

const fromVercel = "https://wassim-project-back-end.vercel.app/api";
const fromCodeIp = "http://192.168.1.104:3001/api"
const fromLocalHost = "http://localhost:3001/api"

const socketFromVercel = "https://wassim-project-back-end.vercel.app";
const socketFromCodeIp = "http://192.168.1.104:3001"
const socketFromLocalHost = "http://localhost:3001"

export const backEndUrl = fromVercel;
export const socket = io(socketFromVercel, {
  autoConnect: true,
});

