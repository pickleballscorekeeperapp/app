/**
 * USA Pickleball doubles side-out scoring engine.
 * Pure functions — no React, no storage. Event-sourced: game state is a fold
 * over rally events, so undo is just "replay one fewer event" (same pattern
 * as CourtsideView's src/domain/scoring.ts).
 *
 * Official rules implemented (USA Pickleball Rulebook, Section 4):
 * - Only the serving team scores points (4.A).
 * - Doubles: both partners serve before a side-out, EXCEPT the first service
 *   sequence of each game — the starting team gets only one server, who is
 *   designated server #2, so the game opens "zero – zero – two" (4.B.6).
 * - When the serving team wins a rally they score and the server + partner
 *   swap right/left service courts; the receiving team never switches (4.B.3).
 * - When server #1 loses the rally, server #2 serves (second server).
 *   When server #2 loses, it's a side-out: serve passes to the opponents,
 *   starting with their server #1 (4.B.7 / 4.E).
 * - The correct call is three numbers: serving team's score, receiving
 *   team's score, server number (4.D).
 * - Server position: serving team's score even → serve from the right/even
 *   court; odd → left/odd court (4.B.4).
 * - Games are won at 11 (or 15/21), win by 2 (2.G / tournament standard).
 */

export type TeamId = 'A' | 'B';
export type ServerNumber = 1 | 2;

export interface GameConfig {
  /** 11, 15, or 21. */
  pointsToWin: number;
  /** Always 2 in official play; kept configurable for future rec modes. */
  winBy: number;
  firstServe: TeamId;
  teamAName: string;
  teamBName: string;
}

export interface RallyEvent {
  winner: TeamId;
  /** ISO timestamp — string for JSON-safe persistence. */
  at: string;
}

export interface GameState {
  scoreA: number;
  scoreB: number;
  servingTeam: TeamId;
  serverNumber: ServerNumber;
  /** True until the game's opening service sequence ends (the 0-0-2 rule). */
  firstServiceSequence: boolean;
  gameOver: boolean;
  winner: TeamId | null;
  rallies: number;
}

export const other = (t: TeamId): TeamId => (t === 'A' ? 'B' : 'A');

export function initialState(config: GameConfig): GameState {
  return {
    scoreA: 0,
    scoreB: 0,
    servingTeam: config.firstServe,
    serverNumber: 2, // 4.B.6 — game opens with the starting team's server #2
    firstServiceSequence: true,
    gameOver: false,
    winner: null,
    rallies: 0,
  };
}

export function teamScore(s: GameState, t: TeamId): number {
  return t === 'A' ? s.scoreA : s.scoreB;
}

function withScore(s: GameState, t: TeamId, value: number): GameState {
  return t === 'A' ? { ...s, scoreA: value } : { ...s, scoreB: value };
}

/** Apply one rally result. Ignores input once the game is over. */
export function reduce(
  state: GameState,
  rallyWinner: TeamId,
  config: GameConfig,
): GameState {
  if (state.gameOver) return state;
  const s: GameState = { ...state, rallies: state.rallies + 1 };

  if (rallyWinner === s.servingTeam) {
    // Serving team scores (4.A); server + partner swap courts (4.B.3).
    const next = withScore(s, rallyWinner, teamScore(s, rallyWinner) + 1);
    const w = teamScore(next, rallyWinner);
    const l = teamScore(next, other(rallyWinner));
    if (w >= config.pointsToWin && w - l >= config.winBy) {
      return { ...next, gameOver: true, winner: rallyWinner };
    }
    return next;
  }

  // Serving team lost the rally.
  if (s.firstServiceSequence || s.serverNumber === 2) {
    // Side-out (4.E). The opening sequence has only one server (4.B.6).
    return {
      ...s,
      servingTeam: other(s.servingTeam),
      serverNumber: 1,
      firstServiceSequence: false,
    };
  }
  // Second server takes over (4.B.7).
  return { ...s, serverNumber: 2 };
}

/** Fold a full event log into a state. Undo = replay(events.slice(0, -1)). */
export function replay(
  events: readonly RallyEvent[],
  config: GameConfig,
): GameState {
  return events.reduce(
    (st, e) => reduce(st, e.winner, config),
    initialState(config),
  );
}

/** The official three-number call, e.g. "4-2-1" (4.D). */
export function scoreCall(s: GameState): string {
  const serve = teamScore(s, s.servingTeam);
  const recv = teamScore(s, other(s.servingTeam));
  return `${serve}-${recv}-${s.serverNumber}`;
}

/** True when the current server serves from the right/even court (4.B.4). */
export function servesFromRight(s: GameState): boolean {
  return teamScore(s, s.servingTeam) % 2 === 0;
}

/** Serving team wins the game with the next rally (only they can score). */
export function isGamePoint(s: GameState, config: GameConfig): boolean {
  if (s.gameOver) return false;
  const w = teamScore(s, s.servingTeam) + 1;
  const l = teamScore(s, other(s.servingTeam));
  return w >= config.pointsToWin && w - l >= config.winBy;
}

/**
 * Tournament end-change score: teams switch ends when the first team reaches
 * 6 in games to 11, 8 in games to 15, 11 in games to 21.
 */
export function switchEndsScore(config: GameConfig): number {
  if (config.pointsToWin >= 21) return 11;
  if (config.pointsToWin >= 15) return 8;
  return 6;
}

export function reachedSwitchPoint(s: GameState, config: GameConfig): boolean {
  return Math.max(s.scoreA, s.scoreB) >= switchEndsScore(config);
}
