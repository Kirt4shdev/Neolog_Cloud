import { Debug } from "@shared/utils/Debug";

export class PerformanceTimer {
  private _startTimer: bigint = 0n;
  private _stopTimer: bigint = 0n;

  public init() {
    this._startTimer = process.hrtime.bigint();

    return this;
  }

  public stop(message?: string) {
    this._stopTimer = process.hrtime.bigint();

    const duration = `${(
      Number(this._stopTimer - this._startTimer) / 1_000_000
    ).toFixed(2)}`;

    if (message) {
      Debug.info(`${duration} ms ${message}`);
    }

    return Number(this._stopTimer - this._startTimer) / 1_000_000;
  }
}
