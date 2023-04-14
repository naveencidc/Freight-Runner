/*************************************************
 * FreightRunner
 * @exports
 * @function SettingsList.tsx
 * @extends Component
 * Created by Naveen E on 22/09/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { FC, useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  Platform,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Text, View } from "../../../components";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../../context/SnackbarContext";
import {
  getAccountDetails,
  getUserConnectedAccountDetails,
  getUserEmails,
  updateUserEmail,
  updateUserProfile,
} from "../../../services/userService";
import colors from "../../../styles/colors";
import { STANDARD_PADDING, fontSizes } from "../../../styles/globalStyles";
import FastImage from "react-native-fast-image";
import { MyContext } from "../../../../app/context/MyContextProvider";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import HeaderWithBack from "../../../components/HeaderWithBack";
import Spinner from "react-native-spinkit";
type Props = any;

const SettingsList: React.FC<Props> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [logoutModalVisible, setlogoutModalVisible] = useState(false);
  const [changeModal, setChangeModal] = useState(0);
  const [deleteACModalVisible, setDeleteACModalVisible] = useState(false);
  const [userConnectedAccountDetails, setUserConnectedAccountDetails] =
    useState({});
  const global: any = useContext(MyContext);
  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;

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

  /**
   * To Get all payment methods
   */
  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        setLoading(true);
        // To get user connected account details
        await getAccountDetails()
          .then(async (connectedAccountResponse) => {
            setLoading(false);
            if (connectedAccountResponse) {
              console.log("getAccountDetails", connectedAccountResponse);
              setUserConnectedAccountDetails(connectedAccountResponse.data);
            }
          })
          .catch((e) => {
            setLoading(false);
            console.log("getAccountDetails error", e.response);
            // Alert.alert("Error", e.response.data.error);
          });
      }
      fetchStateListAPI();
    } catch (error) {}
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="SETTINGS"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText=""
        isFrom={""}
        rightOnPress={() => {}}
      />
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner
            isVisible={loading}
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: colors.white,
              marginTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                marginHorizontal: deviceWidth / 15,
                marginVertical: deviceHeight / 30,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Premium")}>
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
                      source={require("../../../assets/images/premium.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Subscription
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../../../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>
              {userConnectedAccountDetails?.payouts_enabled ? (
                <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Payouts")}
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
                          source={require("../../../assets/images/pay-out.png")}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text
                          style={{
                            fontSize: fontSizes.regular,
                            marginLeft: 20,
                            color: "#000000",
                          }}
                        >
                          Payout Configuration
                        </Text>
                      </View>
                      <FastImage
                        style={{ width: 12, height: 12 }}
                        source={require("../../../assets/images/arrow-right.png")}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("WithdrawFunds")}
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
                          source={require("../../../assets/images/wallet.png")}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text
                          style={{
                            fontSize: fontSizes.regular,
                            marginLeft: 20,
                            color: "#000000",
                          }}
                        >
                          Withdraw Funds
                        </Text>
                      </View>
                      <FastImage
                        style={{ width: 12, height: 12 }}
                        source={require("../../../assets/images/arrow-right.png")}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              ) : null}

              <TouchableOpacity
                onPress={() => navigation.navigate("TransactionList")}
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
                      source={require("../../../assets/images/transaction.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Transactions
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../../../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("ChangePassword")}
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
                      source={require("../../../assets/images/padlock.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Change Password
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../../../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("termsOfService")}
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
                      source={require("../../../assets/images/terms.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Terms and Conditions
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../../../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("PrivacyPolicyScreen")}
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
                      source={require("../../../assets/images/privacy.png")}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        marginLeft: 20,
                        color: "#000000",
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </View>
                  <FastImage
                    style={{ width: 12, height: 12 }}
                    source={require("../../../assets/images/arrow-right.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
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

export default SettingsList;
