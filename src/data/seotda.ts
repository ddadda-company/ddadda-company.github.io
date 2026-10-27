import type { Localized } from './team';
export const words = (ko: string, en: string): Localized => ({ ko, en });
export const memeSource = 'https://cine21.com/movie/info/?movie_id=14535';
export const seotdaMemes = {
  welcome: { title: words('마지막 승부의 테이블', 'The final showdown'), alt: words('화투판을 사이에 두고 마주한 고니와 아귀, 곁에서 지켜보는 정마담', 'Goni and Agwi face each other at the card table as Madam Jeong watches') },
  stop: { title: words('멈춰 선 손', 'A hand stopped'), alt: words('마지막 대결에서 고니의 손목을 붙잡은 아귀', 'Agwi holds Goni’s wrist during their final showdown') },
  goni: { title: words('고니의 승부수', 'Goni’s next move'), alt: words('화투판 너머를 손으로 가리키는 고니', 'Goni points across the card table') },
  yerim: { title: words('패를 두고 맞선 두 사람', 'Across the final table'), alt: words('아귀의 손 너머로 상대를 응시하는 고니', 'Goni looks at his opponent across Agwi’s outstretched hand') },
  sakura: { title: words('여유를 잃지 않는 고니', 'Goni keeps his composure'), alt: words('아귀에게 손목을 잡힌 채 미소 짓는 고니', 'Goni smiles while Agwi holds his wrist') },
  table: { title: words('초록 천 위의 화투', 'Hwatu on green felt'), alt: words('초록 화투판에 놓인 붉은 화투 패와 판돈 칩', 'Red hwatu cards and betting chips on green felt') },
  mentor: { title: words('평경장의 여유', 'Pyeong’s composure'), alt: words('모자를 쓰고 찻잔 앞에 앉아 있는 평경장', 'Pyeong sits at a table wearing a hat, with a teacup in front of him') },
} as const;
export type MemeId = keyof typeof seotdaMemes;
export const flowers = [words('솔', 'Pine'), words('매화', 'Plum'), words('벚꽃', 'Cherry'), words('등나무', 'Wisteria'), words('난초', 'Iris'), words('모란', 'Peony'), words('싸리', 'Clover'), words('공산', 'Pampas'), words('국화', 'Chrysanthemum'), words('단풍', 'Maple')];
export const ruleRows = [
  [words('삼팔광땡', '3–8 bright'), words('3광 + 8광 · 가장 높은 패', '3 bright + 8 bright · Highest hand')],
  [words('일삼·일팔광땡', '1–3 / 1–8 bright'), words('1광 + 3광 또는 8광 · 서로 동급', '1 bright + 3 or 8 bright · Equal rank')],
  [words('장땡 ~ 삥땡', 'Pairs: 10 down to 1'), words('같은 월 두 장 · 숫자가 클수록 높아요', 'Two cards of the same month · Higher is better')],
  [words('알리 > 독사 > 구삥', 'Alli > Doksa > Gubbing'), words('1·2 > 1·4 > 1·9', '1·2 > 1·4 > 1·9')],
  [words('장삥 > 장사 > 세륙', 'Jangbbing > Jangsa > Seryuk'), words('1·10 > 4·10 > 4·6', '1·10 > 4·10 > 4·6')],
  [words('갑오 > 8끗 ~ 망통', '9 points > 8 down to 0'), words('두 월의 합에서 일의 자리만 비교해요', 'Compare the last digit of the two months’ sum')],
  [words('암행어사', 'Royal inspector'), words('4열·7열 · 일삼·일팔광땡만 잡아요', '4 animal + 7 animal · Beats 1–3 / 1–8 bright only')],
  [words('땡잡이', 'Pair catcher'), words('3광·7열 · 1~9땡만 잡아요', '3 bright + 7 animal · Beats pairs 1 through 9 only')],
  [words('구사 / 멍텅구리 구사', 'Gusa / special Gusa'), words('4·9는 알리 이하, 4열·9열은 9땡 이하와 재경기', '4·9 replays up to Alli; 4 animal + 9 animal replays up to pair 9')],
];
