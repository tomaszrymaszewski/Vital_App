/** One measurement cycle from a Vitalink band. */
export interface BandReading {
  /** Band identifier, e.g. "VB-0042". */
  readonly bandId: string;
  /** Patient the band is assigned to. */
  readonly patientId: string;
  /** ISO-8601 timestamp of the measurement. */
  readonly recordedAt: string;
  readonly heartRateBpm: number;
  readonly spo2Percent: number;
  readonly skinTempC: number;
}

/** Clinically safe ranges used for alerting. */
export interface VitalThresholds {
  readonly heartRateBpm: Range;
  readonly spo2Percent: Range;
  readonly skinTempC: Range;
}

export interface Range {
  readonly min: number;
  readonly max: number;
}

export interface Patient {
  readonly id: string;
  readonly name: string;
  readonly room: string;
}

export type AlertLevel = "ok" | "warning";

/** Default clinically safe ranges. Tune per ward/protocol as needed. */
export const DEFAULT_THRESHOLDS: VitalThresholds = {
  heartRateBpm: { min: 60, max: 100 },
  spo2Percent: { min: 90, max: 100 },
  skinTempC: { min: 36.0, max: 38.0 },
};

/** Check one value against its safe range. */
export function checkRange(value: number, range: Range): AlertLevel {
  return value >= range.min && value <= range.max ? "ok" : "warning";
}

/** Evaluate a full reading against the thresholds. */
export function evaluateReading(
  reading: BandReading,
  thresholds: VitalThresholds = DEFAULT_THRESHOLDS,
): Record<keyof Omit<BandReading, "bandId" | "patientId" | "recordedAt">, AlertLevel> {
  return {
    heartRateBpm: checkRange(reading.heartRateBpm, thresholds.heartRateBpm),
    spo2Percent: checkRange(reading.spo2Percent, thresholds.spo2Percent),
    skinTempC: checkRange(reading.skinTempC, thresholds.skinTempC),
  };
}
