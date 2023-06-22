import { useEffect } from "react";
import ChatInfo from "../../Components/Chat/ChatInfo";
import ChatList from "../../Components/Chat/ChatList";
import ChatWindow from "../../Components/Chat/ChatWindow";
import Navbar from "../../Components/Navbar/Navbar";
import Wrapper from "../../Components/Reusable/Wrapper";
import useSocket from "../../utils/useSocket";

const Chat = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("new-message", console.log);
    return () => {
      socket.off("new-message", console.log);
    };
  }, [socket]);

  return (
    <Wrapper direction="column" flex="1">
      <Navbar />
      <Wrapper direction="row" flex="1">
        <ChatList />
        <ChatWindow />
        <ChatInfo />
      </Wrapper>
    </Wrapper>
  );
};

export default Chat;
