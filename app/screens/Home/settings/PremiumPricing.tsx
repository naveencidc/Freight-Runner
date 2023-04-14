/*************************************************
 * FreightRunner
 * @exports
 * @function PremiumPricing.tsx
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
  FlatList,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { CustomButton, Text, View } from "../../../components";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../../context/SnackbarContext";
import colors from "../../../styles/colors";
import { STANDARD_PADDING, fontSizes } from "../../../styles/globalStyles";
import { MyContext } from "../../../../app/context/MyContextProvider";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import HeaderWithBack from "../../../components/HeaderWithBack";
import { getUserSubscriptionPlanDetails } from "../../../services/userService";

type Props = any;

const PremiumPricing: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  let subscriptionDetail = route.params?.subscriptionDetail;

  const [loading, setLoading] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [logoutModalVisible, setlogoutModalVisible] = useState(false);
  const [changeModal, setChangeModal] = useState(0);
  const [deleteACModalVisible, setDeleteACModalVisible] = useState(false);
  const global: any = useContext(MyContext);
  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [selectedPlan, setselectedPlan] = useState({});
  const [plansList, setplansList] = useState([]);
  const [isMonthlySelected, setisMonthlySelected] = useState(true);

  useEffect(() => {
    let subscriptionPlanList = [];
    try {
      async function fetchAPI() {
        // setLoading(true);
        await getUserSubscriptionPlanDetails()
          .then(async (response: any) => {
            await response?.data?.map(async (item: any) => {
              if (item?.priceDetails?.recurring?.interval === "month") {
                subscriptionPlanList.push({
                  ...item,
                  isSelected: isFrom === "upgradePlan" ? false : true,
                });
                if (isFrom !== "upgradePlan") {
                  setselectedPlan({ ...item, isSelected: true });
                }
              } else {
                if (isFrom === "upgradePlan") {
                  setselectedPlan({ ...item, isSelected: true });
                }
                subscriptionPlanList.push({
                  ...item,
                  isSelected: isFrom === "upgradePlan" ? true : false,
                });
              }
            });
            setplansList(subscriptionPlanList);
          })
          .catch((e) => {
            // setLoading(false);
            console.log("RequestList", e.response);
            Alert.alert("Error", e.response.data.message);
          });
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR");
    }
  }, []);

  const _renderFeatureItem = (
    title: string,
    description: string,
    isfree: boolean,
    isPremium: boolean
  ) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 1.5,
            borderColor: "#EDEDED",
            borderWidth: 1,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: fontSizes.small,
              marginHorizontal: 10,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: fontSizes.xSmall,
              color: colors.lightTextGrey,
              marginTop: 3,
              marginHorizontal: 10,
            }}
          >
            {description}
          </Text>
        </View>
        <View style={styles.smallBox}>
          {isfree && (
            <Icon size={15} name={"check"} color={colors.background} />
          )}
        </View>
        <View style={styles.smallBox}>
          {isPremium && (
            <Icon size={15} name={"check"} color={colors.background} />
          )}
        </View>
      </View>
    );
  };

  const _renderFeatureHeader = (header: string) => {
    return (
      <View style={styles.featureHeader}>
        <Text
          style={{
            fontWeight: "bold",
            paddingHorizontal: 10,
            fontSize: fontSizes.small,
          }}
        >
          {header}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="PREMIUM"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText=""
        isFrom={""}
        rightOnPress={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          padding: 10,
        }}
      >
        <View style={{}}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1.5 }}></View>
            <View
              style={{
                flex: 0.5,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F5F4F7",
                borderColor: "#EDEDED",
                borderWidth: 1,
                paddingVertical: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: fontSizes.small }}>
                FREE
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.background,
                borderColor: "#EDEDED",
                borderWidth: 1,
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: fontSizes.small,
                  color: colors.white,
                }}
              >
                PREMIUM
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flex: 1.5,
                borderColor: "#EDEDED",
                borderWidth: 1,
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: fontSizes.small,
                  marginHorizontal: 10,
                }}
              >
                Monthly price
              </Text>
            </View>
            <View style={styles.smallBox}>
              <Text style={{ fontWeight: "bold", fontSize: fontSizes.regular }}>
                $ 0
              </Text>
            </View>
            <View style={styles.smallBox}>
              <Text style={{ fontWeight: "bold", fontSize: fontSizes.regular }}>
                $ 29.99
              </Text>
            </View>
          </View>

          {_renderFeatureHeader("FREE FEATURE")}

          {_renderFeatureItem(
            "Load Searching",
            "Perform unlimited searches",
            true,
            true
          )}
          {_renderFeatureItem(
            "Shipper's Contacts",
            "View a shipper's contacts for each load",
            true,
            true
          )}
          {_renderFeatureItem(
            "Map & Directions",
            "View detailed map & route in order to help with trip planning",
            true,
            true
          )}
          {_renderFeatureItem(
            "Real-Time Updates",
            "See load-refreshes in real time",
            true,
            true
          )}
          {_renderFeatureItem(
            "New Loads Notification",
            "Get an emailwhen a new load matches what you're looking for",
            true,
            true
          )}
          {_renderFeatureHeader("PREMIUM FRATURES")}
          {_renderFeatureItem(
            "Show rates for all eligible loads*​",
            "View the best-paying loads in any given lane",
            false,
            true
          )}
          {_renderFeatureItem(
            "Bid on and instantly book loads​",
            "Place bids and win loads 24/7 - no phone calls required",
            false,
            true
          )}
          {_renderFeatureItem(
            "Filter loads by price or rate per mile​",
            "Best-paying loads serach by lowest price or rate per mile",
            false,
            true
          )}
          {_renderFeatureItem(
            "Show backhaul loads for any load​",
            "Match load with backhauls instantly",
            false,
            true
          )}
        </View>
        <View
          style={{
            marginVertical: deviceHeight / 40,
            flex: 1,
          }}
        >
          <FlatList
            scrollEnabled={true}
            extraData={plansList}
            data={plansList.reverse()}
            horizontal={true}
            // inverted
            keyExtractor={(item, index) => index.toString()}
            // renderItem={this._renderMultipleImages}
            // scrollEnabled={item.length > 1 ? true : false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              if (item.active) {
                return (
                  <View style={{ flex: 1, marginRight: 5 }}>
                    {isFrom === "upgradePlan" ? (
                      <View
                        style={{
                          backgroundColor:
                            item.id ===
                            subscriptionDetail?.SubscriptionDtls[0]
                              ?.stripe_product_id
                              ? "black"
                              : "white",
                          paddingVertical: 4,
                          paddingHorizontal: 5,
                          borderWidth: 1,
                          borderColor: colors.background,
                          borderBottomWidth: 0,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizes.xSmall,
                            fontWeight: "700",
                            color:
                              item.id ===
                              subscriptionDetail?.SubscriptionDtls[0]
                                ?.stripe_product_id
                                ? "white"
                                : "black",
                          }}
                        >
                          {item.id ===
                          subscriptionDetail?.SubscriptionDtls[0]
                            ?.stripe_product_id
                            ? "CURRENT PLAN"
                            : "UPGRADE PLAN"}
                        </Text>
                      </View>
                    ) : null}

                    <TouchableOpacity
                      disabled={
                        item.id ===
                        subscriptionDetail?.SubscriptionDtls[0]
                          ?.stripe_product_id
                      }
                      onPress={async () => {
                        let tempArray = [...plansList].reverse();
                        await tempArray.map((plan, planindex) => {
                          if (plan.id === item.id) {
                            tempArray[planindex].isSelected = true;
                            setselectedPlan({ ...plan, isSelected: true });
                          } else {
                            tempArray[planindex].isSelected = false;
                          }
                        });
                        setplansList(tempArray);
                      }}
                      style={{
                        width: deviceWidth / 2.2,
                        backgroundColor: item.isSelected
                          ? colors.background
                          : colors.white,
                        alignItems: "center",
                        padding: 12,
                        borderWidth: 1,
                        borderColor: colors.background,
                        // borderRadius: 3,
                      }}
                    >
                      <Icon
                        style={{ position: "absolute", left: 5, top: 5 }}
                        size={16}
                        name={"check"}
                        color={colors.white}
                      />
                      <Text
                        style={{
                          color: !item.isSelected
                            ? colors.background
                            : colors.white,
                          fontWeight: "bold",
                        }}
                      >
                        {item?.description}
                        {/* {item?.priceDetails?.recurring?.interval === "year" ? "Yearly" : "Monthly"} */}
                      </Text>
                      <Text
                        style={{
                          color: !item.isSelected
                            ? colors.background
                            : colors.white,
                          fontWeight: "bold",
                        }}
                      >
                        ${item?.priceDetails?.unit_amount / 100} /{" "}
                        {item?.priceDetails?.recurring?.interval}
                      </Text>
                    </TouchableOpacity>
                    {item?.priceDetails?.recurring?.interval === "year" ? (
                      <View
                        style={{
                          position: "absolute",
                          backgroundColor: colors.green,
                          right: 0,
                          paddingHorizontal: 5,
                          borderBottomLeftRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.white,
                            fontSize: fontSizes.xSmall,
                            fontWeight: "600",
                          }}
                        >
                          Save 16%
                        </Text>
                      </View>
                    ) : null}
                  </View>
                );
              } else {
                return null;
              }
            }}
          />

          {/* <View style={{ flex: 1, marginLeft: 5 }}>
            {isFrom === "upgradePlan" ? (
              <View
                style={{
                  backgroundColor: !isMonthlySelected ? "white" : "black",
                  paddingVertical: 4,
                  paddingHorizontal: 5,
                  borderWidth: 1,
                  borderColor: colors.background,
                  borderBottomWidth: 0
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizes.xSmall,
                    fontWeight: "700",
                    color: isMonthlySelected ? "white" : "black"
                  }}
                >
                  UPGRADE TO
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                setisMonthlySelected(false);
              }}
              style={{
                backgroundColor: !isMonthlySelected ? colors.background : colors.white,

                alignItems: "center",
                padding: 12,
                borderColor: colors.background,
                borderWidth: 1
                // borderRadius: 3,
              }}
            >
              <Icon
                style={{ position: "absolute", left: 5, top: 5 }}
                size={16}
                name={"check"}
                color={colors.white}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  color: isMonthlySelected ? colors.background : colors.white
                }}
              >
                Annual
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: isMonthlySelected ? colors.background : colors.white
                }}
              >
                $311.99/year
              </Text>
              <View
                style={{
                  position: "absolute",
                  backgroundColor: colors.green,
                  right: 0,
                  paddingHorizontal: 5,
                  borderBottomLeftRadius: 5
                }}
              >
                <Text
                  style={{ color: colors.white, fontSize: fontSizes.xSmall, fontWeight: "600" }}
                >
                  Save 16%
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={{ paddingHorizontal: 15, paddingBottom: 50 }}>
          <CustomButton
            titleColor={colors.white}
            borderColor={colors.background}
            onPress={() =>
              navigation.navigate("SelectPaymentMethod", {
                selectedPlan,
                isFrom: isFrom,
              })
            }
            title="Continue with premium"
            backgroundColor={colors.background}
            btnLoading={loading}
          ></CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type PorfileStyleSheet = {
  container: ViewStyle;
  smallBox: ViewStyle;
  featureHeader: ViewStyle;
};

const styles = StyleSheet.create<PorfileStyleSheet>({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  smallBox: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#EDEDED",
    borderWidth: 1,
    paddingVertical: 10,
  },
  featureHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#F5F4F7",
    borderColor: "#EDEDED",
    borderWidth: 1,
  },
});

export default PremiumPricing;
