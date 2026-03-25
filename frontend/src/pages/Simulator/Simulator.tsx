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
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
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

// Interfaces matching backend schemas
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
  };
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

      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_judge',
        type: 'judge',
        text: feedback,
        scores: {
          legal: legal_accuracy_score,
          reasoning: reasoning_score,
          evidence: evidence_score,
          overall: overall_score
        }
      }]);

      if (opponent_response) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_opp',
          type: 'opponent',
          text: opponent_response
        }]);
      }
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
                 {m.type === 'opponent' && <div className={styles.role}>Opposing Counsel</div>}
                 
                 {m.type === 'judge' ? (
                   <JudgeResponse m={m} />
                 ) : (
                   <div className={styles.messageText}>{m.text}</div>
                 )}
              </div>
            ))}
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.typingIndicator}
              >
                The Judge is analyzing your argument...
              </motion.div>
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.judgeContainer}>
      <div className={styles.judgeHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.role}>Judge's Feedback & Evaluation</div>
        {isOpen ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.judgeContent}
          >
            <div className={styles.messageText}>{m.text}</div>
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
                <div className={styles.overallScoreBadge}>
                  <span>Overall Court Impact</span>
                  <div className={styles.boldVal}>{m.scores.overall}%</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Simulator;
