/*************************************************
 * FreightRunner
 * @exports
 * @function Profile.tsx
 * @extends Component
 * Created by Deepak B on 27/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { FC, useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Platform,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Text, View } from "../components";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../context/SnackbarContext";
import { removeDeviceWhenLogout } from "../services/userService";
import colors from "../styles/colors";
import { fontSizes } from "../styles/globalStyles";
import FRHeader from "../components/FRHeader";
import FastImage from "react-native-fast-image";
import storage from "../helpers/storage";
import { MyContext } from "../../app/context/MyContextProvider";
import StandardModal from "../components/StandardModal";
import { deleteUserAccount } from "../services/registrationService";
import { getUserProfileDetails } from "../services/userService";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import { Avatar } from "react-native-elements";
import Spinner from "react-native-spinkit";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { navigateAndSimpleReset } from "../utils/Utility";

type Props = { navigation: any };

const Profile: React.FC<Props> = ({ navigation }) => {
  const [logoutModalVisible, setlogoutModalVisible] = useState(false);
  const [changeModal, setChangeModal] = useState(0);
  const [deleteACModalVisible, setDeleteACModalVisible] = useState(false);
  const global: any = useContext(MyContext);

  useEffect(() => {
    try {
      async function fetchAPI() {
        const userDetail = await storage.get("userData");
        await getUserProfileDetails(userDetail.user_id)
          .then(async (response: any) => {
            global.myDispatch({
              type: "GET_USER_PROFILE_DETAILS",
              payload: response.data,
            });
          })
          .catch((e) => {});
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  }, []);

  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;
  const totalEarnings =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.totalEarnings;
  const formatPhoneNumber = (phoneNumberString: string) => {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return ["(", match[2], ")", "-", match[3], "-", match[4]].join("");
    }
    return null;
  };
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setimgLoading] = useState(false);
  const [imgLoadingError, setimgLoadingError] = useState(false);
  if (userProfileDetails?.partnerProfileDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <FRHeader
          title={"MY PROFILE"}
          fontSize={fontSizes.regular}
          rightOnPress={() => {
            navigation.navigate("SosScreen");
          }}
        />
        <ScrollView style={{}} showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginVertical: deviceHeight / 75,
              backgroundColor: "#F5F4F7",
            }}
          >
            <View
              style={{
                marginHorizontal: 15,
                marginVertical: deviceHeight / 40,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    padding: 1,
                    borderColor:
                      userProfileDetails.partnerProfileDetails?.is_business ===
                      1
                        ? colors.black
                        : "#F5F4F7",
                    borderWidth:
                      userProfileDetails.partnerProfileDetails?.is_business ===
                      1
                        ? 2
                        : 0,
                    borderRadius: 50,
                  }}
                >
                  {!imgLoadingError &&
                  userProfileDetails &&
                  userProfileDetails.partnerProfileDetails?.profile_image ? (
                    <View>
                      <FastImage
                        onLoadStart={() => {
                          setimgLoading(true);
                        }}
                        onLoadEnd={() => {
                          setimgLoading(false);
                        }}
                        onError={() => {
                          setimgLoadingError(true);
                        }}
                        resizeMode={"cover"}
                        style={{ width: 70, height: 70, borderRadius: 70 / 2 }}
                        source={
                          userProfileDetails &&
                          userProfileDetails.partnerProfileDetails
                            ?.profile_image
                            ? {
                                uri: userProfileDetails.partnerProfileDetails
                                  ?.profile_image,
                              }
                            : require("../assets/images/placeholder.png")
                        }
                      />
                      {imgLoading ? (
                        <ShimmerPlaceholder
                          style={{
                            width: 70,
                            height: 70,
                            borderRadius: 70 / 2,
                            position: "absolute",
                          }}
                          LinearGradient={LinearGradient}
                        />
                      ) : null}
                    </View>
                  ) : (
                    <Avatar
                      containerStyle={{ backgroundColor: "lightgray" }}
                      size="large"
                      rounded
                      title={
                        userProfileDetails &&
                        userProfileDetails.partnerProfileDetails?.first_name.charAt(
                          0
                        )
                      }
                    />
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{ flexDirection: "column", paddingHorizontal: 10 }}
                  >
                    <Text style={{ fontSize: fontSizes.medium }}>
                      {userProfileDetails &&
                        userProfileDetails.partnerProfileDetails
                          ?.first_name}{" "}
                      {userProfileDetails &&
                        userProfileDetails.partnerProfileDetails?.last_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.small,
                        marginTop: 5,
                        color: colors.lightGrey,
                        // paddingHorizontal: 5,
                      }}
                    >
                      {userProfileDetails &&
                        userProfileDetails.partnerProfileDetails?.city}
                      ,{" "}
                      {userProfileDetails &&
                        userProfileDetails.partnerProfileDetails?.state}
                      ,{" "}
                      {userProfileDetails &&
                        userProfileDetails.partnerProfileDetails?.zip_code}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("RegistrationPersonalDetailScreen", {
                        isFromEdit: true,
                        isFrom: "ProfileScreen",
                      })
                    }
                  >
                    <FastImage
                      style={{ width: 25, height: 25, alignSelf: "center" }}
                      source={require("../assets/images/edit.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <FastImage
                  style={{ width: 15, height: 15, alignSelf: "center" }}
                  source={require("../assets/images/phone.png")}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text
                  style={{
                    color: colors.lightGrey,
                    fontSize: fontSizes.small,
                    marginLeft: 10,
                  }}
                >
                  {formatPhoneNumber(
                    userProfileDetails &&
                      userProfileDetails.partnerProfileDetails?.mobile_number
                  )}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <FastImage
                  tintColor={colors.lightGrey}
                  style={{ width: 15, height: 15, alignSelf: "center" }}
                  source={require("../assets/images/mail.png")}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text
                  style={{
                    color: colors.lightGrey,
                    fontSize: fontSizes.xSmall,
                    marginLeft: 10,
                  }}
                >
                  {userProfileDetails && userProfileDetails.email}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: colors.lightGrey,
                borderBottomWidth: 0.4,
              }}
            />
            <View>
              <View
                style={{
                  flexDirection: "column",
                  marginHorizontal: deviceWidth / 12,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{ flexDirection: "column", alignItems: "center" }}
                  >
                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                      <Text
                        style={{
                          fontSize: fontSizes.medium,
                          marginLeft: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {totalEarnings?.currency}{" "}
                        {totalEarnings?.today ? totalEarnings.today : "0"}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: colors.lightGrey,
                        fontSize: fontSizes.xSmall,
                        marginLeft: 10,
                        marginTop: 10,
                      }}
                    >
                      {"Today"}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: "80%",
                      width: 0.4,
                      backgroundColor: colors.lightGrey,
                      marginVertical: 10,
                    }}
                  ></View>
                  <View
                    style={{ flexDirection: "column", alignItems: "center" }}
                  >
                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                      <Text
                        style={{
                          fontSize: fontSizes.medium,
                          marginLeft: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {totalEarnings?.currency}{" "}
                        {totalEarnings?.thisWeek ? totalEarnings.thisWeek : "0"}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: colors.lightGrey,
                        fontSize: fontSizes.xSmall,
                        marginLeft: 10,
                        marginTop: 10,
                      }}
                    >
                      {"This Week"}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: "80%",
                      width: 0.4,
                      backgroundColor: colors.lightGrey,
                      marginVertical: 10,
                    }}
                  ></View>
                  <View
                    style={{ flexDirection: "column", alignItems: "center" }}
                  >
                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                      <Text
                        style={{
                          fontSize: fontSizes.medium,
                          marginLeft: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {totalEarnings?.currency}{" "}
                        {totalEarnings?.thisMonth
                          ? totalEarnings.thisMonth
                          : "0"}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: colors.lightGrey,
                        fontSize: fontSizes.xSmall,
                        marginLeft: 10,
                        marginTop: 10,
                      }}
                    >
                      {"This Month"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: colors.lightGrey,
                borderBottomWidth: 0.4,
                marginTop: 10,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              onPress={async () => {
                const userDetail = await storage.get("userData");
                await getUserProfileDetails(userDetail.user_id)
                  .then(async (response: any) => {
                    global.myDispatch({
                      type: "GET_USER_PROFILE_DETAILS",
                      payload: response.data,
                    });
                  })
                  .catch((e) => {});
              }}
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "right",
                  fontSize: 16,
                  paddingRight: 5,
                  color: "black",
                  fontWeight: "600",
                }}
              >
                Refresh
              </Text>
              <FastImage
                tintColor={"black"}
                style={{
                  width: 18,
                  height: 18,
                }}
                source={require("../assets/images/refersh.png")}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: colors.white,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                marginHorizontal: deviceWidth / 15,
                marginVertical: deviceHeight / 30,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TruckList", { isFrom: "TruckList" })
                }
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                      source={require("../assets/images/truck-monster.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Truck
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TrailerList", { isFrom: "TrailerList" })
                }
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 20,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                      source={require("../assets/images/trailer.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Trailer
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CargoTypes", {
                    isFrom: "ProfileCargoTypes",
                  })
                }
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 20,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                      source={require("../assets/images/cogs.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Cargo Preference
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <FastImage
                    style={{ width: 20, height: 20, alignSelf: "center" }}
                    source={require("../assets/images/invoice.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      marginLeft: 20,
                      color: "#000000",
                    }}
                  >
                    Insurance
                  </Text>
                </View>
                <FastImage
                  style={{ width: 12, height: 12 }}
                  source={require("../assets/images/arrow-right.png")}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("BusinessInfoAndAddress", {
                    isFrom: "ProfileBusinessInfo",
                  })
                }
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 20,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                      source={require("../assets/images/car-building.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      {userProfileDetails.partnerProfileDetails?.is_business ===
                      1
                        ? "Business Info"
                        : "Personal Info"}
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>
              {
                // is_business === 2 -  Personal, 1 - Business

                userProfileDetails.partnerProfileDetails.is_business === 1 ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("BusinessInfoAndAddress", {
                        isFrom: "ProfileBusinessAddress",
                      })
                    }
                  >
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        marginTop: 20,
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <FastImage
                          style={{ width: 20, height: 20, alignSelf: "center" }}
                          source={require("../assets/images/address_location.png")}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text
                          style={{
                            fontSize: fontSizes.regular,
                            marginLeft: 20,
                            color: "#000000",
                          }}
                        >
                          Business Address
                        </Text>
                      </View>
                      <FastImage
                        style={{ width: 12, height: 12 }}
                        source={require("../assets/images/arrow-right.png")}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null
              }

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RegistrationServiceAreasScreen", {
                    isFrom: "Profile",
                  })
                }
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 20,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                      source={require("../assets/images/serviceArea.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Service Area
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("PaymentMethodsList")}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 20,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                      source={require("../assets/images/account.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Payment Methods
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("SettingsList")}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 20,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                      source={require("../assets/images/settings.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Settings
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setChangeModal(1);
                  setDeleteACModalVisible(true);
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 20,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ width: 20, height: 20, alignSelf: "center" }}
                      source={require("../assets/images/delete_account.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#B60F0F",
                      }}
                    >
                      Delete Account
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    tintColor={"#B60F0F"}
                    source={require("../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.white,
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: deviceWidth / 15,
                marginVertical: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setlogoutModalVisible(true);
                  setChangeModal(0);
                }}
                style={{ flexDirection: "row" }}
              >
                <FastImage
                  style={{ width: 20, height: 20, alignSelf: "center" }}
                  source={require("../assets/images/sign-out.png")}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text
                  style={{
                    fontSize: fontSizes.regular,
                    marginLeft: 20,
                    color: "#B60F0F",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Model for Logout Start here*/}
          <StandardModal
            handleBackClose={() => {
              setDeleteACModalVisible(false);
              setlogoutModalVisible(false);
            }}
            visible={
              changeModal === 1 ? deleteACModalVisible : logoutModalVisible
            }
          >
            <View>
              <Text
                style={{
                  fontSize: fontSizes.large,
                  fontWeight: "700",
                  color: "black",
                }}
              >
                {changeModal === 1 ? "Delete Account" : "Logout"}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: fontSizes.medium,
                  fontWeight: "400",
                  marginVertical: deviceHeight / 30,
                }}
              >
                {changeModal === 1
                  ? "Are you sure want to delete your account?"
                  : "Are you sure want to logout?"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setlogoutModalVisible(false);
                      setDeleteACModalVisible(false);
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
                      if (changeModal !== 1) {
                        await removeDeviceWhenLogout() // To remove the devices for the
                          .then(async (response) => {
                            console.log("logout", response);
                          })
                          .catch((e) => {
                            setLoading(false);
                            console.log("account delete error", e.response);
                            Alert.alert("Error", e.response.data.message);
                          });
                        await storage.remove("tokens");
                        setlogoutModalVisible(false);
                        navigateAndSimpleReset("auth");
                        global.myDispatch({
                          type: "LOGOUT",
                        });
                      } else {
                        setLoading(true);
                        await deleteUserAccount()
                          .then(async (response) => {
                            setLoading(false);
                            console.log(" response", response);
                            if (response.status === 200) {
                              setLoading(false);
                              setDeleteACModalVisible(false);
                              setMessage(
                                "You have deleted your account successfully"
                              );
                              setVisible(true);
                              await storage.remove("tokens");
                              setlogoutModalVisible(false);
                              navigateAndSimpleReset("auth");
                              global.myDispatch({
                                type: "LOGOUT",
                              });
                            }
                          })
                          .catch((e) => {
                            setLoading(false);
                            console.log("account delete error", e.response);
                            Alert.alert("Error", e.response.data.message);
                          });
                      }
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
                        {changeModal === 1 ? "Delete" : "Logout"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </StandardModal>
          {/* Model for Logout Ends here*/}
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return <View></View>;
  }
};

type PorfileStyleSheet = {
  container: ViewStyle;
};

const styles = StyleSheet.create<PorfileStyleSheet>({
  container: {
    backgroundColor: "#F5F4F7",
    flex: 1,
  },
});

export default Profile;
