import type { Localized } from './team';
import type { Page } from './i18n';
import manifest from './challenge-manifest.json';

export type FlagId = 'capture' | 'invisible' | 'keyboard' | 'binary' | 'timeline' | 'blocks' | 'mirror';
export type PuzzleId = Exclude<FlagId, 'invisible'>;
export interface Challenge {
  id: FlagId;
  title: Localized;
  page: Page;
  anchor: string;
  location: Localized;
  description: Localized;
  digest: string;
}
// The transparent-text flag is intentionally part of the page. Other answers
// are recovered from the inline challenge materials, never embedded in this bundle.
export const invisibleFlag = 'dda{n0w_y0u_s33_m3}';
const definitions: Omit<Challenge, 'digest'>[] = [
  { id: 'capture', title: { ko: '신뢰의 경계', en: 'Trust boundary' }, page: 'home', anchor: 'puzzle-capture', location: { ko: '홈 · 깃발', en: 'Home · Flag' }, description: { ko: '정상 발급된 게스트 JWT와 검증 코드를 확보했습니다. 원래 개인키 없이 관리자 요청을 만들고, 봉인된 데이터에서 플래그를 복원하세요.', en: 'You have a legitimate guest JWT and the verification code. Produce an admin request without the original private key, then recover the flag from the sealed data.' } },
  { id: 'invisible', title: { ko: '흔적', en: 'A trace' }, page: 'home', anchor: 'trace', location: { ko: '홈', en: 'Home' }, description: { ko: '', en: '' } },
  { id: 'keyboard', title: { ko: '검사기', en: 'The checker' }, page: 'home', anchor: 'puzzle-keyboard', location: { ko: '홈 · 키보드', en: 'Home · Keyboard' }, description: { ko: '입력을 검사하는 코드입니다. 정수 연산과 상태 변화를 분석해 검사를 통과하는 플래그를 복원하세요.', en: 'This code checks its input. Analyze its integer operations and state changes to recover the accepted flag.' } },
  { id: 'binary', title: { ko: '서로 다른 두 키', en: 'Two different keys' }, page: 'home', anchor: 'puzzle-binary', location: { ko: '홈 · 자물쇠', en: 'Home · Padlock' }, description: { ko: '두 장비의 RSA 공개키와 암호문 하나가 남았습니다. key_a로 암호화된 원문을 복원하세요. 메시지 인코딩과 암호화 규칙은 자료에 들어 있습니다.', en: 'Two devices left behind their RSA public keys and one ciphertext. Recover the message encrypted with key_a. The material below specifies the encoding and encryption rules.' } },
  { id: 'timeline', title: { ko: '사라진 내보내기', en: 'The missing export' }, page: 'achievements', anchor: 'puzzle-timeline', location: { ko: '성과 · 연도 팻말', en: 'Results · Year plaque' }, description: { ko: '복구한 Git 객체 기록입니다. 현재 HEAD에는 플래그가 없습니다. 남은 객체를 분석해 과거의 내보내기를 되살리세요.', en: 'These are recovered Git objects. The current HEAD has no flag. Analyze the remaining objects and reconstruct an earlier export.' } },
  { id: 'blocks', title: { ko: '흩어진 기록', en: 'Scattered records' }, page: 'members', anchor: 'puzzle-blocks', location: { ko: '멤버 · 작은 블록', en: 'Members · Small blocks' }, description: { ko: '호스트 하나에서 남긴 DNS 트래픽을 확보했습니다. 전송된 파일을 복원하고 그 안의 플래그를 찾으세요. 실제 서버에 접속할 필요는 없습니다.', en: 'This log records DNS queries from one host. Reconstruct the transferred file and find its flag. No live server needs to be contacted.' } },
  { id: 'mirror', title: { ko: '서명된 편지', en: 'A signed letter' }, page: 'contact', anchor: 'puzzle-mirror', location: { ko: '문의 · 편지 봉투', en: 'Contact · Envelope' }, description: { ko: '정상 메시지와 MAC, 서명 코드가 있습니다. 비밀키를 복구하지 않고 추가 권한이 붙은 메시지의 유효한 MAC을 계산하세요. 정확한 입력과 제출 형식은 자료에 명시되어 있습니다.', en: 'You have a legitimate message, its MAC, and the signing code. Calculate a valid MAC for the extended message without recovering the secret key. The material below specifies the exact bytes and submission format.' } },
];
export const flags: readonly Challenge[] = definitions.map(challenge => ({ ...challenge, ...manifest[challenge.id] }));
