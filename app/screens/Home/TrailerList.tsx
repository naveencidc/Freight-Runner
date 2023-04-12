/*************************************************
 * FreightRunner
 * @exports
 * @function TrailerList.tsx
 * @extends Component
 * Created by Deepak B on 9/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
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
  SafeAreaView,
} from "react-native";
import MyTruckAndTrailerList from "../../components/MyTruckAndTrailerList";
import HeaderWithBack from "../../components/HeaderWithBack";
import { getUserTrailerList } from "../../services/myProfileServices";
import storage from "../../helpers/storage";
import Spinner from "react-native-spinkit";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { MyContext } from "../../../app/context/MyContextProvider";
import { CustomButton } from "../../components";
import { updateOnbardingStatus } from "../../services/userService";
import FastImage from "react-native-fast-image";
import { navigateAndSimpleReset } from "../../utils/Utility";
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

let offset;
let size = "10";

const TrailerList: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  let isFromOnboarding = route.params?.isFromOnboarding;

  const [trailerListsLoading, setTrailerListLoading] = useState(false);
  const [refreshing, isRefreshing] = useState(false);
  const [loadMoreLoading, setLoadMoreloading] = useState(false);
  const global = useContext(MyContext);
  let _userTrailerList = global.myState.userTrailerList;
  let updatedpage;
  let updatedresults = [];

  useEffect(() => {
    try {
      async function fetchAPI() {
        setTrailerListLoading(true);
        const userDetail = await storage.get("userData");
        offset = 0;
        const userTrailerList = await getUserTrailerList(
          userDetail.user_id,
          offset,
          size
        );
        global.myDispatch({
          type: "GET_USER_TRAILER_LIST",
          payload: userTrailerList.data,
        });
        setTrailerListLoading(false);
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  }, []);

  // Load More List
  const loadMoreList = async () => {
    try {
      async function fetchAPI() {
        setLoadMoreloading(true);
        const userDetail = await storage.get("userData");
        offset = _userTrailerList.results.length;
        const userTrailerList = await getUserTrailerList(
          userDetail.user_id,
          offset,
          size
        );
        updatedpage = userTrailerList?.data.page;
        updatedresults = [
          ..._userTrailerList.results,
          ...userTrailerList.data.results,
        ];
        global.myDispatch({
          type: "LOAD_MORE_USER_TRAILER_LIST",
          payload: {
            page: updatedpage,
            results: updatedresults,
            totalResults: userTrailerList.data.totalResults,
          },
        });
        setLoadMoreloading(false);
      }
      if (_userTrailerList.totalResults > _userTrailerList.results.length) {
        fetchAPI();
      }
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  };

  const _onRefresh = () => {
    isRefreshing(false);
    try {
      async function fetchAPI() {
        setTrailerListLoading(true);
        const userDetail = await storage.get("userData");
        offset = 0;
        const userTrailerList = await getUserTrailerList(
          userDetail.user_id,
          offset,
          size
        );
        global.myDispatch({
          type: "GET_USER_TRAILER_LIST",
          payload: userTrailerList.data,
        });
        setTrailerListLoading(false);
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
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

  const _renderFlatList = () => {
    return (
      <FlatList
        keyExtractor={(item) => item.trailer_id.toString()}
        data={global.myState.userTrailerList.results}
        renderItem={_renderList}
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.01}
        ListFooterComponent={_loadMoreLoading.bind(this)}
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
  };

  const _renderList = ({ item }) => {
    return (
      <View style={{ marginTop: 17 }}>
        <MyTruckAndTrailerList
          item={item}
          truckName={item.trailerTypeDetails.trailer_type_name}
          trailerLength={item.length}
          tons={item.capacity}
          isFrom={isFrom}
          onPress={() =>
            navigation.navigate("TruckAndTrailerDetail", {
              item: item,
              isFrom: isFromOnboarding ? "TrailerList" : isFrom,
            })
          }
        ></MyTruckAndTrailerList>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <HeaderWithBack
        showOnlyHeader={false}
        title="MY TRAILER"
        onPress={async () => {
          if (isFromOnboarding) {
            await storage.remove("tokens");
            navigateAndSimpleReset("auth");
            global.myDispatch({
              type: "LOGOUT",
            });
          } else {
            navigation.goBack();
          }
        }}
        isRightText={
          global.myState.userTrailerList.results &&
          global.myState.userTrailerList.results.length
            ? true
            : false
        }
        rightText="ADD"
        isFrom={isFrom}
        rightOnPress={() =>
          navigation.navigate("RegistrationTrailerDetailScreen", {
            isFrom: "TrailerList",
          })
        }
      />
      <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
        {trailerListsLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner
              isVisible={trailerListsLoading}
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
          <View style={{ flex: 1 }}>
            {
              global.myState.userTrailerList.results &&
              global.myState.userTrailerList.results.length ? (
                _renderFlatList()
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("RegistrationTrailerDetailScreen", {
                        isFrom: "TrailerList",
                      });
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FastImage
                      tintColor={colors.background}
                      resizeMode={"contain"}
                      source={require("../../assets/images/addIcon.png")}
                      style={{
                        height: 35,
                        width: 35,
                        paddingVertical: deviceHeight / 25,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.medium,
                        color: colors.background,
                      }}
                    >
                      Click here to add your trailer
                    </Text>
                  </TouchableOpacity>
                </View>
              )
              // : (
              //   <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
              //     <Text
              //       style={{
              //         fontSize: fontSizes.medium,
              //         color: "black"
              //       }}
              //     >
              //       No Data Found
              //     </Text>
              //   </View>
              // )
            }
          </View>
        )}
      </View>
      {isFromOnboarding ? (
        <View
          style={{
            paddingHorizontal: deviceWidth / 15,
            backgroundColor: "#F5F4F7",
            paddingVertical: deviceHeight / 55,
          }}
        >
          <CustomButton
            titleColor={colors.white}
            borderColor={colors.btnColor}
            btnLoading={false}
            onPress={async () => {
              const userDetail = await storage.get("userData");
              const updateOnbardingStatusResponse = await updateOnbardingStatus(
                {
                  user_id: userDetail.user_id,
                  is_onboard_pending: 2,
                  completed_step: 2,
                  is_welcome_screen_viewed: 2,
                }
              );
              navigation.navigate("RegistrationTypesCargoDetailScreen", {
                isFromOnboarding: isFromOnboarding,
              });
            }}
            title="Next"
            backgroundColor={
              global.myState.userTrailerList.results &&
              global.myState.userTrailerList.results.length === 0
                ? "#454545"
                : "#1F1F1F"
            }
            disableButton={
              global.myState.userTrailerList.results &&
              global.myState.userTrailerList.results.length === 0
            }
          ></CustomButton>
        </View>
      ) : null}
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

export default TrailerList;
