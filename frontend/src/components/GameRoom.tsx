/**
 * Example Game Room Component with WebSocket Integration
 * Demonstrates real-time game state management with Socket.io
 */

import React, { useEffect, useState } from "react";
import gameSocket from "../api/gameSocket";
import { Button, Form, Input, Card, Spin, Row, Col, Statistic, message } from "antd";
import styled from "styled-components";

const GameContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ScoreboardCard = styled(Card)`
  margin-bottom: 20px;
`;

const ArgumentBox = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid #1890ff;

  .role {
    font-weight: bold;
    color: #1890ff;
    margin-bottom: 5px;
  }

  .text {
    margin: 10px 0;
    line-height: 1.6;
  }

  .evaluation {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #ddd;
    font-size: 12px;
  }
`;

interface GameRoomProps {
  sessionId: string;
  userId: string;
  role: "plaintiff" | "defense" | "spectator";
}

export const GameRoom: React.FC<GameRoomProps> = ({ sessionId, userId, role }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTurn, setCurrentTurn] = useState<string>("plaintiff");
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ plaintiff: 0, defense: 0 });
  const [argList, setArgList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [form] = Form.useForm();

  // ─── Initialize Socket Connection ───
  useEffect(() => {
    const initSocket = async () => {
      try {
        await gameSocket.connect();
        setIsConnected(true);

        // Join the session
        gameSocket.joinSession(sessionId, role, userId);

        // Setup event listeners
        setupEventListeners();

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to connect to game server:", error);
        message.error("Failed to connect to game server. Please refresh.");
        setIsLoading(false);
      }
    };

    initSocket();

    return () => {
      gameSocket.disconnect();
    };
  }, [sessionId, userId, role]);

  // ─── Setup Event Listeners ───
  const setupEventListeners = () => {
    // When this player joins
    gameSocket.onSessionJoined((data) => {
      console.log("Session joined:", data);
      setCurrentTurn(data.current_turn);
      setRound(data.round);
      setScores(data.scores);
    });

    // When another player joins
    gameSocket.onPlayerJoined((data) => {
      message.success(`${data.role} joined the game (${data.player_count} players)`);
    });

    // When a player leaves
    gameSocket.onPlayerLeft((data) => {
      message.warning(`${data.role} left the game (${data.player_count} players remaining)`);
    });

    // When an argument is submitted
    gameSocket.onArgumentReceived((data) => {
      console.log("Argument received:", data);
      setArgList((prev) => [
        ...prev,
        {
          role: data.role,
          text: data.argument,
          round: data.round,
        },
      ]);
    });

    // When argument is evaluated
    gameSocket.onArgumentEvaluated((data) => {
      console.log("Argument evaluated:", data);
      setScores(data.scores);
      setArgList((prev) =>
        prev.map((arg, idx) =>
          idx === prev.length - 1
            ? {
                ...arg,
                evaluation: data.evaluation,
              }
            : arg
        )
      );
    });

    // Opponent's response
    gameSocket.onOpponentResponse((data) => {
      console.log("Opponent response:", data);
      setArgList((prev) => [
        ...prev,
        {
          role: data.role,
          text: data.argument,
          round: round,
          isOpponent: true,
        },
      ]);
    });

    // Turn changed
    gameSocket.onTurnChanged((data) => {
      console.log("Turn changed:", data);
      setCurrentTurn(data.current_turn);
      setRound(data.round);
      setScores(data.scores);
      message.info(`Round ${data.round}: ${data.current_turn}'s turn`);
    });

    // Game verdict reached
    gameSocket.onVerdictReached((data) => {
      console.log("Verdict reached:", data);
      setGameEnded(true);
      setWinner(data.winner);
      setScores(data.final_scores);
      message.success(`Game ended! Winner: ${data.winner.toUpperCase()}`);
    });

    // Hint response
    gameSocket.onHintResponse((data) => {
      console.log("Hint response:", data);
      message.info("Hint received! Check the console for details.");
    });

    // Player typing indicator
    gameSocket.onPlayerTyping((data) => {
      console.log(`${data.role} is typing...`);
    });

    // Errors
    gameSocket.onError((data) => {
      console.error("Socket error:", data);
      message.error(data.message || "An error occurred");
    });
  };

  // ─── Handle Argument Submission ───
  const handleSubmitArgument = async (values: any) => {
    if (!isConnected) {
      message.error("Not connected to server");
      return;
    }

    if (role === "spectator") {
      message.warning("Spectators cannot submit arguments");
      return;
    }

    if (currentTurn !== role) {
      message.warning(`Not your turn! Current turn: ${currentTurn}`);
      return;
    }

    setIsSubmitting(true);
    try {
      gameSocket.submitArgument(sessionId, values.argument);
      form.resetFields();
      message.success("Argument submitted!");
    } catch (error) {
      message.error("Failed to submit argument");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Handle Hint Request ───
  const handleRequestHint = () => {
    const question = prompt("What legal topic would you like a hint about?");
    if (question) {
      gameSocket.requestHint(sessionId, question);
    }
  };

  // ─── Render ───
  if (isLoading) {
    return (
      <GameContainer>
        <Spin tip="Connecting to game server..." />
      </GameContainer>
    );
  }

  const canSubmit = !gameEnded && currentTurn === role && role !== "spectator";
  const isMyTurn = currentTurn === role;

  return (
    <GameContainer>
      {/* Header with Connection Status */}
      <Card style={{ marginBottom: 20, backgroundColor: "#fafafa" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h2>Game Room - {sessionId}</h2>
            <p>Your Role: <strong>{role.toUpperCase()}</strong></p>
          </Col>
          <Col>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: isConnected ? "#52c41a" : "#ff4d4f",
                  marginRight: 8,
                }}
              />
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Scoreboard */}
      <ScoreboardCard>
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Statistic
              title="Round"
              value={round}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Plaintiff Score"
              value={scores.plaintiff}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Defense Score"
              value={scores.defense}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Current Turn"
              value={currentTurn.toUpperCase()}
              valueStyle={{
                color: isMyTurn ? "#52c41a" : "#faad14",
              }}
            />
          </Col>
        </Row>
      </ScoreboardCard>

      {/* Game Status */}
      {gameEnded && (
        <Card style={{ marginBottom: 20, backgroundColor: "#e6f7ff" }}>
          <h3>Game Ended 🎉</h3>
          <p>
            Winner: <strong>{winner?.toUpperCase()}</strong>
          </p>
          <p>
            Final Scores: Plaintiff {scores.plaintiff} - Defense {scores.defense}
          </p>
        </Card>
      )}

      {/* Argument Submission Form */}
      {!gameEnded && role !== "spectator" && (
        <Card style={{ marginBottom: 20 }}>
          <h3>
            {isMyTurn ? "🎤 Your Turn to Argue" : "⏳ Waiting for your turn..."}
          </h3>
          <Form form={form} onFinish={handleSubmitArgument}>
            <Form.Item
              name="argument"
              rules={[
                {
                  required: true,
                  message: "Please enter your legal argument",
                },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Enter your legal argument here..."
                disabled={!canSubmit}
              />
            </Form.Item>
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                Submit Argument
              </Button>
              <Button onClick={handleRequestHint} disabled={!isConnected}>
                Request Hint
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {/* Arguments History */}
      <Card title={`Argument History (${argList.length})`}>
        {argList.length === 0 ? (
          <p style={{ color: "#999" }}>No arguments yet</p>
        ) : (
          argList.map((arg, idx) => (
            <ArgumentBox key={idx}>
              <div className="role">{arg.role.toUpperCase()}</div>
              <div className="text">{arg.text}</div>
              {arg.evaluation && (
                <div className="evaluation">
                  <strong>Evaluation:</strong>
                  <pre>
                    {JSON.stringify(arg.evaluation, null, 2)}
                  </pre>
                </div>
              )}
            </ArgumentBox>
          ))
        )}
      </Card>
    </GameContainer>
  );
};

export default GameRoom;
