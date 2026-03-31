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
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" /></svg>
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
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/><path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
);
const IconX = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconLightbulb = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);
const IconVolume2 = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
);
const IconPause = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);
const IconRobot = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="8" width="18" height="12" rx="2"/>
    <path d="M12 8V4"/><circle cx="12" cy="3" r="1"/>
    <path d="M8 13h.01M16 13h.01"/><path d="M9 17h6"/>
  </svg>
);
const IconUsers = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconArrowRight = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
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

type GameMode = 'ai' | 'opponent' | null;

// ── MODE SELECTION MODAL ──────────────────────────────────────────────────────
const ModeSelectionModal = ({
  caseTitle,
  onSelect,
  onClose,
}: {
  caseTitle: string;
  onSelect: (mode: GameMode) => void;
  onClose: () => void;
}) => (
  <AnimatePresence>
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modeModal}
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      >
        {/* Navy hero strip */}
        <div className={styles.modalGavel}>
          <IconScale size={34} />
        </div>

        <button className={styles.modalClose} onClick={onClose}>
          <IconX size={16} />
        </button>

        <div className={styles.modalHeader}>
          <span className={styles.modalEyebrow}>Select Simulation Mode</span>
          <h2 className={styles.modalTitle}>{caseTitle}</h2>
          <p className={styles.modalSub}>How would you like to argue this case?</p>
        </div>

        <div className={styles.modeCards}>
          <motion.button
            className={styles.modeCard}
            data-mode="ai"
            onClick={() => onSelect('ai')}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.modeCardIcon}><IconRobot size={26} /></div>
            <div className={styles.modeCardBody}>
              <h3>Play vs AI</h3>
              <p>Argue against an AI-powered opposing counsel with real-time judge feedback, scoring, and strategy tips.</p>
              <ul className={styles.modeFeatures}>
                <li>AI opponent adapts to your arguments</li>
                <li>Instant scoring & analysis</li>
                <li>Voice-to-text support</li>
              </ul>
            </div>
            <div className={styles.modeCardCta}>
              Begin Simulation <IconArrowRight size={14} />
            </div>
          </motion.button>

          <motion.button
            className={styles.modeCard}
            data-mode="opponent"
            onClick={() => onSelect('opponent')}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.modeCardIcon}><IconUsers size={26} /></div>
            <div className={styles.modeCardBody}>
              <h3>Play vs Opponent</h3>
              <p>Challenge a real person to a live courtroom debate — share a session link and argue opposite sides.</p>
              <ul className={styles.modeFeatures}>
                <li>Real-time multiplayer session</li>
                <li>Shareable session link</li>
                <li>AI judge evaluates both sides</li>
              </ul>
            </div>
            <div className={styles.modeCardCta}>
              Create Session <IconArrowRight size={14} />
            </div>
          </motion.button>
        </div>

        <div className={styles.modalFooter}>
          <span>All sessions are logged for performance tracking</span>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ── JUDGE RESPONSE ────────────────────────────────────────────────────────────
const JudgeResponse = ({ m }: { m: ChatMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [summary, detailed] = m.text.includes("Detailed Analysis:")
    ? m.text.split("Detailed Analysis:")
    : [m.text, ""];

  return (
    <div className={styles.judgeContainer}>
      <div className={styles.judgeHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.judgeHeaderLeft}>
          <IconScale size={15} className={styles.judgeIcon} />
          <span>Judge's Evaluation</span>
        </div>
        <div className={styles.judgeHeaderRight}>
          {m.scores && <span className={styles.overallPill}>{m.scores.overall}%</span>}
          {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.judgeContent}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className={styles.judgeText}>
              {summary.split('\n\n').map((p, idx) => {
                if (!p.trim()) return null;
                return <p key={idx}>{p}</p>;
              })}
              {detailed && (
                <div className={styles.detailedSection}>
                  <span className={styles.detailedLabel}>Detailed Analysis</span>
                  <p>{detailed.trim()}</p>
                </div>
              )}
            </div>

            {m.scores && (
              <div className={styles.scoresGrid}>
                {[
                  { label: 'Legal Accuracy', val: m.scores.legal },
                  { label: 'Reasoning & Logic', val: m.scores.reasoning },
                  { label: 'Evidence Use', val: m.scores.evidence },
                ].map((s) => (
                  <div key={s.label} className={styles.scoreItem}>
                    <div className={styles.scoreHeader}>
                      <span>{s.label}</span>
                      <span className={styles.scoreVal}>{s.val}</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.val}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}

                <div className={styles.overallRow}>
                  <div className={styles.tierBadge}>
                    <span className={styles.tierLabel}>Tier</span>
                    <span className={styles.tierVal}>{m.scores.performance_tier}</span>
                  </div>
                  <div className={styles.impactBadge}>
                    <span className={styles.tierLabel}>Court Impact</span>
                    <span className={styles.impactVal}>{m.scores.overall}%</span>
                  </div>
                </div>
              </div>
            )}

            {m.incorrect_sections && m.incorrect_sections.length > 0 && (
              <div className={styles.incorrectSections}>
                <div className={styles.subSectionTitle}>
                  <IconX size={13} /> Incorrect Citations
                </div>
                {m.incorrect_sections.map((s, i) => (
                  <div key={i} className={styles.incorrectItem}>
                    <span className={styles.sectionTag}>§{s.section}</span>
                    <span>{s.reason}</span>
                  </div>
                ))}
              </div>
            )}

            {m.suggestions && m.suggestions.length > 0 && (
              <div className={styles.suggestions}>
                <div className={styles.subSectionTitle}>
                  <IconLightbulb size={13} /> Suggestions
                </div>
                <ul>
                  {m.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── MAIN SIMULATOR ────────────────────────────────────────────────────────────
const Simulator = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [showModeModal, setShowModeModal] = useState(true);

  const [sessionId, setSessionId] = useState<string>('');
  const [caseFacts, setCaseFacts] = useState<CaseFacts | null>(null);
  const [phase, setPhase] = useState<string>('opening_statement');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioStatus, setAudioStatus] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const playingRef = useRef<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/session/create", {
          case_id: caseId,
          user_id: "demo_user_001",
          mode: gameMode === 'opponent' ? 'multiplayer' : 'criminal'
        });
        setSessionId(res.data.session_id);
        setCaseFacts(res.data.case_facts);
        setPhase(res.data.current_phase);
        setMessages([{
          id: 'welcome',
          type: 'system',
          text: `Court is now in session — ${gameMode === 'opponent' ? 'Multiplayer' : 'AI Opponent'} Mode · ${res.data.current_phase.replace(/_/g, ' ').toUpperCase()}`
        }]);
      } catch (err) {
        console.error("Session init failed", err);
      }
    };
    if (caseId && gameMode) initSession();
  }, [caseId, gameMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setShowModeModal(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        await processAudioUpload(new Blob(audioChunksRef.current, { type: 'audio/wav' }));
      };
      mr.start();
      setIsRecording(true);
      setAudioStatus('Recording…');
    } catch { setAudioStatus('Microphone access failed.'); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioStatus('Processing audio…');
    }
  };

  const toggleRecording = () => { isRecording ? stopRecording() : startRecording(); };

  const playFastTTS = async (msgId: string, text: string) => {
    if (ttsAudioRef.current) { ttsAudioRef.current.pause(); ttsAudioRef.current = null; }
    if (playingRef.current === msgId) { playingRef.current = null; setPlayingMsgId(null); return; }
    playingRef.current = msgId;
    setPlayingMsgId(msgId);
    try {
      const chunks = text.match(/.{1,200}(\s|$)/g) || [];
      for (const chunk of chunks) {
        if (playingRef.current !== msgId) break;
        const res = await fetch(`http://localhost:8000/tts?text=${encodeURIComponent(chunk)}&role=opponent`);
        if (!res.ok) throw new Error();
        const url = URL.createObjectURL(await res.blob());
        const audio = new Audio(url);
        ttsAudioRef.current = audio;
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
          audio.onerror = reject;
          audio.play().catch(reject);
        });
      }
    } catch { /* silent */ }
    finally { playingRef.current = null; setPlayingMsgId(null); }
  };

  const pauseTTS = () => {
    if (ttsAudioRef.current) { ttsAudioRef.current.pause(); ttsAudioRef.current.src = ''; ttsAudioRef.current = null; }
    playingRef.current = null;
    setPlayingMsgId(null);
  };

  const processAudioUpload = async (blob: Blob) => {
    const fd = new FormData();
    fd.append('file', blob, 'recording.wav');
    try {
      const res = await axios.post("http://localhost:8000/api/audio/speech-to-text", fd);
      if (res.data.transcript) {
        setInputText(res.data.transcript);
        setAudioStatus('Transcription complete.');
        setTimeout(() => setAudioStatus(''), 3000);
      }
    } catch { setAudioStatus('Transcription failed.'); }
  };

  const submitArgument = async () => {
    if (!inputText.trim() || !sessionId) return;
    const rx = /section\s*(\d+[A-Z]?)/gi;
    const cited: string[] = [];
    let m;
    while ((m = rx.exec(inputText)) !== null) cited.push(m[1]);

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

      const { feedback, legal_accuracy_score, reasoning_score, evidence_score, overall_score, opponent_response } = res.data;

      setMessages(prev => {
        const next = [...prev];
        next.push({
          id: Date.now().toString() + '_j',
          type: 'judge',
          text: feedback || "Your argument has been received and evaluated.",
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
          const opp: ChatMessage = { id: Date.now().toString() + '_o', type: 'opponent', text: opponent_response };
          next.push(opp);
          setTimeout(() => playFastTTS(opp.id, opp.text), 500);
        }
        return next;
      });
    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString() + '_e', type: 'system', text: `Error: ${err.message}` }]);
    } finally { setLoading(false); }
  };

  const terminateSession = () => {
    if (window.confirm("Terminate this session? Unsaved progress will be lost.")) navigate('/simulator');
  };

  if (!caseId) return (
    <div className={styles.emptyState}>
      <IconScale size={40} />
      <h2>No Case Selected</h2>
      <p>Return to the cases page to select a matter for simulation.</p>
      <button onClick={() => navigate('/simulator')}>Browse Cases</button>
    </div>
  );

  if (!caseFacts && gameMode) return (
    <div className={styles.loadingContainer}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} className={styles.loader} />
      <p>Consulting Judicial Records…</p>
    </div>
  );

  return (
    <div className={styles.fullPage}>
      <Navbar />

      <AnimatePresence>
        {showModeModal && (
          <ModeSelectionModal
            caseTitle={caseFacts?.title || `Case #${caseId}`}
            onSelect={handleModeSelect}
            onClose={() => navigate(-1)}
          />
        )}
      </AnimatePresence>

      {gameMode && caseFacts && (
        <div className={styles.simulatorContainer}>

          {/* LEFT PANE */}
          <div className={styles.leftPane}>
            <div className={styles.caseHeader}>
              <div className={styles.caseHeaderTop}>
                <span className={styles.caseType}>{caseFacts.type}</span>
                <span className={`${styles.modeBadge} ${gameMode === 'ai' ? styles.modeAI : styles.modeMulti}`}>
                  {gameMode === 'ai' ? <><IconRobot size={10} /> AI Mode</> : <><IconUsers size={10} /> Multiplayer</>}
                </span>
              </div>
              <h2 className={styles.caseTitle}>{caseFacts.title}</h2>
              <span className={styles.phaseBadge}>{phase.replace(/_/g, ' ').toUpperCase()}</span>
            </div>

            <div className={styles.paneScroll}>
              <div className={styles.infoSection}>
                <h3><IconShieldAlert size={13} /> Brief Facts</h3>
                <p>{caseFacts.facts}</p>
              </div>
              <div className={styles.infoSection}>
                <h3>Evidence & Exhibits</h3>
                <ul className={styles.evidenceList}>
                  {caseFacts.evidence?.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              {caseFacts.legal_provisions?.length > 0 && (
                <div className={styles.infoSection}>
                  <h3>Legal Provisions</h3>
                  <div className={styles.provisionTags}>
                    {caseFacts.legal_provisions.map((p, idx) => (
                      <span key={idx} className={styles.provisionTag}>{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.sideControls}>
              <div className={`${styles.timer} ${timeLeft < 300 ? styles.timerUrgent : ''}`}>
                <IconClock size={14} />
                <span>{formatTime(timeLeft)}</span>
                <span className={styles.timerLabel}>remaining</span>
              </div>
              <button className={styles.terminateBtn} onClick={terminateSession}>
                <IconLogout size={14} /> End Session
              </button>
            </div>
          </div>

          {/* RIGHT PANE */}
          <div className={styles.rightPane}>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <div className={styles.liveDot} />
                <span>Live Session</span>
              </div>
              <span className={styles.chatHeaderPhase}>{phase.replace(/_/g, ' ')}</span>
            </div>

            <div className={styles.chatFeed}>
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={styles.messageWrap}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    {msg.type === 'system' && (
                      <div className={styles.systemMsg}>{msg.text}</div>
                    )}

                    {msg.type === 'user' && (
                      <div className={styles.userBubble}>
                        <div className={styles.bubbleLabel}>You</div>
                        <p>{msg.text}</p>
                      </div>
                    )}

                    {msg.type === 'opponent' && (
                      <div className={styles.opponentBubble}>
                        <div className={styles.opponentTop}>
                          <div className={styles.bubbleLabel}>
                            {gameMode === 'ai' ? 'Opposing Counsel (AI)' : 'Opposing Counsel'}
                          </div>
                          <button
                            className={`${styles.ttsBtn} ${playingMsgId === msg.id ? styles.ttsBtnActive : ''}`}
                            onClick={() => playingMsgId === msg.id ? pauseTTS() : playFastTTS(msg.id, msg.text)}
                          >
                            {playingMsgId === msg.id ? <IconPause size={12} /> : <IconVolume2 size={12} />}
                            {playingMsgId === msg.id ? 'Pause' : 'Speak'}
                          </button>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    )}

                    {msg.type === 'judge' && <JudgeResponse m={msg} />}
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div className={styles.thinkingRow} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className={styles.wave}>
                    {[...Array(5)].map((_, i) => <span key={i} />)}
                  </div>
                  <span className={styles.thinkingText}>The bench is deliberating…</span>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className={styles.inputArea}>
              <AnimatePresence>
                {audioStatus && (
                  <motion.div
                    className={styles.audioStatus}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {audioStatus}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.inputRow}>
                <button
                  className={`${styles.recordBtn} ${isRecording ? styles.recordingActive : ''}`}
                  onClick={toggleRecording}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  <motion.div
                    animate={isRecording ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    {isRecording ? <IconMicOff size={17} /> : <IconMic size={17} />}
                  </motion.div>
                </button>

                <textarea
                  className={styles.argumentInput}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Submit your oral or written argument…"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitArgument(); } }}
                  rows={3}
                />

                <button
                  className={styles.submitBtn}
                  onClick={submitArgument}
                  disabled={loading || !inputText.trim()}
                >
                  <IconSend size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;