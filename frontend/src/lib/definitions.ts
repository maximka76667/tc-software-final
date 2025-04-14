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

export interface Metric {
  label: string;
  color: string;
}

export type ArrayData<T> = {
  [Key in keyof T]: number[];
};

export type Angles = [number, number, number];
