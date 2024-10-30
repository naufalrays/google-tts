import "./App.css";
import { useState } from "react";
import axios from "axios";
import { modelOptions } from './modelOptions';

function App() {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [volumeGain, setVolumeGain] = useState(0);
  const [modelType, setModelType] = useState("Journey"); // Default type
  const [modelOption, setModelOption] = useState("en-US-Journey-O"); // Default option
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipVisiblePitch, setTooltipVisiblePitch] = useState(false);
  const [tooltipVisibleVolume, setTooltipVisibleVolume] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false);


  const handleSynthesize = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;

    const response = await axios.post(`${backendURL}/synthesize`, {
      text,
      model_name: modelOption,
      speaking_rate: speed,
      pitch,
      volume_gain_db: volumeGain,
    });
    const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
    setAudioSrc(audioSrc);
  };

  const handleTypeChange = (type) => {
    setModelType(type);
    setModelOption(modelOptions[type][0]); // Set default option for the new type
    setTypeDropdownOpen(false);
    setOptionDropdownOpen(false); // Close the option dropdown
  };

  return (
    <div className="App flex flex-col items-start p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Text To Speech</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        id="message"
        rows="4"
        className="block p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mb-4"
        placeholder="Enter text to synthesize"
      ></textarea>

      {/* Model Type Dropdown */}
      <label className="mb-2 text-sm font-semibold">Voice Model Type</label>
      <div className="relative mb-4">
        <button
          onClick={() => {
            setTypeDropdownOpen(!typeDropdownOpen);
            setOptionDropdownOpen(false);
          }}
          className="bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          type="button"
        >
          {modelType}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {typeDropdownOpen && (
          <div className="absolute z-10 bg-white border border-gray-300 divide-y divide-gray-100 rounded-lg shadow w-44 mt-1">
            {Object.keys(modelOptions).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Model Option Dropdown */}
      <label className="mb-2 text-sm font-semibold">Voice Model Option</label>
      <div className="relative mb-4">
        <button
          onClick={() => setOptionDropdownOpen(!optionDropdownOpen)}
          className="bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          type="button"
        >
          {modelOption}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {optionDropdownOpen && (
          <div className="absolute z-10 bg-white border border-gray-300 divide-y divide-gray-100 rounded-lg shadow w-44 mt-1">
            {modelOptions[modelType].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setModelOption(option);
                  setOptionDropdownOpen(false);
                }}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Speed Control */}
      <label className="mb-2 text-sm font-semibold">Speed</label>
      <div className="relative mb-4 flex items-center">
        <span className="mr-2 text-sm">0.25</span>
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.05"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          className="w-32"
        />
        <span className="ml-2 text-sm">4</span>

        {tooltipVisible && (
          <div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1"
            style={{ zIndex: 10 }}
          >
            {speed.toFixed(2)}
          </div>
        )}
      </div>

      {/* Pitch Control */}
      <label className="mb-2 text-sm font-semibold">Pitch</label>
      <div className="relative mb-4 flex items-center">
        <span className="mr-2 text-sm">-20</span>
        <input
          type="range"
          min="-20"
          max="20"
          step="0.5"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          onMouseEnter={() => setTooltipVisiblePitch(true)}
          onMouseLeave={() => setTooltipVisiblePitch(false)}
          className="w-32"
        />
        <span className="ml-2 text-sm">20</span>

        {tooltipVisiblePitch && (
          <div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1"
            style={{ zIndex: 10 }}
          >
            {pitch.toFixed(1)}
          </div>
        )}
      </div>

      {/* Volume Gain Control */}
      <label className="mb-2 text-sm font-semibold">Volume Gain (dB)</label>
      <div className="relative mb-4 flex items-center">
        <span className="mr-2 text-sm">-96</span>
        <input
          type="range"
          min="-96"
          max="16"
          step="1"
          value={volumeGain}
          onChange={(e) => setVolumeGain(parseInt(e.target.value, 10))}
          onMouseEnter={() => setTooltipVisibleVolume(true)}
          onMouseLeave={() => setTooltipVisibleVolume(false)}
          className="w-32"
        />
        <span className="ml-2 text-sm">16</span>

        {tooltipVisibleVolume && (
          <div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1"
            style={{ zIndex: 10 }}
          >
            {volumeGain}
          </div>
        )}
      </div>

      <button
        onClick={handleSynthesize}
        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Synthesize
      </button>

      {audioSrc && (
        <div className="mt-4">
          <audio controls src={audioSrc} />
        </div>
      )}
    </div>
  );
}

export default App;
