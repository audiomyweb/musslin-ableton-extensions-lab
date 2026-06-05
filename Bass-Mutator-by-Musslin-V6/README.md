# Bass Mutator by Müsslin V6
## Screenshot

<p align="center">
  <img src="https://github.com/audiomyweb/musslin-ableton-extensions-lab/blob/main/screenshots/BASS%20MUTATOR.png?raw=true" width="700">
</p>

Extension Ableton Live SDK orientée basslines modulaires, slice, modulation et pumpage.

## Ce que ça crée

Cette version génère une ligne de basse complète dans le clip MIDI sélectionné.

Elle est pensée pour :
- basslines modulaires
- slices rythmiques
- sensation de sidechain / pumpage
- stutters
- ghost hits
- sub holds
- octave jumps
- variations high-tech / neuro / acid

## Installation

```bash
cd ~/Desktop/bass-mutator-by-musslin-v6
npm install
npm run start -- --live "/Applications/Ableton Live 12 Beta.app/Contents/Helpers/ExtensionHost/ExtensionHostNodeModule.node"
```

Dans Live :
- crée un clip MIDI vide ou existant
- clic droit sur le clip
- `Bass Mutator by Müsslin…`
- clique `CREATE MODULAR BASSLINE`

## Créer le .ablx

```bash
cd ~/Desktop/bass-mutator-by-musslin-v6
npm run package
```

Fichier généré sur le Bureau :

```text
bass-mutator-by-musslin-v6.ablx
```
