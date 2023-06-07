/*************************************************
 * FreightRunner
 * @exports
 * @function NotificationListItem.tsx
 * @extends Component
 * Created by Naveen E on 19/01/2023
 * Copyright © 2023 FreightRunner. All rights reserved.
 *************************************************/

import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import { View } from ".";
import colors from "../styles/colors";
import { fontSizes } from "../styles/globalStyles";
import LinearGradient from "react-native-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import TimeAgo from "./TimeAgo";
import moment from "moment";

const deviceHeight = Dimensions.get("window").height;

type Props = {
  isFrom: string;
  onPress(): void;
  navigation: any;
  item: any;
};

const NotificationListItem: React.FC<Props> = ({ isFrom, item, onPress }) => {
  const [loading, setLoading] = useState(false);
  const _renderText = (item) => {
    return (
      <>
        {item.bid_id && item.bid_status === 2 ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.first_name} {item.last_name}
            </Text>{" "}
            has{" "}
            <Text style={{ color: "#dc3545", fontWeight: "500" }}>
              Declined
            </Text>{" "}
            your
            <Text style={{ fontWeight: "bold" }}> Bid #{item.bid_id}</Text> for
            the <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
            .
          </Text>
        ) : item.status === 11 ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.first_name} {item.last_name}
            </Text>{" "}
            has Edited your{" "}
            <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text> and
            the Status is Changed to{" "}
            <Text style={{ color: "#007bff", fontWeight: "500" }}>
              {item.status_name}
            </Text>
            .
          </Text>
        ) : item.status === 10 ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.first_name} {item.last_name}
            </Text>{" "}
            has{" "}
            <Text style={{ color: "#198754", fontWeight: "500" }}>
              {item.status_name}
            </Text>{" "}
            your{" "}
            <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
          </Text>
        ) : item.status === 3 && item.bid_id ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.first_name} {item.last_name}
            </Text>{" "}
            has{" "}
            <Text style={{ color: "#5cb85c", fontWeight: "500" }}>
              {item.status_name}
            </Text>{" "}
            your Bid for the{" "}
            <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
          </Text>
        ) : item.status === 3 && item.rate_id ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.first_name} {item.last_name}
            </Text>{" "}
            has{" "}
            <Text style={{ color: "#5cb85c", fontWeight: "500" }}>
              {item.status_name}
            </Text>{" "}
            your Rate approval for the{" "}
            <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
          </Text>
        ) : item.status === 3 && !item.bid_id ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>FR Admin</Text> has{" "}
            <Text style={{ color: "#4e03fc", fontWeight: "500" }}>
              Assigned
            </Text>{" "}
            the <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
          </Text>
        ) : item.status === 9 ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.first_name} {item.last_name}
            </Text>{" "}
            has{" "}
            <Text style={{ color: "#dc3545", fontWeight: "500" }}>
              {item.status_name}
            </Text>{" "}
            your{" "}
            <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
          </Text>
        ) : item.status === 12 && item.status_name === "Payment approved" ? (
          <Text>
            {/* <Text style={{ fontWeight: "bold" }}>Congrats, </Text> */}
            <Text>
              <Text style={{ fontWeight: "bold" }}>
                {item.first_name} {item.last_name}
              </Text>{" "}
              has{" "}
              <Text style={{ color: "green", fontWeight: "500" }}>Paid</Text>{" "}
              for your{" "}
              <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
            </Text>
          </Text>
        ) : item.status === 12 ? (
          <Text>
            {/* <Text style={{ fontWeight: "bold" }}>Congrats, </Text> */}
            <Text>
              <Text style={{ fontWeight: "bold" }}>
                {item.first_name} {item.last_name}
              </Text>{" "}
              has{" "}
              <Text style={{ color: "green", fontWeight: "500" }}>
                {item.status_name}
              </Text>{" "}
              your{" "}
              <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
            </Text>
          </Text>
        ) : item.status === 13 ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.first_name} {item.last_name}
            </Text>{" "}
            has{" "}
            <Text style={{ color: "red", fontWeight: "500" }}>
              {item.status_name}
            </Text>{" "}
            the <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
          </Text>
        ) : item.rate_id && item.rate_status === 2 ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.first_name} {item.last_name}
            </Text>{" "}
            has{" "}
            <Text style={{ color: "#dc3545", fontWeight: "500" }}>
              Rejected
            </Text>{" "}
            your <Text style={{ fontWeight: "bold" }}>Rate approval</Text> for
            the <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
            .
          </Text>
        ) : item.status_name === "Transfer Completed" ? (
          <Text>
            <Text style={{ fontWeight: "bold" }}>Congrats, </Text>
            <Text>
              {/* <Text style={{ fontWeight: "bold" }}>
                {item.first_name} {item.last_name}
              </Text>{" "} */}
              as you have received{" "}
              <Text style={{ fontWeight: "500", color: "green" }}>
                ${item.transfer_amt}
              </Text>{" "}
              uopn completing the delivery for{" "}
              <Text style={{ fontWeight: "bold" }}>Load #{item.load_id}</Text>
            </Text>
          </Text>
        ) : (
          <Text>{item.status_name}</Text>
        )}
      </>
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        paddingRight: 15,
        paddingVertical: 10,
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 8,
        shadowOffset: { width: -2, height: 2 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: 6,
          width: 6,
          backgroundColor: "black",
          marginLeft: 10,
          marginHorizontal: 5,
          borderRadius: 3,
        }}
      ></View>
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
          }}
        >
          <FastImage
            onLoadStart={() => {
              setLoading(true);
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
            source={
              item.profile_image
                ? { uri: item.profile_image }
                : require("../assets/images/placeholder.png")
            }
            resizeMode={FastImage.resizeMode.cover}
          ></FastImage>
          {loading ? (
            <ShimmerPlaceHolder
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                position: "absolute",
              }}
              LinearGradient={LinearGradient}
            />
          ) : null}

          <View style={{ justifyContent: "center", flex: 1, marginLeft: 10 }}>
            {_renderText(item)}
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          alignItems: "flex-end",
          position: "absolute",
          right: 10,
          bottom: 5,
        }}
      >
        {
          <TimeAgo
            style={{
              color: "#858C97",
              fontSize: fontSizes.xSmall,
              fontWeight: "600",
            }}
            dateTo={moment(item.updated_at)}
          />
        }
      </View>
    </View>
  );
};

export default NotificationListItem;
