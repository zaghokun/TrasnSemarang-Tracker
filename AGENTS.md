# AGENT.md — Trans Semarang Live UI/UX Competition

## 1. Project Identity

**Product name:** Trans Semarang Live  
**Working tagline:** “Tahu kapan bus tiba, tahu seberapa penuh, tanpa menebak.”

**Project type:** High-fidelity mobile UI/UX prototype for a UI/UX design competition.

**Primary output:** A polished, interactive-looking HTML prototype that can be used as the visual reference and implementation basis for recreating the final prototype in Figma.

**Important:** This project is a **design concept/prototype**, not a production transportation system. Any live GPS, ETA, occupancy, sensor, API, or operational data shown in the interface must be treated as simulated/demo data unless explicitly provided by the project team.

---

## 2. Competition Context

The prototype is being prepared for the SwitchFest 2026 UI/UX Design Competition.

The competition theme is:

> “Switching to the Future: Innovate, Design, Impact”

The guidebook requires the proposal to explain:
- Solution
- Features and Design
- Prototype
- Testing
- Target users
- Application limitations
- Platform
- Usage scenarios
- Information architecture
- Figma prototype link
- Development documentation

The proposal assessment emphasizes:
- Problem Identification: 20%
- Design Innovation: 30%
- Design Method: 30%
- Proposal Communication: 20%

The final presentation also evaluates:
- Presentation quality
- Product and solution understanding
- UI/UX design
- Innovation/value added
- Theme alignment
- Time discipline

Therefore, every design decision should be traceable to:
1. a user problem,
2. a research assumption/finding,
3. a UX rationale,
4. an interaction decision,
5. and a measurable testing objective.

---

## 3. Product Vision

Trans Semarang Live helps public-transport passengers make better decisions before and during a trip by answering three questions immediately:

1. **Di mana busnya?**
2. **Kapan bus tiba?**
3. **Seberapa penuh busnya?**

The product should feel like a **mobility assistant**, not merely a bus-tracking map.

Core experience:

> Plan → Find → Evaluate → Ride → Get notified → Arrive

The app should reduce uncertainty rather than simply display more information.

---

## 4. Primary Problem

The conceptual problem:

> Penumpang transportasi umum membutuhkan kepastian yang lebih baik mengenai posisi bus, waktu kedatangan, kepadatan kendaraan, dan pilihan rute, terutama ketika harus membuat keputusan cepat di halte.

Important situations:
- Jam sibuk
- Menunggu di halte
- Hujan
- Gangguan perjalanan
- Pengguna baru terhadap sistem transportasi
- Perpindahan koridor
- Perjalanan wisata
- Pengguna yang membutuhkan aksesibilitas lebih baik

Do not claim that these problems are statistically proven until user research confirms them. In the proposal, clearly distinguish:
- initial hypothesis,
- research finding,
- design decision.

---

## 5. Target Users

### Persona A — Mahasiswa/Pelajar
Needs:
- Fast information
- Low-cost travel
- Clear route
- Jam sibuk awareness
- Simple interface

### Persona B — Pekerja Komuter
Needs:
- Predictable arrival
- Reliable ETA
- Less crowded alternative
- Disruption information
- Saved routes

### Persona C — Wisatawan/Warga Baru
Needs:
- Easy route discovery
- Clear transfers
- Indonesian/English
- Landmark-based navigation
- Kota Lama travel mode

### Persona D — Pengguna dengan kebutuhan aksesibilitas
Includes:
- Lansia
- Ibu hamil
- Penyandang disabilitas

Needs:
- Crowding information
- Accessible stop information
- Large readable text
- Screen-reader-friendly labels
- Strong contrast
- Non-color-only status communication
- Clear walking/transfer information

Do not overclaim that every accessibility feature is supported by real infrastructure. The prototype should represent the desired UX and clearly mark data/infrastructure dependencies.

---

## 6. Core Value Proposition

> “Ketahui pilihan perjalananmu sebelum bus datang.”

The app should allow a user to decide:

> “Naik bus ini sekarang, tunggu bus berikutnya, atau pilih rute lain?”

based on:
- ETA
- Occupancy/crowding
- Route
- Transfer
- Disruptions
- Accessibility needs

---

## 7. Core Features

### P0 — Must Have

#### A. Home / Nearby
Display:
- Nearby stop
- Current location
- Next buses
- ETA range
- Crowding status
- Route/corridor
- Quick route search

#### B. Live Bus Map
Display:
- Bus positions
- Route/corridor
- Stop markers
- User location
- Status legend

#### C. Stop Detail
Display:
- Stop name
- Next buses
- ETA range
- Crowding
- Route direction
- Accessibility indicator
- Favorite button

#### D. Bus / Corridor Detail
Display:
- Current bus position
- Next stops
- ETA
- Crowding
- Route progress

#### E. Route Planner
Input:
- Origin
- Destination
- Departure preference

Output:
- Route alternatives
- Walking segment
- Bus segment
- Transfer
- ETA
- Crowding
- Estimated cost if used as demo data

#### F. Trip Mode
Display:
- Current journey
- Current stop
- Next stop
- “Turun 2 halte lagi”
- Progress
- Transfer instructions
- Notification state

### P1 — Strong Differentiators

#### G. Crowding Indicator
Use:
- icon
- text
- color
- percentage only when meaningful

Suggested conceptual levels:
- Sepi
- Sedang
- Padat

Avoid implying exact occupancy precision if the underlying data is only conceptual.

#### H. Disruption / Service Alert
Examples:
- Delay
- Route disruption
- Stop temporarily unavailable
- Heavy rain/flood warning

Important:
The prototype must distinguish between:
- transport-service disruption,
- environmental condition,
- and general city information.

#### I. Kota Lama Mode
A tourist-oriented journey mode:
- destination landmarks
- recommended stops
- walking segment
- English support
- simple route explanation

#### J. Favorites
- Favorite stops
- Home/work
- Saved routes

### P2 — Supporting Features

#### K. Settings
- Bahasa Indonesia / English
- Accessibility
- Notification preferences
- Text size
- Reduced motion preference

#### L. Offline / Weak Signal Mode
Show cached:
- route map
- schedule/reference data
- saved routes

Do not fake live tracking while offline. Clearly show:
> “Data live terakhir diperbarui …”

---

## 8. Important UX Improvement: Data Confidence

Do not present all data as equally certain.

Introduce a small “data freshness/confidence” pattern:
- Live — updated recently
- Updated X min ago
- Schedule estimate
- Data unavailable

Example:
> Live · diperbarui 20 detik lalu

or:
> Estimasi jadwal · data live tidak tersedia

This improves trust and makes the prototype more defensible during judging.

---

## 9. Important UX Improvement: ETA Honesty

Never use a false impression of exactness.

Prefer:
> 3–5 menit

over:
> 4 menit

When confidence is low:
> sekitar 5–8 menit

When data is stale:
> Jadwal berikutnya 08.20 · posisi bus belum tersedia

The design should communicate uncertainty instead of hiding it.

---

## 10. Important UX Improvement: Crowding Is a Decision Tool

Crowding is not just a statistic.

The user should be able to compare:

**Bus A**
- 3–5 min
- Sepi

**Bus B**
- 1–3 min
- Padat

This allows the user to choose:
> “Tunggu 2 menit lebih lama untuk bus yang lebih nyaman.”

The UI should make this trade-off visually obvious.

---

## 11. Accessibility Rules

Never communicate critical status with color alone.

For crowding:
- Sepi + icon + label
- Sedang + icon + label
- Padat + icon + label

Use:
- strong contrast
- minimum comfortable touch target
- readable typography
- semantic labels
- clear focus order
- screen-reader-friendly naming
- large-text option
- reduced motion option

Do not make accessibility a separate “extra” screen only. It should influence the main journey.

---

## 12. Design Direction

The visual design should be:
- modern
- clean
- civic-tech
- trustworthy
- practical
- high information clarity
- mobile-first
- suitable for outdoor use
- visually impressive enough for a competition presentation

Avoid:
- excessive gradients
- unnecessary glassmorphism
- decorative UI that reduces readability
- dashboard-like information overload
- tiny text
- map as the only visual language

The user should understand the main decision in approximately 3 seconds.

---

## 13. HTML Prototype Requirements

The implementation must start as HTML/CSS/JS before being translated into Figma.

Recommended stack:
- HTML5
- CSS3
- Vanilla JavaScript
- Optional lightweight icon library only if explicitly requested
- No backend required
- No real API required

The prototype should be runnable locally.

Recommended structure:

```text
trans-semarang-live/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── icons/
│   ├── images/
│   └── maps/
├── screens/
└── README.md
```

If a single-file prototype is more practical for rapid iteration, `index.html` may contain CSS and JS internally, but keep the code organized.

---

## 14. Prototype Screens

Target approximately 10 primary screens:

1. Onboarding
2. Home
3. Stop Detail
4. Bus/Route Detail
5. Route Search
6. Route Results
7. Active Trip
8. Notifications / Service Alerts
9. Kota Lama Mode
10. Settings / Accessibility

Optional supporting states:
- Empty state
- Loading state
- No live data state
- Weak signal/offline state
- Route disruption state
- Full/very crowded state

Do not create screens merely to increase the count. Every screen must support a user task.

---

## 15. Required Interactive Behaviors

At minimum:

### Home
- Tap nearby stop → Stop Detail
- Tap bus → Bus Detail
- Tap route search → Route Search

### Stop Detail
- Select bus → Bus Detail
- Favorite stop
- View ETA/crowding

### Route Search
- Enter/select origin
- Enter/select destination
- Show route alternatives

### Route Results
- Select route → Active Trip

### Active Trip
- Progress through stops
- Show next stop
- Trigger “turun 2 halte lagi” state

### Alerts
- Tap alert → disruption detail

### Kota Lama
- Select destination → recommended route

### Settings
- Toggle language
- Accessibility settings

---

## 16. Demo Data

Use clearly fictional/simulated values.

Example:
- Halte Simpang Lima
- Halte Kota Lama
- Halte Tembalang
- Koridor 1
- Koridor 2
- Feeder
- Bus TS-101
- ETA 3–5 menit
- Occupancy: Sepi / Sedang / Padat

If exact operational information is not provided by the team, do not present it as verified real-world data.

---

## 17. Research Method

Research plan:

### Discovery
- 10–20 potential public-transport users
- Short interview/survey
- Explore:
  - current travel behavior
  - uncertainty while waiting
  - route discovery
  - transfer confusion
  - crowding concerns
  - accessibility
  - disruption experience
  - desired notifications

### Synthesis
Create:
- affinity map
- pain points
- user needs
- opportunity statements
- personas
- journey map

### Design
Create:
- information architecture
- user flow
- wireframe
- design system
- high-fidelity prototype

### Testing
5–8 users for usability testing.

Suggested tasks:
1. Find the nearest stop.
2. Check when the next bus arrives.
3. Compare two buses based on ETA and crowding.
4. Find a route to Kota Lama.
5. Start a trip.
6. Understand when to get off.
7. Find a service disruption.
8. Enable an accessibility setting.

Measure:
- task completion
- task time
- errors
- hesitation/confusion
- qualitative feedback

Do not invent testing results. Use placeholders until actual testing is conducted.

---

## 18. Testing Documentation

For each test:

```text
Task:
User:
Expected result:
Observed behavior:
Time:
Error/confusion:
User quote:
Design implication:
Change made:
Before:
After:
```

The final proposal should show at least several meaningful iterations.

---

## 19. Information Architecture

Suggested:

```text
Trans Semarang Live
├── Home
│   ├── Nearby Stop
│   ├── Next Bus
│   ├── Live Map
│   └── Quick Route Search
│
├── Route
│   ├── Search
│   ├── Results
│   └── Route Detail
│
├── Trip
│   ├── Active Trip
│   ├── Next Stop
│   └── Trip Alerts
│
├── Explore
│   ├── Kota Lama
│   └── Places / Landmarks
│
├── Notifications
│   └── Service Alerts
│
└── Settings
    ├── Language
    ├── Accessibility
    ├── Notifications
    └── Data / Offline
```

---

## 20. Design System

The exact visual values must follow the reference design supplied by the project owner.

Define:
- color tokens
- typography scale
- spacing scale
- corner radius
- shadows
- icon style
- buttons
- chips
- cards
- bottom navigation
- map markers
- bus markers
- crowding indicators
- alert components
- accessibility components

Important:
Do not arbitrarily introduce a new visual identity if the provided reference image already establishes one.

---

## 21. Figma Translation Strategy

The HTML prototype is the visual and interaction reference.

When moving to Figma:
1. Identify reusable components.
2. Recreate design tokens.
3. Build components/variants.
4. Create screen frames.
5. Connect prototype interactions.
6. Preserve the tested information hierarchy.
7. Export screenshots for the competition proposal.
8. Keep the Figma file organized for documentation.

The HTML prototype is not the final submission unless the competition explicitly permits it.

---

## 22. Proposal Mapping

### E. Metode Pengembangan
Document:
- research
- problem discovery
- solution
- features/design
- prototype
- testing
- iteration

### F. Analisis Design
Document:
- target users
- limitations
- platform
- usage scenarios
- information architecture

### H. Lampiran
Include:
- Figma prototype link
- research documentation
- testing documentation
- iteration evidence
- relevant design assets

---

## 23. Constraints

1. Do not invent research findings.
2. Do not invent official Trans Semarang operational data.
3. Do not claim sensor infrastructure is already deployed unless verified by the team.
4. Occupancy/sensor functionality is a conceptual product requirement for the prototype.
5. Live map data is simulated.
6. ETA is simulated.
7. Do not create fake testimonials.
8. Do not use copyrighted imagery without permission.
9. Keep the product focused on passenger experience.
10. Avoid feature bloat.
11. Every major feature must connect to a user need.
12. Accessibility must be considered from the beginning.

---

## 24. Definition of Done

The prototype is ready for Figma handoff when:

- All core screens exist.
- Main user flow works.
- Navigation between screens is understandable.
- Crowding is represented consistently.
- ETA uses ranges.
- Live/stale/unavailable data states are represented.
- Disruption state exists.
- Accessibility considerations are visible.
- Kota Lama scenario is demonstrable.
- UI is visually consistent.
- Responsive/mobile layout is polished.
- No placeholder lorem ipsum remains.
- No unverified real-world claims are presented as facts.
- Screens can be captured cleanly for the proposal.
- The implementation is easy to inspect and modify.

---

## 25. Agent Behavior

When working on this project:

1. Act as a senior product designer + UX researcher + frontend prototyper.
2. Prioritize user problem over visual decoration.
3. Preserve the core concept.
4. Improve the concept when an improvement clearly strengthens UX, innovation, accessibility, researchability, or competition presentation.
5. Explain important design changes briefly.
6. Do not silently introduce unsupported factual claims.
7. Prefer realistic demo data.
8. Build mobile-first.
9. Make interactions demonstrable.
10. Optimize for Figma handoff.
11. Keep the implementation maintainable.
12. If the project owner provides an image/reference design, treat it as the primary visual reference and adapt the product content to it rather than replacing the visual direction.
