

## 🕹️ Controls

| Action | Keyboard | Mobile |
|--------|----------|--------|
| Move Up | `W` / `↑` | Joystick |
| Move Down | `S` / `↓` | Joystick |
| Shoot | `Space` / `Ctrl` | Shoot Button |
| Pause | `Escape` | Pause Button |

---

## 📋 Menu

- **Play** → choose difficulty (Easy / Medium / Hard)
- **How To Play** → visual guide screen
- **Exit** → close the game

High scores are saved **per difficulty** in your browser's local storage.

---

## ⚙️ Difficulty

| Level | Enemy Speed | Spawn Rate |
|-------|-------------|------------|
| 🟢 Easy | Slow | Relaxed |
| 🟡 Medium | Normal | Standard |
| 🔴 Hard | Fast | Aggressive |

---

## 📁 File Structure

```
/
├── index.html
├── game.js          ← all gameplay, UI, menu logic
├── effects.js       ← screen shake, damage flash
├── menu.js          ← (reserved for future use)
├── audio/
│   ├── shoot.mp3
│   ├── hit.mp3
│   ├── explode.mp3
│   └── click.mp3
└── visuals/
    ├── plane.png
    ├── enemy_1.png
    ├── enemy_2.png
    ├── enemy_3.png
    ├── bullet.png
    ├── cloud.png
    ├── night.png
    ├── day.jpeg
    ├── blowup.gif
    ├── shoot_button.png
    └── htp.png
```
