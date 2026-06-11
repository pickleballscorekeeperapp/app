import {
  GameConfig,
  RallyEvent,
  initialState,
  isGamePoint,
  reduce,
  replay,
  scoreCall,
  servesFromRight,
  switchEndsScore,
} from '../scoring';

const cfg = (over: Partial<GameConfig> = {}): GameConfig => ({
  pointsToWin: 11,
  winBy: 2,
  firstServe: 'A',
  teamAName: 'Team 1',
  teamBName: 'Team 2',
  ...over,
});

const rally = (winner: 'A' | 'B'): RallyEvent => ({
  winner,
  at: new Date().toISOString(),
});

describe('USA Pickleball doubles side-out scoring', () => {
  test('game opens 0-0-2 with the first-serving team (rule 4.B.6)', () => {
    const s = initialState(cfg());
    expect(s.servingTeam).toBe('A');
    expect(s.serverNumber).toBe(2);
    expect(scoreCall(s)).toBe('0-0-2');
    expect(servesFromRight(s)).toBe(true); // score 0 = even = right court
  });

  test('first service sequence: one lost rally is an immediate side-out', () => {
    const s = reduce(initialState(cfg()), 'B', cfg());
    expect(s.servingTeam).toBe('B');
    expect(s.serverNumber).toBe(1);
    expect(s.firstServiceSequence).toBe(false);
    expect(s.scoreA).toBe(0);
    expect(s.scoreB).toBe(0);
    expect(scoreCall(s)).toBe('0-0-1');
  });

  test('only the serving team scores (rule 4.A)', () => {
    // B wins a rally while A serves: no point, just service change.
    let s = initialState(cfg());
    s = reduce(s, 'B', cfg()); // side-out, B serves
    s = reduce(s, 'A', cfg()); // A wins rally but is receiving → B server 2
    expect(s.scoreA).toBe(0);
    expect(s.scoreB).toBe(0);
    expect(s.servingTeam).toBe('B');
    expect(s.serverNumber).toBe(2);
  });

  test('serving team scoring keeps the same server, alternates court side', () => {
    let s = initialState(cfg());
    s = reduce(s, 'A', cfg()); // 1-0-2
    expect(s.scoreA).toBe(1);
    expect(s.serverNumber).toBe(2);
    expect(scoreCall(s)).toBe('1-0-2');
    expect(servesFromRight(s)).toBe(false); // odd score = left court
    s = reduce(s, 'A', cfg()); // 2-0-2
    expect(scoreCall(s)).toBe('2-0-2');
    expect(servesFromRight(s)).toBe(true);
  });

  test('after the first sequence, both servers serve before side-out (4.B.7)', () => {
    let s = initialState(cfg());
    s = reduce(s, 'B', cfg()); // side-out → B server 1
    s = reduce(s, 'B', cfg()); // B scores: 1-0-1
    expect(scoreCall(s)).toBe('1-0-1');
    s = reduce(s, 'A', cfg()); // B server 1 loses → server 2
    expect(s.servingTeam).toBe('B');
    expect(s.serverNumber).toBe(2);
    expect(scoreCall(s)).toBe('1-0-2');
    s = reduce(s, 'A', cfg()); // B server 2 loses → side-out to A, server 1
    expect(s.servingTeam).toBe('A');
    expect(s.serverNumber).toBe(1);
    expect(s.scoreB).toBe(1);
    expect(scoreCall(s)).toBe('0-1-1');
  });

  test('win at 11 requires a 2-point margin', () => {
    // Drive A to 10-10 vs B, then A scores twice.
    const events: RallyEvent[] = [];
    const toState = () => replay(events, cfg());

    // A scores 10 straight from the opening serve.
    for (let i = 0; i < 10; i++) events.push(rally('A'));
    expect(toState().scoreA).toBe(10);

    // A never lost a rally, so the opening sequence is still active:
    // a single lost rally is an immediate side-out to B (4.B.6).
    events.push(rally('B'));
    let s = toState();
    expect(s.servingTeam).toBe('B');
    expect(s.scoreB).toBe(0);

    // B scores 10.
    for (let i = 0; i < 10; i++) events.push(rally('B'));
    s = toState();
    expect(s.scoreB).toBe(10);
    expect(s.gameOver).toBe(false);

    // B reaches 11-10 — NOT game over (win by 2).
    events.push(rally('B'));
    s = toState();
    expect(s.scoreB).toBe(11);
    expect(s.gameOver).toBe(false);
    expect(isGamePoint(s, cfg())).toBe(true);

    // B reaches 12-10 — game over.
    events.push(rally('B'));
    s = toState();
    expect(s.gameOver).toBe(true);
    expect(s.winner).toBe('B');
  });

  test('events after game over are ignored', () => {
    const events: RallyEvent[] = [];
    for (let i = 0; i < 11; i++) events.push(rally('A'));
    const done = replay(events, cfg());
    expect(done.gameOver).toBe(true);
    const after = reduce(done, 'B', cfg());
    expect(after).toEqual(done);
  });

  test('undo via replay is deterministic', () => {
    const events: RallyEvent[] = [
      rally('A'),
      rally('B'),
      rally('B'),
      rally('A'),
      rally('B'),
    ];
    const full = replay(events, cfg());
    const undone = replay(events.slice(0, -1), cfg());
    const redone = reduce(undone, events[4]!.winner, cfg());
    expect(redone).toEqual(full);
  });

  test('first serve can be assigned to Team B', () => {
    const c = cfg({ firstServe: 'B' });
    const s = initialState(c);
    expect(s.servingTeam).toBe('B');
    expect(scoreCall(s)).toBe('0-0-2');
  });

  test('game point detection in deuce', () => {
    const c = cfg();
    // 10-10, A serving: next A point makes 11-10 → not yet winnable by 2.
    const s = {
      ...initialState(c),
      scoreA: 10,
      scoreB: 10,
      firstServiceSequence: false,
    };
    expect(isGamePoint(s, c)).toBe(false);
    const s2 = { ...s, scoreA: 11 };
    expect(isGamePoint(s2, c)).toBe(true); // 12-10 would win
  });

  test('switch-ends score: 6 to 11, 8 to 15, 11 to 21', () => {
    expect(switchEndsScore(cfg())).toBe(6);
    expect(switchEndsScore(cfg({ pointsToWin: 15 }))).toBe(8);
    expect(switchEndsScore(cfg({ pointsToWin: 21 }))).toBe(11);
  });

  test('games to 15 honor the higher target', () => {
    const c = cfg({ pointsToWin: 15 });
    const events: RallyEvent[] = [];
    for (let i = 0; i < 11; i++) events.push(rally('A'));
    expect(replay(events, c).gameOver).toBe(false);
    for (let i = 0; i < 4; i++) events.push(rally('A'));
    const s = replay(events, c);
    expect(s.gameOver).toBe(true);
    expect(s.scoreA).toBe(15);
  });
});
