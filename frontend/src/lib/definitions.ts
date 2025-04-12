export interface Telemetry {
  elevation: number;
  voltage: number;
  current: number;
  velocity: number;
}

export interface Message {
  message: string;
  severity: number;
  time: string;
}

export type State =
  | "initial"
  | "precharging"
  | "precharged"
  | "levitating"
  | "levitated"
  | "levitation_stopping"
  | "discharging";

export type Command =
  | "precharge"
  | "discharge"
  | "start levitation"
  | "stop levitation";

export type States = {
  [S in State]: Command[];
};
