/*************************************************
 * FreightRunner
 * @exports
 * @function LoadBoardScreen.tsx
 * @extends Component
 * Created by Naveen E on 03/01/2023
 * Copyright © 2023 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { Text } from "../../components";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import FastImage from "react-native-fast-image";
import FRHeader from "../../components/FRHeader";
import {
  getMyJobsList,
  getMyCompletedJobsList,
  getLoadBoardList,
  acceptLoad,
} from "../../services/jobService";
import { MyContext } from "../../context/MyContextProvider";
import Spinner from "react-native-spinkit";
import { Badge } from "react-native-elements";
import HeaderWithBack from "../../components/HeaderWithBack";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import StandardModal from "../../components/StandardModal";

var moment = require("moment-timezone");

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
type Props = { navigation: any };
let endReached = false;

const LoadBoardScreen: React.FC<Props> = ({ navigation }) => {
  const [tabPosition, setTabPosition] = useState(0);
  const [refreshing, isRefreshing] = useState(false);
  const [loadListsLoading, setloadListsLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreloading] = useState(false);

  const [completedLoadrefreshing, setcompletedLoadrefreshing] = useState(false);
  const [completedloadListsLoading, setcompletedloadListsLoading] =
    useState(false);
  const [currentTime, setcurrentTime] = useState(moment.utc(moment().utc()));
  const [isAcceptLoading, setisAcceptLoading] = useState(false);
  const [selectedIndex, setselectedIndex] = useState("");
  const [isShowAcceptModal, setisShowAcceptModal] = useState(false);
  const [selectedLoad, setselectedLoad] = useState();

  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);

  const global = useContext(MyContext);
  let interval: any;
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
  }, []);

  /**
   * To reset timer
   */
  useEffect(() => {
    interval = setInterval(() => {
      setcurrentTime(moment.utc(moment().utc()));
    }, 60000);
    return () => {
      console.log("Reached cleanup function");
      clearInterval(interval);
    };
  }, []);

  const callLoadApi = async (isFrom: string) => {
    if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
      endReached = false;
    }
    let params = {
      offset:
        isFrom === "initialLoading" || isFrom === "PullToRefresh"
          ? 0
          : global.myState.userLoadBoardList.results.length,
    };
    if (!endReached) {
      await getLoadBoardList(params)
        .then(async (response) => {
          setloadListsLoading(false);
          if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
            global.myDispatch({
              type: "USER_LOAD_BOARD_LIST_SUCESS",
              payload: response.data,
            });
          } else {
            let updatedLIstObject = {
              page: response?.data?.page,
              results: [
                ...global.myState.userLoadBoardList.results,
                ...response.data?.results,
              ],
            };
            setLoadMoreloading(false);
            if (response.data?.results.length === 0) {
              endReached = true;
            }
            global.myDispatch({
              type: "USER_LOAD_BOARD_LIST_SUCESS",
              payload: updatedLIstObject,
            });
          }

          if (isFrom === "PullToRefresh") {
            isRefreshing(false);
          }
        })
        .catch((e) => {
          setLoadMoreloading(false);
          setloadListsLoading(false);
          Alert.alert("Error", e.response.data.message);
        });
    } else {
      setLoadMoreloading(false);
    }
  };

  const callCompletedLoadApi = async (isFrom: string) => {
    if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
      endReached = false;
    }
    let params = {
      offset:
        isFrom === "initialLoading" || isFrom === "PullToRefresh"
          ? 0
          : global.myState.myCompletedJobList.results.length,
    };
    if (!endReached) {
      await getMyCompletedJobsList(params)
        .then(async (response) => {
          setcompletedloadListsLoading(false);
          if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
            global.myDispatch({
              type: "USER_MY_COMPLETED_JOB_LIST_SUCESS",
              payload: response.data,
            });
          } else {
            let updatedLIstObject = {
              page: response?.data?.page,
              results: [
                ...global.myState.myCompletedJobList.results,
                ...response.data?.results,
              ],
            };
            if (response.data?.results.length === 0) {
              endReached = true;
            }
            global.myDispatch({
              type: "USER_MY_COMPLETED_JOB_LIST_SUCESS",
              payload: updatedLIstObject,
            });
          }

          if (isFrom === "PullToRefresh") {
            setcompletedLoadrefreshing(false);
          }
        })
        .catch((e) => {
          setcompletedloadListsLoading(false);
          Alert.alert("Error", e.response.data.message);
        });
    }
  };

  // To show the Time Left
  //6 hr from load created time -  Loadboard time
  // 4 hr from loadboard time - Expire time
  //
  const _renderTimeLeft = (item: any) => {
    var loadExpiretime = moment.utc(
      moment(item.createdAt)
        .add(18, "hours")

        .utc()
    );
    let data = Math.abs(loadExpiretime - currentTime) / 1000;

    let hour = Math.floor(data / 3600) % 24;
    data -= hour * 3600;
    const min = Math.floor(data / 60) % 60;
    if (hour > 6 || (hour < 1 && min <= 0)) {
      return (
        <Text
          style={{
            fontSize: fontSizes.small,
            color: "#D22B2B",
            fontWeight: "bold",
          }}
        >
          Expired
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            fontSize: fontSizes.small,
            color: "#000000",
            fontWeight: "bold",
          }}
        >
          {hour}hr, {min} min
        </Text>
      );
    }
  };

  const _acceptLoad = async (loadObj: any) => {
    setisAcceptLoading(true);
    let loadListArray = global.myState.userLoadBoardList.results;

    let index = loadListArray.findIndex(
      (load) => load.load_id === loadObj.load_id
    );

    await acceptLoad({ load_id: loadObj.load_id })
      .then(async (response) => {
        setisAcceptLoading(false);
        setVisible(true);
        setMessage("Load accepted Successfully");
        if (index !== -1) {
          loadListArray.splice(index, 1);
          let updatedLIstObject = {
            page: global.myState.userLoadBoardList.page,
            results: [...loadListArray],
          };
          global.myDispatch({
            type: "USER_LOAD_BOARD_LIST_SUCESS",
            payload: updatedLIstObject,
          });
        }
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
        console.log("AcceptLoad response", response);
      })
      .catch((e) => {
        setisAcceptLoading(false);
        console.log("AcceptLoad error", e.response);
        if (e.response.data.message === "Payment methods not found") {
          Alert.alert(
            "",
            "You require to create a Stripe Connect Account to proceed, Thus would like to proceed creating a Stripe Connect Account?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("PayoutAccounts", {
                    isFrom: "STRIPE_ACCOUNT_NOT_VERIFIED",
                  });
                },
              },
            ]
          );
        } else if (e.response.data.message === "Subscription not exist") {
          Alert.alert(
            "",
            "You require to buy/purchase carrier subscription plan to proceed, Thus would like to proceed?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Premium", {
                    isFrom: "loadDetailScreen",
                  });
                },
              },
            ]
          );
        } else {
          Alert.alert("Error", e.response.data.message);
        }
      });
  };

  const _renderList = ({ item, index }) => {
    return (
      <View style={{}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("LoadDetailScreen", { loadDetail: item });
          }}
          style={[
            styles.renderListMainView,
            {
              elevation: 5,
              shadowColor: "#171717",
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: "lightgray",
              flex: 0.4,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-evenly",
              }}
            >
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: fontSizes.small,
                      color: "#000000",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    LOAD #{item.load_id}
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: fontSizes.small,
                    color: "#808F99",
                  }}
                >
                  {item.approx_distance ? item.approx_distance : ""} mi
                </Text>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: fontSizes.medium,
                    color: "#000000",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  ${item.delivery_price}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#808F99",
                  }}
                >
                  $ {item.delivery_rate}/mi
                </Text>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#808F99",
                  }}
                >
                  Time Left:
                </Text>
                {_renderTimeLeft(item)}
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View
              style={{
                flexDirection: "column",
                marginHorizontal: 10,

                paddingVertical: 15,
              }}
            >
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
                    }}
                  >
                    {item.loadCargo?.cargo_type_name}, {item.approx_weight} Lbs,{" "}
                    {item.loadTrailer?.trailer_type_name}
                    {item.loadTrailerConnection?.connection_name ? (
                      <Text>
                        {" "}
                        ({item.loadTrailerConnection?.connection_name})
                      </Text>
                    ) : null}
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
              {!item.rateApprovalDtls ? (
                <TouchableOpacity
                  onPress={() => {
                    setselectedIndex(index); // To manage particular item loading state
                    setselectedLoad(item);
                    setisShowAcceptModal(true);
                  }}
                  style={{
                    backgroundColor: "black",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginTop: 10,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isAcceptLoading && index === selectedIndex ? (
                    <Spinner
                      style={{ alignSelf: "center" }}
                      isVisible={true}
                      size={21}
                      type={"Wave"}
                      color={"white"}
                    />
                  ) : (
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Accept
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}
              {item.rateApprovalDtls ? (
                <View style={{ alignItems: "flex-end" }}>
                  <FastImage
                    tintColor={"#f76d02"}
                    style={{ height: 25, width: 25 }}
                    source={require("../../assets/images/waitingForApproval.png")}
                  ></FastImage>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
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
    if (tabPosition === 1) {
      callCompletedLoadApi("loadMoreList");
    } else {
      setLoadMoreloading(true);
      callLoadApi("loadMoreList");
    }
  };
  const _onRefresh = () => {
    if (tabPosition === 1) {
      setcompletedLoadrefreshing(true);
      callCompletedLoadApi("PullToRefresh");
    } else {
      isRefreshing(true);
      callLoadApi("PullToRefresh");
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
        initialNumToRender={10}
        ListFooterComponent={_loadMoreLoading.bind(this)}
        onEndReached={() => {
          if (
            global.myState.userLoadBoardList.totalResults >
            global.myState.userLoadBoardList.results.length
          ) {
            loadMoreList.bind(this);
          }
        }}
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
      <HeaderWithBack
        showOnlyHeader={true}
        title="LOAD BOARD"
        onPress={() => {
          navigation.goBack();
        }}
        isRightText={false}
        rightText={""}
        showCalender={false}
        rightOnPress={() => {}}
      />
      {/* <FRHeader title={"LOAD BOARD"} fontSize={fontSizes.regular} /> */}
      <View style={{ flex: 1 }}>
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
            _renderFlatList(global.myState.userLoadBoardList.results)
          )}
        </View>
      </View>
      {/* Model for accept Start here*/}
      <StandardModal
        visible={isShowAcceptModal}
        handleBackClose={() => {
          setisShowAcceptModal(false);
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
            Accept Load
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: fontSizes.medium,
              fontWeight: "400",
              marginVertical: deviceHeight / 30,
            }}
          >
            Are you sure, you want to accept this load request?
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setisShowAcceptModal(false);
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
                  setisShowAcceptModal(false);
                  _acceptLoad(selectedLoad);
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
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </StandardModal>
      {/* Model for accept Ends here*/}
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
    // borderWidth: 1,
    borderColor: "white",
    marginTop: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    flex: 1,
    flexDirection: "row",
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
});

export default LoadBoardScreen;
