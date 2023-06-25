import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../types/Store";
import { Conversation } from "../../types/Conversation";
import { styled } from "styled-components";
import useSocket from "../../utils/useSocket";
import HelperService from "../../services/helper.service";
import {
  addConversation,
  leaveConversation,
  selectConversation,
} from "../../redux/reducers/conversations";
import { useRef } from "react";

const ChatList = () => {
  const dispatch = useDispatch();
  const socket = useSocket();

  const user = useSelector((state: Store) => state.user);
  const conversations = useSelector(
    (state: Store) => state.conversations || []
  );

  const actionGuardRef = useRef(false);

  const privateConversations = conversations.filter(
    (conversation: Conversation) => conversation.type === "private"
  );
  const groupConversations = conversations.filter(
    (conversation: Conversation) => conversation.type === "group"
  );

  const setActiveConversation = (conversationId: number) => {
    dispatch(selectConversation(conversationId));
  };

  const leaveGroup = (e: React.MouseEvent, conversationId: number) => {
    e.stopPropagation();
    if (actionGuardRef.current) return;
    actionGuardRef.current = true;

    socket?.emit(
      "leave-group",
      conversationId,
      (success: boolean, message: string) => {
        if (!success) {
          HelperService.showError(message || "Failed to leave group");
          return;
        }

        dispatch(leaveConversation(conversationId));
        dispatch(selectConversation(null));

        actionGuardRef.current = false;
      }
    );
  };

  const handleCreateOrJoinGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (actionGuardRef.current) return;
    actionGuardRef.current = true;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const groupName = formData.get("group-name") as string;

    if (!groupName) return;

    socket?.emit(
      "create-or-join-group",
      groupName,
      (conversations: Conversation & { error: boolean; message: string }) => {
        if (!conversations || conversations.error) {
          HelperService.showError(conversations.message);
          return;
        }

        dispatch(addConversation(conversations));
        setTimeout(() => setActiveConversation(conversations.id), 100);
        form.reset();

        actionGuardRef.current = false;
      }
    );
  };

  const handleFindPrivateChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (actionGuardRef.current) return;
    actionGuardRef.current = true;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username") as string;

    if (!username) return;

    if (username === user?.username) {
      HelperService.showError("You can't chat with yourself");
      actionGuardRef.current = false;
      return;
    }

    socket?.emit("find-private-chat", username, (result: boolean) => {
      actionGuardRef.current = false;
      form.reset();

      if (!result) {
        HelperService.showError("User not found");
        return;
      }
    });

    actionGuardRef.current = false;
  };

  return (
    <>
      <Input type="checkbox" id="chat-list-switch" />
      <Wrapper>
        <Input type="checkbox" id="private-chats-switch" />
        <Section>
          <Title as="label" htmlFor="private-chats-switch">
            <span>Private</span>
            <label htmlFor="new-private-toggle">
              <i className="fas fa-search" />
            </label>
          </Title>
          <>
            <Input type="checkbox" id="new-private-toggle" />
            <Section className="create-new-personal">
              <List as={"form"} onSubmit={handleFindPrivateChat}>
                <ListItem>
                  <input type="text" placeholder="Username" name="username" />
                </ListItem>
                <ListItem>
                  <input type="submit" value="Find user" />
                </ListItem>
              </List>
            </Section>
          </>
          <List>
            {privateConversations.map((conversation: Conversation) => (
              <ListItem
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={conversation.selected ? "active" : ""}
              >
                {
                  conversation.conversationUsers?.find(
                    (u) => u.User.id !== user?.id
                  )?.User.username
                }
              </ListItem>
            ))}
          </List>
        </Section>
        <Input type="checkbox" id="group-chats-switch" />
        <Section>
          <Title as="label" htmlFor="group-chats-switch">
            <span>Group</span>
            <label htmlFor="new-group-toggle">
              <i className="fas fa-search" />
              |
              <i className="fas fa-plus" />
            </label>
          </Title>
          <>
            <Input type="checkbox" id="new-group-toggle" />
            <Section className="create-new-group">
              <List as={"form"} onSubmit={handleCreateOrJoinGroup}>
                <ListItem>
                  <input type="text" placeholder="Group name" name="group-name" />
                </ListItem>
                <ListItem>
                  <input type="submit" value="Create / Join" />
                </ListItem>
              </List>
            </Section>
          </>
          <List>
            {groupConversations.map((conversation: Conversation) => (
              <ListItem
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={conversation.selected ? "active" : ""}
              >
                {conversation.name}
                <i
                  className="fas fa-trash-alt"
                  title="Leave group"
                  onClick={(e) => leaveGroup(e, conversation.id)}
                />
              </ListItem>
            ))}
          </List>
        </Section>
      </Wrapper>
    </>
  );
};

export default ChatList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 250px;
  width: 25%;
  height: 100%;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  @media screen and (max-width: 900px) {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    width: min(400px, calc(100vw - 4rem));
    height: calc(100% - 60px);
    background-color: #234;
    z-index: 100;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  &.create-new-group,
  &.create-new-personal {
    input {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: #345;
      border: 2px solid #456;
      &[type="submit"] {
        text-align: center;
      }
    }
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  cursor: pointer;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  label {
    border: 1px solid #ccc;
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    position: absolute;
    right: 1rem;
    i {
      font-size: 1rem;
    }
    &:hover {
      background-color: #345;
    }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
`;

const ListItem = styled.li`
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
  margin-block: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: #345;
  }
  i {
    padding-right: 0.25rem;
    &:hover {
      color: red;
    }
  }
  &.active {
    background-color: #456;
  }
`;

const Input = styled.input`
  &[type="checkbox"] {
    position: fixed;
    top: -9999px;
    left: -9999px;
  }

  &:checked + ${Section} {
    ${Title} {
      background-color: #456;
    }
    ${List} {
      display: none;
    }
  }
  &:checked + ${Wrapper} {
    display: none;
  }
`;
