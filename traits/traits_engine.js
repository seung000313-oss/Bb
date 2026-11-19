/* ===== 특성 시스템 =====
   TRAIT_DATA(이름·효과 설명·보유 선수)는 특성 CSV에서 자동 생성된다(신규 특성 업데이트 시 교체).
   TRAIT_ENGINE은 특성 이름별 실제 효과와 아이콘 심벌. 엔진에 없는 특성은 기본 아이콘만 표시되고 효과는 없다. */
/*TRAIT_DATA_BEGIN*/const TRAIT_DATA=[];/*TRAIT_DATA_END*/
const TRAIT_BY_PLAYER=(()=>{const m={};TRAIT_DATA.forEach(t=>t.holders.forEach(h=>{(m[h]=m[h]||[]).includes(t.name)||m[h].push(t.name)}));return m})();
const TDESC=n=>(TRAIT_DATA.find(t=>t.name===n)||{}).desc||'';
const isLoaded=()=>!!(G&&G.bases[0]&&G.bases[1]&&G.bases[2]);
const TRAIT_ENGINE={
  '만루 사나이':{sym:'grand',act:b=>isLoaded(),c:()=>5,p:()=>8},
  '대도':{sym:'thief',act:()=>false},                         // 1루 주자일 때 투구마다 25% 도루 시도, 성공 82%
  '베중정':{sym:'cf',act:()=>false},                          // 중견수 수비 시 호수비 15% → 25%
  '대타 신화':{sym:'pinch',act:b=>!!b.pinchPA,c:()=>5,p:()=>5}, // 대타 타석: 컨·파 +5, 단타→2루타 5%
  '파이널보스':{sym:'boss',act:()=>!!(G&&G.inning>=9),s:()=>10},
  '득점권의악마':{sym:'devil',act:()=>!!(G&&(G.bases[1]||G.bases[2])),c:()=>5},
  '매덕스':{sym:'maddux',act:()=>false},                      // 스트라이크 중 보더라인 공 비율 +25%
  '용규놀이':{sym:'cut',act:()=>!!(G&&G.strikes>=2)},          // 2스트라이크 뒤 헛스윙의 10%를 커트(파울)로
  '배드볼 히터':{sym:'badball',act:()=>false},                 // 볼 컨택 시 범타의 5%가 안타로
  '거포':{sym:'slug',act:()=>false,always:true,p:()=>7},       // 홈런의 5%는 장외홈런
  '200':{sym:'200',act:b=>!!(b.st&&b.st.pa>0),c:b=>Math.min(6,2*((b.st&&b.st.pa)||0))}};
function traitsOf(o){const n=typeof o==='string'?o:(o&&o.name)||'';return TRAIT_BY_PLAYER[n]||[]}
const hasTrait=(o,t)=>traitsOf(o).includes(t);
const tOn=(o,t)=>{const e=TRAIT_ENGINE[t];if(!e)return false;return e.always||(e.act?e.act(o):false)};
const tSum=(o,k)=>traitsOf(o).reduce((s,t)=>{const e=TRAIT_ENGINE[t];return s+(e&&e[k]&&(e.always||!e.act||e.act(o))?e[k](o):0)},0);
const effC=b=>b.contact+tSum(b,'c'),effP=b=>b.power+tSum(b,'p'),effS=p=>p.stuff+tSum(p,'s');
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
  '200':`<text x="50" y="66" text-anchor="middle" font-size="31" font-weight="900" font-family="Arial Black,Arial,sans-serif" fill="${INK}" letter-spacing="-1">200</text>
    <path d="M28 76 H72" stroke="#b8321f" stroke-width="4" stroke-linecap="round"/><path d="M30 36 L36 42 L44 32 M56 36 L62 42 L70 32" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  _:`<circle cx="50" cy="56" r="20" fill="none" stroke="${INK}" stroke-width="5"/><text x="50" y="64" text-anchor="middle" font-size="24" font-weight="900" font-family="Arial,sans-serif" fill="${INK}">?</text>`};
function hexIcon(t,size,on){const e=TRAIT_ENGINE[t],sym=HEX_SYM[e?e.sym:'_']||HEX_SYM._,id='hg'+(e?e.sym:'x')+(on?'on':'')+size;
  return `<svg class="hexi${on?' on':''}" width="${size}" height="${Math.round(size*1.1)}" viewBox="0 0 100 110" aria-label="${esc(t)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".45" stop-color="#e2bd5c"/><stop offset="1" stop-color="#9c7425"/></linearGradient></defs>
    <polygon points="50,3 95,28.5 95,81.5 50,107 5,81.5 5,28.5" fill="url(#${id})" stroke="#4d3a10" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="50,12 87,33 87,77 50,98 13,77 13,33" fill="none" stroke="rgba(255,248,210,.55)" stroke-width="2"/>${sym}</svg>`}
// 목록용: 대표 특성 1개 + 개수
const tIcons=o=>{const ts=traitsOf(o);if(!ts.length)return'';return`<span class="hexs" title="${esc(ts.map(t=>t+': '+TDESC(t)).join(' / '))}">${hexIcon(ts[0],18)}${ts.length>1?`<small class="hexn">+${ts.length-1}</small>`:''}</span>`};
// 선수 카드: 특성 1개씩, 선수 이름을 누르면 다음 특성으로
const T_IDX={};
const tHexes=o=>{const ts=traitsOf(o);if(!ts.length)return'';const i=(T_IDX[o.name]||0)%ts.length,t=ts[i];
  return`<div class="hexes"><div class="hexw" title="${esc(t)}: ${esc(TDESC(t))}">${hexIcon(t,40,tOn(o,t)&&!TRAIT_ENGINE[t].always)}<span>${esc(t)}${ts.length>1?` ${i+1}/${ts.length}`:''}</span></div></div>`};
function traitRulesHTML(){return TRAIT_DATA.map(t=>`<div style="display:flex;gap:8px;align-items:center;margin:4px 0"><span style="flex:none">${hexIcon(t.name,30)}</span><div><b>${esc(t.name)}</b> — ${esc(t.desc)}${TRAIT_ENGINE[t.name]?'':' <small style="color:#ff9a7a">(효과 준비 중)</small>'}<br><small style="color:#8fc3c9">${esc(t.holders.join(', '))}</small></div></div>`).join('')}
