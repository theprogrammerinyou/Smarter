import { MainsEnum, MotorControlEnum } from "@/enums"

export interface IMessageType {
  DEV_ID: string | "#"
  UID: number
  CCID: number
  FW_VERSION: string
  RSSI: number
  MAINS: MainsEnum.ON | MainsEnum.OFF
  MOTOR_STATUS: string | null
  TS: number
  MOTOR_CNTRL_MODE: MotorControlEnum.MANUAL | MotorControlEnum.AUTO
  LOAD_CURRENT: number
  OVER_VOLTAGE_TH: number
  UNDER_VOLTAGE_TH: number
  OVERLOAD_TH: number
  DRYRUN_TH: number
  BAT_VOL: number
  SAFETY_BYPASS: boolean
  MOTOR_STATE_RETENTION: number
  AUTOSWITCH: number
  type: string
}