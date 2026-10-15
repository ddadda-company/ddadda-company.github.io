export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];
export const pages = ['home', 'achievements', 'members', 'contact'] as const;
export type Page = (typeof pages)[number];

export function pageUrl(locale: Locale, page: Page) {
  return `${locale === 'en' ? '/en/' : '/'}${page === 'home' ? '' : `${page}/`}`;
}

export const copy = {
  ko: {
    nav: { home: '팀 소개', achievements: '성과', members: '멤버', contact: '문의' },
    meta: {
      home: '따따 (dda_com) | 한국 기반 CTF 팀', achievements: 'CTF 대회 성과·수상 기록 | 따따 (dda_com)',
      members: 'CTF 팀 멤버 | 따따 (dda_com)', contact: '대회 초청·협업 문의 | 따따 (dda_com)',
      description: {
        home: '따따(dda_com)는 국내외 CTF(Capture The Flag) 대회에 참가하는 한국 기반 보안 팀입니다. 공식 사이트에서 대회 성과와 수상 기록, 팀 멤버, 초청·협업 연락처를 확인하세요.',
        achievements: '따따(dda_com)의 CODEGATE, DEF CON 등 CTF 대회 성과와 연합팀 참가 기록입니다. 대회별 날짜, 순위, 스코어보드와 결과 출처를 확인하세요.',
        members: '한국 기반 CTF 팀 따따(dda_com)의 멤버들을 소개합니다.',
        contact: 'CTF 대회 초청과 협업, 팀 관련 문의를 위한 따따(dda_com)의 연락처 안내입니다.',
      },
    },
    skip: '본문으로 건너뛰기', menu: '메뉴', close: '닫기', navigation: '주요 메뉴',
    language: '언어 선택', top: '맨 위로',
    imageAlt: '따따 dda_com CTF 팀 공식 이미지',
    home: {
      greeting: 'a.k.a 이성민남친구함',
      lead: '따따(dda_com)는 국내외 CTF(Capture The Flag) 대회에 참가하는 한국 기반 보안 팀입니다.',
      recordsLink: '대회 성과',
    },
    achievements: {
      title: '대회 성과', intro: '따따의 CTF 대회 성과와 연합팀 참가 기록입니다.',
      archive: '전체 기록', all: '전체 연도', count: '개의 기록',
      qualifiedForFinals: '본선 진출',
      date: '일자', event: '대회', format: '방식', result: '순위', link: '대회·결과 안내',
      noMatch: '선택한 조건에 해당하는 기록이 없습니다.',
      note: '팀 제공 기록에 CTFtime, 대회 공식 안내와 결과 보도를 함께 반영했습니다. 각 대회에서 관련 자료를 확인할 수 있습니다. 날짜는 UTC 기준 대회 시작일입니다.',
      sourceNote: 'HCTF, HackTheon 초급부, Black Hat MEA 예선의 순위는 팀 제공 기록이며, 대회 링크는 공식 일정·안내입니다. 연합팀 참가 관계도 팀 제공 정보에 근거합니다.',
      nextLink: '멤버 소개',
    },
    members: {
      title: '멤버', roster: '팀 멤버', all: '전체', profile: '프로필 보기',
      noMatch: '이 분야로 등록된 멤버가 없습니다.', contactLink: '팀 문의',
    },
    contact: {
      title: ['문의'], intro: '대회 초청, 협업 및 팀 관련 문의.',
      channel: '이메일', unavailable: '공식 이메일은 추후 공개됩니다.',
      write: '메일 쓰기', copy: '주소 복사', copied: '복사했습니다', copyError: '주소를 직접 선택해 복사해 주세요.',
      topics: '문의 분야',
      topicList: [
        ['대회 및 행사', 'CTF 대회 초청 · 행사 참여'],
        ['협업', '보안 연구 · 기술 교류'],
        ['일반 문의', '팀 관련 질문 및 제안'],
      ],
      elsewhere: '외부 프로필',
    },
  },
  en: {
    nav: { home: 'About', achievements: 'Achievements', members: 'Members', contact: 'Contact' },
    meta: {
      home: 'dda_com (따따) | CTF Team from South Korea', achievements: 'CTF Competition Results & Awards | dda_com',
      members: 'CTF Team Members | dda_com', contact: 'CTF Invitations & Collaboration | dda_com',
      description: {
        home: 'dda_com (따따) is a South Korean Capture The Flag (CTF) team. Explore competition results, meet the members, and contact the team for invitations and collaboration.',
        achievements: 'Explore dda_com’s CTF results, including CODEGATE and DEF CON, with competition dates, placements, scoreboards, sources, and coalition participation clearly identified.',
        members: 'Meet the members of dda_com, a CTF team based in South Korea.',
        contact: 'Get in touch with dda_com about CTF invitations, collaborations, and team enquiries.',
      },
    },
    skip: 'Skip to content', menu: 'Menu', close: 'Close', navigation: 'Main navigation',
    language: 'Select language', top: 'Back to top',
    imageAlt: 'Official dda_com CTF team illustration',
    home: {
      greeting: 'a.k.a 이성민남친구함',
      lead: 'dda_com (따따) is a security team based in South Korea, competing in Capture The Flag (CTF) competitions worldwide.',
      recordsLink: 'Our results',
    },
    achievements: {
      title: 'Achievements', intro: 'dda_com’s CTF results and coalition participation.',
      archive: 'Competition archive', all: 'All years', count: 'records',
      qualifiedForFinals: 'Qualified for finals',
      date: 'Date', event: 'Competition', format: 'Format', result: 'Place', link: 'Event and result information',
      noMatch: 'No results match the selected filters.',
      note: 'Team-provided records are supplemented by CTFtime, official event information, and result reports. Each competition links to supporting information. Dates indicate the start of each event in UTC.',
      sourceNote: 'Placements for HCTF, HackTheon’s beginner division, and the Black Hat MEA qualifier are team-provided; their event links document official schedules and event details. Coalition participation is also based on team-provided information.',
      nextLink: 'Team members',
    },
    members: {
      title: 'Members', roster: 'The team', all: 'Everyone', profile: 'View profile',
      noMatch: 'No members are listed in this field yet.', contactLink: 'Contact the team',
    },
    contact: {
      title: ['Contact'], intro: 'Competition invitations, collaborations, and team enquiries.',
      channel: 'Email', unavailable: 'Our official email will be announced here.',
      write: 'Write an email', copy: 'Copy address', copied: 'Copied', copyError: 'Please select and copy the address manually.',
      topics: 'Enquiries',
      topicList: [
        ['Competitions & events', 'CTF invitations · Event participation'],
        ['Collaboration', 'Security research · Technical exchange'],
        ['General enquiries', 'Questions and proposals for the team'],
      ],
      elsewhere: 'Team profiles',
    },
  },
};
