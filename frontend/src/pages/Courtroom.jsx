import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Courtroom() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const [typedInput, setTypedInput] = useState("");

  const [userText, setUserText] = useState(
    "Your speech will appear here..."
  );

  const [aiText, setAiText] = useState(
    "AI opponent will respond here..."
  );

  const [judgeText, setJudgeText] = useState(
    "Waiting for judge to begin..."
  );

  const [status, setStatus] = useState("Idle");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // TIMER
  useEffect(() => {
    if (!timerStarted) return;

    if (timeLeft <= 0) {
      setTimerStarted(false);
      setTimeUp(true);
      setJudgeText(
        "Time's up. Please proceed to the scorecard."
      );
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted, timeLeft]);

  // START COURT SESSION
  const startCourt = () => {
    setJudgeText(
      "The court is now in session. Let the proceedings begin."
    );

    setTimerStarted(true);
    setTimeUp(false);
    setTimeLeft(60);
  };

  // RECORD USER SPEECH
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.start();

      setStatus("Recording...");
    } catch (err) {
      setStatus("Microphone permission denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setStatus("Recording stopped");
    }
  };

  // SUBMIT TYPED TEXT OR AUDIO
  const submitArgument = async () => {
    // If user typed text
    if (typedInput.trim() !== "") {
      setUserText(typedInput);
      setTypedInput("");

      setAiText(
        "AI opponent is generating counter-argument..."
      );

      setJudgeText(
        "Judge is evaluating logic and legal references..."
      );

      setStatus("Argument submitted");

      return;
    }

    // Otherwise send audio
    setStatus("Processing speech...");

    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/webm",
    });

    const formData = new FormData();
    formData.append("file", audioBlob);

    try {
      const response = await fetch(
        "http://localhost:8000/speech-to-text",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setUserText(data.transcript);

      setAiText(
        "AI opponent is generating counter-argument..."
      );

      setJudgeText(
        "Judge is evaluating logic and legal references..."
      );

      setStatus("Transcript received");
    } catch (error) {
      setStatus("Error calling API");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-6">

      {/* START BUTTON */}
      {!timerStarted && !timeUp && (
        <div className="flex justify-center mb-6">
          <button
            onClick={startCourt}
            className="bg-green-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
          >
            Start Court Session
          </button>
        </div>
      )}

      {/* TIMER */}
      <AnimatePresence>
        {timerStarted && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="flex justify-center mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-3 bg-red-600 px-6 py-3 rounded-full shadow-xl text-lg font-bold"
            >
              <i className="fas fa-clock"></i>
              Time Left: {timeLeft}s
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TIME UP PANEL */}
      <AnimatePresence>
        {timeUp && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center mb-6 gap-4"
          >
            <div className="bg-red-700 px-8 py-4 rounded-xl text-xl font-bold shadow-lg">
              Time's Up
            </div>

            <button
              onClick={() =>
                (window.location.href = "/scorecard")
              }
              className="bg-purple-600 px-8 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              View Scorecard
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* HISTORY */}
        <div className="bg-gray-800 rounded-2xl p-5 shadow-lg h-[460px]">
          <h2 className="font-semibold text-lg mb-3">
            Past Arguments
          </h2>

          <div className="space-y-3 text-gray-300 text-sm">
            <div className="bg-gray-700 p-3 rounded-lg">
              Previous argument example...
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              Another past argument...
            </div>
          </div>
        </div>

        {/* USER PANEL */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-2xl p-6 shadow-xl text-center h-[460px] flex flex-col"
        >
          <i className="fas fa-user-circle text-6xl text-blue-400 mb-3"></i>

          <h2 className="text-xl font-semibold">
            User
          </h2>

          {/* SPEECH DISPLAY */}
          <div className="mt-4 bg-gray-700 p-4 rounded-lg text-gray-200 min-h-[120px]">
            {userText}
          </div>

          {/* INPUT INSIDE USER BOX */}
          <input
            type="text"
            placeholder="Type your argument..."
            value={typedInput}
            onChange={(e) =>
              setTypedInput(e.target.value)
            }
            className="mt-4 px-4 py-2 rounded-lg text-black"
          />

          {/* USER CONTROLS */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={startRecording}
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <i className="fas fa-play"></i>
            </button>

            <button
              onClick={stopRecording}
              className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              <i className="fas fa-stop"></i>
            </button>

            <button
              onClick={submitArgument}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </motion.div>

        {/* JUDGE */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-2xl p-6 shadow-xl text-center h-[460px]"
        >
          <i className="fas fa-gavel text-6xl text-yellow-400 mb-3"></i>

          <h2 className="text-xl font-semibold">
            Judge (AI)
          </h2>

          <div className="mt-4 bg-gray-700 p-4 rounded-lg text-gray-200 min-h-[220px]">
            {judgeText}
          </div>
        </motion.div>

        {/* AI OPPONENT */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-2xl p-6 shadow-xl text-center h-[460px]"
        >
          <i className="fas fa-robot text-6xl text-purple-400 mb-3"></i>

          <h2 className="text-xl font-semibold">
            AI Opponent
          </h2>

          <div className="mt-4 bg-gray-700 p-4 rounded-lg text-gray-200 min-h-[220px]">
            {aiText}
          </div>
        </motion.div>

      </div>

      {/* STATUS */}
      <div className="text-center mt-4 text-gray-300">
        Status: {status}
      </div>

    </div>
  );
}
