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
  url?: string; // Official result or write-up
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

function result(date: string, event: string, rank: number, id: number, format: Achievement['format'] = 'Jeopardy'): Achievement {
  const suffix = rank % 100 >= 11 && rank % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[rank % 10] ?? 'th');
  return { date, event, rank, placement: { ko: `${rank}위`, en: `${rank}${suffix}` }, format, url: `https://ctftime.org/event/${id}` };
}

export const achievements: Achievement[] = [
  result('2026-09-26', 'FAUST CTF 2026', 5, 3312, 'Attack & Defense'),
  result('2026-06-14', 'SCTF 2026', 1, 3314),
  result('2026-06-06', 'SAS CTF 2026 Quals', 5, 3109),
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
