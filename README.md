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
- `src/styles/playroom.css`, `src/scripts/playroom.ts`: 성과 페이지의 장난감 방, 날짜 레일, 이동 동작

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

[CTFtime 따따 팀 #425478](https://ctftime.org/team/425478)의 2026-10-13 조회 기준 정적 스냅샷입니다. 세계 16위, 한국 3위, 참가 기록 10건을 반영했습니다. 각 대회의 이름·날짜·방식·순위는 해당 CTFtime 대회 페이지에 연결되어 있습니다. 날짜는 대회 시작일의 UTC 기준입니다.

방문 시 외부 API를 호출하지 않습니다. 새로운 성과나 순위는 `src/data/team.ts`에서 `achievements`, `rating`, `checkedAt`을 함께 수정하고 다시 빌드하세요. `입상` 필터는 1–3위를 표시합니다. 멤버는 요청에 따라 `8l4nk`(팀장), `sane100400`, `Axii`, `nobody09`, `Dbi`, `love09010224`를 등록했습니다. 확인 전인 다른 닉네임이나 분야·소개는 추가하지 않았습니다.

## 디자인과 에셋

- 메인 색상: Rose Quartz `#F7CAC9`, Serenity `#92A8D1`를 기반으로 한 OKLCH 토큰
- 영문 워드마크·제목: [Fraunces](https://github.com/undercasetype/Fraunces) ExtraBold. Recoleta와 비슷한 무료 폰트를 사용해 달라는 요청에 따라 둥근 세리프인 Fraunces의 SOFT 100, optical size 72 스타일을 적용했습니다. 헤더와 메인 워드마크에 동일하게 사용합니다.
- 제목: [페이퍼로지](https://freesentation.blog/paperlogyfont) Bold / ExtraBold
- 본문·메뉴: [원티드 산스](https://github.com/wanteddev/wanted-sans) Variable
- 폰트는 로컬 WOFF2로 제공하며 SIL Open Font License를 `public/fonts/`에 동봉했습니다.
- 공식 원본 `theme.png`는 보존했습니다. 첫 화면은 원본의 캐릭터·D·키보드·깃발을 바탕으로 제작한 배경 없는 입체 일러스트 `public/images/team-object-v2.webp`를 사용합니다. 기존 공식 이미지는 소셜 미리보기용으로 유지합니다. 제작 기록: [docs/image-assets.md](docs/image-assets.md).
- 등장 애니메이션, 페이지 전환, 링크·메뉴 인터랙션과 `prefers-reduced-motion`을 지원합니다.
- 멤버 페이지는 정사각형 대표사진에 윗면·옆면을 붙인 장난감 블록 형태입니다. 데스크톱 4열, 태블릿 2열, 모바일 1열이며, 모든 화면에서 사진 자체는 1:1입니다. 포인터에 따라 블록이 가볍게 기울며 모션 줄이기 설정과 터치 환경에서는 공간 이동 효과를 끕니다.
- 첫 화면은 팀 소개와 프레임 없는 캐릭터 이미지, 작은 CTF 인터랙션으로 구성됩니다. 장난감 깃발을 위로 당기거나 클릭하면 `dda{y0u_f0und_th3_fl4g}`가 나타납니다. Enter·Space, 복사, 다시 잡기를 지원합니다. 키보드와 열린 자물쇠도 같은 장난감 재질로 제작했습니다. 성과·멤버는 링크로 연결합니다.
- [TeamH4C](https://h4c.team/)의 연도별 성과와 역할 중심 멤버 구성, [idek](https://idek.team/)와 [Perfect Blue](https://perfect.blue/)의 CTF 팀 콘텐츠 구성을 참고했습니다. 세부 방향은 [design.md](design.md)에 기록했습니다.
- 임의의 슬로건, 팀 철학, FAQ와 장식용 설명은 사용하지 않습니다. 영문 소제목과 중복된 작은 안내 문구도 제거했습니다.
- 메인만 하나의 로즈쿼츠·세레니티 배경을 사용합니다. 성과·멤버·문의는 크림색 단색 배경입니다. 헤더·본문·푸터에 별도의 색 면을 덧씌우지 않으며, 내비게이션 버튼은 키캡처럼 눌립니다. 입상 순위는 월계관 없이 금·은·동 색상과 숫자로 구분합니다.
- 성과 페이지는 구름 벽지와 나무 바닥이 있는 장난감 방입니다. 대회마다 큰 순위 숫자 블록과 월·일 달력을 배치하고 왼쪽의 오래된 대회부터 오른쪽의 최신 대회까지 이어집니다. 타임라인 시작에 연도 `2026`을 한 번 표시하고, 각 대회 날짜는 `02.20`처럼 월·일만 표시합니다. 연도는 날짜 레일을 넘겨도 그대로 보입니다. 날짜 레일, 이전·다음 버튼, 마우스 드래그, 터치·트랙패드 스크롤, 방향키·Home·End로 이동합니다. 블록 크기는 화면 중심과의 거리에 따라 연속적으로 바뀌고, 마우스 드래그를 놓으면 관성을 반영해 가까운 대회에 정렬됩니다. 입상·연도 필터를 적용하면 날짜 레일도 함께 갱신됩니다. 모션 줄이기 설정에서는 즉시 이동하며, JavaScript 없이도 모든 대회 링크와 날짜 앵커를 사용할 수 있습니다. 배경은 imagegen으로 제작한 `public/images/achievements-playroom-v2.webp`이고, 순위·날짜·대회명은 HTML입니다.
- 파비콘은 DD와 곰 얼굴을 조합한 SVG이며 PNG 32px, Apple touch 180px, ICO 16/32/48px도 제공합니다.

## GitHub Pages 배포

- 사이트: https://ddadda-company.github.io/
- 저장소: https://github.com/ddadda-company/ddadda-company.github.io
- `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 타입 검사와 정적 빌드를 실행한 뒤 GitHub Pages에 배포합니다.
- Pages 설정은 GitHub Actions 방식입니다. 빌드 결과를 별도 브랜치에 커밋하지 않습니다.
- 도메인을 변경한다면 `astro.config.mjs`의 `site`도 함께 수정하세요.
