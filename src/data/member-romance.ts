import type { Localized } from './team';

interface Choice { label: Localized; reply: Localized; points: number; }
interface Scene { line: Localized; choices: Choice[]; }

// Fictional dialogue for the optional profile mini-game.
export const romanceScenes: Scene[] = [
  {
    line: { ko: '또 눌렀네. 그렇게 내가 보고 싶었어?', en: 'You clicked again. Did you miss me that much?' },
    choices: [
      { label: { ko: '응, 너 보러 왔어.', en: 'Yes. I came to see you.' }, reply: { ko: '그렇게 바로 말하면… 좀 부끄럽잖아.', en: 'When you say it like that… I get a little shy.' }, points: 2 },
      { label: { ko: '플래그 찾으러 왔는데…', en: 'I was looking for a flag…' }, reply: { ko: '오늘은 플래그 말고 나부터 봐.', en: 'Today, look at me before the flags.' }, points: 1 },
      { label: { ko: '손이 미끄러졌어.', en: 'My finger slipped.' }, reply: { ko: '흠, 일단 믿어 줄게.', en: 'Hmm. I’ll believe you. For now.' }, points: 0 },
    ],
  },
  {
    line: { ko: '마침 쉬려던 참인데, 같이 뭐 할까?', en: 'I was about to take a break. What should we do?' },
    choices: [
      { label: { ko: '둘이 산책하자.', en: 'Let’s take a walk.' }, reply: { ko: '좋아. 오늘은 천천히 걷자.', en: 'I’d like that. Let’s take our time.' }, points: 2 },
      { label: { ko: '같이 문제 풀자.', en: 'Let’s solve a challenge.' }, reply: { ko: '너랑 같은 팀이면 괜찮지.', en: 'As long as we’re on the same team.' }, points: 1 },
      { label: { ko: '일단 잠부터 자자.', en: 'A nap sounds good.' }, reply: { ko: '많이 졸렸구나. 무리하지 마.', en: 'You must be tired. Take it easy.' }, points: 0 },
    ],
  },
  {
    line: { ko: '가기 전에 하나만. 다음에도 나 보러 올 거야?', en: 'One thing before you go. Will you come see me again?' },
    choices: [
      { label: { ko: '응, 또 보러 올게.', en: 'Yes. I’ll come back for you.' }, reply: { ko: '약속한 거다?', en: 'Promise?' }, points: 2 },
      { label: { ko: '다음 대회에서 보자.', en: 'See you at the next CTF.' }, reply: { ko: '그때도 내 옆자리 비워 둘게.', en: 'I’ll save you a seat next to me.' }, points: 1 },
      { label: { ko: '도감부터 다 모으고!', en: 'Let me finish the collection!' }, reply: { ko: '사진 속 나한테 질투해야 하나…', en: 'Should I be jealous of my own photos…?' }, points: 0 },
    ],
  },
];

export const romanceEndings = [
  { minimum: 5, title: { ko: '우리, 내일도 볼까?', en: 'Same time tomorrow?' }, line: { ko: '너 기다리는 건 괜찮을 것 같아. 내일도 꼭 와.', en: 'I think I wouldn’t mind waiting for you. Come back tomorrow.' } },
  { minimum: 3, title: { ko: '내 옆자리 예약', en: 'A seat beside me' }, line: { ko: '다음에도 같은 팀 하자. 네 자리는 내가 맡아 둘게.', en: 'Let’s team up again. I’ll keep your seat ready.' } },
  { minimum: 0, title: { ko: '아직은 조금 어색해', en: 'A little shy, for now' }, line: { ko: '오늘은 여기까지. 다음엔 실수 말고, 나 보러 눌러 줘.', en: 'That’s enough for today. Next time, click because you want to see me.' } },
];
