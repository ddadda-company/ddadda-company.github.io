// This is the only file needed to add official team records and profiles.
// Unconfirmed facts are intentionally left empty. See README.md for examples.
export type Localized = { ko: string; en: string };
export type Discipline = 'Web' | 'Pwn' | 'Reverse' | 'Crypto' | 'Forensics' | 'Misc';

export interface Achievement {
  date: string; // ISO date, YYYY-MM-DD
  event: string;
  rank: number;
  placement: Localized;
  format: 'Jeopardy' | 'Attack & Defense' | 'Other';
  description?: Localized;
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

// Additional finals and coalition results verified 2026-10-15; see README.md for sources.
// These entries do not change the separate CTFtime team-rating snapshot above.
export const achievements: Achievement[] = [
  result('2026-09-26', 'FAUST CTF 2026', 5, 3312, 'Attack & Defense'),
  {
    ...result('2026-08-07', 'DEF CON 34 CTF Finals', 7, 'https://www.dailysecu.com/news/articleView.html?idxno=207969', 'Attack & Defense'),
    description: { ko: "Jinddabi’s 연합팀으로 본선 참가", en: 'Finals as part of the Jinddabi’s coalition' },
  },
  {
    ...result('2026-07-23', 'CODEGATE 2026 Finals', 2, 'https://zdnet.co.kr/view/?no=20260724173734'),
    description: { ko: '일반부 본선 · 따따', en: 'General division finals · dda_com' },
  },
  {
    ...result('2026-07-09', 'HackTheon Sejong 2026 Finals', 1, 'https://www.yna.co.kr/view/AKR20260710119900063'),
    description: { ko: '고급부문 대상 · 정현수의전역을축하합니다', en: 'Advanced division winner · 정현수의전역을축하합니다' },
  },
  result('2026-06-14', 'SCTF 2026', 1, 3314),
  result('2026-06-06', 'SAS CTF 2026 Quals', 5, 3109),
  {
    ...result('2026-05-22', 'DEF CON 34 CTF Qualifier', 6, 3205),
    description: { ko: 'Jinddabi’s 연합팀으로 참가 · 본선 진출', en: 'As part of the Jinddabi’s coalition · Qualified for finals' },
  },
  result('2026-05-10', 'Midnight Sun CTF 2026 Quals', 11, 2773),
  result('2026-05-10', 'Azure Assassin Alliance CTF 2026', 1, 3266),
  result('2026-04-10', 'UMassCTF 2026', 8, 2937),
  result('2026-03-28', 'Codegate CTF 2026 Preliminary', 12, 3131),
  result('2026-03-14', 'SUCTF 2026', 2, 3161),
  result('2026-03-07', 'DiceCTF 2026 Quals', 5, 3110),
  result('2026-02-20', 'BITSCTF 2026', 1, 3122),
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
