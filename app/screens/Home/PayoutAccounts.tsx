/*************************************************
 * FreightRunner
 * @exports
 * @function PayoutAccounts.tsx
 * @extends Component
 * Created by Deepak B on 06/10/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useContext, useEffect, useState } from "react";
import {
  ViewStyle,
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { CustomButton } from "../../components";
import FastImage from "react-native-fast-image";
import {
  getAccountDetails,
  getAllPaymentMethods,
  getUserConnectedAccountDetails,
} from "../../services/userService";
import Spinner from "react-native-spinkit";
import { MyContext } from ".././../../app/context/MyContextProvider";

type Props = { navigation: any };
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const PayoutAccounts: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  const [loading, setLoading] = useState(false);
  const [isShowAddModel, setisShowAddModel] = useState(false);
  const [tabPosition, setTabPosition] = useState(0);
  const [stripeOnboarding, setStripeOnboarding] = useState({});
  // const [allPaymentMethods, setallPaymentMethods] = useState([]);
  // const [connectedAccountDetails, setconnectedAccountDetails] = useState(undefined);
  const global = useContext(MyContext);

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
            if (connectedAccountResponse) {
              console.log("getAccountDetails", connectedAccountResponse);
              global.myDispatch({
                type: "UPDATE_CONNECTED_ACCOUNT_DETAIL_SUCESS",
                payload: connectedAccountResponse.data,
              });
              // To get user payment method if connected account is not available
              await getAllPaymentMethods()
                .then(async (response) => {
                  setLoading(false);
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

  const _renderFlatList = () => {
    return (
      <FlatList
        style={{ maxHeight: deviceHeight / 1.4 }}
        data={
          global.myState.allPaymentMethods?.bank?.data?.length > 0
            ? global.myState.allPaymentMethods?.bank?.data
            : global.myState.allPaymentMethods?.card?.data
        }
        renderItem={_renderList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
      />
    );
  };

  const _navigate = async () => {
    if (
      global.myState.connectedAccountDetails &&
      !global.myState.connectedAccountDetails?.payouts_enabled
    ) {
      //To get user stripe onboarding status and information
      await getUserConnectedAccountDetails()
        .then(async (response) => {
          if (response.data) {
            navigation.navigate("AddStripeConnectAccounts", {
              isFrom: "STRIPE_ACCOUNT_NOT_VERIFIED",
              stripeOnboardingDetail: response.data,
            });
          }

          console.log("getUserConnectedAccountDetails", response);
        })
        .catch((e) => {
          setLoading(false);
          console.log("getUserConnectedAccountDetails error", e.response);
          Alert.alert("Error", e.response.data.message);
        });
    } else {
      navigation.navigate("AddStripeConnectAccounts", {
        isFrom: "STRIPE_ACCOUNT_NOT_VERIFIED",
      });
    }
  };

  const _renderList = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            // navigation.navigate("BankAccountDetails", {
            //   accountDetail: item,
            //   isFrom: global.myState.allPaymentMethods?.bank?.data?.length > 0 ? null : "cardList"
            // })
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              flexDirection: "row",
              paddingVertical: deviceHeight / 40,
              marginTop: index === 0 ? 0 : 15,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: fontSizes.regular,
                  // paddingHorizontal: 15,
                  fontWeight: "600",
                }}
              >
                {global.myState.allPaymentMethods?.bank?.data?.length > 0
                  ? item.bank_name
                  : "MASTER CARD"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    paddingRight: 15,
                    marginTop: 10,
                    color: colors.lightGrey,
                    fontWeight: "600",
                  }}
                >
                  XXXX - XXXX - XXXX -{item.last4}
                </Text>
                {/* <View
                  style={{
                    height: "60%",
                    width: 0.5,
                    backgroundColor: colors.background,
                    marginTop: 10,
                    alignSelf: "center"
                  }}
                ></View> */}
                {/* <Text
                  style={{
                    fontSize: fontSizes.small,
                    paddingHorizontal: 15,
                    marginTop: 10,
                    color: colors.lightGrey,
                    fontWeight: "600",
                    alignSelf: "center",
                    maxWidth: "75%"
                  }}
                >
                  {item.account_holder_name}
                </Text> */}
              </View>
              {global.myState.allPaymentMethods?.card?.data?.length > 0 ? (
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <Text
                    style={{
                      fontSize: fontSizes.small,
                      // paddingHorizontal: 15,
                      // marginTop: 10,
                      color: colors.lightGrey,
                      fontWeight: "600",
                      // alignSelf: "center",
                      // maxWidth: "75%"
                    }}
                  >
                    Expires:
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizes.small,
                      paddingHorizontal: 5,
                      // marginTop: 10,
                      color: colors.background,
                      fontWeight: "500",
                      // alignSelf: "center",
                      // maxWidth: "75%"
                    }}
                  >
                    12 / 32
                  </Text>
                </View>
              ) : null}
            </View>

            {/* <View style={{ flexDirection: "row", paddingHorizontal: 13, marginTop: 15 }}>
              <FastImage
                resizeMode={"contain"}
                tintColor={colors.greyLight}
                source={require("../../assets/images/close.png")}
                style={{ height: 15, width: 15, alignSelf: "center" }}
              />
              <Text
                style={{
                  fontSize: fontSizes.small,
                  // marginTop: 5,
                  paddingHorizontal: 5,
                  color: colors.lightGrey
                }}
              >
                {item.status}
              </Text>
            </View> */}
            {/* {item.default_for_currency ? (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View
                  style={{ borderColor: "#1C9151", borderWidth: 1, padding: 5, borderRadius: 6 }}
                >
                  <Text style={{ color: "#1C9151", fontWeight: "bold", fontSize: 14 }}>
                    Primary Account
                  </Text>
                </View>
              </View>
            ) : null} */}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const _renderTabs = () => {
    return (
      <View style={[styles.tabStyles, {}]}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: colors.white,
              backgroundColor: tabPosition === 0 ? colors.black : colors.white,
              height: deviceHeight / 25,
              marginVertical: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setTabPosition(0);
                // setPayoutListLoading(true);
                // callPayoutListApi("initialLoading");
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.small,
                  textAlign: "center",
                  color: tabPosition === 0 ? colors.white : "#808F99",
                  paddingBottom: 2,
                  width: deviceWidth / 3.5,
                }}
              >
                Bank
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View
            style={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: colors.white,
              backgroundColor: tabPosition === 1 ? colors.black : colors.white,
              height: deviceHeight / 25,
              marginVertical: 3,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setTabPosition(1);
                // setTransferListLoading(true);
                // callTransferListApi("initialLoading");
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.small,
                  textAlign: "center",
                  color: tabPosition === 1 ? colors.white : "#808F99",
                  width: deviceWidth / 3.5,
                  paddingBottom: 2
                }}
              >
                Card
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <View style={{ flex: 1 }}>
        <HeaderWithBack
          title="ACCOUNT"
          onPress={() => navigation.goBack()}
          isRightText={false}
          rightText="ADD"
          isFrom={isFrom}
          rightOnPress={() => {
            setisShowAddModel(true);
          }}
        />
        {isShowAddModel ? (
          <TouchableOpacity
            activeOpacity={0.1}
            onPress={() => {
              setisShowAddModel(false);
            }}
            style={{
              position: "absolute",
              backgroundColor: "rgba(52, 52, 52, 0.2)",
              // flex: 1,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                right: 10,
                top: 60,
              }}
            >
              <View style={{ backgroundColor: "white", borderRadius: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (global.myState.connectedAccountDetails) {
                      navigation.navigate("AddAccounts");
                      setisShowAddModel(false);
                    } else {
                      Alert.alert(
                        "",
                        "You require to create a Stripe Connect Account to add and map external accounts, Thus would like to proceed creating a Stripe Connect Account?",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => {
                              navigation.navigate("AddStripeConnectAccounts", {
                                isFrom: "STRIPE_ACCOUNT_NOT_VERIFIED",
                              });
                            },
                          },
                        ]
                      );
                    }
                  }}
                  style={{
                    paddingTop: 15,
                    paddingBottom: 7.5,
                    paddingHorizontal: 25,
                    borderBottomWidth: 1,
                    borderColor: "lightgray",
                  }}
                >
                  <Text style={{ fontSize: fontSizes.regular }}>
                    Bank Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setisShowAddModel(false);
                    navigation.navigate("AddCardDetail");
                  }}
                  style={{
                    paddingTop: 7.5,
                    paddingBottom: 15,
                    paddingHorizontal: 25,
                  }}
                >
                  <Text style={{ fontSize: fontSizes.regular }}>Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        <View style={{ flex: 1 }}>
          {/* <View>{_renderTabs()}</View> */}
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
            <View style={{ marginTop: 20 }}>
              {/* {tabPosition === 0 ? ( */}
              <View>
                {global.myState.allPaymentMethods?.bank?.data?.length > 0 ||
                global.myState.allPaymentMethods?.card?.data?.length > 0 ? (
                  _renderFlatList()
                ) : (
                  <View style={{ marginBottom: deviceHeight / 25 }}>
                    <View
                      style={{
                        backgroundColor: colors.white,
                        paddingVertical: deviceHeight / 35,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizes.regular,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        No Account
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizes.small,
                          marginTop: 10,
                          textAlign: "center",
                          color: colors.greyLight,
                        }}
                      >
                        Click Stripe Connect Account below to add Payout Payment
                        method
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              {/* ) : (
                <View>
                  {global.myState.allPaymentMethods?.bank?.data?.length > 0 ? (
                    _renderFlatList()
                  ) : (
                    <View style={{ marginBottom: deviceHeight / 25 }}>
                      <View
                        style={{
                          backgroundColor: colors.white,
                          paddingVertical: deviceHeight / 35
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizes.regular,
                            fontWeight: "bold",
                            textAlign: "center"
                          }}
                        >
                          No Card
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizes.xSmall,
                            marginTop: 10,
                            textAlign: "center",
                            color: colors.greyLight
                          }}
                        >
                          Click ADD button to add new card
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )} */}

              {global.myState.connectedAccountDetails &&
              global.myState.connectedAccountDetails.payouts_enabled ? (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: deviceHeight / 25,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FastImage
                    resizeMode={"contain"}
                    source={require("../../assets/images/passwordChecked.png")}
                    style={{ height: 20, width: 20, alignSelf: "center" }}
                  />
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      // marginTop: 5,
                      paddingHorizontal: 5,
                      color: "#1C9151",
                      fontWeight: "500",
                    }}
                  >
                    Stripe is Verified
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    paddingHorizontal: 25,
                    justifyContent: "center",
                    paddingVertical: 20,
                    // marginTop: deviceHeight / 25
                  }}
                >
                  <CustomButton
                    titleColor={colors.white}
                    borderColor={colors.background}
                    onPress={async () => {
                      _navigate();
                    }}
                    title="Create a Stripe Connected Account"
                    backgroundColor={colors.background}
                  ></CustomButton>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
  tabStyles: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F4F7",
  },
  tabStyles: {
    borderWidth: 1,
    height: deviceHeight / 20,
    borderRadius: 30,
    backgroundColor: colors.white,
    borderColor: colors.white,
    marginTop: 20,
    alignSelf: "center",
  },
});

export default PayoutAccounts;
