import SocketIOClient from "socket.io-client";
import Config from "react-native-config";

export const socket = SocketIOClient(Config.API_HOST);
