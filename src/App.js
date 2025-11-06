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

    const [songText, setSongText] = useState(stranger_tune(1));
    const [volume, setVolume] = useState(1);
    const [cpm, setCpm] = useState(140);
    const [state, setState] = useState("stop");

    const handlePlay = () => {
        //let outputText = PreprocessText({ inputText: songText, volume: volume });
        //globalEditor.setCode(outputText);
        globalEditor.evaluate();
    }

    const handleStop = () => {
        globalEditor.stop();
    }

    useEffect(() => {
        if (globalEditor) {
            const updatedTune = stranger_tune(volume, cpm);
            globalEditor.setCode(updatedTune);

            if (state === "play") {
                handlePlay();
            }
        }
    }, [volume, cpm])

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
            
        document.getElementById('proc').value = stranger_tune
        //SetupButtons()
        //Proc()
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
                                            <ProcButton btnId="save" name="save" backgroundColor="grey" />
                                            <ProcButton btnId="load" name="load" backgroundColor="grey" />
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
                                                <RadioButton backgroundColor='#ff5757' />
                                                <RadioButton backgroundColor='#ffbd59' />
                                                <RadioButton backgroundColor='#ffde59' />
                                            </div>
                                            <div className="row">
                                                <RadioButton backgroundColor="#ff66c4" />
                                                <RadioButton backgroundColor='#7ed957' />
                                                <RadioButton backgroundColor='#e2a9f1' />
                                            </div>
                                            <div className="row">
                                                <RadioButton backgroundColor='#5ce1e6' />
                                                <RadioButton backgroundColor='#8c52ff' />
                                                <RadioButton backgroundColor='#c1ff72' />
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