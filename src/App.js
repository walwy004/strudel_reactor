import './App.css';
import { useEffect, useRef } from "react";
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

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export function SetupButtons() {

    //document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
    //document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
    //document.getElementById('process').addEventListener('click', () => {
    //    Proc()
    //}
    //)
    //document.getElementById('process_play').addEventListener('click', () => {
    //    if (globalEditor != null) {
    //        Proc()
    //        globalEditor.evaluate()
    //    }
    //}
    //)
}



export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

export function Proc() {

    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)
}

export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

export default function StrudelDemo() {

const hasRun = useRef(false);

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
        SetupButtons()
        Proc()
    }

}, []);


return (
    <div>
        <h2>Strudel Demo</h2>
        <main>

            <div className="container-fluid">
                <div className="row">

                    <div className="col-md-6" >
                        <div className="row-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Text to preprocess:</label>
                            <textarea className="form-control" rows="15" id="proc" ></textarea>
                        </div>

                        <div className="row-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <div id="editor" />
                            <div id="output" />
                        </div>
                    </div>
                    
                    <div className="col-6 d-flex jusitify-content-center align-items-center">
                        <div className="container">

                            {/* Grid for pads and toggles */}
                            <div className="row mb-3">

                                {/*Proc buttons*/}
                                <div className="col-3">
                                    <ProcButton btnId="save" name="save" backgroundColor="grey" />
                                    <ProcButton btnId="load" name="load" backgroundColor="grey" />
                                    <ProcButton btnId="play" name="play" backgroundColor="#7ed957" />
                                    <ProcButton btnId="stop" name="stop" backgroundColor="red" />
                                </div>

                                {/*Radio buttons*/}
                                <div className="row">
                                    <div className="col-7 d-flex flex-column">
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

                            {/*TO BE DELETED*/}
                            <div className="row">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={ProcAndPlay} defaultChecked />
                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                        p1: ON
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={ProcAndPlay} />
                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                        p1: HUSH
                                    </label>
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