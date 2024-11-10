/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import { View, Text, StyleSheet } from "react-native"

export const StatusItem = ({
  label,
  value,
  isActive,
}: {
  label: string
  value: string
  isActive: boolean
}) => (
  <View style={styles.statusItem}>
    <Text style={styles.statusLabel}>{label}</Text>
    <View style={[styles.statusValue, { backgroundColor: isActive ? "#E8F5E9" : "#FFEBEE" }]}>
      <Text style={[styles.statusText, { color: isActive ? "#00C853" : "#FF5252" }]}>{value}</Text>
      <View style={[styles.statusDot, { backgroundColor: isActive ? "#00C853" : "#FF5252" }]} />
    </View>
  </View>
)

const styles = StyleSheet.create({
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusItem: {
    gap: 5,
  },
  statusLabel: {
    color: "#666",
    fontSize: 16,
  },
  statusText: {
    fontWeight: "bold",
  },
  statusValue: {
    alignItems: "center",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
})
