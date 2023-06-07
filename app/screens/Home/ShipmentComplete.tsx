/*************************************************
 * FreightRunner
 * @exports
 * @function ShipmentComplete.tsx
 * @extends Component
 * Created by Naveen E on 05/07/2022
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
  Image,
  PermissionsAndroid,
  ScrollView,
  Modal,
} from "react-native";
import {
  CustomButton,
  Logo,
  Screen,
  SimpleInput as Input,
  Text,
  View,
} from "../../components";
import { fontSizes, STANDARD_PADDING } from "../../styles/globalStyles";
import colors from "../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FastImage from "react-native-fast-image";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import storage from "../../helpers/storage";
var axios = require("axios");
import LinearGradient from "react-native-linear-gradient";
import StandardModal from "../../components/StandardModal";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import {
  shipmentPhotosUploadCompleted,
  uploadDocument,
  uploadToS3,
} from "../../services/uploadS3Service";
import { MyContext } from "../../context/MyContextProvider";
import {
  getMyJobsList,
  sendFeedBack,
  updateLoadStatus,
} from "../../services/jobService";
import Spinner from "react-native-spinkit";
import Icon from "react-native-vector-icons/FontAwesome5";
import StarRating from "react-native-star-rating";
import { partnerRating } from "../../services/userService";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const ratingText = ["", "Poor", "Average", "Good", "Excellent", "Outstanding"];

type Props = any;

function ShipmentComplete({ navigation, route }: Props) {
  let loadDetail = route.params?.loadDetail;
  const [w_9Details, setw_9Details] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedBackloading, setfeedBackloading] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [feedbackText, setfeedbackText] = useState("");
  const [feedbackMail, setfeedbackMail] = useState("");
  const global = useContext(MyContext);
  let userProfileDetails = global.myState.userProfileDetails;
  let userFirstName =
    userProfileDetails.partnerProfile.partnerProfileDetails.first_name;
  const [ratings, setRating] = useState(0);
  const [frRatings, setfrRatings] = useState(0);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [showFRRating, setshowFRRating] = useState(false);
  const [showRatingLoading, setshowRatingLoading] = useState(false);
  const [isSkipedShipper, setisSkipedShipper] = useState(false);
  const [isPlatformRatingGiven, setisPlatformRatingGiven] = useState(false);
  const [isShipperRatingGiven, setisShipperRatingGiven] = useState(false);

  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };

  const _checkGivenRatings = () => {
    loadDetail.partnerRatingDetails.map((ratingDetail) => {
      if (ratingDetail.is_platform_rating === 0) {
        setisShipperRatingGiven(true);
        setshowFRRating(true);
      } else {
        setisPlatformRatingGiven(true);
      }
    });
  };

  useEffect(() => {
    _checkGivenRatings();
  }, []);

  const _sendFeedback = async () => {
    setfeedBackloading(true);
    await sendFeedBack({
      message: feedbackText.trim(),
      load_id: loadDetail.load_id,
    })
      .then(async (response) => {
        setfeedBackloading(false);
        setVisible(true);
        setMessage("Feedback sent successfully");
        setfeedbackText("");
        setfeedbackModalVisible(false);
        navigation.goBack();
        console.log("Feedback sent response", response);
      })
      .catch((e) => {
        setfeedBackloading(false);
        console.log("Feedback sent error", e.response);
        Alert.alert("Error", e.response.data.message);
      });
  };

  const _partnerRatings = async () => {
    setshowRatingLoading(true);
    let params;
    if (showFRRating) {
      params = {
        rating: Number(frRatings),
        is_platform_rating: true,
        load_id: loadDetail.load_id,
      };
    } else {
      params = {
        rating: Number(ratings),
        user_id: loadDetail.user_id,
        load_id: loadDetail.load_id,
        is_platform_rating: false,
      };
    }
    await partnerRating({ params: params })
      .then(async (response) => {
        if (!showFRRating) {
          if (isPlatformRatingGiven) {
            setOpenRatingModal(false);
          } else {
            setshowRatingLoading(false);
            setRating(0);
            setshowFRRating(true);
          }
        } else {
          setRating(0);
          setfrRatings(0);
          setVisible(true);
          setisSkipedShipper(false);
          setMessage("Thank you for your valuable feedback");
          setshowRatingLoading(false);
          setshowFRRating(false);
          setOpenRatingModal(false);
        }
        console.log("getUserBidsList", response);
      })
      .catch((e) => {
        console.log("getUserBidsList error", e.response);
        setshowRatingLoading(false);
      });
  };

  return (
    <Screen style={styles.container}>
      {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
      <View style={{ flex: 1 }}>
        <LinearGradient
          start={{ x: 0, y: -0.5 }}
          end={{ x: 0, y: 1 }}
          colors={["#000000", "#353535"]}
          style={{
            flex: 0.4,
            paddingLeft: 20,
            justifyContent: "flex-end",
          }}
        >
          <FastImage
            resizeMode={"contain"}
            source={require("../../../app/assets/logos/logo_FR.png")}
            style={{
              // alignSelf: "center",
              width: 220,
              height: 100,
              marginBottom: 10,
            }}
          />
        </LinearGradient>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: 15,
            backgroundColor: colors.white,
          }}
        >
          <View
            style={{
              paddingVertical: deviceHeight / 40,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <FastImage
              resizeMode={"contain"}
              source={require("../../../app/assets/images/greenTick.png")}
              style={{
                width: 20,
                height: 20,
              }}
            />
            <Text style={styles.headerText}>
              Congrats and Thank you {userFirstName}
            </Text>
          </View>

          <Text
            style={{
              fontSize: fontSizes.xSmall,
              paddingRight: deviceWidth / 10,
              color: "#757E8E",
              fontWeight: "500",
              marginTop: 5,
            }}
          >
            We are extremely happy to have you as part of our FreightRunner
            team! We hope your trip went well. To confirm delivery please
            complete below. You can reach out to us at +1(313) 627 2212. Thank
            you again and we look forward to working with you in the very near
            future.
          </Text>
          <Text
            style={{
              fontSize: fontSizes.xSmall,
              color: "#757E8E",
              fontWeight: "500",
              marginVertical: 15,
              paddingRight: deviceWidth / 10,
            }}
          >
            If you have any input on how we can serve you better, please send us
            your ideas, concerns, or changes needed by clicking “Send feedback”
            below
          </Text>
          {/* {loadDetail.partnerRatingDetails.length < 2 ? (
            <View
              style={{
                marginVertical: 15,
                flexDirection: "row"
              }}
            >
              <TouchableOpacity onPress={() => setOpenRatingModal(true)}>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    color: "#1C6191",
                    fontWeight: "500"
                  }}
                >
                  Rate Us
                </Text>
              </TouchableOpacity>
            </View>
          ) : null} */}
        </View>
      </View>
      <View style={{ paddingHorizontal: deviceHeight / 50 }}>
        <CustomButton
          titleColor={colors.white}
          borderColor=""
          onPress={() => setfeedbackModalVisible(true)}
          title="Send Feedback"
          backgroundColor={colors.btnColor}
        ></CustomButton>
      </View>
      <View
        style={{
          marginVertical: deviceHeight / 39,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{}}
          onPress={() =>
            navigation.navigate("LoadDetailScreen", { isFromShipment: true })
          }
        >
          <Text
            style={{
              fontSize: fontSizes.small,
              fontWeight: "500",
              textDecorationLine: "underline",
              textAlign: "center",
              color: colors.background,
            }}
          >
            {"<<"} Back
          </Text>
        </TouchableOpacity>
      </View>
      {/* Model for Logout Start here*/}
      <StandardModal
        visible={feedbackModalVisible}
        handleBackClose={() => {
          setfeedbackModalVisible(false);
        }}
      >
        <KeyboardAwareScrollView>
          <View>
            <View style={{}}>
              <Text
                style={{
                  fontSize: fontSizes.medium,
                  fontWeight: "600",
                  color: colors.background,
                }}
              >
                Send Feedback
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  position: "absolute",
                  right: 0,
                }}
                onPress={() => {
                  setfeedbackModalVisible(false);
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
            {/* <View
              style={{
                backgroundColor: "#F5F4F7",
                borderColor: "#EDEDED",
                borderWidth: 1,
                paddingHorizontal: 20,
                paddingVertical: deviceHeight / 96,
                marginTop: deviceHeight / 48
              }}
            >
              <Text style={{ color: "#858C97", fontSize: fontSizes.small, fontWeight: "500" }}>
                Email
              </Text>
              <TextInput
                autoCapitalize="none"
                placeholder=""
                maxLength={50}
                onChangeText={text => setfeedbackMail(text)}
                value={feedbackMail}
                style={{
                  fontSize: fontSizes.regular,
                  padding: 0,
                  marginTop: 5,
                  fontWeight: "500"
                }}
                keyboardType="default"
                returnKeyType="done"
                onSubmitEditing={() => {}}
              />
            </View> */}
            <View
              style={{
                backgroundColor: "#F5F4F7",
                borderColor: "#EDEDED",
                borderWidth: 1,
                height: 100,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginTop: deviceHeight / 50,
              }}
            >
              <Text
                style={{
                  color: "#858C97",
                  fontSize: fontSizes.small,
                  fontWeight: "500",
                }}
              >
                Feedback
              </Text>
              <TextInput
                placeholder="Enter the Feedback"
                multiline
                numberOfLines={3}
                maxLength={150}
                onChangeText={(text) => setfeedbackText(text)}
                value={feedbackText}
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

            <TouchableOpacity
              disabled={feedbackText.trim().length === 0 ? true : false}
              onPress={() => {
                _sendFeedback();
              }}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderRadius: 32,
                borderWidth: 1,
                backgroundColor:
                  feedbackText.trim().length === 0
                    ? "#454545"
                    : colors.btnColor,
                marginBottom: deviceHeight / 55,
                marginTop: deviceHeight / 30,
              }}
            >
              {feedBackloading ? (
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
          </View>
        </KeyboardAwareScrollView>
      </StandardModal>
      {/* Model for Logout Ends here*/}

      <StandardModal
        visible={openRatingModal}
        handleBackClose={() => {
          setOpenRatingModal(false);
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
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
          {showFRRating ? (
            <View
              style={
                {
                  // marginTop: deviceHeight / 50
                }
              }
            >
              <Text style={{ fontWeight: "bold" }}>
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
              <Text style={{ fontWeight: "bold" }}>
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
        </View>
      </StandardModal>

      <ActionSheet
        ref={refActionSheet}
        title={"Select"}
        options={["Camera", "Gallery", "Cancel"]}
        cancelButtonIndex={2}
        onPress={async (index) => {
          if (index === 0) {
            ImagePicker.openCamera({
              // width: 300,
              // height: 300,
              // cropping: true
            })
              .then(async (item) => {
                if (!item.fileName) item.filename = item.path.split("/").pop();
                global.myDispatch({ type: "UPLOADING_INIT", payload: true });
                const response = await uploadToS3(item, "image", global);
                if (response) {
                  await shipmentPhotosUploadCompleted({
                    load_id: loadDetail.load_id,
                    file_path: item.filename,
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
                          status: loadDetail.status + 1,
                        }).then(async (response) => {
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
                        Alert.alert(
                          "Error",
                          "There was an error. Please try again."
                        );
                      }
                    })
                    .catch((e) => {
                      global.myDispatch({
                        type: "HIDE_UPLOAD_DAILOG",
                        payload: true,
                      });
                      console.log("error", e.response.data.message);
                      Alert.alert("Error", e.response.data.message);
                    });
                }
              })
              .catch((err) => {
                setLoading(false);
                Alert.alert("Error", "There was an error. Please try again.");
              });
            // this._loadImageFromGallery();
          } else if (index === 1) {
            ImagePicker.openPicker({
              multiple: false,
              mediaType: "photo",
              cropping: false,
              maxFiles: 5,
            })
              .then(async (item) => {
                if (!item.fileName) item.filename = item.path.split("/").pop();
                global.myDispatch({ type: "UPLOADING_INIT", payload: true });
                const response = await uploadToS3(item, "image", global);
                if (response) {
                  await shipmentPhotosUploadCompleted({
                    load_id: loadDetail.load_id,
                    file_path: item.filename,
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
                          status: loadDetail.status + 1,
                        }).then(async (response) => {
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
                        Alert.alert(
                          "Error",
                          "There was an error. Please try again."
                        );
                      }
                    })
                    .catch((e) => {
                      global.myDispatch({
                        type: "HIDE_UPLOAD_DAILOG",
                        payload: true,
                      });
                      console.log("error", e.response.data.message);
                      Alert.alert("Error", e.response.data.message);
                    });
                }
              })
              .catch((error) => {});
            // openDocumentPicker();
          }
        }}
      />
    </Screen>
  );
}

type Styles = {
  container: ViewStyle;
  headerText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white",
    // paddingHorizontal: STANDARD_PADDING
  },
  headerText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: 22,
    paddingHorizontal: 8,
  },
});

export default ShipmentComplete;
