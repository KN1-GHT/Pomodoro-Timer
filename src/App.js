import React, { useState, useEffect } from "react";

const App = () => {
  const [time, setTime] = useState(25 * 60); // Default focus time is 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // Modes: "focus", "shortBreak", "longBreak"

  const focusTime = 25 * 60; // 25 minutes in seconds
  const shortBreakTime = 1 * 2; // 5 minutes in seconds
  const longBreakTime = 15 * 60; // 15 minutes in seconds

  // Use an online sound for the notification
  const beepSound = new Audio(process.env.PUBLIC_URL + "/assets/digital-alarm-beeping-slava-pogorelsky-1-00-06.mp3");

  // Toggle the timer on and off
  const toggleTimer = () => setIsActive(!isActive);

  // Reset the timer based on the current mode
  const resetTimer = () => {
    setIsActive(false);
    setTime(getModeTime(mode));
  };

  // Set the time based on the current mode
  const getModeTime = (mode) => {
    return mode === "focus" ? focusTime : mode === "shortBreak" ? shortBreakTime : longBreakTime;
  };

  // Switch between focus, short break, and long break modes
  const switchMode = (newMode) => {
    setMode(newMode);
    setTime(getModeTime(newMode));
    setIsActive(false);
  };

  // Timer countdown logic
  useEffect(() => {
    if (isActive && time > 0) {
      const interval = setInterval(() => setTime((time) => time - 1), 1000);
      return () => clearInterval(interval);
    } else if (time === 0) {
      // Play the beep sound when the timer hits zero
      beepSound.play();

      // Auto switch to break or focus after completion
      if (mode === "focus") {
        switchMode("shortBreak");
      } else {
        switchMode("focus");
      }
    }
  }, [isActive, time, mode, beepSound]);

  // Format time in mm:ss
  const formatTime = () => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Determine background color based on the current mode
  const getBackgroundColor = () => {
    switch (mode) {
      case "focus":
        return "bg-green-300";
      case "shortBreak":
        return "bg-blue-300";
      case "longBreak":
        return "bg-purple-300";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${getBackgroundColor()}`}
    >
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Pomodoro Timer</h1>

      {/* Timer display */}
      <div className="text-8xl font-mono mb-8 text-gray-800">{formatTime()}</div>

      {/* Timer Controls */}
      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className="bg-gray-700 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-semibold hover:bg-gray-800 transition duration-300"
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="bg-red-700 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-semibold hover:bg-red-800 transition duration-300"
        >
          Reset
        </button>
      </div>

      {/* Mode Selection */}
      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => switchMode("focus")}
          className={`px-6 py-2 rounded-lg shadow-md font-semibold transition duration-300 ${mode === "focus" ? "bg-green-700 text-white" : "bg-white text-gray-800"
            }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode("shortBreak")}
          className={`px-6 py-2 rounded-lg shadow-md font-semibold transition duration-300 ${mode === "shortBreak" ? "bg-blue-700 text-white" : "bg-white text-gray-800"
            }`}
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode("longBreak")}
          className={`px-6 py-2 rounded-lg shadow-md font-semibold transition duration-300 ${mode === "longBreak" ? "bg-purple-700 text-white" : "bg-white text-gray-800"
            }`}
        >
          Long Break
        </button>
      </div>
    </div>
  );
};

export default App;
