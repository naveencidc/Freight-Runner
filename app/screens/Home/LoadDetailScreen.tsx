/*************************************************
 * FreightRunner
 * @exports
 * @function LoadDetailScreen.tsx
 * @extends Component
 * Created by Naveen E on 29/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useEffect, useState, useContext, useRef } from "react";
import {
  ViewStyle,
  Dimensions,
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Platform,
  Keyboard,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  SafeAreaView,
} from "react-native";
// import { SafeAreaView } from "react-navigation";
import HeaderWithBack from "../../components/HeaderWithBack";
import {
  createBid,
  getUserTrailerList,
} from "../../services/myProfileServices";
import storage from "../../helpers/storage";
import Spinner from "react-native-spinkit";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { MyContext } from "../../../app/context/MyContextProvider";
import { GeoPosition } from "react-native-geolocation-service";
import { getCurrentLocation } from "../../utilities/gpsUtilities";
// import MapboxGL from "@react-native-mapbox-gl/maps";
import Icon from "react-native-vector-icons/FontAwesome5Pro";
import FastImage from "react-native-fast-image";
import StandardModal from "../../components/StandardModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import {
  acceptLoad,
  declinetLoad,
  getLoadDetails,
  getMyJobsList,
  updateLoadStatus,
  updateStartWaitingTime,
} from "../../services/jobService";
var moment = require("moment-timezone");
const axios = require("axios");
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import {
  shipmentPhotosUploadCompleted,
  uploadMultipleImage,
  uploadToS3,
} from "../../services/uploadS3Service";
import {
  createChatRoom,
  getConversationList,
  maekMessageRead,
  postMessage,
} from "../../services/chatService";
import { socket } from "../../utilities/socketInst";
import {
  getAssessorialFee,
  getUserBidsList,
  getUserProfileDetails,
  partnerRating,
} from "../../services/userService";
// import TimeAgo from "react-native-timeago";
import ImageModal from "../../components/ImageModal";
import RNCalendarEvents from "react-native-calendar-events";
import StarRating from "react-native-star-rating";
import { showMessage } from "react-native-flash-message";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import Config from "react-native-config";
import TimeAgo from "../../components/TimeAgo";

// const { MapView, Camera, UserLocation, PointAnnotation } = MapboxGL;
const ratingText = ["", "Poor", "Average", "Good", "Excellent", "Outstanding"];
type Props = { navigation: any };

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

let currentPosition: GeoPosition;
let features: any = {};
let currentLocation: Object = {};
let user: object = {};

const LoadDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  let loadID = route.params?.loadDetail.load_id;
  let isFromShipment = route.params?.isFromShipment;
  console.log("-ASASASASASSAS----", route.params?.loadDetail);
  const global: any = useContext(MyContext);
  const [startcoordinates, setstartcoordinates] = useState([-100.0, 31.0]);
  const [midcoordinates, setmidcoordinates] = useState([]);
  const [endtcoordinates, setendtcoordinates] = useState([-100.0, 31.0]);
  const [coordinates, setCoordinates] = useState<any>({});
  const [bidModalVisible, setbidModalVisible] = useState(false);
  const [isLoadDetailLoading, setisLoadDetailLoading] = useState(false);
  const [isAcceptLoading, setisAcceptLoading] = useState(false);
  const [isDeclineLoading, setisDeclineLoading] = useState(false);
  const [loadDetail, setloadDetail] = useState({});
  const [isLoadAccepted, setisLoadAccepted] = useState(false);
  const [openAskQuestionModel, setopenAskQuestionModel] = useState(false);
  const [message, setmessage] = React.useState("");
  const [socketMessage, setsocketMessage] = React.useState("");
  const [updateBid, setUpdateBid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chatRoomid, setchatRoomId] = useState("");
  const [isSendMessageLoading, setisSendMessageLoading] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [shipperDetail, setshipperDetail] = useState({});
  const [selectedImages, setselectedImages] = useState([]);
  const [bidsList, setbidsList] = useState([]);
  const [showToolTip, setshowToolTip] = useState(false);
  const [imageModelOpen, setImageModelOpen] = useState(false);
  const [selectedImageUrl, setselectedImageUrl] = useState("");
  const [selectedCordinates, setSelectedCordinates] = useState<any>({
    coords: {
      latitude: "",
      longitude: "",
    },
  });
  const [routes, setRoute] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [-100.0, 31.0],
            [-83.441162, 33.247875],
          ],
        },
      },
    ],
  });
  const [ratings, setRating] = useState(0);
  const [frRatings, setfrRatings] = useState(0);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [showFRRating, setshowFRRating] = useState(false);
  const [showRatingLoading, setshowRatingLoading] = useState(false);
  const [isSkipedShipper, setisSkipedShipper] = useState(false);
  const [isPlatformRatingGiven, setisPlatformRatingGiven] = useState(false);
  const [isShipperRatingGiven, setisShipperRatingGiven] = useState(false);
  const [startTime, setstartTime] = useState(false);
  const [logTime, setlogTime] = useState("");
  const [timer, settimer] = useState("00:00:00");
  const refActionSheet = useRef(null);
  const scrollRef = useRef();
  const [unreadMessageCount, setunreadMessageCount] = useState(0);
  const [startTimeLoading, setstartTimeLoading] = useState(false);
  const [showDelineResonModal, setshowDelineResonModal] = useState(false);
  const [reasonText, setreasonText] = useState("");
  const [imageLoading, setimageLoading] = useState(false);
  const [isShowAcceptModal, setisShowAcceptModal] = useState(false);
  const [textLineCount, settextLineCount] = useState(1);
  /**
   * To get Updated profile Detail to allow driver to proced to load pickup
   */
  useEffect(() => {
    try {
      async function fetchAPI() {
        await getProfileDetail();
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  }, []);

  const getProfileDetail = async () => {
    const userDetail: any = await storage.get("userData");
    await getUserProfileDetails(userDetail.user_id)
      .then(async (response: any) => {
        global.myDispatch({
          type: "GET_USER_PROFILE_DETAILS",
          payload: response.data,
        });
      })
      .catch((e) => {});
  };

  const inProgressLoads =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.inProgressLoads;
  /**
   * To start timer to capture Driver waiting time
   */
  useEffect(() => {
    let interval: any;
    if (!startTime) {
      return;
    } else {
      interval = setInterval(() => {
        settimer(moment.utc(moment().diff(moment(logTime))).format("HH:mm:ss"));
      }, 1000);
    }
    return () => {
      console.log("Reached cleanup function");
      settimer("00:00:00");
      clearInterval(interval);
    };
  }, [startTime]);

  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };
  /**
   * To get Calender permission to use when screen loading
   */
  useEffect(() => {
    RNCalendarEvents.requestPermissions();
  }, []);

  /**
   * To udate unread message count in loadDetail screen
   */
  useEffect(() => {
    setunreadMessageCount(global.myState?.loaddetailMessageCount);
  }, [global.myState?.loaddetailMessageCount]);

  // useEffect(() => {
  //   //Update Load
  //   setloadDetail(global.myState?.loadDetailObj);
  // }, [global.myState?.loadDetailObj?.status]);

  useEffect(() => {
    if (route.params?.loadDetail?.messageCount) {
      global.myDispatch({
        type: "LOAD_SCREEN_MESSAGE_COUNT",
        payload: route.params?.loadDetail?.messageCount,
      });
    }
  }, []);

  const _checkGivenRatings = () => {
    loadDetail?.partnerRatingDetails?.map((ratingDetail) => {
      if (ratingDetail.is_platform_rating === 0) {
        setisShipperRatingGiven(true);
        setshowFRRating(true);
      } else {
        setisPlatformRatingGiven(true);
      }
    });
  };

  useEffect(() => {
    if (loadDetail) {
      _checkGivenRatings();
    }
  }, [loadDetail]);

  useEffect(() => {
    if (isFromShipment) {
      _callLoadDetails();
    }
  }, [isFromShipment]);

  useEffect(() => {
    try {
      async function fetchAPI() {
        bidsListApiCall();
      }
      fetchAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, []);

  const _callLoadDetails = async () => {
    await getLoadDetails({ load_id: loadID })
      .then(async (response) => {
        setloadDetail(response.data);
        console.log(" Load response", response);
      })
      .catch((e) => {
        console.log("loadDetail error", e.response);
      });
  };

  const _partnerRatings = async () => {
    setshowRatingLoading(true);
    let params;
    if (showFRRating) {
      params = {
        rating: Number(frRatings),
        is_platform_rating: true,
        load_id: loadID,
      };
    } else {
      params = {
        rating: Number(ratings),
        user_id: loadDetail.user_id,
        load_id: loadID,
        is_platform_rating: false,
      };
    }
    await partnerRating({ params: params })
      .then(async (response) => {
        if (!showFRRating) {
          if (isPlatformRatingGiven) {
            setOpenRatingModal(false);
            setshowRatingLoading(false);
            setRating(0);
            setVisible(true);
            _callLoadDetails();
            setMessage("Thank you for your valuable feedback");
          } else {
            setshowRatingLoading(false);
            setRating(0);
            setshowFRRating(true);
          }
        } else {
          _callLoadDetails();
          setRating(0);
          setfrRatings(0);
          setVisible(true);
          setisSkipedShipper(false);
          setMessage("Thank you for your valuable feedback");
          setshowRatingLoading(false);
          setshowFRRating(false);
          setOpenRatingModal(false);
        }
      })
      .catch((e) => {
        console.log("getUserBidsList error", e.response);
        setshowRatingLoading(false);
      });
  };

  const createCalenderEvent = () => {
    RNCalendarEvents.requestPermissions()
      .then((res) => {
        if (res === "authorized") {
          RNCalendarEvents.findCalendars().then((calres) => {
            console.log("Permissions response: cal ", calres);
            let title = "FreightRunner - Pickup for Load #" + loadID;
            let note =
              "Make sure you are ready to load your Truck with freights to proceed with shipment.";
            let pickUpDate = loadDetail?.pickup_date;
            let startTime = moment(pickUpDate)
              .subtract(2, "hours")
              .toISOString();

            let endTime = moment(pickUpDate).add(1, "hours").toISOString();

            let alarmTime = pickUpDate;

            RNCalendarEvents.fetchAllEvents(startTime, endTime, [])
              .then(async (value) => {
                console.log("-", value);
                const index = await value.findIndex(
                  (product) => product.title.split("#")[1] === loadID.toString()
                );
                if (!value.length || index === -1) {
                  //Create a new event

                  RNCalendarEvents.saveEvent(title, {
                    startDate: startTime,
                    endDate: endTime,
                    description: note,
                    notes: note,
                    alarms: [
                      {
                        date: alarmTime,
                      },
                    ],
                  })
                    .then((value) => {
                      console.log("-EVENT ID---->", value);
                      setVisible(true);
                      setMessage(
                        "Wow, a new pickup as an event has been created in your calendar."
                      );
                    })
                    .catch((error) => {
                      console.log("ERROR");
                    });
                } else {
                  Alert.alert(
                    "",
                    "Event has been created in your calendar already"
                  );
                }
              })
              .catch((error) => {
                console.log("ERROR");
              });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const bidsListApiCall = async () => {
    await getUserBidsList({ load_id: loadID })
      .then(async (response) => {
        setbidsList(response.data);
      })
      .catch((e) => {
        console.log("getUserBidsList error", e.response);
      });
  };
  useEffect(() => {
    try {
      async function fetchAPI() {
        user = await storage.get("userData");
        setisLoadDetailLoading(true);

        await getLoadDetails({ load_id: loadID })
          .then(async (response) => {
            setloadDetail(response.data);
            setselectedImages(response.data.load_attachments);
            setUpdateBid(parseFloat(response.data.delivery_price));
            setisLoadDetailLoading(false);
            if (
              response.data &&
              response.data.status === 5 &&
              !response?.data?.bolDetails?.partner_sign_url
            ) {
              Alert.alert(
                "",
                "You're expected to sign BOL in order to continue the load request process further! Do You?",
                [
                  {
                    text: "Cancel",
                    onPress: () => {
                      console.log("Cancel Pressed");
                      navigation.goBack();
                    },
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("BolScreen", {
                        loadDetails: response.data,
                      });
                    },
                  },
                ]
              );
            }
            console.log(" Load response", response);
            global.myDispatch({
              type: "LOAD_DETAILS_SUCESS",
              payload: response.data,
            });
            /**
             * To start timer if driver waiting to complete shipment
             * and load status is 6
             */
            if (response.data.standby_pickup && response.data.status === 4) {
              setlogTime(response.data.standby_pickup);
              setstartTime(true);
            } else if (
              response.data.standby_start &&
              response.data.status === 6
            ) {
              setlogTime(response.data.standby_start);
              setstartTime(true);
            } else {
              if (response.data.status === 4) {
                Alert.alert(
                  "Alert",
                  "Please log your waiting time to pickup load"
                );
              } else if (response.data.status === 6) {
                Alert.alert(
                  "Alert",
                  "Please log your arrival time to complete shipment"
                );
              }
            }
          })
          .catch((e) => {
            setisLoadDetailLoading(false);
            console.log("loadDetail error", e.response);
            Alert.alert("Error", e.response.data.message);
          });
      }
      fetchAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, []);

  useEffect(() => {
    return () => {
      console.log("UnMount");
      global.myDispatch({
        type: "LOAD_DETAILS_SUCESS",
        payload: undefined,
      });
      global.myDispatch({
        type: "LOAD_SCREEN_MESSAGE_COUNT",
        payload: 0,
      });
    };
  }, []);

  useEffect(() => {
    updateConversation(socketMessage);
  }, [socketMessage]);

  const updateConversation = (data) => {
    if (data) {
      let conversationObject = {
        chat_message_id: data.chat_message_id,
        chat_message_recipients: data.chat_message_recipients,
        createdAt: new Date().toISOString(),
        message: data.message,
        postedByUser: data.postedByUser,
      };
      global.myDispatch({
        type: "USER_CONVERSATION_LIST_SUCESS",
        payload: {
          conversation: [
            conversationObject,
            ...global.myState.conversationDetail.conversation,
          ],
          roomDetails: global.myState.conversationDetail.roomDetails,
        },
      });
      setisSendMessageLoading(false);
    }
  };

  useEffect(() => {
    if (chatRoomid) {
      socket.emit("subscribe", chatRoomid);
      socket.on(`chat/${chatRoomid}`, (data) => {
        console.log("socket-data", data);
        setsocketMessage(data);
        if (data.postedByUser !== 3) {
          socket.emit("chat-read", { room_id: chatRoomid, user_id: 3 });
        }
      });
    }

    return () => {
      // clearInterval(timerId);
      console.log("unsubscribe", chatRoomid);
      socket.emit("unsubscribe", chatRoomid);
      socket.off(chatRoomid);
      socket.off(`chat/${chatRoomid}`);
    };
  }, [chatRoomid]);
  useEffect(() => {
    // if (loadDetail?.origin_lng) {
    //   axios
    //     .get(
    //       `https://api.mapbox.com/directions/v5/mapbox/driving/${loadDetail.origin_lng}%2C${loadDetail.origin_lat}%3B${loadDetail.destination_lng}%2C${loadDetail.destination_lat}?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=${Config.MAPBOX_API_KEY}`
    //     )
    //     .then((resp) => {
    //       let coordArray = resp.data.routes[0].geometry.coordinates;
    //       setstartcoordinates(coordArray[0]);
    //       setmidcoordinates(
    //         coordArray[Math.round((coordArray.length - 1) / 2)]
    //       );
    //       setendtcoordinates(coordArray[coordArray.length - 1]);
    //       let tempObject = {
    //         type: "FeatureCollection",
    //         features: [
    //           {
    //             type: "Feature",
    //             properties: {},
    //             geometry: {
    //               type: "LineString",
    //               coordinates: resp.data.routes[0].geometry.coordinates,
    //             },
    //           },
    //         ],
    //       };
    //       setRoute(tempObject);
    //     });
    // }

    getCurrentLocation((position) => {
      currentPosition = position;
      setSelectedCordinates({
        coords: {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        },
      });
      setCoordinates(currentPosition);
    });
  }, [loadDetail.origin_lng]);

  const _acceptLoad = async () => {
    setisAcceptLoading(true);
    let loadListArray = global.myState.userLoadRequestList.results;
    let index = loadListArray.findIndex((load) => load.load_id === loadID);

    let loadBoardListArray = global.myState.userLoadBoardList.results;
    let loadBoardindex = loadBoardListArray?.findIndex(
      (load) => load.load_id === loadID
    );

    await acceptLoad({ load_id: loadID })
      .then(async (response) => {
        setisAcceptLoading(false);
        setVisible(true);
        setMessage("Load accepted Successfully");
        if (index !== -1) {
          loadListArray.splice(index, 1);
          let updatedLIstObject = {
            page: global.myState.userLoadRequestList.page,
            results: [...loadListArray],
          };
          global.myDispatch({
            type: "USER_LOAD_REQUEST_LIST_SUCESS",
            payload: updatedLIstObject,
          });
        }
        if (loadBoardindex !== undefined && loadBoardindex !== -1) {
          loadBoardListArray.splice(loadBoardindex, 1);
          let updatedLIstObject = {
            page: global.myState.userLoadBoardList.page,
            results: [...loadBoardListArray],
          };
          global.myDispatch({
            type: "USER_LOAD_BOARD_LIST_SUCESS",
            payload: updatedLIstObject,
          });
        }
        let params = {
          offset: 0,
        };
        await getMyJobsList(params).then(async (response) => {
          global.myDispatch({
            type: "USER_MY_JOB_LIST_SUCESS",
            payload: response.data,
          });
        });
        // setisLoadAccepted(true);
        navigation.goBack();
        console.log("AcceptLoad response", response);
      })
      .catch((e) => {
        setisAcceptLoading(false);
        console.log("AcceptLoad error", e.response);
        if (e.response.data.message === "Payment methods not found") {
          Alert.alert(
            "",
            "You require to create a Stripe Connect Account to proceed, Thus would like to proceed creating a Stripe Connect Account?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("PayoutAccounts", {
                    isFrom: "STRIPE_ACCOUNT_NOT_VERIFIED",
                  });
                },
              },
            ]
          );
        } else if (e.response.data.message === "Subscription not exist") {
          Alert.alert(
            "",
            "You require to buy/purchase carrier subscription plan to proceed, Thus would like to proceed?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Premium", {
                    isFrom: "loadDetailScreen",
                  });
                },
              },
            ]
          );
        } else {
          Alert.alert("Error", e.response.data.message);
        }
      });
  };
  /**
   * Decline the load
   */
  const _declineLoad = async () => {
    setisDeclineLoading(true);
    await declinetLoad({ load_id: loadID, reason: reasonText })
      .then(async (response) => {
        setisDeclineLoading(false);
        setVisible(true);
        setMessage("Load declined Successfully");
        setisLoadAccepted(false);
        let params = {
          offset: 0,
        };
        await getMyJobsList(params).then(async (response) => {
          global.myDispatch({
            type: "USER_MY_JOB_LIST_SUCESS",
            payload: response.data,
          });
        });
        // setisLoadAccepted(true);
        navigation.goBack();
        console.log("Decline Load response", response);
      })
      .catch((e) => {
        setisDeclineLoading(false);
        console.log("Decline Load error", e.response);
        Alert.alert("Error", e.response.data.message);
      });
  };
  /**
   * To Update each status of the load
   */
  const _updateLoadStatus = async () => {
    setisAcceptLoading(true);
    await updateLoadStatus({ load_id: loadID, status: loadDetail.status + 1 })
      .then(async (response) => {
        if (loadDetail.status === 5) {
          //To Start emiting the userLocation
          getProfileDetail();
          await storage.set("loadID", loadID);
        }
        if (loadDetail.status === 6) {
          //call Profile api to update live location socket
          getProfileDetail();
          await storage.remove("loadID");
        }
        setisAcceptLoading(false);
        setVisible(true);
        setMessage("Load status updated Successfully");
        setisAcceptLoading(false);
        let params = {
          offset: 0,
        };
        await getMyJobsList(params).then(async (response) => {
          global.myDispatch({
            type: "USER_MY_JOB_LIST_SUCESS",
            payload: response.data,
          });
        });
        // setisLoadAccepted(true);
        if (loadDetail.status === 4) {
          await _callLoadDetails();
          Alert.alert(
            "",
            "You're expected to sign BOL in order to continue the load request process further! Do You?",
            [
              {
                text: "Cancel",
                onPress: () => {
                  console.log("Cancel Pressed");
                  navigation.goBack();
                },
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("BolScreen", { loadDetails: loadDetail });
                },
              },
            ]
          );
        } else {
          navigation.goBack();
        }

        console.log("_updateLoadStatus response", response);
      })
      .catch((e) => {
        setisAcceptLoading(false);
        console.log("_updateLoadStatus error", e.response);
        Alert.alert("Error", e.response.data.message);
      });
  };

  const _updateStartWaitingTime = async () => {
    setstartTimeLoading(true);
    await updateStartWaitingTime({
      load_id: loadID,
      isDelivered: loadDetail.status === 4 ? false : true,
    })
      .then(async (response: any) => {
        setstartTimeLoading(false);
        // setVisible(true);
        // setMessage("Load status updated Successfully");
        if (response.data.standby_pickup) {
          setlogTime(response.data.standby_pickup);
          setstartTime(true);
          setloadDetail({
            ...loadDetail,
            standby_pickup: response.data.standby_pickup,
          });
        }
        if (response.data.standby_start) {
          setlogTime(response.data.standby_start);
          setstartTime(true);
          setloadDetail({
            ...loadDetail,
            standby_start: response.data.standby_start,
          });
        }
      })
      .catch((e) => {
        setstartTimeLoading(false);
        console.log("_updateLoadStatus error", e.response);
        Alert.alert("Error", e.response.data.message);
      });
  };

  const _createAndGetChatDetail = async () => {
    const userDetail = await storage.get("userData");
    // setisAcceptLoading(true);
    await createChatRoom({
      userIds: [userDetail.user_id, loadDetail.user_id],
      loadId: loadID,
      shipperId: loadDetail.user_id,
    })
      .then(async (response) => {
        setchatRoomId(response.data.chatRoomId);
        console.log("createChatRoomresponse", response);
        if (response.data.chatRoomId) {
          _maekMessageRead(response.data.chatRoomId);
          await getConversationList({ chatRoomId: response.data.chatRoomId })
            .then(async (conversationResponse) => {
              global.myDispatch({
                type: "USER_CONVERSATION_LIST_SUCESS",
                payload: {
                  conversation:
                    conversationResponse.data.conversation.reverse(),
                  roomDetails: conversationResponse.data.roomDetails,
                },
              });
              let obj = conversationResponse.data.roomDetails.find((o, i) => {
                if (o["userInfo"]["shipperProfileDetails"]) {
                  return true; // stop searching
                }
              });
              setshipperDetail(obj);
              console.log("createChatRoomresponse", conversationResponse);
            })
            .catch((e) => {
              console.log("createChatRoom error", e.response);
              Alert.alert("Error", e.response.data.message);
            });

          // await startSocketConnection();
        }
      })
      .catch((e) => {
        console.log("createChatRoom error", e.response);
        Alert.alert("Error", e.response.data.message);
      });
  };
  // send message to server
  const _postMessage = async () => {
    if (chatRoomid) {
      setisSendMessageLoading(true);
      await postMessage({ chatRoomId: chatRoomid, message: message })
        .then(async (response) => {
          console.log("sendMessageresponse", response);
          if (response.data.success) {
            setmessage("");
            setisSendMessageLoading(false);
          }
        })
        .catch((e) => {
          setisSendMessageLoading(false);
          console.log("sendMessageresponse error", e.response);
          Alert.alert("Error", e.response.data.message);
        });
    }
  };

  // bid amount increment and decrement here
  const bidIncrement = () => {
    console.log("-updateBid-", updateBid);
    setUpdateBid(parseFloat(updateBid) + 50);
  };

  const bidDecrement = () => {
    if (updateBid - 50 < 1) {
      setUpdateBid(0);
    } else {
      setUpdateBid(parseFloat(updateBid) - 50);
    }
  };

  // for creating the bid amount
  const createBidLoad = async () => {
    setLoading(true);
    setbidModalVisible(false);
    const userDetail = await storage.get("userData");
    try {
      const fetchAPI = await createBid({
        load_id: loadDetail.load_id,
        user_id: userDetail.user_id,
        amount: updateBid,
      });
      if (fetchAPI.status === 201) {
        setLoading(false);
        setVisible(true);
        setMessage("Bid Amount Created Successfully");
        bidsListApiCall();
        setUpdateBid(parseFloat(loadDetail.delivery_price));
        setbidModalVisible(false);
        // setUpdateBid(0);
      }
    } catch (error) {
      setLoading(false);
      setUpdateBid(parseFloat(loadDetail.delivery_price));
      if (error.response.data.message === "Payment methods not found") {
        Alert.alert(
          "",
          "You require to create a Stripe Connect Account to proceed, Thus would like to proceed creating a Stripe Connect Account?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("PayoutAccounts", {
                  isFrom: "STRIPE_ACCOUNT_NOT_VERIFIED",
                });
              },
            },
          ]
        );
      } else if (error.response.data.message === "Subscription not exist") {
        Alert.alert(
          "",
          "You require to buy/purchase carrier subscription plan to proceed, Thus would like to proceed?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Premium", {
                  isFrom: "loadDetailScreen",
                });
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", error.response.data.message);
      }
    }
  };
  // upload Multiple images
  const _uploadMultipleImages = async () => {
    let nameArray = [];
    selectedImages.map((item, index) => {
      if (!item.fileName) {
        nameArray.push(item.path.split("/").pop());
      } else {
        nameArray.push(item.fileName);
      }
    });
    uploadMultipleImage(selectedImages, 0, global, async (isDone) => {
      if (isDone) {
        await shipmentPhotosUploadCompleted({
          load_id: loadDetail.load_id,
          file_paths: nameArray,
        })
          .then(async (finalUploadresponse) => {
            if (finalUploadresponse.status === 201) {
              global.myDispatch({
                type: "UPLOADING_COMPLETED",
                payload: true,
              });
              global.myDispatch({
                type: "HIDE_UPLOAD_DAILOG",
                payload: true,
              });
              setMessage("Upload completed successfully.");
              setVisible(true);
              await updateLoadStatus({
                load_id: loadDetail.load_id,
                status: 8,
              }).then(async (response) => {
                let loadDetailObject = loadDetail;
                loadDetailObject.status = 8;
                setloadDetail(loadDetailObject);
                let params = {
                  offset: 0,
                };
                await getMyJobsList(params).then(async (response) => {
                  global.myDispatch({
                    type: "USER_MY_JOB_LIST_SUCESS",
                    payload: response.data,
                  });
                });
                // setisLoadAccepted(true);
                navigation.goBack();
                console.log("_updateLoadStatus response", response);
              });
            } else {
              global.myDispatch({
                type: "HIDE_UPLOAD_DAILOG",
                payload: true,
              });
              Alert.alert("Error", "There was an error. Please try again.");
            }
          })
          .catch((e) => {
            global.myDispatch({ type: "HIDE_UPLOAD_DAILOG", payload: true });
            console.log("error", e.response.data.message);
            Alert.alert("Error", e.response.data.message);
          });
        global.myDispatch({ type: "UPLOADING_COMPLETED", payload: true });
        global.myDispatch({ type: "HIDE_UPLOAD_DAILOG", payload: true });
      } else {
        global.myDispatch({ type: "HIDE_UPLOAD_DAILOG" });
        console.log("---MultiUpload failed");
      }
    });
  };
  const tofixTwoDigits = (value) => {
    var with2Decimals;
    if (value.length === 1 && value.charAt(0) === ".") {
      with2Decimals = "0.";
    } else if (value) {
      with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    } else {
      with2Decimals = 0;
    }

    return with2Decimals;
  };
  const _renderList = ({ item, index }) => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 10,
            marginHorizontal: 10,
            marginTop: 10,
            // backgroundColor: "red"
            // borderColor: "rgba(151, 151, 151, 0.230687)",
            // borderWidth: 1,
            // borderRadius: 6
          }}
        >
          {item.postedByUser === user.user_id ? (
            <View
              style={{
                paddingVertical: 15,
                alignItems: "flex-end",
                paddingLeft: deviceWidth / 10,
              }}
            >
              <Text
                style={{ color: "#858C97", fontSize: 14, fontWeight: "500" }}
              >
                {item.message}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  color: "#858C97",
                  fontSize: 10,
                  fontWeight: "500",
                }}
              >
                {moment(item.createdAt).format("MM/DD/YYYY hh:mm A")}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", paddingVertical: 15 }}>
              <FastImage
                resizeMode={"cover"}
                source={
                  shipperDetail?.userInfo?.shipperProfileDetails?.profile_image
                    ? {
                        uri: shipperDetail?.userInfo?.shipperProfileDetails
                          ?.profile_image,
                      }
                    : require("../../assets/images/placeholder.png")
                }
                style={{
                  height: 35,
                  width: 35,
                  borderRadius: 50,
                }}
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text
                  style={{
                    color: colors.background,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {item.message}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    color: colors.background,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  {moment(item.createdAt).format("MM/DD/YYYY hh:mm A")}
                </Text>
              </View>
            </View>
          )}

          <View style={{ height: 1, backgroundColor: "#F2F2F2" }}></View>
        </View>
      </View>
    );
  };

  const goToMap = (isFrom: string) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    // const latLng = `33.248905,-83.440619`;
    const latLng =
      isFrom === "PickUpDetail"
        ? `${loadDetail.origin_lat},${loadDetail.origin_lng}`
        : `${loadDetail.destination_lat},${loadDetail.destination_lng}`;
    const label =
      isFrom === "PickUpDetail"
        ? loadDetail.origin_city
        : loadDetail.destination_city;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const _reSetMessageCount = () => {
    global.myDispatch({
      type: "LOAD_SCREEN_MESSAGE_COUNT",
      payload: 0,
    });
    if (loadDetail.status === 2) {
      let loadRequestList = [...global.myState?.userLoadRequestList?.results];
      let loadIndex = loadRequestList.findIndex(
        (obj) => obj.load_id === loadDetail.load_id
      );
      let loadObject;
      if (loadIndex !== -1) {
        loadObject = loadRequestList[loadIndex];
        loadObject.messageCount = 0;
        loadRequestList.splice(loadIndex, 1);
        let updatedLIstObject = {
          page: global.myState.userLoadRequestList.page,
          results: [loadObject, ...loadRequestList],
        };
        global.myDispatch({
          type: "USER_LOAD_REQUEST_LIST_SUCESS",
          payload: updatedLIstObject,
        });
      }
    } else {
      let acceptedLoadList = [...global.myState?.myJobList?.results];
      let myjobLoadIndex = acceptedLoadList.findIndex(
        (obj) => obj.load_id === loadDetail.load_id
      );
      let loadObject;
      if (myjobLoadIndex !== -1) {
        loadObject = acceptedLoadList[myjobLoadIndex];
        loadObject.messageCount = 0;
        acceptedLoadList.splice(myjobLoadIndex, 1);
        let updatedLIstObject = {
          page: global.myState.myJobList.page,
          results: [loadObject, ...acceptedLoadList],
        };
        global.myDispatch({
          type: "USER_MY_JOB_LIST_SUCESS",
          payload: updatedLIstObject,
        });
      }
    }
  };
  const _maekMessageRead = async (chatRoomID) => {
    await maekMessageRead({ chatRoomId: Number(chatRoomID) })
      .then(() => {
        console.log("Message read");
      })
      .catch(() => {
        console.log("NO message to read");
      });
  };

  const handleTextLayout = (event) => {
    settextLineCount(event.nativeEvent.lines.length);
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        title="LOAD DETAILS"
        onPress={() => {
          global.myDispatch({
            type: "USER_CONVERSATION_LIST_SUCESS",
            payload: {
              conversation: [],
              roomDetails: [],
            },
          });
          navigation.goBack();
        }}
        isRightText={true}
        rightText={loadDetail.status === 3 ? "Remainder" : "Support"}
        isFrom={"LoadDetail"}
        showCalender={loadDetail.status === 3 ? true : false}
        rightOnPress={() => {
          if (loadDetail.status === 3) {
            Alert.alert(
              "",
              "Would you like to add a reminder to your calendar as an event?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    createCalenderEvent();
                  },
                },
              ]
            );
          } else {
          }
        }}
      />
      {isLoadDetailLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner
            isVisible={isLoadDetailLoading}
            size={30}
            type={"Wave"}
            color={"black"}
          />
          <Text
            style={{
              textAlign: "center",
              marginTop: deviceHeight / 40,
              fontSize: 16,
              color: "black",
            }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {midcoordinates.length ? (
              <ImageBackground
                style={{ flex: 0.8 }}
                source={require("../../../app/assets/images/mapView.png")}
              >
                {/* <MapboxGL.MapView
                  // attributionEnabled={false}
                  logoEnabled={false}
                  // attributionEnabled={false}
                  style={{
                    flex: loadDetail?.status === 9 || loadDetail?.status === 10 ? 0.6 : 0.4
                  }}
                >
                  <MapboxGL.Camera zoomLevel={4} centerCoordinate={startcoordinates} />
                  <MapboxGL.PointAnnotation
                    key="pointAnnotation"
                    id="pointAnnotation"
                    coordinate={startcoordinates}
                  >
                    <View
                      style={{
                        height: 15,
                        width: 15,
                        backgroundColor: "#000000",
                        borderRadius: 50,
                        borderColor: "#000000",
                        borderWidth: 3
                      }}
                    />
                  </MapboxGL.PointAnnotation>
                  <MapboxGL.PointAnnotation
                    key="endpointAnnotation"
                    id="endpointAnnotation"
                    coordinate={endtcoordinates}
                  >
                    <View
                      style={{
                        height: 15,
                        width: 15,
                        backgroundColor: "#6064de",
                        borderRadius: 3,
                        borderColor: "#6064de",
                        borderWidth: 3
                      }}
                    />
                  </MapboxGL.PointAnnotation>
                  <MapboxGL.ShapeSource id="line1" shape={routes}>
                    <MapboxGL.LineLayer
                      id="linelayer1"
                      style={{ lineColor: "#000000", lineWidth: 3 }}
                    />
                  </MapboxGL.ShapeSource>
                </MapboxGL.MapView> */}
              </ImageBackground>
            ) : null}

            <View
              style={{ position: "absolute", width: deviceWidth, bottom: 0 }}
            >
              <View
                style={[
                  styles.renderListMainView,
                  {
                    height:
                      loadDetail.status === 8 || loadDetail.status === 12
                        ? styles.renderListMainView.height + 20
                        : loadDetail.status === 13
                        ? styles.renderListMainView.height + 65
                        : styles.renderListMainView.height,
                  },
                ]}
              >
                {/* <ScrollView> */}
                <View style={{ marginHorizontal: 10, paddingVertical: 5 }}>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: fontSizes.small,
                          color: "#000000",
                          fontWeight: "bold",
                        }}
                      >
                        LOAD #{loadDetail.load_id}
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizes.small,
                          color: "#808F99",
                          marginTop: deviceHeight / 93,
                        }}
                      >
                        {loadDetail.approx_distance} mi
                      </Text>
                    </View>
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: fontSizes.medium,
                          color: "#000000",
                          fontWeight: "bold",
                        }}
                      >
                        ${loadDetail.delivery_price}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 5,
                          color: "#808F99",
                          textAlign: "right",
                        }}
                      >
                        ${loadDetail.delivery_rate}/mi
                      </Text>
                    </View>
                  </View>
                </View>
                <ScrollView ref={scrollRef}>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      paddingVertical: deviceHeight / 62,
                      paddingBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        marginHorizontal: 10,
                        flex: 1,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 0.95 }}>
                            <View style={{ flexDirection: "row" }}>
                              <FastImage
                                style={{
                                  alignSelf: "center",
                                  width: 13,
                                  height: 13,
                                  borderRadius: 13 / 2,
                                }}
                                source={require("../../assets/images/circle.png")}
                              />
                              <View style={{ flex: 1 }}>
                                <Text
                                  onTextLayout={(event) =>
                                    handleTextLayout(event)
                                  }
                                  style={{
                                    flex: 1,
                                    fontSize: fontSizes.small,
                                    color: "#222222",
                                    marginLeft: 15,
                                    fontWeight: "500",
                                  }}
                                >
                                  {loadDetail.origin_address_line},{" "}
                                  {loadDetail.origin_address_city},{" "}
                                  {loadDetail.origin_address_state} -{" "}
                                  {loadDetail.origin_address_zip}.
                                </Text>
                              </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                              <View
                                style={[
                                  styles.verticalLineStyle,
                                  {
                                    top: textLineCount >= 2 ? -9.5 : -2,
                                  },
                                ]}
                              ></View>
                              <View style={{ marginHorizontal: 10, flex: 1 }}>
                                <Text
                                  style={{
                                    fontSize: fontSizes.small,
                                    color: "#808F99",
                                    marginHorizontal: 20,
                                    marginTop: 5,
                                  }}
                                >
                                  {moment(loadDetail.pickup_date).format(
                                    "ddd MMM DD, yy"
                                  )}{" "}
                                  {moment(loadDetail.pickup_date).format(
                                    "hh:mm A"
                                  )}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <TouchableOpacity
                                style={{ padding: 10, paddingRight: 5 }}
                                onPress={() => {
                                  navigation.navigate("PickUpDetailScreen", {
                                    loadDetail: {
                                      ...loadDetail,
                                      startcoordinates,
                                      endtcoordinates,
                                      midcoordinates,
                                      routes,
                                    },
                                    isFrom: "PickUpDetail",
                                  });
                                }}
                              >
                                <FastImage
                                  resizeMode={"contain"}
                                  style={{
                                    alignSelf: "center",
                                    width: 18,
                                    height: 18,
                                    marginRight: 8,
                                  }}
                                  source={require("../../assets/images/Detail.png")}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{ padding: 10, paddingLeft: 5 }}
                                onPress={() => {
                                  goToMap("PickUpDetail");
                                }}
                              >
                                <FastImage
                                  resizeMode={"contain"}
                                  style={{
                                    alignSelf: "center",
                                    width: 18,
                                    height: 18,
                                  }}
                                  source={require("../../assets/images/get-directions-button.png")}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            borderBottomColor: "#F7F7F7",
                            borderBottomWidth: 1,
                            marginTop: 10,
                            marginRight: 8,
                            marginLeft: 30,
                          }}
                        />
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 0.95 }}>
                          <View style={{ flexDirection: "row" }}>
                            <FastImage
                              style={{
                                alignSelf: "center",
                                marginTop: 20,
                                width: 13,
                                height: 13,
                              }}
                              source={require("../../assets/images/Rectangle.png")}
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: fontSizes.small,
                                  color: "#222222",
                                  marginLeft: 15,
                                  marginTop: deviceHeight / 46,
                                  fontWeight: "500",
                                }}
                              >
                                {loadDetail.reciever_address},{" "}
                                {loadDetail.reciever_city},{" "}
                                {loadDetail.reciever_state} -{" "}
                                {loadDetail.reciever_zip}.
                              </Text>
                            </View>
                          </View>
                          <View style={{ marginHorizontal: 10 }}>
                            <Text
                              style={{
                                fontSize: fontSizes.small,
                                color: "#808F99",
                                marginLeft: 20,
                                marginTop: 5,
                              }}
                            >
                              {moment(loadDetail.delivery_date).format(
                                "ddd MMM DD, yy"
                              )}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                          }}
                        >
                          <TouchableOpacity
                            style={{ padding: 10, paddingRight: 5 }}
                            onPress={() => {
                              navigation.navigate("PickUpDetailScreen", {
                                loadDetail: {
                                  ...loadDetail,
                                  startcoordinates,
                                  endtcoordinates,
                                  midcoordinates,
                                  routes,
                                },
                              });
                            }}
                          >
                            <FastImage
                              resizeMode={"contain"}
                              style={{
                                alignSelf: "center",
                                width: 18,
                                height: 18,
                                marginRight: 8,
                              }}
                              source={require("../../assets/images/Detail.png")}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={goToMap}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 10,
                              paddingLeft: 5,
                            }}
                          >
                            <FastImage
                              resizeMode={"contain"}
                              style={{
                                alignSelf: "center",
                                width: 18,
                                height: 18,
                              }}
                              source={require("../../assets/images/get-directions-button.png")}
                            />
                          </TouchableOpacity>
                        </View>
                        {/* <FastImage
                          resizeMode="contain"
                          source={require("../../assets/images/get-directions-button.png")}
                          style={{ height: 18, width: 18, alignSelf: "center" }}
                        /> */}
                      </View>
                    </View>
                  </View>

                  {loadDetail.images && loadDetail.images.length > 0 ? (
                    <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                      <View
                        style={{
                          borderBottomColor: "#F7F7F7",
                          borderBottomWidth: 1,
                        }}
                      />
                      <Text style={{ color: "#808F99", marginVertical: 10 }}>
                        Load Images
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        {loadDetail.images.map((imageObj, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setImageModelOpen(true);
                                setselectedImageUrl(imageObj.image);
                              }}
                              style={{ marginRight: 10 }}
                            >
                              <ImageModal
                                visible={imageModelOpen}
                                image={selectedImageUrl}
                                handleClose={() => {
                                  setImageModelOpen(false);
                                }}
                              ></ImageModal>

                              <FastImage
                                onLoadStart={() => {
                                  setimageLoading(true);
                                }}
                                onLoadEnd={() => {
                                  setimageLoading(false);
                                }}
                                resizeMode="stretch"
                                source={{
                                  uri: imageObj.image,
                                }}
                                style={{
                                  height: 80,
                                  width: 80,
                                  borderRadius: 10,
                                }}
                              />
                              {imageLoading ? (
                                <ShimmerPlaceHolder
                                  style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 10,
                                    position: "absolute",
                                  }}
                                  LinearGradient={LinearGradient}
                                />
                              ) : null}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                  <View style={{ paddingHorizontal: 15 }}>
                    <View
                      style={{
                        borderBottomColor: "#F7F7F7",
                        borderBottomWidth: 1,
                        marginBottom: 8,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>Type of Load</Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.loadType?.load_type_name}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>Cargo Types</Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.loadCargo?.cargo_type_name}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Aproximate Weight
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.approx_weight} LBS
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Length (in Feet)
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.approx_length}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Breadth (in Feet)
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.approx_breadth}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Height (in Feet)
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.approx_height}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>Power</Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.power?.category}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>Power Type</Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.powerType?.type}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>Trailer Hookup</Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.trailerHookup?.hookup}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>Trailer Type</Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.loadTrailer?.trailer_type_name}
                        </Text>
                      </View>
                    </View>

                    {/* <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                        marginTop: deviceHeight / 92
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>Cargo Securement</Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.loadTrailer?.trailer_type_name}
                        </Text>
                      </View>
                    </View> */}

                    <View
                      style={{
                        borderBottomColor: "#F7F7F7",
                        borderBottomWidth: 1,
                        marginBottom: 10,
                      }}
                    />

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                        marginBottom: 10,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Offloading Equipments
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            flexWrap: "wrap",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          {!loadDetail.offload_equipments ||
                          !loadDetail.offload_equipments?.length ? (
                            <Text>--</Text>
                          ) : null}
                          {loadDetail.offload_equipments?.map(
                            (offload, index) => {
                              return (
                                <>
                                  <Text style={{}}>
                                    {offload.equipment_name}
                                  </Text>
                                  {index ===
                                  loadDetail.offload_equipments.length - 1 ? (
                                    <Text>.</Text>
                                  ) : (
                                    <Text>, </Text>
                                  )}
                                </>
                              );
                            }
                          )}
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                        marginBottom: 10,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Cargo Securement
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            flexWrap: "wrap",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          {!loadDetail.cargo_securement ||
                          !loadDetail.cargo_securement?.length ? (
                            <Text>--</Text>
                          ) : null}
                          {loadDetail.cargo_securement?.map(
                            (obj: any, index) => {
                              return (
                                <>
                                  <Text style={{}}>
                                    {obj.cargo_securement_name}
                                  </Text>
                                  {index ===
                                  loadDetail.cargo_securement.length - 1 ? (
                                    <Text>.</Text>
                                  ) : (
                                    <Text>, </Text>
                                  )}
                                </>
                              );
                            }
                          )}
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                        marginBottom: 10,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Additional Notes
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.notes}
                        </Text>
                      </View>
                    </View>

                    {loadDetail.status >= 5 ? (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          paddingVertical: deviceHeight / 92,
                          marginBottom: 10,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: "#808F99" }}>
                            Bill of lading
                          </Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              onPress={() => {
                                navigation.navigate("BolScreen", {
                                  loadDetails: loadDetail,
                                });
                              }}
                              style={{
                                marginTop: 10,
                                color: "#0047AB",
                                fontWeight: "500",
                                textDecorationLine: "underline",
                              }}
                            >
                              Click here to view bill of lading
                            </Text>
                          </View>
                        </View>
                      </View>
                    ) : null}

                    <View
                      style={{
                        borderBottomColor: "#F7F7F7",
                        borderBottomWidth: 1,
                        marginBottom: 10,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingVertical: deviceHeight / 92,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Minimum StandBy Time
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                          {loadDetail.minStandByTime?.time} hr
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#808F99" }}>
                          Accessorial charges
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                          ${loadDetail.ratePerHour?.amount} / hr
                        </Text>
                      </View>
                    </View>
                  </View>

                  {selectedImages.length > 0 ? (
                    <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                      <View
                        style={{
                          borderBottomColor: "#F7F7F7",
                          borderBottomWidth: 1,
                          marginBottom: 10,
                        }}
                      />
                      <Text style={{ color: "#808F99", marginVertical: 10 }}>
                        Shipment Completed Images
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        {selectedImages.map((image, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setImageModelOpen(true);
                                setselectedImageUrl(
                                  loadDetail.status === 7
                                    ? image.path
                                    : image.file_path
                                );
                              }}
                              style={{ marginRight: 10 }}
                            >
                              <ImageModal
                                visible={imageModelOpen}
                                image={selectedImageUrl}
                                handleClose={() => {
                                  setImageModelOpen(false);
                                }}
                              ></ImageModal>
                              {loadDetail.status === 7 ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    console.log("--index", index);
                                    let temparray = [...selectedImages];
                                    temparray.splice(index, 1);
                                    setselectedImages(temparray);
                                  }}
                                  style={{
                                    position: "absolute",
                                    zIndex: 100,
                                    right: -8,
                                    top: -8,
                                  }}
                                >
                                  <FastImage
                                    resizeMode="cover"
                                    tintColor={"red"}
                                    source={require("../../assets/images/close.png")}
                                    style={{
                                      height: 25,
                                      width: 25,
                                      borderRadius: 25,
                                      backgroundColor: "white",
                                    }}
                                  />
                                </TouchableOpacity>
                              ) : null}

                              <FastImage
                                resizeMode="stretch"
                                source={{
                                  uri:
                                    loadDetail.status === 7
                                      ? image.path
                                      : image.file_path,
                                }}
                                style={{
                                  height: 80,
                                  width: 80,
                                  borderRadius: 10,
                                }}
                              />
                            </TouchableOpacity>
                          );
                        })}
                        {selectedImages.length < 3 &&
                        loadDetail.status === 7 ? (
                          <TouchableOpacity
                            onPress={() => {
                              showActionSheet();
                            }}
                            style={{
                              height: 80,
                              width: 80,
                              borderRadius: 10,
                              borderColor: "lightgray",
                              borderWidth: 1,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FastImage
                              tintColor={"black"}
                              resizeMode="contain"
                              source={require("../../assets/images/addIcon.png")}
                              style={{ height: 30, width: 30 }}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  ) : null}

                  {loadDetail.partnerRatingDetails?.length ? (
                    <View
                      style={{
                        flex: 1,
                        paddingVertical: deviceHeight / 92,
                        marginBottom: 10,
                        paddingHorizontal: 15,
                      }}
                    >
                      {loadDetail.partnerRatingDetails.map(
                        (ratingDetail, index) => (
                          <>
                            {ratingDetail.is_platform_rating === 0 ? (
                              <View style={{ marginBottom: 15 }}>
                                <Text
                                  style={{ color: "#808F99", marginBottom: 10 }}
                                >
                                  Shipper Rating
                                </Text>
                                <StarRating
                                  disabled={true}
                                  maxStars={5}
                                  rating={Number(ratingDetail.rating)}
                                  // selectedStar={value => setfrRatings(value)}
                                  fullStarColor="#f1c40f"
                                  emptyStarColor="#BDC3C7"
                                  containerStyle={{ width: 200 }}
                                  // buttonStyle={{}}
                                  starSize={25}
                                />
                              </View>
                            ) : null}
                          </>
                        )
                      )}

                      {loadDetail.partnerRatingDetails.map(
                        (ratingDetail, index) => (
                          <>
                            {ratingDetail.is_platform_rating === 1 ? (
                              <View
                                style={{ marginBottom: index === 0 ? 15 : 0 }}
                              >
                                <Text
                                  style={{ color: "#808F99", marginBottom: 10 }}
                                >
                                  Platform Rating
                                </Text>
                                <StarRating
                                  disabled={true}
                                  maxStars={5}
                                  rating={Number(ratingDetail.rating)}
                                  selectedStar={(value) => setfrRatings(value)}
                                  fullStarColor="#f1c40f"
                                  emptyStarColor="#BDC3C7"
                                  containerStyle={{ width: 200 }}
                                  // buttonStyle={{}}
                                  starSize={25}
                                />
                              </View>
                            ) : null}
                          </>
                        )
                      )}
                    </View>
                  ) : null}
                </ScrollView>
              </View>
            </View>
          </View>
          {loadDetail.status === 12 ? (
            <View style={{ paddingTop: 20 }}>
              <Text
                style={{
                  color:
                    loadDetail.status === 9
                      ? "#B60F0F"
                      : loadDetail.status === 10
                      ? "#198754"
                      : "#007bff",
                  textAlign: "center",
                  fontSize: fontSizes.medium,
                  fontWeight: "600",
                }}
              >
                {loadDetail.status === 9
                  ? "Cancelled by shipper"
                  : loadDetail.status === 10
                  ? "Completed"
                  : "Payment Approved"}
              </Text>
            </View>
          ) : null}

          <View
            style={{ paddingHorizontal: 20, marginVertical: deviceHeight / 40 }}
          >
            {loadDetail.status === 9 ||
            loadDetail.status === 10 ||
            loadDetail.status === 13 ? (
              <View style={{}}>
                <Text
                  style={{
                    color:
                      loadDetail.status === 9
                        ? "#B60F0F"
                        : loadDetail.status === 10
                        ? "#198754"
                        : loadDetail.status === 13
                        ? "#ff1a1a"
                        : "#007bff",
                    textAlign: "center",
                    fontSize: fontSizes.medium,
                    fontWeight: "600",
                  }}
                >
                  {loadDetail.status === 9
                    ? "Cancelled by shipper"
                    : loadDetail.status === 10
                    ? "Completed"
                    : loadDetail.status === 13
                    ? "Closed"
                    : "Payment Approved"}
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {loadDetail.enable_bid === 1 &&
                (loadDetail.status === 2 || loadDetail.status === 11) ? (
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    {bidsList.length > 0 ? (
                      <View
                        style={{
                          zIndex: 1,
                          elevation: Platform.OS === "android" ? 50 : 0,
                        }}
                      >
                        {showToolTip ? (
                          <TouchableOpacity
                            onPress={() => {
                              // copyToClipboard();
                              // setPopUp(false);
                            }}
                            style={{
                              position: "absolute",
                              // alignSelf: "center",
                              bottom: 5,
                              left: 60,
                              zIndex: 1,
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontSize: 14,
                                backgroundColor: colors.btnColor,
                                padding: 10,
                                borderRadius: 12,
                                overflow: "hidden",
                                textAlign: "center",
                              }}
                            >
                              You have made {bidsList.length} bids so far.
                            </Text>

                            <View
                              style={{
                                backgroundColor: colors.btnColor,
                                height: 16,
                                width: 16,
                                alignSelf: "center",
                                transform: [
                                  { rotateZ: "45deg" },
                                  { translateY: Math.sqrt(200) * -1 },
                                ],
                              }}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ) : null}

                    <TouchableOpacity
                      onPress={() => {
                        setbidModalVisible(true);
                      }}
                      style={{
                        backgroundColor: colors.background,
                        paddingVertical: deviceHeight / 62,
                        paddingHorizontal: 20,
                        borderRadius: 30,
                      }}
                    >
                      {loading ? (
                        <Spinner
                          style={{ alignSelf: "center" }}
                          isVisible={true}
                          size={21}
                          type={"Wave"}
                          color={"white"}
                        />
                      ) : (
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: fontSizes.regular,
                            fontWeight: "600",
                            color: colors.white,
                          }}
                        >
                          Make a Bid
                        </Text>
                      )}
                    </TouchableOpacity>
                    {bidsList.length ? (
                      <TouchableOpacity
                        onPress={() => {
                          setshowToolTip(true);
                          setTimeout(() => {
                            setshowToolTip(false);
                          }, 2000);
                        }}
                        activeOpacity={0.7}
                        style={{
                          position: "absolute",
                          // zIndex: 100,

                          right: 18,
                          top: -10,
                          backgroundColor: "green",
                          borderRadius: 50,
                          height: 24,
                          width: 24,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "white" }}>
                          {bidsList.length}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : null}
                {/* Decline Button Start here */}
                {loadDetail.status === 3 ? (
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setshowDelineResonModal(true);
                        // _declineLoad();
                      }}
                      style={{
                        paddingVertical: deviceHeight / 62,
                        paddingHorizontal: 20,
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: "#B60F0F",
                      }}
                    >
                      {isDeclineLoading ? (
                        <Spinner
                          style={{ alignSelf: "center" }}
                          isVisible={true}
                          size={21}
                          type={"Wave"}
                          color={"#B60F0F"}
                        />
                      ) : (
                        <Text
                          style={{
                            color: "#B60F0F",
                            textAlign: "center",
                            fontSize: fontSizes.regular,
                            fontWeight: "600",
                          }}
                        >
                          Decline
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : null}
                {/* Decline Button Ends here */}

                {/* Log Time Button Start here */}
                {loadDetail.status === 6 || loadDetail.status === 4 ? (
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <TouchableOpacity
                      disabled={
                        (loadDetail.status === 6 && loadDetail.standby_start) ||
                        (loadDetail.status === 4 && loadDetail.standby_pickup)
                          ? true
                          : false
                      }
                      onPress={() => {
                        if (!startTime) {
                          _updateStartWaitingTime();
                        } else {
                          setstartTime(false);
                        }
                      }}
                      style={{
                        paddingVertical: deviceHeight / 62,
                        paddingHorizontal: 20,
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: "black",
                      }}
                    >
                      {startTimeLoading ? (
                        <Spinner
                          style={{ alignSelf: "center" }}
                          isVisible={true}
                          size={21}
                          type={"Wave"}
                          color={"black"}
                        />
                      ) : (
                        <Text
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontSize: fontSizes.regular,
                            fontWeight: "600",
                          }}
                        >
                          {startTime ? timer : "Log Time"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : null}
                {/* Log Time Button Ends here */}
                {loadDetail.status !== 13 ? (
                  <View
                    style={{
                      flex: 1,
                      paddingLeft: loadDetail.status === 3 ? 10 : 0,
                      marginTop: loadDetail.status === 8 ? 20 : 0,
                    }}
                  >
                    <TouchableOpacity
                      onPress={async () => {
                        _createAndGetChatDetail();
                        setopenAskQuestionModel(true);
                        global.myDispatch({
                          type: "CHAT_SCREEN_SUCESS",
                          payload: true,
                        });
                        _reSetMessageCount();
                      }}
                      style={{
                        paddingVertical: deviceHeight / 62,
                        paddingHorizontal: 20,
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: "#B60F0F",
                      }}
                    >
                      <Text
                        style={{
                          color: "#B60F0F",
                          textAlign: "center",
                          fontSize: fontSizes.regular,
                          fontWeight: "600",
                        }}
                      >
                        {"Ask a Question"}
                      </Text>
                    </TouchableOpacity>
                    {unreadMessageCount ? (
                      <TouchableOpacity
                        onPress={() => {
                          // setshowToolTip(true);
                          // setTimeout(() => {
                          //   setshowToolTip(false);
                          // }, 2000);
                        }}
                        activeOpacity={0.7}
                        style={{
                          position: "absolute",
                          // zIndex: 100,

                          right: 18,
                          top: -10,
                          backgroundColor: "green",
                          borderRadius: 50,
                          height: 24,
                          width: 24,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "white" }}>
                          {unreadMessageCount}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : null}
              </View>
            )}
            {loadDetail.status !== 12 ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: loadDetail.status === 13 ? 0 : 15,
                }}
              >
                {isLoadAccepted ? (
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={() => {
                        _declineLoad();
                      }}
                      style={{
                        paddingVertical: deviceHeight / 62,
                        paddingHorizontal: 20,
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: "#B60F0F",
                      }}
                    >
                      {isDeclineLoading ? (
                        <Spinner
                          style={{ alignSelf: "center" }}
                          isVisible={true}
                          size={21}
                          type={"Wave"}
                          color={"#B60F0F"}
                        />
                      ) : (
                        <Text
                          style={{
                            color: "#B60F0F",
                            textAlign: "center",
                            fontSize: fontSizes.medium,
                            fontWeight: "600",
                          }}
                        >
                          Decline
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    {(loadDetail.status === 2 || loadDetail.status === 11) &&
                    loadDetail.load_picked_by === user.user_id ? (
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <TouchableOpacity
                          onPress={() => {
                            setshowDelineResonModal(true);
                            // _declineLoad();
                          }}
                          style={{
                            paddingVertical: deviceHeight / 62,
                            paddingHorizontal: 20,
                            borderRadius: 30,
                            borderWidth: 1,
                            borderColor: "#B60F0F",
                          }}
                        >
                          {isDeclineLoading ? (
                            <Spinner
                              style={{ alignSelf: "center" }}
                              isVisible={true}
                              size={21}
                              type={"Wave"}
                              color={"#B60F0F"}
                            />
                          ) : (
                            <Text
                              style={{
                                color: "#B60F0F",
                                textAlign: "center",
                                fontSize: fontSizes.medium,
                                fontWeight: "600",
                              }}
                            >
                              Decline
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    ) : null}

                    <View style={{ flex: 1 }}>
                      {loadDetail.status === 9 ||
                      loadDetail.status === 10 ||
                      loadDetail.status === 8 ||
                      loadDetail.status === 13 ? null : (
                        <TouchableOpacity
                          disabled={
                            loadDetail.status === 3 &&
                            !loadDetail?.LoadButtonFlagsforPartner?.enablePickup
                              ? true
                              : (loadDetail.status === 6 &&
                                  !loadDetail.standby_start) ||
                                (loadDetail.status === 4 &&
                                  !loadDetail.standby_pickup)
                              ? true
                              : false
                          }
                          onPress={async () => {
                            if (
                              loadDetail.status === 2 ||
                              loadDetail.status === 11
                            ) {
                              setisShowAcceptModal(true);
                            } else if (loadDetail.status === 7) {
                              console.log("***", selectedImages);
                              if (selectedImages.length === 0) {
                                showActionSheet();
                              } else {
                                _uploadMultipleImages();
                              }
                            } else if (loadDetail.status === 8) {
                              navigation.navigate("ShipmentComplete", {
                                loadDetail: loadDetail,
                              });
                            } else {
                              if (
                                loadDetail.status === 3 &&
                                inProgressLoads.length > 0
                              ) {
                                Alert.alert(
                                  "",
                                  "Another Load seems to be In Progress already! Complete that and pick up the New Load!"
                                );
                              } else {
                                _updateLoadStatus();
                              }
                            }
                          }}
                          style={{
                            backgroundColor:
                              loadDetail.status === 3 &&
                              !loadDetail?.LoadButtonFlagsforPartner
                                ?.enablePickup
                                ? "#454545"
                                : (loadDetail.status === 6 &&
                                    !loadDetail.standby_start) ||
                                  (loadDetail.status === 4 &&
                                    !loadDetail.standby_pickup)
                                ? "#454545"
                                : colors.background,
                            paddingVertical: deviceHeight / 62,
                            paddingHorizontal: 20,
                            borderRadius: 30,
                            borderWidth: 1,
                            borderColor: colors.background,
                          }}
                        >
                          {isAcceptLoading ? (
                            <Spinner
                              style={{ alignSelf: "center" }}
                              isVisible={true}
                              size={21}
                              type={"Wave"}
                              color={"white"}
                            />
                          ) : (
                            <Text
                              style={{
                                textAlign: "center",
                                fontSize: fontSizes.medium,
                                fontWeight: "600",
                                color: colors.white,
                              }}
                            >
                              {loadDetail.status === 2 ||
                              loadDetail.status === 11
                                ? "Accept"
                                : loadDetail.status === 3
                                ? "On the way to pickup"
                                : loadDetail.status === 4
                                ? "Complete Pickup"
                                : loadDetail.status === 5
                                ? "On the way to delivery"
                                : loadDetail.status === 6
                                ? "Complete Shipment"
                                : loadDetail.status === 7
                                ? selectedImages.length === 0
                                  ? "Select photos "
                                  : "Upload photos"
                                : loadDetail.status === 8
                                ? "Send Feedback"
                                : loadDetail.status === 9
                                ? "Cancelled by shipper"
                                : ""}
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ) : null}

            {loadDetail.status === 3 &&
            !loadDetail?.LoadButtonFlagsforPartner?.enablePickup ? (
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  Above trigger point would be enabled only on or before{" "}
                  {loadDetail.pickupWaitingTime?.split(".")[0] > 0 ? (
                    <Text>
                      {loadDetail.pickupWaitingTime?.split(".")[0] > 1
                        ? `${loadDetail.pickupWaitingTime?.split(".")[0]} hours`
                        : `${
                            loadDetail.pickupWaitingTime?.split(".")[0]
                          } hour`}{" "}
                    </Text>
                  ) : null}
                  {loadDetail.pickupWaitingTime?.split(".")[1] > 0 ? (
                    <Text>
                      {loadDetail.pickupWaitingTime?.split(".")[1] > 1
                        ? `${
                            loadDetail.pickupWaitingTime?.split(".")[1]
                          } minutes`
                        : `${
                            loadDetail.pickupWaitingTime?.split(".")[0]
                          } minute`}
                    </Text>
                  ) : null}{" "}
                  of Pickup time scheduled
                </Text>
              </View>
            ) : null}

            {loadDetail.status === 10 ? (
              <View style={{ flexDirection: "row" }}>
                {loadDetail.partnerRatingDetails.length < 2 ? (
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <TouchableOpacity
                      onPress={() => setOpenRatingModal(true)}
                      style={{
                        paddingVertical: deviceHeight / 62,
                        paddingHorizontal: 20,
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: "#000000",
                      }}
                    >
                      <Text
                        style={{
                          color: "#000000",
                          textAlign: "center",
                          fontSize: fontSizes.medium,
                          fontWeight: "600",
                        }}
                      >
                        Rate Us
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                <View
                  style={{
                    flex: 1,
                    marginLeft:
                      loadDetail.partnerRatingDetails.length < 2 ? 5 : 0,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ShipmentComplete", {
                        loadDetail: loadDetail,
                      });
                    }}
                    style={{
                      paddingVertical: deviceHeight / 62,
                      paddingHorizontal: 20,
                      borderRadius: 30,
                      borderWidth: 1,
                      borderColor: "#000000",
                      backgroundColor: "#000000",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: fontSizes.medium,
                        fontWeight: "600",
                      }}
                    >
                      {loadDetail.partnerRatingDetails.length < 2
                        ? "Feedback"
                        : "Send Feedback"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      )}
      {/**
       * Make a bid and bids list modal
       */}
      <StandardModal
        visible={bidModalVisible}
        handleBackClose={() => {
          setbidModalVisible(false);
        }}
      >
        <KeyboardAwareScrollView scrollEnabled={false}>
          <View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: fontSizes.large,
                  fontWeight: "600",
                  color: "black",
                }}
              >
                Make a Bid
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  position: "absolute",
                  right: 0,
                }}
                onPress={() => {
                  setbidModalVisible(false);
                  setUpdateBid(parseFloat(loadDetail.delivery_price));
                }}
              >
                <FastImage
                  resizeMode="contain"
                  source={require("../../assets/images/close.png")}
                  style={{
                    height: 25,
                    width: 25,
                  }}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: "black",
                fontSize: fontSizes.medium,
                fontWeight: "400",
                marginVertical: deviceHeight / 35,
                textAlign: "center",
              }}
            >
              Shipment Price :{" "}
              <Text style={{ fontWeight: "500" }}>
                $ {loadDetail.delivery_price}
              </Text>
            </Text>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                marginBottom: deviceHeight / 35,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  bidDecrement();
                }}
              >
                <View
                  style={{
                    height: deviceHeight / 19,
                    width: deviceHeight / 19,
                    borderColor: "#B60F0F",
                    borderWidth: 1,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#B60F0F" }}>-50</Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#F5F4F7",
                  borderColor: "#EDEDED",
                  alignItems: "center",
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  marginHorizontal: 20,
                }}
              >
                <Text style={{ fontSize: fontSizes.xLarge, fontWeight: "600" }}>
                  {"$"}
                </Text>
                <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
                  <Text
                    style={{ fontSize: fontSizes.xSmall, color: "#858C97" }}
                  >
                    Your Bid Amount
                  </Text>
                  <TextInput
                    style={{
                      fontWeight: "600",
                      fontSize: fontSizes.medium,
                      marginTop: Platform.OS === "ios" ? 10 : 5,
                    }}
                    onChangeText={(value) => {
                      // Alert.alert("n");
                      setUpdateBid(value);
                    }}
                    value={tofixTwoDigits(updateBid)}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  bidIncrement();
                }}
              >
                <View
                  style={{
                    height: deviceHeight / 19,
                    width: deviceHeight / 19,
                    borderColor: "#B60F0F",
                    borderWidth: 1,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#B60F0F" }}>+50</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={updateBid ? false : true}
              onPress={() => {
                createBidLoad();
              }}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderRadius: 30,
                borderWidth: 1,
                backgroundColor: updateBid ? "#000000" : "#454545",
                marginBottom: deviceHeight / 55,
              }}
            >
              {loading ? (
                <Spinner
                  style={{ alignSelf: "center" }}
                  isVisible={true}
                  size={21}
                  type={"Wave"}
                  color={"white"}
                />
              ) : (
                <Text
                  style={{
                    color: colors.white,
                    textAlign: "center",
                    fontSize: fontSizes.medium,
                    fontWeight: "500",
                  }}
                >
                  Submit
                </Text>
              )}
            </TouchableOpacity>
            {bidsList.length > 0 ? (
              <View
                style={{ backgroundColor: "#F5F4F7", borderColor: "#EDEDED" }}
              >
                <Text
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 20,
                    fontSize: 18,
                    fontWeight: "bold",
                    // textAlign: "center"
                  }}
                >
                  Bids
                </Text>
                <FlatList
                  keyExtractor={(item) => item.bid_id.toString()}
                  style={{ maxHeight: deviceHeight / 3 }}
                  data={bidsList}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          paddingVertical: 10,
                          backgroundColor: "white",
                          marginHorizontal: 10,
                          marginBottom: 10,
                          paddingHorizontal: 10,
                          borderRadius: 6,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 5,
                          }}
                        >
                          <Text style={{ fontWeight: "600" }}>
                            BID #{item.bid_id}
                          </Text>
                          <TimeAgo
                            style={{
                              color: "#858C97",
                              fontSize: fontSizes.xSmall,
                            }}
                            dateTo={item.createdAt}
                          />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ color: "#858C97" }}>Bid Amount:</Text>
                          <Text style={{ fontWeight: "600", marginLeft: 10 }}>
                            ${item.amount}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                  initialNumToRender={5}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </StandardModal>
      {/**
       * Make a bid and bids list modal ends here
       */}
      {/**
       * Chat Screen modal start here
       */}
      <Modal
        visible={openAskQuestionModel}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setopenAskQuestionModel(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            height: deviceHeight,
            paddingVertical: Platform.OS === "android" ? 0 : 25,
            paddingBottom: Platform.OS === "android" ? 10 : null,
          }}
        >
          <View style={{}}>
            <HeaderWithBack
              title="Questions & Answers"
              onPress={() => {
                // setopenAskQuestionModel(false);
              }}
              hideLeftSide={true}
              isRightText={true}
              rightText="Close"
              isFrom={isFrom}
              rightOnPress={async () => {
                setopenAskQuestionModel(false);
                _maekMessageRead(chatRoomid);
                global.myDispatch({
                  type: "CHAT_SCREEN_SUCESS",
                  payload: false,
                });
              }}
            />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            enabled
            keyboardVerticalOffset={20}
            style={{ flex: 1 }}
          >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View style={{ flexDirection: "column", flex: 1 }}>
              <FlatList
                inverted={true}
                keyExtractor={(item, index) => item + index}
                data={global.myState.conversationDetail.conversation}
                renderItem={_renderList}
                initialNumToRender={5}
                // keyExtractor={item => item.page}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.01}
                // ListFooterComponent={_loadMoreLoading.bind(this)}
                // onEndReached={loadMoreList.bind(this)}
                // refreshControl={
                //   <RefreshControl
                //     tintColor={[colors.greyLight]}
                //     refreshing={refreshing}
                //     onRefresh={_onRefresh.bind(this)}
                //   />
                // }
              />

              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F5F4F7",
                    borderColor: "#EDEDED",
                    borderWidth: 1,
                    flex: 0.75,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: "#858C97" }}>Questions</Text>
                  <TextInput
                    placeholder="Enter the Question"
                    // multiline
                    // numberOfLines={3}
                    maxLength={255}
                    onChangeText={(text) => setmessage(text)}
                    value={message}
                    style={{
                      fontSize: fontSizes.regular,
                      padding: 0,
                      marginTop: 10,
                      // textAlignVertical: "top",
                      // height: 65
                    }}
                    keyboardType="default"
                    returnKeyType="done"
                    onSubmitEditing={() => {}}
                  />
                </View>
                <View style={{ flex: 0.25, marginHorizontal: 10 }}>
                  <TouchableOpacity
                    disabled={isSendMessageLoading}
                    onPress={() => {
                      if (message.trim().length) {
                        _postMessage();
                        Keyboard.dismiss;
                      }
                    }}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "black",
                      paddingHorizontal: 10,
                      alignItems: "center",
                      borderRadius: 8,
                      paddingVertical: 8,
                      justifyContent: "space-evenly",
                    }}
                  >
                    <FastImage
                      resizeMode="contain"
                      source={require("../../assets/images/question.png")}
                      style={{
                        height: 20,
                        width: 20,
                        // marginRight: 5
                      }}
                    />
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      Ask
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* </TouchableWithoutFeedback> */}
          </KeyboardAvoidingView>
        </View>
      </Modal>
      {/**
       * Chat Screen modal ends here
       */}
      {/**
       * Rating modal starts here
       */}
      <StandardModal
        visible={openRatingModal}
        handleBackClose={() => {
          setOpenRatingModal(false);
        }}
      >
        <View>
          {showFRRating ? (
            <View
              style={
                {
                  // marginTop: deviceHeight / 50
                }
              }
            >
              <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                Please rate the FreightRunner
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  marginTop: 10,
                }}
              >
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={Number(frRatings)}
                  selectedStar={(value) => setfrRatings(value)}
                  fullStarColor="#f1c40f"
                  emptyStarColor="#BDC3C7"
                  containerStyle={{ width: 300 }}
                  // buttonStyle={{}}
                  starSize={30}
                />
                <Text style={{ fontWeight: "bold", paddingTop: 10 }}>
                  {" "}
                  {ratingText[Number(frRatings)]}
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                Please rate the Shipper
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  marginTop: 10,
                }}
              >
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={Number(ratings)}
                  selectedStar={(value) => setRating(value)}
                  fullStarColor="#f1c40f"
                  emptyStarColor="#BDC3C7"
                  containerStyle={{ width: 300 }}
                  // buttonStyle={{}}
                  starSize={30}
                />
                <Text style={{ fontWeight: "bold", paddingTop: 10 }}>
                  {ratingText[Number(ratings)]}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            disabled={ratings === 0 && frRatings === 0 ? true : false}
            onPress={() => {
              _partnerRatings();
            }}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 32,
              borderWidth: 1,
              backgroundColor:
                ratings === 0 && frRatings === 0 ? "#454545" : colors.btnColor,
              marginBottom: deviceHeight / 55,
              marginTop: deviceHeight / 60,
            }}
          >
            {showRatingLoading ? (
              <Spinner
                style={{ alignSelf: "center" }}
                isVisible={true}
                size={21}
                type={"Wave"}
                color={"white"}
              />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  textAlign: "center",
                  fontSize: fontSizes.regular,
                  fontWeight: "500",
                }}
              >
                Submit
              </Text>
            )}
          </TouchableOpacity>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setRating(0);
                if (isSkipedShipper) {
                  setOpenRatingModal(false);
                  setisSkipedShipper(false);
                  setshowFRRating(false);
                } else {
                  if (showFRRating) {
                    if (isShipperRatingGiven) {
                      setOpenRatingModal(false);
                    } else {
                      setRating(0);
                      setfrRatings(0);
                      setOpenRatingModal(false);
                      setisSkipedShipper(false);
                      setshowFRRating(false);
                      setVisible(true);
                      _callLoadDetails();
                      setMessage("Thank you for your valuable feedback");
                    }
                  } else {
                    if (isPlatformRatingGiven) {
                      setOpenRatingModal(false);
                    } else {
                      setisSkipedShipper(true);
                      setshowFRRating(true);
                    }
                  }
                }
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: "gray",
                  fontWeight: "600",
                }}
              >
                Not now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </StandardModal>
      {/**
       * Rating modal ends here
       */}
      {/* Model for Decline reason Start here*/}
      <StandardModal
        visible={showDelineResonModal}
        handleBackClose={() => {
          setshowDelineResonModal(false);
        }}
      >
        <KeyboardAwareScrollView>
          <View>
            <Text
              style={{
                fontSize: fontSizes.large,
                fontWeight: "700",
                color: "black",
              }}
            >
              Decline Load
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: fontSizes.medium,
                fontWeight: "400",
                marginVertical: deviceHeight / 40,
              }}
            >
              Type in here the reason for declining this load
            </Text>

            <View
              style={{
                backgroundColor: "#F5F4F7",
                borderColor: "#EDEDED",
                borderWidth: 1,
                height: 100,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginBottom: deviceHeight / 40,
              }}
            >
              <Text
                style={{
                  color: "#858C97",
                  fontSize: fontSizes.small,
                  fontWeight: "500",
                }}
              >
                Reason
              </Text>
              <TextInput
                placeholder="Enter the reason"
                multiline
                numberOfLines={3}
                maxLength={250}
                onChangeText={(text) => setreasonText(text)}
                value={reasonText}
                style={{
                  fontSize: fontSizes.regular,
                  padding: 0,
                  textAlignVertical: "top",
                  height: 65,
                  fontWeight: Platform.OS === "android" ? "400" : "500",
                }}
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() => {}}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setshowDelineResonModal(false);
                    setreasonText("");
                  }}
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: "#B60F0F",
                  }}
                >
                  <Text
                    style={{
                      color: "#B60F0F",
                      textAlign: "center",
                      fontSize: fontSizes.medium,
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, paddingLeft: 10 }}>
                <TouchableOpacity
                  disabled={reasonText.trim().length ? false : true}
                  onPress={async () => {
                    setshowDelineResonModal(false);
                    _declineLoad();
                  }}
                  style={{
                    backgroundColor: reasonText.trim().length
                      ? colors.background
                      : "#454545",
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    borderRadius: 30,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: fontSizes.medium,
                      fontWeight: "600",
                      color: colors.white,
                    }}
                  >
                    Decline
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </StandardModal>
      {/* Model for Decline reason Ends here*/}

      {/* Model for accept Start here*/}
      <StandardModal
        visible={isShowAcceptModal}
        handleBackClose={() => {
          setisShowAcceptModal(false);
        }}
      >
        <View>
          <Text
            style={{
              fontSize: fontSizes.large,
              fontWeight: "700",
              color: "black",
            }}
          >
            Accept Load
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: fontSizes.medium,
              fontWeight: "400",
              marginVertical: deviceHeight / 30,
            }}
          >
            Are you sure, you want to accept this load request?
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setisShowAcceptModal(false);
                }}
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: "#B60F0F",
                }}
              >
                <Text
                  style={{
                    color: "#B60F0F",
                    textAlign: "center",
                    fontSize: fontSizes.medium,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, paddingLeft: 10 }}>
              <TouchableOpacity
                onPress={async () => {
                  setisShowAcceptModal(false);
                  _acceptLoad();
                }}
                style={{
                  backgroundColor: colors.background,
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  borderRadius: 30,
                }}
              >
                {loading ? (
                  <Spinner
                    style={{ alignSelf: "center" }}
                    isVisible={true}
                    size={21}
                    type={"Wave"}
                    color={"white"}
                  />
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: fontSizes.medium,
                      fontWeight: "600",
                      color: colors.white,
                    }}
                  >
                    Accept
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </StandardModal>
      {/* Model for accept Ends here*/}

      <ActionSheet
        ref={refActionSheet}
        title={"Select"}
        options={["Camera", "Gallery", "Cancel"]}
        cancelButtonIndex={2}
        onPress={async (index) => {
          if (index === 0) {
            ImagePicker.openCamera({
              cropping: false,
              compressImageQuality: Platform.OS === "ios" ? 0.7 : 0.8,
            })
              .then(async (item) => {
                console.log("-kee-", [item]);
                setselectedImages((oldArray) => [...oldArray, item]);
                // setselectedImages([item]);
                setTimeout(() => {
                  scrollRef.current.scrollToEnd({ animated: true });
                }, 1);
              })
              .catch((error) => {
                setLoading(false);
                Alert.alert(
                  "Error",
                  error.message
                    ? error.message
                    : "There was an error. Please try again."
                );
              });
            // this._loadImageFromGallery();
          } else if (index === 1) {
            ImagePicker.openPicker({
              multiple: Platform.OS === "ios" ? true : false,
              mediaType: "photo",
              cropping: false,
              maxFiles: 3 - selectedImages.length,
              compressImageQuality: Platform.OS === "ios" ? 0.7 : 0.8,
            })
              .then(async (item) => {
                if (Platform.OS === "ios") {
                  setselectedImages((oldArray) => [...oldArray, ...item]);
                } else {
                  setselectedImages((oldArray) => [...oldArray, item]);
                }

                // setselectedImages(item);
                setTimeout(() => {
                  scrollRef.current.scrollToEnd({ animated: true });
                }, 1);
              })
              .catch((error) => {
                setLoading(false);
                Alert.alert(
                  "Error",
                  error.message
                    ? error.message
                    : "There was an error. Please try again."
                );
              });
          }
        }}
      />
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
  renderListMainView: ViewStyle;
  verticalLineStyle: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    flex: 1,
  },
  renderListMainView: {
    borderWidth: 1,
    borderColor: "white",
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    flex: 1,
    elevation: Platform.OS === "android" ? 1 : 20,
    shadowColor: "#52006A",
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    height:
      deviceHeight <= 685
        ? 350
        : Platform.OS === "android"
        ? deviceHeight / 1.9
        : deviceHeight / 2.1,
  },
  verticalLineStyle: {
    flex: 1,
    width: 1,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: colors.greyLight,
    borderStyle: "dashed",
    position: "absolute",
    bottom: -38,
    top: -3,
    left: 5,
    right: 0,
  },
});

export default LoadDetailScreen;
