/*************************************************
 * FreightRunner
 * @exports
 * @function JobList.tsx
 * @extends Component
 * Created by Deepak B on 25/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
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
} from "../../services/jobService";
import { MyContext } from "../../context/MyContextProvider";
import Spinner from "react-native-spinkit";
import { Badge } from "react-native-elements";
var moment = require("moment-timezone");

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
type Props = { navigation: any };
let endReached = false;

const JobList: React.FC<Props> = ({ navigation, route }) => {
  const [tabPosition, setTabPosition] = useState(0);
  const [refreshing, isRefreshing] = useState(false);
  const [loadListsLoading, setloadListsLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreloading] = useState(false);

  const [completedLoadrefreshing, setcompletedLoadrefreshing] = useState(false);
  const [completedloadListsLoading, setcompletedloadListsLoading] =
    useState(false);
  const global = useContext(MyContext);
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

  const callLoadApi = async (isFrom: string) => {
    if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
      endReached = false;
    }
    let params = {
      offset:
        isFrom === "initialLoading" || isFrom === "PullToRefresh"
          ? 0
          : global.myState.myJobList.results.length,
    };
    if (!endReached) {
      await getMyJobsList(params)
        .then(async (response) => {
          setloadListsLoading(false);
          if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
            global.myDispatch({
              type: "USER_MY_JOB_LIST_SUCESS",
              payload: response.data,
            });
          } else {
            let updatedLIstObject = {
              page: response?.data?.page,
              results: [
                ...global.myState.myJobList.results,
                ...response.data?.results,
              ],
            };
            setLoadMoreloading(false);
            if (response.data?.results.length === 0) {
              endReached = true;
            }
            global.myDispatch({
              type: "USER_MY_JOB_LIST_SUCESS",
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
                setloadListsLoading(true);
                callLoadApi("initialLoading");
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
                Booked
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
                setcompletedloadListsLoading(true);
                callCompletedLoadApi("initialLoading");
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
                Past
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const _renderList = ({ item, index }) => {
    return (
      <View>
        {/* <Text
          style={{
            fontSize: fontSizes.small,
            marginTop: 20,
            marginHorizontal: 15,
            color: "#808F99"
          }}
        >
          Today
        </Text> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("LoadDetailScreen", { loadDetail: item });
          }}
          style={styles.renderListMainView}
        >
          <View style={{ marginHorizontal: 10 }}>
            <View
              style={{
                marginTop: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: fontSizes.small,
                      color: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    LOAD #{item.load_id}
                  </Text>
                  {/* {index === 0 ? (
                    <View style={styles.inProgressView}>
                      <Text
                        style={{
                          fontSize: fontSizes.xSmall,
                          color: "#FFFFFF",
                          textAlign: "center",
                          paddingHorizontal: 15,
                          paddingVertical: 5
                          // paddingBottom: 2
                        }}
                      >
                        In Progress
                      </Text>
                    </View>
                  ) : null} */}
                </View>

                <Text
                  style={{
                    fontSize: fontSizes.small,
                    color: "#808F99",
                    // marginTop: deviceHeight / 120
                  }}
                >
                  {item.approx_distance ? item.approx_distance : ""} mi
                </Text>
              </View>
              <View style={{}}>
                <Text
                  style={{
                    fontSize: fontSizes.medium,
                    color: "#000000",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  ${item.delivery_price}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 5,
                    color: "#808F99",
                    textAlign: "right",
                  }}
                >
                  $ {item.delivery_rate}/mi
                </Text>
              </View>
              {item.status === "inProgress" ? (
                <View style={styles.inProgressView}>
                  <Text
                    style={{
                      fontSize: fontSizes.xSmall,
                      color: "#FFFFFF",
                      textAlign: "center",
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                      // paddingBottom: 2
                    }}
                  >
                    In Progress
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={{ flexDirection: "column", marginHorizontal: 10 }}>
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
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              marginRight: 10,
              marginTop: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {tabPosition === 0 && item.messageCount ? (
                <View style={{}}>
                  <FastImage
                    tintColor={"#635FDA"}
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: item.messageCount > 99 ? 20 : 15,
                    }}
                    source={require("../../assets/images/chat.png")}
                  ></FastImage>
                  <Badge
                    badgeStyle={{ backgroundColor: "black" }}
                    containerStyle={{
                      position: "absolute",
                      top: -4,
                      right: 4,
                    }}
                    textStyle={{ fontWeight: "600" }}
                    status="primary"
                    value={item.messageCount}
                  ></Badge>
                </View>
              ) : null}

              <View
                style={[
                  styles.inProgressView,
                  {
                    backgroundColor:
                      item.status === 11
                        ? "#007bff"
                        : item.status === 3
                        ? "#5cb85c"
                        : item.status === 4
                        ? "#6c757d"
                        : item.status === 5
                        ? "#198754"
                        : item.status === 6
                        ? "#6f42c1"
                        : item.status === 7
                        ? "#198754"
                        : item.status === 8
                        ? "#1c6191"
                        : item.status === 9
                        ? "#dc3545"
                        : item.status === 12
                        ? "#007bff"
                        : item.status === 13
                        ? "#ff1a1a"
                        : "",
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: fontSizes.xSmall,
                    color: "#FFFFFF",
                    textAlign: "center",
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    // paddingBottom: 2
                  }}
                >
                  {item.status === 11
                    ? "Waiting for Approval"
                    : item.status === 3
                    ? "Accepted"
                    : item.status === 4
                    ? "On the way to pickup"
                    : item.status === 5
                    ? "Pickup completed"
                    : item.status === 6
                    ? "On the way to delivery"
                    : item.status === 7
                    ? "Shipment completed"
                    : item.status === 8
                    ? "Waiting for Shipper Payment"
                    : item.status === 9
                    ? "Cancelled by shipper"
                    : item.status === 12
                    ? "Payment Approved"
                    : item.status === 13
                    ? "Closed"
                    : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }}></View>
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
      <FRHeader title={"MY JOBS"} fontSize={fontSizes.regular} />
      <View style={{ flex: 1 }}>
        <View>{_renderTabs()}</View>
        {tabPosition === 0 ? (
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
              _renderFlatList(global.myState.myJobList.results)
            )}
          </View>
        ) : (
          <View style={{ marginHorizontal: 10, flex: 1 }}>
            {completedloadListsLoading || completedLoadrefreshing ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner
                  isVisible={
                    completedloadListsLoading || completedLoadrefreshing
                  }
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
              _renderFlatList(global.myState.myCompletedJobList.results)
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
});
export const hitSlopConfig = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 10,
};

export default JobList;
