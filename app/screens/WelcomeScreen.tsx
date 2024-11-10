/* eslint-disable react-native/no-color-literals */
import { navigate } from "@/navigators"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"

const COLOR_OPTIONS = [
  "#4285F4",
  "#00C853",
  "#E91E63",
  "#FF8F00",
  "#FF5252",
  "#009688",
  "#9C27B0",
  "#F44336",
  "#E040FB",
  "#607D8B",
]

export const WelcomeScreen = () => {
  const [deviceId, setDeviceId] = useState("")
  const [deviceName, setDeviceName] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0])

  function goToNextPage() {
    navigate("Device", { deviceId, deviceName })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ENTER DEVICE INFO</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Device ID <Text style={styles.infoIcon}>ⓘ</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter unique number"
            value={deviceId}
            onChangeText={setDeviceId}
          />
          {/* <TouchableOpacity style={styles.validateButton}>
            <Text style={styles.validateButtonText}>VALIDATE</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            Device Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="device name"
            value={deviceName}
            onChangeText={setDeviceName}
          />
        </View>

        <Text style={styles.label}>Colour Tag</Text>
        <View style={styles.colorGrid}>
          {COLOR_OPTIONS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} activeOpacity={1} onPress={goToNextPage}>
          <Text style={styles.addButtonText}>ADD DEVICE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    backgroundColor: "#4285F4",
    borderRadius: 8,
    padding: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    gap: 10,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 15,
  },
  cancelButtonText: {
    color: "#4285F4",
    fontWeight: "bold",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  colorOption: {
    borderRadius: 8,
    height: 50,
    width: 50,
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },
  infoIcon: {
    color: "#4285F4",
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderColor: "#E1E1E1",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: "red",
  },
  selectedColor: {
    borderColor: "#000",
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  // validateButton: {
  //   alignItems: "flex-end",
  //   justifyContent: "flex-end",
  //   marginRight: 10,
  //   marginTop: -35,
  // },
  // validateButtonText: {
  //   color: "#4285F4",
  //   fontWeight: "bold",
  // },
})
