<p align="center">
  <img src="ChatGPT%20Image%205%20juin%202026%2C%2001_45_27.png" width="300">
</p>

# Müsslin Ableton Extensions Lab

Experimental Ableton Live 12 Extensions SDK tools by **Müsslin**.

This repository is a personal music-tech laboratory focused on creative MIDI tools, bassline generation, chord generation, arpeggio creation, groove mutation and futuristic electronic workflows inside Ableton Live.

## Download

Download the latest `.ablx` files from the Releases section:

👉 https://github.com/audiomyweb/musslin-ableton-extensions-lab/releases

## About

Müsslin Ableton Extensions Lab explores the bridge between electronic music production, MIDI intelligence and visual workflow design.

The project is built around experimental tools made with the Ableton Live 12 Extensions SDK, designed to help producers create basslines, chords, arpeggios, rhythmic variations and evolving musical ideas directly inside Ableton Live.

## Extensions

### Bass Mutator by Müsslin V6

<p align="center">
  <img src="https://github.com/audiomyweb/musslin-ableton-extensions-lab/blob/main/screenshots/BASS%20MUTATOR.png?raw=true" width="700">
</p>

A MIDI bassline generator and mutation tool focused on:

- Bassline generation
- Groove mutation
- Slices
- Pump movement
- Ghost hits
- Octave jumps
- Sub-hold behavior
- Visual MIDI feedback

The goal is not to generate random notes, but to create basslines that feel musical, physical and alive.

---

### CORVEN by MÜSSLIN

<p align="center">
  <img src="https://github.com/audiomyweb/musslin-ableton-extensions-lab/blob/main/screenshots/CORVEN.png?raw=true" width="700">
</p>

An experimental MIDI arpeggio engine for Ableton Live 12 Extensions SDK.

CORVEN generates automatic MIDI arpeggios, proposes 4 musical variations, inserts the selected result directly into the active MIDI clip and provides a visual preview faithful to the real notes.

The tool is built around simple controls — Root, Style, Emotion and Length — while the internal engine manages silences, accents, octaves, velocity, note length and subtle micro-variations.

It also includes session memory, Randomize and Make Similar functions for fast creative exploration.

---

### GRAV DUCK by MÜSSLIN

<p align="center">
  <img src="https://github.com/audiomyweb/musslin-ableton-extensions-lab/blob/main/screenshots/GRAV%20DUCK.png?raw=true" width="700">
</p>

An expressive chord engine for Ableton Live 12 Extensions SDK.

GRAV DUCK generates musical chord ideas directly inside Ableton Live, using an editable piano-roll preview and creative harmonic controls.

The tool includes Root, Scale, Engine, Color, Bars, Octave, Velocity, Spread, Complexity, Express, Bass Root, Top Line, Inversions, Human Feel, Arpeggiator, Arp Rate and Arp Pattern controls.

It is designed to help producers create fast harmonic movement, emotional chord colors and usable MIDI progressions directly inside the selected MIDI clip.

GRAV DUCK is not a VST and not a Max for Live device. It is an experimental Ableton Live 12 SDK extension focused on workflow, MIDI generation, clip interaction and visual feedback.

Release planned within 24 hours.

## Musical Identity

This project is inspired by **Gravtech**, a futuristic electronic sound universe created by Müsslin.

Gravtech is physical, groovy and emotional — built around bass pressure, rhythmic movement, clean digital design and precise musical energy.

## Installation / Development

Clone the repository:

```bash
git clone https://github.com/audiomyweb/musslin-ableton-extensions-lab.git
```

Open the Bass Mutator extension folder:

```bash
cd musslin-ableton-extensions-lab/Bass-Mutator-by-Musslin-V6
```

Install dependencies:

```bash
npm install
```

Start the extension with Ableton Live 12 Beta:

```bash
npm run start -- --live "/Applications/Ableton Live 12 Beta.app/Contents/Helpers/ExtensionHost/ExtensionHostNodeModule.node"
```

Package the extension:

```bash
npm run package
```

For CORVEN:

```bash
cd ../CORVEN-by-MUSSLIN
npm install
npm run start -- --live "/Applications/Ableton Live 12 Beta.app/Contents/Helpers/ExtensionHost/ExtensionHostNodeModule.node"
```

For GRAV DUCK:

```bash
cd ../GRAV-DUCK-by-MUSSLIN
npm install
npm run start -- --live "/Applications/Ableton Live 12 Beta.app/Contents/Helpers/ExtensionHost/ExtensionHostNodeModule.node"
```

## Status

Work in progress.

These tools are experimental Ableton Live Extensions SDK projects and are currently under development.

## Author

Created by **Müsslin**  
Music producer, sound designer and creative developer.

Artist projects: Djeemax, Y4NN BERN, MÜSSLIN  
Label: RubiKod Records
## Security Note

These Ableton Live Extensions are experimental creative tools built for MIDI generation, groove design and workflow experimentation only.

They do not intentionally access browser data, passwords, personal files, SSH keys, API keys or external credentials.

They are designed to interact only with Ableton Live musical data such as clips, MIDI notes, tracks and creative parameters.

No telemetry.  
No password access.  
No browser data access.  
No external credential collection.  
No hidden background process.

As the Ableton Extensions SDK is still in public beta, users are encouraged to scan any downloaded `.ablx` file before installing it.

