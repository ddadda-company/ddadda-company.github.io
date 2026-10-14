import { achievements, type Localized } from './team';
import type { Page } from './i18n';

export const flags = [
  { id: 'capture', flag: 'dda{y0u_f0und_th3_fl4g}', title: { ko: '잡았다, 깃발!', en: 'Catch the flag' }, page: 'home', anchor: 'capture-heading', clue: { ko: '홈의 파란 깃발을 위로 당겨보세요.', en: 'Pull up the blue flag on the homepage.' } },
  { id: 'invisible', flag: 'dda{n0w_y0u_s33_m3}', title: { ko: '빈칸의 비밀', en: 'Hidden in plain sight' }, page: 'home', anchor: 'secret-hint', clue: { ko: '홈의 빈칸에 정말 아무것도 없을까요?', en: 'Is that blank space on the homepage really empty?' } },
  { id: 'keyboard', flag: 'dda{0n3_k3y_b4ck}', title: { ko: '한 글자 뒤로', en: 'One letter back' }, page: 'home', anchor: 'puzzle-keyboard', clue: { ko: '홈에 놓인 장난감 키보드를 눌러보세요.', en: 'Try the toy keyboard on the homepage.' } },
  { id: 'binary', flag: 'dda{b1ts_unl0ck_1t}', title: { ko: '0과 1의 자물쇠', en: 'A lock of zeros and ones' }, page: 'home', anchor: 'puzzle-binary', clue: { ko: '홈의 분홍 자물쇠에는 비밀번호가 있어요.', en: 'The pink padlock on the homepage has a combination.' } },
  { id: 'timeline', flag: 'dda{t1m3_in_0rd3r}', title: { ko: '뒤섞인 달력', en: 'A shuffled calendar' }, page: 'achievements', anchor: 'puzzle-timeline', clue: { ko: '대회 기록의 나무 연도 팻말을 눌러보세요.', en: 'Press the wooden year plaque in the competition record.' } },
  { id: 'blocks', flag: 'dda{p41rs_4r3_k3y}', title: { ko: '블록의 뒷면', en: 'Behind the blocks' }, page: 'members', anchor: 'puzzle-blocks', clue: { ko: '멤버 페이지에 주인 없는 작은 블록이 있어요.', en: 'Find the little stack of blocks on the members page.' } },
  { id: 'mirror', flag: 'dda{th3_0th3r_s1d3}', title: { ko: '거울 편지', en: 'A mirror letter' }, page: 'contact', anchor: 'puzzle-mirror', clue: { ko: '문의 페이지의 봉투 안에 편지가 들어 있어요.', en: 'There is a letter inside the envelope on the contact page.' } },
] as const satisfies readonly { id: string; flag: string; title: Localized; page: Page; anchor: string; clue: Localized }[];

export type FlagId = typeof flags[number]['id'];
export type PuzzleId = Exclude<FlagId, 'capture' | 'invisible'>;
// Use the same dates and names as the public archive, never a second fact source.
export const calendarCards = ['SCTF 2026', 'BITSCTF 2026', 'SUCTF 2026']
  .map(event => achievements.find(record => record.event === event)!);
export const calendarAnswer = [...calendarCards].sort((a, b) => a.date.localeCompare(b.date)).map(record => record.event);
