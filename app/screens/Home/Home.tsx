/*************************************************
 * FreightRunner
 * @exports
 * @function Home.tsx
 * @extends Component
 * Created by Deepak B on 23/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

"use strict";
import React, { useEffect, useContext, useState } from "react";
import {
  Animated,
  StyleSheet,
  ViewStyle,
  Dimensions,
  FlatList,
  TextInput,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
  ImageStyle,
  TextStyle,
  RefreshControl,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
  Platform,
  SafeAreaView,
} from "react-native";
import Config from "react-native-config";
// import MapboxGL from "@react-native-mapbox-gl/maps";
import Icon from "react-native-vector-icons/FontAwesome5";
// import { useAccounts } from "../../hooks/useAccounts";
import Text from "../../components/Text";
import View from "../../components/View";
// import { SessionContext } from "../../context/SessionContextProvider";
import colors from "../../styles/colors";
import {
  fontSizes,
  STANDARD_BORDER_RADIUS,
  STANDARD_PADDING,
} from "../../styles/globalStyles";
// import { integer } from "aws-sdk/clients/cloudfront";
import FastImage from "react-native-fast-image";
import storage from "../../helpers/storage";
import { getUserLoadRequestList } from "../../services/jobService";
import { MyContext } from "../../context/MyContextProvider";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import { reverseLookup } from "../../services/mapboxService";
import { getCurrentLocation } from "../../utilities/gpsUtilities";
import { GeoPosition } from "react-native-geolocation-service";
import SelectDropdown from "react-native-select-dropdown";
import DeviceInfo from "react-native-device-info";
import { deviceLog, getBankAccountToken } from "../../services/userService";
import Spinner from "react-native-spinkit";
var moment = require("moment-timezone");
// import TimeAgo from "react-native-timeago";

import { socket } from "../../utilities/socketInst";
import { showMessage } from "react-native-flash-message";
import { Badge } from "react-native-elements";
import BoardIcon from "react-native-vector-icons/AntDesign";
// import Analytics from "appcenter-analytics";
import { checkLocationPermission } from "../../utilities/locationCheck";
import Geolocation from "react-native-geolocation-service";
import TimeAgo from "../../components/TimeAgo";
import ReactNativeCalendarEvents from "react-native-calendar-events";

// MapboxGL.setAccessToken(Config.MAPBOX_API_KEY);
// const { MapView, Camera, UserLocation, PointAnnotation } = MapboxGL;

type Props = { navigation: any };
let load_ID: number | undefined;
let list: any;
let loadBoardlist: any;
let acceptedList: any;
let completedLoadList: any;
let chatScreenOpened: boolean;
let endReached = false;
let rightNow = moment();
let unReadmessageCount: number;
let timerId;
let searchTextGlob = "";
let inProgressLoads: any = [];
const Home: React.FC<Props> = ({ navigation }: any, route: any) => {
  let loadDetail = route.params?.loadDetail;
  let currentPosition: GeoPosition;
  let features: any = {};
  let addressObj: Object = {};
  // let currentLocation: Object = {};
  let [address1, setAddress1] = useState<string>("");
  let [address2, setAddress2] = useState<string>("");
  let [city, setCity] = useState<string>("");
  let [stateName, setState] = useState<string>("");
  let [zipCode, setZipCode] = useState(addressObj);
  const [coordinates, setCoordinates] = useState<Array>({});
  const global: any = useContext(MyContext);
  const [currentLocation, setCurrentLocation] = useState(
    route.params?.userCurrentLocation
  );
  const [selectedSortType, setselectedSortType] = useState("Latest");
  const [refreshing, isRefreshing] = useState(false);
  const [loadListsLoading, setloadListsLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreloading] = useState(false);
  const [searchText, setsearchText] = useState("");
  const [backPressedCount, setBackPressedCount] = useState(0);

  let interval: any;
  // const [backCount, setBackCount] = useState(0);
  let backCount = 0;
  const handleBackButton = () => {
    if (navigation.isFocused()) {
      if (backCount === 0) {
        backCount = 1;
        ToastAndroid.show("Tap again to exit app", ToastAndroid.SHORT);
      } else if (backCount === 1) {
        BackHandler.exitApp();
      }
      setTimeout(() => {
        backCount = 0;
      }, 2000);
      return true;
    } else {
      return false;
    }
  };

  /**
   * To update inprogress load if user have already
   */
  useEffect(() => {
    inProgressLoads = global.myState.userProfileDetails?.inProgressLoads;
  }, [global.myState.userProfileDetails?.inProgressLoads]);

  /**
   * To reset timer
   */
  useEffect(() => {
    async function fetchAPI() {
      const userDetail: any = await storage.get("userData");
      interval = setInterval(async () => {
        let isEnabled = await checkLocationPermission();
        console.log("@@@@@@@@@@@@", isEnabled);
        const loadID: any = (await inProgressLoads.length)
          ? inProgressLoads[0].load_id
          : undefined;
        const status: any = (await inProgressLoads.length)
          ? inProgressLoads[0].status
          : undefined;
        if (isEnabled && loadID && status !== 4) {
          Geolocation.getCurrentPosition(
            async (position) => {
              console.log(position);
              if (position) {
                socket.emit("live-location", {
                  user_id: userDetail.user_id,
                  load_id: loadID,
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              }
            },
            (error) => {
              console.log(error.code, error.message);
            },
            {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0,
            }
          );
        }
      }, 3000);
    }
    fetchAPI();

    return () => {
      console.log("Reached cleanup function");
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (loadDetail?.isFromNotification) {
      navigation.navigate("LoadDetailScreen", {
        loadDetail: { load_id: loadDetail.load_id },
      });
    }
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);

  /**
   * To update LoadDetails if user open loadDetailscreen
   */
  useEffect(() => {
    load_ID = global.myState.loadDetailObj?.load_id;
  }, [global.myState?.loadDetailObj]);

  useEffect(() => {
    chatScreenOpened = global.myState?.isChatScreenOpen;
  }, [global.myState?.isChatScreenOpen]);

  useEffect(() => {
    list = global.myState?.userLoadRequestList;
  }, [global.myState?.userLoadRequestList]);

  useEffect(() => {
    loadBoardlist = global.myState?.userLoadBoardList;
  }, [global.myState?.userLoadBoardList]);

  useEffect(() => {
    acceptedList = global.myState?.myJobList;
  }, [global.myState?.myJobList]);

  useEffect(() => {
    completedLoadList = global.myState?.myCompletedJobList;
  }, [global.myState?.myCompletedJobList]);

  useEffect(() => {
    unReadmessageCount = global.myState?.loaddetailMessageCount;
  }, [global.myState?.loaddetailMessageCount]);

  useEffect(() => {
    if (route.params?.userCurrentLocation) {
      setCurrentLocation(route.params?.userCurrentLocation);
      setselectedSortType("Nearest pickup");
      setloadListsLoading(true);
      callLoadApi("initialLoading");
    }
  }, [route.params]);

  useEffect(() => {
    getCurrentLocation(async (position) => {
      currentPosition = position;
      console.log("%%%%%%%%%%%%%%", position);
      if (currentPosition) {
        if (!currentLocation) {
          getHomeCondoLocation();
        }
      }
    });
    getDeviceLogs();
  }, []);

  useEffect(() => {
    try {
      async function fetchAPI() {
        setloadListsLoading(true);
        callLoadApi("initialLoading");
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  }, [selectedSortType]);

  useEffect(() => {
    try {
      async function fetchAPI() {
        let userDetail: any = await storage.get("userData");
        // Analytics.trackEvent("Load Offer", { userID: userDetail.user_id });
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  }, []);

  const showSocketMessage = (data) => {
    let loadRequestList = [...list?.results];
    let acceptedLoadList: any = [];
    if (acceptedList?.results?.length > 0) {
      acceptedLoadList = [...acceptedList?.results];
    }
    if (true) {
      if (!chatScreenOpened) {
        showMessage({
          message: "New Message!",
          description:
            data.load_id === load_ID
              ? "You got a new message from the shipper"
              : `You got a new message for the LOAD#: ${data.load_id}`,
          type: "success",
          hideOnPress: true,
          autoHide: true,
          duration: 3000,
          onPress: () => {},
        });
        if (data.load_id === load_ID) {
          console.log("Add count in load details");
          global.myDispatch({
            type: "LOAD_SCREEN_MESSAGE_COUNT",
            payload: unReadmessageCount + 1,
          });
        }
        let loadIndex = loadRequestList.findIndex(
          (obj) => obj.load_id === data.load_id
        );
        let acceptedLoadIndex = acceptedLoadList.findIndex(
          (obj) => obj.load_id === data.load_id
        );

        let loadObject;
        if (acceptedLoadIndex !== -1) {
          loadObject = acceptedLoadList[acceptedLoadIndex];
          loadObject.messageCount = loadObject.messageCount
            ? loadObject.messageCount + 1
            : 1;
          acceptedLoadList.splice(acceptedLoadIndex, 1);
          let updatedLIstObject = {
            page: global.myState.myJobList.page,
            results: [loadObject, ...acceptedLoadList],
          };
          global.myDispatch({
            type: "USER_MY_JOB_LIST_SUCESS",
            payload: updatedLIstObject,
          });
        }
        if (loadIndex !== -1) {
          loadObject = loadRequestList[loadIndex];
          loadObject.messageCount = loadObject.messageCount
            ? loadObject.messageCount + 1
            : 1;
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
      }
    }
  };
  /**
   * This will remove load from Booked Tab and add it to the Past list
   * And it will show flash messages
   * @param loadDetailObject
   */
  const _updateLoadStatusChage = (loadDetailObject) => {
    if (loadDetailObject.status === 10) {
      // status 10 means completed
      let acceptedLoadList: any = [];
      let completedList: any = [];
      if (acceptedList?.results?.length > 0) {
        acceptedLoadList = [...acceptedList?.results];
      }
      if (completedLoadList?.results?.length > 0) {
        completedList = [...completedLoadList?.results];
      }
      let acceptedLoadIndex = acceptedLoadList.findIndex(
        (obj) => obj.load_id === loadDetailObject.load_id
      );
      if (acceptedLoadIndex !== -1) {
        acceptedLoadList.splice(acceptedLoadIndex, 1);
        let updatedLIstObject = {
          page: global.myState.myJobList.page,
          results: [...acceptedLoadList],
        };
        global.myDispatch({
          type: "USER_MY_JOB_LIST_SUCESS",
          payload: updatedLIstObject,
        });

        let updatedPastLIstObject = {
          page: global.myState.myJobList.page,
          results: [loadDetailObject, ...completedList],
        };
        global.myDispatch({
          type: "USER_MY_COMPLETED_JOB_LIST_SUCESS",
          payload: updatedPastLIstObject,
        });
      }
    } else if (
      loadDetailObject.status === 11 ||
      loadDetailObject.status === 9 ||
      loadDetailObject.status === 12
    ) {
      // status 11 means edited by shipper and waiting for approval
      // status 9 means canceled by shipper and waiting for approval
      // status 12 means shipper approved the payment
      let acceptedLoadList: any = [];
      if (acceptedList?.results?.length > 0) {
        acceptedLoadList = [...acceptedList?.results];
      }
      let acceptedLoadIndex = acceptedLoadList.findIndex(
        (obj) => obj.load_id === loadDetailObject.load_id
      );
      if (acceptedLoadIndex !== -1) {
        acceptedLoadList[acceptedLoadIndex] = loadDetailObject;
        let updatedLIstObject = {
          page: global.myState.myJobList.page,
          results: [...acceptedLoadList],
        };
        global.myDispatch({
          type: "USER_MY_JOB_LIST_SUCESS",
          payload: updatedLIstObject,
        });
      }
    }
  };

  const _updateBidStatusChage = (loadDetailObject: any) => {
    if (loadDetailObject.status === 3) {
      let loadOfferList = [...list?.results];
      let loadBoardList = [];
      if (loadBoardlist?.results?.length > 0) {
        loadBoardList = [...loadBoardlist?.results];
      }
      let bidAcceptedLoadIndex = loadOfferList?.findIndex(
        (obj) => obj.load_id === loadDetailObject.load_id
      );
      let bidAcceptedLoadBoardIndex = loadBoardList?.findIndex(
        (obj) => obj.load_id === loadDetailObject.load_id
      );
      if (
        bidAcceptedLoadBoardIndex !== undefined &&
        bidAcceptedLoadBoardIndex !== -1
      ) {
        loadBoardList.splice(bidAcceptedLoadBoardIndex, 1);
        let updatedLIstObject = {
          page: loadBoardlist?.page,
          results: [...loadBoardList],
        };

        global.myDispatch({
          type: "USER_LOAD_BOARD_LIST_SUCESS",
          payload: updatedLIstObject,
        });

        let acceptedLoadList: any = [];
        if (acceptedList?.results?.length > 0) {
          acceptedLoadList = [...acceptedList?.results];
        }

        let updatedAcceptedLIstObject = {
          page: global.myState.myJobList.page,
          results: [loadDetailObject, ...acceptedLoadList],
        };
        global.myDispatch({
          type: "USER_MY_JOB_LIST_SUCESS",
          payload: updatedAcceptedLIstObject,
        });
      }

      if (bidAcceptedLoadIndex !== undefined && bidAcceptedLoadIndex !== -1) {
        loadOfferList.splice(bidAcceptedLoadIndex, 1);
        let updatedLIstObject = {
          page: list?.page,
          results: [...loadOfferList],
        };

        global.myDispatch({
          type: "USER_LOAD_REQUEST_LIST_SUCESS",
          payload: updatedLIstObject,
        });

        let acceptedLoadList: any = [];
        if (acceptedList?.results?.length > 0) {
          acceptedLoadList = [...acceptedList?.results];
        }

        let updatedAcceptedLIstObject = {
          page: global.myState.myJobList.page,
          results: [loadDetailObject, ...acceptedLoadList],
        };
        global.myDispatch({
          type: "USER_MY_JOB_LIST_SUCESS",
          payload: updatedAcceptedLIstObject,
        });
      }
    }
  };
  //To Update newLoad to load offer
  const _updateNewLoad = (newLoad: any) => {
    let loadRequestList = [...list?.results];
    let updatedLIstObject = {
      page: loadRequestList.length
        ? global.myState.userLoadRequestList.page
        : 1,
      results: [newLoad, ...loadRequestList],
    };
    global.myDispatch({
      type: "USER_LOAD_REQUEST_LIST_SUCESS",
      payload: updatedLIstObject,
    });
  };

  //To remove accepted load from Load Offer List and load board list
  const _removeAcceptedLoads = (detail: any) => {
    let loadRequestList = [...list?.results];
    let loadBoardList: any = [];
    if (loadBoardlist?.results?.length > 0) {
      loadBoardList = [...loadBoardlist?.results];
    }
    let loadIndex = loadRequestList.findIndex(
      (obj) => obj.load_id === detail.load_id
    );
    let acceptedLoadBoardIndex = loadBoardList?.findIndex(
      (obj) => obj.load_id === detail.load_id
    );
    //To remove accepted load from Load Board List
    if (acceptedLoadBoardIndex !== undefined && acceptedLoadBoardIndex !== -1) {
      loadBoardList.splice(acceptedLoadBoardIndex, 1);
      let updatedLIstObject = {
        page: loadBoardlist?.page,
        results: [...loadBoardList],
      };

      global.myDispatch({
        type: "USER_LOAD_BOARD_LIST_SUCESS",
        payload: updatedLIstObject,
      });
    }
    //To remove accepted load from Load offer List
    if (loadIndex !== -1) {
      loadRequestList.splice(loadIndex, 1);
      let updatedLIstObject = {
        page: global.myState.userLoadRequestList.page,
        results: [...loadRequestList],
      };
      global.myDispatch({
        type: "USER_LOAD_REQUEST_LIST_SUCESS",
        payload: updatedLIstObject,
      });
    }
  };

  useEffect(() => {
    try {
      async function fetchAPI() {
        let userDetail: any = await storage.get("userData");
        //Socket to update message counts in load detail and load lists
        socket.on(`${userDetail.user_id}`, (data) => {
          showSocketMessage(data);
        });
        //Global socket to update load status
        socket.on(`global/load-status/${userDetail.user_id}`, (data) => {
          _updateLoadStatusChage(data.loadDetails);
        });
        //Global socket to update Bid acceptance
        socket.on(`global/bid-status/${userDetail.user_id}`, (data) => {
          _updateBidStatusChage(data.loadDetails);
        });
        //Global socket to remove accepted loads from load offer and loadboard
        socket.on(`global/load-accept/${userDetail.user_id}`, (data) => {
          if (data.load_accepted || data.bid_accepted) {
            _removeAcceptedLoads(data);
          } else {
            _removeAcceptedLoads(data.loadDetails);
          }
        });

        //Global socket to update New load offers
        socket.on(`global/new-load/${userDetail.user_id}`, (data) => {
          _updateNewLoad(data);
        });
      }
      fetchAPI();
    } catch (error) {
      console.log("socket error", error);
    }
    return () => {
      async function remove() {
        let userDetail: any = await storage.get("userData");
        socket.off(userDetail.user_id);
        socket.off(`global/load-status/${userDetail.user_id}`);
        socket.off(`global/bid-status/${userDetail.user_id}`);
        socket.off(`global/load-accept/${userDetail.user_id}`);
        socket.off(`global/new-load/${userDetail.user_id}`);
      }
      remove();
    };
  }, []);

  // for getting device log data here
  const getDeviceLogs = async () => {
    let deviceName = await DeviceInfo.getDeviceName();
    let osVersion = DeviceInfo.getSystemVersion();
    let appVersion = DeviceInfo.getVersion();
    let osType = DeviceInfo.getSystemName();
    let playerId = await storage.get("deviceId");
    let userDetail = await storage.get("userData");
    try {
      await deviceLog({
        user_id: userDetail.user_id,
        device_token: "27489fdd59cceda9",
        device_model: deviceName,
        player_id: playerId,
        os_type: osType,
        os_version: osVersion,
        app_version: appVersion,
      });
    } catch (error) {
      console.log("ERROR_DEVICE_LOG");
    }
  };

  const callLoadApi = async (isFrom: string) => {
    if (
      isFrom === "initialLoading" ||
      isFrom === "PullToRefresh" ||
      isFrom === "search"
    ) {
      endReached = false;
    }
    let params = {
      offset:
        isFrom === "initialLoading" ||
        isFrom === "PullToRefresh" ||
        isFrom === "search"
          ? 0
          : global.myState.userLoadRequestList.results.length,
      limit: 10,
      lat: currentLocation?.coords?.latitude,
      long: currentLocation?.coords?.longitude,
      searchText: searchTextGlob,
    };
    if (!endReached) {
      await getUserLoadRequestList(
        searchTextGlob.length ? "search" : selectedSortType,
        params
      )
        .then(async (response) => {
          setloadListsLoading(false);
          if (
            isFrom === "initialLoading" ||
            isFrom === "PullToRefresh" ||
            isFrom === "search"
          ) {
            rightNow = moment();
            global.myDispatch({
              type: "USER_LOAD_REQUEST_LIST_SUCESS",
              payload: response.data,
            });
          } else {
            let updatedLIstObject = {
              page: response?.data?.page,
              results: [
                ...global.myState.userLoadRequestList.results,
                ...response.data?.results,
              ],
            };
            if (response.data?.results.length === 0) {
              endReached = true;
            }
            global.myDispatch({
              type: "USER_LOAD_REQUEST_LIST_SUCESS",
              payload: updatedLIstObject,
            });
          }

          if (isFrom === "PullToRefresh") {
            isRefreshing(false);
          } else if (isFrom === "loadMoreList") {
            setLoadMoreloading(false);
          }
        })
        .catch((e) => {
          setloadListsLoading(false);
          setLoadMoreloading(false);
          Alert.alert("Error", e.response.data.message);
        });
    } else {
      if (isFrom === "loadMoreList") {
        setLoadMoreloading(false);
      }
    }
  };
  // getting the current location
  const getHomeCondoLocation = async () => {
    console.log("--$$$$$$$$$$$$-", currentPosition);
    // fetch(
    //   "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    //     currentPosition.coords.latitude +
    //     "," +
    //     currentPosition.coords.longitude +
    //     "&key=" +
    //     "AIzaSyDAmOaaNP3Yx-MBnK2wGTqWMBnAaPPEY_0"
    // )
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log(
    //       "ADDRESS GEOCODE is BACK!! => " + JSON.stringify(responseJson)
    //     );
    //   });
    try {
      const placeInfo = await reverseLookup(currentPosition);
      if (placeInfo.data.features.length > 0) {
        features = placeInfo.data.features[0];
        const arrPlaceNames: Array<any> = features.placeName.split(",");
        if (arrPlaceNames) {
          address1 = arrPlaceNames[0];
          address2 = arrPlaceNames[1];
          city = arrPlaceNames[arrPlaceNames.length - 3];

          addressObj = {
            address_line1: address1,
            address_line2: address2,
            city: city,
            coords: currentPosition.coords,
          };
        }
        setCurrentLocation(addressObj);
      }
    } catch (error) {
      console.log("gps error", error);
    }
  };

  const _onRefresh = () => {
    isRefreshing(true);
    callLoadApi("PullToRefresh");
  };

  // useEffect(() => {
  //   MapboxGL.setTelemetryEnabled(false);
  // }, []);
  const _renderList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("LoadDetailScreen", { loadDetail: item });
        }}
        style={styles.renderListMainView}
      >
        <View style={{ marginHorizontal: 10, paddingVertical: 5 }}>
          <View
            style={{
              marginTop: 5,
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
                LOAD #{item.load_id}
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.small,
                  color: "#808F99",
                  marginTop: deviceHeight / 120,
                }}
              >
                {item.approx_distance ? item.approx_distance : ""} mi
              </Text>
            </View>
            <View style={{}}>
              <Text
                style={{
                  fontSize: fontSizes.medium,
                  color: "#000000",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                ${item.delivery_price}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 5,
                  color: "#808F99",
                  textAlign: "right",
                }}
              >
                ${item.delivery_rate}/mi
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", flex: 1, padding: 15 }}>
          <View style={{ flexDirection: "column", marginHorizontal: 10 }}>
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
              <Text
                style={{
                  fontSize: fontSizes.regular,
                  color: "#222222",
                  marginLeft: 15,
                }}
              >
                {item.origin_address_city}, {item.origin_address_state}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.verticalLineStyle}></View>
              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    color: "#808F99",
                    marginLeft: 20,
                    marginTop: 5,
                  }}
                >
                  {moment(item?.pickup_date).format("ddd MMM DD, yy")}{" "}
                  {moment(item.pickup_date).format("hh:mm A")}
                </Text>
                <View
                  style={{
                    borderBottomColor: "#F7F7F7",
                    borderBottomWidth: 1,
                    marginTop: 10,
                    marginLeft: 15,
                  }}
                />
                <Text
                  style={{
                    fontSize: fontSizes.xSmall,
                    color: "#000000",
                    marginLeft: 20,
                    marginTop: 10,
                    fontWeight: "700",
                  }}
                >
                  Type of Load :{" "}
                  <Text
                    style={{
                      color: "#000000",
                      fontWeight: "200",
                      fontSize: fontSizes.xSmall,
                    }}
                  >
                    {item.loadType?.load_type_name}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.xSmall,
                    color: "#000000",
                    marginLeft: 20,
                    marginTop: 5,
                  }}
                >
                  {item.loadCargo?.cargo_type_name}, {item.approx_weight} Lbs,{" "}
                  {item.loadTrailer?.trailer_type_name}
                </Text>
              </View>
            </View>
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
              <Text
                style={{
                  fontSize: fontSizes.regular,
                  color: "#222222",
                  marginLeft: 15,
                  marginTop: 20,
                }}
              >
                {item.reciever_city}, {item.reciever_state}
              </Text>
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
                {moment(item?.delivery_date).format("ddd MMM DD, yy")}
              </Text>
            </View>
          </View>
          {item.messageCount ? (
            <View style={{ position: "absolute", bottom: 5, right: 0 }}>
              <View style={{}}>
                <FastImage
                  tintColor={"#635FDA"}
                  style={{
                    height: 25,
                    width: 25,
                    marginRight: item.messageCount > 99 ? 20 : 15,
                  }}
                  source={require("../../assets/images/chat.png")}
                ></FastImage>
                <Badge
                  badgeStyle={{ backgroundColor: "black" }}
                  containerStyle={{
                    position: "absolute",
                    top: -4,
                    right: 4,
                  }}
                  textStyle={{ fontWeight: "600" }}
                  status="primary"
                  value={item.messageCount}
                ></Badge>
              </View>
            </View>
          ) : null}
        </View>
        {/* <View style={{}}></View> */}
      </TouchableOpacity>
    );
  };
  // Load More List Loading
  const _loadMoreLoading = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <ActivityIndicator
          animating={loadMoreLoading}
          color={colors.greyDark}
          size="small"
          style={{ width: 80, height: 80 }}
        />
      </View>
    );
  };

  // Load More List
  const loadMoreList = async () => {
    setLoadMoreloading(true);
    callLoadApi("loadMoreList");
  };

  const _renderFlatList = () => {
    return (
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={global.myState.userLoadRequestList.results}
        // data={coordinatesArray}
        renderItem={_renderList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        ListFooterComponent={_loadMoreLoading.bind(this)}
        onEndReached={loadMoreList.bind(this)}
        refreshControl={
          <RefreshControl
            tintColor={[colors.greyLight]}
            refreshing={refreshing}
            onRefresh={_onRefresh.bind(this)}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                // marginTop: deviceHeight / 40,
                fontSize: 16,
                color: "black",
              }}
            >
              {" "}
              No loads found
            </Text>
          </View>
        }
      />
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <View style={{ flex: 1 }}>
        <View style={styles.mainView}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <View>
              <FastImage
                style={{ width: deviceWidth / 2.5, height: 100 }}
                source={require("../../assets/images/fr_new_logo.png")}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("MyLocation")}>
              <View style={[styles.mapDropDownView, {}]}>
                <View style={{ flexDirection: "row" }}>
                  <FastImage
                    tintColor={colors.white}
                    style={styles.mapIcon}
                    source={require("../../assets/images/map.png")}
                  ></FastImage>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      marginLeft: 10,
                      color: "#FFFFFF",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  >
                    {currentLocation ? currentLocation.city : "My Location"}
                  </Text>
                </View>
                <FastImage
                  tintColor={colors.white}
                  style={{
                    width: 15,
                    height: 15,
                    marginHorizontal: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                  source={require("../../assets/images/down.png")}
                ></FastImage>
              </View>
            </TouchableOpacity>
            <View style={{}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("NotificationListScreen");
                }}
              >
                <FastImage
                  style={{ width: 25, height: 25 }}
                  source={require("../../assets/images/notification.png")}
                  resizeMode={FastImage.resizeMode.contain}
                  tintColor={"white"}
                />
                <Badge
                  badgeStyle={{ backgroundColor: "red" }}
                  containerStyle={{
                    position: "absolute",
                    top: -7,
                    right: -10, // if count less than 10 right 6,
                  }}
                  textStyle={{ fontWeight: "bold" }}
                  status="primary"
                  value={"9+"}
                ></Badge>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", marginHorizontal: 15 }}>
            <View style={styles.searchTextInputView}>
              <TextInput
                onChangeText={(text) => {
                  setsearchText(text);
                  searchTextGlob = text;

                  if (timerId) {
                    clearTimeout(timerId);
                    timerId = undefined;
                  }
                  timerId = setTimeout(async () => {
                    timerId = undefined;
                    //Call search api
                    setloadListsLoading(true);
                    callLoadApi("search");
                  }, 800);
                }}
                value={searchText}
                autoCorrect={false}
                placeholder="Search by Org...,Des...City"
                style={styles.searchLoadStyle}
              ></TextInput>
              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                {searchTextGlob.length ? (
                  <TouchableOpacity
                    onPress={() => {
                      (searchTextGlob = ""), setsearchText("");
                      setloadListsLoading(true);
                      callLoadApi("search");
                    }}
                    style={{ padding: 10 }}
                  >
                    <FastImage
                      tintColor={"black"}
                      style={styles.searchIcon}
                      source={require("../../assets/images/close.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={{ padding: 10 }}>
                    <FastImage
                      style={styles.searchIcon}
                      source={require("../../assets/images/search_fr.png")}
                    />
                  </View>
                )}
              </View>
            </View>
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate("LoadBoardScreen");
              }}
              activeOpacity={1}
              style={[
                styles.searchTextInputView,
                {
                  flex: 0.1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 5
                }
              ]}
            >
              <BoardIcon name="dashboard" size={22} color={colors.background} />
            </TouchableOpacity> */}
          </View>

          <View
            style={{
              flexDirection: "column",
              marginHorizontal: 15,
              // alignSelf: "center",
              // backgroundColor: "red",
              padding: 5,
              // flex: 0.1
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                bottom: 15,
              }}
            >
              <Text style={{ fontSize: fontSizes.small, color: "#808F99" }}>
                Last Updated :
              </Text>
              <Text style={{ fontSize: fontSizes.small, color: "#808F99" }}>
                {" "}
                {/* <TimeAgo time={rightNow} /> */}
                <TimeAgo style={{ color: "#000" }} dateTo={rightNow} />
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // paddingRight: 25,
                bottom: 10,
              }}
            >
              <Text style={{ fontSize: fontSizes.small, color: "#858C97" }}>
                Sort :
              </Text>
              <SelectDropdown
                data={[
                  "Latest",
                  "Oldest",
                  "Nearest pickup",
                  "Nearest delivery",
                  "Delivery date - latest",
                  "Delivery date - oldest",
                  "Pickup date - latest",
                  "Pickup date - oldest",
                  "Distance - highest",
                  "Distance - lowest",
                  "Price - highest",
                  "Price - lowest",
                  "Rate per mile - highest",
                  "Rate per mile - lowest",
                ]}
                onSelect={(selectedItem, index) => {
                  setselectedSortType(selectedItem);
                }}
                buttonStyle={styles.dropdown3BtnStyle}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  return (
                    <View style={styles.dropdown3BtnChildStyle}>
                      <Text style={{ fontSize: 14, marginLeft: 10 }}>
                        {selectedSortType ? selectedSortType : "Select Make"}
                      </Text>
                      <FastImage
                        resizeMode={"contain"}
                        source={require("../../../app/assets/images/downArrow.png")}
                        style={{ height: 20, width: 15, marginLeft: 8 }}
                      />
                    </View>
                  );
                }}
                dropdownStyle={styles.dropdown3DropdownStyle}
                rowStyle={styles.dropdown3RowStyle}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <View style={styles.dropdown3RowChildStyle}>
                      <Text style={styles.dropdown3RowTxt}>{item}</Text>
                      {/* <FastImage source={item.logo} style={styles.dropdownRowImage} /> */}
                    </View>
                  );
                }}
              />
              {/* <View style={{ backgroundColor: "red", padding: 10, flex: 1 }}></View> */}
              {/* <Text style={styles.nearestTextStyle}>Nearest Pickup</Text>
            <FastImage
              style={{ width: 20, height: 20, marginLeft: 5, alignSelf: "center" }}
              tintColor={colors.black}
              source={require("../../assets/images/down.png")}
            /> */}
            </View>
          </View>
          <View style={{ marginHorizontal: 10, flex: 1 }}>
            {loadListsLoading || refreshing ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner
                  isVisible={loadListsLoading || refreshing}
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
              _renderFlatList()
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

type Styles = {
  mainContainer: ViewStyle;
  mainView: ViewStyle;
  mapDropDownView: ViewStyle;
  searchTextInputView: ViewStyle;
  searchIcon: ViewStyle;
  searchLoadStyle: ViewStyle;
  nearestTextStyle: ViewStyle;
  myLocationTextStyle: ViewStyle;
  renderListMainView: ViewStyle;
  verticalLineStyle: ViewStyle;
  mapIcon: ViewStyle;
  dropdown3BtnStyle: ViewStyle;
  dropdown3BtnChildStyle: ViewStyle;
  dropdown3BtnImage: ImageStyle;
  dropdown3BtnTxt: TextStyle;
  dropdown3DropdownStyle: ViewStyle;
  dropdown3RowStyle: ViewStyle;
  dropdown3RowChildStyle: ViewStyle;
  dropdownRowImage: ImageStyle;
  dropdown3RowTxt: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  mainContainer: {
    backgroundColor: "#F5F4F7",
    flex: 1,
  },
  mainView: {
    paddingVertical: deviceHeight / 20,
    backgroundColor: colors.background,
    flexDirection: "column",
  },
  mapDropDownView: {
    borderWidth: 1,
    height: deviceHeight / 20,
    borderRadius: 30,
    backgroundColor: colors.black,
    alignSelf: "center",
    flexDirection: "row",
  },
  searchTextInputView: {
    borderWidth: 1,
    borderColor: "white",
    height: deviceHeight / 18,
    borderRadius: 5,
    // marginHorizontal: 15,
    backgroundColor: colors.white,
    bottom: 25,
    flexDirection: "row",
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    // position: "absolute",
    // right: 10,
    // alignSelf: "center"
  },
  searchLoadStyle: {
    fontSize: fontSizes.small,
    color: colors.background,
    alignSelf: "center",
    paddingHorizontal: 15,
    flex: 1,
  },
  nearestTextStyle: {
    fontSize: fontSizes.regular,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#000000",
  },
  myLocationTextStyle: {
    fontSize: fontSizes.regular,
    marginLeft: 10,
    alignSelf: "center",
    color: "#FFFFFF",
  },
  renderListMainView: {
    borderWidth: 1,
    borderColor: "white",
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  verticalLineStyle: {
    flex: 1,
    width: 1,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: colors.greyLight,
    borderStyle: "dashed",
    position: "absolute",
    bottom: -28,
    top: -4,
    left: 5,
    right: 0,
  },
  mapIcon: {
    width: 15,
    height: 15,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  dropdown3BtnStyle: {
    width: "60%",
    paddingHorizontal: 0,
    backgroundColor: "#F5F4F7",
    height: 24,
  },
  dropdown3BtnChildStyle: {
    // marginRight: 10,
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F4F7",
  },
  dropdown3BtnImage: { width: 45, height: 45, resizeMode: "cover" },
  dropdown3BtnTxt: {
    flex: 0.5,
    color: "#000000",
    fontSize: fontSizes.regular,
  },
  dropdown3DropdownStyle: { backgroundColor: "#F5F4F7", borderRadius: 5 },
  dropdown3RowStyle: {
    borderBottomColor: "#EFEFEF",
    height: 45,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  dropdownRowImage: { width: 45, height: 45, resizeMode: "contain" },
  dropdown3RowTxt: {
    color: "black",
    fontWeight: "500",
    fontSize: 14,
    flex: 1,
  },
});

export default Home;
