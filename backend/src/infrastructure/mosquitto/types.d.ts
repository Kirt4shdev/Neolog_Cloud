export interface MosquittoError {
  name: "MosquittoError";
  message: string;
  severity: "ERROR";
  code: string;
  routine: string;
  line: number;
  file: string;
}
