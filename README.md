# dda_com | CTF TEAM

따따 팀의 한국어·영어 정적 웹사이트. Astro로 HTML을 미리 생성합니다. 서버, 데이터베이스, API 키 없이 `dist/`를 정적 호스팅에 올릴 수 있습니다.

공식 홈페이지: [따따 (dda_com)](https://ddadda-company.github.io/)

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

KO / EN은 현재 페이지를 유지하며 언어를 전환합니다. `/`는 항상 한국어, `/en/`은 항상 영어를 제공하며 저장된 언어 설정으로 자동 이동하지 않습니다. 각 언어의 내부 링크가 선택한 언어를 유지합니다. 자바스크립트가 꺼져 있어도 모든 내용과 언어 링크를 사용할 수 있습니다.

## SEO와 AI 검색 노출

`astro.config.mjs`의 `site`를 기준으로 검색 설정을 빌드합니다. 도메인을 바꾸면 canonical, 언어별 대체 주소, JSON-LD, 사이트맵과 robots.txt가 함께 바뀝니다.

- 한영 8개 페이지에 고유한 제목·설명, 절대 주소 canonical, 상호 연결된 `ko`·`en`·`x-default` hreflang, Open Graph·Twitter 카드가 들어갑니다.
- 사이트 이름은 `따따 (dda_com)`으로 통일하며, `WebSite`의 대체 이름에 `따따`와 `dda_com`을 함께 제공합니다. `Organization`의 기본 이름은 `따따`이고 홈의 주 제목에도 한글 팀명과 CTF 팀임을 표시합니다. [Google 사이트 이름 안내](https://developers.google.com/search/docs/appearance/site-names)에 따른 식별 정보이며 특정 검색어 순위를 보장하는 마크업은 아닙니다.
- `/sitemap.xml`과 대체 제출용 `/sitemap.txt`는 같은 실제 페이지 목록에서 생성하며 `/robots.txt`에 연결됩니다. XML에는 언어별 대체 주소도 포함합니다. 404는 사이트맵에서 제외하고 `noindex, follow`를 지정합니다. 404에 홈페이지 canonical이나 구조화 데이터를 붙이지 않습니다.
- `src/lib/seo.ts`에서 `Organization`, `WebSite`, 페이지 유형별 JSON-LD와 멤버 `Person`·`ItemList`를 생성합니다. 팀의 한영 이름, 공식 GitHub·CTFtime, 이메일과 실제 공개 프로필만 사용합니다. 미확인 수상·전문 분야·주소는 생성하지 않습니다.
- `Organization.alternateName`은 CTFtime에 등록된 `따따`·`dda_com`·`dda.com`의 관계를 제공합니다. 대체 이름은 `team.alternateNames`에서 관리하며, 공식 채널은 기존 하단 링크로 안내합니다.
- 검색용 favicon은 기존 팀 SVG에서 내보낸 96×96 PNG와 16/32/48px ICO를 명시하며, 브라우저용 SVG·32px PNG·Apple 아이콘도 유지합니다. 아이콘 주소는 버전 쿼리 없이 고정합니다. [Google favicon 안내](https://developers.google.com/search/docs/appearance/favicon-in-search)에 따라 배포 후 홈페이지의 재수집을 기다리거나 Search Console에서 루트 URL의 색인 생성을 요청합니다. 반영에는 며칠에서 몇 주가 걸릴 수 있으며 표시가 보장되지는 않습니다.
- 홈의 팀 설명·대표 대회 기록과 성과의 출처·기준일은 HTML 본문에서 읽을 수 있습니다. 홈의 인원·기록 수와 대표 성과는 `team.ts`의 실제 데이터에서 생성합니다. `featured: true`로 대표 성과를 선택하며 개인·연합팀 참가 설명도 그대로 표시합니다. CTFtime 순위는 `rating.checkedAt` 당시의 기록이며 실시간 순위로 표시하지 않습니다. 숨은 퍼즐 코드·플래그는 `data-nosnippet`으로 Google 검색 설명문에서 제외합니다.
- `User-agent: *` 규칙은 검색·AI 검색 크롤러를 포함해 공개 페이지 수집을 허용합니다. 이는 robots.txt 수준의 설정이며 각 서비스의 수집·인용을 보장하지 않습니다.

[Google의 AI 검색 안내](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)에 따라 읽을 수 있는 본문, 명확한 출처, 일반 SEO를 중심으로 구성했습니다. `llms.txt`나 AI 전용 마크업은 Google 검색 노출의 요건이 아니며 검색 순위나 AI 답변 인용을 보장하지 않습니다. 구조화 데이터는 [공식 Organization 안내](https://developers.google.com/search/docs/appearance/structured-data/organization), 언어 연결은 [다국어 페이지 안내](https://developers.google.com/search/docs/specialty/international/localized-versions)를 따릅니다.

Google 검색의 AI 요약·AI 모드와 Gemini 앱은 별도로 확인합니다. 검색의 생성형 AI 기능은 Search Console의 [Search generative AI 설정](https://support.google.com/webmasters/answer/16908024)에서 포함 여부를 확인할 수 있습니다. 이 설정을 Gemini 앱 인용 여부로 해석하지 않습니다. [Gemini 출처 안내](https://support.google.com/gemini/answer/14143489)에 따르면 모든 답변에 출처가 표시되는 것은 아닙니다. 노출 점검에는 서비스, 질문 원문, 로그인·모델 상태, 확인 시점과 실제 인용 URL을 함께 기록하며, 일반 검색 순위만으로 Gemini 인용 여부를 판단하지 않습니다.

빌드 결과 검증:

```bash
npm run check
npm run build
npm run check:seo
```

`check:seo`는 배포할 HTML을 읽어 페이지 누락·중복, 대표 주소, 언어 연결의 상호성, 제목·설명, 공유 이미지 파일, JSON-LD와 실제 멤버 앵커, XML·텍스트 사이트맵의 URL 일치, robots.txt, 404 검색 제외를 검사합니다. GitHub Pages 배포 작업에서도 실행합니다.

배포 이후에는 `npm run check:seo:live`로 공개 URL의 실제 HTTP 상태·Content-Type·색인 차단 헤더·소유권 태그·canonical·언어 연결·정적 본문·내부 링크·사이트맵·robots.txt와 존재하지 않는 주소의 404 응답까지 검사합니다. GitHub Actions도 배포 직후 이 검사를 실행합니다. 로컬 빌드 통과와 실제 호스팅 응답을 구분하기 위한 검사이며 Google의 수집·색인 완료를 의미하지 않습니다.

GitHub Pages에는 빌드된 HTML과 파일을 배포합니다. 이 저장소는 조직 사이트이므로 주소에 저장소 이름을 덧붙이지 않고 도메인 루트를 사용합니다. URL별 `index.html`을 생성하고 페이지 본문과 검색 태그를 초기 HTML에 포함하며, 실제 HTTP 404를 유지합니다. 언어별 주소·canonical·사이트맵의 주소를 일치시키고, 서버 설정 파일로 검색엔진 처리를 제어한다고 가정하지 않습니다. [GitHub Pages 구조](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Google 다국어 주소 안내](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

### 배포 후 검색 서비스 등록

2026-10-15 Google Search Console과 Bing Webmaster Tools의 소유권 인증을 완료하고 `/sitemap.xml`을 제출했습니다. 인증 태그는 GitHub Actions 저장소 변수에서 빌드에 전달합니다. 네이버 관리 도구 등록은 사용자 요청으로 제외했습니다.

2026-10-16 재점검에서 URL 검사상 8개 중 7개 페이지는 이미 색인이 생성되어 있었고 `/en/contact/`만 아직 알려지지 않은 URL로 표시되었습니다. 한국어 홈은 10월 15일 22:20:59 KST에 Googlebot 스마트폰으로 수집되었으며 Google이 선택한 표준 주소도 `/`입니다. XML 사이트맵의 10월 16일 14:12 KST 실시간 검사는 수집 허용·가져오기 성공을 확인했습니다. 직접 조치와 보안 문제도 없었습니다. 그러나 사이트맵 보고서는 XML·텍스트 모두 `가져올 수 없음`, 발견된 페이지 0개로 표시되었고, XML을 한 번 재제출한 직후에도 동일했습니다. 사이트맵 처리 실패와 개별 페이지 색인 여부는 별개이며 이 상태를 사이트 전체 색인 실패나 GitHub Pages 차단으로 단정하지 않습니다. 페이지 색인 생성 집계 보고서는 아직 데이터 처리 중이었습니다.

소유자 계정에서 Google Search Console, 네이버 서치어드바이저, Bing Webmaster Tools에 `https://ddadda-company.github.io/`를 등록합니다. HTML 태그 인증을 선택했다면 발급된 태그의 **content 값만** 각각 `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`으로 설정하세요. 로컬 빌드는 `.env.example`을 복사한 `.env`, GitHub Pages는 저장소의 Settings → Secrets and variables → Actions → Variables를 사용합니다. 인증 값은 HTML에 공개되는 토큰입니다. 값이 비어 있으면 태그를 출력하지 않습니다.

Google Search Console은 **URL 접두어** 속성으로 등록하세요. HTML 태그 인증은 DNS 인증이 필요한 도메인 속성에는 사용할 수 없습니다. [Google 소유권 확인 안내](https://support.google.com/webmasters/answer/9008080?hl=ko)

다시 빌드·배포한 다음 해당 서비스에서 소유권 확인을 완료하고 `https://ddadda-company.github.io/sitemap.xml`을 제출하세요. 검색 서비스 계정 등록과 사이트맵 제출은 코드 배포만으로 자동 완료되지 않습니다. 이후 URL 검사와 검색 노출 보고서에서 수집·색인 여부를 확인합니다.

사이트맵 보고서에 `읽을 수 없음`이 표시되면 제출 접수와 실제 수집 성공을 구분하세요. [Google의 점검 절차](https://support.google.com/webmasters/answer/7451001?hl=ko)에 따라 정확한 사이트맵 주소의 실시간 검사에서 수집 허용·가져오기 성공과 받은 원문을 확인합니다. XML이 정상 응답해도 해당 제출이 처리되지 않으면 같은 URL 목록을 담은 `https://ddadda-company.github.io/sitemap.txt`를 대체 주소로 제출할 수 있습니다. [텍스트 사이트맵도 Google 공식 지원 형식](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#text)이며, 최종 성공 여부는 보고서의 상태와 발견된 페이지 수로 확인합니다.

### IndexNow 수집 알림

`public/indexnow-key.txt`는 IndexNow가 도메인 소유권을 확인하는 공개 텍스트 파일입니다. [IndexNow 공식 프로토콜](https://www.indexnow.org/documentation)의 `keyLocation` 방식으로 사용합니다. 비밀번호나 검색 서비스 계정의 인증 토큰이 아닙니다.

```bash
# 전송 없이 로컬 빌드의 제출 대상 확인
npm run submit:indexnow -- --dry-run
# 배포가 끝난 뒤 실제 사이트의 키와 사이트맵을 확인하고 URL 제출
npm run submit:indexnow
```

이 스크립트는 배포된 사이트맵의 URL을 IndexNow 공통 엔드포인트에 한 번 전송합니다. 참여 검색엔진 사이에서 알림이 공유되므로 같은 URL을 서비스별로 중복 전송할 필요가 없습니다. HTTP 200은 접수 성공, 202는 접수 후 키 검증 대기 상태입니다. 실제 수집·색인 완료나 Google Search Console·네이버·Bing 관리 계정의 등록 완료를 의미하지 않습니다. 내용이 바뀐 배포 후에 사용하고 반복 제출하지 마세요. [지원 서비스와 제출 안내](https://www.indexnow.org/faq#url-submission)

## 모바일 구성

- 언어·메뉴 버튼은 최소 44×44px이며, 펼친 메뉴는 2열입니다. 큰 글자 설정으로 한 줄에 들어가지 않으면 헤더를 줄바꿈합니다.
- 홈의 세로 여백을 줄이고, 문의 페이지의 작은 봉투 옆에 소개를 배치해 이메일·메일 쓰기·복사를 첫 화면에서 사용할 수 있게 했습니다.
- 성과의 가로 스크롤 방과 아래로 이어지는 타임라인은 유지합니다. 모바일 사진 뷰어에서는 제목·닫기·이전/다음·원본/출처 링크가 화면 안에 남고, 사진·설명 영역만 세로 스크롤됩니다. 가로 모드에도 별도 높이 규칙을 적용합니다.
- 화면 가장자리와 팝업에 기기 안전 영역 여백을 반영하며, 연도 선택과 플래그 입력은 16px 이상입니다.
- 320·375·390·414·639·640·768·844·960·1440·1920px에서 한영 8개 경로를 확인했습니다. 사진 16장 전체의 소형/가로 화면, 실제 터치 스와이프·세로 이동·핀치 취소, 메뉴·언어 전환·이메일 복사·퍼즐 입력, 접근성 검사와 JavaScript 없는 탐색도 확인합니다.

## 내용 수정

- `src/data/team.ts`: 멤버, 대회 기록, 이메일, 외부 링크, CTFtime 순위
- `src/data/i18n.ts`: 한국어·영어 문구
- `tokens.css`: 색상, 폰트, 간격, 모션
- `src/styles/global.css`: 공통 동작과 기본 레이아웃
- `src/styles/studio.css`: 공통 디자인의 레이아웃, 폰트, 반응형 스타일
- `src/styles/mobile.css`: 모바일 메뉴·터치 영역, 2열 멤버 목록, 문의 화면 배치와 안전 영역 여백
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

`8l4nk`의 점프스케어 사진은 `public/images/surprises/8l4nk/`에 WebP·JPG·JPEG·PNG·AVIF 파일로 넣고 다시 빌드합니다. 요청받은 DM 첨부 사진 6장을 로컬 파일로 연결했습니다. Discord 첨부 URL이나 대화 원문은 사이트에 포함하지 않습니다. 파일이 없으면 클릭 기능을 활성화하지 않습니다. 사진은 페이지 진입 시 미리 불러오고 디코딩합니다. 멤버 페이지의 이름이나 프로필 그림을 클릭하면 인위적인 지연 없이 즉시 나타나며, 0.42초 동안 사진이 빠르게 확대되고 좌우로 짧게 흔들린 뒤 원래 크기로 돌아옵니다. 첫 사진이 도착하기 전에 클릭한 경우에만 이미지 로딩을 기다립니다. 여러 장이면 직전 사진을 제외하고 무작위로 선택하며, 1.6초 후 자동으로 닫히고 클릭·Escape로도 닫을 수 있습니다. 연속 클릭은 중복 예약하지 않고, 탭을 떠나거나 대기 중 Escape를 누르면 취소합니다. 소리는 없으며, 모션 감소 설정에서는 확대·흔들림 효과를 생략합니다. 구현은 `src/components/MemberSurprise.astro`와 `src/scripts/member-surprise.ts`에 있습니다.

점프스케어에서 실제로 본 사진은 **8l4nk 사진 도감**에 수집됩니다. 첫 사진을 수집하기 전에는 도감 버튼이 보이지 않습니다. 한 장 이상 모으면 화면 왼쪽 아래에 `스페셜 퀘스트 · 사진 도감` 플로팅 버튼이 나타나며, 분홍색 키캡과 별 장식·빛이 스치는 효과로 강조합니다. 등장 효과는 점프스케어가 닫힌 뒤 시작해 4.8초 안에 끝나며, 모션 감소 설정에서는 정적인 장식만 표시합니다. 모든 한영 페이지에서 진행률과 도감을 열 수 있습니다. 프로필 카드에는 도감 버튼을 넣지 않습니다. 도감은 파스텔 앨범 표지, 여섯 개의 별 도장, 색색의 사진 카드와 테이프로 붙인 사진 형태로 구성합니다. 미발견 사진은 `?`로 가리고, 모은 사진을 누르면 원본 비율로 크게 볼 수 있습니다. 새 사진·중복 사진을 구분해 표시하고, 중복은 수집 수에 더하지 않으며 6장을 모두 모으면 완성 표시가 나옵니다. 무작위 선택은 그대로이므로 6번 클릭한다고 반드시 완성되지는 않습니다. 수집 기록은 `dda_com-8l4nk-collection-v1` 로컬 저장소 키에 사진 경로로 저장하며, 새로고침·재방문·한영 전환 후에도 유지됩니다. 저장소를 사용할 수 없으면 현재 페이지에서만 수집하고 도감에 안내합니다. 저장된 값은 현재 사진 목록과 대조합니다. 도감은 닫기·Escape·배경 클릭으로 닫고 열었던 버튼으로 초점을 돌려줍니다. 공통 레이아웃에 연결한 `src/components/MemberCollection.astro`가 도감을 표시하며, 수집 동작은 `src/scripts/member-collection.ts`, 스타일은 `src/styles/member-collection.css`입니다.

수집 기능 브라우저 검증은 빌드 후 `npm run preview`를 실행한 상태에서 `node scripts/check-member-collection.mjs`로 실행합니다. Playwright 브라우저 대신 설치된 Chrome을 사용하려면 `BROWSER_PATH=/usr/bin/google-chrome`을 지정합니다. `SITE_URL`로 배포 주소를 지정할 수도 있습니다. 6장 수집·중복·원본 보기·완성·저장 복원·언어 전환·모바일 폭·로딩 취소·저장 차단·모션 감소·초점 복귀를 확인합니다.

점프스케어가 1.6초 후 자동으로 닫힐 때 **20% 확률**로 8l4nk 미연시가 이어집니다. 사진 선택과 별개로 `Math.random() < 0.2`를 한 번 판정합니다. 3번의 선택에 따른 호감도 합계로 3가지 결말을 보여 주는 가상 대화이며, 점프스케어에서 모은 사진 기록은 유지됩니다. 처음부터 얼굴 양쪽 볼에 홍조가 있고 호감도가 오르면 진해집니다. 홍조는 사진 원본 좌표에 맞춘 화면 효과로, 도감 사진 원본은 그대로입니다. 닫기·Escape·탭 이탈로 점프스케어를 취소하면 미연시를 시작하지 않습니다. 미연시 자체도 닫기·Escape·배경 클릭으로 종료하며, 다시 만났을 때는 첫 대화부터 시작합니다. 한영 대사는 `src/data/member-romance.ts`, 화면은 `src/components/MemberRomance.astro`와 `src/styles/member-romance.css`, 진행은 `src/scripts/member-romance.ts`입니다. 브라우저 검증은 `BROWSER_PATH=/usr/bin/google-chrome node scripts/check-member-romance.mjs`로 실행합니다.

`sane100400`의 사진 영역이나 이름을 누르면 펭귄 도감이 열립니다. 한국어·영어로 대표 6종의 실제 사진, 학명, 목·과·속 분류, 분포, 성체 체중, 형태적 식별 형질과 번식 생태를 보여 줍니다. 마지막 ‘아기황제펭귄들’ 페이지는 남극 현장에서 촬영한 새끼 무리 사진 3장으로 구성하며 상단 버튼으로 바로 열 수 있습니다. 모든 사진에 촬영자·원본·라이선스를 표기하고, 설명에는 호주 남극 프로그램의 자료 링크와 확인일을 붙였습니다. 창 크기와 상하단 조작부는 페이지를 넘겨도 유지하며, 긴 본문만 내부에서 스크롤됩니다. 종 선택·이전/다음·좌우 방향키로 페이지를 넘기고, 닫기·Escape·배경 클릭으로 닫으면 눌렀던 프로필로 초점이 돌아갑니다. `/members/#penguin-guide`와 `/en/members/#penguin-guide`로 직접 열 수 있으며 JavaScript가 없어도 같은 링크에서 전체 도감을 읽을 수 있습니다. 내용은 `src/data/penguins.ts`, 사진 메타데이터는 `src/data/penguin-photos.json`, 동작과 스타일은 `src/scripts/penguin-guide.ts`와 `src/styles/penguin-guide.css`에서 수정합니다. 사진 이용 조건은 `docs/penguin-photos.md`에 기록합니다.

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
| 2026-09-05–06 | TFC CTF 2026 | 10위 · seojin fan club | [CTFtime 주최 측 등록 일정·점수표](https://ctftime.org/event/3344/). UTC 시작일은 9월 5일이며 Jeopardy 방식입니다. 팀 참가 관계는 사용자 제공 정보에 근거합니다. |
| 2026-09-28 | SCAN 2026 Final | 본선 2위 · hello | [공식 일정·수상 결과](https://scan.sx/), [CTFtime 일정·방식](https://ctftime.org/event/3417/), [디지털애셋 수상 결과](https://www.digitalasset.works/news/articleView.html?idxno=43330) |

따따와 개별 팀원의 참가 관계는 사용자 제공 정보에 근거합니다. 공개 점수표·보도로 확인한 순위와 팀 제공 순위는 표에서 구분합니다. DEF CON은 Jinddabi’s 연합팀 참가로 명시합니다. 핵테온의 7월 10일은 시상식 날짜로, 본선 시작일인 7월 9일과 구분했습니다. SCAN은 hello 팀의 본선 준우승으로 표시하며 10월 1일 시상식과 9월 28일 본선을 구분했습니다. CTFtime에 점수표가 없는 본선은 공식 수상 안내나 결과 보도를 연결하며, 연합팀 기록이나 추가 본선 성적을 따따의 CTFtime 연간 점수에 합산하지 않습니다.

기존 `Azure Assassin Alliance CTF 2026` 기록이 ACTF입니다. 중복 대회를 만들지 않고 “ACTF 우승 · 제10회 XCTF 본선 시드 획득” 설명을 추가했습니다. [주최 측 대회 아카이브](https://github.com/team-s2/ACTF-2026)에 따따의 우승과 우승팀의 본선 초청 자격이 함께 명시돼 있습니다.

본선 진출이 확인된 예선은 `qualifiedForFinals: true`로 표시하며, 상단 블록 설명과 하단 타임라인에 `본선 진출` / `Qualified for finals`를 함께 보여 줍니다. 현재 대상은 DiceCTF, CODEGATE, DEF CON, SAS CTF, Black Hat MEA 예선 5건입니다. DiceCTF·CODEGATE·DEF CON은 위 본선 참가 기록과 대조했습니다. SAS는 [주최 측이 등록한 상위 8팀 선발 기준과 따따의 예선 5위](https://ctftime.org/event/3109/)로, Black Hat MEA는 [공식 예선→본선 안내](https://blackhatmea.com/competition/capture-the-flag)와 팀 제공 예선 1위로 판단했습니다. Midnight Sun은 [공식 상위 10팀 선발 기준](https://play.midnightsunctf.com/rules)에 비해 예선 11위이고 추가 초청이 확인되지 않아 진출 표시를 넣지 않았습니다. ACTF의 XCTF 본선 시드 설명은 그대로 유지합니다.

하단 타임라인 이름은 대회명의 연도를 생략하고 예선/본선을 구분해 표시합니다. `timelineName`과 `timelineNote`로 짧은 대회명·부문·보충 설명을 지정할 수 있으며, 순위는 기존 `placement`를 그대로 사용합니다.

블록 아래에는 사진을 여는 갤러리 아이콘과 대회·결과 페이지로 이동하는 외부 링크 아이콘을 구분해 표시합니다. 장수 안내 문구는 표시하지 않습니다. 사진이 있는 블록 자체를 눌러도 해당 사진부터 뷰어를 엽니다. 아이콘에는 한영 접근성 이름과 툴팁을 제공합니다. 좌우 버튼·방향키, 사진의 마우스 드래그·모바일 스와이프로 현재 필터에 표시된 다른 대회 사진까지 순서대로 넘깁니다. 한 대회에 여러 장이 있으면 모두 보여 준 다음 대회로 이동하고, 마지막 사진 다음에는 처음으로 돌아옵니다. 이동할 때 대회명·날짜·순위·출처·전체 크기 링크를 함께 갱신합니다. 세로 스크롤과 두 손가락 확대는 그대로 사용할 수 있으며 짧은 움직임에는 사진을 넘기지 않습니다. 닫기·Escape·배경 클릭으로 닫으면 처음 눌렀던 블록으로 초점이 돌아갑니다. 사진은 선택할 때만 불러오며, JavaScript가 없어도 이미지와 결과 안내 링크를 사용할 수 있습니다.

2026-10-15 팀이 제공한 사진자료에서 스코어보드·개인 순위 캡처 **15장**을 선별해 **14개 성과 블록**에 연결했습니다. ENKI는 요청한 8l4nk 2위와 nobody09 4위의 개별 순위 화면을 각각 사용합니다. 사람 얼굴이 있는 사진은 아래 SCAN 수상 사진 외에는 포함하지 않습니다. 파일은 `public/images/scoreboards/2026/`에 보관하며 Discord의 만료되는 첨부 주소나 대화 원문을 배포하지 않습니다. 이미지 메타데이터·한영 설명은 `src/data/achievement-images.ts`, 성과 연결은 `src/data/team.ts`의 `photos`입니다. 화면 캡처는 원래 해상도의 무손실 WebP로, 모니터를 촬영한 핵테온 초급부·DEF CON 사진은 같은 해상도의 WebP로 압축했습니다.

| 스코어보드 파일 | 연결한 성과 |
| --- | --- |
| `hctf.webp` | HCTF 2위 · 손이시립대 |
| `bitsctf.webp` | BITSCTF 1위 |
| `dice-quals.webp` | DiceCTF 예선 5위 |
| `suctf.webp` | SUCTF 2위 |
| `enki-8l4nk.webp`, `enki-nobody09.webp` | ENKI 8l4nk 2위·nobody09 4위의 서로 다른 개인 순위 캡처 |
| `codegate-quals.webp` | CODEGATE 예선. 캡처에는 13위가 보여 설명에 명시하고, 기존 확인 기록 12위는 유지 |
| `actf.webp` | Azure Assassin Alliance CTF 1위 |
| `sas-quals.webp` | SAS CTF 예선 5위 |
| `sctf-ranking.webp`, `sctf-dashboard.webp` | SCTF 1위, 순위표·전체 대시보드 2장 |
| `hacktheon-advanced.webp` | HackTheon 고급부 1위 |
| `hacktheon-beginner.webp` | HackTheon 초급부 2위 · SHA-4 |
| `codegate-finals.webp` | CODEGATE 본선 2위 |
| `defcon-finals.webp` | DEF CON 34 본선 7위 · Jinddabi’s, 화면 표기 JIND |

SCAN은 사용자 요청에 따라 예외로 스코어보드 대신 **hello 팀의 2위 수상 사진 1장**을 사용합니다. [디지털애셋의 2026-10-01 시상식 보도](https://www.digitalasset.works/news/articleView.html?idxno=43330)에 실린 박재연 기자의 [원본 사진](https://cdn.digitalasset.works/news/photo/202610/43330_45089_5347.png)을 크롭하지 않고 600×450 무손실 WebP로 저장했습니다 (`public/images/achievements/2026/scan-award.webp`). 뷰어에 사진 출처·기사 링크와 시상식 날짜를 표시하며, 본선 날짜 9월 28일은 유지합니다. 전체 이미지 수는 **16장**, 사진을 여는 성과 블록은 **15개**입니다.

SUCTF와 CODEGATE 예선·본선은 `AchievementImage.focus`의 원본 픽셀 좌표에 따라 우리 팀 주변 순위만 확대해 보여 줍니다. 원본 이미지 파일은 변경하지 않으며 전체 크기 링크에서 전체 표를 확인할 수 있습니다. 확대 영역도 드래그·스와이프로 다음 사진을 넘길 수 있습니다.

`rank: null`은 순위가 확인되지 않은 본선 진출 기록입니다. 해당 블록은 `본선`/`FINAL`로 표시하며 `입상` 필터와 순위 그래프에서는 제외합니다. ENKI는 개인전 기록을 팀원별로 분리하고, HackTheon은 고급·초급부문을 구분합니다.

방문 시 외부 API를 호출하지 않습니다. 새로운 성과는 `src/data/team.ts`의 `achievements`에 추가하고 다시 빌드하세요. 연간 순위를 다시 조회했을 때만 `rating`과 그 안의 `checkedAt`을 함께 갱신합니다. `입상` 필터는 1–3위를 표시합니다. 멤버는 요청에 따라 `8l4nk`(팀장), `sane100400`, `Axii`, `nobody09`, `Dbi`, `love09010224`, `snowball`, `Hyeongeun Ji` 총 8명을 등록했습니다. 확인 전인 다른 닉네임이나 분야·소개는 추가하지 않았습니다.

## 디자인과 에셋

- 메인 색상: Rose Quartz `#F7CAC9`, Serenity `#92A8D1`를 기반으로 한 OKLCH 토큰
- 영문 워드마크·제목: [Fraunces](https://github.com/undercasetype/Fraunces) ExtraBold. Recoleta와 비슷한 무료 폰트를 사용해 달라는 요청에 따라 둥근 세리프인 Fraunces의 SOFT 100, optical size 72 스타일을 적용했습니다. 헤더와 메인 워드마크에 동일하게 사용합니다.
- 제목: [페이퍼로지](https://freesentation.blog/paperlogyfont) Bold / ExtraBold
- 본문·메뉴: [원티드 산스](https://github.com/wanteddev/wanted-sans) Variable
- 폰트는 로컬 WOFF2로 제공하며 SIL Open Font License를 `public/fonts/`에 동봉했습니다.
- 공식 원본 `theme.png`는 보존했습니다. 첫 화면은 원본의 캐릭터·D·키보드·깃발을 바탕으로 제작한 배경 없는 입체 일러스트 `public/images/team-object-v2.webp`를 사용합니다. 기존 공식 이미지는 소셜 미리보기용으로 유지합니다. 제작 기록: [docs/image-assets.md](docs/image-assets.md).
- 등장 애니메이션, 페이지 전환, 링크·메뉴 인터랙션과 `prefers-reduced-motion`을 지원합니다.
- 멤버 페이지는 정사각형 대표사진에 윗면·옆면을 붙인 장난감 블록 형태입니다. 8명을 데스크톱에서는 4명씩 2줄로 배치합니다. 태블릿과 모바일은 2열로 배치합니다. 모바일에서는 행 사이의 큰 단차를 없애고 이름과 연락처를 좁은 폭에 맞춰 줄바꿈합니다. 모든 화면에서 사진 자체는 1:1이며 각 멤버 블록의 크기는 같습니다. 포인터에 따라 블록이 가볍게 기울며 모션 줄이기 설정과 터치 환경에서는 공간 이동 효과를 끕니다.
- 멤버 블록은 등록 순서대로 세레니티 블루, 로즈 핑크, 라일락, 민트, 버터 옐로, 피치, 틸의 7색을 반복해 사용합니다. 무지개 순서로 나열하지 않으며, 각 블록의 옆면과 글자 그림자도 해당 색상에 맞춥니다.
- 첫 화면은 팀 소개와 프레임 없는 캐릭터 이미지, 작은 CTF 인터랙션으로 구성됩니다. 깃발·키보드·자물쇠를 누르면 분석 문제를 엽니다. 같은 장난감 재질의 오브젝트를 유지하며, 투명 글씨 플래그는 별도 단서 문구 없이 숨겨두었습니다. 마우스 드래그, 모바일의 텍스트 선택, 키보드 초점으로 발견할 수 있고, 한 번 발견하면 글씨와 복사 버튼이 계속 표시됩니다. JavaScript가 없어도 선택 영역에서는 글씨가 보입니다. 성과·멤버는 링크로 연결합니다.
- [TeamH4C](https://h4c.team/)의 연도별 성과와 역할 중심 멤버 구성, [idek](https://idek.team/)와 [Perfect Blue](https://perfect.blue/)의 CTF 팀 콘텐츠 구성을 참고했습니다. 세부 방향은 [design.md](design.md)에 기록했습니다.
- 임의의 슬로건, 팀 철학, FAQ와 장식용 설명은 사용하지 않습니다. 영문 소제목과 중복된 작은 안내 문구도 제거했습니다.
- 메인만 하나의 로즈쿼츠·세레니티 배경을 사용합니다. 성과·멤버·문의는 크림색 단색 배경입니다. 헤더·본문·푸터에 별도의 색 면을 덧씌우지 않으며, 내비게이션 버튼은 키캡처럼 눌립니다. 입상 순위는 월계관 없이 금·은·동 색상과 숫자로 구분합니다.
- 성과 페이지 상단은 구름 벽지와 나무 바닥이 있는 기존 장난감 방입니다. 순위 블록·달력은 가로 스크롤, 이전·다음 버튼, 드래그·터치, 방향키·Home·End로 이동하며 선택한 블록이 앞에 보입니다. 하단 날짜 목록만 화면 폭에 따라 5·4·3·2열로 줄바꿈하고, 각 줄이 좌우로 번갈아 진행하며 곡선으로 이어집니다. 날짜 목록에는 가로 스크롤이 없고 연도·MM.DD·대회명·예선/본선·순위를 표시합니다. 핵테온은 고급·초급부문을, ENKI는 참가자 닉네임을, ACTF는 XCTF 본선 시드를 함께 표시합니다. 날짜를 선택하면 위쪽 블록과 선택 표시가 동기화되며, 필터·화면 크기·글꼴 변화 시 날짜 배치와 연결선을 갱신합니다. JavaScript 없이도 모든 블록과 날짜 앵커를 사용할 수 있고 날짜는 일반 격자로 줄바꿈합니다. 모션 줄이기 설정에서는 즉시 이동합니다.
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
