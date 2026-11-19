/*TRAIT_DATA_BEGIN*/const TRAIT_DATA=[{"name": "만루 사나이", "desc": "주자 만루시 컨택/파워가 각각 +5/+8 상승", "holders": ["'17 이범호"]}, {"name": "대도", "desc": "주자로 1루에 출루시 일정 확률로 '도루'시도", "holders": ["'93 이종범", "'96 이종범", "'97 이종범", "'09 이종범", "'92 전준호", "'98 전준호", "'00 전준호", "'03 전준호", "'04 전준호", "'26 조수행", "'16 조수행", "'26 정수빈", "'15 정수빈", "'16 정수빈", "'19 정수빈", "'26 박해민", "'14 박해민", "'23 박해민", "'25 박해민", "'17 김주찬", "'10 김주찬", "'07 정근우", "'08 정근우", "'10 정근우", "피트 크로암스트롱", "오타니 쇼헤이", "'26 김도영", "'24 김도영", "엘리 데라크루즈"]}, {"name": "베중정", "desc": "중견수 수비 시 호수비 발동 확률 상승", "holders": ["'26 정수빈", "'15 정수빈", "'16 정수빈", "'19 정수빈", "피트 크로암스트롱", "'26 박해민", "'14 박해민", "'23 박해민", "'25 박해민", "'86 이순철", "'87 이순철", "'88 이순철", "'89 이순철", "'91 이순철", "'93 이순철", "'96 이순철", "'97 이순철"]}, {"name": "대타 신화", "desc": "대타로 출장 시 컨택/파워가 +20%씩 상승하고 장타 확률 5%p 증가", "holders": ["'98 이재주", "'00 이재주", "'09 이재주", "'26 김인태", "'19 김인태"]}, {"name": "파이널보스", "desc": "경기 마지막 회에 등판 시 구위 +10", "holders": ["'05 오승환", "'06 오승환", "'11 오승환", "'12 오승환", "'13 오승환", "'09 유동훈", "'14 손승락", "메이슨 밀러", "아롤디스 채프먼", "'26 이영하", "'26 박영현"]}, {"name": "득점권의악마", "desc": "주자 득점권일 시 컨택+5", "holders": ["'26 김민석"]}, {"name": "매덕스", "desc": "전체 스트라이크 중 보더라인에 걸리는 공의 비율 25% 증가", "holders": ["'15 유희관", "'16 유희관", "'19 유희관", "'07 정우람", "'08 정우람", "'10 정우람", "'26 고영표", "'21 고영표", "'11 장원삼", "'12 장원삼", "'13 장원삼", "'14 장원삼"]}, {"name": "용규놀이", "desc": "2스트라이크 이후 커트 성공률 10% 증가", "holders": ["'09 이용규", "'07 정근우", "'08 정근우", "'10 정근우"]}, {"name": "배드볼 히터", "desc": "볼 컨택 시 안타 확률 5% 증가", "holders": ["'26 레이예스", "'10 박종윤"]}, {"name": "거포", "desc": "항상 파워가 +7 추가 상승하며 홈런 시 5% 확률로 장외홈런", "holders": ["'10 이대호", "'16 김재환", "'26 한동희", "'01 김동주", "'18 김동엽", "'18 로맥", "'02 이승엽", "'12 이승엽", "'13 이승엽", "'14 이승엽", "'99 장종훈", "'14 박병호", "'26 최정", "'07 최정", "'08 최정", "'10 최정", "'18 최정", "'22 최정", "'26 김도영", "'24 김도영", "'14 강정호", "'02 마해영", "'98 박재홍", "'00 박재홍", "'07 박재홍", "'08 박재홍", "'10 박재홍", "요르단 알바레즈", "피트 크로암스트롱", "주니어 카미네로", "피트 알론소", "벤 라이스", "카일 슈와버", "스즈키 세이야", "'01 우즈"]}, {"name": "200", "desc": "한 경기에서 타순이 돌아올 때마다 컨택률 소폭 상승", "holders": ["'14 서건창", "'19 페르난데스", "'26 최원준", "'26 레이예스"]}, {"name": "파이어볼러", "desc": "실점 위기에서 직구 최고구속+5km/h, 제구/구위 +7", "holders": ["'26 곽빈", "'26 안우진", "'07 김광현", "'08 김광현", "'10 김광현", "'18 김광현", "'22 김광현", "'14 조상우", "'26 아빌라", "캠 슐리틀러"]}, {"name": "기분파", "desc": "직전 이닝 수비성공 시 다음 타석 컨택/파워 +10", "holders": ["'26 안재석"]}, {"name": "내야 사령관", "desc": "유격수 출장 시 발동되며  수비 시 병살 확률 +7%, 타격 시 병살 확률 -7%", "holders": ["바비 위트 주니어", "엘리 데라크루즈", "'26 박찬호", "'24 박찬호", "'26 김상수", "'11 김상수", "'12 김상수", "'13 김상수", "'14 김상수", "'98 박진만", "'00 박진만", "'03 박진만", "'04 박진만", "'05 박진만", "'06 박진만", "'14 강정호", "'26 김선빈", "'09 김선빈", "'17 김선빈", "'24 김선빈", "'26 오지환", "'23 오지환", "'25 오지환"]}, {"name": "출루왕", "desc": "2스트라이크 이후 장타율 8% 증가", "holders": ["'26 오스틴", "'23 오스틴", "'25 오스틴", "'26 김현수", "'15 김현수", "'23 김현수", "'25 김현수"]}];/*TRAIT_DATA_END*/
const TRAIT_BY_PLAYER=(()=>{const m={};TRAIT_DATA.forEach(t=>t.holders.forEach(h=>{(m[h]=m[h]||[]).includes(t.name)||m[h].push(t.name)}));return m})();
const TDESC=n=>(TRAIT_DATA.find(t=>t.name===n)||{}).desc||'';
const isLoaded=()=>!!(G&&G.bases[0]&&G.bases[1]&&G.bases[2]);
const TRAIT_ENGINE={
  '만루 사나이':{sym:'grand',act:b=>isLoaded(),c:()=>5,p:()=>8},
  '대도':{sym:'thief',act:()=>false},                         // 1루 주자일 때 투구마다 25% 도루 시도, 성공 82%
  '베중정':{sym:'cf',act:()=>false},                          // 중견수 수비 시 호수비 15% → 25%
  '대타 신화':{sym:'pinch',act:b=>!!b.pinchPA,c:b=>Math.round(b.contact*0.2),p:b=>Math.round(b.power*0.2)}, // 대타 타석: 컨·파 +20%, 단타→2루타 5%
  '파이널보스':{sym:'boss',role:'P',act:()=>!!(G&&G.inning>=G.innings),s:()=>10},
  '득점권의악마':{sym:'devil',act:()=>!!(G&&(G.bases[1]||G.bases[2])),c:()=>5},
  '매덕스':{sym:'maddux',role:'P',act:()=>false},                      // 스트라이크 중 보더라인 공 비율 +25%
  '용규놀이':{sym:'cut',act:()=>!!(G&&G.strikes>=2)},          // 2스트라이크 뒤 헛스윙의 10%를 커트(파울)로
  '배드볼 히터':{sym:'badball',act:()=>false},                 // 볼 컨택 시 범타의 5%가 안타로
  '거포':{sym:'slug',act:()=>false,always:true,p:()=>7},       // 홈런의 5%는 장외홈런
  '200':{sym:'200',act:b=>!!(b.st&&b.st.pa>0),c:b=>Math.min(6,2*((b.st&&b.st.pa)||0))},
  '파이어볼러':{sym:'fire',role:'P',act:()=>!!(G&&(G.bases[1]||G.bases[2])),s:()=>7,ctl:()=>7}, // 득점권 위기: 직구 +5km/h, 제구·구위 +7
  '기분파':{sym:'mood',act:b=>!!b.moodUp,c:()=>10,p:()=>10},     // 직전 수비 이닝 무실점 → 다음 타석 컨·파 +10
  '내야 사령관':{sym:'ss',act:b=>b.pos==='SS'},                  // 유격수 출장: 수비 병살 +7%p, 타격 병살 -7%p
  '출루왕':{sym:'obp',act:()=>!!(G&&G.strikes>=2)}};             // 2스트라이크 뒤 안타의 8%가 한 베이스 더
const FASTB=['포심','투심','싱커','커터','슈트'];
let TR_OVR=LS.get('dny_trait',{})||{};
const saveTr=()=>{LS.set('dny_trait',TR_OVR);cloudPush('trait',TR_OVR)};
const tRole=t=>(TRAIT_ENGINE[t]&&TRAIT_ENGINE[t].role)||'B';
const baseTraits=n=>TRAIT_BY_PLAYER[n]||[];
function traitsOf(o){const n=typeof o==='string'?o:(o&&o.name)||'';const b=baseTraits(n),c=TR_OVR[n];return c&&TRAIT_ENGINE[c]&&b.length<2&&!b.includes(c)?[...b,c]:b}
const isCustomT=(n,t)=>TR_OVR[n]===t&&!baseTraits(n).includes(t);
const hasTrait=(o,t)=>traitsOf(o).includes(t);
const tOn=(o,t)=>{const e=TRAIT_ENGINE[t];if(!e)return false;return e.always||(e.act?e.act(o):false)};
const tSum=(o,k)=>traitsOf(o).reduce((s,t)=>{const e=TRAIT_ENGINE[t];return s+(e&&e[k]&&(e.always||!e.act||e.act(o))?e[k](o):0)},0);
const effC=b=>b.contact+tSum(b,'c'),effP=b=>b.power+tSum(b,'p'),effS=p=>p.stuff+tSum(p,'s'),effCtl=p=>p.control+tSum(p,'ctl');
const grandOn=b=>hasTrait(b,'만루 사나이')&&isLoaded();
const anyOn=o=>traitsOf(o).some(t=>{const e=TRAIT_ENGINE[t];return e&&!e.always&&e.act&&e.act(o)});

/* 특성 아이콘: 금색 육각형 + 특성 심벌 */
const INK='#2b2110';
const HEX_SYM={
  grand:`<path d="M50 34 L69 55 L50 76 L31 55 Z" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
    <rect x="62.5" y="48.5" width="13" height="13" transform="rotate(45 69 55)" fill="${INK}"/><rect x="43.5" y="27.5" width="13" height="13" transform="rotate(45 50 34)" fill="${INK}"/>
    <rect x="24.5" y="48.5" width="13" height="13" transform="rotate(45 31 55)" fill="${INK}"/><path d="M43 77 h14 v6 l-7 6 l-7 -6 z" fill="${INK}"/>
    <path d="M50 14 C56 20 58 24 55 29 C54 25 51 24 50 22 C49 25 46 26 45 29 C42 24 44 19 50 14 Z" fill="#b8321f"/>`,
  thief:`<g transform="translate(-3,-3)"><path d="M30 70 L36 50 Q39 43 46 45 L54 52 Q64 57 77 59 Q86 61 85 69 L85 73 L30 73 Z" fill="${INK}"/>
    <rect x="34" y="75" width="6" height="7" rx="1" fill="${INK}"/><rect x="50" y="75" width="6" height="7" rx="1" fill="${INK}"/><rect x="68" y="75" width="6" height="7" rx="1" fill="${INK}"/>
    <path d="M44 51 L48 55 M49 49 L53 53" stroke="#e9cf7a" stroke-width="2.5" stroke-linecap="round"/><path d="M14 50 H28 M11 60 H27 M16 70 H25" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/></g>`,
  cf:`<path d="M33 82 C24 70 24 52 30 40 C32 35 37 35 38 40 L39 48 L40 30 C40 25 46 25 46 30 L47 46 L49 26 C49 21 55 21 55 26 L55 46 L58 31 C59 26 65 27 64 32 L62 50 C66 46 72 47 72 52 C70 62 66 72 58 82 Z" fill="${INK}"/>
    <circle cx="50" cy="60" r="7" fill="#f3e2a0"/><path d="M45 57 Q50 60 45 64 M55 57 Q50 60 55 64" stroke="#b8321f" stroke-width="1.6" fill="none"/>
    <path d="M50 12 L53 19 L60 19 L54.5 23.5 L57 31 L50 26.5 L43 31 L45.5 23.5 L40 19 L47 19 Z" fill="#b8321f"/>`,
  pinch:`<path d="M30 82 L64 26 L72 31 L40 86 Z" fill="${INK}"/><rect x="27" y="80" width="12" height="7" rx="2" transform="rotate(32 33 83)" fill="${INK}"/>
    <path d="M70 46 L60 62 L68 62 L58 80 L78 56 L69 56 L78 46 Z" fill="#b8321f"/>`,
  boss:`<path d="M24 46 L36 58 L50 36 L64 58 L76 46 L72 74 L28 74 Z" fill="${INK}"/><rect x="28" y="77" width="44" height="7" rx="2" fill="${INK}"/>
    <circle cx="50" cy="33" r="4" fill="${INK}"/><circle cx="23" cy="44" r="3.5" fill="${INK}"/><circle cx="77" cy="44" r="3.5" fill="${INK}"/>
    <text x="50" y="70" text-anchor="middle" font-size="17" font-weight="900" font-family="Arial Black,Arial,sans-serif" fill="#f3e2a0">9</text>`,
  devil:`<path d="M30 30 C30 42 36 48 42 50 L40 42 Z M70 30 C70 42 64 48 58 50 L60 42 Z" fill="#b8321f"/>
    <path d="M50 40 C64 40 70 50 70 60 C70 74 60 84 50 84 C40 84 30 74 30 60 C30 50 36 40 50 40 Z" fill="${INK}"/>
    <path d="M38 58 L46 62 L38 64 Z M62 58 L54 62 L62 64 Z" fill="#e2bd5c"/><path d="M40 72 Q50 79 60 72" stroke="#e2bd5c" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  maddux:`<path d="M32 40 H68 V66 L50 80 L32 66 Z" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="50" cy="56" r="17" fill="none" stroke="${INK}" stroke-width="3.5"/>
    <path d="M50 33 V45 M50 67 V79 M27 56 H39 M61 56 H73" stroke="${INK}" stroke-width="3.5"/><circle cx="66.5" cy="42.5" r="5.5" fill="#b8321f"/>`,
  cut:`<path d="M30 80 L66 32 L73 37 L38 85 Z" fill="${INK}"/>
    <path d="M58 72 A15 15 0 1 0 44 46" fill="none" stroke="#b8321f" stroke-width="4.5" stroke-linecap="round"/><path d="M40 39 L44 47 L35 49 Z" fill="#b8321f"/>
    <circle cx="70" cy="76" r="6" fill="#f3e2a0" stroke="${INK}" stroke-width="2"/>`,
  badball:`<rect x="38" y="36" width="26" height="32" fill="none" stroke="${INK}" stroke-width="3.5" stroke-dasharray="5 3"/>
    <circle cx="27" cy="74" r="8" fill="#f3e2a0" stroke="${INK}" stroke-width="2.5"/><path d="M23 70 Q27 74 23 78 M31 70 Q27 74 31 78" stroke="#b8321f" stroke-width="1.6" fill="none"/>
    <path d="M70 84 L36 64 L40 58 L74 78 Z" fill="${INK}"/><path d="M18 64 L12 58 M20 84 L13 88 M14 74 H6" stroke="#b8321f" stroke-width="3" stroke-linecap="round"/>`,
  slug:`<path d="M50 20 L56 36 L72 28 L66 44 L84 46 L68 56 L80 70 L62 66 L60 84 L50 70 L40 84 L38 66 L20 70 L32 56 L16 46 L34 44 L28 28 L44 36 Z" fill="${INK}"/>
    <circle cx="50" cy="54" r="12" fill="#f3e2a0"/><path d="M43 48 Q49 54 43 60 M57 48 Q51 54 57 60" stroke="#b8321f" stroke-width="2" fill="none"/>`,
  fire:`<path d="M50 20 C58 32 70 38 70 56 C70 70 61 80 50 80 C39 80 30 70 30 57 C30 47 36 41 40 34 C41 42 44 46 48 47 C46 37 47 28 50 20 Z" fill="#b8321f"/>
    <circle cx="50" cy="62" r="12.5" fill="#fff8e4" stroke="${INK}" stroke-width="3"/><path d="M42 54 Q46 62 42 70 M58 54 Q54 62 58 70" stroke="#b8321f" stroke-width="2.2" fill="none"/>
    <path d="M18 76 L30 68 M16 64 L28 60 M20 52 L30 52" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  mood:`<circle cx="46" cy="60" r="22" fill="${INK}"/><circle cx="38" cy="55" r="3.6" fill="#e9cf7a"/><circle cx="54" cy="55" r="3.6" fill="#e9cf7a"/>
    <path d="M35 65 Q46 76 57 65" stroke="#e9cf7a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M70 46 V24 M62 32 L70 24 L78 32" stroke="#b8321f" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M78 64 V48 M73 53 L78 48 L83 53" stroke="#b8321f" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  ss:`<path d="M50 22 L74 30 V52 C74 68 63 79 50 85 C37 79 26 68 26 52 V30 Z" fill="${INK}"/>
    <text x="50" y="62" text-anchor="middle" font-size="22" font-weight="900" font-family="Arial,sans-serif" fill="#e9cf7a">SS</text>
    <path d="M34 72 L44 66 M56 66 L66 72" stroke="#e9cf7a" stroke-width="3" stroke-linecap="round"/>`,
  obp:`<path d="M50 44 L74 62 L50 80 L26 62 Z" fill="#fff8e4" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M32 38 L36 22 L44 32 L50 18 L56 32 L64 22 L68 38 Z" fill="${INK}"/>
    <text x="50" y="68" text-anchor="middle" font-size="15" font-weight="900" font-family="Arial,sans-serif" fill="${INK}">2S</text>`,
  '200':`<text x="50" y="66" text-anchor="middle" font-size="31" font-weight="900" font-family="Arial Black,Arial,sans-serif" fill="${INK}" letter-spacing="-1">200</text>
    <path d="M28 76 H72" stroke="#b8321f" stroke-width="4" stroke-linecap="round"/><path d="M30 36 L36 42 L44 32 M56 36 L62 42 L70 32" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  _:`<circle cx="50" cy="56" r="20" fill="none" stroke="${INK}" stroke-width="5"/><text x="50" y="64" text-anchor="middle" font-size="24" font-weight="900" font-family="Arial,sans-serif" fill="${INK}">?</text>`};
function hexIcon(t,size,on){const e=TRAIT_ENGINE[t],sym=HEX_SYM[e?e.sym:'_']||HEX_SYM._,id='hg'+(e?e.sym:'x')+(on?'on':'')+size;
  return `<svg class="hexi${on?' on':''}" width="${size}" height="${Math.round(size*1.1)}" viewBox="0 0 100 110" aria-label="${esc(t)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".45" stop-color="#e2bd5c"/><stop offset="1" stop-color="#9c7425"/></linearGradient></defs>
    <polygon points="50,3 95,28.5 95,81.5 50,107 5,81.5 5,28.5" fill="url(#${id})" stroke="#4d3a10" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="50,12 87,33 87,77 50,98 13,77 13,33" fill="none" stroke="rgba(255,248,210,.55)" stroke-width="2"/>${sym}</svg>`}
// 목록용: 대표 특성 1개 + 개수
const T_IDX={};
const tIcons=o=>{const ts=traitsOf(o);if(!ts.length)return'';const i=(T_IDX[o.name]||0)%ts.length;return`<span class="hexs" data-tn="${esc(o.name)}" title="${esc(ts[i]+': '+TDESC(ts[i]))}">${hexIcon(ts[i],18)}${ts.length>1?`<small class="hexn">${i+1}/${ts.length}</small>`:''}</span>`};
// 목록의 아이콘을 누르면 다음 특성으로
document.addEventListener('click',e=>{const h=e.target.closest&&e.target.closest('.hexs[data-tn]');if(!h)return;const n=h.dataset.tn,ts=traitsOf(n);if(ts.length<2)return;e.stopPropagation();e.preventDefault();T_IDX[n]=((T_IDX[n]||0)+1)%ts.length;h.outerHTML=tIcons({name:n})},true);
// 선수 카드: 특성 1개씩, 선수 이름을 누르면 다음 특성으로
const tHexes=o=>{const ts=traitsOf(o);if(!ts.length)return'';const i=(T_IDX[o.name]||0)%ts.length,t=ts[i];
  return`<div class="hexes"><div class="hexw" title="${esc(t)}: ${esc(TDESC(t))}">${hexIcon(t,40,tOn(o,t)&&!TRAIT_ENGINE[t].always)}<span>${esc(t)}${isCustomT(o.name,t)?'<i style="color:#9fe0ff;font-style:normal">*</i>':''}${ts.length>1?` ${i+1}/${ts.length} ▸`:''}</span></div></div>`};
function traitRulesHTML(){return TRAIT_DATA.map(t=>`<div style="display:flex;gap:8px;align-items:center;margin:4px 0"><span style="flex:none">${hexIcon(t.name,30)}</span><div><b>${esc(t.name)}</b> — ${esc(t.desc)}${TRAIT_ENGINE[t.name]?'':' <small style="color:#ff9a7a">(효과 준비 중)</small>'}<br><small style="color:#8fc3c9">${esc(t.holders.join(', '))}</small></div></div>`).join('')}

