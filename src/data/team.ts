import { achievementImages, type AchievementImage } from './achievement-images';

// Add official team records and profiles here; image metadata lives in achievement-images.ts.
// Unconfirmed facts are intentionally left empty. See README.md for examples.
export type Localized = { ko: string; en: string };
export type Discipline = 'Web' | 'Pwn' | 'Reverse' | 'Crypto' | 'Forensics' | 'Misc';

export interface Achievement {
  date: string; // ISO date, YYYY-MM-DD
  event: string;
  rank: number | null; // null for a confirmed finalist without a verified placement
  placement: Localized;
  format: 'Jeopardy' | 'Attack & Defense' | 'Hack quest' | 'Other';
  description?: Localized;
  qualifiedForFinals?: boolean; // Confirmed progression from this qualifier
  timelineName?: Localized; // Optional compact name for the date navigator
  timelineNote?: Localized;
  photos?: AchievementImage[];
  url?: string; // Result source: scoreboard, organizer, or published report
}

export interface Member {
  handle: string;
  role?: Localized;
  disciplines: Discipline[];
  bio: Localized;
  github?: string;
  email?: string;
  photo?: string;
  url?: string;
}

export const team = {
  name: 'dda_com',
  koreanName: '따따',
  email: 'ddacom77@gmail.com',
  github: 'https://github.com/ddadda-company',
  ctftime: 'https://ctftime.org/team/425478',
};

// CTFtime team 425478. Retrieved 2026-10-13; a static snapshot, not a live feed.
export const rating = {
  year: 2026, world: 16, country: 3, points: 611.233, checkedAt: '2026-10-13',
};

function result(date: string, event: string, rank: number, source: number | string, format: Achievement['format'] = 'Jeopardy'): Achievement {
  const suffix = rank % 100 >= 11 && rank % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[rank % 10] ?? 'th');
  return { date, event, rank, placement: { ko: `${rank}위`, en: `${rank}${suffix}` }, format, url: typeof source === 'number' ? `https://ctftime.org/event/${source}` : source };
}

// Team-supplied records supplemented with public schedules and results on 2026-10-15.
// See README.md for the evidence supporting each additional record.
// These entries do not change the separate CTFtime team-rating snapshot above.
export const achievements: Achievement[] = [
  {
    ...result('2026-09-28', 'SCAN 2026 Final', 2, 'https://scan.sx/'),
    photos: achievementImages.scanAward,
    description: { ko: '디지털자산 추적 대회 본선 · hello', en: 'Digital asset tracing finals · hello' },
  },
  result('2026-09-26', 'FAUST CTF 2026', 5, 3312, 'Attack & Defense'),
  {
    ...result('2026-09-05', 'Black Hat MEA CTF 2026 Qualifier', 1, 'https://blackhatmea.com/competition/capture-the-flag'),
    qualifiedForFinals: true,
    description: { ko: '온라인 예선 1위', en: 'Online qualifier winner' },
  },
  {
    ...result('2026-09-05', 'TFC CTF 2026', 10, 3344),
    timelineNote: { ko: 'seojin fan club', en: 'seojin fan club' },
    description: { ko: 'seojin fan club 팀으로 참가', en: 'Competed as seojin fan club' },
  },
  {
    ...result('2026-08-29', 'DiceCTF 2026 Finals', 11, 3416, 'Hack quest'),
    description: { ko: '뉴욕 본선 · DDA-com', en: 'New York finals · DDA-com' },
  },
  {
    ...result('2026-08-07', 'DEF CON 34 CTF Finals', 7, 'https://www.dailysecu.com/news/articleView.html?idxno=207969', 'Attack & Defense'),
    photos: achievementImages.defconFinals,
    description: { ko: "Jinddabi’s 연합팀으로 본선 참가", en: 'Finals as part of the Jinddabi’s coalition' },
  },
  {
    ...result('2026-07-23', 'CODEGATE 2026 Finals', 2, 'https://zdnet.co.kr/view/?no=20260724173734'),
    photos: achievementImages.codegateFinals,
    description: { ko: '일반부 본선 · 따따', en: 'General division finals · dda_com' },
  },
  {
    ...result('2026-07-09', 'HackTheon Sejong 2026 Finals', 1, 'https://www.yna.co.kr/view/AKR20260710119900063'),
    photos: achievementImages.hacktheonAdvanced,
    timelineName: { ko: 'HackTheon 고급부', en: 'HackTheon Advanced' },
    description: { ko: '고급부문 대상 · 정현수의전역을축하합니다', en: 'Advanced division winner · 정현수의전역을축하합니다' },
  },
  {
    ...result('2026-07-09', 'HackTheon Sejong 2026 Finals', 2, 'https://hacktheon.org/y2026/p2/c2/'),
    photos: achievementImages.hacktheonBeginner,
    timelineName: { ko: 'HackTheon 초급부', en: 'HackTheon Beginner' },
    description: { ko: '초급부문 본선 2위', en: 'Beginner division runner-up' },
  },
  { ...result('2026-06-14', 'SCTF 2026', 1, 3314), photos: achievementImages.sctf },
  {
    ...result('2026-06-06', 'SAS CTF 2026 Quals', 5, 3109),
    photos: achievementImages.sasQuals,
    qualifiedForFinals: true,
  },
  {
    ...result('2026-05-22', 'DEF CON 34 CTF Qualifier', 6, 3205),
    qualifiedForFinals: true,
    description: { ko: 'Jinddabi’s 연합팀으로 참가', en: 'As part of the Jinddabi’s coalition' },
  },
  result('2026-05-10', 'Midnight Sun CTF 2026 Quals', 11, 2773),
  {
    ...result('2026-05-10', 'Azure Assassin Alliance CTF 2026', 1, 3266),
    photos: achievementImages.actf,
    timelineName: { ko: 'ACTF', en: 'ACTF' },
    timelineNote: { ko: 'XCTF 본선 시드', en: 'XCTF Finals seed' },
    description: { ko: 'ACTF 우승 · 제10회 XCTF 본선 시드 획득', en: 'ACTF winner · Secured a seed for the 10th XCTF Finals' },
  },
  result('2026-04-10', 'UMassCTF 2026', 8, 2937),
  {
    ...result('2026-03-28', 'Codegate CTF 2026 Preliminary', 12, 3131),
    photos: achievementImages.codegateQuals,
    qualifiedForFinals: true,
  },
  {
    ...result('2026-03-21', 'ENKI RedTeam CTF 2026', 2, 'https://v.daum.net/v/20260324211343216'),
    photos: achievementImages.enki,
    timelineNote: { ko: '8l4nk', en: '8l4nk' },
    description: { ko: '개인전 · 8l4nk', en: 'Individual competition · 8l4nk' },
  },
  {
    ...result('2026-03-21', 'ENKI RedTeam CTF 2026', 4, 'https://v.daum.net/v/20260324211343216'),
    photos: achievementImages.enki,
    timelineNote: { ko: 'nobody09', en: 'nobody09' },
    description: { ko: '개인전 · nobody09', en: 'Individual competition · nobody09' },
  },
  { ...result('2026-03-14', 'SUCTF 2026', 2, 3161), photos: achievementImages.suctf },
  {
    ...result('2026-03-07', 'DiceCTF 2026 Quals', 5, 3110),
    photos: achievementImages.diceQuals,
    qualifiedForFinals: true,
  },
  { ...result('2026-02-20', 'BITSCTF 2026', 1, 3122), photos: achievementImages.bitsctf },
  {
    ...result('2026-02-08', 'HCTF 2026', 2, 'https://forge.hspace.io/competitions/69770d9ac6511438ead39267'),
    photos: achievementImages.hctf,
    description: { ko: '제5회 한양대학교 해킹방어대회', en: '5th Hanyang University CTF' },
  },
];

export const members: Member[] = [
  {
    handle: '8l4nk',
    role: { ko: '팀장', en: 'Team captain' },
    disciplines: [],
    bio: { ko: '', en: '' },
  },
  {
    handle: 'sane100400',
    disciplines: [],
    bio: { ko: '', en: '' },
  },
  {
    handle: 'Axii',
    disciplines: [],
    bio: { ko: '', en: '' },
  },
  {
    handle: 'nobody09',
    disciplines: [],
    bio: { ko: '', en: '' },
  },
  {
    handle: 'Dbi',
    disciplines: [],
    bio: { ko: '', en: '' },
  },
  {
    handle: 'love09010224',
    disciplines: [],
    bio: { ko: '', en: '' },
  },
  {
    handle: 'snowball',
    disciplines: [],
    bio: { ko: '', en: '' },
  },
];
