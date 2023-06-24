import { styled } from "styled-components";
import useSocket from "../../utils/useSocket";
import { useSelector } from "react-redux";
import { Store } from "../../types/Store";
import HelperService from "../../services/helper.service";
import { useEffect, useRef } from "react";
import { Message as IMessage } from "../../types/Message";

const ChatWindow = () => {
  const socket = useSocket();
  const conversation = useSelector((state: Store) =>
    state.conversations.find((conversation) => conversation.selected)
  );
  const user = useSelector((state: Store) => state.user);
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const message = form.message.value;

    if (!message) return;

    socket?.emit(
      "new-message",
      {
        message,
        conversationId: conversation?.id,
        userId: user?.id,
      },
      () => {
        form.reset();
      }
    );
  };

  useEffect(() => {
    document.querySelector<HTMLInputElement>("#message-input")?.focus();
  }, [conversation?.id]);

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [conversation?.messages]);

  if (!conversation)
    return (
      <Wrapper>
        <Header>
          <h1>No conversation selected</h1>
        </Header>
      </Wrapper>
    );

  const conversationName = (() => {
    if (conversation.type === "private") {
      const otherUser = conversation.conversationUsers?.find(
        (conversationUser) => user?.id !== conversationUser.User?.id
      )?.User;
      return otherUser?.username;
    } else {
      return conversation.name;
    }
  })();

  return (
    <Wrapper>
      <Header>
        <h1>{conversationName}</h1>
        <Label htmlFor="chat-info-switch">
          <i className="fas fa-info-circle" />
        </Label>
      </Header>
      <Messages ref={messagesRef}>
        {conversation?.messages
          ?.slice()
          .sort((a: IMessage, b: IMessage) => a.id - b.id)
          .map((message) => (
            <Message
              key={message.id}
              className={message.userId === user?.id ? "me" : ""}
            >
              <p>{message.text}</p>
              <div>
                <span>{message.User?.username}</span>
                <span>{HelperService.formatDateTime(message.createdAt)}</span>
              </div>
            </Message>
          ))}
      </Messages>
      <Form onSubmit={handleSendMessage}>
        <Input name="message" id="message-input" />
        <Button type="submit">Send</Button>
      </Form>
    </Wrapper>
  );
};

export default ChatWindow;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 0.25rem;
`;

const Header = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #ccc;
  h1 {
    font-size: 1.5rem;
  }
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #456;
  margin-block: 0.5rem;
  &.me {
    background-color: #123;
  }
  p {
    font-size: 1.2rem;
    word-break: break-word;
  }
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    span {
      font-size: 0.8rem;
      color: #ccc;
    }
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  border-top: 1px solid #ccc;
  padding-top: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  padding: 0.5rem 1rem;
  border: none;
  outline: none;
  border-radius: 0.5rem;
  background-color: #456;
  font-size: 1.2rem;
  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  height: 100%;
  padding: 0 1rem;
  margin-left: 1rem;
  border: none;
  outline: none;
  border-radius: 0.5rem;
  background-color: #456;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const Label = styled.label`
  position: fixed;
  top: calc(60px + 8px);
  right: 1rem;
  width: 3rem;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1;
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: center;
  &:hover {
    transform: scale(1.1);
  }
`;
