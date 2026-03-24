import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Simulator.module.scss';
import axios from 'axios';

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

  // 1. Initialize Session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/session/create", {
          case_id: caseId,
          user_id: "demo_user_001",
          mode: "criminal" // Default, could be dynamic
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
      setAudioStatus('Translating with Sarvam AI...');
    }
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const processAudioUpload = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      // Calling our newly integrated Sarvam STT route
      const res = await axios.post("http://localhost:8000/api/audio/speech-to-text", formData);
      if (res.data.transcript) {
        setInputText(res.data.transcript);
        setAudioStatus('Translation successful.');
        setTimeout(() => setAudioStatus(''), 3000);
      }
    } catch (err) {
      console.error('Sarvam AI Translation failed', err);
      setAudioStatus('Translation failed.');
    }
  };

  // 3. Handle Argument Submission
  const submitArgument = async () => {
    if (!inputText.trim() || !sessionId) return;
    
    // Auto-detect sections from text (e.g. "Section 302") rough regex for demo
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
      // Map backend phase string to exact Enum required by Pydantic
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

      // Add Judge Evaluation
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

      // Add Opponent Counter
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

  if (!caseFacts) return <div className={styles.simulatorContainer} style={{padding: '3rem'}}>Loading Courtroom...</div>;

  return (
    <div className={styles.simulatorContainer}>
      
      {/* LEFT PANE - CASE FACTS */}
      <div className={styles.leftPane}>
        <h2>{caseFacts.title}</h2>
        <div className={styles.meta}>
          <span className={styles.type}>{caseFacts.type} CASE</span>
          <span className={styles.phase}>{phase.replace('_', ' ')} phase</span>
        </div>

        <div className={styles.section}>
          <h3>Brief Facts</h3>
          <p>{caseFacts.facts}</p>
        </div>

        <div className={styles.section}>
          <h3>Evidence</h3>
          <ul>
            {caseFacts.evidence?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT PANE - SIMULATOR CHAT */}
      <div className={styles.rightPane}>
        <div className={styles.chatFeed}>
          {messages.map((m) => (
            <div key={m.id} className={`${styles.messageCard} ${styles[m.type]}`}>
               {m.type === 'user' && <div className={styles.role}>Your Argument</div>}
               {m.type === 'judge' && <div className={styles.role}>The Honorable Judge (AI)</div>}
               {m.type === 'opponent' && <div className={styles.role}>Opposing Counsel (AI)</div>}
               
               <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
               
               {m.scores && (
                 <div className={styles.scores}>
                   <span>Legal Accuracy: {m.scores.legal}/100</span>
                   <span>Reasoning: {m.scores.reasoning}/100</span>
                   <span>Overall: {m.scores.overall}/100</span>
                 </div>
               )}
            </div>
          ))}
          {loading && (
            <div className={`${styles.messageCard} ${styles.system}`}>
              AI is analyzing the argument and consulting the legal database...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className={styles.inputArea}>
          {audioStatus && <div className={`${styles.statusText} ${isRecording ? styles.recording : ''}`}>{audioStatus}</div>}
          <div className={styles.controls}>
            <button 
              className={`${styles.recordBtn} ${isRecording ? styles.recording : ''}`}
              onClick={toggleRecording}
            >
              🎙️ {isRecording ? 'Stop' : 'Speak'}
            </button>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your localized argument here, or use the microphone for regional translation..."
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitArgument(); }
              }}
            />
            <button 
              className={styles.submitBtn} 
              onClick={submitArgument}
              disabled={loading || !inputText.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Simulator;
