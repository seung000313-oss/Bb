# 투구·타격 50프레임 모션 생성: 단계별 바이오메카닉 키(시간·관절각) → 스플라인 보간 → 순기구학(팔)·역기구학(다리, 타자 팔)
import json, math
import numpy as np
H=1.0  # 신장 정규화
L=dict(thigh=.245,shank=.25,ankle=.04,hipw=.09,trunk=.30,neck=.06,head=.11,shw=.13,uarm=.17,farm=.15,hand=.05)
def unit(v):n=np.linalg.norm(v);return v/n if n>1e-9 else v
def rot(v,axis,ang):
    k=unit(np.array(axis,float));v=np.array(v,float);c,s=math.cos(ang),math.sin(ang)
    return v*c+np.cross(k,v)*s+k*np.dot(k,v)*(1-c)
def ik2(a,t,l1,l2,pole):
    # a: 고관절/어깨, t: 목표(발목/손), pole: 무릎·팔꿈치가 향할 방향
    d=t-a;D=np.linalg.norm(d);D=min(D,(l1+l2)*0.97);d=unit(d)
    x=(l1*l1-l2*l2+D*D)/(2*D);h=math.sqrt(max(l1*l1-x*x,0))
    p=unit(pole-np.dot(pole,d)*d);return a+d*x+p*h, a+d*D
def trunkFrame(yaw,fwd,lat):
    f=np.array([0,0,1.]);u=np.array([0,1.,0]);l=np.array([1.,0,0])  # 가슴·위·왼쪽
    u=rot(u,f,-lat);l=rot(l,f,-lat)                # 측굴(+: 왼쪽=글러브 쪽으로)
    f2=rot(f,l,fwd);u=rot(u,l,fwd);f=f2           # 전굴(+: 앞으로 숙임)
    Y=np.array([0,1.,0]);return rot(f,Y,yaw),rot(u,Y,yaw),rot(l,Y,yaw)
def spline(keys,t):
    # keys: [(t, dict)] / 각 값 Catmull-Rom (경계 클램프)
    ts=[k[0] for k in keys]
    if t<=ts[0]:return dict(keys[0][1])
    if t>=ts[-1]:return dict(keys[-1][1])
    i=max(j for j in range(len(ts)-1) if ts[j]<=t)
    t0,t1=ts[i],ts[i+1];u=(t-t0)/(t1-t0);P=[keys[max(0,i-1)][1],keys[i][1],keys[i+1][1],keys[min(len(keys)-1,i+2)][1]]
    T=[keys[max(0,i-1)][0],t0,t1,keys[min(len(keys)-1,i+2)][0]]
    o={}
    for k in P[1]:
        a,b,c,d=[np.array(p.get(k,P[1][k]),float) for p in P]
        # 비균일 간격 보정 Catmull-Rom (기울기 = 인접 구간 평균 속도)
        m1=(c-a)/max(T[2]-T[0],1e-6)*(t1-t0);m2=(d-b)/max(T[3]-T[1],1e-6)*(t1-t0)
        h00=2*u**3-3*u**2+1;h10=u**3-2*u**2+u;h01=-2*u**3+3*u**2;h11=u**3-u**2
        o[k]=(h00*b+h10*m1+h01*c+h11*m2).tolist()
    return o
D=math.radians
def pose_pitch(p,arm):
    # 우투 기준. arm: 'over'|'side'|'under'
    J={}
    pel=np.array(p['pel']);Y=np.array([0,1.,0])
    pf,pu,pl=trunkFrame(D(p['pyaw']),0,0)
    J['hipL']=pel+pl*L['hipw'];J['hipR']=pel-pl*L['hipw']
    tf,tu,tl=trunkFrame(D(p['tyaw']),D(p['tfwd']),D(p['tlat']))
    neck=pel+tu*L['trunk'];J['pel']=pel;J['neck']=neck;J['head']=neck+tu*(L['neck']+L['head']*.6)+tf*.02
    J['shL']=neck+tl*L['shw']-tu*.02;J['shR']=neck-tl*L['shw']-tu*.02
    # 다리: 발 목표 + 무릎은 진행 방향
    for s,ft,pole in (('L',p['ftL'],p['kpL']),('R',p['ftR'],p['kpR'])):
        ank=np.array(ft)+Y*L['ankle'];kn,an=ik2(J['hip'+s],ank,L['thigh'],L['shank'],np.array(pole,float))
        J['kn'+s]=kn;J['an'+s]=an;J['toe'+s]=an+unit(np.array(p.get('fd'+s,[0,0,1]),float))*.09-Y*.03
    # 던지는 팔(오른팔): 외전 ab, 수평외전 hab, 외회전 er, 팔꿈치 굴곡 fl
    R=-tl;ab,hab,er,fl=[D(p[k]) for k in ('ab','hab','er','fl')]
    u=-math.cos(ab)*tu+math.sin(ab)*(math.cos(hab)*R-math.sin(hab)*tf)
    w0=unit(tf-np.dot(tf,u)*u);w=rot(w0,u,-er) if np.dot(rot(w0,u,-D(90)),tu)>0 else rot(w0,u,er)
    el=J['shR']+u*L['uarm'];fa=unit(math.cos(D(180)-(D(180)-fl))*u+math.sin(fl)*w) if False else unit(math.cos(fl)*u+math.sin(fl)*w)
    J['elR']=el;J['haR']=el+fa*(L['farm']+L['hand']*.5)
    # 글러브 팔: 목표점 IK
    gt=np.array(p['glove']);el2,ha2=ik2(J['shL'],gt,L['uarm'],L['farm']+L['hand']*.5,np.array(p.get('gp',[.5,-1,0]),float))
    J['elL']=el2;J['haL']=ha2
    return J
def mirror(J):
    o={}
    for k,v in J.items():
        k2=k[:-1]+{'L':'R','R':'L'}[k[-1]] if k[-1] in 'LR' and k not in ('pel',) else k
        o[k2]=np.array([-v[0],v[1],v[2]])
    return o
# ---------- 투구 키프레임 (볼 릴리스 t=0, 단위 초) ----------
def pitch_keys(arm):
    S=dict(over=dict(lat=26,ab=100,rel_fwd=34,ply=.47,low=0,stride=.86),side=dict(lat=2,ab=96,rel_fwd=26,ply=.45,low=0,stride=.84),under=dict(lat=-28,ab=74,rel_fwd=52,ply=.38,low=.06,stride=.92))[arm]
    st=S['stride'];py=S['ply']
    base=dict(pel=[0,.53,0],pyaw=0,tyaw=0,tfwd=4,tlat=0,ftL=[.11,0,0],ftR=[-.11,0,0],kpL=[0,0,1],kpR=[0,0,1],fdL=[0,0,1],fdR=[0,0,1],ab=12,hab=-20,er=20,fl=95,glove=[.02,0.75,.16])
    def K(**kw):d=dict(base);d.update(kw);return d
    keys=[
     (-1.30,K(gp=[0.6, -1, -0.1],)),
     (-1.12,K(gp=[0.6, -1, -0.1],pel=[0,.53,-.03],ftR=[-.10,0,.02],fdR=[1,0,.2],glove=[.0,0.762,.14])),                                  # 축발을 투수판에 붙임
     (-0.98,K(gp=[0.4, -1, -0.4],pel=[0,.535,-.01],pyaw=-60,tyaw=-60,ftL=[.08,.05,.02],ftR=[-.02,0,.02],fdR=[1,0,0],kpL=[-1,0,.3],glove=[-.03,0.756,.1])),   # 회전 시작
     (-0.75,K(gp=[0.2, -1, -0.6],pel=[0,.55,-.02],pyaw=-92,tyaw=-95,tfwd=-4,ftL=[.02,.34,.0],ftR=[0,0,0],kpL=[-1,.4,.2],kpR=[-.6,0,.8],fdR=[1,0,0],fdL=[-1,0,0],glove=[-.05,0.708,.0],ab=10,hab=-35)),  # 레그킥 정점
     (-0.52,K(gp=[0.3, -1, -0.2],pel=[0,.53,.10],pyaw=-95,tyaw=-98,tfwd=-2,ftL=[.0,.22,.26],ftR=[0,0,0],kpL=[0,.3,1],kpR=[-.6,0,.8],fdR=[1,0,0],glove=[-.05,0.672,.08],ab=20,hab=-30)),           # 하강·전진 시작
     (-0.34,K(gp=[0.5, -0.5, 0.6],pel=[0,py+.02,.24],pyaw=-92,tyaw=-100,tfwd=0,ftL=[.0,.10,.52],ftR=[0,0,.02],kpL=[0,0,1],kpR=[-.6,-.2,.8],fdR=[1,0,0],glove=[.08,0.69,.45],ab=55,hab=40,er=-20,fl=40)), # 손 분리
     (-0.145,K(gp=[0.6, -0.7, 0.4],pel=[0,py,.42],pyaw=-62,tyaw=-92,tfwd=4,tlat=S['lat']*.4,ftL=[-.02,0,st],ftR=[-.02,.02,.10],kpL=[0,0,1],kpR=[.4,-.3,1],fdR=[1,0,.4],fdL=[-.2,0,1],glove=[.12,0.768,.78],ab=S['ab']-8,hab=30,er=55,fl=92)), # 앞발 착지(FC)
     (-0.10,K(gp=[0.8, -0.7, 0.1],pel=[0,py-.01,.48],pyaw=-35,tyaw=-75,tfwd=8,tlat=S['lat']*.6,ftL=[-.02,0,st],ftR=[-.02,.04,.18],kpL=[0,.2,1],kpR=[.5,-.3,1],fdR=[.7,-.3,.7],glove=[.18,0.708,.70],ab=S['ab']-4,hab=22,er=110,fl=92)),  # 골반 회전
     (-0.035,K(gp=[0.9, -0.6, -0.3],pel=[0,py-.02,.55],pyaw=-5,tyaw=-25,tfwd=18,tlat=S['lat'],ftL=[-.02,0,st],ftR=[-.04,.08,.26],kpL=[0,.2,1],kpR=[.4,-.2,1],fdR=[.3,-.6,.7],glove=[.20,.6-S['low'],.58],ab=S['ab'],hab=8,er=170,fl=90)),  # 최대 외회전(MER)
     (0.0,K(gp=[0.9, -0.7, -0.4],pel=[0,py-.02,.60],pyaw=8,tyaw=8,tfwd=S['rel_fwd'],tlat=S['lat'],ftL=[-.02,0,st],ftR=[-.05,.12,.30],kpL=[0,.2,1],kpR=[.3,-.2,1],fdR=[.1,-.8,.6],glove=[.20,.57-S['low'],.48],ab=S['ab'],hab=-8,er=95,fl=25)),   # 릴리스(BR)
     (0.05,K(gp=[0.8, -0.8, -0.3],pel=[0,py-.03,.64],pyaw=22,tyaw=28,tfwd=S['rel_fwd']+12,tlat=S['lat']*.6,ftL=[-.02,0,st],ftR=[-.06,.18,.34],kpL=[0,.2,1],kpR=[.2,-.3,1],glove=[.22,0.552,.40],ab=S['ab']-10,hab=-40,er=20,fl=30)),   # 최대 내회전
     (0.30,K(gp=[0.5, -1, 0],pel=[0,py-.04,.70],pyaw=35,tyaw=45,tfwd=S['rel_fwd']+22,tlat=0,ftL=[-.02,0,st],ftR=[-.10,.30,.40],kpL=[0,.2,1],kpR=[0,-.2,1],fdR=[0,-1,.2],glove=[.25,0.51,.45],ab=40,hab=-100,er=0,fl=50)),           # 팔로스루
     (0.65,K(gp=[0.5, -1, 0.2],pel=[0,.47,.74],pyaw=5,tyaw=5,tfwd=18,tlat=0,ftL=[.08,0,st],ftR=[-.22,0,st-.02],kpL=[.3,0,1],kpR=[-.3,0,1],fdR=[0,0,1],glove=[.10,0.57,.90],ab=30,hab=-60,er=0,fl=80))]                          # 수비 자세
    return keys
# 50프레임 시간 배분: 동작이 빠른 구간(FC→릴리스)에 촘촘히
def sample_pitch():
    seg=[(-1.30,-0.75,700),(-0.75,-0.145,600),(-0.145,0.0,500),(0.0,0.65,700)]
    ts=[]
    for a,b,n in seg:ts+= [a+(b-a)*i/n for i in range(n)]
    return ts[:2499]+[0.65]
PHASE_P=[(-1.30,'세트'),(-1.0,'피벗'),(-0.75,'레그킥 정점'),(-0.40,'스트라이드'),(-0.145,'앞발 착지'),(-0.07,'회전·코킹'),(-0.035,'최대 외회전'),(0.0,'릴리스'),(0.05,'감속'),(0.2,'팔로스루'),(0.5,'피니시')]
def phase(ts,P):
    o=P[0][1]
    for t,n in P:
        if ts>=t-1e-9:o=n
    return o
def J2list(J):return {k:[round(float(x),3) for x in v] for k,v in J.items()}
out={'meta':{'units':'신장=1.0, 좌표: x=1루쪽(+)/3루쪽(-) 아님—투수 기준 왼쪽(+), y=위, z=홈 방향','frames':500},'pitch':{},'bat':{}}
for arm in ('over','side','under'):
    keys=pitch_keys(arm);frames=[]
    for t in sample_pitch():
        p=spline(keys,t);J=pose_pitch(p,arm);frames.append({'t':round(t,3),'phase':phase(t,PHASE_P),'R':J2list(J)})
    out['pitch'][arm]=frames
# ---------- 타격 (컨택 t=0). 우타 기준: 투수는 +z, 홈플레이트는 -x, 타자는 x=+0.75 ----------
def pose_bat(p):
    J={};Y=np.array([0,1.,0]);pel=np.array(p['pel'])
    pf,pu,pl=trunkFrame(D(p['pyaw']),0,0)
    J['pel']=pel;J['hipL']=pel+pl*L['hipw'];J['hipR']=pel-pl*L['hipw']
    tf,tu,tl=trunkFrame(D(p['tyaw']),D(p['tfwd']),D(p['tlat']))
    neck=pel+tu*L['trunk'];J['neck']=neck
    look=unit(np.array([0,0,1.])-tf*0)  # 머리는 투수(+z) 주시
    J['head']=neck+tu*(L['neck']+L['head']*.6)+np.array([0,0,.02])
    J['shL']=neck+tl*L['shw']-tu*.02;J['shR']=neck-tl*L['shw']-tu*.02
    for s,ft,pole in (('L',p['ftL'],p['kpL']),('R',p['ftR'],p['kpR'])):
        ank=np.array(ft)+Y*L['ankle'];kn,an=ik2(J['hip'+s],ank,L['thigh'],L['shank'],np.array(pole,float))
        J['kn'+s]=kn;J['an'+s]=an;J['toe'+s]=an+unit(np.array(p.get('fd'+s,[-1,0,0]),float))*.09-Y*.03
    g=np.array(p['grip'])
    for s,pole in (('L',p['epL']),('R',p['epR'])):
        bd0=unit(np.array(p['bat']));el,ha=ik2(J['sh'+s],g+(bd0*.035 if s=='R' else bd0*-.005),L['uarm'],L['farm']+L['hand']*.5,np.array(pole,float))
        J['el'+s]=el;J['ha'+s]=ha
    bd=unit(np.array(p['bat']));J['batK']=g-bd*.08;J['batT']=g+bd*.84*.5/.5*0.5  # 배트 길이 ≈ 0.47(신장 대비)
    J['batT']=g+bd*.47
    return J
def bat_keys():
    base=dict(pel=[.78,.52,-.02],pyaw=-92,tyaw=-96,tfwd=18,tlat=-4,ftL=[.80,0,.20],ftR=[.80,0,-.20],kpL=[-1,0,.2],kpR=[-1,0,-.2],fdL=[-1,0,.3],fdR=[-1,0,0],grip=[.74,0.799,-.18],epL=[0,-1,.3],epR=[.3,-1,-.2],bat=[.15,.75,-.65])
    def K(**kw):d=dict(base);d.update(kw);return d
    return [
     (-0.80,K(epL=[-0.2, -1, 0.4],epR=[0.3, -0.2, -1])),                                                                                                                        # 스탠스
     (-0.62,K(epL=[-0.2, -1, 0.4],epR=[0.3, -0.2, -1],grip=[.75,0.812,-.16],bat=[.05,.85,-.55])),                                                                                  # 리듬(배트 흔들기)
     (-0.46,K(epL=[-0.2, -1, 0.4],epR=[0.35, -0.1, -1],pel=[.79,.52,-.06],pyaw=-100,tyaw=-108,ftL=[.80,.05,.14],kpL=[-1,.2,.4],grip=[.78,0.799,-.26],bat=[.25,.70,-.68])),           # 로드(무게 뒤로, 손 뒤로)
     (-0.30,K(epL=[-0.2, -1, 0.4],epR=[0.35, -0.1, -1],pel=[.79,.51,-.02],pyaw=-100,tyaw=-110,ftL=[.80,.04,.30],kpL=[-1,.1,.6],grip=[.79,0.787,-.28],bat=[.30,.70,-.65])),           # 스트라이드
     (-0.15,K(epL=[-0.2, -1, 0.4],epR=[0.3, -0.3, -1],pel=[.78,.49,.04],pyaw=-88,tyaw=-108,tfwd=20,ftL=[.80,0,.40],fdL=[-.6,0,.8],kpL=[-1,0,.6],grip=[.79,0.775,-.26],bat=[.35,.80,-.48])),   # 앞발 착지
     (-0.09,K(epL=[-0.1, -1, 0.5],epR=[0.2, -1, -0.4],pel=[.77,.48,.07],pyaw=-55,tyaw=-90,tfwd=22,ftL=[.80,0,.40],ftR=[.80,.02,-.20],fdR=[-.7,0,.3],kpR=[-1,-.3,.4],grip=[.76,0.726,-.20],bat=[.55,.25,-.80])),  # 골반 선행 회전·배트 눕힘
     (-0.04,K(epL=[-0.3, -0.8, 0.6],epR=[0.1, -1, -0.2],pel=[.76,.48,.09],pyaw=-25,tyaw=-60,tfwd=24,tlat=-14,ftL=[.80,0,.40],ftR=[.80,.04,-.18],fdR=[-.4,-.4,.6],kpR=[-.6,-.6,.6],grip=[.64,0.615,-.04],bat=[.40,-.05,-.92])),  # 몸통 회전·배트 진입
     (0.0,K(epL=[0, -1, 0.3],epR=[0.2, -1, -0.2],pel=[.75,.48,.10],pyaw=-5,tyaw=-25,tfwd=24,tlat=-18,ftL=[.80,0,.40],ftR=[.80,.06,-.16],fdR=[-.2,-.6,.7],kpR=[-.4,-.7,.6],grip=[.52,0.566,.18],bat=[-.98,-.05,.20])),   # 컨택(앞 골반 앞)
     (0.06,K(epL=[0, -1, 0],epR=[0, -1, 0],pel=[.75,.48,.10],pyaw=5,tyaw=5,tfwd=22,tlat=-12,ftL=[.80,0,.40],ftR=[.79,.08,-.12],kpR=[-.3,-.7,.6],grip=[.50,0.603,.36],bat=[-.55,.15,.82])),   # 익스텐션
     (0.18,K(epL=[0.2, -1, 0.6],epR=[-0.2, -1, 0.5],pel=[.75,.49,.10],pyaw=15,tyaw=30,tfwd=14,tlat=-6,ftL=[.80,0,.40],ftR=[.78,.10,-.08],fdR=[0,-.8,.6],kpR=[-.2,-.8,.6],grip=[.66,0.799,.24],bat=[.35,.30,.88])),   # 롤오버·팔로스루
     (0.40,K(epL=[-0.1, 0.2, 1],epR=[-0.3, -0.2, 1],pel=[.75,.50,.10],pyaw=20,tyaw=45,tfwd=10,tlat=-4,ftL=[.80,0,.40],ftR=[.78,.10,-.06],fdR=[0,-.9,.4],kpR=[-.2,-.8,.6],grip=[.86,0.91,.04],bat=[.45,-.25,-.85]))]  # 피니시(배트가 등 뒤)
def sample_bat():
    seg=[(-0.80,-0.15,900),(-0.15,0.0,700),(0.0,0.40,900)];ts=[]
    for a,b,n in seg:ts+=[a+(b-a)*i/n for i in range(n)]
    return ts[:2499]+[0.40]
PHASE_B=[(-0.80,'스탠스'),(-0.55,'로드'),(-0.32,'스트라이드'),(-0.15,'앞발 착지'),(-0.09,'골반 회전'),(-0.04,'몸통 회전'),(0.0,'컨택'),(0.03,'익스텐션'),(0.12,'팔로스루'),(0.3,'피니시')]
keys=bat_keys();fr=[]
for t in sample_bat():
    p=spline(keys,t);J=pose_bat(p);fr.append({'t':round(t,3),'phase':phase(t,PHASE_B),'R':J2list(J)})
out['bat']['all']=fr
json.dump(out,open('motion50.json','w'),ensure_ascii=False,separators=(',',':'))
# 뼈 길이 검증
def bl(J,a,b):return np.linalg.norm(np.array(J[a])-np.array(J[b]))
for arm in out['pitch']:
    v=[bl(f['R'],'shR','elR') for f in out['pitch'][arm]]+[bl(f['R'],'hipL','knL') for f in out['pitch'][arm]]
    print(arm,'bone len range',round(min(v),3),round(max(v),3),'release hand y',out['pitch'][arm][[f['t'] for f in out['pitch'][arm]].index(0.0) if 0.0 in [f['t'] for f in out['pitch'][arm]] else 38]['R']['haR'])
print('bat contact grip',[f for f in out['bat']['all'] if abs(f['t'])<1e-6][0]['R']['batT'])
import os;print(os.path.getsize('motion50.json'))
