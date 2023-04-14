/*************************************************
 * FreightRunner
 * @exports
 * @function Premium.tsx
 * @extends Component
 * Created by Naveen E on 22/0/2022
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
import { CustomButton, Text, View } from "../../../components";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../../context/SnackbarContext";
import colors from "../../../styles/colors";
import { STANDARD_PADDING, fontSizes } from "../../../styles/globalStyles";
import FastImage from "react-native-fast-image";
import { MyContext } from "../../../../app/context/MyContextProvider";
import StandardModal from "../../../components/StandardModal";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import HeaderWithBack from "../../../components/HeaderWithBack";
import {
  cancelUserSubscription,
  createSubscription,
  getAllPaymentMethods,
  getUserSubscriptionDetails,
} from "../../../services/userService";
import Spinner from "react-native-spinkit";
import moment from "moment";

type Props = any;

const Premium: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  const [loading, setLoading] = useState(false);
  const [isPaidUser, setisPaidUser] = useState(false);
  const [changeModal, setChangeModal] = useState(0);
  const [cancelPlanModelVisible, setcancelPlanModelVisible] = useState(false);
  const [cancelErrorMessage, setCancelErrorMessage] = useState("");
  const global: any = useContext(MyContext);
  const [cancelBtnLoading, setcancelBtnLoading] = useState(false);
  const [subscriptionDetail, setsubscriptionDetail] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  /**
   * To Get all payment methods
   */
  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        setLoading(true);
        await getAllPaymentMethods()
          .then(async (response) => {
            setLoading(false);
            console.log("getAllPaymentMethods", response);
            global.myDispatch({
              type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
              payload: response.data,
            });
            _checkPaymentMethods(response.data);
            // setallPaymentMethods(response.data);
            global.myDispatch({
              type: "UPDATE_ALL_PAYMENT_METHODS_SUCESS",
              payload: response.data,
            });
          })
          .catch((e) => {
            setLoading(false);
            console.log("getAllPaymentMethods error", e.response);
            Alert.alert("Error", e.response.data.message);
          });
      }
      fetchStateListAPI();
    } catch (error) {}
  }, []);

  const _checkPaymentMethods = (response) => {
    if (
      response?.customerBank?.data?.length === 0 &&
      response?.customerCard?.data?.length === 0
    ) {
      Alert.alert(
        "",
        "Seems like you have to configure payment method to activate Subscription",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Accounts");
            },
          },
        ]
      );
      return false;
    } else {
      return true;
    }
  };
  /**
   * To Get all payment methods
   */
  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        setLoading(true);
        await getUserSubscriptionDetails()
          .then(async (response) => {
            setLoading(false);
            console.log("getUserSubscriptionDetails", response);
            setsubscriptionDetail(response.data);
            if (response.data.SubscriptionDtls[0].id) {
              setisPaidUser(true);
            }
          })
          .catch((e) => {
            setLoading(false);
            console.log("getUserSubscriptionDetails error", e.response);
            setisPaidUser(false);
            // Alert.alert("Error", e.response.data.message);
          });
      }
      fetchStateListAPI();
    } catch (error) {}
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="SUBSCRIPTION"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText={""}
        isFrom={""}
        rightOnPress={() => {
          seisPaidUser(!isPaidUser);
        }}
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
          {isPaidUser ? (
            <View style={{ paddingHorizontal: 15 }}>
              <Text style={{ color: colors.labelGray, paddingVertical: 10 }}>
                Membership
              </Text>
              <View
                style={{
                  backgroundColor: colors.white,
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                }}
              >
                {/* <View style={{backgroundColor:'black'}}>
                  <Text>Trial</Text>
                </View> */}
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSizes.medium,
                    fontWeight: "bold",
                  }}
                >
                  Premium{" "}
                  {subscriptionDetail.SubscriptionDtls[0].plan_name === "month"
                    ? "Monthly"
                    : "Yearly"}{" "}
                  ${subscriptionDetail.SubscriptionDtls[0].amount / 100} /{" "}
                  {subscriptionDetail.SubscriptionDtls[0].plan_name}
                </Text>
                <Text style={{ marginTop: 10 }}>
                  Subscription Valid Till:
                  <Text style={{ fontWeight: "700" }}>
                    {" "}
                    {moment(subscriptionDetail.SubscriptionDtls[0].end).format(
                      "ll"
                    )}
                  </Text>
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  marginVertical: deviceHeight / 30,
                }}
              >
                {subscriptionDetail.SubscriptionDtls[0].plan_name === "month" &&
                subscriptionDetail.userDetails.subscription_status === 1 ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                    }}
                    onPress={() =>
                      navigation.navigate("PremiumPricing", {
                        isFrom: "upgradePlan",
                        subscriptionDetail: subscriptionDetail,
                      })
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
                          Upgrade Plan
                        </Text>
                      </View>
                      <FastImage
                        style={{ width: 12, height: 12 }}
                        source={require("../../../assets/images/arrow-right.png")}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null}
                {/**
                 * subscription_cancelled 1 - canceled
                 */}
                {subscriptionDetail?.userDetails?.subscription_cancelled !==
                1 ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                      marginTop: 10,
                    }}
                    onPress={() => {
                      setcancelPlanModelVisible(true);
                    }}
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
                          source={require("../../../assets/images/sign-out.png")}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text
                          style={{
                            fontSize: fontSizes.regular,
                            marginLeft: 20,
                            color: "#B60F0F",
                          }}
                        >
                          Cancel Subscription
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: colors.white,
                marginTop: 20,
              }}
            >
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <Text style={{ color: colors.black }}>
                  FreightRunner carrier subscription is not activated
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      _checkPaymentMethods(global.myState.allPaymentMethods)
                    ) {
                      navigation.navigate("PremiumPricing", { isFrom: isFrom });
                    }
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: "#FC261D",
                    padding: 10,
                    marginTop: deviceHeight / 50,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "#FC261D", fontWeight: "bold" }}>
                    ACTIVATE 30-DAY FREE TRIAL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {subscriptionDetail?.userDetails?.subscription_cancelled === 1 ? (
            <View style={{ marginHorizontal: 20 }}>
              <CustomButton
                titleColor={colors.white}
                borderColor={colors.background}
                onPress={async () => {
                  setcancelBtnLoading(true);
                  await cancelUserSubscription(false)
                    .then(async (response) => {
                      setcancelBtnLoading(false);
                      console.log("Re-Activated ", response);
                      setMessage(
                        "You have Re-Activated your current subscription."
                      );
                      setVisible(true);
                      setcancelPlanModelVisible(false);
                      navigation.goBack();
                    })
                    .catch((e) => {
                      setcancelBtnLoading(false);
                      console.log("Re-Activated error", e.response);
                      setCancelErrorMessage(e.response.data.message);
                    });
                }}
                title=" Re-Activate Subscription"
                backgroundColor={colors.background}
                btnLoading={cancelBtnLoading}
              ></CustomButton>
            </View>
          ) : null}
        </ScrollView>
      )}

      <StandardModal
        visible={cancelPlanModelVisible}
        handleBackClose={() => {
          setcancelPlanModelVisible(false);
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
            Cancel Subscription
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: fontSizes.medium,
              fontWeight: "400",
              marginVertical: deviceHeight / 30,
            }}
          >
            Are you sure want to cancel this subscription ?
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setCancelErrorMessage("");
                  setcancelPlanModelVisible(false);
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
                  No
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, paddingLeft: 10 }}>
              <TouchableOpacity
                onPress={async () => {
                  setcancelBtnLoading(true);
                  setCancelErrorMessage("");
                  await cancelUserSubscription(true)
                    .then(async (response) => {
                      setcancelBtnLoading(false);
                      console.log("cancelUserSubscription ", response);
                      setMessage(
                        "Ooops! You have cancelled your current subscription."
                      );
                      setVisible(true);
                      setcancelPlanModelVisible(false);
                      navigation.goBack();
                    })
                    .catch((e) => {
                      setcancelBtnLoading(false);
                      console.log("cancelUserSubscription error", e.response);
                      setCancelErrorMessage(e.response.data.message);
                    });
                }}
                style={{
                  backgroundColor: colors.background,
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
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {cancelErrorMessage !== "" ? (
            <Text
              style={{ marginTop: 15, color: "#B60F0F", textAlign: "center" }}
            >
              {cancelErrorMessage}
            </Text>
          ) : null}
        </View>
      </StandardModal>
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

export default Premium;
