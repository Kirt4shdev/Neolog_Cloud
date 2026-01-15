export interface MQTTError {
  name: "MQTTError";
  message: string;
  severity: "ERROR";
  code: string;
  routine: string;
  line: number;
  file: string;
}
