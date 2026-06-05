import {
  Clip,
  MidiClip,
  initialize,
  type ActivationContext,
  type Handle,
  type NoteDescription,
} from "@ableton-extensions/sdk";

type RootMode = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";
type ScaleMode = "minor" | "dorian" | "phrygian" | "harmonic" | "chromatic";
type EngineMode = "modular" | "pump" | "slice" | "neuro" | "stutter" | "acid";
type LengthMode = "1" | "2" | "4" | "8";
type DensityMode = "low" | "mid" | "high" | "insane";

type Settings = {
  root: number;
  scale: ScaleMode;
  octave: number;
  bars: number;
  engine: EngineMode;
  density: DensityMode;
  pump: number;
  modulation: number;
  slice: number;
  syncopation: number;
  velocity: number;
  gate: number;
  subHold: boolean;
  ghost: boolean;
  octaveJumps: boolean;
  stutter: boolean;
  randomSeed: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function roundGrid(value: number, grid = 0.01): number {
  return Math.round(value / grid) * grid;
}

function seeded(seed: number): () => number {
  let s = seed || 1984;
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}

function scaleIntervals(scale: ScaleMode): number[] {
  if (scale === "dorian") return [0, 2, 3, 5, 7, 9, 10];
  if (scale === "phrygian") return [0, 1, 3, 5, 7, 8, 10];
  if (scale === "harmonic") return [0, 2, 3, 5, 7, 8, 11];
  if (scale === "chromatic") return [0, 1, 2, 3, 5, 7, 8, 10, 11];
  return [0, 2, 3, 5, 7, 8, 10];
}

function densitySteps(density: DensityMode, engine: EngineMode): number[] {
  if (engine === "pump") {
    if (density === "low") return [0, 4, 8, 12];
    if (density === "high") return [0, 2, 4, 6, 8, 10, 12, 14];
    if (density === "insane") return [0, 1, 2, 4, 6, 7, 8, 10, 12, 13, 14];
    return [0, 2, 4, 8, 10, 12];
  }

  if (engine === "slice") {
    if (density === "low") return [0, 5, 8, 13];
    if (density === "high") return [0, 3, 5, 7, 8, 11, 13, 15];
    if (density === "insane") return [0, 1, 3, 4, 5, 7, 8, 9, 11, 13, 14, 15];
    return [0, 3, 5, 8, 11, 13];
  }

  if (engine === "stutter") {
    if (density === "low") return [0, 6, 8, 14];
    if (density === "high") return [0, 2, 3, 6, 8, 10, 11, 14];
    if (density === "insane") return [0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 14, 15];
    return [0, 2, 6, 8, 10, 14];
  }

  if (engine === "acid") {
    if (density === "low") return [0, 4, 7, 12];
    if (density === "high") return [0, 1, 4, 7, 8, 10, 12, 15];
    if (density === "insane") return [0, 1, 3, 4, 6, 7, 8, 10, 12, 13, 15];
    return [0, 1, 4, 7, 8, 12];
  }

  if (engine === "neuro") {
    if (density === "low") return [0, 3, 8, 11];
    if (density === "high") return [0, 3, 4, 6, 8, 9, 11, 14];
    if (density === "insane") return [0, 1, 3, 4, 6, 7, 8, 9, 11, 12, 14, 15];
    return [0, 3, 4, 8, 9, 11];
  }

  if (density === "low") return [0, 4, 8, 12];
  if (density === "high") return [0, 2, 4, 7, 8, 10, 12, 15];
  if (density === "insane") return [0, 1, 2, 4, 6, 7, 8, 10, 11, 12, 14, 15];
  return [0, 2, 4, 7, 8, 10, 12];
}

function degreePattern(engine: EngineMode): number[] {
  if (engine === "pump") return [0, 0, 4, 0, 2, 0, 5, 4];
  if (engine === "slice") return [0, 4, 0, 6, 2, 0, 5, 1];
  if (engine === "neuro") return [0, 5, 2, 0, 6, 1, 4, 0];
  if (engine === "stutter") return [0, 0, 0, 4, 0, 2, 0, 5];
  if (engine === "acid") return [0, 7, 4, 0, 2, 7, 4, 6];
  return [0, 0, 4, 0, 2, 0, 6, 4];
}

function generate(settings: Settings): NoteDescription[] {
  const rnd = seeded(settings.randomSeed);
  const intervals = scaleIntervals(settings.scale);
  const degrees = degreePattern(settings.engine);
  const steps = densitySteps(settings.density, settings.engine);
  const notes: NoteDescription[] = [];
  const basePitch = 24 + settings.octave * 12 + settings.root;
  const bars = clamp(settings.bars, 1, 8);
  const stepLen = 0.25;

  let index = 0;

  for (let bar = 0; bar < bars; bar++) {
    for (const step of steps) {
      const deg = degrees[(index + bar) % degrees.length] ?? 0;
      let interval = intervals[deg % intervals.length] ?? 0;

      if (settings.engine === "acid" && deg >= 7) interval += 12;
      if (settings.engine === "neuro" && rnd() < settings.modulation * 0.32) {
        interval = intervals[Math.floor(rnd() * intervals.length)] ?? interval;
      }

      let start = bar * 4 + step * stepLen;

      const pumpShift = settings.pump * 0.045;
      const sliceShift = settings.slice * 0.035;
      const syncShift = settings.syncopation * 0.055;
      if (step % 2 === 1) start += pumpShift;
      if (settings.engine === "slice" && index % 3 === 1) start -= sliceShift;
      if ((settings.engine === "modular" || settings.engine === "neuro") && index % 4 === 2) start += syncShift;
      if (settings.engine === "stutter" && index % 5 === 3) start -= syncShift * 0.55;
      if (settings.engine === "pump" && (step === 2 || step === 10)) start += settings.pump * 0.07;

      start += (rnd() - 0.5) * settings.modulation * 0.035;

      let duration = 0.18 + settings.gate * 0.26;
      if (settings.engine === "slice") duration *= index % 2 === 0 ? 0.62 : 0.38;
      if (settings.engine === "stutter") duration *= 0.45;
      if (settings.engine === "acid") duration *= 0.58;
      if (settings.subHold && index % 8 === 0) duration = 0.88 + settings.gate * 0.45;

      const pitch = clamp(basePitch + interval, 0, 127);
      const accent = (index % 4 === 0 ? 18 : index % 2 === 0 ? 8 : -5);
      const velocity = clamp(82 + settings.velocity * 36 + accent + Math.round((rnd() - 0.5) * 12), 1, 127);

      notes.push({
        pitch,
        startTime: roundGrid(Math.max(0, start)),
        duration: clamp(duration, 0.04, 1.6),
        velocity,
      });

      if (settings.ghost && rnd() < settings.modulation * 0.46 && step < 15) {
        notes.push({
          pitch,
          startTime: roundGrid(start + 0.125 + rnd() * 0.08),
          duration: 0.055 + rnd() * 0.055,
          velocity: clamp(velocity - 35, 1, 127),
          probability: 0.62 + settings.modulation * 0.2,
        });
      }

      if (settings.stutter && (settings.engine === "stutter" || rnd() < settings.slice * 0.36) && step < 15) {
        notes.push({
          pitch,
          startTime: roundGrid(start + 0.0625),
          duration: 0.045,
          velocity: clamp(velocity - 20, 1, 127),
          probability: 0.66,
        });
        notes.push({
          pitch,
          startTime: roundGrid(start + 0.125),
          duration: 0.045,
          velocity: clamp(velocity - 28, 1, 127),
          probability: 0.58,
        });
      }

      if (settings.octaveJumps && rnd() < settings.modulation * 0.22 && (index % 4 === 0 || settings.engine === "acid")) {
        notes.push({
          pitch: clamp(pitch + 12, 0, 127),
          startTime: roundGrid(start + 0.5),
          duration: 0.12,
          velocity: clamp(velocity - 24, 1, 127),
          probability: 0.48,
        });
      }

      index++;
    }
  }

  return notes.sort((a, b) => a.startTime - b.startTime || a.pitch - b.pitch);
}

function html(): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Bass Mutator by Müsslin</title>
<style>
:root{color-scheme:dark;--green:#a6ff2e;--green2:#63ff8d;--cyan:#40f8ff;--purple:#8d5cff;--bg:#05070a;--panel:rgba(9,14,19,.88);--line:rgba(166,255,46,.20);--text:#eefee7;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
*{box-sizing:border-box}
body{margin:0;width:100vw;height:100vh;overflow:hidden;background:
radial-gradient(circle at 15% 10%,rgba(166,255,46,.16),transparent 27%),
radial-gradient(circle at 90% 15%,rgba(64,248,255,.10),transparent 30%),
radial-gradient(circle at 70% 100%,rgba(141,92,255,.13),transparent 35%),
linear-gradient(145deg,#030406,#091016 58%,#040507);color:var(--text)}
.app{height:100vh;padding:16px;display:grid;grid-template-rows:64px 1fr 28px;gap:12px}
header{border:1px solid var(--line);background:rgba(5,9,13,.82);border-radius:14px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 0 30px rgba(166,255,46,.08)}
.brand{display:flex;align-items:center;gap:14px}
.sig{width:34px;height:34px;border:1px solid var(--green);border-radius:12px;display:grid;place-items:center;color:var(--green);font-weight:950;box-shadow:0 0 24px rgba(166,255,46,.18)}
h1{margin:0;font-size:22px;letter-spacing:.04em;font-weight:950} h1 span{color:var(--green)}
.sub{font-size:11px;color:#9dae94;letter-spacing:.08em;margin-top:3px;text-transform:uppercase}
.badge{color:var(--cyan);font-size:12px;letter-spacing:.18em}
.main{display:grid;grid-template-columns:300px 1fr 300px;gap:12px;min-height:0}
.panel{border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:16px;min-height:0;overflow:hidden}
.title{font-size:12px;color:var(--green);font-weight:950;letter-spacing:.14em;margin-bottom:12px;text-transform:uppercase}
.section{border-bottom:1px solid rgba(166,255,46,.09);padding-bottom:14px;margin-bottom:15px}
label{display:block;color:#b7c7ae;font-size:12px;margin:10px 0 6px;font-weight:700}
select{width:100%;height:38px;background:#070b10;border:1px solid rgba(166,255,46,.24);color:#edffe5;border-radius:8px;padding:0 10px;font-weight:800}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.slider{font-size:12px;color:#c5d4bd;margin:12px 0}.slider span{float:right;color:var(--green);font-weight:950}
input[type=range]{width:100%;accent-color:var(--green)}
.center{display:grid;grid-template-rows:58px 1fr 154px;gap:12px;min-height:0}
.topbar{border:1px solid var(--line);background:rgba(9,14,19,.88);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between}
.topbar strong{color:var(--green);letter-spacing:.12em;font-size:13px}
.random{border:1px solid rgba(64,248,255,.28);background:linear-gradient(135deg,rgba(64,248,255,.10),rgba(166,255,46,.08));color:#dff;min-width:150px;height:36px;border-radius:9px;font-weight:950;cursor:pointer}
.engine{border:1px solid var(--line);background:rgba(9,14,19,.88);border-radius:14px;padding:14px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;align-content:start}
.card{border:1px solid rgba(166,255,46,.13);background:#0d141b;border-radius:13px;padding:15px;cursor:pointer;min-height:92px;position:relative}
.card:hover{border-color:rgba(166,255,46,.55);box-shadow:0 0 22px rgba(166,255,46,.10)}
.card.active{border-color:var(--green);background:rgba(166,255,46,.09)}
.card strong{display:block;font-size:15px}.card small{display:block;color:#91a18b;margin-top:7px;line-height:1.35}
.pulse{position:absolute;right:12px;top:12px;width:12px;height:12px;border-radius:50%;background:var(--green);box-shadow:0 0 14px var(--green)}
.preview{border:1px solid var(--line);background:rgba(9,14,19,.88);border-radius:14px;padding:12px}
.piano{height:92px;background:repeating-linear-gradient(90deg,rgba(166,255,46,.06) 0 1px,transparent 1px 34px),repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 18px),#080d12;border-radius:8px;position:relative;overflow:hidden}
.piano span{position:absolute;height:7px;background:linear-gradient(90deg,var(--green),var(--cyan));border-radius:3px;box-shadow:0 0 9px rgba(166,255,46,.38)}
.toggle{border:1px solid rgba(166,255,46,.20);background:#0b1117;color:#dfffd1;border-radius:8px;padding:10px;text-align:center;font-size:12px;font-weight:900;cursor:pointer}
.toggle.active{background:rgba(166,255,46,.16);color:var(--green)}
.big{width:100%;height:76px;border:1px solid rgba(166,255,46,.44);border-radius:14px;background:linear-gradient(135deg,#1f3217,#a6ff2e);color:#071006;font-size:15px;font-weight:950;letter-spacing:.06em;box-shadow:0 0 30px rgba(166,255,46,.23);cursor:pointer}
footer{display:flex;justify-content:space-between;color:#708068;font-size:11px;letter-spacing:.10em;text-transform:uppercase}
</style>
</head>
<body>
<div class="app">
<header>
  <div class="brand"><div class="sig">M</div><div><h1>Bass Mutator <span>by Müsslin</span></h1><div class="sub">Modular slice bassline engine · pump modulation system</div></div></div>
  <div class="badge">MODULAR · SLICE · PUMP</div>
</header>

<div class="main">
<aside class="panel">
  <div class="section"><div class="title">Tonality</div>
    <div class="grid2">
      <div><label>Root</label><select id="root"><option value="0">C</option><option value="1">C#</option><option value="2">D</option><option value="3">D#</option><option value="4">E</option><option value="5">F</option><option value="6">F#</option><option value="7">G</option><option value="8">G#</option><option value="9">A</option><option value="10">A#</option><option value="11">B</option></select></div>
      <div><label>Octave</label><select id="octave"><option value="0">Sub</option><option value="1" selected>Low</option><option value="2">Mid</option></select></div>
    </div>
    <label>Scale</label><select id="scale"><option value="minor">Minor</option><option value="dorian">Dorian</option><option value="phrygian">Phrygian</option><option value="harmonic">Harmonic Minor</option><option value="chromatic">Chromatic</option></select>
    <label>Bars</label><select id="bars"><option value="1">1 bar</option><option value="2">2 bars</option><option value="4" selected>4 bars</option><option value="8">8 bars</option></select>
  </div>
  <div class="section"><div class="title">Density</div>
    <label>Density</label><select id="density"><option value="low">Low</option><option value="mid" selected>Mid</option><option value="high">High</option><option value="insane">Insane</option></select>
    <div class="slider">Velocity <span id="velocityValue">78%</span></div><input id="velocity" type="range" min="0" max="1" step="0.01" value="0.78"/>
    <div class="slider">Gate <span id="gateValue">45%</span></div><input id="gate" type="range" min="0" max="1" step="0.01" value="0.45"/>
  </div>
</aside>

<main class="center">
  <div class="topbar"><strong>ENGINE SELECTOR</strong><span id="selected">MODULAR</span><button class="random" id="random">RANDOMIZE</button></div>
  <div class="engine">
    <div class="card active" data-engine="modular"><div class="pulse"></div><strong>Modular Pulse</strong><small>sequenced slice movement, physical groove, evolving pattern</small></div>
    <div class="card" data-engine="pump"><strong>Pumping Driver</strong><small>sidechain-feel placement and strong off-grid push</small></div>
    <div class="card" data-engine="slice"><strong>Slice Cutter</strong><small>short cut notes, broken bass fragments, rhythmic holes</small></div>
    <div class="card" data-engine="neuro"><strong>Neuro Motion</strong><small>futuristic modulation, pitch sparks, mechanical feel</small></div>
    <div class="card" data-engine="stutter"><strong>Stutter Machine</strong><small>fast repeated micro-slices and chopped pressure</small></div>
    <div class="card" data-engine="acid"><strong>Acid Pump</strong><small>short upper accents, tense movement, aggressive bounce</small></div>
  </div>
  <div class="preview"><div class="title">Visual Pattern Preview</div><div class="piano" id="piano"></div></div>
</main>

<aside class="panel">
  <div class="section"><div class="title">Pump / Modulation</div>
    <div class="slider">Pump Amount <span id="pumpValue">82%</span></div><input id="pump" type="range" min="0" max="1" step="0.01" value="0.82"/>
    <div class="slider">Modulation <span id="modulationValue">65%</span></div><input id="modulation" type="range" min="0" max="1" step="0.01" value="0.65"/>
    <div class="slider">Slice Motion <span id="sliceValue">70%</span></div><input id="slice" type="range" min="0" max="1" step="0.01" value="0.70"/>
    <div class="slider">Syncopation <span id="syncopationValue">55%</span></div><input id="syncopation" type="range" min="0" max="1" step="0.01" value="0.55"/>
  </div>
  <div class="section"><div class="title">Modular Options</div>
    <div class="grid2">
      <button class="toggle active" id="subHold">Sub Hold</button>
      <button class="toggle active" id="ghost">Ghost Hits</button>
      <button class="toggle active" id="octaveJumps">Octave Jumps</button>
      <button class="toggle active" id="stutter">Stutter</button>
    </div>
  </div>
  <button class="big" id="apply">CREATE MODULAR BASSLINE</button>
</aside>
</div>
<footer><span>BASS MUTATOR BY MÜSSLIN v6</span><span>creates complete modular pump bassline · Cmd+Z to undo</span></footer>
</div>

<script>
let engine="modular";
function pct(id){const e=document.getElementById(id),v=document.getElementById(id+"Value");const u=()=>v.textContent=Math.round(Number(e.value)*100)+"%";e.addEventListener("input",u);u();}
["velocity","gate","pump","modulation","slice","syncopation"].forEach(pct);

function draw(){
  const p=document.getElementById("piano");p.innerHTML="";
  const count=engine==="stutter"?58:engine==="slice"?46:engine==="pump"?42:38;
  for(let i=0;i<count;i++){
    const s=document.createElement("span");
    s.style.left=(i*(engine==="stutter"?1.85:2.45))+"%";
    s.style.top=(10+((i*13+engine.length*9)%70))+"%";
    s.style.width=(engine==="stutter"?10:18+((i*5+engine.length)%40))+"px";
    p.appendChild(s);
  }
  document.getElementById("selected").textContent=engine.toUpperCase();
}
document.querySelectorAll(".card").forEach(c=>c.addEventListener("click",()=>{document.querySelectorAll(".card").forEach(x=>x.classList.remove("active"));c.classList.add("active");engine=c.dataset.engine;draw();}));
document.querySelectorAll(".toggle").forEach(t=>t.addEventListener("click",()=>t.classList.toggle("active")));
document.getElementById("random").addEventListener("click",()=>{
  const engines=["modular","pump","slice","neuro","stutter","acid"];
  const roots=[0,2,3,5,7,8,10];
  engine=engines[Math.floor(Math.random()*engines.length)];
  document.querySelectorAll(".card").forEach(x=>x.classList.remove("active"));
  document.querySelector('[data-engine="'+engine+'"]').classList.add("active");
  document.getElementById("root").value=String(roots[Math.floor(Math.random()*roots.length)]);
  document.getElementById("scale").value=["minor","dorian","phrygian","harmonic","chromatic"][Math.floor(Math.random()*5)];
  document.getElementById("density").value=["low","mid","high","insane"][Math.floor(Math.random()*4)];
  ["velocity","gate","pump","modulation","slice","syncopation"].forEach(id=>{document.getElementById(id).value=(Math.random()*0.75+0.2).toFixed(2);document.getElementById(id).dispatchEvent(new Event("input"));});
  draw();
});
document.getElementById("apply").addEventListener("click",()=>{
  const result=JSON.stringify({
    root:Number(document.getElementById("root").value),
    scale:document.getElementById("scale").value,
    octave:Number(document.getElementById("octave").value),
    bars:Number(document.getElementById("bars").value),
    engine,
    density:document.getElementById("density").value,
    pump:Number(document.getElementById("pump").value),
    modulation:Number(document.getElementById("modulation").value),
    slice:Number(document.getElementById("slice").value),
    syncopation:Number(document.getElementById("syncopation").value),
    velocity:Number(document.getElementById("velocity").value),
    gate:Number(document.getElementById("gate").value),
    subHold:document.getElementById("subHold").classList.contains("active"),
    ghost:document.getElementById("ghost").classList.contains("active"),
    octaveJumps:document.getElementById("octaveJumps").classList.contains("active"),
    stutter:document.getElementById("stutter").classList.contains("active"),
    randomSeed:Math.floor(Math.random()*99999)+1
  });
  if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.live){
    window.webkit.messageHandlers.live.postMessage({method:"close_and_send",params:[result]});
  } else if(window.chrome && window.chrome.webview){
    window.chrome.webview.postMessage({method:"close_and_send",params:[result]});
  } else { alert("Live bridge not available."); }
});
draw();
</script>
</body>
</html>`;
}

function dataUrl(htmlText: string): string {
  return "data:text/html;charset=utf-8," + encodeURIComponent(htmlText);
}

async function openGenerator(api: ReturnType<typeof initialize>, arg: unknown) {
  const clip = api.getObjectFromHandle(arg as Handle, Clip);

  if (!(clip instanceof MidiClip)) {
    console.error("Bass Mutator by Müsslin: selected object is not a MidiClip.");
    return;
  }

  const result = await api.ui.showModalDialog(dataUrl(html()), 1080, 730);
  if (!result) return;

  const settings = JSON.parse(result) as Settings;
  const notes = generate(settings);

  api.withinTransaction(() => {
    clip.notes = notes;
    clip.name = "Bass Mutator by Müsslin - " + settings.engine;
  });

  console.log("Bass Mutator by Müsslin: created " + notes.length + " modular pump notes.");
}

export function activate(activation: ActivationContext) {
  console.log("Bass Mutator by Müsslin: activate() called");
  const api = initialize(activation, "1.0.0");

  api.commands.registerCommand("musslin.bassmutator.open", async (arg: unknown) => {
    await openGenerator(api, arg);
  });

  api.ui.registerContextMenuAction(
    "MidiClip",
    "Bass Mutator by Müsslin…",
    "musslin.bassmutator.open"
  );

  console.log("Bass Mutator by Müsslin: menu registered on MidiClip");
}
