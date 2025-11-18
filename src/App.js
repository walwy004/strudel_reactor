import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import RadioButton from './components/RadioButton';
import ProcButton from './components/ProcButton';
import ToggleSwitch from './components/ToggleSwitch';
import Slider from './components/Slider';
import CPM from './components/CPM';
import PreprocessingTextarea from './components/PreprocessingTextarea';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};


export default function StrudelDemo() {

    const hasRun = useRef(false);

    const [state, setState] = useState("stop");
    const [songText, setSongText] = useState(stranger_tune(1));
    const [volume, setVolume] = useState(1);
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

    const handleRadioPattern = () => {
        radioPattern === 0 ? setRadioPattern(1) : setRadioPattern(0)
    }

    const handleRadioBass = () => {
        radioBass === 0 ? setRadioBass(1) : setRadioBass(0)
    }

    const handleSaveSettings = () => {
        const json = {
            songText,
            volume,
            cpm,
            radioInstruments,
            radioArp,
            radioPattern,
            radioBass
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
        setCpm(json.cpm);
        setRadioInstruments(json.radioInstruments);
        setRadioArp(json.radioArp);
        setRadioPattern(json.radioPattern);
        setRadioBass(json.radioBass);

        alert("Settings loaded!");
    }

    useEffect(() => {
        if (globalEditor) {
            const updatedTune = stranger_tune(volume, cpm, radioInstruments, radioArp, radioPattern, radioBass);
            globalEditor.setCode(updatedTune);

            if (state === "play") {
                handlePlay();
            }
        }
    }, [volume, cpm, radioInstruments, radioArp, radioPattern, radioBass])

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
                    
                    <div className="col-md-6 d-flex jusitify-content-center align-items-center">
                        <div className="container">

                            {/*Grid for pads and toggles*/}
                            <div className="row">

                                {/*Left Controls*/}
                                <div className="col-md-4">

                                    {/*CPM*/}
                                    <div className="row d-flex justify-content-center">
                                        <CPM onCPMChange={(e) => setCpm(e.target.value)} />
                                    </div>

                                    {/*Sliders*/}
                                    <div className="row d-flex justify-content-center">
                                        <div className="col-4">
                                            <Slider onVolumeChange={(e) => setVolume(e.target.value)} sliderId="volume" name="Volume" />
                                        </div>
                                        <div className="col-4">
                                            <Slider sliderId="effect" name="Effect" />
                                        </div>
                                        <div className="col-8"></div>
                                    </div>
                                    
                                    {/*Proc buttons*/}
                                    <div className="row">
                                        <div className="d-flex flex-wrap justify-content-center gap-2">
                                            <ProcButton onClick={handleSaveSettings} btnId="save" name="save" backgroundColor="grey" />
                                            <ProcButton onClick={handleLoadSettings} btnId="load" name="load" backgroundColor="grey" />
                                            <ProcButton onClick={() => { setState("play"); handlePlay() }} btnId="play" name="play" backgroundColor="#7ed957" />
                                            <ProcButton onClick={() => { setState("stop"); handleStop() }} btnId="stop" name="stop" backgroundColor="red" />
                                        </div>
                                    </div>
                                    

                                </div>

                                {/*Right Controls*/}
                                <div className="col-md-8">

                                    {/*Radio buttons*/}
                                    <div className="row">
                                        <div className="col-10">
                                            <div className="row">
                                                <RadioButton btnId='bassline' onClick={() => handleRadioInstruments('bassline')} backgroundColor='#ff5757' />
                                                <RadioButton btnId='main_arp' onClick={() => handleRadioInstruments('main_arp')} backgroundColor='#ffbd59' />
                                                <RadioButton btnId='drums1' onClick={() => handleRadioInstruments('drums1')} backgroundColor='#ffde59' />
                                            </div>
                                            <div className="row">
                                                <RadioButton btnId='drums2' onClick={() => handleRadioInstruments('drums2')} backgroundColor="#ff66c4" />
                                                <RadioButton btnId='' backgroundColor='#7ed957' />
                                                <RadioButton btnId='' backgroundColor='#e2a9f1' />
                                            </div>
                                            <div className="row">
                                                <RadioButton btnId='arp' onClick={() => handleRadioArp()} backgroundColor='#5ce1e6' />
                                                <RadioButton btnId='pattern' onClick={() => handleRadioPattern()} backgroundColor='#8c52ff' />
                                                <RadioButton btnId='bass' onClick={() => handleRadioBass()} backgroundColor='#c1ff72' />
                                            </div>
                                        </div>

                                        {/*Toggle Switches*/}
                                        <div className="col-2 d-flex flex-column align-items-center justify-content-around">
                                            <ToggleSwitch />
                                            <ToggleSwitch />
                                            <ToggleSwitch />
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