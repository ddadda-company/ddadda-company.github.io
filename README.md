# dda_com | CTF TEAM

따따 팀의 한국어·영어 정적 웹사이트. Astro로 HTML을 미리 생성합니다. 서버, 데이터베이스, API 키 없이 `dist/`를 정적 호스팅에 올릴 수 있습니다.

## 실행

Node.js 24를 사용합니다.

```bash
npm install
npm run dev
```

기본 주소: http://localhost:4321

```bash
npm run check
npm run build
npm run preview
```

빌드 결과는 `dist/`입니다. 도메인 루트에 배포하는 구성입니다. `404.html`을 호스팅 서비스의 오류 페이지로 지정하세요.

## 페이지와 언어

| 페이지 | 한국어 | 영어 |
| --- | --- | --- |
| 팀 소개 | `/` | `/en/` |
| 성과 | `/achievements/` | `/en/achievements/` |
| 멤버 | `/members/` | `/en/members/` |
| 문의 | `/contact/` | `/en/contact/` |

KO / EN은 현재 페이지를 유지하며 언어를 전환합니다. 선택한 언어는 브라우저에 저장되고 다음 루트 방문에 적용됩니다. 언어가 명시된 링크는 직접 접근할 수 있습니다. 자바스크립트가 꺼져 있어도 모든 내용과 언어 링크를 사용할 수 있습니다.

## 내용 수정

- `src/data/team.ts`: 멤버, 대회 기록, 이메일, 외부 링크, CTFtime 순위
- `src/data/i18n.ts`: 한국어·영어 문구
- `tokens.css`: 색상, 폰트, 간격, 모션
- `src/styles/global.css`: 공통 동작과 기본 레이아웃
- `src/styles/studio.css`: 공통 디자인의 레이아웃, 폰트, 반응형 스타일
- `src/styles/playroom.css`, `src/scripts/playroom.ts`: 성과 페이지의 가로 스크롤 장난감 방과 여러 줄로 이어지는 날짜 타임라인

멤버는 `members` 배열에 아래 형식으로 추가합니다. 아래는 작성 형식 예시이며, 사진·역할·분야·연락처는 확인된 값만 입력합니다. 사진은 1:1 규격(권장 600×600)으로 `public/images/members/`에 넣고 `/images/members/파일명.webp`처럼 연결합니다. 다른 비율의 사진은 중앙을 기준으로 정사각형으로 자릅니다.

```ts
{
  handle: '닉네임',
  photo: '/images/members/profile.webp',
  disciplines: ['Web', 'Pwn'],
  bio: { ko: '한국어 소개', en: 'English introduction' },
  github: 'https://github.com/실제계정',
  email: 'member@example.com',
  url: 'https://example.com',
}
```

사진이 없으면 팀 색상 위에 닉네임 첫 글자를 표시합니다. 사진을 등록하면 해당 영역이 대표사진으로 교체됩니다. 소개는 이름 아래에 표시하며, GitHub·이메일은 실제 주소를 넣을 때 링크로 활성화됩니다. 전체 기록과 프로필은 각 세부 페이지에서 제공합니다.

공식 팀 이메일은 `ddacom77@gmail.com`입니다. `team.email`에 등록되어 있으며, 한국어·영어 문의 페이지에서 메일 링크와 주소 복사 버튼을 제공합니다. 문의 폼이나 전송 서버는 없습니다. `team.github`을 채우면 GitHub 링크가 나타납니다.

## 성과 출처

[CTFtime 따따 팀 #425478](https://ctftime.org/team/425478)의 2026-10-13 조회 기준 세계 16위, 한국 3위와 참가 기록 10건을 반영했습니다. 여기에 팀이 제공한 누락 기록과 웹 출처로 확인한 결과 12건을 추가해 총 22건을 표시합니다. 각 대회는 CTFtime 기록, 공식 대회 안내 또는 결과 보도로 연결됩니다. 웹에서 개별 순위를 확인하지 못한 항목은 아래 표에 팀 제공 기록임을 명시했습니다. 각 달력은 UTC 기준 대회 시작일을 표시합니다.

| 대회 기간 | 대회 | 결과 및 참가 팀명 | 확인 출처 |
| --- | --- | --- | --- |
| 2026-02-08 | HCTF 2026 | 제5회 한양대학교 해킹방어대회 2위 | 순위: 팀 제공. [공식 대회 일정](https://forge.hspace.io/competitions/69770d9ac6511438ead39267). 공개 안내에는 개별 순위가 없으며 2월 8일 대회 시작일을 사용합니다. |
| 2026-03-21–22 | ENKI RedTeam CTF 2026 | 개인전 2위 8l4nk · 4위 nobody09 (별도 2건) | [보안뉴스 결과 보도·스코어보드 이미지](https://v.daum.net/v/20260324211343216). 이미지의 닉네임과 순위를 대조했습니다. |
| 2026-05-22–24 | DEF CON 34 CTF Qualifier | Jinddabi’s 연합팀 · 6위, 본선 진출 | [CTFtime 일정·순위](https://ctftime.org/event/3205/), [본선 진출·최종 결과 보도](https://www.dailysecu.com/news/articleView.html?idxno=207969) |
| 2026-07-09 | HackTheon Sejong 2026 Finals | 고급부문 대상(1위) · 정현수의전역을축하합니다 | [공식 본선 일정·방식](https://hacktheon.org/y2026/p2/c2/), [연합뉴스 수상 결과](https://www.yna.co.kr/view/AKR20260710119900063) |
| 2026-07-09 | HackTheon Sejong 2026 Finals | 초급부문 2위 | 순위: 팀 제공. [공식 본선 일정·방식](https://hacktheon.org/y2026/p2/c2/). 개별 팀명과 수상 명칭은 확인되지 않아 추가하지 않습니다. |
| 2026-07-23–24 | CODEGATE 2026 Finals | 일반부 본선 2위 · 따따 | [CTFtime 일정·방식](https://ctftime.org/event/3292/), [ZDNet Korea 수상 결과](https://zdnet.co.kr/view/?no=20260724173734) |
| 2026-08-07–09 | DEF CON 34 CTF Finals | Jinddabi’s 연합팀 · 본선 7위 | [CTFtime 일정·방식](https://ctftime.org/event/3322), [데일리시큐 최종 결과](https://www.dailysecu.com/news/articleView.html?idxno=207969) |
| 2026-08-29–30 | DiceCTF 2026 Finals | 본선 11위 · DDA-com | [CTFtime 공식 등록 일정·점수표](https://ctftime.org/event/3416/). 형식은 Hack quest이며 예선 5위 기록과 별도로 표시합니다. |
| 2026-09-05 | Black Hat MEA CTF 2026 Qualifier | 온라인 예선 1위 | 순위: 팀 제공. [주최 측 최신 예선 안내](https://blackhatmea.com/competition/capture-the-flag). CTFtime의 8월 29일보다 주최 측이 명시한 9월 5일 일정을 우선했습니다. 참가 당시 팀명은 추가하지 않습니다. |
| 2026-09-17 | CCE 2026 Finals | 본선 진출 | 참가: 팀 제공. [공식 본선 일정](https://cybersummit.kr/cce/overview). 확인되지 않은 순위는 입력하지 않습니다. |
| 2026-09-28 | SCAN 2026 Final | 본선 2위 · hello | [공식 일정·수상 결과](https://scan.sx/), [CTFtime 일정·방식](https://ctftime.org/event/3417/), [디지털애셋 수상 결과](https://www.digitalasset.works/news/articleView.html?idxno=43330) |

따따와 개별 팀원의 참가 관계는 사용자 제공 정보에 근거합니다. 공개 점수표·보도로 확인한 순위와 팀 제공 순위는 표에서 구분합니다. DEF CON은 Jinddabi’s 연합팀 참가로 명시합니다. 핵테온의 7월 10일은 시상식 날짜로, 본선 시작일인 7월 9일과 구분했습니다. SCAN은 hello 팀의 본선 준우승으로 표시하며 10월 1일 시상식과 9월 28일 본선을 구분했습니다. CTFtime에 점수표가 없는 본선은 공식 수상 안내나 결과 보도를 연결하며, 연합팀 기록이나 추가 본선 성적을 따따의 CTFtime 연간 점수에 합산하지 않습니다.

기존 `Azure Assassin Alliance CTF 2026` 기록이 ACTF입니다. 중복 대회를 만들지 않고 “ACTF 우승 · 제10회 XCTF 본선 시드 획득” 설명을 추가했습니다. [주최 측 대회 아카이브](https://github.com/team-s2/ACTF-2026)에 따따의 우승과 우승팀의 본선 초청 자격이 함께 명시돼 있습니다.

`rank: null`은 순위가 확인되지 않은 본선 진출 기록입니다. 해당 블록은 `본선`/`FINAL`로 표시하며 `입상` 필터와 순위 그래프에서는 제외합니다. ENKI는 개인전 기록을 팀원별로 분리하고, HackTheon은 고급·초급부문을 구분합니다.

방문 시 외부 API를 호출하지 않습니다. 새로운 성과는 `src/data/team.ts`의 `achievements`에 추가하고 다시 빌드하세요. 연간 순위를 다시 조회했을 때만 `rating`과 그 안의 `checkedAt`을 함께 갱신합니다. `입상` 필터는 1–3위를 표시합니다. 멤버는 요청에 따라 `8l4nk`(팀장), `sane100400`, `Axii`, `nobody09`, `Dbi`, `love09010224`, `snowball` 총 7명을 등록했습니다. 확인 전인 다른 닉네임이나 분야·소개는 추가하지 않았습니다.

## 디자인과 에셋

- 메인 색상: Rose Quartz `#F7CAC9`, Serenity `#92A8D1`를 기반으로 한 OKLCH 토큰
- 영문 워드마크·제목: [Fraunces](https://github.com/undercasetype/Fraunces) ExtraBold. Recoleta와 비슷한 무료 폰트를 사용해 달라는 요청에 따라 둥근 세리프인 Fraunces의 SOFT 100, optical size 72 스타일을 적용했습니다. 헤더와 메인 워드마크에 동일하게 사용합니다.
- 제목: [페이퍼로지](https://freesentation.blog/paperlogyfont) Bold / ExtraBold
- 본문·메뉴: [원티드 산스](https://github.com/wanteddev/wanted-sans) Variable
- 폰트는 로컬 WOFF2로 제공하며 SIL Open Font License를 `public/fonts/`에 동봉했습니다.
- 공식 원본 `theme.png`는 보존했습니다. 첫 화면은 원본의 캐릭터·D·키보드·깃발을 바탕으로 제작한 배경 없는 입체 일러스트 `public/images/team-object-v2.webp`를 사용합니다. 기존 공식 이미지는 소셜 미리보기용으로 유지합니다. 제작 기록: [docs/image-assets.md](docs/image-assets.md).
- 등장 애니메이션, 페이지 전환, 링크·메뉴 인터랙션과 `prefers-reduced-motion`을 지원합니다.
- 멤버 페이지는 정사각형 대표사진에 윗면·옆면을 붙인 장난감 블록 형태입니다. 7명을 데스크톱에서는 4명 + 가운데 정렬한 3명으로 배치합니다. 태블릿은 2열에 마지막 1명을 가운데 정렬하고, 모바일은 1열입니다. 모든 화면에서 사진 자체는 1:1이며 각 멤버 블록의 크기는 같습니다. 포인터에 따라 블록이 가볍게 기울며 모션 줄이기 설정과 터치 환경에서는 공간 이동 효과를 끕니다.
- 멤버 블록은 등록 순서대로 세레니티 블루, 로즈 핑크, 라일락, 민트, 버터 옐로, 피치, 틸의 서로 다른 7색을 사용합니다. 무지개 순서로 나열하지 않으며, 각 블록의 옆면과 글자 그림자도 해당 색상에 맞춥니다.
- 첫 화면은 팀 소개와 프레임 없는 캐릭터 이미지, 작은 CTF 인터랙션으로 구성됩니다. 깃발·키보드·자물쇠를 누르면 분석 문제를 엽니다. 같은 장난감 재질의 오브젝트를 유지하며, 투명 글씨 플래그는 별도 단서 문구 없이 숨겨두었습니다. 마우스 드래그, 모바일의 텍스트 선택, 키보드 초점으로 발견할 수 있고, 한 번 발견하면 글씨와 복사 버튼이 계속 표시됩니다. JavaScript가 없어도 선택 영역에서는 글씨가 보입니다. 성과·멤버는 링크로 연결합니다.
- [TeamH4C](https://h4c.team/)의 연도별 성과와 역할 중심 멤버 구성, [idek](https://idek.team/)와 [Perfect Blue](https://perfect.blue/)의 CTF 팀 콘텐츠 구성을 참고했습니다. 세부 방향은 [design.md](design.md)에 기록했습니다.
- 임의의 슬로건, 팀 철학, FAQ와 장식용 설명은 사용하지 않습니다. 영문 소제목과 중복된 작은 안내 문구도 제거했습니다.
- 메인만 하나의 로즈쿼츠·세레니티 배경을 사용합니다. 성과·멤버·문의는 크림색 단색 배경입니다. 헤더·본문·푸터에 별도의 색 면을 덧씌우지 않으며, 내비게이션 버튼은 키캡처럼 눌립니다. 입상 순위는 월계관 없이 금·은·동 색상과 숫자로 구분합니다.
- 성과 페이지 상단은 구름 벽지와 나무 바닥이 있는 기존 장난감 방입니다. 순위 블록·달력은 가로 스크롤, 이전·다음 버튼, 드래그·터치, 방향키·Home·End로 이동하며 선택한 블록이 앞에 보입니다. 하단 날짜 목록만 화면 폭에 따라 7·5·4·3열로 줄바꿈하고, 각 줄이 좌우로 번갈아 진행하며 곡선으로 이어집니다. 날짜 목록에는 가로 스크롤이 없고 연도·MM.DD·순위 및 본선 상태를 표시합니다. 날짜를 선택하면 위쪽 블록과 선택 표시가 동기화되며, 필터·화면 크기·글꼴 변화 시 날짜 배치와 연결선을 갱신합니다. JavaScript 없이도 모든 블록과 날짜 앵커를 사용할 수 있고 날짜는 일반 격자로 줄바꿈합니다. 모션 줄이기 설정에서는 즉시 이동합니다.
- 파비콘은 DD와 곰 얼굴을 조합한 SVG이며 PNG 32px, Apple touch 180px, ICO 16/32/48px도 제공합니다.

## 숨은 플래그

총 7개입니다. 투명 글씨는 안내 문구 없이 숨겨두었습니다. 나머지 여섯 문제는 사이트 안에서 코드·공개키·로그·Git 객체를 분석하고 플래그를 제출하는 방식입니다. 자료별 펼치기와 복사를 제공하며 다운로드나 외부 서비스 접속은 필요하지 않습니다.

| 오브젝트 | 문제 | 분석 자료 |
| --- | --- | --- |
| 홈의 깃발 | 신뢰의 경계 | JWT 검증 코드, 정상 토큰, 공개키, 봉인 데이터 |
| 홈의 키보드 | 검사기 | 상태를 갱신하며 입력을 검사하는 C 코드 |
| 홈의 자물쇠 | 서로 다른 두 키 | RSA 공개키 두 개와 암호문 |
| 성과의 연도 팻말 | 사라진 내보내기 | Git 참조와 압축된 객체 기록 |
| 멤버의 작은 블록 | 흩어진 기록 | DNS 질의 로그 |
| 문의의 봉투 | 서명된 편지 | 정상 MAC과 메시지, 서명 코드 |

`src/data/escape.ts`는 제목·설명·위치를, `challenge-materials.json`은 화면의 분석 자료를, `challenge-manifest.json`은 정답의 SHA-256 해시를 보관합니다. 여섯 문제의 정답 문자열은 HTML/JavaScript에 포함하지 않습니다. 공개 자료로부터 답을 도출할 수 있도록 만들었으며, 정답·개인키·풀이 스크립트는 배포하지 않습니다. 분석 자료 속 취약한 코드는 의도적으로 만든 가상 문제이며 사이트에서 실행되지 않습니다.

플래그 입력은 `dda{...}` 형식, 허용 문자와 최대 133자를 확인한 뒤 Web Crypto의 SHA-256으로 검증합니다. 입력값을 HTML, URL, 코드로 해석하지 않습니다. 발견한 값과 분석 코드는 텍스트로만 렌더링합니다. 저장소에서 읽은 값도 크기·형식·해시를 다시 검증하고 정해진 7개 ID만 처리합니다. 서버, 명령 실행, 외부 제출 API는 없습니다. 정적 사이트의 로컬 수집 기록이며, 순위나 상금이 걸린 대회의 서버 측 판정 체계는 아닙니다.

기록은 `dda_com-flags-v2`에 저장하고 한국어·영어가 공유합니다. 구판 기록에서는 변경되지 않은 투명 글씨만 이어받습니다. 저장소가 차단되어도 현재 페이지에서 제출과 수집을 사용할 수 있습니다. 7개를 모두 찾으면 문이 열리고 깃발과 색종이가 나타나는 완료 연출을 재생하며, 수집함에서 다시 볼 수 있습니다. 모션 줄이기 설정에서는 정적인 완료 화면을 표시합니다.

모든 문제는 키보드와 터치로 열고 제출할 수 있습니다. 코드 영역은 독립적으로 스크롤되며, 퍼즐 창은 Escape로 닫고 열었던 오브젝트로 초점이 돌아갑니다. JavaScript를 꺼도 사이트 본문, 성과 링크, 메일 링크와 투명 텍스트 선택은 유지됩니다.

## GitHub Pages 배포

- 사이트: https://ddadda-company.github.io/
- 저장소: https://github.com/ddadda-company/ddadda-company.github.io
- `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 타입 검사와 정적 빌드를 실행한 뒤 GitHub Pages에 배포합니다.
- Pages 설정은 GitHub Actions 방식입니다. 빌드 결과를 별도 브랜치에 커밋하지 않습니다.
- 도메인을 변경한다면 `astro.config.mjs`의 `site`도 함께 수정하세요.
