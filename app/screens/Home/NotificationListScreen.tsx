/*************************************************
 * FreightRunner
 * @exports
 * @function NotificationListScreen.tsx
 * @extends Component
 * Created by Naveen E on 19/01/2023
 * Copyright © 2023 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useEffect, useState, useContext } from "react";
import {
  ViewStyle,
  Dimensions,
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import NotificationListItem from "../../components/NotificationListItem";
import HeaderWithBack from "../../components/HeaderWithBack";
import { getUserTrailerList } from "../../services/myProfileServices";
import storage from "../../helpers/storage";
import Spinner from "react-native-spinkit";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { MyContext } from "../../../app/context/MyContextProvider";
import { CustomButton } from "../../components";
import {
  getUserNotificationList,
  updateOnbardingStatus,
} from "../../services/userService";
import FastImage from "react-native-fast-image";
import { Badge } from "react-native-elements";
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

let offset;
let size = "10";
let endReached = false;
let userSelectedTab = 1;

const NotificationListScreen: React.FC<Props> = ({ navigation }) => {
  const [notificationListLoading, setnotificationListLoading] = useState(false);
  const [refreshing, isRefreshing] = useState(false);
  const [loadMoreLoading, setLoadMoreloading] = useState(false);
  const [selectedTab, setselectedTab] = useState(1); //1-Today ,2-Previous
  const global: any = useContext(MyContext);
  let _userTodayNotifications = global.myState.userTodayNotificationList;
  let _userPreviousNotificationList =
    global.myState.userPreviousNotificationList;
  let updatedpage;
  let updatedresults = [];

  useEffect(() => {
    try {
      async function fetchAPI() {
        setnotificationListLoading(true);
        callTodayNotificationApi("initialLoading");
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
    return () => {
      userSelectedTab = 1;
    };
  }, []);

  // Previous notification list
  const callPreviousNOtificationApi = async (isFrom: string) => {
    if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
      endReached = false;
    }
    let params = {
      offset:
        isFrom === "initialLoading" || isFrom === "PullToRefresh"
          ? 0
          : global.myState.userPreviousNotificationList.results.length,
      limit: 10,
      type: userSelectedTab === 1 ? "today" : "past",
    };
    console.log("---grweuyguy", params);
    if (!endReached) {
      await getUserNotificationList(params)
        .then(async (response) => {
          setnotificationListLoading(false);
          if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
            global.myDispatch({
              type: "PREVIOUS_NOTIFICATION_LIST_SUCESS",
              payload: response.data,
            });
          } else {
            let updatedLIstObject = {
              page: response?.data?.page,
              totalResults: response?.data.totalResults,
              results: [
                ...global.myState.userPreviousNotificationList.results,
                ...response.data?.results,
              ],
            };
            if (response.data?.results.length === 0) {
              endReached = true;
            }
            global.myDispatch({
              type: "PREVIOUS_NOTIFICATION_LIST_SUCESS",
              payload: updatedLIstObject,
            });
          }

          if (isFrom === "PullToRefresh") {
            isRefreshing(false);
          } else if (isFrom === "loadMoreList") {
            setLoadMoreloading(false);
          }
        })
        .catch((e) => {
          setnotificationListLoading(false);
          setLoadMoreloading(false);
          Alert.alert("Error", e.response.data.message);
        });
    } else {
      if (isFrom === "loadMoreList") {
        setLoadMoreloading(false);
      }
    }
  };
  // Today Notification list
  const callTodayNotificationApi = async (isFrom: string) => {
    if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
      endReached = false;
    }
    let params = {
      offset:
        isFrom === "initialLoading" || isFrom === "PullToRefresh"
          ? 0
          : global.myState.userTodayNotificationList.results.length,
      limit: 10,
      type: userSelectedTab === 1 ? "today" : "past",
    };
    console.log("---grweuyguy", params);
    if (!endReached) {
      await getUserNotificationList(params)
        .then(async (response) => {
          setnotificationListLoading(false);
          if (isFrom === "initialLoading" || isFrom === "PullToRefresh") {
            global.myDispatch({
              type: "TODDAY_NOTIFICATION_LIST_SUCESS",
              payload: response.data,
            });
          } else {
            let updatedLIstObject = {
              page: response?.data?.page,
              totalResults: response?.data.totalResults,
              results: [
                ...global.myState.userTodayNotificationList.results,
                ...response.data?.results,
              ],
            };
            if (response.data?.results.length === 0) {
              endReached = true;
            }
            global.myDispatch({
              type: "TODDAY_NOTIFICATION_LIST_SUCESS",
              payload: updatedLIstObject,
            });
          }

          if (isFrom === "PullToRefresh") {
            isRefreshing(false);
          } else if (isFrom === "loadMoreList") {
            setLoadMoreloading(false);
          }
        })
        .catch((e) => {
          setnotificationListLoading(false);
          setLoadMoreloading(false);
          Alert.alert("Error", e.response.data.message);
        });
    } else {
      if (isFrom === "loadMoreList") {
        setLoadMoreloading(false);
      }
    }
  };

  // Load More List
  const loadMoreList = async () => {
    setLoadMoreloading(true);

    if (selectedTab === 1) {
      callTodayNotificationApi("loadMoreList");
    } else {
      callPreviousNOtificationApi("loadMoreList");
    }
  };

  const _onRefresh = () => {
    isRefreshing(true);
    if (selectedTab === 1) {
      callTodayNotificationApi("PullToRefresh");
    } else {
      callPreviousNOtificationApi("PullToRefresh");
    }
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

  const _listEmptyComponent = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{ backgroundColor: "white", padding: 15, borderRadius: 50 }}
        >
          <FastImage
            tintColor={colors.lightGrey}
            resizeMode={"contain"}
            source={require("../../assets/images/notification.png")}
            style={{ height: 35, width: 35 }}
          />
        </View>

        <Text
          style={{
            fontSize: fontSizes.regular,
            color: colors.grey,
            marginTop: 15,
          }}
        >
          No notifications yet
        </Text>
      </View>
    );
  };
  const _renderNotificationList = () => {
    if (selectedTab === 1) {
      return (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item, index) => item.load_history_id.toString()}
          data={global.myState.userTodayNotificationList.results}
          // data={[]}
          renderItem={_renderListItem}
          // initialNumToRender={5}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.01}
          ListFooterComponent={_loadMoreLoading.bind(this)}
          ListEmptyComponent={_listEmptyComponent()}
          onEndReached={loadMoreList.bind(this)}
          refreshControl={
            <RefreshControl
              tintColor={[colors.greyLight]}
              refreshing={refreshing}
              onRefresh={_onRefresh.bind(this)}
            />
          }
        />
      );
    } else {
      return (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item, index) => item.load_history_id.toString()}
          data={global.myState.userPreviousNotificationList.results}
          // data={[]}
          renderItem={_renderListItem}
          // initialNumToRender={5}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.01}
          ListFooterComponent={_loadMoreLoading.bind(this)}
          ListEmptyComponent={_listEmptyComponent()}
          onEndReached={loadMoreList.bind(this)}
          refreshControl={
            <RefreshControl
              tintColor={[colors.greyLight]}
              refreshing={refreshing}
              onRefresh={_onRefresh.bind(this)}
            />
          }
        />
      );
    }
  };

  const _renderListItem = ({ item }) => {
    return (
      <View style={{ marginTop: 10 }}>
        <NotificationListItem
          item={item}
          isFrom={""}
          onPress={() => {
            navigation.navigate("LoadDetailScreen", {
              loadDetail: { load_id: item.load_id },
            });
          }}
        ></NotificationListItem>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        title="NOTIFICATIONS"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText=""
        isFrom={""}
        rightOnPress={() => {}}
      />
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (selectedTab !== 1) {
                  setselectedTab(1);
                  userSelectedTab = 1;
                  setnotificationListLoading(true);
                  callTodayNotificationApi("initialLoading");
                }
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: selectedTab === 1 ? "bold" : "normal" }}
              >
                Today
              </Text>
              <Badge
                badgeStyle={{ backgroundColor: "black" }}
                containerStyle={{
                  marginLeft: 5,
                }}
                textStyle={{ fontWeight: "bold" }}
                status="primary"
                value={_userTodayNotifications.totalResults}
              ></Badge>
            </TouchableOpacity>

            <View
              style={{
                height: 3,
                backgroundColor: selectedTab === 1 ? "black" : "white",
                borderTopStartRadius: 5,
                borderTopEndRadius: 5,
              }}
            ></View>
          </View>
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (selectedTab !== 2) {
                  setselectedTab(2);
                  userSelectedTab = 2;
                  setnotificationListLoading(true);
                  callPreviousNOtificationApi("initialLoading");
                }
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: selectedTab === 2 ? "bold" : "normal" }}
              >
                Previous
              </Text>
              <Badge
                badgeStyle={{ backgroundColor: "black" }}
                containerStyle={{
                  marginLeft: 5,
                }}
                textStyle={{ fontWeight: "bold" }}
                status="primary"
                value={_userPreviousNotificationList.totalResults}
              ></Badge>
            </TouchableOpacity>

            <View
              style={{
                height: 3,
                backgroundColor: selectedTab === 2 ? "black" : "white",
                borderTopStartRadius: 5,
                borderTopEndRadius: 5,
              }}
            ></View>
          </View>
        </View>

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <FastImage
            style={{
              width: 20,
              height: 20,
              marginHorizontal: 5,
            }}
            source={require("../../assets/images/double-tick-indicator.png")}
            resizeMode={FastImage.resizeMode.contain}
            // tintColor={"#0096FF"}
          ></FastImage>
          <Text style={{ fontWeight: "500", fontSize: fontSizes.small }}>
            Mark as read
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
        {notificationListLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner
              isVisible={notificationListLoading}
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
          <View style={{ flex: 1 }}>{_renderNotificationList()}</View>
        )}
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    flex: 1,
  },
});

export default NotificationListScreen;
