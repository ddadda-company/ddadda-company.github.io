import type { Localized } from './team';
export const words = (ko: string, en: string): Localized => ({ ko, en });
export const memeSource = 'https://www.1004work.co.kr/2025/05/korean-movie-tazza-meme-collection.html';
export const seotdaMemes = {
  welcome: { title: words('판에 앉는 순간', 'Take your seat'), alt: words('영화 타짜에서 고니를 맞이하는 아귀', 'Agwi greets Goni in Tazza') },
  stop: { title: words('동작 그만', 'Hold it'), alt: words('밑장빼기를 의심하는 아귀의 타짜 밈', 'Agwi suspects a bottom deal in a Tazza meme') },
  goni: { title: words('고니의 승부수', 'Goni calls the bluff'), alt: words('마지막 대결에서 아귀와 마주 앉은 고니와 정마담', 'Goni and Madam Jeong face Agwi in the final showdown') },
  yerim: { title: words('그 패를 확인할 시간', 'Time to check that card'), alt: words('정마담의 패를 가리키는 타짜 속 호구', 'Hogu points toward Madam Jeong’s card in Tazza') },
  sakura: { title: words('사쿠라 반전', 'The cherry blossom twist'), alt: words('사쿠라 패에 놀란 아귀의 타짜 밈', 'Agwi reacts to the cherry blossom card in a Tazza meme') },
  double: { title: words('묻고 더블로 가!', 'Double it!'), alt: words('베팅을 올리는 곽철용의 타짜 밈', 'Kwak Cheol-yong raises the stakes in a Tazza meme') },
  laugh: { title: words('아귀의 웃음', 'Agwi’s laugh'), alt: words('판에서 웃고 있는 아귀의 타짜 밈', 'Agwi laughs at the table in a Tazza meme') },
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
