import { useEffect, useState } from "react"
import { Text, ScrollView } from "react-native"
import { Client, Message } from "paho-mqtt"

const generateClientId = () => {
  return "client-" + Math.random().toString(36).substr(2, 9)
}

const MqttApp = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [client, setClient] = useState(null)

  useEffect(() => {
    let mqttClient: any = null
    const connectClient = () => {
      const clientId = generateClientId() // Generate a unique clientId

      mqttClient = new Client(
        "ws://ec2-3-110-47-227.ap-south-1.compute.amazonaws.com:8080/mqtt",
        clientId,
      )

      mqttClient.onConnectionLost = (responseObject: any) => {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:", responseObject.errorMessage)
        }
      }

      mqttClient.onMessageArrived = (message: any) => {
        console.log("onMessageArrived:", message.payloadString)
        setMessages((prevMessages) => [...prevMessages, message.payloadString])
      }

      mqttClient.connect({
        onSuccess: () => {
          console.log("Connected to MQTT broker")
          mqttClient.subscribe("SCA032EN")
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

    console.log("mqt", mqttClient.isConnected())

    return () => {
      if (client) {
        // @ts-ignore
        client.disconnect()
      }
    }
  }, [])

  const publishMessage = () => {
    if (client) {
      const message = new Message("Hello from React Native!")
      message.destinationName = "your/topic"
      // @ts-ignore
      client.send(message)
    }
  }

  return (
    <ScrollView>
      <Text>React Native MQTT with Paho MQTT {JSON.stringify(client)}</Text>
      {/* <Button title="Publish Message" onPress={publishMessage} /> */}
      {messages.map((msg, index) => (
        <Text key={index}>{msg}</Text>
      ))}
    </ScrollView>
  )
}

export default MqttApp
