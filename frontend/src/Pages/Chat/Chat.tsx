import { useEffect } from "react";
import ChatInfo from "../../Components/Chat/ChatInfo";
import ChatList from "../../Components/Chat/ChatList";
import ChatWindow from "../../Components/Chat/ChatWindow";
import Navbar from "../../Components/Navbar/Navbar";
import useSocket from "../../utils/useSocket";
import { styled } from "styled-components";
import { Message } from "../../types/Message";
import {
  addConversation,
  appendMessage,
  appendPerson,
  removePerson,
  selectConversation,
  setConversations,
} from "../../redux/reducers/conversations";
import { useDispatch } from "react-redux";
import { Conversation } from "../../types/Conversation";
import { User } from "../../types/User";
import HelperService from "../../services/helper.service";

const Chat = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const handleNewMessage = (message: Message) => {
    dispatch(appendMessage(message));
  };

  const handleConversations = (conversations: Conversation[]) => {
    dispatch(setConversations(conversations));
  };

  const handleNewPerson = (conversationId: number, user: User) => {
    dispatch(appendPerson({ conversationId, user }));
  };

  const handleLeavePerson = (conversationId: number, user: User) => {
    dispatch(removePerson({ conversationId, user }));
  };

  const handlePrivateChat = (conversation: Conversation) => {
    dispatch(addConversation(conversation));
    setTimeout(() => {
      dispatch(selectConversation(conversation.id));
    }, 100);
  };

  const handleWarning = (message: string) => {
    HelperService.showWarning(message);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("new-message", handleNewMessage);
    socket.on("new-person", handleNewPerson);
    socket.on("leave-person", handleLeavePerson);
    socket.on("conversations", handleConversations);
    socket.on("private-chat", handlePrivateChat);
    socket.on("warning", handleWarning);
    socket.emit("get-conversations");

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.on("conversations", handleConversations);
    };
  }, [socket]); // eslint-disable-line

  return (
    <PageWrapper>
      <Navbar />
      <Wrapper>
        <ChatList />
        <ChatWindow />
        <ChatInfo />
      </Wrapper>
    </PageWrapper>
  );
};

export default Chat;

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  height: calc(100vh - 60px);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 1rem;
`;
