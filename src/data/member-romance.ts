import type { Localized } from './team';

export const l = (ko: string, en: string): Localized => ({ ko, en });
export type ActionId = 'talk' | 'listen' | 'walk' | 'solve' | 'gift' | 'rest';
export type MemoryId = 'honest' | 'sweet' | 'walk' | 'team';
export type EndingId = 'love' | 'slow' | 'partner' | 'friend' | 'distance';
export type Stats = { affection: number; trust: number; tension: number };
export interface RomanceChoice {
  id: string; label: Localized; reply: Localized; effect: Stats;
  memory?: MemoryId; trustRequired?: number;
}
export interface RomanceAction {
  id: ActionId; title: Localized; hint: Localized; lines: Localized[]; choices: RomanceChoice[];
  trustRequired?: number;
}
const effect = (affection: number, trust: number, tension: number): Stats => ({ affection, trust, tension });

// Fictional characters and events for the optional profile game.
export const romanceDays = [
  { title: l('조금 어색한 첫 만남', 'A slightly awkward first meeting'), mood: l('긴장한 상태', 'Nervous'), hint: l('아직 서로 알아가는 중. 성급한 장난보다 솔직한 말과 경청이 좋아요.', 'You are still getting to know each other. Honesty and listening work better than teasing.'), line: l('또 눌렀네. 오늘은 사진만 보고 갈 거야, 아니면 나랑 조금 있다 갈래?', 'You clicked again. Just here for the photos, or will you stay with me a little?') },
  { title: l('피곤한 오후', 'A tired afternoon'), mood: l('조금 지쳤어요', 'A little tired'), hint: l('무리한 문제 풀이는 긴장을 높여요. 쉬거나, 좋아한다고 했던 걸 떠올려 보세요.', 'Hard challenges add tension today. Rest, or remember what he told you he likes.'), line: l('어제 늦게까지 깨어 있었어. 오늘은 조금 천천히 가도 괜찮지?', 'I stayed up late last night. Can we take things slowly today?') },
  { title: l('하고 싶은 말', 'Something to tell you'), mood: l('기대 반, 걱정 반', 'Hopeful, but unsure'), hint: l('오늘이 마지막 만남. 호감만큼 신뢰도 중요하고, 긴장이 높으면 고백이 어려워요.', 'This is the final day. Trust matters as much as affection, and tension can get in the way.'), line: l('오늘은 네가 먼저 와 있었네. 나도… 오늘을 좀 기다렸어.', 'You got here before me. I was… looking forward to today, too.') },
];
export const romanceMemories: Record<MemoryId, Localized> = {
  honest: l('솔직한 마음을 나눴다', 'You spoke honestly'), sweet: l('커피보다 달콤한 코코아', 'Sweet cocoa over coffee'),
  walk: l('손잡고 걸은 길', 'A walk hand in hand'), team: l('함께 해결한 문제', 'A challenge solved together'),
};
export const romanceActions: RomanceAction[] = [
  { id: 'talk', title: l('대화하기', 'Talk'), hint: l('마음을 표현해요', 'Share your feelings'), lines: [l('너는 왜 자꾸 나를 누르는 거야? 진짜 궁금해서.', 'Why do you keep clicking on me? I really want to know.'), l('피곤하니까 평소엔 못 하던 말도 나올 것 같아.', 'Being this tired makes me want to say things I usually keep to myself.'), l('우리, 처음 만났을 때랑은 좀 달라진 것 같지 않아?', 'Things feel different from when we first met, don’t they?')], choices: [
    { id: 'honest', label: l('너랑 있는 게 좋아.', 'I like being with you.'), reply: l('…그 말, 그냥 하는 말은 아니지? 나도 기억해 둘게.', '…You mean that, right? I’ll remember it.'), effect: effect(9, 6, 4), memory: 'honest' },
    { id: 'tease', label: l('벌써 내가 보고 싶었어?', 'Miss me already?'), reply: l('그렇게 놀리면 내가 뭐라고 대답해야 해…', 'How am I supposed to answer when you tease me like that…'), effect: effect(13, 0, 12) },
    { id: 'boast', label: l('내 점수 좀 봐. 대단하지?', 'Look at my score. Impressed?'), reply: l('잘하네. 근데 지금은 점수 말고 네 얘기를 듣고 싶었어.', 'Nice score. But I wanted to hear about you, not the leaderboard.'), effect: effect(2, -6, 10) },
  ] },
  { id: 'listen', title: l('마음 들어주기', 'Listen'), hint: l('신뢰를 쌓아요', 'Build trust'), lines: [l('사실 이런 자리에서는 좀 긴장해. 무슨 말을 해야 할지도 모르겠고.', 'I get nervous in moments like this. I’m not sure what to say.'), l('오늘은 잘하는 척할 기운도 없어. 그냥 얘기 좀 들어줄래?', 'I don’t have the energy to pretend I’m fine. Will you just listen?'), l('네가 나를 어떻게 생각하는지, 그게 좀 신경 쓰여.', 'I’ve been wondering what you really think of me.')], choices: [
    { id: 'patient', label: l('천천히 말해. 듣고 있어.', 'Take your time. I’m listening.'), reply: l('고마워. 이런 날엔 달콤한 코코아가 좋더라. 커피보다 훨씬.', 'Thanks. Sweet cocoa helps on days like this. Much more than coffee.'), effect: effect(5, 13, -12), memory: 'sweet' },
    { id: 'fix', label: l('해결 방법부터 찾아볼까?', 'Should we find a solution?'), reply: l('방법도 좋지만… 일단 옆에 있어 주면 안 돼?', 'A solution would be nice… but could you just stay with me first?'), effect: effect(3, 4, 6) },
    { id: 'dismiss', label: l('그 정도는 별거 아니야.', 'It’s not that big a deal.'), reply: l('…너한테는 그럴 수 있겠네.', '…Maybe not to you.'), effect: effect(-6, -10, 15) },
  ] },
  { id: 'walk', title: l('둘이 산책', 'Take a walk'), hint: l('거리를 좁혀요', 'Get closer'), lines: [l('바깥 공기가 좋다. 이렇게 나란히 걷는 건 처음이네.', 'The air feels nice. This is our first walk together.'), l('천천히 걸으니까 좀 살 것 같아.', 'Walking slowly feels good right now.'), l('이 길, 다음에도 같이 걸었으면 좋겠어.', 'I’d like to walk this way with you again.')], choices: [
    { id: 'pace', label: l('네 속도에 맞춰 걸을게.', 'I’ll walk at your pace.'), reply: l('그렇게 맞춰 주니까 편하다. 고마워.', 'I feel comfortable with you matching my pace. Thanks.'), effect: effect(8, 7, -8) },
    { id: 'hand', label: l('손잡아도 될까?', 'Can I hold your hand?'), reply: l('…응. 대신 먼저 놓으면 안 돼.', '…Yes. But don’t let go first.'), effect: effect(16, 4, 8), trustRequired: 40, memory: 'walk' },
    { id: 'lead', label: l('내가 길을 안내할게.', 'I’ll lead the way.'), reply: l('좋아. 너무 앞서가지만 마.', 'Okay. Just don’t get too far ahead.'), effect: effect(4, 2, -2) },
  ] },
  { id: 'solve', title: l('같이 문제 풀기', 'Solve together'), hint: l('동료로서 가까워져요', 'Find your teamwork'), trustRequired: 20, lines: [l('이 부분에서 막혔어. 같이 봐줄 수 있어?', 'I’m stuck here. Can you take a look with me?'), l('코드는 보이는데 머리가 안 돌아가네. 무리는 하지 말자.', 'I can see the code, but my brain isn’t working. Let’s not push too hard.'), l('이제는 네가 옆에 있으면 풀 수 있을 것 같아.', 'Having you beside me makes me feel like we can solve this.')], choices: [
    { id: 'together', label: l('생각한 순서부터 같이 보자.', 'Let’s work through it together.'), reply: l('아, 여기였네! 너랑 같이 푸니까 재밌다.', 'Oh, there it is! I like solving things with you.'), effect: effect(6, 12, 4), memory: 'team' },
    { id: 'answer', label: l('정답은 내가 알려줄게.', 'I’ll give you the answer.'), reply: l('답은 알겠어. 그래도 같이 풀고 싶었는데.', 'I see the answer. But I wanted to get there together.'), effect: effect(2, 4, 10) },
    { id: 'cheer', label: l('잘하고 있어. 난 네 편이야.', 'You’re doing well. I’m on your side.'), reply: l('그 말 들으니까 다시 해볼 힘이 나네.', 'That makes me want to try again.'), effect: effect(8, 6, -6) },
  ] },
  { id: 'gift', title: l('작은 선물', 'A little gift'), hint: l('선물권 1장 사용', 'Costs 1 gift ticket'), lines: [l('나한테 주려고 골랐어? 뭔데?', 'You picked something for me? What is it?'), l('이거 나 생각해서 가져온 거야?', 'Did you bring this because you were thinking of me?'), l('오늘까지 챙겨 줄 줄은 몰랐어.', 'I didn’t expect another thoughtful surprise today.')], choices: [
    { id: 'cocoa', label: l('따뜻한 코코아', 'Warm cocoa'), reply: l('따뜻하다. 이런 건 마시는 동안 계속 네 생각이 나겠네.', 'It’s warm. I’ll be thinking of you while I drink this.'), effect: effect(8, 4, -6) },
    { id: 'keycap', label: l('귀여운 키캡', 'A cute keycap'), reply: l('이거 끼우면 문제 풀 때마다 보이겠네. 마음에 들어.', 'I’ll see this every time I solve something. I like it.'), effect: effect(6, 10, 0) },
    { id: 'flower', label: l('작은 꽃 한 송이', 'A single flower'), reply: l('꽃은… 좀 두근거리잖아.', 'Flowers… make my heart race.'), effect: effect(14, 2, 10) },
  ] },
  { id: 'rest', title: l('잠깐 쉬기', 'Take a break'), hint: l('긴장을 낮춰요', 'Ease the tension'), lines: [l('계속 얘기 안 해도 괜찮을까?', 'Is it okay if we don’t talk for a moment?'), l('잠깐만 아무것도 안 하고 싶어.', 'I’d like to do nothing for a little while.'), l('하고 싶은 말이 있는데, 마음부터 좀 가라앉힐게.', 'There’s something I want to say. Let me settle my nerves first.')], choices: [
    { id: 'company', label: l('그냥 옆에 있어 줄게.', 'I’ll just stay beside you.'), reply: l('가만히 있어도 어색하지 않네. 너라서 그런가.', 'The silence doesn’t feel awkward. Maybe because it’s you.'), effect: effect(3, 8, -20) },
    { id: 'space', label: l('편하게 쉬어. 기다릴게.', 'Rest. I’ll wait for you.'), reply: l('재촉하지 않아서 고마워.', 'Thank you for not rushing me.'), effect: effect(1, 5, -26) },
    { id: 'cheer', label: l('웃긴 얘기 해줄까?', 'Want to hear something funny?'), reply: l('풋. 그게 뭐야… 조금 웃기긴 하네.', 'Heh. What was that… okay, it was a little funny.'), effect: effect(7, 3, -8) },
  ] },
];
export const romanceEndings: Record<EndingId, { title: Localized; line: Localized; hint: Localized }> = {
  love: { title: l('우리, 내일은 데이트할까?', 'A date tomorrow?'), line: l('네가 내 말을 기억해 준 것도, 기다려 준 것도 다 알아. 나도 너 좋아해. 내일은 데이트라고 불러도 되지?', 'You remembered what I said, and waited for me. I like you too. Can we call tomorrow a date?'), hint: l('고백 · 호감 75, 신뢰 60, 긴장 40 이하, 추억 2개', 'Confess · Affection 75, trust 60, tension ≤40, 2 memories') },
  slow: { title: l('우리만의 속도', 'At our own pace'), line: l('당장 이름 붙이지 않아도 좋아. 네가 다음에도 와 준다면, 나도 한 걸음씩 가볼게.', 'We don’t need to put a name on this yet. Come back, and I’ll take it one step at a time with you.'), hint: l('천천히 · 호감 45, 신뢰 45 이상', 'Take it slowly · Affection and trust ≥45') },
  partner: { title: l('네 옆자리, 내 자리', 'The seat beside you'), line: l('다음 대회도 같은 팀이야. 힘들 때 제일 먼저 찾고 싶은 사람, 그게 너더라.', 'Same team next time. When things get hard, you’re the first person I want to turn to.'), hint: l('같은 팀 · 신뢰 55 이상, 함께 푼 문제의 추억', 'Team up · Trust ≥55 and the teamwork memory') },
  friend: { title: l('다음에 또 만나', 'Until next time'), line: l('아직은 조금 더 알아가고 싶어. 그래도 오늘 너랑 있었던 건 좋았어.', 'I’d like to get to know you a little more. I’m glad we spent today together.'), hint: l('서로를 알아가는 중에 마지막 날을 마치기', 'Finish the last day while still getting acquainted') },
  distance: { title: l('한 걸음 쉬어가기', 'A step back'), line: l('미안, 지금은 조금 벅차. 다음엔 내 속도도 같이 봐줬으면 좋겠어.', 'Sorry, this feels like too much right now. Next time, please pay attention to my pace too.'), hint: l('긴장이 65 이상이거나 신뢰 30 미만일 때 고백', 'Confess with tension ≥65 or trust <30') },
};
