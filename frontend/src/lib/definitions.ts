export interface Telemetry {
  elevation: number;
  velocity: number;
  voltage: number;
  current: number;
}

export interface Message {
  message: string;
  severity: number;
  time: string;
}
