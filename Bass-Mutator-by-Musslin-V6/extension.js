"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(extension_exports);

// node_modules/@ableton-extensions/sdk/dist/index.mjs
var DataModelObject = class DataModelObject2 {
  /** @internal */
  constructor(handle, dataModel, objectRegistry) {
    this.handle = handle;
    this.dataModel = dataModel;
    this.objectRegistry = objectRegistry;
  }
  /** The canonical parent of this object in Live's object hierarchy, or `null` if it has none. */
  get parent() {
    const handle = this.dataModel.getObjectCanonicalParent(this.handle);
    return handle ? this.objectRegistry.getObjectFromHandle(handle, DataModelObject2) : null;
  }
};
var invokeAsync = (dataModel, fn, ...args) => new Promise((resolve, reject) => {
  dataModel.withinTransaction(() => fn(...args, resolve, reject));
});
var createAsync = (dataModel, registry, type, fn, ...args) => new Promise((resolve, reject) => {
  dataModel.withinTransaction(() => fn(...args, (handle) => resolve(registry.getObjectFromHandle(handle, type)), reject));
});
var Clip = class extends DataModelObject {
  static className = "Clip";
  get name() {
    return this.dataModel.clipGetName(this.handle);
  }
  set name(name) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.clipSetName(this.handle, name);
    });
  }
  get startTime() {
    return this.dataModel.clipGetStartTime(this.handle);
  }
  get endTime() {
    return this.dataModel.clipGetEndTime(this.handle);
  }
  get duration() {
    return this.dataModel.clipGetEndTime(this.handle) - this.dataModel.clipGetStartTime(this.handle);
  }
  get startMarker() {
    return this.dataModel.clipGetStartMarker(this.handle);
  }
  get endMarker() {
    return this.dataModel.clipGetEndMarker(this.handle);
  }
  /**
  * Whether the clip is looped. Enabling looping on an unwarped audio clip
  * automatically enables warping.
  */
  get looping() {
    return this.dataModel.clipGetLooping(this.handle);
  }
  set looping(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.clipSetLooping(this.handle, value);
    });
  }
  get loopStart() {
    return this.dataModel.clipGetLoopStart(this.handle);
  }
  get loopEnd() {
    return this.dataModel.clipGetLoopEnd(this.handle);
  }
  get color() {
    return this.dataModel.clipGetColor(this.handle);
  }
  set color(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.clipSetColor(this.handle, value);
    });
  }
  get muted() {
    return this.dataModel.clipGetMuted(this.handle);
  }
  set muted(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.clipSetMuted(this.handle, value);
    });
  }
};
var AudioClip = class extends Clip {
  static className = "AudioClip";
  get filePath() {
    return this.dataModel.audioclipGetFilePath(this.handle);
  }
  get warping() {
    return this.dataModel.audioclipGetWarping(this.handle);
  }
  set warping(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.audioclipSetWarping(this.handle, value);
    });
  }
  get warpMode() {
    return this.dataModel.audioclipGetWarpMode(this.handle);
  }
  set warpMode(warpMode) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.audioclipSetWarpMode(this.handle, warpMode);
    });
  }
  get warpMarkers() {
    return this.dataModel.audioclipGetWarpMarkers(this.handle);
  }
};
var MidiClip = class extends Clip {
  static className = "MidiClip";
  get notes() {
    return this.dataModel.midiclipGetNotes(this.handle);
  }
  set notes(notes) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.midiclipSetNotes(this.handle, notes);
    });
  }
};
var ClipSlot = class extends DataModelObject {
  static className = "ClipSlot";
  get clip() {
    const handle = this.dataModel.clipslotGetClip(this.handle);
    return handle ? this.objectRegistry.getObjectFromHandle(handle, Clip) : null;
  }
  /**
  * Deletes the clip in this slot. Await the returned promise to ensure the
  * deletion has been fully processed.
  */
  deleteClip() {
    return invokeAsync(this.dataModel, this.dataModel.clipslotDeleteClip, this.handle);
  }
  /** @param length - Length of the clip in beats. */
  createMidiClip(length) {
    return createAsync(this.dataModel, this.objectRegistry, MidiClip, this.dataModel.clipslotCreateMidiClip, this.handle, length);
  }
  /**
  * Creates an audio clip in this session slot.
  *
  * @param args.filePath - Absolute path to the audio file.
  * @param args.isWarped - See {@link AudioTrack.createAudioClip}.
  * @param args.loopSettings - See {@link AudioTrack.createAudioClip}.
  */
  createAudioClip(args) {
    return createAsync(this.dataModel, this.objectRegistry, AudioClip, this.dataModel.clipslotCreateAudioClip, this.handle, {
      filePath: args.filePath,
      isWarped: args.isWarped,
      loopSettings: args.loopSettings
    });
  }
};
var DeviceParameter = class extends DataModelObject {
  static className = "DeviceParameter";
  get name() {
    return this.dataModel.deviceParameterGetName(this.handle);
  }
  get min() {
    return this.dataModel.deviceParameterGetInternalMin(this.handle);
  }
  get max() {
    return this.dataModel.deviceParameterGetInternalMax(this.handle);
  }
  get isQuantized() {
    return this.dataModel.deviceParameterGetIsQuantized(this.handle);
  }
  get defaultValue() {
    return this.dataModel.deviceParameterGetDefaultValue(this.handle);
  }
  get valueItems() {
    return this.dataModel.deviceParameterGetValueItems(this.handle);
  }
  getValue() {
    return new Promise((resolve) => {
      this.dataModel.deviceParameterGetInternalValue(this.handle, resolve);
    });
  }
  setValue(value) {
    return new Promise((resolve, reject) => {
      this.dataModel.withinTransaction(() => {
        this.dataModel.deviceParameterSetInternalValue(this.handle, value, resolve, (error) => reject(new Error(error)));
      });
    });
  }
};
var Device = class extends DataModelObject {
  static className = "Device";
  get name() {
    return this.dataModel.deviceGetName(this.handle);
  }
  get parameters() {
    return this.dataModel.deviceGetParameters(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, DeviceParameter));
  }
};
var TakeLane = class extends DataModelObject {
  static className = "TakeLane";
  get clips() {
    return this.dataModel.takelaneGetClips(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Clip));
  }
  get name() {
    return this.dataModel.takelaneGetName(this.handle);
  }
  set name(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.takelaneSetName(this.handle, value);
    });
  }
  /**
  * @param startTime - Position in the arrangement in beats.
  * @param duration - Length of the clip in beats.
  */
  createMidiClip(startTime, duration) {
    return createAsync(this.dataModel, this.objectRegistry, MidiClip, this.dataModel.takelaneCreateMidiClip, this.handle, startTime, duration);
  }
  /**
  * Creates an audio clip on this take lane. See {@link AudioTrack.createAudioClip}
  * for argument semantics.
  */
  createAudioClip(args) {
    return createAsync(this.dataModel, this.objectRegistry, AudioClip, this.dataModel.takelaneCreateAudioClip, this.handle, {
      duration: args.duration,
      filePath: args.filePath,
      isWarped: args.isWarped,
      loopSettings: args.loopSettings,
      startTime: args.startTime
    });
  }
};
var TrackMixer = class extends DataModelObject {
  static className = "MixerDevice";
  get volume() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.mixerdeviceGetVolume(this.handle), DeviceParameter);
  }
  get panning() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.mixerdeviceGetPanning(this.handle), DeviceParameter);
  }
  get sends() {
    return this.dataModel.mixerdeviceGetSends(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, DeviceParameter));
  }
};
var Track = class Track2 extends DataModelObject {
  static className = "Track";
  get name() {
    return this.dataModel.trackGetName(this.handle);
  }
  set name(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.trackSetName(this.handle, value);
    });
  }
  get mute() {
    return this.dataModel.trackGetMute(this.handle);
  }
  set mute(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.trackSetMute(this.handle, value);
    });
  }
  get solo() {
    return this.dataModel.trackGetSolo(this.handle);
  }
  set solo(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.trackSetSolo(this.handle, value);
    });
  }
  get mutedViaSolo() {
    return this.dataModel.trackGetMutedViaSolo(this.handle);
  }
  get arm() {
    return this.dataModel.trackGetArm(this.handle);
  }
  set arm(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.trackSetArm(this.handle, value);
    });
  }
  get clipSlots() {
    return this.dataModel.trackGetClipSlots(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, ClipSlot));
  }
  get takeLanes() {
    return this.dataModel.trackGetTakeLanes(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, TakeLane));
  }
  get arrangementClips() {
    return this.dataModel.trackGetArrangementClips(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Clip));
  }
  get groupTrack() {
    const handle = this.dataModel.trackGetGroupTrack(this.handle);
    return handle ? this.objectRegistry.getObjectFromHandle(handle, Track2) : null;
  }
  get devices() {
    return this.dataModel.trackGetDevices(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Device));
  }
  get mixer() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.trackGetMixerDevice(this.handle), TrackMixer);
  }
  /** Appended to the end of {@link takeLanes}. */
  createTakeLane() {
    return createAsync(this.dataModel, this.objectRegistry, TakeLane, this.dataModel.trackCreateTakeLane, this.handle);
  }
  /**
  * Inserts a built-in Live device with its default preset into the track's device chain.
  * Only devices native to Live are supported — third-party plug-ins cannot be loaded this way.
  *
  * @param deviceName - The name of the built-in Live device (e.g. `"Reverb"`, `"Auto Filter"`).
  * @param index - Zero-based position in the device chain at which to insert.
  */
  insertDevice(deviceName, index) {
    return createAsync(this.dataModel, this.objectRegistry, Device, this.dataModel.trackInsertDevice, this.handle, deviceName, BigInt(index));
  }
  /**
  * Deletes a device from this track's device chain. Await the returned
  * promise to ensure the deletion has been fully processed.
  */
  deleteDevice(device) {
    return invokeAsync(this.dataModel, this.dataModel.trackDeleteDevice, this.handle, device.handle);
  }
  /** The duplicate is inserted directly after the original in the device chain. */
  duplicateDevice(device) {
    return createAsync(this.dataModel, this.objectRegistry, Device, this.dataModel.trackDuplicateDevice, this.handle, device.handle);
  }
  /**
  * Deletes an arrangement clip. For session clips, use {@link ClipSlot.deleteClip}.
  * Await the returned promise to ensure the deletion has been fully processed.
  */
  deleteClip(clip) {
    return invokeAsync(this.dataModel, this.dataModel.trackDeleteClip, this.handle, clip.handle);
  }
  /**
  * Deletes clips within the range. Clips that overlap a boundary are truncated
  * to the range edge rather than fully deleted.
  *
  * @param startTime - Start of the range in beats.
  * @param endTime - End of the range in beats.
  */
  clearClipsInRange(startTime, endTime) {
    return invokeAsync(this.dataModel, this.dataModel.trackClearClipsInRange, this.handle, startTime, endTime);
  }
};
var AudioTrack = class extends Track {
  static className = "AudioTrack";
  /**
  * Creates an audio clip from a file in the track's arrangement timeline.
  *
  * @param args.filePath - Absolute path to the audio file.
  * @param args.startTime - Position in the arrangement timeline in beats.
  * @param args.duration - Length of the clip on the arrangement timeline,
  *   in beats. Capped at the sample's natural length for non-looping clips;
  *   looping clips repeat to fill the full length. Defaults to the sample's
  *   natural length at the current tempo when omitted.
  * @param args.isWarped - Whether warping is enabled. Defaults to the clip's
  *   saved `.asd` settings if present, otherwise Live's "Auto-Warp" preference.
  *   Must be provided when `loopSettings` is provided.
  * @param args.loopSettings - Initial loop settings. Requires `isWarped` to be
  *   defined. If `isWarped` is `false`, `loopSettings.looping` must be `false`.
  *
  * @example
  * const clip = await track.createAudioClip({ filePath: '/samples/kick.wav', startTime: 0 });
  *
  * @example
  * const clip = await track.createAudioClip({
  *   filePath: '/samples/ambient.wav',
  *   startTime: 16,
  *   isWarped: false,
  * });
  *
  * @example
  * // Clip view: Start=beat 0, End=beat 2, Loop position=beat 0, Loop length=1 beat.
  * const clip = await track.createAudioClip({
  *   filePath: '/samples/loop.wav',
  *   startTime: 0,
  *   isWarped: true,
  *   loopSettings: { looping: true, startMarker: 0, endMarker: 2, loopStart: 0, loopEnd: 1 },
  * });
  *
  * @example
  * const clip = await track.createAudioClip({
  *   filePath: '/samples/loop.wav',
  *   startTime: 0,
  *   isWarped: true,
  *   duration: 8,
  *   loopSettings: { looping: true, startMarker: 0, endMarker: 2, loopStart: 0, loopEnd: 2 },
  * });
  */
  createAudioClip(args) {
    return createAsync(this.dataModel, this.objectRegistry, AudioClip, this.dataModel.trackCreateAudioClip, this.handle, {
      duration: args.duration,
      filePath: args.filePath,
      isWarped: args.isWarped,
      loopSettings: args.loopSettings,
      startTime: args.startTime
    });
  }
};
var CuePoint = class extends DataModelObject {
  static className = "CuePoint";
  get time() {
    return this.dataModel.cuePointGetTime(this.handle);
  }
  get name() {
    return this.dataModel.cuePointGetName(this.handle);
  }
  set name(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.cuePointSetName(this.handle, value);
    });
  }
};
var MidiTrack = class extends Track {
  static className = "MidiTrack";
  /**
  * @param startTime - Position in the arrangement in beats.
  * @param duration - Length of the clip in beats.
  */
  createMidiClip(startTime, duration) {
    return createAsync(this.dataModel, this.objectRegistry, MidiClip, this.dataModel.trackCreateMidiClip, this.handle, startTime, duration);
  }
};
var Scene = class extends DataModelObject {
  static className = "Scene";
  get name() {
    return this.dataModel.sceneGetName(this.handle);
  }
  set name(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.sceneSetName(this.handle, value);
    });
  }
  get tempo() {
    return this.dataModel.sceneGetTempo(this.handle);
  }
  get signatureNumerator() {
    return this.dataModel.sceneGetSignatureNumerator(this.handle);
  }
  get signatureDenominator() {
    return this.dataModel.sceneGetSignatureDenominator(this.handle);
  }
};
var Song = class extends DataModelObject {
  static className = "Song";
  /** Regular tracks only — excludes return tracks and the main track. */
  get tracks() {
    return this.dataModel.songGetTracks(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Track));
  }
  get returnTracks() {
    return this.dataModel.songGetReturnTracks(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Track));
  }
  get mainTrack() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.songGetMainTrack(this.handle), Track);
  }
  get scenes() {
    return this.dataModel.songGetScenes(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Scene));
  }
  get cuePoints() {
    return this.dataModel.songGetCuePoints(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, CuePoint));
  }
  get tempo() {
    return this.dataModel.songGetTempo(this.handle);
  }
  set tempo(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.songSetTempo(this.handle, value);
    });
  }
  /**
  * The current arrangement grid quantization. Use with {@link gridIsTriplet} to
  * determine the full grid setting.
  */
  get gridQuantization() {
    return this.dataModel.songGetGridQuantization(this.handle);
  }
  /**
  * Whether the arrangement grid uses triplet subdivisions of the current
  * {@link gridQuantization} value.
  */
  get gridIsTriplet() {
    return this.dataModel.songGetGridIsTriplet(this.handle);
  }
  /**
  * The root note of the scale currently selected in Live, as a MIDI note number
  * from 0 (C) to 11 (B).
  */
  get rootNote() {
    return Number(this.dataModel.songGetRootNote(this.handle));
  }
  /** The name of the scale selected in Live, as shown in the Current Scale Name chooser. */
  get scaleName() {
    return this.dataModel.songGetScaleName(this.handle);
  }
  /** Whether Live's Scale Mode is enabled. */
  get scaleMode() {
    return this.dataModel.songGetScaleMode(this.handle);
  }
  /** The intervals of the current scale as semitone offsets from the root note. */
  get scaleIntervals() {
    return this.dataModel.songGetScaleIntervals(this.handle).map(Number);
  }
  /** Inserted after the last selected track, or appended if no track is selected. */
  createAudioTrack() {
    return createAsync(this.dataModel, this.objectRegistry, AudioTrack, this.dataModel.songCreateAudioTrack, this.handle);
  }
  /** Inserted after the last selected track, or appended if no track is selected. */
  createMidiTrack() {
    return createAsync(this.dataModel, this.objectRegistry, MidiTrack, this.dataModel.songCreateMidiTrack, this.handle);
  }
  /**
  * @param index - 0-based insert position in the range `[0, song.scenes.length]`.
  * Pass `-1` to append at the end.
  */
  createScene(index) {
    return createAsync(this.dataModel, this.objectRegistry, Scene, this.dataModel.songCreateScene, this.handle, BigInt(index));
  }
  /**
  * Deletes a track from the song. Await the returned promise to ensure the
  * deletion has been fully processed.
  */
  deleteTrack(track) {
    return invokeAsync(this.dataModel, this.dataModel.songDeleteTrack, this.handle, track.handle);
  }
  /**
  * Deletes a scene from the song. Await the returned promise to ensure the
  * deletion has been fully processed.
  */
  deleteScene(scene) {
    return invokeAsync(this.dataModel, this.dataModel.songDeleteScene, this.handle, scene.handle);
  }
  /** Duplicates the track. The duplicate is inserted immediately after the original. */
  duplicateTrack(track) {
    return createAsync(this.dataModel, this.objectRegistry, Track, this.dataModel.songDuplicateTrack, this.handle, track.handle);
  }
  /** Duplicates the scene. The duplicate is inserted immediately after the original. */
  duplicateScene(scene) {
    return createAsync(this.dataModel, this.objectRegistry, Scene, this.dataModel.songDuplicateScene, this.handle, scene.handle);
  }
  /** @param time - Position in the arrangement in beats. */
  createCuePoint(time) {
    return createAsync(this.dataModel, this.objectRegistry, CuePoint, this.dataModel.songCreateCuePoint, this.handle, time);
  }
  /**
  * Deletes a cue point from the song. Await the returned promise to ensure
  * the deletion has been fully processed.
  */
  deleteCuePoint(cuePoint) {
    return invokeAsync(this.dataModel, this.dataModel.songDeleteCuePoint, this.handle, cuePoint.handle);
  }
};
var Application = class extends DataModelObject {
  static className = "Application";
  get song() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.rootGetSong(this.handle), Song);
  }
};
var Commands = class {
  module;
  /** @internal */
  constructor(module2) {
    this.module = module2;
  }
  /**
  * Registers a command that can be invoked by Live or via {@link Commands.executeCommand}.
  *
  * @param commandId - A unique string identifier for this command.
  * @param callback - Called when the command is invoked. May receive arguments passed by the invoker.
  */
  registerCommand(commandId, callback) {
    this.module.registerCommand(commandId, callback);
  }
  /**
  * Programmatically invokes a registered command.
  *
  * @param commandId - The ID of the command to invoke.
  * @param args - Arguments to pass to the command's callback.
  */
  executeCommand(commandId, ...args) {
    this.module.executeCommand(commandId, ...args);
  }
};
var ChainMixer = class extends DataModelObject {
  static className = "ChainMixerDevice";
  get volume() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.chainmixerdeviceGetVolume(this.handle), DeviceParameter);
  }
  get panning() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.chainmixerdeviceGetPanning(this.handle), DeviceParameter);
  }
  get sends() {
    return this.dataModel.chainmixerdeviceGetSends(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, DeviceParameter));
  }
};
var Chain = class extends DataModelObject {
  static className = "Chain";
  get devices() {
    return this.dataModel.chainGetDevices(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Device));
  }
  get mixer() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.chainGetMixerDevice(this.handle), ChainMixer);
  }
  /**
  * Inserts a built-in Live device with its default preset into the chain.
  * Only devices native to Live are supported — third-party plug-ins cannot be loaded this way.
  *
  * @param deviceName - The name of the built-in Live device (e.g. `"Reverb"`, `"Auto Filter"`).
  * @param index - Zero-based position in the device chain at which to insert.
  */
  insertDevice(deviceName, index) {
    return createAsync(this.dataModel, this.objectRegistry, Device, this.dataModel.chainInsertDevice, this.handle, deviceName, BigInt(index));
  }
  /**
  * Deletes a device from this chain. Await the returned promise to ensure
  * the deletion has been fully processed.
  */
  deleteDevice(device) {
    return invokeAsync(this.dataModel, this.dataModel.chainDeleteDevice, this.handle, device.handle);
  }
  /** The duplicate is inserted directly after the original in the device chain. */
  duplicateDevice(device) {
    return createAsync(this.dataModel, this.objectRegistry, Device, this.dataModel.chainDuplicateDevice, this.handle, device.handle);
  }
};
var DrumChain = class extends Chain {
  static className = "DrumChain";
  get receivingNote() {
    return Number(this.dataModel.drumchainGetReceivingNote(this.handle));
  }
  set receivingNote(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.drumchainSetReceivingNote(this.handle, BigInt(value));
    });
  }
};
var RackDevice = class extends Device {
  static className = "RackDevice";
  get chains() {
    return this.dataModel.rackdeviceGetChains(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Chain));
  }
  /** @param index - 0-based insert position in the range `[0, rack.chains.length]`. */
  insertChain(index) {
    return createAsync(this.dataModel, this.objectRegistry, Chain, this.dataModel.rackdeviceInsertChain, this.handle, BigInt(index));
  }
};
var DrumRack = class extends RackDevice {
  static className = "DrumRackDevice";
  get chains() {
    return this.dataModel.rackdeviceGetChains(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, DrumChain));
  }
};
var Sample = class extends DataModelObject {
  static className = "Sample";
  get filePath() {
    return this.dataModel.sampleGetFilePath(this.handle);
  }
};
var Simpler = class extends Device {
  static className = "Simpler";
  get sample() {
    const handle = this.dataModel.simplerGetSample(this.handle);
    return handle ? this.objectRegistry.getObjectFromHandle(handle, Sample) : null;
  }
  /** Replaces the loaded sample with the audio file at the given absolute path. */
  replaceSample(filePath) {
    return createAsync(this.dataModel, this.objectRegistry, Sample, this.dataModel.simplerReplaceSample, this.handle, filePath);
  }
};
var dataModelClasses = [
  Application,
  Song,
  AudioTrack,
  MidiTrack,
  Track,
  AudioClip,
  MidiClip,
  Clip,
  ClipSlot,
  TakeLane,
  Simpler,
  DrumRack,
  RackDevice,
  Device,
  Sample,
  DrumChain,
  Chain,
  Scene,
  CuePoint,
  DeviceParameter,
  TrackMixer,
  ChainMixer
];
var DataModelObjectRegistry = class {
  cache = /* @__PURE__ */ new Map();
  dataModel;
  /** @internal */
  constructor(dataModel) {
    this.dataModel = dataModel;
  }
  getOrCreateObjectFromHandle(handle) {
    const cached = this.cache.get(handle.id);
    if (cached) return cached;
    const ModelClass = dataModelClasses.find((cls) => this.dataModel.getObjectIsOfClass(handle, cls.className));
    if (!ModelClass) throw new Error("Unknown object type");
    const obj = new ModelClass(handle, this.dataModel, this);
    this.cache.set(handle.id, obj);
    return obj;
  }
  /**
  * Resolves a {@link Handle} into a typed SDK object.
  *
  * Pass {@link DataModelObject} as `type` when the exact type of the handle is not known
  * in advance, then use `instanceof` to branch on the actual type:
  *
  * ```ts
  * const obj = objects.getObjectFromHandle(handle, DataModelObject);
  * if (obj instanceof ClipSlot) {
  *   // ...
  * }
  * ```
  *
  * Throws if the underlying object has been deleted, if it is of a different
  * type than `type`, or if its type is not recognised.
  *
  * @param handle - The handle to resolve.
  * @param type - The expected SDK class (e.g. `ClipSlot`).
  */
  getObjectFromHandle(handle, type) {
    const obj = this.getOrCreateObjectFromHandle(handle);
    if (!(obj instanceof type)) throw new Error("Object of incorrect type");
    return obj;
  }
};
var Environment = class {
  module;
  /** @internal */
  constructor(module2) {
    this.module = module2;
  }
  /**
  * Per-extension directory for persistent storage. Use it for configuration, credentials,
  * and cached state — anything that should survive across Live sessions.
  */
  get storageDirectory() {
    return this.module.storageDirectory;
  }
  /**
  * Per-extension directory for temporary files, such as intermediate audio or analysis
  * results. May be cleaned up between sessions.
  */
  get tempDirectory() {
    return this.module.tempDirectory;
  }
  /** Live's current UI language as an uppercase ISO 639-1 code (e.g. `"EN"`, `"DE"`, `"JA"`). */
  get language() {
    return this.module.language;
  }
};
var Resources = class {
  module;
  /** @internal */
  constructor(module2) {
    this.module = module2;
  }
  /**
  * Renders the pre-effects audio of a track in the arrangement between two beat
  * positions. Returns a path to a WAV file written to the extension's temp directory.
  */
  renderPreFxAudio(track, startTime, endTime) {
    return new Promise((resolve, reject) => {
      this.module.renderPreFxAudio(track.handle, {
        endTime,
        startTime
      }, resolve, reject);
    });
  }
  /**
  * Copies a file into the Live project folder so that Live manages it.
  * Returns the path to the imported copy. Use the returned path in subsequent API
  * calls, not the original.
  */
  importIntoProject(filePath) {
    return new Promise((resolve, reject) => {
      this.module.importIntoProject(filePath, resolve, reject);
    });
  }
};
var toProgressOptions = (text, progress) => typeof progress === "number" ? {
  progress,
  text
} : { text };
var Ui = class {
  module;
  /** @internal */
  constructor(module2) {
    this.module = module2;
  }
  /**
  * Registers a context menu action in the given {@link ContextMenuScope}.
  *
  * When the user triggers the action, Live invokes the command identified by
  * `commandId`. Depending on the scope, the command receives either the triggered
  * object's {@link Handle}, an {@link ArrangementSelection}, or a
  * {@link ClipSlotSelection} as its first argument.
  *
  * Returns a function that unregisters the action when called.
  */
  registerContextMenuAction(scope, title, commandId) {
    return new Promise((resolve) => {
      this.module.registerContextMenuAction(scope, title, commandId, (unregister) => {
        resolve(() => new Promise((done) => {
          unregister(done);
        }));
      });
    });
  }
  /**
  * Opens a modal dialog that loads the given URL. Supported URL schemes are
  * `file:`, `data:`, `https:`, and `http://localhost`.
  *
  * To return a result and close the dialog, the dialog's HTML must post the message
  * `{ method: "close_and_send", params: [resultString] }` to the host's message
  * handler — `window.webkit.messageHandlers.live.postMessage` on macOS or
  * `window.chrome.webview.postMessage` on Windows. The returned promise resolves
  * with that string.
  *
  * Rejects if `url` is malformed or an unexpected error occurred.
  */
  showModalDialog(url, width, height) {
    return new Promise((resolve, reject) => {
      this.module.showModalDialog(url, width, height, resolve, reject);
    });
  }
  /**
  * Shows a progress dialog while `callback` runs.
  * The callback receives an `update` function to change the text/progress
  * (progress is a percentage, 0–100), and an `AbortSignal` that fires if
  * the user cancels the dialog.
  * The dialog closes automatically when the callback resolves or rejects.
  *
  * @example
  * ```ts
  * const wavPath = await ui.withinProgressDialog(
  *   "Rendering audio…",
  *   { progress: 0 },
  *   async (update, signal) => {
  *     await update("Analysing…", 30);
  *     if (signal.aborted) return;
  *     await update("Rendering…", 70);
  *     return await resources.renderPreFxAudio(track, startBeat, endBeat);
  *   },
  * );
  * ```
  */
  withinProgressDialog(text, options, callback) {
    const ac = new AbortController();
    return new Promise((resolve, reject) => {
      this.module.showProgressDialog(toProgressOptions(text, options.progress), ({ update, close }) => {
        const asyncUpdate = (updateText, progress) => new Promise((resolveUpdate) => {
          update(toProgressOptions(updateText, progress), resolveUpdate);
        });
        const asyncClose = () => new Promise((done) => {
          close(done);
        });
        callback(asyncUpdate, ac.signal).finally(asyncClose).then(resolve).catch(reject);
      }, () => {
        ac.abort();
      });
    });
  }
};
var initialize = (context, apiVersion) => {
  const { commands, dataModel, environment, resources, ui } = context.initializeExtensionHost({ apiVersion });
  const objectRegistry = new DataModelObjectRegistry(dataModel);
  return {
    application: objectRegistry.getObjectFromHandle(dataModel.getRoot(), Application),
    commands: new Commands(commands),
    environment: new Environment(environment),
    getObjectFromHandle: objectRegistry.getObjectFromHandle.bind(objectRegistry),
    resources: new Resources(resources),
    ui: new Ui(ui),
    withinTransaction: dataModel.withinTransaction.bind(dataModel)
  };
};

// src/extension.ts
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function roundGrid(value, grid = 0.01) {
  return Math.round(value / grid) * grid;
}
function seeded(seed) {
  let s = seed || 1984;
  return () => {
    s = Math.sin(s) * 1e4;
    return s - Math.floor(s);
  };
}
function scaleIntervals(scale) {
  if (scale === "dorian") return [0, 2, 3, 5, 7, 9, 10];
  if (scale === "phrygian") return [0, 1, 3, 5, 7, 8, 10];
  if (scale === "harmonic") return [0, 2, 3, 5, 7, 8, 11];
  if (scale === "chromatic") return [0, 1, 2, 3, 5, 7, 8, 10, 11];
  return [0, 2, 3, 5, 7, 8, 10];
}
function densitySteps(density, engine) {
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
function degreePattern(engine) {
  if (engine === "pump") return [0, 0, 4, 0, 2, 0, 5, 4];
  if (engine === "slice") return [0, 4, 0, 6, 2, 0, 5, 1];
  if (engine === "neuro") return [0, 5, 2, 0, 6, 1, 4, 0];
  if (engine === "stutter") return [0, 0, 0, 4, 0, 2, 0, 5];
  if (engine === "acid") return [0, 7, 4, 0, 2, 7, 4, 6];
  return [0, 0, 4, 0, 2, 0, 6, 4];
}
function generate(settings) {
  const rnd = seeded(settings.randomSeed);
  const intervals = scaleIntervals(settings.scale);
  const degrees = degreePattern(settings.engine);
  const steps = densitySteps(settings.density, settings.engine);
  const notes = [];
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
      const accent = index % 4 === 0 ? 18 : index % 2 === 0 ? 8 : -5;
      const velocity = clamp(82 + settings.velocity * 36 + accent + Math.round((rnd() - 0.5) * 12), 1, 127);
      notes.push({
        pitch,
        startTime: roundGrid(Math.max(0, start)),
        duration: clamp(duration, 0.04, 1.6),
        velocity
      });
      if (settings.ghost && rnd() < settings.modulation * 0.46 && step < 15) {
        notes.push({
          pitch,
          startTime: roundGrid(start + 0.125 + rnd() * 0.08),
          duration: 0.055 + rnd() * 0.055,
          velocity: clamp(velocity - 35, 1, 127),
          probability: 0.62 + settings.modulation * 0.2
        });
      }
      if (settings.stutter && (settings.engine === "stutter" || rnd() < settings.slice * 0.36) && step < 15) {
        notes.push({
          pitch,
          startTime: roundGrid(start + 0.0625),
          duration: 0.045,
          velocity: clamp(velocity - 20, 1, 127),
          probability: 0.66
        });
        notes.push({
          pitch,
          startTime: roundGrid(start + 0.125),
          duration: 0.045,
          velocity: clamp(velocity - 28, 1, 127),
          probability: 0.58
        });
      }
      if (settings.octaveJumps && rnd() < settings.modulation * 0.22 && (index % 4 === 0 || settings.engine === "acid")) {
        notes.push({
          pitch: clamp(pitch + 12, 0, 127),
          startTime: roundGrid(start + 0.5),
          duration: 0.12,
          velocity: clamp(velocity - 24, 1, 127),
          probability: 0.48
        });
      }
      index++;
    }
  }
  return notes.sort((a, b) => a.startTime - b.startTime || a.pitch - b.pitch);
}
function html() {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Bass Mutator by M\xFCsslin</title>
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
  <div class="brand"><div class="sig">M</div><div><h1>Bass Mutator <span>by M\xFCsslin</span></h1><div class="sub">Modular slice bassline engine \xB7 pump modulation system</div></div></div>
  <div class="badge">MODULAR \xB7 SLICE \xB7 PUMP</div>
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
<footer><span>BASS MUTATOR BY M\xDCSSLIN v6</span><span>creates complete modular pump bassline \xB7 Cmd+Z to undo</span></footer>
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
function dataUrl(htmlText) {
  return "data:text/html;charset=utf-8," + encodeURIComponent(htmlText);
}
async function openGenerator(api, arg) {
  const clip = api.getObjectFromHandle(arg, Clip);
  if (!(clip instanceof MidiClip)) {
    console.error("Bass Mutator by M\xFCsslin: selected object is not a MidiClip.");
    return;
  }
  const result = await api.ui.showModalDialog(dataUrl(html()), 1080, 730);
  if (!result) return;
  const settings = JSON.parse(result);
  const notes = generate(settings);
  api.withinTransaction(() => {
    clip.notes = notes;
    clip.name = "Bass Mutator by M\xFCsslin - " + settings.engine;
  });
  console.log("Bass Mutator by M\xFCsslin: created " + notes.length + " modular pump notes.");
}
function activate(activation) {
  console.log("Bass Mutator by M\xFCsslin: activate() called");
  const api = initialize(activation, "1.0.0");
  api.commands.registerCommand("musslin.bassmutator.open", async (arg) => {
    await openGenerator(api, arg);
  });
  api.ui.registerContextMenuAction(
    "MidiClip",
    "Bass Mutator by M\xFCsslin\u2026",
    "musslin.bassmutator.open"
  );
  console.log("Bass Mutator by M\xFCsslin: menu registered on MidiClip");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
//# sourceMappingURL=extension.js.map
