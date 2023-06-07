/*************************************************
 * FreightRunner
 * @exports
 * @function TruckList.tsx
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
import { getUserTruckList } from "../../services/myProfileServices";
import storage from "../../helpers/storage";
import Spinner from "react-native-spinkit";
import colors from "../../styles/colors";
import { MyContext } from "../../../app/context/MyContextProvider";
import { fontSizes } from "../../styles/globalStyles";
import { CustomButton } from "../../components";
import { updateOnbardingStatus } from "../../services/userService";
import FastImage from "react-native-fast-image";
import { navigateAndSimpleReset } from "../../utils/Utility";
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
let offset;
let size = "10";

const TruckList: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  let isFromOnboarding = route.params?.isFromOnboarding;

  const [truckListsLoading, setTruckListLoading] = useState(false);
  const [refreshing, isRefreshing] = useState(false);
  const [loadMoreLoading, setLoadMoreloading] = useState(false);
  const global: any = useContext(MyContext);
  let _userTruckList = global.myState.userTruckList;
  let updatedpage;
  let updatedresults = [];

  useEffect(() => {
    try {
      async function fetchAPI() {
        setTruckListLoading(true);
        const userDetail = await storage.get("userData");
        offset = 0;
        const userTruckList = await getUserTruckList(
          userDetail.user_id,
          offset,
          size
        );
        global.myDispatch({
          type: "GET_USER_TRUCK_LIST",
          payload: userTruckList.data,
        });
        setTruckListLoading(false);
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
        offset = _userTruckList.results.length;
        const userTruckList = await getUserTruckList(
          userDetail.user_id,
          offset,
          size
        );
        updatedpage = userTruckList?.data.page;
        updatedresults = [
          ..._userTruckList.results,
          ...userTruckList.data.results,
        ];
        global.myDispatch({
          type: "LOAD_MORE_USER_TRUCK_LIST",
          payload: {
            page: updatedpage,
            results: updatedresults,
            totalResults: userTruckList.data.totalResults,
          },
        });
        setLoadMoreloading(false);
      }
      if (_userTruckList.totalResults > _userTruckList.results.length) {
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
        setTruckListLoading(true);
        const userDetail = await storage.get("userData");
        offset = 0;
        const userTruckList = await getUserTruckList(
          userDetail.user_id,
          offset,
          size
        );
        global.myDispatch({
          type: "GET_USER_TRUCK_LIST",
          payload: userTruckList.data,
        });
        setTruckListLoading(false);
      }
      fetchAPI();
    } catch (error) {
      console.log("ERROR_TRUCKS");
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
    console.log("Flat List Loading", global.myState.userTruckList.results);
    return (
      <FlatList
        data={global.myState.userTruckList.results}
        renderItem={_renderList}
        initialNumToRender={5}
        keyExtractor={(item) => item.truck_id.toString()}
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
      />
    );
  };

  const _renderList = ({ index, item }) => {
    return (
      <View key={index} style={{ marginTop: 17 }}>
        <MyTruckAndTrailerList
          truckName={item.modelDetails.model_name}
          vNumber={item.vin}
          modalYear={item.year}
          brandName={item.brandDetails.brand_name}
          brandIcon={item.brandIcon}
          item={item}
          isFrom={isFromOnboarding ? "TruckList" : isFrom}
          onPress={() =>
            navigation.navigate("TruckAndTrailerDetail", {
              item: item,
              isFrom: isFromOnboarding ? "TruckList" : isFrom,
            })
          }
        ></MyTruckAndTrailerList>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderWithBack
        showOnlyHeader={false}
        title="MY TRUCK"
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
          global.myState.userTruckList.results &&
          global.myState.userTruckList.results.length
            ? true
            : false
        }
        rightText="ADD"
        isFrom={isFrom}
        rightOnPress={() =>
          isFromOnboarding
            ? navigation.navigate("RegistrationTruckDetailScreen", {
                isFrom: "TruckList",
                isFromOnboarding: isFromOnboarding,
              })
            : navigation.navigate("RegistrationTruckDetailScreen", {
                isFrom: "TruckList",
              })
        }
      ></HeaderWithBack>
      <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
        {truckListsLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner
              isVisible={truckListsLoading}
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
              global.myState.userTruckList.results &&
              global.myState.userTruckList.results.length ? (
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
                      if (isFromOnboarding) {
                        navigation.navigate("RegistrationTruckDetailScreen", {
                          isFrom: "TruckList",
                        });
                      } else {
                        navigation.navigate("RegistrationTruckDetailScreen", {
                          isFrom: "TruckList",
                        });
                      }
                    }}
                    style={{ alignItems: "center", justifyContent: "center" }}
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
                      Click here to add your truck
                    </Text>
                  </TouchableOpacity>
                </View>
              )
              // :
              // (
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
                  completed_step: 1,
                  is_welcome_screen_viewed: 2,
                }
              );
              navigation.navigate("TrailerList", { isFromOnboarding: true });
            }}
            title="Next"
            backgroundColor={
              global.myState.userTruckList.results &&
              global.myState.userTruckList.results.length === 0
                ? "#454545"
                : "#1F1F1F"
            }
            disableButton={
              global.myState.userTruckList.results &&
              global.myState.userTruckList.results.length === 0
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

export default TruckList;
