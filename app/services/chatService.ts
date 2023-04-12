/*************************************************
 * FreightRunner
 * @exports
 * @function chatServices.ts
 * @extends Component
 * Created by Naveen Eon 23/07/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import { destroy, fetch, patch, post, put } from ".";
import { Registration } from "../types/global";

export const createChatRoom = (config: {
  userIds: [number, number];
  loadId: number;
  shipperId: number;
}) => {
  const { userIds, loadId, shipperId } = config;
  return post({
    endpoint: `chat/initiate`,
    data: {
      userIds: userIds,
      loadId: loadId,
      shipperId: shipperId,
      type: "driver-to-shipper"
    }
  });
};

export const getConversationList = (config: { chatRoomId: number }) => {
  const { chatRoomId } = config;
  return fetch({
    endpoint: `chat/${chatRoomId}`
  });
};

export const postMessage = (config: { chatRoomId: number; message: string }) => {
  const { chatRoomId, message } = config;
  return post({
    endpoint: `chat/${chatRoomId}/message`,
    data: {
      message: message
    }
  });
};

/**
 * To mark a message as read
 * @param config
 * @returns
 */
export const maekMessageRead = (config: { chatRoomId: number }) => {
  const { chatRoomId } = config;
  return put({
    endpoint: `chat/${chatRoomId}/mark-read`
  });
};
