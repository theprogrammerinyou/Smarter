// types/react-native-mqtt.d.ts
declare module 'react_native_mqtt' {
  export type MqttClient = {
    subscribe: (topic: string, callback?: (error: Error) => void) => void;
    publish: (topic: string, message: string, callback?: (error: Error) => void) => void;
    on: (event: 'connect' | 'message' | 'error', callback: (arg1?: any, arg2?: any) => void) => void;
    end: () => void;
  };

  export type ConnectOptions = {
    port: number;
    username?: string;
    password?: string;
  };

  export function connect(brokerUrl: string, options: ConnectOptions): MqttClient;
}