import type { Localized } from './team';

export interface AchievementImage {
  kind: 'scoreboard' | 'result' | 'award';
  src: string;
  width: number;
  height: number;
  caption: Localized;
  credit?: { name: Localized; url: string };
  focus?: { left: number; top: number; width: number; height: number }; // Display window in original pixels
}

const image = (name: string, width: number, height: number, ko: string, en: string): AchievementImage => ({
  kind: 'scoreboard', src: `/images/scoreboards/2026/${name}.webp`, width, height, caption: { ko, en },
});

// Team-provided scoreboard images, selected from 사진자료 on 2026-10-15.
// ENKI uses the requested individual rank captures. SCAN uses its requested award photo.
export const achievementImages = {
  scanAward: [{
    kind: 'award' as const,
    src: '/images/achievements/2026/scan-award.webp', width: 600, height: 450,
    caption: {
      ko: 'SCAN 2026 본선 2위 hello 팀 · 2026.10.01 시상식',
      en: 'SCAN 2026 runner-up hello · Award ceremony on October 1, 2026',
    },
    credit: {
      name: { ko: '사진: 박재연 / 디지털애셋', en: 'Photo: Park Jae-yeon / Digital Asset' },
      url: 'https://www.digitalasset.works/news/articleView.html?idxno=43330',
    },
  }],
  sctf: [
    image('sctf-ranking', 1080, 1292, 'SCTF · dda_com 1위, 11,100점', 'SCTF · dda_com 1st, 11,100 points'),
    image('sctf-dashboard', 3360, 1890, 'SCTF 전체 스코어보드 · dda_com 1위', 'SCTF scoreboard overview · dda_com 1st'),
  ],
  actf: [image('actf', 1668, 504, 'ACTF · dda_com 1위, 9,343점', 'ACTF · dda_com 1st, 9,343 points')],
  hacktheonAdvanced: [image('hacktheon-advanced', 2775, 1223, 'HackTheon 고급부 · 정현수의전역을축하합니다 1위', 'HackTheon Advanced · 정현수의전역을축하합니다 1st')],
  hacktheonBeginner: [image('hacktheon-beginner', 2880, 2160, 'HackTheon 초급부 · SHA-4 2위', 'HackTheon Beginner · SHA-4 2nd')],
  suctf: [{
    ...image('suctf', 3198, 1340, 'SUCTF · dda_com 2위 · 순위 부분 확대', 'SUCTF · dda_com 2nd · Ranking detail'),
    focus: { left: 7, top: 200, width: 345, height: 170 },
  }],
  bitsctf: [image('bitsctf', 464, 578, 'BITSCTF · 따따 1위, 3,638점', 'BITSCTF · 따따 1st, 3,638 points')],
  diceQuals: [image('dice-quals', 1296, 1628, 'DiceCTF 예선 · dda.com 5위, 2,401점', 'DiceCTF Quals · dda.com 5th, 2,401 points')],
  codegateFinals: [{
    ...image('codegate-finals', 1291, 898, 'CODEGATE 본선 · 따따 2위, 4,956점 · 순위 부분 확대', 'CODEGATE Finals · 따따 2nd, 4,956 points · Ranking detail'),
    focus: { left: 0, top: 430, width: 415, height: 453 },
  }],
  codegateQuals: [{ ...image('codegate-quals', 1670, 1201,
    'CODEGATE 예선 캡처 · 이미지에는 13위로 표시되며, 최종 기록은 12위입니다.',
    'CODEGATE Quals capture · The image shows 13th; the final recorded placement is 12th.'),
    focus: { left: 165, top: 555, width: 455, height: 347 },
  }],
  hctf: [image('hctf', 696, 707, 'HCTF · 손이시립대 2위, 9,061점', 'HCTF · 손이시립대 2nd, 9,061 points')],
  sasQuals: [image('sas-quals', 952, 667, 'SAS CTF 예선 · dda_com 5위, 3,568점', 'SAS CTF Quals · dda_com 5th, 3,568 points')],
  enkiSecond: [{ ...image('enki-8l4nk', 2499, 482, 'ENKI RedTeam CTF · 8l4nk 2위', 'ENKI RedTeam CTF · 8l4nk 2nd'), kind: 'result' as const }],
  enkiFourth: [{ ...image('enki-nobody09', 1296, 263, 'ENKI RedTeam CTF · nobody09 4위', 'ENKI RedTeam CTF · nobody09 4th'), kind: 'result' as const }],
  defconFinals: [image('defcon-finals', 1444, 954, 'DEF CON 34 본선 최종 순위 · JIND 7위, 321,699점', 'DEF CON 34 final standings · JIND 7th, 321,699 points')],
};
