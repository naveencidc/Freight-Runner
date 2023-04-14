/*************************************************
 * FreightRunner
 * @exports
 * @function TransactionList.tsx
 * @extends Component
 * Created by Naveen E on 16/09/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5Pro";
import { Text } from "../components";
import colors from "../styles/colors";
import { fontSizes } from "../styles/globalStyles";
import FastImage from "react-native-fast-image";
import FRHeader from "../components/FRHeader";
import { getMyJobsList, getMyCompletedJobsList } from "../services/jobService";
import { MyContext } from "../context/MyContextProvider";
import Spinner from "react-native-spinkit";
import HeaderWithBack from "../components/HeaderWithBack";
import {
  getUserTransactionList,
  getUserPayoutList,
} from "../services/userService";
var moment = require("moment-timezone");

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const extractKey = ({ _id }) => _id;
type Props = { navigation: any };
let endReached = false;

const TransactionList: React.FC<Props> = ({ navigation }) => {
  const [tabPosition, setTabPosition] = useState(0);
  const [refreshing, isRefreshing] = useState(false);
  const [payoutListLoading, setPayoutListLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreloading] = useState(false);

  const [completedLoadrefreshing, setcompletedLoadrefreshing] = useState(false);
  const [transferListLoading, setTransferListLoading] = useState(false);
  const [completedloadMoreLoading, setcompletedloadMoreLoading] =
    useState(false);
  const global: any = useContext(MyContext);
  useEffect(() => {
    try {
      async function fetchAPI() {
        setTransferListLoading(true);
        callTransferListApi("initialLoading");
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR");
    }
  }, []);

  const callPayoutListApi = async (isFrom: string) => {
    if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
      endReached = false;
    }
    let params = {
      offset:
        isFrom === "initialLoading" || isFrom === "PullToRefresh"
          ? 0
          : global.myState.userPayoutList.results.length,
    };
    if (!endReached) {
      await getUserPayoutList(params)
        .then(async (response) => {
          setPayoutListLoading(false);
          if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
            global.myDispatch({
              type: "USER_PAYOUT_LIST_SUCESS",
              payload: response.data,
            });
          } else {
            let updatedLIstObject = {
              page: response?.data?.page,
              results: [
                ...global.myState.userPayoutList.results,
                ...response.data?.results,
              ],
            };
            setLoadMoreloading(false);
            if (response.data?.results.length === 0) {
              endReached = true;
            }
            global.myDispatch({
              type: "USER_PAYOUT_LIST_SUCESS",
              payload: updatedLIstObject,
            });
          }

          if (isFrom === "PullToRefresh") {
            isRefreshing(false);
          }
        })
        .catch((e) => {
          setLoadMoreloading(false);
          setPayoutListLoading(false);
          console.log("PayoutList error", e.response);
          Alert.alert("Error", e.response.data.message);
        });
    } else {
      setLoadMoreloading(false);
    }
  };

  const callTransferListApi = async (isFrom: string) => {
    if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
      endReached = false;
    }
    let params = {
      offset:
        isFrom === "initialLoading" || isFrom === "PullToRefresh"
          ? 0
          : global.myState.userTransferList.results.length,
    };
    if (!endReached) {
      await getUserTransactionList(params)
        .then(async (response) => {
          setTransferListLoading(false);
          if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
            global.myDispatch({
              type: "USER_TRANSFER_LIST_SUCESS",
              payload: response.data,
            });
          } else {
            let updatedLIstObject = {
              page: response?.data?.page,
              results: [
                ...global.myState.userTransferList.results,
                ...response.data?.results,
              ],
            };
            if (response.data?.results.length === 0) {
              endReached = true;
            }
            global.myDispatch({
              type: "USER_TRANSFER_LIST_SUCESS",
              payload: updatedLIstObject,
            });
          }

          if (isFrom === "PullToRefresh") {
            setcompletedLoadrefreshing(false);
          }
        })
        .catch((e) => {
          setTransferListLoading(false);
          Alert.alert("Error", e.response.data.message);
        });
    }
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
                setTransferListLoading(true);
                callTransferListApi("initialLoading");
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
                Transfer
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: colors.white,
              backgroundColor: tabPosition === 1 ? colors.black : colors.white,
              height: deviceHeight / 25,
              marginVertical: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setTabPosition(1);
                setPayoutListLoading(true);
                callPayoutListApi("initialLoading");
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.small,
                  textAlign: "center",
                  color: tabPosition === 1 ? colors.white : "#808F99",
                  width: deviceWidth / 3.5,
                  paddingBottom: 2,
                }}
              >
                Payout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  /**
   * It will render the list of the transaction
   */
  const _renderList = ({ item, index }) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TransactionDetail", {
              isFrom: tabPosition === 1 ? "Payout" : "Transfer",
              transactionDetail: item,
            });
          }}
          style={{ flexDirection: "row", paddingVertical: 10 }}
        >
          <View
            style={{
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              backgroundColor: "#d8d8d8",
              borderRadius: 9,
            }}
          >
            <Icon size={18} name={"check"} color={colors.green} />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <View style={styles.textView}>
              <Text style={{ color: colors.lightTextGrey, fontSize: 14 }}>
                Transaction ID: #{item?.payment_id}
              </Text>
              <Text style={{ color: colors.lightTextGrey, fontSize: 14 }}>
                {moment(item.createdAt).format("ll")}
              </Text>
            </View>
            <View style={styles.textView}>
              {tabPosition === 0 ? (
                <Text style={{ fontWeight: "600" }}>
                  Load ID: #{item.load_id}
                </Text>
              ) : (
                <Text style={{ fontWeight: "600" }}>
                  {item.brand_bank ? `${item.brand_bank} - ` : null}
                  {item.last4}
                </Text>
              )}

              <Text>Paid</Text>
            </View>
            <View style={styles.textView}>
              {tabPosition === 0 ? (
                <Text style={{ fontWeight: "700" }}>
                  {item.shipperProfile?.shipperProfileDetails?.first_name}{" "}
                  {item.shipperProfile?.shipperProfileDetails?.last_name}
                </Text>
              ) : (
                <Text style={{ fontWeight: "700" }}> {""}</Text>
              )}
              {tabPosition === 0 ? (
                <Text style={{ color: "#198754", fontWeight: "bold" }}>
                  ${parseFloat(item.load_payments) / 100}
                </Text>
              ) : (
                <Text style={{ color: "#198754", fontWeight: "bold" }}>
                  ${parseFloat(item.payout_amount) / 100}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: "lightgray" }}></View>
      </View>
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
    if (tabPosition === 0) {
      callTransferListApi("loadMoreList");
    } else {
      setLoadMoreloading(true);
      callPayoutListApi("loadMoreList");
    }
  };
  const _onRefresh = () => {
    if (tabPosition === 0) {
      setcompletedLoadrefreshing(true);
      callTransferListApi("PullToRefresh");
    } else {
      isRefreshing(true);
      callPayoutListApi("PullToRefresh");
    }
  };
  const _renderFlatList = (data) => {
    return (
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={data}
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
              You have not made any transactions yet
            </Text>
          </View>
        }
      />
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        title="TRANSACTIONS"
        onPress={() => {
          navigation.goBack();
        }}
        isRightText={false}
        rightText=""
        isFrom={"PrivacyPolicy"}
        rightOnPress={() => {}}
      ></HeaderWithBack>
      <View style={{ flex: 1 }}>
        <View>{_renderTabs()}</View>
        {tabPosition === 1 ? (
          <View style={{ marginHorizontal: 10, flex: 1, paddingVertical: 10 }}>
            {payoutListLoading || refreshing ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner
                  isVisible={payoutListLoading || refreshing}
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
              _renderFlatList(global.myState.userPayoutList.results)
            )}
          </View>
        ) : (
          <View style={{ marginHorizontal: 10, flex: 1 }}>
            {transferListLoading || completedLoadrefreshing ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner
                  isVisible={transferListLoading || completedLoadrefreshing}
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
              _renderFlatList(global.myState.userTransferList.results)
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
  mainView: ViewStyle;
  tabStyles: ViewStyle;
  searchTextInputView: ViewStyle;
  searchIcon: ViewStyle;
  searchLoadStyle: ViewStyle;
  nearestTextStyle: ViewStyle;
  myLocationTextStyle: ViewStyle;
  renderListMainView: ViewStyle;
  verticalLineStyle: ViewStyle;
  mapIcon: ViewStyle;
  inProgressView: ViewStyle;
  textView: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    backgroundColor: "#F5F4F7",
    flex: 1,
  },
  mainView: {
    paddingVertical: deviceHeight / 15,
    backgroundColor: colors.white,
    paddingBottom: 10,
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
  searchTextInputView: {
    borderWidth: 1,
    borderColor: "white",
    height: deviceHeight / 18,
    borderRadius: 5,
    marginHorizontal: 15,
    backgroundColor: colors.white,
    bottom: 25,
    flexDirection: "row",
  },
  searchIcon: {
    width: 20,
    height: 20,
    position: "absolute",
    right: 10,
    alignSelf: "center",
  },
  searchLoadStyle: {
    fontSize: fontSizes.regular,
    color: "#858C97",
    alignSelf: "center",
    paddingHorizontal: 15,
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
    marginTop: 15,
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
  inProgressView: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: colors.white,
    backgroundColor: "#1C9151",
    // marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
});
export const hitSlopConfig = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 10,
};

export default TransactionList;
