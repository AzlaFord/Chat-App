import { io } from "socket.io-client";

const socket = io();  // conectează la server implicit pe același origin

export default socket;
