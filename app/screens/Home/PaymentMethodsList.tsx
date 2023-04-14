/*************************************************
 * FreightRunner
 * @exports
 * @function PaymentMethodsList.tsx
 * @extends Component
 * Created by Naveen E on 06/10/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/
"use strict";

import React, { FC, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Text, View } from "../../components";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import FastImage from "react-native-fast-image";
import HeaderWithBack from "../../components/HeaderWithBack";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

type Props = any;

const PaymentMethodsList: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="PAYMENT METHODS"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText=""
        isFrom={""}
        rightOnPress={() => {}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: colors.white,
            marginTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              marginHorizontal: deviceWidth / 15,
              marginVertical: deviceHeight / 30,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("PayoutAccounts")}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <FastImage
                    style={{
                      width: 20,
                      height: 20,
                      alignSelf: "center",
                      tintColor: colors.black,
                    }}
                    source={require("../../assets/images/payout_payment.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      marginLeft: 20,
                      color: "#000000",
                    }}
                  >
                    Payout Payment Method
                  </Text>
                </View>
                <FastImage
                  style={{ width: 12, height: 12 }}
                  source={require("../../assets/images/arrow-right.png")}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Accounts")}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <FastImage
                    style={{ width: 20, height: 20, alignSelf: "center" }}
                    source={require("../../assets/images/subscription_payment.png")}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      marginLeft: 20,
                      color: "#000000",
                    }}
                  >
                    Subscription Payment Method
                  </Text>
                </View>
                <FastImage
                  style={{ width: 12, height: 12 }}
                  source={require("../../assets/images/arrow-right.png")}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type PorfileStyleSheet = {
  container: ViewStyle;
};

const styles = StyleSheet.create<PorfileStyleSheet>({
  container: {
    backgroundColor: "#F5F4F7",
    flex: 1,
  },
});

export default PaymentMethodsList;
