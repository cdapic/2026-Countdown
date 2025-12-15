export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isComplete: boolean;
}

export interface NetworkTimeResponse {
  unixtime: number;
  // We only need the unix time for sync
}

export enum AppState {
  LOADING,
  READY_TO_START, // Waiting for user interaction to enable audio
  RUNNING,
  COMPLETE
}
