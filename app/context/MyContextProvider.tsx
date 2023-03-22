import React, { useReducer } from "react";

export const MyContext = React.createContext({});

export const initialV = {
  count: 0,
  userDetail: {},
  userPersonalInfo: {},
  userTrailerList: [],
  userTruckList: [],
  userCargoPreferences: [],
  userBusinessInfo: [],
  userProfileDetails: {},
  isModalVisible: false,
  uploadStatus: -1,
  progress: 0,
  isW_9Uploaded: false,
  userLoadRequestList: [],
  myJobList: [],
  myCompletedJobList: [],
  conversationDetail: {},
  totalCount: 0,
  activeCount: 0,
  allPaymentMethods: {},
  connectedAccountDetails: undefined,
  userPayoutList: [],
  userTransferList: [],
  loadDetailObj: undefined,
  isChatScreenOpen: false,
  loaddetailMessageCount: 0,
  userTodayNotificationList: {},
  userPreviousNotificationList: {},
  userLoadBoardList: {}
};

export function reducer(state, action) {
  switch (action.type) {
    case "INC":
      return { count: state.count + 1 };
    case "DEC":
      return { count: state.count - 1 };
    case "ADD":
      return { count: state.count + action.payload };
    case "LOGIN_SUCCESS":
      return { ...state, userDetail: action.payload };
    case "USER_PERSONAL_INFO":
      return { ...state, userPersonalInfo: action.payload };
    case "GET_USER_TRAILER_LIST":
      return { ...state, userTrailerList: action.payload };
    case "LOAD_MORE_USER_TRAILER_LIST":
      return { ...state, userTrailerList: { ...state.userTrailerList, ...action.payload } };
    case "GET_USER_TRUCK_LIST":
      return { ...state, userTruckList: action.payload };
    case "LOAD_MORE_USER_TRUCK_LIST":
      return { ...state, userTruckList: { ...state.userTruckList, ...action.payload } };
    case "GET_USER_CARGO_PREFERENCES_LIST":
      return { ...state, userCargoPreferences: action.payload };
    case "GET_USER_BUSINESS_INFO":
      return { ...state, userBusinessInfo: action.payload };
    case "GET_USER_PROFILE_DETAILS":
      return { ...state, userProfileDetails: action.payload };
    case "SHOW_UPLOAD_DAILOG":
      return { ...state, isModalVisible: true };
    case "HIDE_UPLOAD_DAILOG":
      return { ...state, isModalVisible: false };
    case "UPLOADING_INIT":
      return { ...state, isModalVisible: true, uploadStatus: 0 };
    case "UPLOADING_STARTED":
      return { ...state, uploadStatus: 1, progress: 0 };
    case "UPDAT_FILE_COUNT":
      return {
        ...state,
        totalCount: action.payload.totalCount,
        activeCount: action.payload.activeCount
      };
    case "UPLOADING_FINALIZING":
      return { ...state, uploadStatus: 2 };
    case "UPLOADING_COMPLETED":
      return { ...state, uploadStatus: 3 };
    case "UPDATE_UPLOAD_PROGRESS":
      return { ...state, progress: action.payload };
    case "W_9_UPLOAD_STATUS_SUCESS":
      return { ...state, isW_9Uploaded: true };
    case "USER_LOAD_REQUEST_LIST_SUCESS":
      return { ...state, userLoadRequestList: action.payload };
    case "USER_MY_JOB_LIST_SUCESS":
      return { ...state, myJobList: action.payload };
    case "USER_MY_COMPLETED_JOB_LIST_SUCESS":
      return { ...state, myCompletedJobList: action.payload };
    case "USER_CONVERSATION_LIST_SUCESS":
      return { ...state, conversationDetail: action.payload };
    case "UPDATE_ALL_PAYMENT_METHODS_SUCESS":
      return { ...state, allPaymentMethods: action.payload };
    case "UPDATE_CONNECTED_ACCOUNT_DETAIL_SUCESS":
      return { ...state, connectedAccountDetails: action.payload };
    case "USER_PAYOUT_LIST_SUCESS":
      return { ...state, userPayoutList: action.payload };
    case "USER_TRANSFER_LIST_SUCESS":
      return { ...state, userTransferList: action.payload };
    case "LOAD_DETAILS_SUCESS":
      return { ...state, loadDetailObj: action.payload };
    case "CHAT_SCREEN_SUCESS":
      return { ...state, isChatScreenOpen: action.payload };
    case "LOAD_SCREEN_MESSAGE_COUNT":
      return { ...state, loaddetailMessageCount: action.payload };
    case "TODDAY_NOTIFICATION_LIST_SUCESS":
      return { ...state, userTodayNotificationList: action.payload };
    case "PREVIOUS_NOTIFICATION_LIST_SUCESS":
      return { ...state, userPreviousNotificationList: action.payload };
    case "USER_LOAD_BOARD_LIST_SUCESS":
      return { ...state, userLoadBoardList: action.payload };
    case "LOGOUT":
      return { ...initialV };
    default:
      return state;
  }
}

export default function MyContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialV);
  return (
    <MyContext.Provider value={{ myState: state, myDispatch: dispatch }}>
      {props.children}
    </MyContext.Provider>
  );
}
