import { destroy, fetch, patch, post } from ".";

export const getUserTruckList = (
  user_id: string,
  offset: number,
  size: String
) => {
  return fetch({
    endpoint: `user-truck/user/${user_id}?offset=${offset}&size=${size}`,
  });
};

export const getUserTrailerList = (
  user_id: string,
  offset: number,
  size: String
) => {
  return fetch({
    endpoint: `user-trailer/user/${user_id}?offset=${offset}&size=${size}`,
  });
};

export const getUserCargoPreferences = (user_id: string) => {
  return fetch({
    endpoint: `user-cargo/user/${user_id}`,
  });
};

export const getUserBusinessInfo = (user_id: string) => {
  return fetch({
    endpoint: `partner/${user_id}/business-detail`,
  });
};

export const deleteUserTrailer = (trailer_id: string) => {
  return destroy({
    endpoint: `user-trailer/${trailer_id}`,
  });
};

export const deleteUserTruck = (truck_id: string) => {
  return destroy({
    endpoint: `user-truck/${truck_id}`,
  });
};

export const createBid = (config: {
  load_id: number;
  user_id: string;
  amount: number;
}) => {
  const { user_id, load_id, amount } = config;
  return post({
    endpoint: `loads/makebid/${load_id}`,
    data: {
      user_id: user_id,
      amount: amount,
    },
  });
};
