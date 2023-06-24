import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Nullable } from "../types/Other";

let socketInstance: Nullable<Socket> = null;
let socketStartedInitialization = false;

const useSocket = () => {
  const [socket, setSocket] = useState(socketInstance);

  useEffect(() => {
    if (socketStartedInitialization) {
      setSocket(socketInstance);
      return;
    }

    socketStartedInitialization = true;

    const localSocket = io("http://localhost:3000/", {
      reconnection: true,
      reconnectionAttempts: 5,
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    localSocket.on("connect", () => {
      console.log("connected");
    });

    localSocket.on("disconnect", () => {
      console.log("disconnected");
      setTimeout(() => {
        localSocket.connect();
      }, 1000);
    });

    socketInstance = localSocket;
    setSocket(localSocket);

    return () => {
      localSocket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return socket;
};

export default useSocket;
