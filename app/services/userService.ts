/*************************************************
 * FreightRunner
 * @exports
 * @function userService.tsx
 * Created by Naveen E on 29/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import axios from "axios";
import Config from "react-native-config";
import { destroy, fetch, post, patch, put } from ".";
import storage from "../helpers/storage";
import {
  camelCaseResponseTransformer as responseTransformer,
  snakeCaseRequestTransformer as requestTransformer,
} from "./transformers";
import moment from "moment";
import {
  ChangePasswordAttributes,
  Email,
  Registration,
  Session,
  SignInAttemptAttributes,
  User,
} from "../types/global";
import { Platform } from "react-native";
import deviceInfoModule from "react-native-device-info";
import { navigateAndSimpleReset } from "../utils/Utility";

let userTokenRenewalTimer: any;

export type UpdateUserType = {
  avatar?: string;
  fullName?: string;
  handle?: string;
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  vendor?: string;
  carrier?: string;
};

//Login User

export const LoginUser = (config: { email: string; password: string }) => {
  const { email, password } = config;
  return post({
    endpoint: `auth/login`,
    data: {
      email: email,
      password: password,
      user_type: 2,
    },
  });
};

//Timer to renew user token here

export const setUserTokenRenewalTimer = (
  expires_seconds: number,
  navigation: any
) => {
  console.log("****refersh token called****", expires_seconds);
  if (userTokenRenewalTimer === undefined) {
    userTokenRenewalTimer = setInterval(() => {
      refershToken({ navigation });
    }, (expires_seconds - 600) * 1000);
  }
};

const _checkIsLatestVersionAvailable = async (obj) => {
  const currentArray = deviceInfoModule.getVersion().split(".");
  const latestArray = obj.lver.split(".");
  for (let i = 0; i < latestArray.length; i++) {
    // eslint-disable-next-line radix
    if (parseInt(latestArray[i]) > parseInt(currentArray[i])) {
      return true;
      // eslint-disable-next-line radix
    } else if (parseInt(latestArray[i]) < parseInt(currentArray[i])) {
      return false;
    }
  }
  return false;
};

export const checkMinimumVersion = async ({ navigation }: any) => {
  let isUpdateAvailable = undefined;
  await axios
    .get(
      "https://freightrunner-app-configs.s3.us-east-2.amazonaws.com/app-config/config.json"
    )
    .then(async (response) => {
      if (response.data.mnt === 1) {
        navigation.navigate("MaintenanceScreen");
      } else {
        if (Platform.OS === "ios") {
          if (!response.data.vri[deviceInfoModule.getVersion()]) {
            navigation.navigate("UpdateScreen", {
              isCompulsory: true,
              isLoggedIn: false,
            });
          } else {
            isUpdateAvailable = await _checkIsLatestVersionAvailable(
              response.data.vri
            );
            console.log("-isUpdateAvailable-", isUpdateAvailable);
            return isUpdateAvailable;
          }
        } else {
          if (!response.data.vra[deviceInfoModule.getVersion()]) {
            navigation.navigate("UpdateScreen", {
              isCompulsory: true,
              isLoggedIn: false,
            });
          } else {
            isUpdateAvailable = await _checkIsLatestVersionAvailable(
              response.data.vri
            );
            console.log("-isUpdateAvailable-", isUpdateAvailable);
          }
        }
      }
    })
    .catch((err) => {
      console.log("Version error", err);
    });
  return isUpdateAvailable;
};

export const refershToken = async ({ navigation }: any) => {
  let returnResponse = undefined;
  // await storage.remove("tokens");
  const userToken: any = await storage.get("tokens"); // Get previous tokens
  console.log("----", userToken);
  if (
    !userToken ||
    !userToken.refresh ||
    userToken === null ||
    userToken === "null"
  ) {
    navigateAndSimpleReset("Landing");
    // navigation.navigate('Landing');
  } else {
    //No need to send header for this api that's why used axios directly to call api
    await axios
      .post(`${Config.API_HOST}/v1/auth/refresh-tokens`, {
        refreshToken: userToken.refresh.token,
      })
      .then(async (response) => {
        console.log("response api response", response);
        await storage.set("tokens", response.data); // To update new token when app loads
        setUserTokenRenewalTimer(
          response.data.access.expires_seconds,
          navigation
        );
        returnResponse = response;
        console.log("returnResponse", returnResponse);
        // return response;
      })
      .catch(async (e) => {
        if (
          e.response.data.code === 401 &&
          e.response.data.message === "Please authenticate"
        ) {
          await storage.remove("tokens");
          navigateAndSimpleReset("Landing");
        }
        returnResponse = e.response;
      });
  }

  return returnResponse;
};

/**
 * To get user onboarding status
 * @param user_id
 * @returns
 */
export const getOnbardingStatus = (user_id: number) => {
  return fetch({
    endpoint: `partner/${user_id}/onboard-status`,
  });
};

/**
 * To update onboarding status every step
 * @param config
 * @returns
 */
export const updateOnbardingStatus = (config: {
  user_id: number;
  is_onboard_pending: number;
  completed_step: number;
  is_welcome_screen_viewed: number;
}) => {
  const {
    user_id,
    is_onboard_pending,
    completed_step,
    is_welcome_screen_viewed,
  } = config;
  return patch({
    endpoint: `partner/onboard-status`,
    data: {
      user_id: user_id,
      is_onboard_pending: is_onboard_pending,
      completed_step: completed_step,
      is_welcome_screen_viewed: is_welcome_screen_viewed,
    },
  });
};

export const getUserProfileDetails = (user_id: number) => {
  return fetch({
    endpoint: `partner/getprofile/${user_id}`,
  });
};
export const navigateToScreenAfterApproval = async (
  { navigation }: any,
  onboardingStatus: any,
  global: any,
  loadDetail: any
) => {
  const userDetail: any = await storage.get("userData");
  // await storage.remove("tokens");
  // navigation.navigate("Login");
  // global.myDispatch({
  //   type: "LOGOUT"
  // });
  await getUserProfileDetails(userDetail.user_id)
    .then(async (response: any) => {
      global.myDispatch({
        type: "GET_USER_PROFILE_DETAILS",
        payload: response.data,
      });
      let w9formindex = response.data.documentDetails.findIndex(
        (object: any) => object.document_type === "w9-form"
      );
      const driverlicense = response.data.documentDetails.findIndex(
        (object: any) => {
          return object.document_type === "driver's_license";
        }
      );
      if (w9formindex !== -1 && driverlicense !== -1) {
        /**
        1 - Viwed welcomeScreen already
        2 - Welcome screen not yet viewed
       **/
        if (onboardingStatus.is_welcome_screen_viewed === 2) {
          navigation.navigate("WelcomeScreen");
        } else {
          /**Navigate to Home */
          navigateAndSimpleReset("main");
          // navigation.navigate("Home", { loadDetail: loadDetail });
        }
      } else {
        navigation.navigate("RegistrationApprovedScreen", {
          profileDetail: response.data,
        });
      }
    })
    .catch((e) => {
      console.log("Navigation failed", e.response);
      navigation.navigate("Login");
    });
};
export const navigateToScreen = async (
  { navigation }: any,
  global: any,
  loadDetail: any
) => {
  const userDetail: any = await storage.get("userData");
  await getOnbardingStatus(userDetail.user_id)
    .then(async (response: any) => {
      let completedStep = response.data.completed_step;
      /**
       * Profile Status
       * 1 - Active	Profile approved by admin
         3 - In review	Default statu
         4 - Rejected	Profile rejected by admin
         5 - re submitted (In review)	Re submited by driver
       */
      let userData = {};
      await getUserProfileDetails(userDetail.user_id).then(
        async (userDetailResponse: any) => {
          userData = userDetailResponse.data;
        }
      );
      if (response.data.profile_status === 1) {
        // await navigateToScreenAfterApproval({ navigation }, response.data, global, loadDetail);
        if (completedStep === 0) {
          navigation.navigate("TruckList", { isFromOnboarding: true });
        } else if (completedStep === 1) {
          navigation.navigate("TrailerList", { isFromOnboarding: true });
        } else if (completedStep === 2) {
          navigation.navigate("RegistrationTypesCargoDetailScreen");
        } else if (completedStep === 3) {
          navigation.navigate("RegistrationInsuranceRequirementsScreen");
        } else if (completedStep === 4) {
          if (
            userData?.partnerProfile?.partnerProfileDetails?.is_business === 1
          ) {
            navigation.navigate("RegistrationBusinessAddressScreen");
          } else {
            navigation.navigate("RegistrationServiceAreasScreen");
          }
        } else if (completedStep === 5) {
          if (
            userData?.partnerProfile?.partnerProfileDetails?.is_business === 1
          ) {
            navigation.navigate("RegistrationServiceAreasScreen");
          } else {
            await navigateToScreenAfterApproval(
              { navigation },
              response.data,
              global,
              loadDetail
            );
          }
        } else if (completedStep === 6) {
          await navigateToScreenAfterApproval(
            { navigation },
            response.data,
            global,
            loadDetail
          );
        } else if (completedStep === 7) {
          await navigateToScreenAfterApproval(
            { navigation },
            response.data,
            global,
            loadDetail
          );
        } else if (completedStep === 8) {
          // navigation.navigate("Home");
          await navigateToScreenAfterApproval(
            { navigation },
            response.data,
            global,
            loadDetail
          );
        }
      } else if (response.data.profile_status === 4) {
        navigation.navigate("RegistrationRejectedScreen");
      } else if (response.data.profile_status === 3) {
        navigation.navigate("RegistrationUnderReviewScreen");
      }
    })
    .catch((e) => {
      console.log("Navigation failed", e.response);
      navigation.navigate("Login");
      // returnResponse = e.response;
    });
};

export const createStripeConnectedAccount = (config: { params: object }) => {
  const { params } = config;
  return post({
    endpoint: `stripe/createaccount`,
    data: params,
  });
};

//**Add bank accounts to connected account */
export const addbankaccount = (config: {
  name: string;
  last_4_digits: string;
  routing_number: string;
  primary: number;
  stripe_token: string;
}) => {
  const { name, last_4_digits, routing_number, primary, stripe_token } = config;
  return post({
    endpoint: `stripe/addbankaccount`,
    data: {
      name: name,
      last_4_digits: last_4_digits,
      routing_number: routing_number,
      primary: primary,
      stripe_token: stripe_token,
    },
  });
};

//**Add cards to customer account */
export const addCard = (config: {
  name: string;
  last_4_digits: string;
  primary: number;
  stripe_token: string;
}) => {
  const { name, last_4_digits, primary, stripe_token } = config;
  return post({
    endpoint: `stripe/addcard`,
    data: {
      name: name,
      last_4_digits: last_4_digits,
      primary: primary,
      stripe_token: stripe_token,
    },
  });
};

export const getAllPaymentMethods = () => {
  return fetch({
    endpoint: `stripe/getAllPaymentMethods`,
  });
};

export const getAccountDetails = () => {
  return fetch({
    endpoint: `stripe/getAccountDetails`,
  });
};

export const getPaymentMethodDetails = (config: {
  paymentMethodDtls: string;
  type: string;
}) => {
  const { paymentMethodDtls, type } = config;
  return post({
    endpoint: `stripe/getPaymentMethod`,
    data: {
      paymentMethodDtls: paymentMethodDtls,
      type: type,
    },
  });
};

/**Delete a payment method*/
export const deletePaymentMethod = (config: { paymentMethodDtls: string }) => {
  const { paymentMethodDtls } = config;
  return destroy({
    endpoint: `stripe/deletePaymentMethod`,
    data: {
      paymentMethodDtls: paymentMethodDtls,
    },
  });
};
/**Get User Bids Lists for a load */
export const getUserBidsList = (config: { load_id: string }) => {
  const { load_id } = config;
  return fetch({
    endpoint: `partner/bids/${load_id}?all=true`,
  });
};

/** update default payment method*/
export const updateDefaultPayment = (config: { paymentMethodDtls: string }) => {
  const { paymentMethodDtls } = config;
  return post({
    endpoint: `stripe/updateSource`,
    data: {
      paymentMethodDtls: paymentMethodDtls,
    },
  });
};

/** update userPayoutConfiguration*/
export const userPayoutConfiguration = (config: { payOutConfig: object }) => {
  const { payOutConfig } = config;
  return post({
    endpoint: `stripe/updatePayoutConfig`,
    data: payOutConfig,
  });
};

/**Get User Payout list */
export const getUserPayoutList = (config: { offset: number }) => {
  const { offset } = config;
  return fetch({
    endpoint: `stripe/stripeTransactions?size=10&offset=${offset}`,
  });
};

/**Get User Payout list */
export const getUserTransactionList = (config: { offset: number }) => {
  const { offset } = config;
  console.log("-offsetoffsetoffset--", offset);
  return fetch({
    endpoint: `stripe/getTransferList?size=10&offset=${offset}`,
  });
};

/**Get User Subscription Plan details */
export const getUserSubscriptionPlanDetails = () => {
  return fetch({
    endpoint: `stripe/getPlanDetails`,
  });
};

/**Get Connected account balance*/
export const getUserConnectedAccountBalance = () => {
  return fetch({
    endpoint: `stripe/getConnectAccBalz`,
  });
};

/** Withdraw amount*/
export const withdrawUserAmount = (config: { amount: number }) => {
  const { amount } = config;
  return post({
    endpoint: `stripe/createPayout`,
    data: {
      amount: amount,
      description: "Stripe Payout",
    },
  });
};

/** Activate subscription*/
export const createSubscription = (config: {
  priceId: string;
  plan_name: string;
}) => {
  const { priceId, plan_name } = config;
  return post({
    endpoint: `stripe/createSubscription`,
    data: {
      priceId: priceId,
      plan_name: plan_name,
    },
  });
};

/**Get Connected account balance*/
export const getUserConnectedAccountDetails = () => {
  return fetch({
    endpoint: `stripe/checkConnectedAccount`,
  });
};

/**Remove device for notification when user logout*/
export const removeDeviceWhenLogout = async () => {
  let playerId = await storage.get("deviceId");
  let userDetail: any = await storage.get("userData");
  return patch({
    endpoint: `partner/device/status`,
    data: {
      user_id: userDetail.user_id,
      player_id: playerId,
      status: 2,
    },
  });
};

/**Cancel user subscrption*/
export const cancelUserSubscription = (isCancelled: boolean) => {
  return post({
    endpoint: `stripe/cancelSubscription`,
    data: {
      isCancelled: isCancelled,
    },
  });
};

/** Verify Back acccount with micro deposit*/
export const verifyBankAccount = (config: {
  object_id: string;
  deposit1: string;
  deposit2: string;
}) => {
  const { object_id, deposit1, deposit2 } = config;
  return post({
    endpoint: `stripe/verifybankaccount`,
    data: {
      object_id: object_id,
      amounts: [deposit1, deposit2],
    },
  });
};

/**Get user subscrption details*/
export const getUserSubscriptionDetails = () => {
  return fetch({
    endpoint: `stripe/getSubscriptionDetails`,
  });
};

/**
 * To Give user ratings to the  shipper and FreightRunner platform
 * @param attempt
 * @returns
 */
export const partnerRating = (config: { params: object }) => {
  const { params } = config;
  console.log("-", params);
  return post({
    endpoint: `partner/send-rating`,
    data: params,
  });
};

/**Get User Bids Lists for a load */
export const getAssessorialFee = () => {
  return fetch({
    endpoint: `assessorial/getAssessorialFee`,
  });
};

/**
 * To get user notification list
 * @returns
 */
export const getUserNotificationList = (params: any) => {
  return fetch({
    endpoint: `partner/notifications?filterBy=${params.type}&offset=${params.offset}&size=${params.limit}`,
  });
};

//From here on Beach runner -- this need to be delete

function authenticateUser(attempt: SignInAttemptAttributes) {
  return post<Session>({
    endpoint: "sessions",
    data: {
      user: attempt,
    },
  });
}

function changePassword({ id, ...credentials }: ChangePasswordAttributes) {
  return patch<User>({
    endpoint: `users/${id}`,
    data: {
      user: credentials,
    },
  });
}

export const setPassword = (
  id: string,
  password: string,
  password_confirmation: string
) =>
  put<Registration>({
    endpoint: `setpasswords/${id}`,
    data: { user: { password, password_confirmation } },
  }).then((response) => response);

export const updateUserInformation = (
  id: string,
  first_name: string,
  last_name: string,
  handle: string,
  full_name: string,
  company_name: string
) =>
  put<User>({
    endpoint: `users/${id}/user_profiles`,
    data: {
      userprofiles: { first_name, last_name, handle, full_name, company_name },
    },
  }).then((response) => response);

export const getOTPForTwoFactorAuthentication = (
  user_id: string,
  tfa_type: string,
  phone_number: string,
  org_id: string
) =>
  post<User>({
    endpoint: `onboarding/${org_id}/two_factor_authentications`,
    data: { two_factor_authentication: { user_id, tfa_type, phone_number } },
  }).then((response) => response);

export const validateOTPAgainstTwoFactorAuthentication = (
  user_id: string,
  otp: string,
  org_id: string
) =>
  patch<User>({
    endpoint: `onboarding/${org_id}/two_factor_authentications/${user_id}`,
    data: { two_factor_authentication: { otp } },
  }).then((response) => response);

export const submitPasswordResetRequest = (email: string) => {
  return post({
    endpoint: "passwords",
    data: {
      user: { email },
    },
  });
};

function changeRole(id: string, role: string) {
  return patch<User>({
    endpoint: `users/${id}`,
    data: {
      user: { role },
    },
  });
}

function createUserEmail(id: string, email: string) {
  return post<Email>({
    endpoint: `users/${id}/emails`,
    data: {
      emailAddress: {
        address: email,
      },
    },
  });
}

function deleteUserEmail(userId: string, emailId: number) {
  // TODO: Update this any type
  return destroy<any>({
    endpoint: `users/${userId}/emails/${emailId}`,
  });
}

function getUserEmails(id: string) {
  return fetch<Email[]>({
    endpoint: `users/${id}/emails`,
  });
}

function getUserProfile(config: {
  id: string;
  authToken: string;
  email: string;
}) {
  const { id, authToken, email } = config;
  return axios.get(
    `${Config.API_HOST}/v1/users/${id}/profile?include=organizations,addresses,organization_memberships&include_stripe_verification_status=true`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-User-Token": authToken,
        "X-User-Email": email,
      },
      transformRequest: [requestTransformer],
      transformResponse: [responseTransformer],
    }
  );
}

export const getUsers = () => {
  return fetch<User>({
    endpoint: "users/?include=profile",
  });
};

export const getUserAndIncludedInfo = (id: string) => {
  return fetch({
    endpoint: `users/${id}/profile?include=user,organizations,units`,
  });
};

export const registerDevice = (userId: string, deviceId: string) => {
  return post({
    endpoint: `users/${userId}/devices`,
    data: { device: { playerId: deviceId } },
  });
};

export const createPersonalBankAccount = (values: {
  userId: string;
  customerStripeToken: string;
  externalAccountStripeToken: string;
  last4Digits: string;
  name: string;
  primary: boolean;
  routingNumber: string;
}) => {
  const { userId, ...accountValues } = values;
  return post({
    endpoint: `users/${values.userId}/bank_accounts`,
    data: { bankAccount: accountValues },
  });
};

export const createPersonalCreditCard = (config: {
  userId: string;
  name: string;
  last4Digits: string;
  stripeToken: string;
  primary: boolean;
}) => {
  const { name, last4Digits, stripeToken, userId, primary } = config;
  return post({
    endpoint: `users/${userId}/credit_cards`,
    data: { credit_card: { name, last4Digits, stripeToken, primary } },
  });
};

export const deletePersonalBankAccount = (config: {
  userId: string;
  accountId: string;
}) => {
  return destroy({
    endpoint: `users/${config.userId}/bank_accounts/${config.accountId}`,
  });
};

export const deletePersonalCreditCard = (config: {
  userId: string;
  accountId: string;
  cardToken: string;
}) => {
  return destroy({
    endpoint: `users/${config.userId}/remove_card`,
    data: {
      stripe_customer_id: config.accountId,
      card_token: config.cardToken,
    },
  });
};

export const makePersonalBankAccountPrimary = (config: {
  userId: string;
  accountId: string;
}) => {
  return put({
    endpoint: `users/${config.userId}/bank_accounts/${config.accountId}/make_primary`,
  });
};

export const makePersonalCreditCardPrimary = (config: {
  userId: string;
  accountId: string;
}) => {
  return put({
    endpoint: `users/${config.userId}/credit_cards/${config.accountId}/make_primary`,
  });
};

export const getPersonalBankAccounts = (config: { userId: string }) => {
  return fetch({ endpoint: `users/${config.userId}/bank_accounts` });
};

export const getPersonalCreditCards = (config: { userId: string }) => {
  return fetch({ endpoint: `users/${config.userId}/credit_cards` });
};

export const addUserAddress = (
  userId: string,
  address: {
    line1: string;
    line2: string | undefined;
    city: string;
    region: string;
    postalCode: string;
  }
) => {
  return post({ endpoint: `users/${userId}/addresses`, data: { address } });
};

export const payUser = (config: {
  sourceId: string; // id of account used for payment
  amount: string;
  description: string;
  userId: string;
}) => {
  const { userId, amount, description, sourceId } = config;
  return patch({
    endpoint: `users/${userId}/pay`,
    data: {
      payment: { amount, description, sourceId },
    },
  });
};

export const updateUserAddress = (
  userId: string,
  address: {
    id: string;
    line1: string;
    line2: string | undefined;
    city: string;
    region: string;
    postalCode: string;
  }
) => {
  const { id: addressId, line1, line2, city, region, postalCode } = address;

  return patch({
    endpoint: `users/${userId}/addresses/${addressId}`,
    data: {
      address: {
        line1,
        line2,
        city,
        region,
        postalCode,
      },
    },
  });
};

function updateUserEmail(userId: string, emailId: number, email: Email) {
  // TODO: Update this any type
  return patch<any>({
    endpoint: `users/${userId}/emails/${emailId}`,
    data: {
      emailAddress: {
        address: email.attributes.address,
        primary: email.attributes.primary,
      },
    },
  });
}

function updateUserProfile(id: string, profile: UpdateUserType) {
  return patch<User>({
    endpoint: `users/${id}/profile`,
    data: { profile },
  });
}

export const searchUsers = (query: string) => {
  return fetch<User[]>({
    endpoint: `users?filter[handle]=${query}&include=profile`,
  });
};

export const verifyUser = (userId: string, values: any) => {
  return patch({
    endpoint: `users/${userId}/verify`,
    data: { user: values },
  });
};

export const verifyCreditCard = (
  stripe_customer_id: string,
  amount: number,
  card_token: string,
  userId: string
) => {
  return post({
    endpoint: `users/${userId}/verify_credit_card`,
    data: { stripe_customer_id, amount, card_token },
  });
};

export const verifyUserBankAccount = (values: {
  userId: string;
  accountId: string;
  deposits: [number, number];
}) => {
  const { userId, accountId, deposits } = values;
  return patch({
    endpoint: `users/${userId}/bank_accounts/${accountId}/verify`,
    data: {
      bankAccount: { deposits },
    },
  });
};

export {
  authenticateUser,
  changePassword,
  changeRole,
  createUserEmail,
  deleteUserEmail,
  getUserEmails,
  getUserProfile,
  updateUserEmail,
  updateUserProfile,
};

export const deviceLog = (config: {
  user_id: number;
  device_token: string;
  device_model: string;
  player_id: string;
  os_type: string;
  os_version: string;
  app_version: string;
}) => {
  const {
    user_id,
    device_token,
    device_model,
    player_id,
    os_type,
    os_version,
    app_version,
  } = config;
  return post({
    endpoint: `partner/device`,
    data: {
      user_id: user_id,
      device_token: device_token,
      device_model: device_model,
      player_id: player_id,
      os_type: os_type,
      os_version: os_version,
      app_version: app_version,
      status: 1,
    },
  });
};
