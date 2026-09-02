# TickStack

A lightweight, browser-based habit stacking timer designed to help you build momentum through short, repeatable routines. TickStack turns a set of tiny actions into a guided sequence so each task feels easier to start and easier to finish.

## Live Demo

https://tick-stack.vercel.app/

## Overview

TickStack is a single-page web app for creating a personal “stack” of habits, each with its own duration, and running them in order like a focused reset routine. It is ideal for morning routines, desk resets, hydration checks, stretch breaks, and any micro-habit workflow that benefits from timed progress.

The interface is intentionally clean and minimal, combining a habit list, timing display, sound toggle, and completion feedback in one place.

## Features

- Add custom habits with personalized durations
- Stack multiple activities into a single routine
- Track total routine time automatically
- Start, pause, resume, and reset the active stack
- Visual progress ring for the current habit step
- Completion message when the full routine is finished
- Sound toggle for chime feedback
- Live clock displaying India Standard Time
- Responsive layout for desktop and mobile screens

## Tech Stack

- HTML5
- CSS3
- JavaScript (vanilla)
- No frontend framework or build tooling required

## Project Structure

```text
.
├── index.html
├── styles.css
├── script.js
├── README.md
```

## How It Works

1. Add one or more habits with a duration in seconds.
2. The app totals the stack duration and displays it at the top.
3. Click “Start routine” to begin the sequence.
4. Each habit runs in order until the full stack is complete.
5. The app plays a subtle chime when a step is complete and again at the end.

## Getting Started

Because this project is a static web application, you do not need to install dependencies or run a build.

### Option 1: Open directly in a browser

- Open `index.html` in your browser.
- The app will load immediately and work without any setup.

### Option 2: Run a local web server (optional)

If you prefer to serve it locally:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Usage

### Add a habit

- Enter a habit name in the input field.
- Set a duration in seconds.
- Click the plus button to add it to the routine.

### Remove a habit

- Use the × button on any habit row.
- A routine cannot be reduced below one habit.

### Start a routine

- Click the main button to begin the stack.
- The timer automatically advances from one habit to the next.

### Reset the routine

- Use the “Reset stack” button to clear the current run and return the app to its starting state.

### Toggle sound

- Use the sound toggle in the top-right header to enable or disable the chime audio.

## Customization

You can easily adjust the app by editing the content in:

- `index.html` for layout and text
- `styles.css` for theme, spacing, and styling
- `script.js` for timer logic, default habits, and behavior

The default habits are defined near the top of `script.js`:

```javascript
const defaultHabits = [
  { name: 'Stretch your shoulders', seconds: 60 },
  { name: 'Wipe down your desk', seconds: 40 },
  { name: 'Drink a glass of water', seconds: 20 }
];
```

## Notes

This project is intentionally lightweight and does not include persistent storage, authentication, or backend services. It is designed as a straightforward front-end habit timer that runs locally in the browser.

## License

This project is provided for educational and personal use. If you plan to deploy or distribute it publicly, review the licensing terms of any assets or external libraries used in the project.

## Author

Built as a focused productivity and habit-building tool to encourage consistency through small, manageable actions.
