import { createSlice } from "@reduxjs/toolkit";
import { Conversation } from "../../types/Conversation";
import { userLogout } from "./user";

const initialState: Conversation[] = [];

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (_, action) => {
      return action.payload?.sort(
        (a: Conversation, b: Conversation) => b.id - a.id
      );
    },
    addConversation: (state, action) => {
      const index = state.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        return;
      }
      state.unshift(action.payload);
    },
    selectConversation: (state, action) => {
      const conversationId = action.payload;
      state.forEach((conversation) => {
        conversation.selected = conversation.id === conversationId;
      });
    },
    appendMessage: (state, action) => {
      const message = action.payload;
      state.forEach((conversation) => {
        if (conversation.id === message.conversationId) {
          conversation.messages?.push(message);
        }
      });
    },
    leaveConversation: (state, action) => {
      const conversationId = action.payload;
      const index = state.findIndex((c) => c.id === conversationId);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    appendPerson(state, action) {
      const { conversationId, user } = action.payload;
      state.forEach((conversation) => {
        if (conversation.id !== conversationId) {
          return;
        }
        conversation.conversationUsers?.push({
          User: user,
        });
      });
    },
    removePerson(state, action) {
      const { conversationId, user } = action.payload;
      state.forEach((conversation) => {
        if (conversation.id !== conversationId) {
          return;
        }

        conversation.conversationUsers = conversation.conversationUsers?.filter(
          (cu) => cu.User?.id !== user?.id
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogout, () => []);
  },
});

export default conversationsSlice;
export const {
  setConversations,
  selectConversation,
  addConversation,
  appendMessage,
  leaveConversation,
  appendPerson,
  removePerson,
} = conversationsSlice.actions;
