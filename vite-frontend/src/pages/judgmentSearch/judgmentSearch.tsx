import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronRight,
  Trophy,
  Zap,
  Target,
  Flame,
  Gavel,
  Star,
  FolderOpen,
  BarChart2,
  Clock,
  Users,
  Bot,
  TrendingUp,
  Award,
  Swords,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";

/* ─── GLOBAL ──────────────────────────────────────────────── */
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

/* ─── DATA ────────────────────────────────────────────────── */
interface Badge {
  Icon: LucideIcon;
  label: string;
  desc: string;
  earned: boolean;
}

const BADGES: Badge[] = [
  { Icon: Trophy,    label: "First Win",      desc: "Won your first case",       earned: true  },
  { Icon: Zap,       label: "Speed Demon",    desc: "Finished in under 15 min",  earned: true  },
  { Icon: Target,    label: "Sharpshooter",   desc: "95%+ accuracy",             earned: true  },
  { Icon: Flame,     label: "Hot Streak",     desc: "3 wins in a row",           earned: false },
  { Icon: Gavel,     label: "Grand Litigator",desc: "Reach Expert tier",         earned: false },
  { Icon: Star,      label: "Perfect Score",  desc: "Score 100% on any case",    earned: false },
];

const MODES = ["All", "AI", "Multiplayer"];
const TIERS = ["All", "Beginner", "Intermediate", "Advanced Advocate", "Expert Litigator"];

function scoreColor(score: number) {
  if (score >= 90) return "#22c55e";
  if (score >= 75) return "#3b82f6";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

/* ─── COMPONENT ───────────────────────────────────────────── */
const JudgementSearch = () => {
  const [expanded, setExpanded]     = useState<number | string | null>(null);
  const [search, setSearch]         = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    axios.get(`${BASE_URL}/api/session/user/demo_user_001`)
      .then(res => {
        const mapped = res.data.sessions.map((s: any) => {
          const created = new Date(s.created_at);
          const active = new Date(s.last_activity);
          const durationMins = Math.max(1, Math.round((active.getTime() - created.getTime()) / 60000));
          return {
            id: s.session_id,
            case: s.case_id.replace(/_/g, ' ').toUpperCase(),
            mode: s.mode.toLowerCase().includes('ai') || s.mode.toLowerCase().includes('criminal') ? 'AI' : 'Multiplayer',
            score: Math.round(s.score || 0),
            tier: s.performance_tier,
            accuracy: Math.round(s.score || 0),
            date: created.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            duration: `${durationMins} min`,
          };
        });
        setHistoryData(mapped);
      })
      .catch(err => console.error("Error fetching sessions", err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string | number) => setExpanded((p) => (p === id ? null : id));

  const filtered = useMemo(() => {
    return historyData.filter((g) => {
      const matchSearch = g.case.toLowerCase().includes(search.toLowerCase());
      const matchMode   = modeFilter === "All" || g.mode === modeFilter;
      const matchTier   = tierFilter === "All" || g.tier === tierFilter;
      return matchSearch && matchMode && matchTier;
    });
  }, [search, modeFilter, tierFilter, historyData]);

  const avgScore    = historyData.length > 0 ? Math.round(historyData.reduce((a, g) => a + g.score, 0) / historyData.length) : 0;
  const earnedCount = BADGES.filter((b) => b.earned).length;
  const isFiltered  = search !== "" || modeFilter !== "All" || tierFilter !== "All";
  const clearAll    = () => { setSearch(""); setModeFilter("All"); setTierFilter("All"); };

  return (
    <>
      <Navbar />
      <GlobalFonts />
      <Container>
        <Hero>
          <HeroInner>
            <HeroTitle>Past Game Records</HeroTitle>
            <HeroSubtitle>Review your courtroom performances and track your progress.</HeroSubtitle>
            <HeroStats>
              <Stat><StatIcon><BookOpen size={15} strokeWidth={1.8} /></StatIcon><StatNumber>{loading ? "-" : historyData.length}</StatNumber><StatLabel>Total Games</StatLabel></Stat>
              <HeroDivider />
              <Stat><StatIcon><BarChart2 size={15} strokeWidth={1.8} /></StatIcon><StatNumber>{loading ? "-" : `${avgScore}%`}</StatNumber><StatLabel>Avg Score</StatLabel></Stat>
              <HeroDivider />
              <Stat><StatIcon><ShieldCheck size={15} strokeWidth={1.8} /></StatIcon><StatNumber>{loading ? "-" : (historyData.length > 0 ? historyData.reduce((best, curr) => {
                  const tiers: Record<string, number> = { "Law Student": 1, "Junior Advocate": 2, "Competent Advocate": 3, "Senior Counsel": 4, "Expert Litigator": 5, "Beginner": 1, "Intermediate": 3, "Advanced Advocate": 4 };
                  const bestVal = tiers[best.tier] || 0;
                  const currVal = tiers[curr.tier] || 0;
                  return currVal > bestVal ? curr : best;
                }, historyData[0]).tier : "None")}</StatNumber><StatLabel>Best Tier</StatLabel></Stat>
              <HeroDivider />
              <Stat><StatIcon><Award size={15} strokeWidth={1.8} /></StatIcon><StatNumber>{earnedCount}/{BADGES.length}</StatNumber><StatLabel>Badges</StatLabel></Stat>
            </HeroStats>
          </HeroInner>
        </Hero>

        <FilterBar>
          <FilterBarInner>
            <SearchWrap>
              <SearchIconWrap><Search size={14} strokeWidth={2.2} color="#94a3b8" /></SearchIconWrap>
              <SearchInput placeholder="Search by case name…" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
              {search && <ClearBtn onClick={() => setSearch("")}><X size={13} strokeWidth={2.5} /></ClearBtn>}
            </SearchWrap>
            <FilterGroup>
              <FilterLabel>Mode</FilterLabel>
              {MODES.map((m) => (
                <FilterChip key={m} $active={modeFilter === m} onClick={() => setModeFilter(m)}>
                  {m === "AI" && <Bot size={11} strokeWidth={2} />}
                  {m === "Multiplayer" && <Users size={11} strokeWidth={2} />}
                  {m}
                </FilterChip>
              ))}
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Tier</FilterLabel>
              {TIERS.map((t) => <FilterChip key={t} $active={tierFilter === t} onClick={() => setTierFilter(t)}>{t}</FilterChip>)}
            </FilterGroup>
            {isFiltered && <ResetBtn onClick={clearAll}><X size={11} strokeWidth={2.5} />Reset</ResetBtn>}
          </FilterBarInner>
        </FilterBar>

        <Main>
          <Left>
            <SectionHeader><SectionTitle><Gavel size={12} strokeWidth={2.2} />Game History</SectionTitle><ResultCount>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</ResultCount></SectionHeader>
            <Card>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><EmptyState><EmptyMsg>Loading your game records...</EmptyMsg></EmptyState></motion.div>
                ) : filtered.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><EmptyState><EmptyIconWrap><FolderOpen size={40} strokeWidth={1.3} color="#93c5fd" /></EmptyIconWrap><EmptyTitle>No records found</EmptyTitle><EmptyMsg>Try adjusting your filters or search query.</EmptyMsg><EmptyBtn onClick={clearAll}><X size={13} strokeWidth={2.2} />Clear Filters</EmptyBtn></EmptyState></motion.div>
                ) : (
                  filtered.map((game, idx) => {
                    const isOpen = expanded === game.id;
                    const color  = scoreColor(game.score);
                    return (
                      <motion.div key={game.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: idx * 0.05 }}>
                        <Row onClick={() => toggle(game.id)} $open={isOpen}>
                          <RowLeft><RankBadge style={{ background: color + "18", color }}>#{idx + 1}</RankBadge><CaseBlock><CaseTitle>{game.case}</CaseTitle><CaseMeta><ModePill $mode={game.mode}>{game.mode === "AI" ? <Bot size={10} strokeWidth={2} /> : <Users size={10} strokeWidth={2} />}{game.mode}</ModePill><MetaItem><Clock size={11} strokeWidth={2} />{game.date}</MetaItem><MetaSep>·</MetaSep><MetaItem><Clock size={11} strokeWidth={2} />{game.duration}</MetaItem></CaseMeta></CaseBlock></RowLeft>
                          <RowRight><ScoreBlock><Score style={{ color }}>{game.score}%</Score><ScoreText>score</ScoreText></ScoreBlock><ChevronWrap $open={isOpen}><ChevronRight size={16} strokeWidth={2.2} color="#94a3b8" /></ChevronWrap></RowRight>
                        </Row>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                              <ExpandedPanel>
                                <PillRow>
                                  <Pill><PillLabel>{game.mode === "AI" ? <Bot size={11} strokeWidth={2} /> : <Users size={11} strokeWidth={2} />}Mode</PillLabel><PillValue>{game.mode}</PillValue></Pill>
                                  <Pill><PillLabel><ShieldCheck size={11} strokeWidth={2} />Tier</PillLabel><PillValue>{game.tier}</PillValue></Pill>
                                  <Pill><PillLabel><Clock size={11} strokeWidth={2} />Duration</PillLabel><PillValue>{game.duration}</PillValue></Pill>
                                </PillRow>
                                <BarSection>
                                  <BarRow><BarMeta><BarLabelWrap><TrendingUp size={12} strokeWidth={2} color="#64748b" /><BarLabel>Score</BarLabel></BarLabelWrap><BarValue style={{ color: scoreColor(game.score) }}>{game.score}%</BarValue></BarMeta><BarTrack><BarFill style={{ width: `${game.score}%`, background: scoreColor(game.score) }} /></BarTrack></BarRow>
                                  <BarRow><BarMeta><BarLabelWrap><Target size={12} strokeWidth={2} color="#64748b" /><BarLabel>Accuracy</BarLabel></BarLabelWrap><BarValue style={{ color: scoreColor(game.accuracy) }}>{game.accuracy}%</BarValue></BarMeta><BarTrack><BarFill style={{ width: `${game.accuracy}%`, background: scoreColor(game.accuracy) }} /></BarTrack></BarRow>
                                </BarSection>
                              </ExpandedPanel>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <DividerLine />
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </Card>
          </Left>

          <Right>
            <SectionTitle style={{ marginBottom: 10 }}><BarChart2 size={12} strokeWidth={2.2} />Your Summary</SectionTitle>
            <SummaryCard>
              {[{ val: "980", label: "Total Points", Icon: Trophy }, { val: "22", label: "Cases Played", Icon: BookOpen }, { val: "72%", label: "Win Rate", Icon: Swords }].map(({ val, label, Icon }) => (
                <SummaryRow key={label}><SummaryLeft><SummaryIconWrap><Icon size={16} strokeWidth={1.8} /></SummaryIconWrap><SummaryLabel>{label}</SummaryLabel></SummaryLeft><SummaryValue>{val}</SummaryValue></SummaryRow>
              ))}
              <ProgressWrap><ProgressMeta><ProgressLabel><TrendingUp size={11} strokeWidth={2} />Progress to #6</ProgressLabel><ProgressVal>980 / 1150</ProgressVal></ProgressMeta><ProgressTrack><ProgressFill style={{ width: `${(980 / 1150) * 100}%` }} /></ProgressTrack></ProgressWrap>
              <ChallengeBtn onClick={() => navigate("/leaderboard")}><Zap size={14} strokeWidth={2.2} />Challenge Top Players</ChallengeBtn>
            </SummaryCard>
            <SectionTitle style={{ margin: "24px 0 10px" }}><Award size={12} strokeWidth={2.2} />Achievements</SectionTitle>
            <BadgeCard><BadgeGrid>{BADGES.map((b) => (<BadgeItem key={b.label} $earned={b.earned} title={b.desc}><BadgeIconWrap $earned={b.earned}><b.Icon size={20} strokeWidth={1.8} /></BadgeIconWrap><BadgeName $earned={b.earned}>{b.label}</BadgeName><BadgeDesc>{b.desc}</BadgeDesc></BadgeItem>))}</BadgeGrid></BadgeCard>
          </Right>
        </Main>
      </Container>
    </>
  );
};

export default JudgementSearch;

/* ─── ANIMATIONS ──────────────────────────────────────────── */
const fillAnim = keyframes`from { width: 0; }`;

/* ─── STYLED COMPONENTS ───────────────────────────────────── */
const Container = styled.div`min-height: 100vh; background: #eff6ff; font-family: 'EB Garamond', Georgia, serif;`;
const Hero = styled.div`background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%); padding: 44px 32px 52px; position: relative; overflow: hidden; &::before { content: ''; position: absolute; inset: 0; opacity: 0.055; background-image: linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px); background-size: 44px 44px; }`;
const HeroInner = styled.div`max-width: 1200px; margin: auto; position: relative;`;
const HeroTitle = styled.h1`font-family: 'Playfair Display', Georgia, serif; font-size: 2.5rem; color: white; line-height: 1.12; font-weight: 800;`;
const HeroSubtitle = styled.p`color: #bfdbfe; margin-top: 8px; font-size: 15px; font-style: italic;`;
const HeroStats = styled.div`display: flex; align-items: center; gap: 28px; margin-top: 24px; flex-wrap: wrap;`;
const Stat = styled.div`display: flex; flex-direction: column; gap: 2px;`;
const StatIcon = styled.div`color: #93c5fd; margin-bottom: 2px; display: flex;`;
const StatNumber = styled.div`font-size: 1.75rem; color: white; font-weight: 800; font-family: sans-serif; line-height: 1;`;
const StatLabel = styled.div`font-size: 10px; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.9px; font-family: sans-serif;`;
const HeroDivider = styled.div`width: 1px; height: 40px; background: rgba(255,255,255,0.15);`;
const FilterBar = styled.div`background: white; border-bottom: 1px solid #e2e8f0; box-shadow: 0 2px 14px rgba(20,50,160,0.07); position: sticky; top: 0; z-index: 20;`;
const FilterBarInner = styled.div`max-width: 1200px; margin: auto; padding: 14px 28px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;`;
const SearchWrap = styled.div`position: relative; flex: 1; min-width: 200px;`;
const SearchIconWrap = styled.div`position: absolute; left: 12px; top: 50%; transform: translateY(-50%); display: flex; pointer-events: none;`;
const SearchInput = styled.input`width: 100%; padding: 9px 36px 9px 36px; border: 1.5px solid #dbeafe; border-radius: 9px; font-size: 14px; font-family: sans-serif; color: #1e3a8a; background: #f8faff; outline: none; transition: border 0.2s, background 0.2s; &:focus { border-color: #3b82f6; background: white; } &::placeholder { color: #94a3b8; }`;
const ClearBtn = styled.button`position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; display: flex; align-items: center; padding: 2px; border-radius: 4px; transition: color 0.15s; &:hover { color: #1e3a8a; }`;
const FilterGroup = styled.div`display: flex; align-items: center; gap: 6px; flex-wrap: wrap;`;
const FilterLabel = styled.span`font-size: 10px; text-transform: uppercase; letter-spacing: 0.9px; color: #94a3b8; font-family: sans-serif; font-weight: 600;`;
const FilterChip = styled.button<{ $active: boolean }>`padding: 5px 13px; border-radius: 20px; border: 1.5px solid ${p => p.$active ? '#1e3a8a' : '#dbeafe'}; background: ${p => p.$active ? 'linear-gradient(135deg,#1e3a8a,#2563eb)' : '#f8faff'}; color: ${p => p.$active ? 'white' : '#475569'}; font-size: 12px; font-family: sans-serif; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.15s; &:hover { border-color: #2563eb; color: ${p => p.$active ? 'white' : '#1e3a8a'}; }`;
const ResetBtn = styled.button`display: flex; align-items: center; gap: 5px; padding: 5px 13px; border-radius: 20px; border: 1.5px solid #fca5a5; background: #fff5f5; color: #ef4444; font-size: 12px; font-family: sans-serif; font-weight: 600; cursor: pointer; transition: all 0.15s; &:hover { background: #ef4444; color: white; border-color: #ef4444; }`;
const Main = styled.div`display: grid; grid-template-columns: 1fr 320px; gap: 24px; max-width: 1200px; margin: auto; padding: 28px; @media (max-width: 860px) { grid-template-columns: 1fr; }`;
const Left  = styled.div``;
const Right = styled.div``;
const SectionHeader = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;`;
const SectionTitle = styled.div`display: flex; align-items: center; gap: 6px; font-size: 10px; letter-spacing: 1.3px; text-transform: uppercase; color: #64748b; font-family: sans-serif; font-weight: 700;`;
const ResultCount = styled.div`font-size: 12px; color: #94a3b8; font-family: sans-serif;`;
const Card = styled.div`background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 24px rgba(20,50,160,0.09); border: 1px solid #e8eeff;`;
const Row = styled.div<{ $open: boolean }>`padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: ${p => p.$open ? '#f8faff' : 'white'}; transition: background 0.15s; &:hover { background: #f8faff; }`;
const RowLeft = styled.div`display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0;`;
const RowRight = styled.div`display: flex; align-items: center; gap: 10px; flex-shrink: 0;`;
const RankBadge = styled.div`width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; font-family: sans-serif; flex-shrink: 0;`;
const CaseBlock  = styled.div`min-width: 0;`;
const CaseTitle  = styled.div`font-weight: 600; font-size: 15px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
const CaseMeta = styled.div`display: flex; align-items: center; gap: 7px; margin-top: 5px; font-size: 12px; color: #64748b; font-family: sans-serif; flex-wrap: wrap;`;
const ModePill = styled.span<{ $mode: string }>`display: inline-flex; align-items: center; gap: 4px; background: ${p => p.$mode === 'AI' ? '#eff6ff' : '#f0fdf4'}; color: ${p => p.$mode === 'AI' ? '#1d4ed8' : '#15803d'}; border: 1px solid ${p => p.$mode === 'AI' ? '#bfdbfe' : '#bbf7d0'}; border-radius: 5px; padding: 2px 8px; font-size: 11px; font-weight: 700;`;
const MetaItem = styled.span`display: inline-flex; align-items: center; gap: 3px;`;
const MetaSep  = styled.span`color: #cbd5e1;`;
const ScoreBlock = styled.div`text-align: right;`;
const Score = styled.div`font-size: 20px; font-weight: 800; font-family: sans-serif; line-height: 1;`;
const ScoreText = styled.div`font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; font-family: sans-serif;`;
const ChevronWrap = styled.div<{ $open: boolean }>`display: flex; transform: rotate(${p => p.$open ? '90deg' : '0deg'}); transition: transform 0.22s ease;`;
const ExpandedPanel = styled.div`padding: 16px 20px 20px; background: #f8faff; border-top: 1px solid #e8eeff;`;
const PillRow = styled.div`display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px;`;
const Pill = styled.div`background: white; border: 1.5px solid #dbeafe; border-radius: 10px; padding: 9px 14px; display: flex; flex-direction: column; gap: 3px; min-width: 90px;`;
const PillLabel = styled.div`display: flex; align-items: center; gap: 4px; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-family: sans-serif; font-weight: 600;`;
const PillValue = styled.div`font-weight: 700; font-size: 14px; color: #0f172a; font-family: sans-serif;`;
const BarSection = styled.div`display: flex; flex-direction: column; gap: 14px;`;
const BarRow     = styled.div``;
const BarMeta    = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;`;
const BarLabelWrap = styled.div`display: flex; align-items: center; gap: 5px;`;
const BarLabel     = styled.span`font-size: 12px; color: #64748b; font-family: sans-serif;`;
const BarValue     = styled.span`font-size: 12px; font-weight: 700; font-family: sans-serif;`;
const BarTrack     = styled.div`height: 6px; background: #e8eeff; border-radius: 99px; overflow: hidden;`;
const BarFill = styled.div`height: 100%; border-radius: 99px; animation: ${fillAnim} 0.7s ease both;`;
const DividerLine = styled.div`height: 1px; background: #f1f5f9;`;
const EmptyState   = styled.div`display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 68px 24px; text-align: center;`;
const EmptyIconWrap = styled.div`background: #eff6ff; border-radius: 20px; padding: 20px; margin-bottom: 18px; display: flex;`;
const EmptyTitle = styled.div`font-size: 19px; font-weight: 700; color: #1e3a8a; margin-bottom: 8px; font-family: 'Playfair Display', Georgia, serif;`;
const EmptyMsg = styled.div`color: #64748b; font-size: 14px; font-family: sans-serif; margin-bottom: 22px;`;
const EmptyBtn = styled.button`display: flex; align-items: center; gap: 6px; padding: 10px 24px; border-radius: 9px; border: none; background: linear-gradient(135deg, #1e3a8a, #2563eb); color: white; font-size: 14px; font-family: sans-serif; font-weight: 600; cursor: pointer; transition: opacity 0.15s; &:hover { opacity: 0.88; }`;
const SummaryCard = styled.div`background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 24px rgba(20,50,160,0.09); border: 1px solid #e8eeff;`;
const SummaryRow = styled.div`display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; &:last-of-type { border-bottom: none; }`;
const SummaryLeft = styled.div`display: flex; align-items: center; gap: 10px;`;
const SummaryIconWrap = styled.div`width: 32px; height: 32px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #1e3a8a;`;
const SummaryLabel = styled.div`font-size: 13px; color: #64748b; font-family: sans-serif;`;
const SummaryValue = styled.div`font-size: 20px; font-weight: 800; color: #1e3a8a; font-family: sans-serif;`;
const ProgressWrap  = styled.div`margin: 16px 0 14px;`;
const ProgressMeta  = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px;`;
const ProgressLabel = styled.div`display: flex; align-items: center; gap: 5px; font-size: 12px; color: #64748b; font-family: sans-serif;`;
const ProgressVal   = styled.div`font-size: 12px; color: #1e3a8a; font-weight: 700; font-family: sans-serif;`;
const ProgressTrack = styled.div`height: 6px; background: #e8eeff; border-radius: 99px; overflow: hidden;`;
const ProgressFill  = styled.div`height: 100%; border-radius: 99px; background: linear-gradient(90deg, #1e3a8a, #3b82f6); animation: ${fillAnim} 0.9s ease both;`;
const ChallengeBtn = styled.button`display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; padding: 12px; background: linear-gradient(135deg, #1e3a8a, #2563eb); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; font-family: sans-serif; cursor: pointer; transition: opacity 0.15s; &:hover { opacity: 0.88; }`;
const BadgeCard = styled.div`background: white; border-radius: 16px; padding: 16px; box-shadow: 0 2px 24px rgba(20,50,160,0.09); border: 1px solid #e8eeff;`;
const BadgeGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;
const BadgeItem = styled.div<{ $earned: boolean }>`background: ${p => p.$earned ? '#f0f6ff' : '#f8fafc'}; border: 1.5px solid ${p => p.$earned ? '#bfdbfe' : '#e2e8f0'}; border-radius: 12px; padding: 14px 10px; text-align: center; opacity: ${p => p.$earned ? 1 : 0.5}; transition: transform 0.15s, box-shadow 0.15s; cursor: default; &:hover { transform: ${p => p.$earned ? 'translateY(-3px)' : 'none'}; box-shadow: ${p => p.$earned ? '0 4px 16px rgba(37,99,235,0.14)' : 'none'}; }`;
const BadgeIconWrap = styled.div<{ $earned: boolean }>`display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; margin: 0 auto 8px; background: ${p => p.$earned ? 'linear-gradient(135deg,#dbeafe,#eff6ff)' : '#f1f5f9'}; color: ${p => p.$earned ? '#1e3a8a' : '#94a3b8'}; filter: ${p => p.$earned ? 'none' : 'grayscale(1)'};`;
const BadgeName = styled.div<{ $earned: boolean }>`font-size: 11px; font-weight: 700; color: ${p => p.$earned ? '#1e3a8a' : '#94a3b8'}; font-family: sans-serif; margin-bottom: 3px;`;
const BadgeDesc = styled.div`font-size: 10px; color: #94a3b8; font-family: sans-serif; line-height: 1.35;`;
