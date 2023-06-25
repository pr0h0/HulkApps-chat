import { useSelector } from "react-redux";
import { styled } from "styled-components";
import { Store } from "../../types/Store";
import useSocket from "../../utils/useSocket";
import { useEffect, useState } from "react";

const ChatInfo = () => {
  const socket = useSocket();
  const me = useSelector((state: Store) => state.user);
  const conversation = useSelector((state: Store) =>
    state.conversations.find((conversation) => conversation.selected)
  );

  const [onlineList, setOnlineList] = useState<
    { userId: number; isOnline: boolean }[]
  >([]);

  const sendMessageToUser = (username: string) => {
    socket?.emit("find-private-chat", username);
  };

  useEffect(() => {
    socket?.emit(
      "check-online",
      conversation?.id,
      (onlineList: { userId: number; isOnline: boolean }[]) => {
        setOnlineList(onlineList);
      }
    );
  }, [conversation?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserStatus = (userId: number) => {
    if (userId === me?.id) return <OnlineStatus className="online" />;
    const user = onlineList.find((user) => user.userId === userId);
    if (!user) return <OnlineStatus />;
    return <OnlineStatus className={user?.isOnline ? "online" : "offline"} />;
  };

  return (
    <>
      <Input type="checkbox" id="chat-info-switch" defaultChecked={false} />
      <Wrapper>
        <Title>Chat info</Title>
        <List>
          {conversation?.conversationUsers?.map((user) => (
            <ListItem key={`${conversation.id}-${user.User.id}`}>
              <p>{user.User.username}</p>
              {user.User.id !== me?.id && conversation.type !== "private" && (
                <i
                  className="fas fa-envelope"
                  onClick={() => sendMessageToUser(user.User.username)}
                />
              )}
              {getUserStatus(user.User.id)}
            </ListItem>
          ))}
        </List>
      </Wrapper>
    </>
  );
};

export default ChatInfo;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 250px;
  width: 25%;
  border-left: 1px solid #ccc;
  @media screen and (max-width: 900px) {
    position: fixed;
    top: 60px;
    right: 0;
    width: min(400px, calc(100vw - 4rem));
    height: calc(100% - 60px);
    background-color: #234;
    z-index: 101;
  }
  `;

  const Title = styled.h1`
  font-size: 1.5rem;
  padding: 0 1rem;
  text-align: center;
  padding-block: 1rem;
  border-bottom: 1px solid #fff;
`;

const Input = styled.input`
  position: fixed;
  top: -9999px;
  left: -9999px;
  &:not(:checked) ~ ${Wrapper} {
    display: none;
  }
`;

const List = styled.ul`
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem;
  list-style: none;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #345;
  margin-block: 0.5rem;
  p {
    font-size: 1.2rem;
    flex: 1;
  }
  i {
    padding-inline: 0.5rem;
    cursor: pointer;
  }
`;

const OnlineStatus = styled.span`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #ccc;
  &.online {
    background-color: green;
  }
  &.offline {
    background-color: red;
  }
`;
