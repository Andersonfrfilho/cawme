import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../screens/styles";
import type { ServiceItemProps } from "./types";

export const ServiceItem: React.FC<ServiceItemProps> = ({
  name,
  price,
  unit,
}) => {
  return (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName}>{name}</Text>
      <Text style={styles.servicePrice}>
        R$ {price.toFixed(2)} / {unit}
      </Text>
    </View>
  );
};
