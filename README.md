<div align="center">

# Vital_App

**Real-time visualisation of [Vitalink](https://vitalink.be) band data for hospital staff.**

React · TypeScript · Vite

*Built for the Samsung Solve for Tomorrow competition.*

</div>

---

## 🏥 What is this?

Patients in hospitals increasingly wear lightweight monitoring bands instead of
bulky wired equipment. The **Vitalink band** continuously captures vital signs —
heart rate, blood oxygen saturation (SpO₂) and skin temperature — but that data
is only useful if caregivers can see it at a glance.

**Vital_App is the frontend for exactly that**: a dashboard that lets hospital
staff see, at a glance, which patients are wearing a band, what their current
vitals are, and when a reading leaves a safe range.

## ✨ Features

- 📋 **Patient overview** — one card per monitored patient with their band status
- ❤️ **Live vitals** — heart rate, SpO₂ and temperature with trend indicators
- 🚨 **Threshold alerts** — readings outside safe ranges are highlighted
- 🧩 **Typed domain model** — band data is modelled end-to-end in TypeScript
- ⚡ **Instant dev loop** — Vite for sub-second hot reload during development

> **Status:** this repository is being rebuilt on a typed TypeScript
> foundation (React + Vite). The domain model and app shell are in place;
> live data wiring and the alerting UI are on the roadmap — see
> [Roadmap](#-roadmap).

## 🛠 Tech stack

| Layer     | Choice                        |
|-----------|-------------------------------|
| Language  | TypeScript (strict mode)      |
| UI        | React 18                      |
| Tooling   | Vite                          |
| Data      | Typed domain model in `src/types.ts` |

## 🚀 Getting started

```bash
git clone https://github.com/tomaszrymaszewski/Vital_App.git
cd Vital_App
npm install
npm run dev
```

Then open the printed local URL (by default `http://localhost:5173`).

| Script           | What it does                     |
|------------------|----------------------------------|
| `npm run dev`    | Start the dev server with HMR    |
| `npm run build`  | Type-check and bundle for prod   |
| `npm run preview`| Serve the production build       |

## 📁 Project structure

```
Vital_App/
├── index.html              # App entry point
├── src/
│   ├── main.tsx            # React bootstrap
│   ├── App.tsx             # Dashboard layout (patient cards + vitals)
│   ├── types.ts            # Vitalink band domain model
│   └── ...
├── package.json
└── tsconfig.json
```

## 🔢 Domain model

Vitalink band data is modelled explicitly so the UI, any future API client and
tests all speak the same language:

```ts
/** One measurement cycle from a Vitalink band. */
export interface BandReading {
  /** Band identifier, e.g. "VB-0042". */
  readonly bandId: string;
  /** Patient the band is assigned to. */
  readonly patientId: string;
  /** ISO-8601 timestamp of the measurement. */
  readonly recordedAt: string;
  readonly heartRateBpm: number;   // expected ~ 40–180
  readonly spo2Percent: number;    // expected ~ 70–100
  readonly skinTempC: number;      // expected ~ 33–42
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
```

## 🗺 Roadmap

- [ ] Connect the dashboard to a live Vitalink data feed
- [ ] Per-patient history charts (heart rate / SpO₂ / temperature)
- [ ] Audible + visual alerting on threshold breaches
- [ ] Nurse station mode for ward displays
- [ ] Dark theme tuned for hospital lighting

## 👤 Author

**Tomasz Rymaszewski**
[github.com/tomaszrymaszewski](https://github.com/tomaszrymaszewski)

## 📄 License

[MIT](LICENSE)
