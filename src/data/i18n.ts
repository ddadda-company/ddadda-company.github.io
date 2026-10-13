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
      home: '따따 (dda_com) | 한국 기반 CTF 팀', achievements: '대회 성과 | dda_com',
      members: '팀 멤버 | dda_com', contact: '문의 | dda_com',
      description: {
        home: '국내외 CTF 대회에 참가하는 한국 기반 팀, 따따(dda_com)의 공식 웹사이트입니다.',
        achievements: '따따(dda_com)가 참가한 CTF 대회의 날짜와 순위, 공식 결과를 모았습니다.',
        members: '한국 기반 CTF 팀 따따(dda_com)의 멤버들을 소개합니다.',
        contact: 'CTF 대회 초청과 협업, 팀 관련 문의를 위한 따따(dda_com)의 연락처 안내입니다.',
      },
    },
    skip: '본문으로 건너뛰기', menu: '메뉴', close: '닫기', navigation: '주요 메뉴',
    language: '언어 선택', top: '맨 위로',
    imageAlt: '따따 dda_com CTF 팀 공식 이미지',
    home: {
      greeting: '한국 기반 CTF 팀',
      lead: '',
      recordsLink: '대회 성과',
    },
    achievements: {
      title: '대회 성과', intro: 'CTFtime에 등록된 따따의 대회 기록입니다.',
      archive: '전체 기록', all: '전체 연도', count: '개의 기록',
      date: '일자', event: '대회', format: '방식', result: '순위', link: '공식 결과',
      noMatch: '선택한 조건에 해당하는 기록이 없습니다.',
      note: '출처: CTFtime. 날짜는 UTC 기준 대회 시작일입니다.',
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
      home: 'dda_com | CTF Team from South Korea', achievements: 'Competition Results | dda_com',
      members: 'Team Members | dda_com', contact: 'Contact | dda_com',
      description: {
        home: 'The official website of dda_com, a CTF team based in South Korea competing in CTFs worldwide.',
        achievements: 'Explore dda_com’s CTF competition history, with dates, placements, and links to official results.',
        members: 'Meet the members of dda_com, a CTF team based in South Korea.',
        contact: 'Get in touch with dda_com about CTF invitations, collaborations, and team enquiries.',
      },
    },
    skip: 'Skip to content', menu: 'Menu', close: 'Close', navigation: 'Main navigation',
    language: 'Select language', top: 'Back to top',
    imageAlt: 'Official dda_com CTF team illustration',
    home: {
      greeting: 'A CTF team based in South Korea',
      lead: '',
      recordsLink: 'Our results',
    },
    achievements: {
      title: 'Achievements', intro: 'dda_com’s competition results, as recorded on CTFtime.',
      archive: 'Competition archive', all: 'All years', count: 'records',
      date: 'Date', event: 'Competition', format: 'Format', result: 'Place', link: 'Official results',
      noMatch: 'No results match the selected filters.',
      note: 'Source: CTFtime. Dates indicate the start of each event in UTC.',
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
