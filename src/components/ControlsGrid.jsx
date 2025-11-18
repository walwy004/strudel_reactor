import RadioButton from './RadioButton';
import ProcButton from './ProcButton';
import ToggleSwitch from './ToggleSwitch';
import Slider from './Slider';
import CPM from './CPM';

export default function ControlsGrid({
    cpm, setCpm,
    volume, setVolume,
    reverb, setReverb,
    handleSaveSettings,
    handleLoadSettings,
    handlePlay,
    handleStop,
    setState,
    handleRadioInstruments,
    handleRadioArp,
    handleRadioPattern,
    handleRadioBass,
    fxReverb, setFxReverb,
    fxLowpass, setFxLowpass,
    fxOverdrive, setFxOverdrive,
}) {
    return (
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

                            {/* Toggle Switches */}
                            <div className="col-2 d-flex flex-column align-items-center justify-content-around">
                                <ToggleSwitch value={fxReverb} onToggle={setFxReverb} />
                                <ToggleSwitch value={fxLowpass} onToggle={setFxLowpass} />
                                <ToggleSwitch value={fxOverdrive} onToggle={setFxOverdrive} />
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}