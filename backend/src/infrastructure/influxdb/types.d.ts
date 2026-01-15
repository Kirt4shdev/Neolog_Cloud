export interface InfluxDBError {
  name: "InfluxDBError";
  message: string;
  severity: "ERROR";
  code: string;
  routine: string;
  line: number;
  file: string;
}
