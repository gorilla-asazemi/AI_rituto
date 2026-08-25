# G-STEEL READERS - READING IMMERSION TIMER & LOG SYSTEM DESIGN SPECIFICATION

## 📌 OVERVIEW & CONCEPT

This application is a dedicated **PC Browser Reading Immersion Timer & Reading Log System** designed for 30-minute (and customizable) reading sessions.
Built with a G-SHOCK (G-STEEL / MT-G) heavy-metallic aesthetic, it removes all unnecessary decorations or complex settings, providing a clean, tough, mechanical instrument-like UI.

---

## 🛠 SYSTEM SPECIFICATIONS

### 1. Metallic Theme & UI Design
- **Appearance**: Gunmetal/steel gradients, cut bezel screws, heavy analog hands, military engravings.
- **Canvas Analog Clock**: HTML5 Canvas (2D) rendered chronograph hands, dynamic scales, and neon luminous lines.
- **Sub LCD Display**: Digital timer digits, phase indicators, and interval countdown display.

### 2. Dynamic Timer Duration
- **Default**: 30 minutes (1800 seconds).
- **Voice & Manual Customization**:
  - Set durations by voice (e.g., "5 minutes", "10 minutes", "15 minutes 30 seconds").
  - Quick preset buttons (5m / 10m / 15m / 30m) and custom minute/second input fields.

### 3. Dynamic BGM & Motivation Voice Intervals
- **Sessions > 25 Minutes (e.g., 30m)**:
  - Interval: **10-minute steps (600s)**.
- **Sessions <= 25 Minutes (e.g., 5m, 15m30s, 20m)**:
  - Interval: **5-minute steps (300s)**.
- **BGM Phases**:
  - **Phase 1**: Warm Acoustic Cafe Sound
  - **Phase 2**: Rain + Lo-Fi Jazz Ambient
  - **Phase 3**: Deep Immersion Piano + Cafe Noise

### 4. Voice Command Hands-Free Control
- Web Speech API (`SpeechRecognition`): Responds to commands like "Start", "Stop", "Reset", "Finish".

### 5. Session Complete & Reading Log Voice Input
- Complete chime sound + Voice prompt: "Great job! What book did you read today?"
- Voice-to-Text Form Auto-fill: Speech parser automatically fills Title, Author, and Page range.

### 6. Reading Log Archive & Search
- Dashboard: Monthly reading hours, total reading hours, sessions, and book count.
- Search Engine: Incremental search by Title, Author, Date, or Notes.
- Data Storage: LocalStorage persistence + JSON backup export.
