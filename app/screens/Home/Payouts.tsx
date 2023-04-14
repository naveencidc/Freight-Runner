/*************************************************
 * FreightRunner
 * @exports
 * @function Payouts.tsx
 * @extends Component
 * Created by Naveen E on 13/09/2022
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
  ImageStyle,
  TextStyle,
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
  userPayoutConfiguration,
} from "../../services/userService";
import Spinner from "react-native-spinkit";
import { MyContext } from ".././../../app/context/MyContextProvider";
import SelectDropdown from "react-native-select-dropdown";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";

type Props = { navigation: any };
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const Payouts: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  const [loading, setLoading] = useState(false);
  const [submitloading, setsubmitloading] = useState(false);
  const [selectedIntervel, setIntervel] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [selectedWeeklyAnchor, setselectedWeeklyAnchor] = useState("");
  const [selectedMonthlyAnchor, setselectedMonthlyAnchor] = useState(0);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [connectedAccountDetails, setConnectedAccountDetails] = useState({});

  /**
   * To Get all payment methods
   */
  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        setLoading(true);
        await getAccountDetails()
          .then(async (result) => {
            setLoading(false);
            if (result) {
              console.log("getAccountDetails", result.data);
              setConnectedAccountDetails(result);
              let interval =
                result?.data?.settings?.payouts?.schedule?.interval;
              let weekly_anchor = result?.data?.settings?.payouts?.schedule
                ?.weekly_anchor
                ? result?.data?.settings?.payouts?.schedule?.weekly_anchor
                : "";
              let monthly_anchor = result?.data?.settings?.payouts?.schedule
                ?.monthly_anchor
                ? result?.data?.settings?.payouts?.schedule?.monthly_anchor
                : "";
              console.log(
                "dha",
                result?.data?.settings?.payouts?.schedule?.interval
              );
              setIntervel(interval.charAt(0).toUpperCase() + interval.slice(1));
              setselectedWeeklyAnchor(
                weekly_anchor.charAt(0).toUpperCase() + weekly_anchor.slice(1)
              );
              setselectedMonthlyAnchor(monthly_anchor);
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

  const global = useContext(MyContext);
  const _updatePayoutConfig = async () => {
    let params = {};
    if (selectedIntervel === "Manual" || selectedIntervel === "Daily") {
      params.interval = selectedIntervel.toLowerCase();
    } else if (selectedIntervel === "Weekly") {
      params.interval = selectedIntervel.toLowerCase();
      params.weekly_anchor = selectedWeeklyAnchor.toLowerCase();
    } else if (selectedIntervel === "Monthly") {
      params.interval = selectedIntervel.toLowerCase();
      params.monthly_anchor = selectedMonthlyAnchor;
    }
    setsubmitloading(true);
    await userPayoutConfiguration({ payOutConfig: params })
      .then(async (response) => {
        setsubmitloading(false);
        if (response.status === 201) {
          setMessage("Payout configured successfully.");
          setVisible(true);
          navigation.goBack();
        }
        console.log("userPayoutConfiguration", response);
      })
      .catch((e) => {
        setsubmitloading(false);
        console.log("userPayoutConfiguration error", e.response);
      });
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <View style={{ flex: 1 }}>
        <HeaderWithBack
          title="PAYOUT"
          onPress={() => navigation.goBack()}
          isRightText={false}
          rightText=""
          isFrom={isFrom}
          rightOnPress={() => {}}
        />
        <View style={{ flex: 1 }}>
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
            <View>
              <Text
                style={{
                  fontSize: fontSizes.medium,
                  paddingHorizontal: deviceWidth / 20,
                  fontWeight: "600",
                  paddingVertical: 20,
                }}
              >
                Payout Configuration
              </Text>

              <View>
                <View
                  style={{
                    paddingHorizontal: deviceWidth / 20,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#F5F4F7",
                    borderColor: "#EDEDED",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                  >
                    Select Intervel
                  </Text>
                  <SelectDropdown
                    data={["Manual", "Daily", "Weekly", "Monthly"]}
                    onSelect={(selectedItem, index) => {
                      setIntervel(selectedItem);
                      if (
                        selectedItem === "Manual" ||
                        selectedItem === "Daily"
                      ) {
                        setDisableButton(false);
                      } else {
                        setDisableButton(true);
                      }
                    }}
                    buttonStyle={styles.dropdown3BtnStyle}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      return (
                        <View style={styles.dropdown3BtnChildStyle}>
                          <Text style={[styles.dropdown3BtnTxt]}>
                            {selectedItem ? selectedItem : selectedIntervel}
                          </Text>
                          <FastImage
                            resizeMode={"contain"}
                            source={require("../../../app/assets/images/downArrow.png")}
                            style={{ height: 18, width: 15 }}
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
                        </View>
                      );
                    }}
                  />
                </View>
                {selectedIntervel === "Weekly" ? (
                  <View
                    style={{
                      paddingHorizontal: deviceWidth / 20,
                      flexDirection: "column",
                      justifyContent: "space-between",
                      marginTop: deviceHeight / 55,
                      backgroundColor: "#F5F4F7",
                      borderColor: "#EDEDED",
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                    >
                      Select the day
                    </Text>
                    <SelectDropdown
                      data={[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ]}
                      onSelect={(selectedItem, index) => {
                        setselectedWeeklyAnchor(selectedItem);
                        if (selectedItem) {
                          setDisableButton(false);
                        } else {
                          setDisableButton(true);
                        }
                      }}
                      buttonStyle={styles.dropdown3BtnStyle}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View style={styles.dropdown3BtnChildStyle}>
                            <Text style={[styles.dropdown3BtnTxt]}>
                              {selectedItem
                                ? selectedItem
                                : selectedWeeklyAnchor}
                            </Text>
                            <FastImage
                              resizeMode={"contain"}
                              source={require("../../../app/assets/images/downArrow.png")}
                              style={{ height: 18, width: 15 }}
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
                          </View>
                        );
                      }}
                    />
                  </View>
                ) : null}

                {selectedIntervel === "Monthly" ? (
                  <View
                    style={{
                      paddingHorizontal: deviceWidth / 20,
                      flexDirection: "column",
                      justifyContent: "space-between",
                      marginTop: deviceHeight / 55,
                      backgroundColor: "#F5F4F7",
                      borderColor: "#EDEDED",
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                    >
                      Select the day
                    </Text>
                    <SelectDropdown
                      data={[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                        31,
                      ]}
                      onSelect={(selectedItem, index) => {
                        setselectedMonthlyAnchor(selectedItem);
                        if (selectedItem) {
                          setDisableButton(false);
                        } else {
                          setDisableButton(true);
                        }
                      }}
                      buttonStyle={styles.dropdown3BtnStyle}
                      renderCustomizedButtonChild={(selectedItem, index) => {
                        return (
                          <View style={styles.dropdown3BtnChildStyle}>
                            <Text style={[styles.dropdown3BtnTxt]}>
                              {selectedItem
                                ? selectedItem
                                : selectedMonthlyAnchor}
                            </Text>
                            <FastImage
                              resizeMode={"contain"}
                              source={require("../../../app/assets/images/downArrow.png")}
                              style={{ height: 18, width: 15 }}
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
                          </View>
                        );
                      }}
                    />
                  </View>
                ) : null}

                <View
                  style={{
                    paddingHorizontal: 15,
                    justifyContent: "center",
                    paddingVertical: 15,
                    marginTop: deviceHeight / 25,
                  }}
                >
                  <CustomButton
                    titleColor={colors.white}
                    borderColor={colors.background}
                    onPress={async () => {
                      _updatePayoutConfig();
                    }}
                    title="Submit"
                    backgroundColor={
                      disableButton ? "#454545" : colors.background
                    }
                    disableButton={disableButton}
                    btnLoading={submitloading}
                  ></CustomButton>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
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

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  dropdown3BtnStyle: {
    width: "100%",
    paddingHorizontal: 0,
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F4F7",
  },
  dropdown3BtnImage: { width: 45, height: 45, resizeMode: "cover" },
  dropdown3BtnTxt: {
    flex: 0.8,
    color: "#000000",
    fontSize: fontSizes.regular,
  },
  dropdown3DropdownStyle: { backgroundColor: "#F5F4F7", borderRadius: 5 },
  dropdown3RowStyle: {
    borderBottomColor: "#EFEFEF",
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  dropdownRowImage: { width: 45, height: 45, resizeMode: "contain" },
  dropdown3RowTxt: {
    color: "black",
    fontWeight: "500",
    fontSize: 18,
    flex: 1,
  },
});

export default Payouts;
