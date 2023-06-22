import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Nullable } from "../types/Other";

const useSocket = () => {
  const [socket, setSocket] = useState<Nullable<Socket>>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000/", {
      reconnection: true,
      reconnectionAttempts: 5,
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
