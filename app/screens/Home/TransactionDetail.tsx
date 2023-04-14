/*************************************************
 * FreightRunner
 * @exports
 * @function TransactionDetail.tsx
 * @extends Component
 * Created by Naveen E on 20/09/2022
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
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import HeaderWithBack from "../../components/HeaderWithBack";
import colors from "../../styles/colors";
import { fontSizes } from "../../styles/globalStyles";
import Spinner from "react-native-spinkit";
import { MyContext } from "../../context/MyContextProvider";
import moment from "moment";
type Props = { navigation: any };
const deviceHeight = Dimensions.get("window").height;

const TransactionDetail: React.FC<Props> = ({ navigation, route }) => {
  let transactionDetail = route.params?.transactionDetail;
  let isFrom: string = route.params?.isFrom;
  const [loading, setLoading] = useState(false);
  const global = useContext(MyContext);

  console.log("accountDetail", transactionDetail);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{ flex: 1 }}>
        {/* <StatusBar barStyle="dark-content" /> */}
        <HeaderWithBack
          title={isFrom.toLocaleUpperCase()}
          onPress={() => navigation.goBack()}
          isRightText={false}
          rightText=""
          rightOnPress={() => navigation.goBack()}
        />
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
          <View style={{ flex: 1, backgroundColor: "#F5F4F7" }}>
            <View style={{ paddingVertical: deviceHeight / 50 }}>
              <Text
                style={{
                  fontSize: fontSizes.medium,
                  paddingHorizontal: 20,
                  fontWeight: "700",
                  color: "black",
                }}
              >
                {"Transaction Detail"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  // marginTop: 20,
                  backgroundColor: colors.white,
                  paddingVertical: deviceHeight / 60,
                  paddingHorizontal: 20,
                }}
              >
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      color: colors.lightGrey,
                      fontWeight: "400",
                      marginBottom: 8,
                    }}
                  >
                    Transaction ID
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      color: colors.background,
                      fontWeight: "500",
                    }}
                  >
                    #{transactionDetail.payment_id}
                  </Text>
                </View>
                {transactionDetail.txn_type === "transfer" ? (
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Load ID
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      #{transactionDetail.load_id}
                    </Text>
                  </View>
                ) : null}
                {transactionDetail.txn_type === "transfer" ? (
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      Shipper Name
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      {
                        transactionDetail.shipperProfile?.shipperProfileDetails
                          ?.first_name
                      }{" "}
                      {
                        transactionDetail.shipperProfile?.shipperProfileDetails
                          ?.last_name
                      }
                    </Text>
                  </View>
                ) : null}

                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      color: colors.lightGrey,
                      fontWeight: "400",
                      marginBottom: 8,
                    }}
                  >
                    Status
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      color: colors.background,
                      fontWeight: "500",
                    }}
                  >
                    Paid
                  </Text>
                </View>

                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      color: colors.lightGrey,
                      fontWeight: "400",
                      marginBottom: 8,
                    }}
                  >
                    Amount
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      color: colors.background,
                      fontWeight: "500",
                    }}
                  >
                    $
                    {transactionDetail.txn_type === "transfer"
                      ? parseFloat(transactionDetail.load_payments) / 100
                      : parseFloat(transactionDetail.payout_amount) / 100}
                  </Text>
                </View>

                {transactionDetail.txn_type !== "transfer" ? (
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.lightGrey,
                        fontWeight: "400",
                        marginBottom: 8,
                      }}
                    >
                      {transactionDetail.payment_type === "bank_account"
                        ? "Bank"
                        : "Card"}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.regular,
                        color: colors.background,
                        fontWeight: "500",
                      }}
                    >
                      {transactionDetail.brand_bank
                        ? `${transactionDetail.brand_bank} - `
                        : null}
                      {transactionDetail.last4}
                    </Text>
                  </View>
                ) : null}

                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      color: colors.lightGrey,
                      fontWeight: "400",
                      marginBottom: 8,
                    }}
                  >
                    Date
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizes.regular,
                      color: colors.background,
                      fontWeight: "500",
                    }}
                  >
                    {moment(transactionDetail.createdAt).format("lll")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
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

export default TransactionDetail;
