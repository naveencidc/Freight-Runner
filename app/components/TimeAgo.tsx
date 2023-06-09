import React, { useEffect, useState } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import moment from "moment";

interface Props {
  dateTo: Date;
  updateInterval?: number;
  dateFrom?: Date;
  hideAgo?: boolean;
  style?: StyleProp<TextStyle>;
}

const TimeAgo: React.FC<Props> = ({
  dateTo,
  dateFrom,
  updateInterval = 60000,
  hideAgo = false,
  style,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!dateFrom) {
        setCurrentDate(new Date());
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [dateFrom, updateInterval]);

  return (
    <Text {...{ style }}>
      {moment(dateTo, dateFrom || currentDate).fromNow(hideAgo)}{" "}
    </Text>
  );
};

export default TimeAgo;
