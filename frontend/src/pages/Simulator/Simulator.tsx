import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Simulator.module.scss';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';

const IconMic = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
);

const IconMicOff = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
);

const IconSend = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
  </svg>
);

const IconChevronDown = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"/></svg>
);

const IconChevronUp = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="18 15 12 9 6 15"/></svg>
);

const IconClock = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const IconLogout = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const IconShieldAlert = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

const IconScale = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/>
    <path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
);

const IconX = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconLightbulb = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);
const IconVolume2 = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
);

const IconPause = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);

interface CaseFacts {
  title: string;
  type: string;
  facts: string;
  evidence: string[];
  legal_provisions: string[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'judge' | 'opponent' | 'system';
  text: string;
  scores?: {
    legal: number;
    reasoning: number;
    evidence: number;
    overall: number;
    turn_score: number;
    cumulative_score: number;
    performance_tier: string;
  };
  suggestions?: string[];
  incorrect_sections?: { section: string; reason: string }[];
}

const Simulator = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string>('');
  const [caseFacts, setCaseFacts] = useState<CaseFacts | null>(null);
  const [phase, setPhase] = useState<string>('opening_statement');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioStatus, setAudioStatus] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // TTS State
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const playingRef = useRef<string | null>(null);


  // Realistic Courtroom Time
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Initialize Session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/session/create", {
          case_id: caseId,
          user_id: "demo_user_001",
          mode: "criminal" 
        });
        
        setSessionId(res.data.session_id);
        setCaseFacts(res.data.case_facts);
        setPhase(res.data.current_phase);
        
        setMessages([{
          id: 'welcome',
          type: 'system',
          text: `Court is now in session. Phase: ${res.data.current_phase.replace('_', ' ').toUpperCase()}`
        }]);
      } catch (err) {
        console.error("Failed to map session", err);
      }
    };
    
    if (caseId) initSession();
  }, [caseId]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. Handle Audio Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioStatus('Recording...');
    } catch (err) {
      console.error("Microphone access denied or failed", err);
      setAudioStatus('Microphone access failed.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioStatus('Processing audio...');
    }
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  // TTS: play opponent's text via /tts endpoint
  // const playOpponentTTS = async (msgId: string, text: string) => {
  //   // Stop any currently playing audio first
  //   if (ttsAudioRef.current) {
  //     ttsAudioRef.current.pause();
  //     ttsAudioRef.current.src = '';
  //     ttsAudioRef.current = null;
  //   }

  //   // If clicking the same message that was playing, just stop it
  //   if (playingMsgId === msgId) {
  //     setPlayingMsgId(null);
  //     return;
  //   }

  //   setPlayingMsgId(msgId);

  //   try {
  //     const encodedText = encodeURIComponent(text);
  //     const url = `http://localhost:8000/tts?text=${encodedText}&role=opponent`;

  //     const response = await fetch(url);
  //     if (!response.ok) throw new Error(`TTS request failed: ${response.status}`);

  //     const audioBlob = await response.blob();
  //     const audioUrl = URL.createObjectURL(audioBlob);

  //     const audio = new Audio(audioUrl);
  //     ttsAudioRef.current = audio;

  //     audio.onended = () => {
  //       setPlayingMsgId(null);
  //       URL.revokeObjectURL(audioUrl);
  //       ttsAudioRef.current = null;
  //     };

  //     audio.onerror = () => {
  //       setPlayingMsgId(null);
  //       URL.revokeObjectURL(audioUrl);
  //       ttsAudioRef.current = null;
  //     };

  //     await audio.play();
  //   } catch (err) {
  //     console.error('TTS playback failed:', err);
  //     setPlayingMsgId(null);
  //   }
  // };
  
const playFastTTS = async (msgId: string, text: string) => {
  // Stop previous audio
  if (ttsAudioRef.current) {
    ttsAudioRef.current.pause();
    ttsAudioRef.current = null;
  }

  // Toggle behavior
  if (playingRef.current === msgId) {
    playingRef.current = null;
    setPlayingMsgId(null);
    return;
  }

  playingRef.current = msgId;
  setPlayingMsgId(msgId);

  try {
    const chunks = text.match(/.{1,200}(\s|$)/g) || [];

    for (let i = 0; i < chunks.length; i++) {
      // ✅ Use ref instead of state
      if (playingRef.current !== msgId) break;

      const encodedText = encodeURIComponent(chunks[i]);

      const response = await fetch(
        `http://localhost:8000/tts?text=${encodedText}&role=opponent`
      );

      if (!response.ok) throw new Error("TTS failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      ttsAudioRef.current = audio;

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = reject;
        audio.play().catch(reject);
      });
    }

  } catch (err) {
    console.error("Fast TTS error:", err);
  } finally {
    playingRef.current = null;
    setPlayingMsgId(null);
  }
};

  // const pauseTTS = () => {
  //   if (ttsAudioRef.current) {
  //     ttsAudioRef.current.pause();
  //     ttsAudioRef.current.src = '';
  //     ttsAudioRef.current = null;
  //   }
  //   setPlayingMsgId(null);
  // };

  const pauseTTS = () => {
  if (ttsAudioRef.current) {
    ttsAudioRef.current.pause();
    ttsAudioRef.current.src = '';
    ttsAudioRef.current = null;
  }
  playingRef.current = null; // ✅ important
  setPlayingMsgId(null);
};


  const processAudioUpload = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      const res = await axios.post("http://localhost:8000/api/audio/speech-to-text", formData);
      if (res.data.transcript) {
        setInputText(res.data.transcript);
        setAudioStatus('Translation successful.');
        setTimeout(() => setAudioStatus(''), 3000);
      }
    } catch (err) {
      console.error('STT failed', err);
      setAudioStatus('Translation failed.');
    }
  };

  // 3. Handle Argument Submission
  const submitArgument = async () => {
    if (!inputText.trim() || !sessionId) return;
    
    const rx = /section\s*(\d+[A-Z]?)/gi;
    const cited: string[] = [];
    let match;
    while ((match = rx.exec(inputText)) !== null) {
      cited.push(match[1]);
    }

    const newMsg: ChatMessage = { id: Date.now().toString(), type: 'user', text: inputText };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setLoading(true);

    try {
      let mappedPhase = phase;
      if (mappedPhase === "opening_statements") mappedPhase = "opening_statement";
      if (mappedPhase === "closing_statements") mappedPhase = "closing_statement";

      const res = await axios.post("http://localhost:8000/api/argument/submit", {
        session_id: sessionId,
        argument_text: newMsg.text,
        cited_sections: cited,
        evidence_references: [],
        phase: mappedPhase
      });

      const { 
        feedback, 
        legal_accuracy_score, 
        reasoning_score, 
        evidence_score, 
        overall_score, 
        opponent_response 
      } = res.data;

      setMessages(prev => {
        const newMessages = [...prev];
        
        newMessages.push({
          id: Date.now().toString() + '_judge',
          type: 'judge',
          text: feedback || "Your argument has been received and evaluated by the bench.",
          scores: {
            legal: legal_accuracy_score ?? 0,
            reasoning: reasoning_score ?? 0,
            evidence: evidence_score ?? 0,
            overall: overall_score ?? 0,
            turn_score: res.data.turn_score ?? 0,
            cumulative_score: res.data.cumulative_score ?? 0,
            performance_tier: res.data.performance_tier ?? 'Law Student',
          },
          suggestions: res.data.suggestions ?? [],
          incorrect_sections: res.data.incorrect_sections ?? [],
        });

        if (opponent_response) {
          newMessages.push({
            id: Date.now().toString() + '_opp',
            type: 'opponent',
            text: opponent_response
          });
        }
        
        return newMessages;
      });
      
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_err',
        type: 'system',
        text: `Error submitting argument: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = () => {
    if (window.confirm("Are you sure you want to terminate this courtroom session? Any unsaved progress will be lost.")) {
      navigate('/cases');
    }
  };

  if (!caseFacts) return (
    <div className={styles.loadingContainer}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className={styles.loader}
      />
      <p>Consulting Judicial Records...</p>
    </div>
  );

  return (
    <div className={styles.fullPage}>
      <Navbar />
      
      <div className={styles.simulatorContainer}>
        
        {/* LEFT PANE - CASE FACTS */}
        <div className={styles.leftPane}>
          <div className={styles.caseHeader}>
            <h2>{caseFacts.title}</h2>
            <div className={styles.meta}>
              <span className={styles.type}>{caseFacts.type}</span>
              <span className={styles.phaseBadge}>{phase.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>

          <div className={styles.paneScroll}>
            <div className={styles.section}>
              <h3><IconShieldAlert size={18} /> Brief Facts</h3>
              <p>{caseFacts.facts}</p>
            </div>

            <div className={styles.section}>
              <h3>Evidence & Exhibits</h3>
              <ul className={styles.evidenceList}>
                {caseFacts.evidence?.map((item, idx) => (
                  <li key={idx}><span className={styles.bullet}>•</span> {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.sideControls}>
             <div className={styles.timer}>
                <IconClock size={16} />
                <span>Session Time Remaining: <strong>{formatTime(timeLeft)}</strong></span>
             </div>
             <button className={styles.terminateBtn} onClick={terminateSession}>
                <IconLogout size={16} /> Terminate Session
             </button>
          </div>
        </div>

        {/* RIGHT PANE - SIMULATOR CHAT */}
        <div className={styles.rightPane}>
          <div className={styles.chatFeed}>
            {messages.map((m) => (
              <div key={m.id} className={`${styles.messageCard} ${styles[m.type]}`}>
                 {m.type === 'user' && <div className={styles.role}>Your Argument</div>}
                 
                 {m.type === 'opponent' && (
                   <div className={styles.opponentHeader}>
                     <div className={styles.role}>Opposing Counsel</div>
                     <button
                       className={`${styles.ttsBtn} ${playingMsgId === m.id ? styles.ttsBtnPlaying : ''}`}
                       onClick={() => playingMsgId === m.id ? pauseTTS() : playFastTTS(m.id, m.text)}
                       title={playingMsgId === m.id ? 'Pause' : 'Play voice'}
                     >
                       {playingMsgId === m.id
                         ? <IconPause size={14} />
                         : <IconVolume2 size={14} />}
                       {playingMsgId === m.id ? 'Pause' : 'Speak'}
                     </button>
                   </div>
                 )}
                 
                 {m.type === 'judge' ? (
                   <JudgeResponse m={m} />
                 ) : (
                   <div className={styles.messageText}>{m.text}</div>
                 )}
              </div>
            ))}
            {loading && (
  <div className={styles.aiThinking}>
    <div className={styles.wave}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div className={styles.thinkingText}>
      The Judge is analyzing your argument...
    </div>
  </div>
)}
            <div ref={chatEndRef} />
          </div>

          <div className={styles.inputArea}>
            <AnimatePresence>
              {audioStatus && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={styles.statusText}
                >
                  {audioStatus}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className={styles.controls}>
              <button 
                className={`${styles.recordBtn} ${isRecording ? styles.recording : ''}`}
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <IconMic className={styles.micIcon} />
                  </motion.div>
                ) : (
                  <IconMic className={styles.micIcon} />
                )}
                {isRecording ? 'Stop' : 'Speak'}
              </button>
              
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Submit your oral or written argument here..."
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitArgument(); }
                }}
              />
              
              <button 
                className={styles.submitBtn} 
                onClick={submitArgument}
                disabled={loading || !inputText.trim()}
              >
                <IconSend size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Judge Response Dropdown
const JudgeResponse = ({ m }: { m: ChatMessage }) => {
  const [isOpen, setIsOpen] = useState(false); // closed by default

  const [summary, detailed] = m.text.includes("Detailed Analysis:") 
    ? m.text.split("Detailed Analysis:") 
    : [m.text, ""];

  return (
    <div className={styles.judgeContainer}>
      <div className={styles.judgeHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.role} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconScale size={16} /> JUDGE'S EVALUATION
        </div>
        <div className={styles.judgeHeaderRight}>
          {m.scores && (
            <span className={styles.overallPill}>{m.scores.overall}% Overall</span>
          )}
          {isOpen ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className={styles.judgeContent}>
          {/* Feedback Text Formatted */}
          <div className={styles.messageText}>
            {summary.split('\n\n').map((paragraph, idx) => {
              if (!paragraph.trim()) return null;
              return <p key={idx} style={{ marginBottom: '1rem' }}>{paragraph}</p>;
            })}
            
            {detailed && (
              <div style={{ marginTop: '2rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem' }}>Detailed Analysis:</div>
                <p>{detailed.trim()}</p>
              </div>
            )}
          </div>

          {/* Scores */}
          {m.scores && (
            <div className={styles.scoresGrid}>
              <div className={styles.scoreItem}>
                <div className={styles.scoreHeader}>
                  <span>Legal Accuracy</span>
                  <span className={styles.scoreVal}>{m.scores.legal}/100</span>
                </div>
                <div className={styles.progressBar}><div style={{width: `${m.scores.legal}%`}} /></div>
              </div>
              <div className={styles.scoreItem}>
                <div className={styles.scoreHeader}>
                  <span>Reasoning & Logic</span>
                  <span className={styles.scoreVal}>{m.scores.reasoning}/100</span>
                </div>
                <div className={styles.progressBar}><div style={{width: `${m.scores.reasoning}%`}} /></div>
              </div>
              <div className={styles.scoreItem}>
                <div className={styles.scoreHeader}>
                  <span>Evidence Use</span>
                  <span className={styles.scoreVal}>{m.scores.evidence}/100</span>
                </div>
                <div className={styles.progressBar}><div style={{width: `${m.scores.evidence}%`}} /></div>
              </div>
              <div className={styles.overallScoreBadge}>
                <div>
                  <div style={{fontSize:'0.75rem',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'2px'}}>Performance Tier</div>
                  <div style={{fontWeight:700,color:'#0f172a'}}>{m.scores.performance_tier}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'0.75rem',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'2px'}}>Court Impact</div>
                  <div className={styles.boldVal}>{m.scores.overall}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Incorrect Sections */}
          {m.incorrect_sections && m.incorrect_sections.length > 0 && (
            <div className={styles.incorrectSections}>
              <div className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconX size={16} /> INCORRECT CITATIONS
              </div>
              {m.incorrect_sections.map((s, i) => (
                <div key={i} className={styles.incorrectItem}>
                  <span className={styles.sectionTag}>Sec. {s.section}</span>
                  <span>{s.reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {m.suggestions && m.suggestions.length > 0 && (
            <div className={styles.suggestions}>
              <div className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconLightbulb size={16} /> SUGGESTIONS
              </div>
              <ul>
                {m.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Simulator;