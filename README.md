# ⚔️ Shadow Log — Solo Leveling Fitness Tracker

App di tracciamento fitness locale stile Solo Leveling. Niente cloud, niente abbonamenti — tutto sul tuo PC.

## Stack

- **Frontend**: React + TypeScript + Vite + React Router + Recharts + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (file locale `backend/data/fitness.db`)

## Avvio

Apri **due terminali**:

### Terminale 1 — Backend

```bash
cd backend
npm run dev
```

Il backend gira su: http://localhost:3001

### Terminale 2 — Frontend

```bash
cd frontend
npm run dev
```

Il frontend gira su: http://localhost:5173

## Funzionalità

- 🏠 **Dashboard** — calorie di oggi, streak, livello XP, progressi giornalieri
- 🍽️ **Diario** — registra pasti con macro (proteine/carboidrati/grassi), pasti rapidi
- 💪 **Allenamenti** — registra workout con durata e calorie bruciate, preset rapidi
- 📊 **Progressi** — grafici peso e calorie nel tempo, achievements, livello
- 📅 **Storico** — tutti i giorni registrati con stato e XP ricompensa

## Database

Il database SQLite è salvato in `backend/data/fitness.db`.

Tabelle principali:
- `daily_logs` — un record per giorno (peso, calorie goal, note, mood)
- `food_entries` — pasti del giorno (colazione/pranzo/cena/snack)
- `workouts` — allenamenti del giorno
- `achievements` — badge sbloccabili

## Sistema XP e Livelli

| Azione | XP |
|--------|-----|
| Giorno registrato | +10 XP |
| Pasto inserito | +10 XP |
| Allenamento completato | +15 XP |
| Sotto obiettivo calorie | +20 XP |
| Streak ≥ 3 giorni | +10 XP bonus |
| Streak ≥ 7 giorni | +30 XP bonus |

`Livello = floor(XP_totali / 100) + 1`

## Rank

| Livello | Rank |
|---------|------|
| 1-4 | E-Rank Hunter |
| 5-9 | D-Rank Hunter |
| 10-19 | C-Rank Hunter |
| 20-34 | B-Rank Hunter |
| 35-49 | A-Rank Hunter |
| 50+ | S-Rank Hunter |
