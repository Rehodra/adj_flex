/**
 * WebSocket Socket.io Client for Real-time Game Events
 * Handles all real-time communication with the backend
 */

import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8000";

export class GameSocketService {
  private socket: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  /**
   * Initialize and connect to the WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: this.reconnectDelay,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: this.maxReconnectAttempts,
        });

        // Connection events
        this.socket.on("connect", () => {
          console.log("[Socket] Connected:", this.socket.id);
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on("connect_error", (error: any) => {
          console.error("[Socket] Connection error:", error);
          reject(error);
        });

        this.socket.on("disconnect", (reason: string) => {
          console.log("[Socket] Disconnected:", reason);
        });

        this.socket.on("error", (error: any) => {
          console.error("[Socket] Error:", error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   * Join a game session
   */
  joinSession(
    sessionId: string,
    role: "plaintiff" | "defense" | "spectator",
    userId?: string
  ): void {
    this.socket.emit("join_session", {
      session_id: sessionId,
      role,
      user_id: userId,
    });
  }

  /**
   * Leave current session
   */
  leaveSession(sessionId: string): void {
    this.socket.emit("leave_session", {
      session_id: sessionId,
    });
  }

  /**
   * Submit an argument for evaluation
   */
  submitArgument(
    sessionId: string,
    argumentText: string,
    caseId?: string
  ): void {
    this.socket.emit("submit_argument", {
      session_id: sessionId,
      argument_text: argumentText,
      case_id: caseId,
    });
  }

  /**
   * Request a hint on a specific legal topic
   */
  requestHint(sessionId: string, question: string): void {
    this.socket.emit("request_hint", {
      session_id: sessionId,
      question,
    });
  }

  /**
   * Notify others that you're typing
   */
  notifyTyping(sessionId: string): void {
    this.socket.emit("typing", {
      session_id: sessionId,
    });
  }

  // ─── Event Listeners ───

  /**
   * Listen for session joined confirmation
   */
  onSessionJoined(callback: (data: any) => void): void {
    this.socket.on("session_joined", callback);
  }

  /**
   * Listen for player joined event
   */
  onPlayerJoined(callback: (data: any) => void): void {
    this.socket.on("player_joined", callback);
  }

  /**
   * Listen for player left event
   */
  onPlayerLeft(callback: (data: any) => void): void {
    this.socket.on("player_left", callback);
  }

  /**
   * Listen for argument received confirmation
   */
  onArgumentReceived(callback: (data: any) => void): void {
    this.socket.on("argument_received", callback);
  }

  /**
   * Listen for argument evaluation result
   */
  onArgumentEvaluated(callback: (data: any) => void): void {
    this.socket.on("argument_evaluated", callback);
  }

  /**
   * Listen for opponent's response
   */
  onOpponentResponse(callback: (data: any) => void): void {
    this.socket.on("opponent_response", callback);
  }

  /**
   * Listen for turn change event
   */
  onTurnChanged(callback: (data: any) => void): void {
    this.socket.on("turn_changed", callback);
  }

  /**
   * Listen for game verdict/winner announcement
   */
  onVerdictReached(callback: (data: any) => void): void {
    this.socket.on("verdict_reached", callback);
  }

  /**
   * Listen for hint response
   */
  onHintResponse(callback: (data: any) => void): void {
    this.socket.on("hint_response", callback);
  }

  /**
   * Listen for player typing indicator
   */
  onPlayerTyping(callback: (data: any) => void): void {
    this.socket.on("player_typing", callback);
  }

  /**
   * Listen for errors
   */
  onError(callback: (data: any) => void): void {
    this.socket.on("error", callback);
  }

  /**
   * Remove an event listener
   */
  offEvent(eventName: string): void {
    this.socket.off(eventName);
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket && this.socket.connected;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | null {
    return this.socket ? this.socket.id : null;
  }
}

export default new GameSocketService();
