# TRIAGE MCI

> Offline-first PWA for managing Mass Casualty Incidents using the START triage algorithm.

GitHub: https://github.com/0xjaqbek/triage

## About

Progressive Web App for MCI management compliant with Polish Ministry of Health Procedure MZ v2.3. Digitizes three mandatory paper forms: Patient Dislocation Table, Hospital Table, and GDM Report. Runs fully offline on iOS, Android, and Windows with 7 language support.

## Key Features

- 6-step START algorithm wizard classifying patients into T1–T4 categories
- Interactive SVG body injury diagram with 9 zones and 7 injury types
- Dispatcher mode: ZRM team assignment, hospital capacity tracking
- SMS/link import for dispatcher data sharing (Base64, GSM-7 compatible)
- Re-triage with change history
- Fully offline — localStorage persistence across sessions
- 7 languages: Polish, English, Italian, French, German, Czech, Portuguese
- Installable on iOS, Android, and Windows
- Downloadable Windows .exe server for air-gapped hospital environments

## Tech Stack

HTML · JavaScript · Go · PWA · Service Worker · localStorage · SVG
