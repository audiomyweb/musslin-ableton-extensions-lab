import {
  Clip,
  MidiClip,
  initialize,
  type ActivationContext,
  type Handle,
  type NoteDescription
} from "@ableton-extensions/sdk";

type UiSettings = {
  root: string;
  style: string;
  emotion: string;
  lengthBars: 1 | 2;
};

type CorvenResult = {
  action: "insert";
  card: "A" | "B" | "C" | "D";
  ui: UiSettings;
  label: string;
  notes: NoteDescription[];
};

let lastUi: UiSettings = {
  root: "F",
  style: "Gravtech Pulse",
  emotion: "Hypnotic",
  lengthBars: 1
};

let lastCard: "A" | "B" | "C" | null = null;
let lastLabel = "No previous variation yet";

function esc(value: string): string {
  return value.replace(/[&<>'\"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[char] ?? char));
}

function makeOptions(items: string[], selected: string): string {
  return items.map((item) => `<option ${item === selected ? "selected" : ""}>${esc(item)}</option>`).join("");
}

const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const STYLES = [
  "Deep House",
  "Melodic Techno",
  "Dark Progressive",
  "Ambient Motion",
  "Minimal Groove",
  "Gravtech Pulse",
  "Cinematic Motion",
  "Minimal High-Tech Pulse",
  "Organic Melodic House",
  "Dark Melodic Techno"
];
const EMOTIONS = ["Soft", "Hopeful", "Dark", "Tense", "Euphoric", "Hypnotic"];

function makeHtml(ui: UiSettings, rememberedCard: string | null, rememberedLabel: string): string {
  const boot = JSON.stringify({
    ui,
    rememberedCard,
    rememberedLabel,
    roots: ROOTS,
    styles: STYLES,
    emotions: EMOTIONS
  }).replace(/<\//g, "<\\/");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>CORVEN By Müsslin</title>
<style>
:root{--bg:#06070b;--panel:#10131d;--panel2:#151927;--ink:#f7f8ff;--muted:#9da6ba;--line:rgba(255,255,255,.12);--cyan:#67e8f9;--violet:#a78bfa;--green:#86efac;--gold:#facc15;--red:#fb7185}
*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:radial-gradient(circle at 20% 0%,rgba(103,232,249,.18),transparent 34%),radial-gradient(circle at 90% 15%,rgba(167,139,250,.20),transparent 36%),linear-gradient(145deg,#04050a,#0a0d15 65%,#030407);overflow:hidden}.app{width:100vw;height:100vh;padding:16px;display:grid;grid-template-rows:68px 1fr 34px;gap:12px;min-width:0;min-height:0}.top{border:1px solid var(--line);border-radius:22px;background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.025));display:flex;align-items:center;justify-content:space-between;padding:0 18px;min-width:0;box-shadow:0 20px 70px rgba(0,0,0,.42)}.brand{display:flex;align-items:center;gap:14px;min-width:0}.logo{width:40px;height:40px;border-radius:15px;background:conic-gradient(from 210deg,var(--cyan),var(--violet),var(--red),var(--cyan));box-shadow:0 0 28px rgba(103,232,249,.24)}h1{font-size:24px;line-height:1;margin:0;letter-spacing:.14em;font-weight:950}.by{font-size:13px;color:var(--cyan);letter-spacing:.04em}.memory{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:430px;text-align:right}.main{min-height:0;min-width:0;display:grid;grid-template-columns:280px 1fr;gap:12px}.controls,.stage{border:1px solid var(--line);border-radius:24px;background:rgba(15,18,29,.94);box-shadow:0 20px 70px rgba(0,0,0,.44);min-height:0;min-width:0}.controls{padding:16px;display:flex;flex-direction:column;gap:14px;overflow:hidden}.smallTitle{font-size:12px;text-transform:uppercase;letter-spacing:.18em;color:var(--cyan);font-weight:950}.hint{font-size:12px;line-height:1.42;color:var(--muted);margin-top:-6px}.field{display:grid;gap:7px}label{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);font-weight:900}select{width:100%;height:44px;border-radius:15px;border:1px solid var(--line);background:#090d17;color:var(--ink);padding:0 12px;font-size:13px;outline:none}.length{display:grid;grid-template-columns:1fr 1fr;gap:8px}.length button,.random{height:44px;border-radius:15px;border:1px solid var(--line);background:#090d17;color:var(--ink);font-weight:950;cursor:pointer}.length button.active{border-color:rgba(103,232,249,.65);background:linear-gradient(135deg,rgba(103,232,249,.28),rgba(167,139,250,.20))}.random{height:56px;border:0;color:#041016;background:linear-gradient(135deg,var(--cyan),var(--violet));box-shadow:0 0 28px rgba(103,232,249,.18);letter-spacing:.08em}.auto{margin-top:auto;border:1px solid var(--line);border-radius:18px;padding:12px;background:rgba(0,0,0,.18);font-size:12px;color:var(--muted);line-height:1.5}.stage{padding:16px;display:grid;grid-template-rows:auto 1fr;gap:12px;overflow:hidden}.stageTop{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.stageTop h2{margin:0;font-size:18px;letter-spacing:.08em}.stageTop p{margin:4px 0 0;color:var(--muted);font-size:12px}.grid{min-height:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;overflow:hidden}.card{position:relative;min-width:0;min-height:0;border:1px solid var(--line);border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.025));padding:13px;display:grid;grid-template-rows:auto auto 1fr auto;gap:9px;cursor:pointer;overflow:hidden}.card:hover,.card.selected{border-color:rgba(103,232,249,.65);box-shadow:0 0 30px rgba(103,232,249,.12)}.card[data-card="D"]{border-color:rgba(250,204,21,.34);background:linear-gradient(180deg,rgba(250,204,21,.09),rgba(255,255,255,.025))}.k{font-size:11px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;font-weight:950}.name{font-size:17px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.desc{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.roll{position:relative;height:185px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:repeating-linear-gradient(to right,rgba(255,255,255,.065) 0 1px,transparent 1px 12.5%),repeating-linear-gradient(to bottom,rgba(255,255,255,.045) 0 1px,transparent 1px 18px),linear-gradient(180deg,#070a12,#090d17);overflow:hidden}.barline{position:absolute;top:0;bottom:0;width:1px;background:rgba(255,255,255,.20)}.note{position:absolute;height:8px;min-width:7px;border-radius:999px;background:linear-gradient(90deg,var(--cyan),var(--violet));box-shadow:0 0 12px rgba(103,232,249,.35)}.card[data-card="B"] .note{background:linear-gradient(90deg,#60a5fa,#a78bfa)}.card[data-card="C"] .note{background:linear-gradient(90deg,#86efac,#67e8f9)}.card[data-card="D"] .note{background:linear-gradient(90deg,#facc15,#fb7185)}.meta{display:flex;gap:6px;flex-wrap:wrap;align-content:flex-start;min-height:50px}.meta span{font-size:10px;color:#dbe3f7;border:1px solid rgba(255,255,255,.10);border-radius:999px;padding:4px 7px;background:rgba(0,0,0,.22);max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.send{height:42px;border-radius:15px;border:0;background:linear-gradient(135deg,rgba(103,232,249,.95),rgba(167,139,250,.95));color:#041016;font-weight:950;letter-spacing:.04em}.card[data-card="D"] .send{background:linear-gradient(135deg,#facc15,#fb7185)}.footer{color:var(--muted);font-size:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;overflow:hidden}.footer b{color:var(--cyan)}@media(max-width:980px){.main{grid-template-columns:250px 1fr}.grid{grid-template-columns:repeat(2,minmax(0,1fr));overflow:auto}.roll{height:150px}}
</style>
</head>
<body>
<div class="app">
  <header class="top">
    <div class="brand"><div class="logo"></div><div><h1>CORVEN <span class="by">By Müsslin</span></h1><div class="hint">Intelligent MIDI arpeggio engine</div></div></div>
    <div id="memory" class="memory">Memory ready</div>
  </header>
  <main class="main">
    <section class="controls">
      <div class="smallTitle">4 controls only</div>
      <div class="hint">Set the musical direction. CORVEN handles scale, tuning, groove, notes, velocity, length and movement internally.</div>
      <div class="field"><label>Root</label><select id="root">${makeOptions(ROOTS, ui.root)}</select></div>
      <div class="field"><label>Style</label><select id="style">${makeOptions(STYLES, ui.style)}</select></div>
      <div class="field"><label>Emotion</label><select id="emotion">${makeOptions(EMOTIONS, ui.emotion)}</select></div>
      <div class="field"><label>Length</label><div class="length"><button data-length="1" class="${ui.lengthBars === 1 ? "active" : ""}">1 BAR</button><button data-length="2" class="${ui.lengthBars === 2 ? "active" : ""}">2 BARS</button></div></div>
      <button id="randomize" class="random">RANDOMIZE</button>
      <div class="auto"><b style="color:var(--cyan)">Memory:</b> when you reopen CORVEN, your last settings come back. Variation D creates a similar idea based on the last chosen variation.</div>
    </section>
    <section class="stage">
      <div class="stageTop"><div><h2>Click a variation to write it into the selected MIDI clip</h2><p>The mini piano-roll is generated from the exact notes that will be inserted.</p></div></div>
      <div class="grid">
        <article class="card selected" data-card="A"><div class="k">Variation A</div><div><div class="name">Main Flow</div><div class="desc">balanced musical phrase</div></div><div class="roll"></div><div class="meta"></div><button class="send">SEND TO MIDI CLIP</button></article>
        <article class="card" data-card="B"><div class="k">Variation B</div><div><div class="name">Energy Lift</div><div class="desc">more rhythmic and forward</div></div><div class="roll"></div><div class="meta"></div><button class="send">SEND TO MIDI CLIP</button></article>
        <article class="card" data-card="C"><div class="k">Variation C</div><div><div class="name">Upper Motion</div><div class="desc">wider and more melodic</div></div><div class="roll"></div><div class="meta"></div><button class="send">SEND TO MIDI CLIP</button></article>
        <article class="card" data-card="D"><div class="k">Variation D</div><div><div id="dName" class="name">Make Similar</div><div id="dDesc" class="desc">similar to the last chosen variation</div></div><div class="roll"></div><div class="meta"></div><button class="send">MAKE SIMILAR + SEND</button></article>
      </div>
    </section>
  </main>
  <footer class="footer"><span><b>Tip:</b> insert a variation, check your clip, reopen CORVEN — the last settings are restored.</span><span>v0.5.4</span></footer>
</div>
<script id="boot" type="application/json">${boot}</script>
<script>
const BOOT=JSON.parse(document.getElementById('boot').textContent);
const roots=BOOT.roots, styles=BOOT.styles, emotions=BOOT.emotions;
const root=document.getElementById('root'), style=document.getElementById('style'), emotion=document.getElementById('emotion');
const memory=document.getElementById('memory');
const ROOT_MAP={C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
const SCALES={Major:[0,2,4,5,7,9,11],Minor:[0,2,3,5,7,8,10],Dorian:[0,2,3,5,7,9,10],Phrygian:[0,1,3,5,7,8,10],Lydian:[0,2,4,6,7,9,11],Aeolian:[0,2,3,5,7,8,10],'Harmonic Minor':[0,2,3,5,7,8,11],'Major Pentatonic':[0,2,4,7,9],'Minor Pentatonic':[0,3,5,7,10],'Phrygian Dominant':[0,1,4,5,7,8,10],'Double Harmonic':[0,1,4,5,7,8,11]};
const GROOVES=['Deep House Push','MPC 16 Swing 62','Late House','Organic Human 16','Minimal Shuffle','Gravtech Late Pump','MPC 16 Swing 66','Logic 16 Swing B','MPC 16 Swing 58','Utility Pump 16ths'];
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}function hashString(t){let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}function rng(seedText){let seed=hashString(seedText)||1;return()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}function choose(a){return a[Math.floor(Math.random()*a.length)]||a[0]}
function activeLength(){return Number(document.querySelector('.length button.active').dataset.length)}function setLength(n){document.querySelectorAll('.length button').forEach(b=>b.classList.toggle('active',Number(b.dataset.length)===n))}
function ui(){return{root:root.value,style:style.value,emotion:emotion.value,lengthBars:activeLength()}}
function profile(card){const u=ui();let scale='Dorian',tuning='Current Live Tuning',groove='Gravtech Late Pump',notesCount=4,octave=0,spread='Medium',mode='Contour',density='Balanced',human=58,mutation='Soft';
 if(u.style==='Deep House'){scale=u.emotion==='Hopeful'?'Major Pentatonic':'Dorian';groove='Deep House Push';notesCount=4;mode='Rolling';human=68}
 if(u.style==='Melodic Techno'){scale=u.emotion==='Dark'?'Harmonic Minor':'Aeolian';groove='MPC 16 Swing 62';notesCount=5;mode='Upper';density='Busy';human=45}
 if(u.style==='Dark Progressive'){scale='Phrygian';groove='Late House';notesCount=4;mode='Anchor';octave=-1;mutation='Deep'}
 if(u.style==='Ambient Motion'){scale='Lydian';groove='Organic Human 16';notesCount=5;mode='Spiral';density='Airy';human=92;spread='Wide'}
 if(u.style==='Minimal Groove'){scale='Minor Pentatonic';groove='Minimal Shuffle';notesCount=3;mode='Skip';density='Airy';human=55}
 if(u.style==='Gravtech Pulse'){scale='Dorian';groove='Gravtech Late Pump';notesCount=4;mode='Contour';density='Balanced';human=52}
 if(u.style==='Cinematic Motion'){scale=u.emotion==='Tense'?'Double Harmonic':'Harmonic Minor';tuning='Just Intonation';groove='Organic Human 16';notesCount=5;mode='Cascade';spread='Wide';human=84}
 if(u.style==='Minimal High-Tech Pulse'){scale='Phrygian Dominant';groove='MPC 16 Swing 66';notesCount=3;mode='Gate';density='Busy';human=35}
 if(u.style==='Organic Melodic House'){scale='Dorian';tuning='Just Intonation';groove='Logic 16 Swing B';notesCount=5;mode='PingPong';human=76;spread='Wide'}
 if(u.style==='Dark Melodic Techno'){scale='Aeolian';groove='MPC 16 Swing 58';notesCount=5;mode='Orbit';density='Busy';human=40;mutation='Deep'}
 if(u.emotion==='Soft'){density='Airy';human=Math.max(human,78);mutation='Soft'} if(u.emotion==='Dark'){octave=Math.min(octave,0);scale=scale==='Major Pentatonic'?'Minor Pentatonic':scale} if(u.emotion==='Tense'){mutation='Deep';tuning=tuning==='Current Live Tuning'?'Pythagorean':tuning} if(u.emotion==='Euphoric'){octave=1;notesCount=Math.max(notesCount,4);density='Busy'}
 if(card==='B'){density=density==='Airy'?'Balanced':'Busy';mode=mode==='Gate'?'Skip':'Syncopated'} if(card==='C'){octave+=1;spread='Wide';mode=mode==='Spiral'?'Cascade':'Spiral'} if(card==='D'){const source=BOOT.rememberedCard||'A';mode=source==='B'?'Syncopated':source==='C'?'Spiral':'Rolling';mutation='Soft';human=Math.min(100,human+12)}
 return{...u,scale,tuning,groove,notesCount,octave,spread,mode,density,human,mutation,similarTo:card==='D'?(BOOT.rememberedCard||'A'):null}
}
function baseMidi(r,o){return 48+(ROOT_MAP[r]??5)+o*12}function degreeToPitch(scale,base,degree){const size=scale.length;const oct=Math.floor(degree/size);const idx=((degree%size)+size)%size;return base+(scale[idx]||0)+oct*12}function degrees(n){return n<=1?[0]:n===2?[0,4]:n===3?[0,2,4]:n===4?[0,2,4,6]:[0,2,4,6,8]}
function pitchPool(p){const scale=SCALES[p.scale]||SCALES.Dorian;const base=baseMidi(p.root,p.octave);const shifts=p.spread==='Wide'?[-1,0,1,2]:p.spread==='Medium'?[0,1]:[0];let pool=[];for(const s of shifts){for(const d of degrees(p.notesCount))pool.push(degreeToPitch(scale,base+s*12,d))}return[...new Set(pool)].filter(x=>x>=48&&x<=108).sort((a,b)=>a-b)}
function swing(g){const m=g.match(/(\\d{2})$/);if(m)return clamp((Number(m[1])-50)/210,0,.18);if(g.includes('MPC'))return.07;if(g.includes('Logic'))return.052;if(g.includes('Shuffle'))return.078;if(g.includes('Late'))return.052;if(g.includes('Pump'))return.04;if(g.includes('Gravtech'))return.09;return 0}
function micro(g,step,r){const h=(r()-.5)*(g.includes('Human')?.036:.018);if(g.includes('Late'))return step%4===2?.025+h:h;if(g.includes('Pump'))return step%2===1?.022+h:h;if(g.includes('Gravtech'))return step%4===1||step%4===3?.032+h:h;return h}
function stepsPerBar(p,card){if(p.density==='Airy')return card==='C'?12:8;if(p.density==='Busy')return 16;return card==='C'?12:16}function rest(p,card,step,r){let chance=p.density==='Airy'?.22:p.density==='Balanced'?.10:.04;if(card==='B')chance+=.05;if(card==='D')chance+=.03;if(p.mode==='Gate'&&step%2===1)return r()<.38;if(step===0)return false;return r()<chance}
function pattern(mode,step,len,card,r){const off=card==='A'?0:card==='B'?1:card==='C'?2:3;if(mode==='Rolling')return(step+off)%len;if(mode==='PingPong'){const cyc=len*2-2||1;const pos=(step+off)%cyc;return pos<len?pos:cyc-pos}if(mode==='Spiral')return(step*2+Math.floor(step/5)+off)%len;if(mode==='Syncopated')return(step+(step%3)+off)%len;if(mode==='Gate')return(step%2===0?step+off:step*2+off)%len;if(mode==='Skip')return(step*3+off)%len;if(mode==='Cascade')return(Math.floor(step/2)+step+off)%len;if(mode==='Orbit')return(step*step+off)%len;if(mode==='Upper')return step%4===3?len-1:(step+off)%len;if(mode==='Anchor')return step%4===0?0:(step+off+(r()<.2?1:0))%len;return Math.round((Math.sin((step+off)*.9)*.5+.5)*(len-1))}
function dur(p,card,stepLen,step,r){let gate=card==='A'?.78:card==='B'?.46:card==='C'?.62:.58;if(p.mode==='Gate')gate*=.55;if(p.density==='Airy')gate*=1.12;if(p.density==='Busy')gate*=.72;if(p.style==='Gravtech Pulse')gate*=step%2===0?.72:.46;const h=p.human/100;return clamp(stepLen*gate*((.96-h*.18)+r()*(.12+h*.42)),.045,.95)}
function vel(p,card,step,total,r){let v=78;if(step%16===0)v+=26;else if(step%8===0)v+=18;else if(step%4===0)v+=10;if(p.groove.includes('MPC'))v+=step%4===0?10:step%4===2?5:-2;if(p.groove.includes('Pump')||p.groove.includes('Gravtech'))v+=step%2===0?12:-7;if(card==='B')v+=step%3===0?12:-4;if(card==='C')v+=Math.round(Math.sin((step/Math.max(1,total))*Math.PI*2)*10);if(card==='D')v+=step%5===0?10:0;if(p.emotion==='Soft')v-=8;if(p.emotion==='Euphoric')v+=8;if(p.emotion==='Hypnotic')v-=step%2?6:0;v+=Math.round((r()-.5)*(8+(p.human/100)*24));return clamp(v,38,126)}
function makeNotes(card){const p=profile(card);const seed=[p.root,p.style,p.emotion,p.lengthBars,p.scale,p.groove,p.notesCount,p.mode,p.density,p.human,p.mutation,card,p.similarTo].join('|');const r=rng(seed);const pool=pitchPool(p);const spb=stepsPerBar(p,card);const stepLen=4/spb;const total=p.lengthBars*spb;const sw=swing(p.groove);const notes=[];for(let step=0;step<total;step++){if(rest(p,card,step,r))continue;let idx=pattern(p.mode,step,pool.length,card,r);if(p.mutation==='Soft'&&r()<.14)idx=clamp(idx+(r()<.5?-1:1),0,pool.length-1);if(p.mutation==='Deep'&&r()<.26)idx=clamp(idx+Math.round((r()-.5)*4),0,pool.length-1);let pitch=pool[idx]||60;if(card==='C'&&step/total>.7&&pitch+12<=108)pitch+=12;if(card==='D'&&r()<.10){const j=r()<.5?-12:12;if(pitch+j>=48&&pitch+j<=108)pitch+=j}const start=Math.max(0,step*stepLen+(step%2===1?sw:0)+micro(p.groove,step,r));notes.push({pitch:Math.round(clamp(pitch,24,108)),startTime:Number(start.toFixed(4)),duration:Number(dur(p,card,stepLen,step,r).toFixed(4)),velocity:Math.round(vel(p,card,step,total,r))})}return{profile:p,notes:notes.sort((a,b)=>a.startTime-b.startTime||a.pitch-b.pitch)}}
function draw(){memory.textContent=BOOT.rememberedCard?'Last: Variation '+BOOT.rememberedCard+' • '+BOOT.rememberedLabel:'No saved variation yet — choose one to create memory';document.getElementById('dDesc').textContent=BOOT.rememberedCard?'similar to Variation '+BOOT.rememberedCard:'first similar seed';document.querySelectorAll('.card').forEach(card=>{const c=card.dataset.card;const pack=makeNotes(c);const roll=card.querySelector('.roll');roll.innerHTML='';for(let i=1;i<pack.profile.lengthBars*4;i++){const line=document.createElement('div');line.className='barline';line.style.left=(i/(pack.profile.lengthBars*4)*100)+'%';roll.appendChild(line)}const pitches=pack.notes.map(n=>n.pitch);const minP=Math.min(...(pitches.length?pitches:[48]));const maxP=Math.max(...(pitches.length?pitches:[72]));const range=Math.max(1,maxP-minP);for(const note of pack.notes){const el=document.createElement('div');el.className='note';el.style.left=clamp((note.startTime/(pack.profile.lengthBars*4))*100,0,96)+'%';el.style.width=Math.max(7,(note.duration/(pack.profile.lengthBars*4))*100)+'%';el.style.top=clamp(12+(1-((note.pitch-minP)/range))*152,10,166)+'px';el.style.opacity=(.52+(note.velocity/126)*.48).toFixed(2);roll.appendChild(el)}card.querySelector('.meta').innerHTML='<span>'+pack.notes.length+' notes</span><span>'+pack.profile.scale+'</span><span>'+pack.profile.groove+'</span><span>'+pack.profile.tuning+'</span><span>'+pack.profile.notesCount+' colors</span><span>'+pack.profile.lengthBars+' bar'+(pack.profile.lengthBars>1?'s':'')+'</span>'})}
document.querySelectorAll('.length').forEach(seg=>seg.addEventListener('click',ev=>{if(ev.target.tagName!=='BUTTON')return;setLength(Number(ev.target.dataset.length));draw()}));[root,style,emotion].forEach(el=>el.addEventListener('change',draw));document.getElementById('randomize').addEventListener('click',()=>{root.value=choose(roots);style.value=choose(styles);emotion.value=choose(emotions);setLength(choose([1,2]));draw()});document.querySelectorAll('.card').forEach(card=>card.addEventListener('click',()=>{document.querySelectorAll('.card').forEach(c=>c.classList.remove('selected'));card.classList.add('selected');const pack=makeNotes(card.dataset.card);const label=card.dataset.card==='D'?'Similar to '+(BOOT.rememberedCard?'Variation '+BOOT.rememberedCard:'Variation A'):card.querySelector('.name').textContent;const result={action:'insert',card:card.dataset.card,ui:ui(),label,notes:pack.notes};const message=JSON.stringify(result);if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.live){window.webkit.messageHandlers.live.postMessage({method:'close_and_send',params:[message]})}else if(window.chrome&&window.chrome.webview){window.chrome.webview.postMessage({method:'close_and_send',params:[message]})}else{alert('Live bridge not available.')}}));draw();
</script>
</body>
</html>`;
}

function dataUrl(html: string): string {
  return "data:text/html;charset=utf-8," + encodeURIComponent(html);
}

async function openWindow(api: ReturnType<typeof initialize>, arg: unknown) {
  const clip = api.getObjectFromHandle(arg as Handle, Clip);
  if (!(clip instanceof MidiClip)) {
    console.error("CORVEN: selected object is not a MidiClip.");
    return;
  }

  const result = await api.ui.showModalDialog(dataUrl(makeHtml(lastUi, lastCard, lastLabel)), 1240, 780);
  if (!result) return;

  let parsed: CorvenResult;
  try {
    parsed = JSON.parse(String(result)) as CorvenResult;
  } catch (error) {
    console.error("CORVEN: invalid result from WebView", error);
    return;
  }

  if (parsed.action !== "insert" || !Array.isArray(parsed.notes)) return;
  const notes: NoteDescription[] = parsed.notes.map((note) => ({
    pitch: Math.round(Number(note.pitch)),
    startTime: Number(note.startTime),
    duration: Number(note.duration),
    velocity: Math.round(Number(note.velocity))
  }));

  lastUi = parsed.ui;
  if (parsed.card === "A" || parsed.card === "B" || parsed.card === "C") {
    lastCard = parsed.card;
  }
  lastLabel = parsed.label;

  api.withinTransaction(() => {
    clip.notes = notes;
    clip.name = `CORVEN ${parsed.card} - ${parsed.ui.root} ${parsed.ui.style} - ${parsed.ui.lengthBars} bar${parsed.ui.lengthBars > 1 ? "s" : ""}`;
  });

  console.log(`CORVEN: ${parsed.card} inserted. Last settings saved in extension memory.`);
}

export function activate(activation: ActivationContext) {
  console.log("CORVEN By Müsslin: activate() called");
  const api = initialize(activation, "1.0.0");
  api.commands.registerCommand("corven.open", async (arg: unknown) => {
    await openWindow(api, arg);
  });
  api.ui.registerContextMenuAction("MidiClip", "CORVEN By Müsslin…", "corven.open");
  console.log("CORVEN: menu registered on MidiClip");
}
