/*************************************************
 * FreightRunner
 * @exports
 * @function BusinessInfoAndAddress.tsx
 * @extends Component
 * Created by Deepak B on 9/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { useEffect, useContext, useState } from "react";
import {
  ViewStyle,
  StyleSheet,
  Text,
  View,
  TextStyle,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import { getUserBusinessInfo } from "../../services/myProfileServices";
import storage from "../../helpers/storage";
import { MyContext } from "../../context/MyContextProvider";
import Spinner from "react-native-spinkit";
import FastImage from "react-native-fast-image";
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;

const BusinessInfoAndAddress: React.FC<Props> = ({ navigation, route }) => {
  let isFrom = route.params?.isFrom;
  const global: any = useContext(MyContext);
  const [businessInfoLoading, setBusinessInfoLoading] = useState(false);
  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;

  useEffect(() => {
    try {
      async function fetchAPI() {
        setBusinessInfoLoading(true);
        const userDetail: any = await storage.get("userData");
        const userBusinessInfo = await getUserBusinessInfo(userDetail.user_id);
        global.myDispatch({
          type: "GET_USER_BUSINESS_INFO",
          payload: userBusinessInfo.data,
        });
        setBusinessInfoLoading(false);
      }
      fetchAPI();
    } catch (error) {
      console.log("EROR_TRUCKS");
    }
  }, []);
  const _userBusinessInfo = () => {
    return (
      <View style={{ backgroundColor: colors.white, marginTop: 15 }}>
        <View style={{ paddingHorizontal: 15, paddingBottom: 20 }}>
          {userProfileDetails.partnerProfileDetails.is_business === 1 ? (
            <View style={{ marginTop: 5 }}>
              <Text style={styles.headerText}>Business Entity</Text>
              <Text style={styles.subText}>
                {userProfileDetails.partnerProfileDetails.business_name}
              </Text>
            </View>
          ) : null}

          {/* <View style={{ marginTop: 5 }}>
            <Text style={styles.headerText}>SCAC Code</Text>
            <Text style={styles.subText}>{global.myState.userBusinessInfo.scac_code}</Text>
          </View> */}

          <View style={{ marginTop: 5 }}>
            <Text style={styles.headerText}>MC#</Text>
            <Text style={styles.subText}>
              {userProfileDetails.partnerProfileDetails.mc}
            </Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <Text style={styles.headerText}>US DOT#</Text>
            <Text style={styles.subText}>
              {userProfileDetails.partnerProfileDetails.us_dot}
            </Text>
          </View>
          {userProfileDetails.partnerProfileDetails.is_business === 1 ? (
            <View style={{ marginTop: 5 }}>
              <Text style={styles.headerText}>Federal ID#</Text>
              <Text style={styles.subText}>
                {userProfileDetails.partnerProfileDetails.federal_id}
              </Text>
            </View>
          ) : null}

          {/* <View style={{ marginTop: 5 }}>
            <Text style={styles.headerText}>DBA</Text>
            <Text style={styles.subText}>{global.myState.userBusinessInfo.dba}</Text>
          </View>
          <View style={{ marginTop: 5 }}>
            <Text style={styles.headerText}>CDL#</Text>
            <Text style={styles.subText}>{global.myState.userBusinessInfo.cdl}</Text>
          </View> */}
        </View>
      </View>
    );
  };

  const _userBusinessAddress = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            marginVertical: deviceHeight / 60,
            alignSelf: "flex-end",
            marginHorizontal: 15,
          }}
        >
          <FastImage
            resizeMode={"contain"}
            source={require("../../assets/images/LocationColor.png")}
            style={{ height: 20, width: 20 }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ChooseFromMap", { isFrom: isFrom });
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.small,
                color: "#1C6191",
                alignSelf: "center",
                marginLeft: 5,
              }}
            >
              Show on a Map
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: colors.white }}>
          <View style={{ paddingHorizontal: 15, paddingBottom: 20 }}>
            <View style={{ marginTop: 5 }}>
              <Text style={styles.headerText}>Address</Text>
              <Text style={styles.subText}>
                {global.myState.userBusinessInfo.address}
              </Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={styles.headerText}>Latitude</Text>
              <Text style={styles.subText}>
                {global.myState.userBusinessInfo.lat}
              </Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={styles.headerText}>Longitude</Text>
              <Text style={styles.subText}>
                {global.myState.userBusinessInfo.long}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderWithBack
        title={
          isFrom === "ProfileBusinessInfo"
            ? userProfileDetails.partnerProfileDetails.is_business === 1
              ? "BUSINESS INFO"
              : "PERSONAL INFO"
            : "BUSINESS ADDRESS"
        }
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText=""
        isFrom={isFrom}
      ></HeaderWithBack>
      <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
        {businessInfoLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner
              isVisible={businessInfoLoading}
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
        ) : isFrom === "ProfileBusinessInfo" ? (
          _userBusinessInfo()
        ) : (
          _userBusinessAddress()
        )}
      </View>
    </SafeAreaView>
  );
};

type StyleSet = {
  mainContainer: ViewStyle;
  subText: TextStyle;
  headerText: TextStyle;
  businessText: TextStyle;
};

const styles = StyleSheet.create<StyleSet>({
  mainContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: fontSizes.regular,
    color: colors.lightGrey,
    marginTop: 20,
  },
  subText: {
    fontSize: fontSizes.regular,
    color: colors.background,
    marginTop: 8,
    fontWeight: "600",
  },
  businessText: {
    fontSize: fontSizes.regular,
    color: colors.lightGrey,
  },
});

export default BusinessInfoAndAddress;
