const PM=(()=>{
// ===== 로우폴리 선수 모형 (자체 3D 렌더러: 메시 생성 → 원근 투영 → 면 정렬·플랫 셰이딩) =====
const V={sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul:(a,s)=>[a[0]*s,a[1]*s,a[2]*s],dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
 cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],len:a=>Math.hypot(a[0],a[1],a[2]),norm:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]},lerp:(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]};
function basis(ax,hint){ax=V.norm(ax);let h=hint||[0,1,0];if(Math.abs(V.dot(ax,h))>.9)h=[1,0,0];const u=V.norm(V.cross(ax,h)),w=V.cross(u,ax);return[u,w]}
function ring(c,ax,rx,ry,n,hint,rot=0){const[u,w]=basis(ax,hint),o=[];for(let i=0;i<n;i++){const a=rot+i/n*Math.PI*2;o.push(V.add(c,V.add(V.mul(u,Math.cos(a)*rx),V.mul(w,Math.sin(a)*ry))))}return o}
function loft(F,rings,col,capA,capB){for(let r=0;r<rings.length-1;r++){const A=rings[r],B=rings[r+1],n=A.length;for(let i=0;i<n;i++){const j=(i+1)%n;F.push({v:[A[i],A[j],B[j],B[i]],c:col})}}
 if(capA)F.push({v:rings[0].slice().reverse(),c:col});if(capB)F.push({v:rings[rings.length-1].slice(),c:col})}
function limb(F,a,b,ra,rb,col,n=10,hint,k=3,bulge=0,bpos=.35){n=Math.min(n,10);k=Math.min(k,3);const ax=V.sub(b,a),R=[];for(let i=0;i<=k;i++){const t=i/k,r=(ra+(rb-ra)*t)*(1+bulge*Math.exp(-Math.pow((t-bpos)/.28,2)));R.push(ring(V.lerp(a,b,t),ax,r,r,n,hint))}loft(F,R,col,true,true)}
const ICOS={};function ico(lv=2){if(ICOS[lv])return ICOS[lv];const t=(1+Math.sqrt(5))/2;let v=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(V.norm);
 let f=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
 const mid={},m=(a,b)=>{const k=a<b?a+'_'+b:b+'_'+a;if(mid[k]!=null)return mid[k];v.push(V.norm(V.lerp(v[a],v[b],.5)));return mid[k]=v.length-1};
 for(let L=0;L<lv;L++){for(const k in mid)delete mid[k];f=f.flatMap(([a,b,c])=>{const ab=m(a,b),bc=m(b,c),ca=m(c,a);return[[a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]]})}return ICOS[lv]={v,f}}
function sphere(F,c,r,col,sx=1,sy=1,sz=1,frame,clip,lv=1){lv=Math.max(0,lv-1);const{v,f}=ico(lv);const P=v.map(p=>{const q=[p[0]*r*sx,p[1]*r*sy,p[2]*r*sz];return frame?V.add(c,V.add(V.add(V.mul(frame[0],q[0]),V.mul(frame[1],q[1])),V.mul(frame[2],q[2]))):V.add(c,q)});
 for(const t of f){if(clip&&clip(v[t[0]],v[t[1]],v[t[2]]))continue;F.push({v:[P[t[0]],P[t[2]],P[t[1]]],c:col})}}
const UNIS={home:{jersey:'#f4f1ea',trim:'#1d3557',pants:'#eceae4',sock:'#1d3557',cap:'#1d3557',skin:'#e7b48f',shoe:'#1b1b1b',glove:'#8a5a2b',belt:'#1b1b1b'},
 away:{jersey:'#8f9aa6',trim:'#b3202a',pants:'#8f9aa6',sock:'#b3202a',cap:'#b3202a',skin:'#d9a079',shoe:'#1b1b1b',glove:'#5b3a1e',belt:'#1b1b1b'},
 navy:{jersey:'#1d3557',trim:'#e9c46a',pants:'#eceae4',sock:'#1d3557',cap:'#1d3557',skin:'#e7b48f',shoe:'#f2f2f2',glove:'#a8742f',belt:'#e9c46a'}};
function buildPlayer(J,opt){const U=opt.U||UNIS[opt.uni||'home'],F=[],up=[0,1,0];
 const hipC=V.lerp(J.hipL,J.hipR,.5),shC=V.lerp(J.shL,J.shR,.5);const lat=V.norm(V.sub(J.hipL,J.hipR)),slat=V.norm(V.sub(J.shL,J.shR));
 const spine=V.norm(V.sub(shC,hipC));
 // 몸통: 골반→허리→가슴→어깨 4단 링(8각)
 const fwdH=V.norm(V.cross(lat,spine)),fwdS=V.norm(V.cross(slat,spine));
 const R=(c,l,f,rx,rz)=>{const o=[],N=14;for(let i=0;i<N;i++){const a=i/N*Math.PI*2;o.push(V.add(c,V.add(V.mul(l,Math.cos(a)*rx),V.mul(f,Math.sin(a)*rz))))}return o};
 const waist=V.lerp(hipC,shC,.38),chest=V.lerp(hipC,shC,.78);const midL=V.norm(V.lerp(lat,slat,.5)),midF=V.norm(V.lerp(fwdH,fwdS,.5));
 const rings=[R(V.add(hipC,V.mul(spine,-.035)),lat,fwdH,.105,.075),R(hipC,lat,fwdH,.115,.085),R(waist,midL,midF,.098,.075),R(chest,slat,fwdS,.13,.09),R(V.add(shC,V.mul(spine,.015)),slat,fwdS,.11,.07)];
 loft(F,rings.slice(0,2),U.pants,true,false);loft(F,[rings[1],R(V.lerp(hipC,waist,.25),lat,fwdH,.11,.082)],U.belt,false,false);
 {const tr=[];for(let i=0;i<=6;i++){const t=i/6,c=V.lerp(V.lerp(hipC,waist,.25),V.add(shC,V.mul(spine,.015)),t),l=V.norm(V.lerp(lat,slat,t)),f=V.norm(V.lerp(fwdH,fwdS,t));
  const rx=t<.35?.11-.03*t:t<.8?.0995+.075*(t-.35):.133-.1*(t-.8),rz=t<.4?.082-.02*t:t<.75?.074+.05*(t-.4):.0915-.1*(t-.75);tr.push(R(c,l,f,rx,rz))}loft(F,tr,U.jersey,false,true)}
 // 앞단추 라인(트림)
 limb(F,V.add(V.lerp(hipC,shC,.3),V.mul(midF,.078)),V.add(V.lerp(hipC,shC,.95),V.mul(fwdS,.072)),.006,.006,U.trim,4);
 // 다리: 허벅지(바지) / 정강이 위(바지) / 양말 / 신발
 for(const s of['L','R']){const hp=J['hip'+s],kn=J['kn'+s],an=J['an'+s],toe=J['toe'+s];
  limb(F,hp,kn,.066,.048,U.pants,24,null,10,.12,.3);sphere(F,kn,.05,U.pants);const sm=V.lerp(kn,an,.45);limb(F,kn,sm,.048,.044,U.pants,24,null,6,.12,.6);limb(F,sm,an,.044,.029,U.sock,24,null,6,.06,.1);
  const heel=V.add(an,V.mul(V.norm(V.sub(an,toe)),.035));limb(F,V.add(heel,[0,-.012,0]),V.add(toe,[0,.0,0]),.032,.026,U.shoe,16,null,6,.15,.3)}
 // 팔: 소매(저지) / 팔뚝(피부) / 손 / 글러브
 const glv=opt.glove;for(const s of['L','R']){const sh=J['sh'+s],el=J['el'+s],ha=J['ha'+s];sphere(F,sh,.052,U.jersey);
  const sl=V.lerp(sh,el,.55);limb(F,sh,sl,.048,.043,U.jersey,24,null,6,.05,.5);limb(F,sl,el,.037,.031,opt.batter?U.trim:U.skin,24,null,6,.1,.4);sphere(F,el,.032,opt.batter?U.trim:U.skin);
  limb(F,el,ha,.032,.024,U.skin,24,null,8,.14,.3);
  if(glv===s){const d=V.norm(V.sub(ha,el)),[u,w]=basis(d,up);sphere(F,V.add(ha,V.mul(d,.03)),.07,U.glove,1,1,.45,[u,w,d].map((x,i)=>i==2?V.cross(u,w):x));}
  else sphere(F,ha,.03,opt.batter?'#f2f2f2':U.skin)}
 // 목·머리·모자/헬멧
 limb(F,shC,J.neck,.045,.042,U.skin,24,null,4);const hd=J.head,hr=.072;const fz=V.norm(V.lerp(fwdS,[0,0,opt.batter?1:1],0.4)),hx=V.norm(V.cross(up,fz));
 sphere(F,hd,hr,U.skin,.95,1.08,1,null,null,2);
 if(opt.batter){sphere(F,V.add(hd,[0,.012,0]),hr*1.16,U.cap,1,1,1,null,(a,b,c)=>a[1]+b[1]+c[1]<-.6,2);
  limb(F,V.add(hd,V.add(V.mul(hx,-hr*1.05),[0,-.01,0])),V.add(hd,V.add(V.mul(hx,-hr*1.12),[0,-.05,0])),.03,.035,U.cap,6)}
 else{sphere(F,V.add(hd,[0,.022,0]),hr*1.05,U.cap,1,1,1,null,(a,b,c)=>a[1]+b[1]+c[1]<-.1,2);
  const b0=V.add(V.add(hd,[0,.03,0]),V.mul(fz,hr*.75)),b1=V.add(b0,V.mul(fz,.07));loft(F,[ring(b0,up,.05,.05,12,fz),ring(b1,up,.045,.03,12,fz)],U.cap,true,true)}
 // 배트
 if(J.batK){sphere(F,J.batK,.018,'#c08a4b',1,1,1,null,null,2);limb(F,J.batK,V.lerp(J.batK,J.batT,.45),.012,.014,'#c08a4b',20,null,6);limb(F,V.lerp(J.batK,J.batT,.45),J.batT,.016,.03,'#c99a5a',24,null,10,.0);sphere(F,J.batT,.03,'#c99a5a',1,1,.5,null,null,2)}
 return F}

return{buildPlayer,V,UNIS}})();
