import { useMemo, useState } from "react";
import {
  BandReading,
  Patient,
  checkRange,
  evaluateReading,
} from "./types";

/** Placeholder data — will be replaced by the live Vitalink feed. */
const PATIENTS: Patient[] = [
  { id: "P-001", name: "A. Vermeulen", room: "Room 204" },
  { id: "P-002", name: "J. Peeters", room: "Room 207" },
  { id: "P-003", name: "M. Janssens", room: "Room 211" },
];

const READINGS: Record<string, BandReading> = {
  "P-001": {
    bandId: "VB-0042", patientId: "P-001", recordedAt: "2024-12-07T09:30:00Z",
    heartRateBpm: 78, spo2Percent: 97, skinTempC: 36.8,
  },
  "P-002": {
    bandId: "VB-0017", patientId: "P-002", recordedAt: "2024-12-07T09:30:00Z",
    heartRateBpm: 112, spo2Percent: 93, skinTempC: 38.4,
  },
  "P-003": {
    bandId: "VB-0103", patientId: "P-003", recordedAt: "2024-12-07T09:30:00Z",
    heartRateBpm: 64, spo2Percent: 99, skinTempC: 36.5,
  },
};

const card = (active: boolean): React.CSSProperties => ({
  border: `2px solid ${active ? "#e5484d" : "#2e7d32"}`,
  borderRadius: 12,
  padding: "12px 16px",
  minWidth: 220,
});

export default function App() {
  const [onlyAlerts, setOnlyAlerts] = useState(false);

  const visible = useMemo(
    () =>
      PATIENTS.filter((p) => {
        if (!onlyAlerts) return true;
        const levels = Object.values(evaluateReading(READINGS[p.id]));
        return levels.some((lvl) => lvl === "warning");
      }),
    [onlyAlerts],
  );

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>❤️ Vital_App — Vitalink dashboard</h1>
      <p>
        Live view of Vitalink band readings for the ward. Rows in red have at
        least one vital outside its safe range.
      </p>

      <label>
        <input
          type="checkbox"
          checked={onlyAlerts}
          onChange={(e) => setOnlyAlerts(e.target.checked)}
        />{" "}
        Show only patients with alerts
      </label>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
        {visible.map((patient) => {
          const reading = READINGS[patient.id];
          const levels = evaluateReading(reading);
          const hasAlert = Object.values(levels).some((l) => l === "warning");
          return (
            <section key={patient.id} style={card(!hasAlert)}>
              <h3 style={{ margin: "0 0 4px" }}>{patient.name}</h3>
              <small>
                {patient.room} · band {reading.bandId}
              </small>
              <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
                <li>
                  ❤️ {reading.heartRateBpm} bpm{" "}
                  {checkRange(reading.heartRateBpm, { min: 60, max: 100 }) === "warning" && "⚠️"}
                </li>
                <li>
                  🫁 SpO₂ {reading.spo2Percent}%{" "}
                  {checkRange(reading.spo2Percent, { min: 90, max: 100 }) === "warning" && "⚠️"}
                </li>
                <li>
                  🌡 {reading.skinTempC.toFixed(1)} °C{" "}
                  {checkRange(reading.skinTempC, { min: 36, max: 38 }) === "warning" && "⚠️"}
                </li>
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
