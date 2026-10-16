import type { Locale } from './i18n';

type Localized = Record<Locale, string>;
export type PenguinId = 'emperor' | 'king' | 'adelie' | 'chinstrap' | 'gentoo' | 'macaroni';
interface Penguin {
  id: PenguinId;
  name: Localized;
  scientificName: string;
  habitat: Localized;
  feature: Localized;
  note: Localized;
  mass: Localized;
}

// Species notes checked against the Australian Antarctic Program on 2026-10-16.
// Keep the guide to stable natural-history facts; weight varies with sex and breeding stage.
export const penguinSource = (id: PenguinId) => `https://www.antarctica.gov.au/about-antarctica/animals/penguins/${id}-penguin/`;
export const penguins: Penguin[] = [
  {
    id: 'emperor',
    mass: { ko: '최대 40 kg · 번식기 시작 시', en: 'Up to 40 kg at the start of breeding' },
    name: { ko: '황제펭귄', en: 'Emperor penguin' },
    scientificName: 'Aptenodytes forsteri',
    habitat: { ko: '남극 대륙 주변의 바다 얼음', en: 'Sea ice around Antarctica' },
    feature: { ko: '현생 펭귄 중 가장 대형인 종. 성체는 검은 머리와 등, 흰 배를 지닌다.', en: 'The largest extant penguin species, with a black head and back and a white abdomen.' },
    note: { ko: '남극의 겨울에 번식하며 수컷이 포란을 담당한다. 번식 집단은 해안에 고정된 해빙에 주로 형성된다. 밀집 행동(huddling)으로 열 손실을 줄인다.', en: 'Breeds during the Antarctic winter, with males incubating the eggs. Colonies occur mainly on coastal fast ice. Huddling reduces heat loss.' },
  },
  {
    id: 'king',
    mass: { ko: '10–15 kg · 구애기', en: '10–15 kg during courtship' },
    name: { ko: '임금펭귄', en: 'King penguin' },
    scientificName: 'Aptenodytes patagonicus',
    habitat: { ko: '남극 주변의 아남극 섬들', en: 'Sub-Antarctic islands' },
    feature: { ko: '귀 부위의 선명한 주황색 반점이 가는 띠로 상부 가슴과 연결된다. 황제펭귄보다 체형이 가늘다.', en: 'Bright orange ear patches connect to the upper chest through a narrow band. More slender than the emperor penguin.' },
    note: { ko: '둥지를 만들지 않고 발 위에서 알을 품는다. 번식 주기는 약 13–16개월로 길다. 현생 펭귄 중 황제펭귄 다음으로 크다.', en: 'Incubates an egg on its feet without building a nest. The breeding cycle lasts approximately 13–16 months. Second in size to the emperor penguin.' },
  },
  {
    id: 'adelie',
    mass: { ko: '3–6 kg', en: '3–6 kg' },
    name: { ko: '아델리펭귄', en: 'Adélie penguin' },
    scientificName: 'Pygoscelis adeliae',
    habitat: { ko: '남극 대륙의 해안과 주변 섬', en: 'Antarctic coasts and nearby islands' },
    feature: { ko: '검은 머리와 눈을 둘러싼 뚜렷한 흰 고리가 주요 식별 형질이다.', en: 'A black head and a conspicuous white ring around the eye are key identification features.' },
    note: { ko: '해안의 노출된 암반에 자갈 둥지를 만든다. 남극의 봄·여름에 번식하며, 부모가 포란과 먹이 공급을 교대한다. 겨울에는 주로 유빙 해역에서 생활한다.', en: 'Builds pebble nests on exposed coastal ground. Parents alternate incubation and feeding during the Antarctic spring and summer; winter is spent mainly at sea in pack ice.' },
  },
  {
    id: 'chinstrap',
    mass: { ko: '3.5–5.5 kg', en: '3.5–5.5 kg' },
    name: { ko: '턱끈펭귄', en: 'Chinstrap penguin' },
    scientificName: 'Pygoscelis antarctica',
    habitat: { ko: '남극반도와 남대서양의 섬들', en: 'Antarctic Peninsula and South Atlantic islands' },
    feature: { ko: '흰 볼 아래로 이어지는 가느다란 검은 띠가 특징이다. 긴 검은 꼬리와 적갈색 홍채를 지닌다.', en: 'A narrow black band runs beneath the white cheeks. The tail is long and black, and the irises are reddish-brown.' },
    note: { ko: '늦은 11월에 보통 알 두 개를 낳는다. 암수가 약 33–36일의 포란을 분담하며 새끼는 약 7–8주에 이소한다. 겨울에는 유빙대 북쪽으로 이동한다.', en: 'Usually lays two eggs in late November. Both parents share the 33–36-day incubation period; chicks fledge at about 7–8 weeks. Moves north of the pack ice in winter.' },
  },
  {
    id: 'gentoo',
    mass: { ko: '5–8 kg', en: '5–8 kg' },
    name: { ko: '젠투펭귄', en: 'Gentoo penguin' },
    scientificName: 'Pygoscelis papua',
    habitat: { ko: '아남극의 섬들과 남극반도', en: 'Sub-Antarctic islands and the Antarctic Peninsula' },
    feature: { ko: '선명한 적주황색 부리와 눈 위의 넓은 흰 반점으로 식별한다.', en: 'Identified by a bright orange-red bill and conspicuous white patches above the eyes.' },
    note: { ko: '해변이나 풀 무더기 사이에 둥지를 짓는다. 보통 알 두 개를 낳고 약 34–37일간 품는다. 새끼는 약 26일령부터 유조 집단(crèche)을 형성한다.', en: 'Nests on beaches or among tussocks. Usually lays two eggs, incubated for approximately 34–37 days. Chicks begin forming crèches at around 26 days of age.' },
  },
  {
    id: 'macaroni',
    mass: { ko: '4–7 kg', en: '4–7 kg' },
    name: { ko: '마카로니펭귄', en: 'Macaroni penguin' },
    scientificName: 'Eudyptes chrysolophus',
    habitat: { ko: '남극을 둘러싼 아남극 섬들', en: 'Sub-Antarctic islands around the Southern Ocean' },
    feature: { ko: '머리 위의 황금빛 장식깃이 주요 식별 형질이다. 성체의 몸길이는 약 70 cm이다.', en: 'A golden crest is the main identification feature. Adults stand approximately 70 cm tall.' },
    note: { ko: '매년 번식하며 집단 내 번식 시기가 동기화되는 경향이 있다. 두 번째 알이 첫 번째보다 크고, 보통 두 번째 알에서만 새끼가 부화한다. 이소까지 약 60–70일이 걸린다.', en: 'Breeds annually, with timing synchronized within colonies. The second egg is larger than the first and is typically the only one to hatch. Chicks fledge after approximately 60–70 days.' },
  },
];
