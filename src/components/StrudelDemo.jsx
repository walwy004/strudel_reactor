import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from '../tunes';
import console_monkey_patch, { getD3Data } from '../console-monkey-patch';

import PreprocessingTextarea from './PreprocessingTextarea';
import RadioButton from './RadioButton';
import ProcButton from './ProcButton';
import ToggleSwitch from './ToggleSwitch';
import Slider from './Slider';
import CPM from './CPM';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export default function StrudelDemo() {

    const hasRun = useRef(false);

    const [state, setState] = useState("stop");
    const [songText, setSongText] = useState(stranger_tune(1));
    const [volume, setVolume] = useState(1);
    const [reverb, setReverb] = useState(0);
    const [cpm, setCpm] = useState(140);
    const [radioInstruments, setRadioInstruments] = useState({
        bassline: '',
        main_arp: '',
        drums1: '',
        drums2: '',
    });
    const [radioArp, setRadioArp] = useState('1')
    const [radioPattern, setRadioPattern] = useState(0);
    const [radioBass, setRadioBass] = useState(0);
    const [fxHighpass, setFxHighpass] = useState(false);
    const [fxLowpass, setFxLowpass] = useState(false);
    const [fxOverdrive, setFxOverdrive] = useState(false);

    const handlePlay = () => {
        globalEditor.evaluate();
    }

    const handleStop = () => {
        globalEditor.stop();
    }

    const handleRadioInstruments = (instrument) => {
        setRadioInstruments((prev) => {
            const newBtns = { ...prev };
            prev[instrument] === '_' ? newBtns[instrument] = '' : newBtns[instrument] = '_';
            return newBtns;
        });
    };

    const handleRadioArp = () => {
        radioArp === '1' ? setRadioArp('2') : setRadioArp('1')
    }

    const handleRadioPattern = (patternNumber) => {
        if (radioPattern === patternNumber) {
            // pressing the same button again resets to 0
            setRadioPattern(0);
        } else {
            // pressing a different button selects that pattern
            setRadioPattern(patternNumber)
        }
    }

    const handleRadioBass = () => {
        radioBass === 0 ? setRadioBass(1) : setRadioBass(0)
    }

    const handleSaveSettings = () => {
        const json = {
            songText,
            volume,
            reverb,
            cpm,
            radioInstruments,
            radioArp,
            radioPattern,
            radioBass,
            fxHighpass,
            fxLowpass,
            fxOverdrive
        };

        localStorage.setItem("strudelSettings", JSON.stringify(json));
        alert("Settings saved!")
    }

    const handleLoadSettings = () => {
        const saved = localStorage.getItem("strudelSettings");

        // Check if a saved json exists
        if (!saved) {
            alert("No saved settings found!")
            return;
        }

        const json = JSON.parse(saved);
        setSongText(json.songText);
        setVolume(json.volume);
        setReverb(json.reverb);
        setCpm(json.cpm);
        setRadioInstruments(json.radioInstruments);
        setRadioArp(json.radioArp);
        setRadioPattern(json.radioPattern);
        setRadioBass(json.radioBass);
        setFxHighpass(json.fxHighpass);
        setFxLowpass(json.fxLowpass);
        setFxOverdrive(json.fxOverdrive);

        alert("Settings loaded!");
    }

    useEffect(() => {
        if (globalEditor) {
            const updatedTune = stranger_tune(
                volume,
                reverb,
                cpm,
                radioInstruments,
                radioArp,
                radioPattern,
                radioBass,
                fxHighpass,
                fxLowpass,
                fxOverdrive
            );
            globalEditor.setCode(updatedTune);

            if (state === "play") {
                handlePlay();
            }
        }
    }, [volume, reverb, cpm, radioInstruments, radioArp, radioPattern,
        radioBass, fxHighpass, fxLowpass, fxOverdrive])

    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
        }

        globalEditor.setCode(songText);
    }, [songText]);

    return (
        <div>
            <h2>Strudel Demo</h2>
            <main>

                <div className="container-fluid">
                    <div className="row">

                        <div className="col-md-6" >
                            <div className="row-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                <PreprocessingTextarea defaultValue={songText} onChange={(e) => setSongText(e.target.value)} />
                            </div>

                            <div className="row-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                <div id="editor" />
                                <div id="output" />
                            </div>
                        </div>

                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <div className="container">

                                {/* Grid for pads and toggles */}
                                <div className="row">

                                    {/* Left Controls (Sliders, CPM, ProcButtons */}
                                    <div className="col-md-4">

                                        {/* CPM */}
                                        <div className="row d-flex justify-content-center">
                                            <CPM onCPMChange={(e) => setCpm(e.target.value)} />
                                        </div>

                                        {/* Sliders */}
                                        <div className="row d-flex justify-content-center">
                                            <div className="col-4">
                                                <Slider onSlider={(e) => setVolume(e.target.value)} sliderId="volume" name="Volume" />
                                            </div>
                                            <div className="col-4">
                                                <Slider onSlider={(e) => setReverb(e.target.value)} sliderId="reverb" name="Reverb" />
                                            </div>
                                            <div className="col-8"></div>
                                        </div>

                                        {/* Proc buttons */}
                                        <div className="row">
                                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                                <ProcButton onClick={handleSaveSettings} btnId="save" name="save" backgroundColor="grey" />
                                                <ProcButton onClick={handleLoadSettings} btnId="load" name="load" backgroundColor="grey" />
                                                <ProcButton onClick={() => { setState("play"); handlePlay() }} btnId="play" name="play" backgroundColor="#7ed957" />
                                                <ProcButton onClick={() => { setState("stop"); handleStop() }} btnId="stop" name="stop" backgroundColor="red" />
                                            </div>
                                        </div>


                                    </div>

                                    {/* Right Controls (Radio Buttons, Toggle Switches) */}
                                    <div className="col-md-8">

                                        {/* Radio buttons */}
                                        <div className="row">
                                            <div className="col-10">
                                                <div className="row">
                                                    <RadioButton name='bassline' onClick={() => handleRadioInstruments('bassline')} backgroundColor='#ff5757' />
                                                    <RadioButton name='main_arp' onClick={() => handleRadioInstruments('main_arp')} backgroundColor='#ffbd59' />
                                                    <RadioButton name='drums1' onClick={() => handleRadioInstruments('drums1')} backgroundColor='#ffde59' />
                                                </div>
                                                <div className="row">
                                                    <RadioButton name='drums2' onClick={() => handleRadioInstruments('drums2')} backgroundColor="#ff66c4" />
                                                    <RadioButton name='arpeggiator' onClick={() => handleRadioArp()} backgroundColor='#7ed957' />
                                                    <RadioButton name='bass' onClick={() => handleRadioBass()} backgroundColor='#e2a9f1' />
                                                </div>
                                                <div className="row">
                                                    <RadioButton name='pattern0' onClick={() => handleRadioPattern(0)} backgroundColor='#5ce1e6' />
                                                    <RadioButton name='pattern1' onClick={() => handleRadioPattern(1)} backgroundColor='#8c52ff' />
                                                    <RadioButton name='pattern2' onClick={() => handleRadioPattern(2)} backgroundColor='#c1ff72' />
                                                </div>
                                            </div>

                                            {/* Toggle Switches */}
                                            <div className="col-2 d-flex flex-column align-items-center justify-content-around">
                                                <ToggleSwitch name="Highpass" value={fxHighpass} onToggle={setFxHighpass} />
                                                <ToggleSwitch name="Lowpass" value={fxLowpass} onToggle={setFxLowpass} />
                                                <ToggleSwitch name="Overdrive" value={fxOverdrive} onToggle={setFxOverdrive} />
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
        </div >
    );
}