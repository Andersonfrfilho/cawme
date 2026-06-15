import React from "react";
import { View, Text } from "react-native";
import { formatBRL } from "@/shared/utils/currency";
import { styles } from "../../screens/styles";
import type { ServiceItemProps } from "./types";

export const ServiceItem: React.FC<ServiceItemProps> = ({
  name,
  price,
  unit,
}) => {
  return (
    <View style={styles.serviceItem} testID="provider-service-item">
      <Text style={styles.serviceName} testID="provider-service-name">{name}</Text>
      <Text style={styles.servicePrice}>
        {formatBRL(price)} / {unit}
      </Text>
    </View>
  );
};
