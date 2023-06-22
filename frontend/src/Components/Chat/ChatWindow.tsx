import { css } from "styled-components";
import useSocket from "../../utils/useSocket";
import Button from "../Reusable/Button";
import Form from "../Reusable/Form";
import Input from "../Reusable/Input";
import Wrapper from "../Reusable/Wrapper";

const ChatWindow = () => {
  const socket = useSocket();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = e.currentTarget.message.value;

    if (!message) return;

    socket?.emit("new-message", message);
  };

  return (
    <Wrapper direction="column" flex="1" css={wrapperCss}>
      <Form onSubmit={handleSendMessage}>
        <Input name="message" id="message" label="Message" />
        <Button type="submit">Send</Button>
      </Form>
    </Wrapper>
  );
};

export default ChatWindow;

const wrapperCss = css`
  border: 1px solid black;
`;
