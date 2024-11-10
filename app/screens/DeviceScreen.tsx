/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { Icon } from "@/components"
import { navigate } from "@/navigators"
import { StatusItem } from "@/components/StatusItem"
import SlideButton from "rn-slide-button"
import { generateClientId } from "@/utils/generateClientId"
import { Client, Message } from "paho-mqtt"
import { IMessageType } from "@/interfaces"
import { DeviceEnum, MainsEnum, MQTT_CONFIG } from "@/enums"

export const DeviceScreen = ({ route }: { route: any }) => {
  const { deviceId, deviceName } = route.params

  const [_, setMessages] = useState<string[]>([])
  const [message, setMessage] = useState<IMessageType>({})
  const [client, setClient] = useState<any>(null)

  useEffect(() => {
    let mqttClient: any = null
    const connectClient = () => {
      const clientId = generateClientId()

      mqttClient = new Client(
        "ws://ec2-3-110-47-227.ap-south-1.compute.amazonaws.com:8080/mqtt",
        clientId,
      )

      console.log("mqtt client", mqttClient)
      mqttClient.onConnectionLost = (responseObject: any) => {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:", responseObject.errorMessage)
          handleReconnection(client)
        }
      }

      mqttClient.onMessageArrived = (message: any) => {
        console.log("onMessageArrived:", message.payloadString)
        if (message.payloadString.includes("Turning on motor - Server")) {
          setMessage({})
          setMessages([])
        } else {
          setMessages((prevMessages) => [...prevMessages, message.payloadString])
          setMessage(JSON.parse(message.payloadString))
        }
      }

      mqttClient.connect({
        onSuccess: () => {
          console.log("Connected to MQTT broker", deviceId)
          mqttClient.subscribe(deviceId)
        },
        onFailure: (error: any) => {
          console.error("Connection failed:", error)
        },
        userName: "sumit",
        password: "sumit@123",
        useSSL: false,
      })

      setClient(mqttClient)
    }

    connectClient()

    return () => {
      if (client) {
        // @ts-ignore
        client.disconnect()
      }
    }
  }, [])

  const handleReconnection = (client: any, attempt = 0) => {
    if (attempt >= MQTT_CONFIG.RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached")
      return
    }

    setTimeout(() => {
      console.log(`Attempting to reconnect... (${attempt + 1}/${MQTT_CONFIG.RECONNECT_ATTEMPTS})`)
      try {
        client.connect({
          keepAliveInterval: MQTT_CONFIG.KEEP_ALIVE_INTERVAL,
          timeout: MQTT_CONFIG.TIMEOUT,
          onSuccess: () => {
            console.log("Reconnected successfully")
          },
          onFailure: () => {
            handleReconnection(client, attempt + 1)
          },
        })
      } catch (err) {
        console.error("Reconnection error:", err)
        handleReconnection(client, attempt + 1)
      }
    }, MQTT_CONFIG.RECONNECT_DELAY)
  }

  function deviceConnectionStatus({
    timestamp,
  }: {
    timestamp: number
  }): DeviceEnum.CONNECTED | DeviceEnum.DISCONNECTED {
    const now = new Date().getTime()
    const diff = now - timestamp
    const diffMinutes = Math.floor(diff / (1000 * 60))
    return diffMinutes < 2 ? DeviceEnum.CONNECTED : DeviceEnum.DISCONNECTED
  }

  function goBack() {
    if (client) {
      client.disconnect()
      console.log("disconnected client")
    }
    navigate("Welcome")
  }

  const publishMessage = () => {
    if (!client) {
      console.error("MQTT client is not connected")
      return
    }

    if (!deviceId) {
      console.error("Device ID is not defined")
      return
    }

    if (message.MAINS === MainsEnum.OFF) {
      console.log("Please turn on the power first")
      Alert.alert("Please turn on the power first", "Power On Device", [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ])
      return
    }

    try {
      const payload = {
        MOTOR_CNTRL: message.MOTOR_STATUS === MainsEnum.ON ? "OFF" : "ON",
      }

      const mqttMessage = new Message(JSON.stringify(payload))

      mqttMessage.destinationName = deviceId
      mqttMessage.qos = 0
      mqttMessage.retained = false

      console.log("Publishing message:", {
        topic: mqttMessage.destinationName,
        payload,
      })

      client.send(mqttMessage)
      // client.disconnect()
    } catch (error) {
      console.error("Error publishing message:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={goBack} style={styles.backButton}>
        <Icon icon="back" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{deviceName}</Text>
        <Text style={styles.subtitle}>{deviceId}</Text>
      </View>

      <View style={styles.statusContainer}>
        <StatusItem
          label="Power Status"
          value={message.MAINS}
          isActive={message.MAINS === MainsEnum.ON}
        />
        <StatusItem
          label="Motor Status"
          value={message.MOTOR_STATUS || "OFF"}
          isActive={message.MOTOR_STATUS === MainsEnum.ON}
        />
        <StatusItem
          label="Device Connection"
          value={deviceConnectionStatus({ timestamp: message.TS })}
          isActive={deviceConnectionStatus({ timestamp: message.TS }) === DeviceEnum.CONNECTED}
        />
      </View>

      <View style={styles.controls}>
        <View style={styles.controlItem}>
          <Text style={styles.controlLabel}>Device Mode</Text>
          <View style={styles.controlValue}>
            <MaterialIcons name="tune" size={24} color="#666" />
            <Text style={styles.controlText}>Auto</Text>
          </View>
        </View>

        <View style={styles.controlItem}>
          <Text style={styles.controlLabel}>Schedule</Text>
          <View style={styles.controlValue}>
            <MaterialIcons name="access-time" size={24} color="#666" />
          </View>
        </View>
      </View>

      <SlideButton
        autoReset
        autoResetDelay={0}
        animation
        reverseSlideEnabled={false}
        title={
          message.MOTOR_STATUS === MainsEnum.ON
            ? "Slide to turn on motor"
            : "Slide to turn off motor"
        }
        onSlideEnd={publishMessage}
        containerStyle={{
          width: Dimensions.get("window").width - 40,
          position: "absolute",
          bottom: 20,
          right: 20,
          borderRadius: 30,
        }}
        sliderElement={<Icon icon="back" />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 20,
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  controlItem: {
    alignItems: "center",
    borderBottomColor: "#E1E1E1",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  controlLabel: {
    color: "#666",
    fontSize: 16,
  },
  controlText: {
    color: "#666",
    fontSize: 16,
  },
  controlValue: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  controls: {
    gap: 15,
    padding: 20,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#FF8F00",
    gap: 10,
    justifyContent: "center",
    marginTop: 20,
    padding: 20,
  },
  statusContainer: {
    gap: 15,
    padding: 20,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
})
