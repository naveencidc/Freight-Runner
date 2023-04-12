/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationServiceAreasScreen.tsx
 * @extends Component
 * Created by Naveen E on 02/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  ViewStyle,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageStyle,
  TextStyle,
  FlatList,
  SafeAreaView,
} from "react-native";
import { CustomButton, Text, View } from "../../components";
import {
  getServiceAreaList,
  createDriverServiceArea,
  getStateList,
  getUserServiceAreaList,
} from "../../services/registrationService";
import {
  fontSizes,
  PLATFORM,
  STANDARD_PADDING,
} from "../../styles/globalStyles";
import colors1 from "../../styles/colors";
import HeaderWithBack from "../../components/HeaderWithBack";
import FastImage from "react-native-fast-image";
import Spinner from "react-native-spinkit";
import storage from "../../helpers/storage";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import { WebView } from "react-native-webview";
import {
  getUserProfileDetails,
  updateOnbardingStatus,
} from "../../services/userService";
import { MyContext } from "../../context/MyContextProvider";
import { navigateAndSimpleReset } from "../../utils/Utility";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const temp = Platform.OS === "android" ? "document" : "window";
let timerId;

function RegistrationServiceAreasScreen({ navigation, route }) {
  let isFrom = route.params?.isFrom;
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [serviceAreaList, setserviceAreaList] = useState([]);
  const [userServiceAreaList, setuserServiceAreaList] = useState([]);
  const [searchServiceAreaText, setsearchServiceAreaText] = useState("");
  const [selectedServiceAreaList, setselectedServiceAreaList] = useState([]);
  const [serviceAreaListLoading, setserviceAreaListLoading] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [filteredserviceAreaList, setfilteredserviceAreaList] = useState();
  const [usMapLoading, setusMapLoading] = useState(true);
  const [disableButton, setdisableButton] = useState(false);

  const webviewRef = useRef();
  const global: any = useContext(MyContext);
  let userProfileDetails = global.myState.userProfileDetails;
  console.log("trying", userProfileDetails);
  let isFromOnboarding = route.params?.isFromOnboarding;

  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        const userDetail = await storage.get("userData");
        await getUserProfileDetails(userDetail.user_id)
          .then(async (response: any) => {
            console.log("user profile status", response.data);
            global.myDispatch({
              type: "GET_USER_PROFILE_DETAILS",
              payload: response.data,
            });
          })
          .catch((e) => {
            console.log("Navigation failed", e.response);
            navigation.navigate("Login");
          });
      }
      fetchStateListAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, []);
  useEffect(() => {
    try {
      if (!usMapLoading) {
        async function fetchAPI() {
          setserviceAreaListLoading(true);
          //To get service area list detals
          const response = await getServiceAreaList();
          console.log("--Response--", response);
          if (response.data) {
            if (isFrom === "Profile") {
              setdisableButton(true);
              const userDetail = await storage.get("userData");
              //To get userService area list detals
              const serviceArearesponse = await getUserServiceAreaList({
                user_id: userDetail.user_id,
              });
              setuserServiceAreaList(serviceArearesponse.data);
              if (serviceArearesponse.data.length > 0) {
                //To merge service areas with userService areas Data
                let temparray = [];
                temparray = await response.data.map((obj) => {
                  const index = serviceArearesponse.data.findIndex(
                    (el) => el["state_code"] == obj["code"]
                  );
                  let isSelected = index === -1 ? undefined : true;
                  return {
                    ...obj,
                    isSelected,
                  };
                });
                // Ends here
                await temparray.map(async (element) => {
                  if (element.isSelected) {
                    console.log("Naveen", element);
                    await sendDataToWebView(element);
                  }
                  return element;
                });

                setselectedServiceAreaList(serviceArearesponse.data);
                await setserviceAreaList([...temparray]);
              }
            } else {
              setserviceAreaList(response.data);
            }
          }
          setserviceAreaListLoading(false);
        }
        fetchAPI();
      }
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, [usMapLoading]);

  // useEffect(() => {
  //   console.log("-usMapLoading-", usMapLoading);
  //   try {
  //     async function fetchAPI() {
  //       await serviceAreaList.map(async element => {
  //         if (element.isSelected) {
  //           console.log("-123element321", element);
  //           await sendDataToWebView(element);
  //         }
  //         return element;
  //       });
  //     }
  //     if (isFrom === "Profile") {
  //       fetchAPI();
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "There was an error. Please try again.");
  //   }
  // }, [usMapLoading]);

  useEffect(() => {
    if (isFrom === "Profile") {
      if (userServiceAreaList.length !== selectedServiceAreaList.length) {
        setdisableButton(false);
      } else {
        const containsAll = userServiceAreaList.every((element) => {
          return (
            selectedServiceAreaList.findIndex(
              (el) => el["state_code"] == element["state_code"]
            ) !== -1
          );
        });
        setdisableButton(containsAll);
      }
    }
  }, [selectedServiceAreaList]);

  /**
   * Get Data from Webview to ReactNative
   * @param data
   */
  async function onMessage(data) {
    const mapselectedindex = serviceAreaList.findIndex((object) => {
      return object.code === data.nativeEvent.data;
    });
    if (mapselectedindex > -1) {
      let item = serviceAreaList[mapselectedindex];
      if (item.isSelected) {
        let array = [...serviceAreaList];
        array[mapselectedindex].isSelected = undefined;
        await setserviceAreaList(array);
        let selectedArray = [...selectedServiceAreaList];
        const selectedindex = selectedArray.findIndex((object) => {
          return object.service_area === item.name;
        });
        if (selectedindex > -1) {
          selectedArray.splice(selectedindex, 1); //remove one item only
          setselectedServiceAreaList(selectedArray);
        }
      } else {
        let array = [...serviceAreaList];
        array[mapselectedindex].isSelected = true;
        setserviceAreaList(array);
        setselectedServiceAreaList([
          ...selectedServiceAreaList,
          {
            service_area: item.name,
            lat: "41.881832",
            long: "-87.523177",
            state_code: item.code,
          },
        ]);
      }
    }
  }

  /**
   * Send data to webview from ReactNative
   * @param item
   */
  function sendDataToWebView(item) {
    webviewRef.current.postMessage(item.code);
  }

  const createServiceArea = async () => {
    setLoading(true);
    if (!selectedServiceAreaList.length) {
      Alert.alert("Error", "Please select service area");
      setLoading(false);
    } else {
      const userDetail = await storage.get("userData");
      try {
        console.log("----", selectedServiceAreaList);
        await createDriverServiceArea({
          user_id: userDetail.user_id,
          service_areas: selectedServiceAreaList,
        })
          .then(async (response) => {
            setLoading(false);
            console.log("create cargo response", response);
            if (response.status === 201) {
              if (isFrom === "Profile") {
                setMessage("Service area updated successfully.");
                setVisible(true);
                navigation.goBack();
              } else {
                const updateOnbardingStatusResponse =
                  await updateOnbardingStatus({
                    user_id: userDetail.user_id,
                    is_onboard_pending: 2,
                    completed_step: 6,
                    is_welcome_screen_viewed: 2,
                  });
                setMessage("Service area created successfully.");
                setVisible(true);
                navigation.navigate("RegistrationApprovedScreen");
              }
            }
          })
          .catch((e) => {
            setLoading(false);
            console.log("login error", e.response);
            Alert.alert("Error", e.response.data.message);
            // returnResponse = e.response;
          });
      } catch (e) {
        Alert.alert(
          "Error",
          "There was a error creating service area. Please try again later."
        );
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        showOnlyHeader={false}
        title="SERVICE AREAS"
        onPress={async () => {
          if (isFromOnboarding) {
            await storage.remove("tokens");
            navigateAndSimpleReset("auth");
            global.myDispatch({
              type: "LOGOUT",
            });
          } else {
            navigation.goBack();
          }
        }}
        isRightText={false}
        rightText=""
        rightOnPress={() => {}}
      ></HeaderWithBack>
      {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <WebView
              onLoadEnd={() => setusMapLoading(false)}
              bounces={false}
              scrollEnabled={false}
              style={{ height: deviceHeight / 2, width: deviceWidth }}
              ref={webviewRef}
              scalesPageToFit={false}
              mixedContentMode="compatibility"
              onMessage={onMessage}
              source={{
                html: ` 
                <html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">

                <head>
                  <meta name="viewport" content="width=device-width" />
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <title>Freight Runner</title>
                  <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.0/sweetalert.min.js">
                  </script>
                  <script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
                  <script type="text/javascript">
                  document.addEventListener("message", message => {
                    $("svg").each(function() {
                      var selvalue = $(this).find('.' + message.data).attr('value');
                      if(selvalue === "0") {
                        $(this).find('.' + message.data).attr('value', '1')
                        $(this).find('.' + message.data).css({
                          fill: '#6E6EE5'
                        });
                      } else {
                        $(this).find('.' + message.data).attr('value', '0')
                        $(this).find('.' + message.data).css({
                          fill: '#D3D3D3'
                        });
                      }
                    });
                  });
                  window.addEventListener("message", message => {
                    $("svg").each(function() {
                      var selvalue = $(this).find('.' + message.data).attr('value');
                      if(selvalue === "0") {
                        $(this).find('.' + message.data).attr('value', '1')
                        $(this).find('.' + message.data).css({
                          fill: '#6E6EE5'
                        });
                      } else {
                        $(this).find('.' + message.data).attr('value', '0')
                        $(this).find('.' + message.data).css({
                          fill: '#D3D3D3'
                        });
                      }
                    });
                  });
                
                  function myFunction(val) {
                    var value = $(val).attr('class');
                    //alert(id);
                    if(value === 'NM' || value === 'TX' || value === 'OK') {
                      $("svg").each(function() {
                        var selvalue = $(val).attr('value');
                        if(selvalue === "0") {
                          $(this).find('.' + value).attr('value', '1')
                          $(this).find('.' + value).css({
                            fill: '#6E6EE5'
                          });
                        } else {
                          $(this).find('.' + value).attr('value', '0')
                          $(this).find('.' + value).css({
                            fill: '#D3D3D3'
                          });
                        }
                      });
                      window.ReactNativeWebView.postMessage(value);
                    }
                  }
                  </script>
                  <style type="text/css">
                  img {
                    max-width: 100%;
                  }
                  
                  body {
                    -webkit-font-smoothing: antialiased;
                    -webkit-text-size-adjust: none;
                    width: 100% !important;
                    height: 50% !important;
                    line-height: 1.6em;
                  }
                  
                  body {
                    background-color: #f6f6f6;
                  }
                  
                  @media only screen and (max-width: 640px) {
                    body {
                      padding: 0 !important;
                      height: 400px !important;
                      max-width: 100rem;
                      background-color: white;
                    }
                    h1 {
                      font-weight: 800 !important;
                      margin: 20px 0 5px !important;
                    }
                    h2 {
                      font-weight: 800 !important;
                      margin: 20px 0 5px !important;
                    }
                    h3 {
                      font-weight: 800 !important;
                      margin: 20px 0 5px !important;
                    }
                    h4 {
                      font-weight: 800 !important;
                      margin: 20px 0 5px !important;
                    }
                    h1 {
                      font-size: 22px !important;
                    }
                    h2 {
                      font-size: 18px !important;
                    }
                    h3 {
                      font-size: 16px !important;
                    }
                    .container {
                      padding: 0 !important;
                      width: 100% !important;
                    }
                    .content {
                      padding: 0 !important;
                    }
                    .content-wrap {
                      padding: 10px !important;
                    }
                    .invoice {
                      width: 100% !important;
                    }
                  }
                  </style>
                </head>
                
                <body data-new-gr-c-s-check-loaded="14.1063.0" data-gr-ext-installed="">
                  <svg class="us-" xmlns="http://www.w3.org/2000/svg" width="420" height="550" viewBox="0 320 959 593">
                    <g class="outlines">
                      <path value="0" d="M628.5,466.4 l0.6,0.2 1.3,-2.7 1.5,-4.4 2.3,0.6 3.1,6 v1 l-2.7,1.9 2.7,0.3 5.2,-2.5 -0.3,-7.6 -2.5,-1.8 -2,-2 0.4,-4 10.5,-1.5 25.7,-2.9 6.7,-0.6 5.6,0.1 -0.5,-2.2 -1.5,-0.8 -0.9,-1.1 1,-2.6 -0.4,-5.2 -1.6,-4.5 0.8,-5.1 1.7,-4.8 -0.2,-1.7 -1.8,-0.7 -0.5,-3.6 -2.7,-3.4 -2,-6.5 -1.4,-6.7 -1.8,-5 -3.8,-16 -3.5,-7.9 -0.8,-5.6 0.1,-2.2 -9,0.8 -23.4,2.2 -12.2,0.8 -0.2,6.4 0.2,16.7 -0.7,31 -0.3,14.1 2.8,18.8 1.6,14.7z" fill="#D3D3D3" data-name="AL" class="AL " onclick="myFunction(this)"></path>
                      <path value="0" d="M135.1,389.7 l-0.3,1.5 0.5,1 18.9,10.7 12.1,7.6 14.7,8.6 16.8,10 12.3,2.4 25.4,2.7 6,-39.6 7,-53.1 4.4,-31 -24.6,-3.6 -60.7,-11 -0.2,1.1 -2.6,16.5 -2.1,3.8 -2.8,-0.2 -1.2,-2.6 -2.6,-0.4 -1.2,-1.1 -1.1,0.1 -2.1,1.7 -0.3,6.8 -0.3,1.5 -0.5,12.5 -1.5,2.4 -0.4,3.3 2.8,5 1.1,5.5 0.7,1.1 1.1,0.9 -0.4,2.4 -1.7,1.2 -3.4,1.6 -1.6,1.8 -1.6,3.6 -0.5,4.9 -3,2.9 -1.9,0.9 -0.1,5.8 -0.6,1.6 0.5,0.8 3.9,0.4 -0.9,3 -1.7,2.4 -3.7,0.4z" fill="#D3D3D3" data-name="AZ" class="AZ " onclick="myFunction(this)"></path>
                      <path value="0" d="M122.7,385.9 l-19.7,-2.7 -10,-1.5 -0.5,-1.8 v-9.4 l-0.3,-3.2 -2.6,-4.2 -0.8,-2.3 -3.9,-4.2 -2.9,-4.7 -2.7,-0.2 -3.2,-0.8 -0.3,-1 1.5,-0.6 -0.6,-3.2 -1.5,-2.1 -4.8,-0.8 -3.9,-2.1 -1.1,-2.3 -2.6,-4.8 -2.9,-3.1 h-2.9 l-3.9,-2.1 -4.5,-1.8 -4.2,-0.5 -2.4,-2.7 0.5,-1.9 1.8,-7.1 0.8,-1.9 v-2.4 l-1.6,-1 -0.5,-2.9 -1.5,-2.6 -3.4,-5.8 -1.3,-3.1 -1.5,-4.7 -1.6,-5.3 -3.2,-4.4 -0.5,-2.9 0.8,-3.9 h1.1 l2.1,-1.6 1.1,-3.6 -1,-2.7 -2.7,-0.5 -1.9,-2.6 -2.1,-3.7 -0.2,-8.2 0.6,-1.9 0.6,-2.3 0.5,-2.4 -5.7,-6.3 v-2.1 l0.3,-0.5 0.3,-3.2 -1.3,-4 -2.3,-4.8 -2.7,-4.5 -1.8,-3.9 1,-3.7 0.6,-5.8 1.8,-3.1 0.3,-6.5 -1.1,-3.6 -1.6,-4.2 -2.7,-4.2 0.8,-3.2 1.5,-4.2 1.8,-0.8 0.3,-1.1 3.1,-2.6 5.2,-11.8 0.2,-7.4 1.69,-4.9 38.69,11.8 25.6,6.6 -8,31.3 -8.67,33.1 12.63,19.2 42.16,62.3 17.1,26.1 -0.4,3.1 2.8,5.2 1.1,5.4 1,1.5 0.7,0.6 -0.2,1.4 -1.4,1 -3.4,1.6 -1.9,2.1 -1.7,3.9 -0.5,4.7 -2.6,2.5 -2.3,1.1 -0.1,6.2 -0.6,1.9 1,1.7 3,0.3 -0.4,1.6 -1.4,2 -3.9,0.6z m-73.9,-48.9 1.3,1.5 -0.2,1.3 -3.2,-0.1 -0.6,-1.2 -0.6,-1.5z m1.9,0 1.2,-0.6 3.6,2.1 3.1,1.2 -0.9,0.6 -4.5,-0.2 -1.6,-1.6z m20.7,19.8 1.8,2.3 0.8,1 1.5,0.6 0.6,-1.5 -1,-1.8 -2.7,-2 -1.1,0.2 v1.2z m-1.4,8.7 1.8,3.2 1.2,1.9 -1.5,0.2 -1.3,-1.2 c0,0 -0.7,-1.5 -0.7,-1.9 0,-0.4 0,-2.2 0,-2.2z" fill="#D3D3D3" data-name="CA" class="CA " onclick="myFunction(this)"></path>
                      <path value="0" d="M380.2,235.5 l-36,-3.5 -79.1,-8.6 -2.2,22.1 -7,50.4 -1.9,13.7 34,3.9 37.5,4.4 34.7,3 14.3,0.6z" fill="#D3D3D3" data-name="CO" class="CO " onclick="myFunction(this)"></path>
                      <path value="0" d="M587.3,346.1 l-6.4,-0.7 0.9,-3.1 3.1,-2.6 0.6,-2.3 -1.8,-2.9 -31.9,1.2 -23.3,0.7 -23.6,0.3 1.5,6.9 0.1,8.5 1.4,10.9 0.3,38.2 2.1,1.6 3,-1.2 2.9,1.2 0.4,10.1 25.2,-0.2 26.8,-0.8 0.9,-1.9 -0.3,-3.8 -1.7,-3.1 1.5,-1.4 -1.4,-2.2 0.7,-2.4 1.1,-5.9 2.7,-2.3 -0.8,-2.2 4,-5.6 2.5,-1.1 -0.1,-1.7 -0.5,-1.7 2.9,-5.8 2.5,-1.1 0.2,-3.3 2.1,-1.4 0.9,-4.1 -1.4,-4 4.2,-2.4 0.3,-2.1 1.2,-4.2 0.9,-3.1z" fill="#D3D3D3" data-name="AR" class="AR " onclick="myFunction(this)"></path>
                      <path value="0" d="M852,190.9 l3.6,-3.2 1.9,-2.1 0.8,0.6 2.7,-1.5 5.2,-1.1 7,-3.5 -0.6,-4.2 -0.8,-4.4 -1.6,-6 -4.3,1.1 -21.8,4.7 0.6,3.1 1.5,7.3 v8.3 l-0.9,2.1 1.7,2.2z" fill="#D3D3D3" data-name="CT" class="CT " onclick="myFunction(this)"></path>
                      <path value="0" d="M834.4,247.2 l-1,0.5 -3.6,-2.4 -1.8,-4.7 -1.9,-3.6 -2.3,-1 -2.1,-3.6 0.5,-2 0.5,-2.3 0.1,-1.1 -0.6,0.1 -1.7,1 -2,1.7 -0.2,0.3 1.4,4.1 2.3,5.6 3.7,16.1 5,-0.3 6,-1.1z" fill="#D3D3D3" data-name="DE" class="DE " onclick="myFunction(this)"></path>
                      <path value="0" d="M750.2,445.2 l-5.2,-0.7 -0.7,0.8 1.5,4.4 -0.4,5.2 -4.1,-1 -0.2,-2.8 h-4.1 l-5.3,0.7 -32.4,1.9 -8.2,-0.3 -1.7,-1.7 -2.5,-4.2 h-5.9 l-6.6,0.5 -35.4,4.2 -0.3,2.8 1.6,1.6 2.9,2 0.3,8.4 3.3,-0.6 6,-2.1 6,-0.5 4.4,-0.6 7.6,1.8 8.1,3.9 1.6,1.5 2.9,1.1 1.6,1.9 0.3,2.7 3.2,-1.3 h3.9 l3.6,-1.9 3.7,-3.6 3.1,0.2 0.5,-1.1 -0.8,-1 0.2,-1.9 4,-0.8 h2.6 l2.9,1.5 4.2,1.5 2.4,3.7 2.7,1 1.1,3.4 3.4,1.6 1.6,2.6 1.9,0.6 5.2,1.3 1.3,3.1 3,3.7 v9.5 l-1.5,4.7 0.3,2.7 1.3,4.8 1.8,4 0.8,-0.5 1.5,-4.5 -2.6,-1 -0.3,-0.6 1.6,-0.6 4.5,1 0.2,1.6 -3.2,5.5 -2.1,2.4 3.6,3.7 2.6,3.1 2.9,5.3 2.9,3.9 2.1,5 1.8,0.3 1.6,-2.1 1.8,1.1 2.6,4 0.6,3.6 3.1,4.4 0.8,-1.3 3.9,0.3 3.6,2.3 3.4,5.2 0.8,3.4 0.3,2.9 1.1,1 1.3,0.5 2.4,-1 1.5,-1.6 3.9,-0.2 3.1,-1.5 2.7,-3.2 -0.5,-1.9 -0.3,-2.4 0.6,-1.9 -0.3,-1.9 2.4,-1.3 0.3,-3.4 -0.6,-1.8 -0.5,-12 -1.3,-7.6 -4.5,-8.2 -3.6,-5.8 -2.6,-5.3 -2.9,-2.9 -2.9,-7.4 0.7,-1.4 1.1,-1.3 -1.6,-2.9 -4,-3.7 -4.8,-5.5 -3.7,-6.3 -5.3,-9.4 -3.7,-9.7 -2.3,-7.3z m17.7,132.7 2.4,-0.6 1.3,-0.2 1.5,-2.3 2.3,-1.6 1.3,0.5 1.7,0.3 0.4,1.1 -3.5,1.2 -4.2,1.5 -2.3,1.2z m13.5,-5 1.2,1.1 2.7,-2.1 5.3,-4.2 3.7,-3.9 2.5,-6.6 1,-1.7 0.2,-3.4 -0.7,0.5 -1,2.8 -1.5,4.6 -3.2,5.3 -4.4,4.2 -3.4,1.9z" fill="#D3D3D3" data-name="FL" class="FL " onclick="myFunction(this)"></path>
                      <path value="0" d="M750.2,444.2 l-5.6,-0.7 -1.4,1.6 1.6,4.7 -0.3,3.9 -2.2,-0.6 -0.2,-3 h-5.2 l-5.3,0.7 -32.3,1.9 -7.7,-0.3 -1.4,-1.2 -2.5,-4.3 -0.8,-3.3 -1.6,-0.9 -0.5,-0.5 0.9,-2.2 -0.4,-5.5 -1.6,-4.5 0.8,-4.9 1.7,-4.8 -0.2,-2.5 -1.9,-0.7 -0.4,-3.2 -2.8,-3.5 -1.9,-6.2 -1.5,-7 -1.7,-4.8 -3.8,-16 -3.5,-8 -0.8,-5.3 0.1,-2.3 3.3,-0.3 13.6,-1.6 18.6,-2 6.3,-1.1 0.5,1.4 -2.2,0.9 -0.9,2.2 0.4,2 1.4,1.6 4.3,2.7 3.2,-0.1 3.2,4.7 0.6,1.6 2.3,2.8 0.5,1.7 4.7,1.8 3,2.2 2.3,3 2.3,1.3 2,1.8 1.4,2.7 2.1,1.9 4.1,1.8 2.7,6 1.7,5.1 2.8,0.7 2.1,1.9 2,5.7 2.9,1.6 1.7,-0.8 0.4,1.2 -3.3,6.2 0.5,2.6 -1.5,4.2 -2.3,10 0.8,6.3z" fill="#D3D3D3" data-name="GA" class="GA " onclick="myFunction(this)"></path>
                      <path value="0" d="M556.8,183.6 l2.1,2.1 0.3,0.7 -2,3 0.3,4 2.6,4.1 3.1,1.6 2.4,0.3 0.9,1.8 0.2,2.4 2.5,1 0.9,1.1 0.5,1.6 3.8,3.3 0.6,1.9 -0.7,3 -1.7,3.7 -0.6,2.4 -2.1,1.6 -1.6,0.5 -5.7,1.5 -1.6,4.8 0.8,1.8 1.7,1.5 -0.2,3.5 -1.9,1.4 -0.7,1.8 v2.4 l-1.4,0.4 -1.7,1.4 -0.5,1.7 0.4,1.7 -1.3,1 -2.3,-2.7 -1.4,-2.8 -8.3,0.8 -10,0.6 -49.2,1.2 -1.6,-4.3 -0.4,-6.7 -1.4,-4.2 -0.7,-5.2 -2.2,-3.7 -1,-4.6 -2.7,-7.8 -1.1,-5.6 -1.4,-1.9 -1.3,-2.9 1.7,-3.8 1.2,-6.1 -2.7,-2.2 -0.3,-2.4 0.7,-2.4 1.8,-0.3 61.1,-0.6 21.2,-0.7z" fill="#D3D3D3" data-name="IA" class="IA " onclick="myFunction(this)"></path>
                      <path value="0" d="M175.3,27.63 l-4.8,17.41 -4.5,20.86 -3.4,16.22 -0.4,9.67 1.2,4.44 3.5,2.66 -0.2,3.91 -3.9,4.4 -4.5,6.6 -0.9,2.9 -1.2,1.1 -1.8,0.8 -4.3,5.3 -0.4,3.1 -0.4,1.1 0.6,1 2.6,-0.1 1.1,2.3 -2.4,5.8 -1.2,4.2 -8.8,35.3 20.7,4.5 39.5,7.9 34.8,6.1 4.9,-29.2 3.8,-24.1 -2.7,-2.4 -0.4,-2.6 -0.8,-1.1 -2.1,1 -0.7,2.6 -3.2,0.5 -3.9,-1.6 -3.8,0.1 -2.5,0.7 -3.4,-1.5 -2.4,0.2 -2.4,2 -2,-1.1 -0.7,-4 0.7,-2.9 -2.5,-2.9 -3.3,-2.6 -2.7,-13.1 -0.1,-4.7 -0.3,-0.1 -0.2,0.4 -5.1,3.5 -1.7,-0.2 -2.9,-3.4 -0.2,-3.1 7,-17.13 -0.4,-1.94 -3.4,-1.15 -0.6,-1.18 -2.6,-3.46 -4.6,-10.23 -3.2,-1.53 -2,-4.95 1.3,-4.63 -3.2,-7.58 4.4,-21.52z" fill="#D3D3D3" data-name="ID" class="ID " onclick="myFunction(this)"></path>
                      <path value="0" d="M618.7,214.3 l-0.8,-2.6 -1.3,-3.7 -1.6,-1.8 -1.5,-2.6 -0.4,-5.5 -15.9,1.8 -17.4,1 h-12.3 l0.2,2.1 2.2,0.9 1.1,1.4 0.4,1.4 3.9,3.4 0.7,2.4 -0.7,3.3 -1.7,3.7 -0.8,2.7 -2.4,1.9 -1.9,0.6 -5.2,1.3 -1.3,4.1 0.6,1.1 1.9,1.8 -0.2,4.3 -2.1,1.6 -0.5,1.3 v2.8 l-1.8,0.6 -1.4,1.2 -0.4,1.2 0.4,2 -1.6,1.3 -0.9,2.8 0.3,3.9 2.3,7 7,7.6 5.7,3.7 v4.4 l0.7,1.2 6.6,0.6 2.7,1.4 -0.7,3.5 -2.2,6.2 -0.8,3 2,3.7 6.4,5.3 4.8,0.8 2.2,5.1 2,3.4 -0.9,2.8 1.5,3.8 1.7,2.1 1.6,-0.3 1,-2.2 2.4,-1.7 2.8,-1 6.1,2.5 0.5,-0.2 v-1.1 l-1.2,-2.7 0.4,-2.8 2.4,-1.6 3.4,-1.2 -0.5,-1.3 -0.8,-2 1.2,-1.3 1,-2.7 v-4 l0.4,-4.9 2.5,-3 1.8,-3.8 2.5,-4 -0.5,-5.3 -1.8,-3.2 -0.3,-3.3 0.8,-5.3 -0.7,-7.2 -1.1,-15.8 -1.4,-15.3 -0.9,-11.7z" fill="#D3D3D3" data-name="IL" class="IL " onclick="myFunction(this)"></path>
                      <path value="0" d="M622.9,216.1 l1.5,1 1.1,-0.3 2.1,-1.9 2.5,-1.8 14.3,-1.1 18.4,-1.8 1.6,15.5 4.9,42.6 -0.6,2.9 1.3,1.6 0.2,1.3 -2.3,1.6 -3.6,1.7 -3.2,0.4 -0.5,4.8 -4.7,3.6 -2.9,4 0.2,2.4 -0.5,1.4 h-3.5 l-1.4,-1.7 -5.2,3 0.2,3.1 -0.9,0.2 -0.5,-0.9 -2.4,-1.7 -3.6,1.5 -1.4,2.9 -1.2,-0.6 -1.6,-1.8 -4.4,0.5 -5.7,1 -2.5,1.3 v-2.6 l0.4,-4.7 2.3,-2.9 1.8,-3.9 2.7,-4.2 -0.5,-5.8 -1.8,-3.1 -0.3,-3.2 0.8,-5.3 -0.7,-7.1 -0.9,-12.6 -2.5,-30.1z" fill="#D3D3D3" data-name="IN" class="IN " onclick="myFunction(this)"></path>
                      <path value="0" d="M485.9,259.5 l-43.8,-0.6 -40.6,-1.2 -21.7,-0.9 -4.3,64.8 24.3,1 44.7,2.1 46.3,0.6 12.6,-0.3 0.7,-35 -1.2,-11.1 -2.5,-2 -2.4,-3 -2.3,-3.6 0.6,-3 1.7,-1.4 v-2.1 l-0.8,-0.7 -2.6,-0.2 -3.5,-3.4z" fill="#D3D3D3" data-name="KS" class="KS " onclick="myFunction(this)"></path>
                      <path value="0" d="M607.2,331.8 l12.6,-0.7 0.1,-4.1 h4.3 l30.4,-3.2 45.1,-4.3 5.6,-3.6 3.9,-2.1 0.1,-1.9 6,-7.8 4.1,-3.6 2.1,-2.4 -3.3,-2 -2.5,-2.7 -3,-3.8 -0.5,-2.2 -2.6,-1.4 -0.9,-1.9 -0.2,-6.1 -2.6,-2 -1.9,-1.1 -0.5,-2.3 -1.3,0.2 -2,1.2 -2.5,2.7 -1.9,-1.7 -2.5,-0.5 -2.4,1.4 h-2.3 l-1.8,-2 -5.6,-0.1 -1.8,-4.5 -2.9,-1.5 -2.1,0.8 -4.2,0.2 -0.5,2.1 1.2,1.5 0.3,2.1 -2.8,2 -3.8,1.8 -2.6,0.4 -0.5,4.5 -4.9,3.6 -2.6,3.7 0.2,2.2 -0.9,2.3 -4.5,-0.1 -1.3,-1.3 -3.9,2.2 0.2,3.3 -2.4,0.6 -0.8,-1.4 -1.7,-1.2 -2.7,1.1 -1.8,3.5 -2.2,-1 -1.4,-1.6 -3.7,0.4 -5.6,1 -2.8,1.3 -1.2,3.4 -1,1 1.5,3.7 -4.2,1.4 -1.9,1.4 -0.4,2.2 1.2,2.4 v2.2 l-1.6,0.4 -6.1,-2.5 -2.3,0.9 -2,1.4 -0.8,1.8 1.7,2.4 -0.9,1.8 -0.1,3.3 -2.4,1.3 -2.1,1.7z" fill="#D3D3D3" data-name="KY" class="KY " onclick="myFunction(this)"></path>
                      <path value="0" d="M526.9,485.9 l8.1,-0.3 10.3,3.6 6.5,1.1 3.7,-1.5 3.2,1.1 3.2,1 0.8,-2.1 -3.2,-1.1 -2.6,0.5 -2.7,-1.6 0.8,-1.5 3.1,-1 1.8,1.5 1.8,-1 3.2,0.6 1.5,2.4 0.3,2.3 4.5,0.3 1.8,1.8 -0.8,1.6 -1.3,0.8 1.6,1.6 8.4,3.6 3.6,-1.3 1,-2.4 2.6,-0.6 1.8,-1.5 1.3,1 0.8,2.9 -2.3,0.8 0.6,0.6 3.4,-1.3 2.3,-3.4 0.8,-0.5 -2.1,-0.3 0.8,-1.6 -0.2,-1.5 2.1,-0.5 1.1,-1.3 0.6,0.8 0.6,3.1 4.2,0.6 4,1.9 1,1.5 h2.9 l1.1,1 2.3,-3.1 v-1.5 h-1.3 l-3.4,-2.7 -5.8,-0.8 -3.2,-2.3 1.1,-2.7 2.3,0.3 0.2,-0.6 -1.8,-1 v-0.5 h3.2 l1.8,-3.1 -1.3,-1.9 -0.3,-2.7 -1.5,0.2 -1.9,2.1 -0.6,2.6 -3.1,-0.6 -1,-1.8 1.8,-1.9 1.9,-1.7 -2.2,-6.5 -3.4,-3.4 1,-7.3 -0.2,-0.5 -1.3,0.2 -33.1,1.4 -0.8,-2.4 0.8,-8.5 8.6,-14.8 -0.9,-2.6 1.4,-0.4 0.4,-2 -2.2,-2 0.1,-1.9 -2,-4.5 -0.4,-5.1 0.1,-0.7 -26.4,0.8 -25.2,0.1 0.4,9.7 0.7,9.5 0.5,3.7 2.6,4.5 0.9,4.4 4.3,6 0.3,3.1 0.6,0.8 -0.7,8.3 -2.8,4.6 1.2,2.4 -0.5,2.6 -0.8,7.3 -1.3,3 0.2,3.7z" fill="#D3D3D3" data-name="LA" class="LA " onclick="myFunction(this)"></path>
                      <path value="0" d="M887.5,172.5 l-0.5,-2.3 0.8,-1.5 2.9,-1.5 0.8,3.1 -0.5,1.8 -2.4,1.5 v1 l1.9,-1.5 3.9,-4.5 3.9,-1.9 4.2,-1.5 -0.3,-2.4 -1,-2.9 -1.9,-2.4 -1.8,-0.8 -2.1,0.2 -0.5,0.5 1,1.3 1.5,-0.8 2.1,1.6 0.8,2.7 -1.8,1.8 -2.3,1 -3.6,-0.5 -3.9,-6 -2.3,-2.6 h-1.8 l-1.1,0.8 -1.9,-2.6 0.3,-1.5 2.4,-5.2 -2.9,-4.4 -3.7,1.8 -1.8,2.9 -18.3,4.7 -13.8,2.5 -0.6,10.6 0.7,4.9 22,-4.8 11.2,-2.8 2,1.6 3.4,4.3 2.9,4.7z m12.5,1.4 2.2,-0.7 0.5,-1.7 1,0.1 1,2.3 -1.3,0.5 -3.9,0.1z m-9.4,0.8 2.3,-2.6 h1.6 l1.8,1.5 -2.4,1 -2.2,1z" fill="#D3D3D3" data-name="MA" class="MA " onclick="myFunction(this)"></path>
                      <path value="0" d="M834.8,264.1 l1.7,-3.8 0.5,-4.8 -6.3,1.1 -5.8,0.3 -3.8,-16.8 -2.3,-5.5 -1.5,-4.6 -22.2,4.3 -37.6,7.6 2,10.4 4.8,-4.9 2.5,-0.7 1.4,-1.5 1.8,-2.7 1.6,0.7 2.6,-0.2 2.6,-2.1 2,-1.5 2.1,-0.6 1.5,1.1 2.7,1.4 1.9,1.8 1.3,1.4 4.8,1.6 -0.6,2.9 5.8,2.1 2.1,-2.6 3.7,2.5 -2.1,3.3 -0.7,3.3 -1.8,2.6 v2.1 l0.3,0.8 2,1.3 3.4,1.1 4.3,-0.1 3.1,1 2.1,0.3 1,-2.1 -1.5,-2.1 v-1.8 l-2.4,-2.1 -2.1,-5.5 1.3,-5.3 -0.2,-2.1 -1.3,-1.3 c0,0 1.5,-1.6 1.5,-2.3 0,-0.6 0.5,-2.1 0.5,-2.1 l1.9,-1.3 1.9,-1.6 0.5,1 -1.5,1.6 -1.3,3.7 0.3,1.1 1.8,0.3 0.5,5.5 -2.1,1 0.3,3.6 0.5,-0.2 1.1,-1.9 1.6,1.8 -1.6,1.3 -0.3,3.4 2.6,3.4 3.9,0.5 1.6,-0.8 3.2,4.2 1,0.4z m-14.5,0.2 1.1,2.5 0.2,1.8 1.1,1.9 c0,0 0.9,-0.9 0.9,-1.2 0,-0.3 -0.7,-3.1 -0.7,-3.1 l-0.7,-2.3z" fill="#D3D3D3" data-name="MD" class="MD " onclick="myFunction(this)"></path>
                      <path value="0" d="M865.8,91.9 l1.5,0.4 v-2.6 l0.8,-5.5 2.6,-4.7 1.5,-4 -1.9,-2.4 v-6 l0.8,-1 0.8,-2.7 -0.2,-1.5 -0.2,-4.8 1.8,-4.8 2.9,-8.9 2.1,-4.2 h1.3 l1.3,0.2 v1.1 l1.3,2.3 2.7,0.6 0.8,-0.8 v-1 l4,-2.9 1.8,-1.8 1.5,0.2 6,2.4 1.9,1 9.1,29.9 h6 l0.8,1.9 0.2,4.8 2.9,2.3 h0.8 l0.2,-0.5 -0.5,-1.1 2.8,-0.5 1.9,2.1 2.3,3.7 v1.9 l-2.1,4.7 -1.9,0.6 -3.4,3.1 -4.8,5.5 c0,0 -0.6,0 -1.3,0 -0.6,0 -1,-2.1 -1,-2.1 l-1.8,0.2 -1,1.5 -2.4,1.5 -1,1.5 1.6,1.5 -0.5,0.6 -0.5,2.7 -1.9,-0.2 v-1.6 l-0.3,-1.3 -1.5,0.3 -1.8,-3.2 -2.1,1.3 1.3,1.5 0.3,1.1 -0.8,1.3 0.3,3.1 0.2,1.6 -1.6,2.6 -2.9,0.5 -0.3,2.9 -5.3,3.1 -1.3,0.5 -1.6,-1.5 -3.1,3.6 1,3.2 -1.5,1.3 -0.2,4.4 -1.1,6.3 -2.2,-0.9 -0.5,-3.1 -4,-1.1 -0.2,-2.5 -11.7,-37.43z m36.5,15.6 1.5,-1.5 1.4,1.1 0.6,2.4 -1.7,0.9z m6.7,-5.9 1.8,1.9 c0,0 1.3,0.1 1.3,-0.2 0,-0.3 0.2,-2 0.2,-2 l0.9,-0.8 -0.8,-1.8 -2,0.7z" fill="#D3D3D3" data-name="ME" class="ME" onclick="myFunction(this)"></path>
                      <path value="0" d="M644.5,211 l19.1,-1.9 0.2,1.1 9.9,-1.5 12,-1.7 0.1,-0.6 0.2,-1.5 2.1,-3.7 2,-1.7 -0.2,-5.1 1.6,-1.6 1.1,-0.3 0.2,-3.6 1.5,-3 1.1,0.6 0.2,0.6 0.8,0.2 1.9,-1 -0.4,-9.1 -3.2,-8.2 -2.3,-9.1 -2.4,-3.2 -2.6,-1.8 -1.6,1.1 -3.9,1.8 -1.9,5 -2.7,3.7 -1.1,0.6 -1.5,-0.6 c0,0 -2.6,-1.5 -2.4,-2.1 0.2,-0.6 0.5,-5 0.5,-5 l3.4,-1.3 0.8,-3.4 0.6,-2.6 2.4,-1.6 -0.3,-10 -1.6,-2.3 -1.3,-0.8 -0.8,-2.1 0.8,-0.8 1.6,0.3 0.2,-1.6 -2.6,-2.2 -1.3,-2.6 h-2.6 l-4.5,-1.5 -5.5,-3.4 h-2.7 l-0.6,0.6 -1,-0.5 -3.1,-2.3 -2.9,1.8 -2.9,2.3 0.3,3.6 1,0.3 2.1,0.5 0.5,0.8 -2.6,0.8 -2.6,0.3 -1.5,1.8 -0.3,2.1 0.3,1.6 0.3,5.5 -3.6,2.1 -0.6,-0.2 v-4.2 l1.3,-2.4 0.6,-2.4 -0.8,-0.8 -1.9,0.8 -1,4.2 -2.7,1.1 -1.8,1.9 -0.2,1 0.6,0.8 -0.6,2.6 -2.3,0.5 v1.1 l0.8,2.4 -1.1,6.1 -1.6,4 0.6,4.7 0.5,1.1 -0.8,2.4 -0.3,0.8 -0.3,2.7 3.6,6 2.9,6.5 1.5,4.8 -0.8,4.7 -1,6 -2.4,5.2 -0.3,2.7 -3.2,3.1z m-33.3,-72.4 -1.3,-1.1 -1.8,-10.4 -3.7,-1.3 -1.7,-2.3 -12.6,-2.8 -2.8,-1.1 -8.1,-2.2 -7.8,-1 -3.9,-5.3 0.7,-0.5 2.7,-0.8 3.6,-2.3 v-1 l0.6,-0.6 6,-1 2.4,-1.9 4.4,-2.1 0.2,-1.3 1.9,-2.9 1.8,-0.8 1.3,-1.8 2.3,-2.3 4.4,-2.4 4.7,-0.5 1.1,1.1 -0.3,1 -3.7,1 -1.5,3.1 -2.3,0.8 -0.5,2.4 -2.4,3.2 -0.3,2.6 0.8,0.5 1,-1.1 3.6,-2.9 1.3,1.3 h2.3 l3.2,1 1.5,1.1 1.5,3.1 2.7,2.7 3.9,-0.2 1.5,-1 1.6,1.3 1.6,0.5 1.3,-0.8 h1.1 l1.6,-1 4,-3.6 3.4,-1.1 6.6,-0.3 4.5,-1.9 2.6,-1.3 1.5,0.2 v5.7 l0.5,0.3 2.9,0.8 1.9,-0.5 6.1,-1.6 1.1,-1.1 1.5,0.5 v7 l3.2,3.1 1.3,0.6 1.3,1 -1.3,0.3 -0.8,-0.3 -3.7,-0.5 -2.1,0.6 -2.3,-0.2 -3.2,1.5 h-1.8 l-5.8,-1.3 -5.2,0.2 -1.9,2.6 -7,0.6 -2.4,0.8 -1.1,3.1 -1.3,1.1 -0.5,-0.2 -1.5,-1.6 -4.5,2.4 h-0.6 l-1.1,-1.6 -0.8,0.2 -1.9,4.4 -1,4 -3.2,6.9z m-29.6,-56.5 1.8,-2.1 2.2,-0.8 5.4,-3.9 2.3,-0.6 0.5,0.5 -5.1,5.1 -3.3,1.9 -2.1,0.9z m86.2,32.1 0.6,2.5 3.2,0.2 1.3,-1.2 c0,0 -0.1,-1.5 -0.4,-1.6 -0.3,-0.2 -1.6,-1.9 -1.6,-1.9 l-2.2,0.2 -1.6,0.2 -0.3,1.1z" fill="#D3D3D3" data-name="MI" class="MI" onclick="myFunction(this)"></path>
                      <path value="0" d="M464.6,66.79 l-0.6,3.91 v10.27 l1.6,5.03 1.9,3.32 0.5,9.93 1.8,13.45 1.8,7.3 0.4,6.4 v5.3 l-1.6,1.8 -1.8,1.3 v1.5 l0.9,1.7 4.1,3.5 0.7,3.2 v35.9 l60.3,-0.6 21.2,-0.7 -0.5,-6 -1.8,-2.1 -7.2,-4.6 -3.6,-5.3 -3.4,-0.9 -2,-2.8 h-3.2 l-3.5,-3.8 -0.5,-7 0.1,-3.9 1.5,-3 -0.7,-2.7 -2.8,-3.1 2.2,-6.1 5.4,-4 1.2,-1.4 -0.2,-8 0.2,-3 2.6,-3 3.8,-2.9 1.3,-0.2 4.5,-5 1.8,-0.8 2.3,-3.9 2.4,-3.6 3.1,-2.6 4.8,-2 9.2,-4.1 3.9,-1.8 0.6,-2.3 -4.4,0.4 -0.7,1.1 h-0.6 l-1.8,-3.1 -8.9,0.3 -1,0.8 h-1 l-0.5,-1.3 -0.8,-1.8 -2.6,0.5 -3.2,3.2 -1.6,0.8 h-3.1 l-2.6,-1 v-2.1 l-1.3,-0.2 -0.5,0.5 -2.6,-1.3 -0.5,-2.9 -1.5,0.5 -0.5,1 -2.4,-0.5 -5.3,-2.4 -3.9,-2.6 h-2.9 l-1.3,-1 -2.3,0.6 -1.1,1.1 -0.3,1.3 h-4.8 v-2.1 l-6.3,-0.3 -0.3,-1.5 h-4.8 l-1.6,-1.6 -1.5,-6.1 -0.8,-5.5 -1.9,-0.8 -2.3,-0.5 -0.6,0.2 -0.3,8.2 -30.1,-0.03z" fill="#D3D3D3" data-name="MN" class="MN" onclick="myFunction(this)"></path>
                      <path value="0" d="M593.1,338.7 l0.5,-5.9 4.2,-3.4 1.9,-1 v-2.9 l0.7,-1.6 -1.1,-1.6 -2.4,0.3 -2.1,-2.5 -1.7,-4.5 0.9,-2.6 -2,-3.2 -1.8,-4.6 -4.6,-0.7 -6.8,-5.6 -2.2,-4.2 0.8,-3.3 2.2,-6 0.6,-3 -1.9,-1 -6.9,-0.6 -1.1,-1.9 v-4.1 l-5.3,-3.5 -7.2,-7.8 -2.3,-7.3 -0.5,-4.2 0.7,-2.4 -2.6,-3.1 -1.2,-2.4 -7.7,0.8 -10,0.6 -48.8,1.2 1.3,2.6 -0.1,2.2 2.3,3.6 3,3.9 3.1,3 2.6,0.2 1.4,1.1 v2.9 l-1.8,1.6 -0.5,2.3 2.1,3.2 2.4,3 2.6,2.1 1.3,11.6 -0.8,40 0.5,5.7 23.7,-0.2 23.3,-0.7 32.5,-1.3 2.2,3.7 -0.8,3.1 -3.1,2.5 -0.5,1.8 5.2,0.5 4.1,-1.1z" fill="#D3D3D3" data-name="MO" class="MO" onclick="myFunction(this)"></path>
                      <path value="0" d="M604.3,472.5 l2.6,-4.2 1.8,0.8 6.8,-1.9 2.1,0.3 1.5,0.8 h5.2 l0.4,-1.6 -1.7,-14.8 -2.8,-19 1,-45.1 -0.2,-16.7 0.2,-6.3 -4.8,0.3 -19.6,1.6 -13,0.4 -0.2,3.2 -2.8,1.3 -2.6,5.1 0.5,1.6 0.1,2.4 -2.9,1.1 -3.5,5.1 0.8,2.3 -3,2.5 -1,5.7 -0.6,1.9 1.6,2.5 -1.5,1.4 1.5,2.8 0.3,4.2 -1.2,2.5 -0.2,0.9 0.4,5 2,4.5 -0.1,1.7 2.3,2 -0.7,3.1 -0.9,0.3 0.6,1.9 -8.6,15 -0.8,8.2 0.5,1.5 24.2,-0.7 8.2,-0.7 1.9,-0.3 0.6,1.4 -1,7.1 3.3,3.3 2.2,6.4z" fill="#D3D3D3" data-name="MS" class="MS" onclick="myFunction(this)"></path>
                      <path value="0" d="M361.1,70.77 l-5.3,57.13 -1.3,15.2 -59.1,-6.6 -49,-7.1 -1.4,11.2 -1.9,-1.7 -0.4,-2.5 -1.3,-1.9 -3.3,1.5 -0.7,2.5 -2.3,0.3 -3.8,-1.6 -4.1,0.1 -2.4,0.7 -3.2,-1.5 -3,0.2 -2.1,1.9 -0.9,-0.6 -0.7,-3.4 0.7,-3.2 -2.7,-3.2 -3.3,-2.5 -2.5,-12.6 -0.1,-5.3 -1.6,-0.8 -0.6,1 -4.5,3.2 -1.2,-0.1 -2.3,-2.8 -0.2,-2.8 7,-17.15 -0.6,-2.67 -3.5,-1.12 -0.4,-0.91 -2.7,-3.5 -4.6,-10.41 -3.2,-1.58 -1.8,-4.26 1.3,-4.63 -3.2,-7.57 4.4,-21.29 32.7,6.89 18.4,3.4 32.3,5.3 29.3,4 29.2,3.5 30.8,3.07z" fill="#D3D3D3" data-name="MT" class="MT" onclick="myFunction(this)"></path>
                      <path value="0" d="M786.7,357.7 l-12.7,-7.7 -3.1,-0.8 -16.6,2.1 -1.6,-3 -2.8,-2.2 -16.7,0.5 -7.4,0.9 -9.2,4.5 -6.8,2.7 -6.5,1.2 -13.4,1.4 0.1,-4.1 1.7,-1.3 2.7,-0.7 0.7,-3.8 3.9,-2.5 3.9,-1.5 4.5,-3.7 4.4,-2.3 0.7,-3.2 4.1,-3.8 0.7,1 2.5,0.2 2.4,-3.6 1.7,-0.4 2.6,0.3 1.8,-4 2.5,-2.4 0.5,-1.8 0.1,-3.5 4.4,0.1 38.5,-5.6 57.5,-12.3 2,4.8 3.6,6.5 2.4,2.4 0.6,2.3 -2.4,0.2 0.8,0.6 -0.3,4.2 -2.6,1.3 -0.6,2.1 -1.3,2.9 -3.7,1.6 -2.4,-0.3 -1.5,-0.2 -1.6,-1.3 0.3,1.3 v1 h1.9 l0.8,1.3 -1.9,6.3 h4.2 l0.6,1.6 2.3,-2.3 1.3,-0.5 -1.9,3.6 -3.1,4.8 h-1.3 l-1.1,-0.5 -2.7,0.6 -5.2,2.4 -6.5,5.3 -3.4,4.7 -1.9,6.5 -0.5,2.4 -4.7,0.5 -5.1,1.5z m49.3,-26.2 2.6,-2.5 3.2,-2.6 1.5,-0.6 0.2,-2 -0.6,-6.1 -1.5,-2.3 -0.6,-1.9 0.7,-0.2 2.7,5.5 0.4,4.4 -0.2,3.4 -3.4,1.5 -2.8,2.4 -1.1,1.2z" fill="#D3D3D3" data-name="NC" class="NC" onclick="myFunction(this)"></path>
                      <path value="0" d="M471,126.4 l-0.4,-6.2 -1.8,-7.3 -1.8,-13.61 -0.5,-9.7 -1.9,-3.18 -1.6,-5.32 v-10.41 l0.6,-3.85 -1.8,-5.54 -28.6,-0.59 -18.6,-0.6 -26.5,-1.3 -25.2,-2.16 -0.9,14.42 -4.7,50.94 56.8,3.9 56.9,1.7z" fill="#D3D3D3" data-name="ND" class="ND" onclick="myFunction(this)"></path>
                      <path value="0" d="M470.3,204.3 l-1,-2.3 -0.5,-1.6 -2.9,-1.6 -4.8,-1.5 -2.2,-1.2 -2.6,0.1 -3.7,0.4 -4.2,1.2 -6,-4.1 -2.2,-2 -10.7,0.6 -41.5,-2.4 -35.6,-2.2 -4.3,43.7 33.1,3.3 -1.4,21.1 21.7,1 40.6,1.2 43.8,0.6 h4.5 l-2.2,-3 -2.6,-3.9 0.1,-2.3 -1.4,-2.7 -1.9,-5.2 -0.4,-6.7 -1.4,-4.1 -0.5,-5 -2.3,-3.7 -1,-4.7 -2.8,-7.9 -1,-5.3z" fill="#D3D3D3" data-name="NE" class="NE" onclick="myFunction(this)"></path>
                      <path value="0" d="M881.7,141.3 l1.1,-3.2 -2.7,-1.2 -0.5,-3.1 -4.1,-1.1 -0.3,-3 -11.7,-37.48 -0.7,0.08 -0.6,1.6 -0.6,-0.5 -1,-1 -1.5,1.9 -0.2,2.29 0.5,8.41 1.9,2.8 v4.3 l-3.9,4.8 -2.4,0.9 v0.7 l1.1,1.9 v8.6 l-0.8,9.2 -0.2,4.7 1,1.4 -0.2,4.7 -0.5,1.5 1,1.1 5.1,-1.2 13.8,-3.5 1.7,-2.9 4,-1.9z" fill="#D3D3D3" data-name="NH" class="NH" onclick="myFunction(this)"></path>
                      <path value="0" d="M823.7,228.3 l0.1,-1.5 2.7,-1.3 1.7,-2.8 1.7,-2.4 3.3,-3.2 v-1.2 l-6.1,-4.1 -1,-2.7 -2.7,-0.3 -0.1,-0.9 -0.7,-2.2 2.2,-1.1 0.2,-2.9 -1.3,-1.3 0.2,-1.2 1.9,-3.1 v-3.1 l2.5,-3.1 5.6,2.5 6.4,1.9 2.5,1.2 0.1,1.8 -0.5,2.7 0.4,4.5 -2.1,1.9 -1.1,1 0.5,0.5 2.7,-0.3 1.1,-0.8 1.6,3.4 0.2,9.4 0.6,1.1 -1.1,5.5 -3.1,6.5 -2.7,4 -0.8,4.8 -2.1,2.4 h-0.8 l-0.3,-2.7 0.8,-1 -0.2,-1.5 -4,-0.6 -4.8,-2.3 -3.2,-2.9 -1,-2z" fill="#D3D3D3" data-name="NJ" class="NJ" onclick="myFunction(this)"></path>
                      <path value="0" d="M270.2,429.4 l-16.7,-2.6 -1.2,9.6 -15.8,-2 6,-39.7 7,-53.2 4.4,-30.9 34,3.9 37.4,4.4 32,2.8 -0.3,10.8 -1.4,-0.1 -7.4,97.7 -28.4,-1.8 -38.1,-3.7 0.7,6.3z" fill="#D3D3D3" data-name="NM" class="NM" onclick="myFunction(this)"></path>
                      <path value="0" d="M123.1,173.6 l38.7,8.5 26,5.2 -10.6,53.1 -5.4,29.8 -3.3,15.5 -2.1,11.1 -2.6,16.4 -1.7,3.1 -1.6,-0.1 -1.2,-2.6 -2.8,-0.5 -1.3,-1.1 -1.8,0.1 -0.9,0.8 -1.8,1.3 -0.3,7.3 -0.3,1.5 -0.5,12.4 -1.1,1.8 -16.7,-25.5 -42.1,-62.1 -12.43,-19 8.55,-32.6 8.01,-31.3z" fill="#D3D3D3" data-name="NV" class="NV" onclick="myFunction(this)"></path>
                      <path value="0" d="M843.4,200 l0.5,-2.7 -0.2,-2.4 -3,-1.5 -6.5,-2 -6,-2.6 -0.6,-0.4 -2.7,-0.3 -2,-1.5 -2.1,-5.9 -3.3,-0.5 -2.4,-2.4 -38.4,8.1 -31.6,6 -0.5,-6.5 1.6,-1.2 1.3,-1.1 1,-1.6 1.8,-1.1 1.9,-1.8 0.5,-1.6 2.1,-2.7 1.1,-1 -0.2,-1 -1.3,-3.1 -1.8,-0.2 -1.9,-6.1 2.9,-1.8 4.4,-1.5 4,-1.3 3.2,-0.5 6.3,-0.2 1.9,1.3 1.6,0.2 2.1,-1.3 2.6,-1.1 5.2,-0.5 2.1,-1.8 1.8,-3.2 1.6,-1.9 h2.1 l1.9,-1.1 0.2,-2.3 -1.5,-2.1 -0.3,-1.5 1.1,-2.1 v-1.5 h-1.8 l-1.8,-0.8 -0.8,-1.1 -0.2,-2.6 5.8,-5.5 0.6,-0.8 1.5,-2.9 2.9,-4.5 2.7,-3.7 2.1,-2.4 2.4,-1.8 3.1,-1.2 5.5,-1.3 3.2,0.2 4.5,-1.5 7.4,-2.2 0.7,4.9 2.4,6.5 0.8,5 -1,4.2 2.6,4.5 0.8,2 -0.9,3.2 3.7,1.7 2.7,10.2 v5.8 l-0.6,10.9 0.8,5.4 0.7,3.6 1.5,7.3 v8.1 l-1.1,2.3 2.1,2.7 0.5,0.9 -1.9,1.8 0.3,1.3 1.3,-0.3 1.5,-1.3 2.3,-2.6 1.1,-0.6 1.6,0.6 2.3,0.2 7.9,-3.9 2.9,-2.7 1.3,-1.5 4.2,1.6 -3.4,3.6 -3.9,2.9 -7.1,5.3 -2.6,1 -5.8,1.9 -4,1.1 -1,-0.4z" id="newPwd" fill="#D3D3D3" data-name="NY" class="NY" onclick="myFunction(this)"></path>
                      <path value="0" d="M663.8,211.2 l1.7,15.5 4.8,41.1 3.9,-0.2 2.3,-0.8 3.6,1.8 1.7,4.2 5.4,0.1 1.8,2 h1.7 l2.4,-1.4 3.1,0.5 1.5,1.3 1.8,-2 2.3,-1.4 2.4,-0.4 0.6,2.7 1.6,1 2.6,2 0.8,0.2 2,-0.1 1.2,-0.6 v-2.1 l1.7,-1.5 0.1,-4.8 1.1,-4.2 1.9,-1.3 1,0.7 1,1.1 0.7,0.2 0.4,-0.4 -0.9,-2.7 v-2.2 l1.1,-1.4 2.5,-3.6 1.3,-1.5 2.2,0.5 2.1,-1.5 3,-3.3 2.2,-3.7 0.2,-5.4 0.5,-5 v-4.6 l-1.2,-3.2 1.2,-1.8 1.3,-1.2 -0.6,-2.8 -4.3,-25.6 -6.2,3.7 -3.9,2.3 -3.4,3.7 -4,3.9 -3.2,0.8 -2.9,0.5 -5.5,2.6 -2.1,0.2 -3.4,-3.1 -5.2,0.6 -2.6,-1.5 -2.2,-1.3z" fill="#D3D3D3" data-name="OH" class="OH" onclick="myFunction(this)"></path>
                      <path value="0" d="M411.9,334.9 l-1.8,24.3 -0.9,18 0.2,1.6 4,3.6 1.7,0.9 h0.9 l0.9,-2.1 1.5,1.9 1.6,0.1 0.3,-0.2 0.2,-1.1 2.8,1.4 -0.4,3.5 3.8,0.5 2.5,1 4.2,0.6 2.3,1.6 2.5,-1.7 3.5,0.7 2.2,3.1 1.2,0.1 v2.3 l2.1,0.7 2.5,-2.1 1.8,0.6 2.7,0.1 0.7,2.3 4.4,1.8 1.7,-0.3 1.9,-4.2 h1.3 l1.1,2.1 4.2,0.8 3.4,1.3 3,0.8 1.6,-0.7 0.7,-2.7 h4.5 l1.9,0.9 2.7,-1.9 h1.4 l0.6,1.4 h3.6 l2,-1.8 2.3,0.6 1.7,2.2 3,1.7 3.4,0.9 1.9,1.2 -0.3,-37.6 -1.4,-10.9 -0.1,-8.6 -1.5,-6.6 -0.6,-6.8 0.1,-4.3 -12.6,0.3 -46.3,-0.5 -44.7,-2.1 -41.5,-1.8 -0.4,10.7z" fill="#D3D3D3" data-name="OK" class="OK" onclick="myFunction(this)"></path>
                      <path value="0" d="M67.44,158.9 l28.24,7.2 27.52,6.5 17,3.7 8.8,-35.1 1.2,-4.4 2.4,-5.5 -0.7,-1.3 -2.5,0.1 -1.3,-1.8 0.6,-1.5 0.4,-3.3 4.7,-5.7 1.9,-0.9 0.9,-0.8 0.7,-2.7 0.8,-1.1 3.9,-5.7 3.7,-4 0.2,-3.26 -3.4,-2.49 -1.2,-4.55 -13.1,-3.83 -15.3,-3.47 -14.8,0.37 -1.1,-1.31 -5.1,1.84 -4.5,-0.48 -2.4,-1.58 -1.3,0.54 -4.68,-0.29 -1.96,-1.43 -4.84,-1.77 -1.1,-0.07 -4.45,-1.27 -1.76,1.52 -6.26,-0.24 -5.31,-3.85 0.21,-9.28 -2.05,-3.5 -4.1,-0.6 -0.7,-2.5 -2.4,-0.5 -5.8,2.1 -2.3,6.5 -3.2,10 -3.2,6.5 -5,14.1 -6.5,13.6 -8.1,12.6 -1.9,2.9 -0.8,8.6 -1.3,6 2.71,3.5z" fill="#D3D3D3" data-name="OR" class="OR" onclick="myFunction(this)"></path>
                      <path value="0" d="M736.6,192.2 l1.3,-0.5 5.7,-5.5 0.7,6.9 33.5,-6.5 36.9,-7.8 2.3,2.3 3.1,0.4 2,5.6 2.4,1.9 2.8,0.4 0.1,0.1 -2.6,3.2 v3.1 l-1.9,3.1 -0.2,1.9 1.3,1.3 -0.2,1.9 -2.4,1.1 1,3.4 0.2,1.1 2.8,0.3 0.9,2.5 5.9,3.9 v0.4 l-3.1,3 -1.5,2.2 -1.7,2.8 -2.7,1.2 -1.4,0.3 -2.1,1.3 -1.6,1.4 -22.4,4.3 -38.7,7.8 -11.3,1.4 -3.9,0.7 -5.1,-22.4 -4.3,-25.9z" fill="#D3D3D3" data-name="PA" class="PA" onclick="myFunction(this)"></path>
                      <path value="0" d="M873.6,175.7 l-0.8,-4.4 -1.6,-6 5.7,-1.5 1.5,1.3 3.4,4.3 2.8,4.4 -2.8,1.4 -1.3,-0.2 -1.1,1.8 -2.4,1.9 -2.8,1.1z" fill="#D3D3D3" data-name="RI" class="RI" onclick="myFunction(this)"></path>
                      <path value="0" d="M759,413.6 l-2.1,-1 -1.9,-5.6 -2.5,-2.3 -2.5,-0.5 -1.5,-4.6 -3,-6.5 -4.2,-1.8 -1.9,-1.8 -1.2,-2.6 -2.4,-2 -2.3,-1.3 -2.2,-2.9 -3.2,-2.4 -4.4,-1.7 -0.4,-1.4 -2.3,-2.8 -0.5,-1.5 -3.8,-5.4 -3.4,0.1 -3.9,-2.5 -1.2,-1.2 -0.2,-1.4 0.6,-1.6 2.7,-1.3 -0.8,-2 6.4,-2.7 9.2,-4.5 7.1,-0.9 16.4,-0.5 2.3,1.9 1.8,3.5 4.6,-0.8 12.6,-1.5 2.7,0.8 12.5,7.4 10.1,8.3 -5.3,5.4 -2.6,6.1 -0.5,6.3 -1.6,0.8 -1.1,2.7 -2.4,0.6 -2.1,3.6 -2.7,2.7 -2.3,3.4 -1.6,0.8 -3.6,3.4 -2.9,0.2 1,3.2 -5,5.3 -2.3,1.6z" fill="#D3D3D3" data-name="SC" class="SC" onclick="myFunction(this)"></path>
                      <path value="0" d="M471,181.1 l-0.9,3.2 0.4,3 2.6,2 -1.2,5.4 -1.8,4.1 1.5,3.3 0.7,1.1 -1.3,0.1 -0.7,-1.6 -0.6,-2 -3.3,-1.8 -4.8,-1.5 -2.5,-1.3 -2.9,0.1 -3.9,0.4 -3.8,1.2 -5.3,-3.8 -2.7,-2.4 -10.9,0.8 -41.5,-2.4 -35.6,-2.2 1.5,-24.8 2.8,-34 0.4,-5 56.9,3.9 56.9,1.7 v2.7 l-1.3,1.5 -2,1.5 -0.1,2.2 1.1,2.2 4.1,3.4 0.5,2.7 v35.9z" fill="#D3D3D3" data-name="SD" class="SD" onclick="myFunction(this)"></path>
                      <path value="0" d="M670.8,359.6 l-13.1,1.2 -23.3,2.2 -37.6,2.7 -11.8,0.4 0.9,-0.6 0.9,-4.5 -1.2,-3.6 3.9,-2.3 0.4,-2.5 1.2,-4.3 3,-9.5 0.5,-5.6 0.3,-0.2 12.3,-0.2 13.6,-0.8 0.1,-3.9 3.5,-0.1 30.4,-3.3 54,-5.2 10.3,-1.5 7.6,-0.2 2.4,-1.9 1.3,0.3 -0.1,3.3 -0.4,1.6 -2.4,2.2 -1.6,3.6 -2,-0.4 -2.4,0.9 -2.2,3.3 -1.4,-0.2 -0.8,-1.2 -1.1,0.4 -4.3,4 -0.8,3.1 -4.2,2.2 -4.3,3.6 -3.8,1.5 -4.4,2.8 -0.6,3.6 -2.5,0.5 -2,1.7 -0.2,4.8z" fill="#D3D3D3" data-name="TN" class="TN" onclick="myFunction(this)"></path>
                      <path value="0" d="M282.8,425.6 l37,3.6 29.3,1.9 7.4,-97.7 54.4,2.4 -1.7,23.3 -1,18 0.2,2 4.4,4.1 2,1.1 h1.8 l0.5,-1.2 0.7,0.9 2.4,0.2 1.1,-0.6 v-0.2 l1,0.5 -0.4,3.7 4.5,0.7 2.4,0.9 4.2,0.7 2.6,1.8 2.8,-1.9 2.7,0.6 2.2,3.1 0.8,0.1 v2.1 l3.3,1.1 2.5,-2.1 1.5,0.5 2.1,0.1 0.6,2.1 5.2,2 2.3,-0.5 1.9,-4 h0.1 l1.1,1.9 4.6,0.9 3.4,1.3 3.2,1 2.4,-1.2 0.7,-2.3 h3.6 l2.1,1 3,-2 h0.4 l0.5,1.4 h4.7 l1.9,-1.8 1.3,0.4 1.7,2.1 3.3,1.9 3.4,1 2.5,1.4 2.7,2 3.1,-1.2 2.1,0.8 0.7,20 0.7,9.5 0.6,4.1 2.6,4.4 0.9,4.5 4.2,5.9 0.3,3.1 0.6,0.8 -0.7,7.7 -2.9,4.8 1.3,2.6 -0.5,2.4 -0.8,7.2 -1.3,3 0.3,4.2 -5.6,1.6 -9.9,4.5 -1,1.9 -2.6,1.9 -2.1,1.5 -1.3,0.8 -5.7,5.3 -2.7,2.1 -5.3,3.2 -5.7,2.4 -6.3,3.4 -1.8,1.5 -5.8,3.6 -3.4,0.6 -3.9,5.5 -4,0.3 -1,1.9 2.3,1.9 -1.5,5.5 -1.3,4.5 -1.1,3.9 -0.8,4.5 0.8,2.4 1.8,7 1,6.1 1.8,2.7 -1,1.5 -3.1,1.9 -5.7,-3.9 -5.5,-1.1 -1.3,0.5 -3.2,-0.6 -4.2,-3.1 -5.2,-1.1 -7.6,-3.4 -2.1,-3.9 -1.3,-6.5 -3.2,-1.9 -0.6,-2.3 0.6,-0.6 0.3,-3.4 -1.3,-0.6 -0.6,-1 1.3,-4.4 -1.6,-2.3 -3.2,-1.3 -3.4,-4.4 -3.6,-6.6 -4.2,-2.6 0.2,-1.9 -5.3,-12.3 -0.8,-4.2 -1.8,-1.9 -0.2,-1.5 -6,-5.3 -2.6,-3.1 v-1.1 l-2.6,-2.1 -6.8,-1.1 -7.4,-0.6 -3.1,-2.3 -4.5,1.8 -3.6,1.5 -2.3,3.2 -1,3.7 -4.4,6.1 -2.4,2.4 -2.6,-1 -1.8,-1.1 -1.9,-0.6 -3.9,-2.3 v-0.6 l-1.8,-1.9 -5.2,-2.1 -7.4,-7.8 -2.3,-4.7 v-8.1 l-3.2,-6.5 -0.5,-2.7 -1.6,-1 -1.1,-2.1 -5,-2.1 -1.3,-1.6 -7.1,-7.9 -1.3,-3.2 -4.7,-2.3 -1.5,-4.4 -2.6,-2.9 -1.7,-0.5z m174.4,141.7 -0.6,-7.1 -2.7,-7.2 -0.6,-7 1.5,-8.2 3.3,-6.9 3.5,-5.4 3.2,-3.6 0.6,0.2 -4.8,6.6 -4.4,6.5 -2,6.6 -0.3,5.2 0.9,6.1 2.6,7.2 0.5,5.2 0.2,1.5z" fill="#D3D3D3" data-name="TX" class="TX" onclick="myFunction(this)"></path>
                      <path value="0" d="M228.4,305.9 l24.6,3.6 1.9,-13.7 7,-50.5 2.3,-22 -32.2,-3.5 2.2,-13.1 1.8,-10.6 -34.7,-6.1 -12.5,-2.5 -10.6,52.9 -5.4,30 -3.3,15.4 -1.7,9.2z" fill="#D3D3D3" data-name="UT" class="UT" onclick="myFunction(this)"></path>
                      <path value="0" d="M834.7,265.2 l-0.2,2.8 -2.9,3.8 -0.4,4.6 0.5,3.4 -1.8,5 -2.2,1.9 -1.5,-4.6 0.4,-5.4 1.6,-4.2 0.7,-3.3 -0.1,-1.7z m-60.3,44.6 -38.6,5.6 -4.8,-0.1 -2.2,-0.3 -2.5,1.9 -7.3,0.1 -10.3,1.6 -6.7,0.6 4.1,-2.6 4.1,-2.3 v-2.1 l5.7,-7.3 4.1,-3.7 2.2,-2.5 3.6,4.3 3.8,0.9 2.7,-1 2,-1.5 2.4,1.2 4.6,-1.3 1.7,-4.4 2.4,0.7 3.2,-2.3 1.6,0.4 2.8,-3.2 0.2,-2.7 -0.8,-1.2 4.8,-10.5 1.8,-5.2 0.5,-4.7 0.7,-0.2 1.1,1.7 1.5,1.2 3.9,-0.2 1.7,-8.1 3,-0.6 0.8,-2.6 2.8,-2.2 1.1,-2.1 1.8,-4.3 0.1,-4.6 3.6,1.4 6.6,3.1 0.3,-5.2 3.4,1.2 -0.6,2.9 8.6,3.1 1.4,1.8 -0.8,3.3 -1.3,1.3 -0.5,1.7 0.5,2.4 2,1.3 3.9,1.4 2.9,1 4.9,0.9 2.2,2.1 3.2,0.4 0.9,1.2 -0.4,4.7 1.4,1.1 -0.5,1.9 1.2,0.8 -0.2,1.4 -2.7,-0.1 0.1,1.6 2.3,1.5 0.1,1.4 1.8,1.8 0.5,2.5 -2.6,1.4 1.6,1.5 5.8,-1.7 3.7,6.2z" fill="#D3D3D3" data-name="VA" class="VA" onclick="myFunction(this)"></path>
                      <path value="0" d="M832.7,111.3 l2.4,6.5 0.8,5.3 -1,3.9 2.5,4.4 0.9,2.3 -0.7,2.6 3.3,1.5 2.9,10.8 v5.3 l11.5,-2.1 -1,-1.1 0.6,-1.9 0.2,-4.3 -1,-1.4 0.2,-4.7 0.8,-9.3 v-8.5 l-1.1,-1.8 v-1.6 l2.8,-1.1 3.5,-4.4 v-3.6 l-1.9,-2.7 -0.3,-5.79 -26.1,6.79z" fill="#D3D3D3" data-name="VT" class="VT" onclick="myFunction(this)"></path>
                      <path value="0" d="M74.5,67.7 l-2.3,-4.3 -4.1,-0.7 -0.4,-2.4 -2.5,-0.6 -2.9,-0.5 -1.8,1 -2.3,-2.9 0.3,-2.9 2.7,-0.3 1.6,-4 -2.6,-1.1 0.2,-3.7 4.4,-0.6 -2.7,-2.7 -1.5,-7.1 0.6,-2.9 v-7.9 l-1.8,-3.2 2.3,-9.4 2.1,0.5 2.4,2.9 2.7,2.6 3.2,1.9 4.5,2.1 3.1,0.6 2.9,1.5 3.4,1 2.3,-0.2 v-2.4 l1.3,-1.1 2.1,-1.3 0.3,1.1 0.3,1.8 -2.3,0.5 -0.3,2.1 1.8,1.5 1.1,2.4 0.6,1.9 1.5,-0.2 0.2,-1.3 -1,-1.3 -0.5,-3.2 0.8,-1.8 -0.6,-1.5 v-2.6 l1.8,-3.6 -1.1,-2.6 -2.4,-4.8 0.3,-0.8 1.4,-0.8 4.4,1.5 9.7,2.7 8.6,1.9 20,5.7 23,5.7 15,3.49 -4.8,17.56 -4.5,20.83 -3.4,16.25 -0.4,9.18 v0 l-12.9,-3.72 -15.3,-3.47 -14.5,0.32 -1.1,-1.53 -5.7,2.09 -3.9,-0.42 -2.6,-1.79 -1.7,0.65 -4.15,-0.25 -1.72,-1.32 -5.16,-1.82 -1.18,-0.16 -4.8,-1.39 -1.92,1.65 -5.65,-0.25 -4.61,-3.35z m9.6,-55.4 2,-0.2 0.5,1.4 1.5,-1.6 h2.3 l0.8,1.5 -1.5,1.7 0.6,0.8 -0.7,2 -1.4,0.4 c0,0 -0.9,0.1 -0.9,-0.2 0,-0.3 1.5,-2.6 1.5,-2.6 l-1.7,-0.6 -0.3,1.5 -0.7,0.6 -1.5,-2.3z" fill="#D3D3D3" data-name="WA" class="WA" onclick="myFunction(this)"></path>
                      <path value="0" d="M541.4,109.9 l2.9,0.5 2.9,-0.6 7.4,-3.2 2.9,-1.9 2.1,-0.8 1.9,1.5 -1.1,1.1 -1.9,3.1 -0.6,1.9 1,0.6 1.8,-1 1.1,-0.2 2.7,0.8 0.6,1.1 1.1,0.2 0.6,-1.1 4,5.3 8.2,1.2 8.2,2.2 2.6,1.1 12.3,2.6 1.6,2.3 3.6,1.2 1.7,10.2 1.6,1.4 1.5,0.9 -1.1,2.3 -1.8,1.6 -2.1,4.7 -1.3,2.4 0.2,1.8 1.5,0.3 1.1,-1.9 1.5,-0.8 0.8,-2.3 1.9,-1.8 2.7,-4 4.2,-6.3 0.8,-0.5 0.3,1 -0.2,2.3 -2.9,6.8 -2.7,5.7 -0.5,3.2 -0.6,2.6 0.8,1.3 -0.2,2.7 -1.9,2.4 -0.5,1.8 0.6,3.6 0.6,3.4 -1.5,2.6 -0.8,2.9 -1,3.1 1.1,2.4 0.6,6.1 1.6,4.5 -0.2,3 -15.9,1.8 -17.5,1 h-12.7 l-0.7,-1.5 -2.9,-0.4 -2.6,-1.3 -2.3,-3.7 -0.3,-3.6 2,-2.9 -0.5,-1.4 -2.1,-2.2 -0.8,-3.3 -0.6,-6.8 -2.1,-2.5 -7,-4.5 -3.8,-5.4 -3.4,-1 -2.2,-2.8 h-3.2 l-2.9,-3.3 -0.5,-6.5 0.1,-3.8 1.5,-3.1 -0.8,-3.2 -2.5,-2.8 1.8,-5.4 5.2,-3.8 1.6,-1.9 -0.2,-8.1 0.2,-2.8 2.4,-2.8z" fill="#D3D3D3" data-name="WI" class="WI" onclick="myFunction(this)"></path>
                      <path value="0" d="M758.9,254.3 l5.8,-6 2.6,-0.8 1.6,-1.5 1.5,-2.2 1.1,0.3 3.1,-0.2 4.6,-3.6 1.5,-0.5 1.3,1 2.6,1.2 3,3 -0.4,4.3 -5.4,-2.6 -4.8,-1.8 -0.1,5.9 -2.6,5.7 -2.9,2.4 -0.8,2.3 -3,0.5 -1.7,8.1 -2.8,0.2 -1.1,-1 -1.2,-2 -2.2,0.5 -0.5,5.1 -1.8,5.1 -5,11 0.9,1.4 -0.1,2 -2.2,2.5 -1.6,-0.4 -3.1,2.3 -2.8,-0.8 -1.8,4.9 -3.8,1 -2.5,-1.3 -2.5,1.9 -2.3,0.7 -3.2,-0.8 -3.8,-4.5 -3.5,-2.2 -2.5,-2.5 -2.9,-3.7 -0.5,-2.3 -2.8,-1.7 -0.6,-1.3 -0.2,-5.6 0.3,0.1 2.4,-0.2 1.8,-1 v-2.2 l1.7,-1.5 0.1,-5.2 0.9,-3.6 1.1,-0.7 0.4,0.3 1,1.1 1.7,0.5 1.1,-1.3 -1,-3.1 v-1.6 l3.1,-4.6 1.2,-1.3 2,0.5 2.6,-1.8 3.1,-3.4 2.4,-4.1 0.2,-5.6 0.5,-4.8 v-4.9 l-1.1,-3 0.9,-1.3 0.8,-0.7 4.3,19.3 4.3,-0.8 11.2,-1.3z" fill="#D3D3D3" data-name="WV" class="WV" onclick="myFunction(this)"></path>
                      <path value="0" d="M353,161.9 l-1.5,25.4 -4.4,44 -2.7,-0.3 -83.3,-9.1 -27.9,-3 2,-12 6.9,-41 3.8,-24.2 1.3,-11.2 48.2,7 59.1,6.5z" fill="#D3D3D3" data-name="WY" class="WY" onclick="myFunction(this)"></path>
                      <g class="DC" onclick="myFunction(this)">
                        <path value="0" class="DC1" fill="#D3D3D3" d="M801.8,253.8 l-1.1-1.6 -1-0.8 1.1-1.6 2.2,1.5z"></path>
                        <circle class="DC2" data-name="DC" fill="#D3D3D3" stroke="#FFFFFF" stroke-width="1.5" cx="801.3" cy="251.8" r="5" opacity="1"></circle>
                      </g>
                    </g>
                  </svg>
                  </div>
                  </div>
                
                </html>`,
              }}
            />
          </View>
          <View style={{ flex: Platform.OS === "android" ? 1 : 1.3 }}>
            <View
              style={{
                borderColor: "#EDEDED",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                paddingVertical: 15,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#F5F4F7",
                  paddingVertical: deviceHeight / 75,
                  marginHorizontal: 20,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={{
                      padding: 0,
                      fontWeight: "600",
                      fontSize: fontSizes.small,
                    }}
                    onChangeText={(text) => {
                      setsearchServiceAreaText(text);
                      if (timerId) {
                        clearTimeout(timerId);
                        timerId = undefined;
                      }
                      timerId = setTimeout(async () => {
                        timerId = undefined;
                        const arr = [...serviceAreaList];
                        await arr.forEach((item) => {
                          if (
                            !item.name
                              .toLowerCase()
                              .includes(text.trim().toLowerCase())
                          ) {
                            item.isHide = true;
                          } else {
                            item.isHide = false;
                          }
                        });
                        setserviceAreaList(arr);
                      }, 700);
                    }}
                    onSubmitEditing={() => {
                      let filteredData = serviceAreaList.filter(function (
                        item
                      ) {
                        return item.name.includes(searchServiceAreaText);
                      });
                      setfilteredserviceAreaList(filteredData);
                    }}
                    autoCapitalize={"none"}
                    returnKeyType={"done"}
                    value={searchServiceAreaText}
                    placeholder="Search State"
                  />
                </View>
                <FastImage
                  resizeMode={"contain"}
                  source={require("../../../app/assets/images/search_fr.png")}
                  style={{ height: 20, width: 20, alignSelf: "center" }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: deviceHeight / 40,
                paddingHorizontal: 20,
              }}
            >
              {serviceAreaListLoading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Spinner
                    isVisible={serviceAreaListLoading}
                    size={40}
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
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  data={
                    filteredserviceAreaList &&
                    filteredserviceAreaList.length > 0
                      ? filteredserviceAreaList
                      : serviceAreaList
                  }
                  style={{}}
                  renderItem={({ item, index }) => {
                    if (!item.isHide) {
                      return (
                        <TouchableOpacity
                          onPress={async () => {
                            sendDataToWebView(item);
                            if (item.isSelected) {
                              let array = [...serviceAreaList];
                              array[index].isSelected = undefined;
                              await setserviceAreaList(array);
                              let selectedArray = [...selectedServiceAreaList];
                              const selectedindex = selectedArray.findIndex(
                                (object) => {
                                  return object.service_area === item.name;
                                }
                              );
                              if (selectedindex > -1) {
                                selectedArray.splice(selectedindex, 1); //remove one item only
                                setselectedServiceAreaList(selectedArray);
                              }
                            } else {
                              let array = [...serviceAreaList];
                              array[index].isSelected = true;
                              setserviceAreaList(array);
                              setselectedServiceAreaList([
                                ...selectedServiceAreaList,
                                {
                                  service_area: item.name,
                                  lat: "41.881832",
                                  long: "-87.523177",
                                  state_code: item.code,
                                },
                              ]);
                            }
                          }}
                          style={{
                            flexDirection: "row",
                            backgroundColor: "#F5F4F7",
                            paddingVertical: deviceHeight / 45,
                            borderRadius: 8,
                            paddingHorizontal: deviceWidth / 30,
                            borderWidth: 0.5,
                            borderColor: item.isSelected
                              ? "#000000"
                              : "#F5F4F7",
                            marginBottom: 15,
                          }}
                        >
                          <FastImage
                            resizeMode={"contain"}
                            source={
                              item.isSelected
                                ? require("../../../app/assets/images/SelectedCircle.png")
                                : require("../../../app/assets/images/UnSelectedCircle.png")
                            }
                            style={{
                              height: 20,
                              width: 20,
                              alignSelf: "center",
                              marginHorizontal: 10,
                            }}
                          />
                          <Text
                            style={{
                              color: colors1.background,
                              fontSize: fontSizes.regular,
                              marginHorizontal: 10,
                              fontWeight: "600",
                            }}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            paddingVertical: deviceHeight / 55,
            paddingHorizontal: deviceWidth / 20,
          }}
        >
          <CustomButton
            titleColor={colors1.white}
            borderColor={disableButton ? "#454545" : "#1F1F1F"}
            onPress={() => createServiceArea()}
            title={isFrom === "Profile" ? "Update" : "Next"}
            backgroundColor={disableButton ? "#454545" : "#1F1F1F"}
            btnLoading={loading}
            disableButton={disableButton}
          ></CustomButton>
        </View>
      </View>
      {/* </KeyboardAwareScrollView> */}
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white",
    flex: 1,
    // paddingHorizontal: STANDARD_PADDING
  },
});

export default RegistrationServiceAreasScreen;
