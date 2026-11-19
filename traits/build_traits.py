# 특성 CSV(신규특성명, 효과, 보유 선수) → 게임에 넣을 특성 JSON(보유 선수를 게임 속 정확한 이름으로 해석)
# 사용: python3 build_traits.py traits.csv names.json overrides.json > traits.json
# names.json: 게임 DB의 선수 이름 목록(등록 선수 포함), overrides.json: {"exclude": ["'89 박병호"], "alias": {"피트크로우암스트롱": "피트크로암스트롱"}}
import csv, json, re, sys

def norm(s): return re.sub(r"[\s\-·.'’‘]", "", s)
def lev(a, b):
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (ca != cb))
    return d[-1]

def split_name(nm):
    m = re.match(r"^'(\d{2}) (.+)$", nm)
    return (m.group(1), m.group(2)) if m else (None, nm)

def parse_holder(h):
    h = h.strip()
    m = re.match(r"^'?(\d{2})\s*'?\s*(\D.*)$", h)
    if m: return m.group(1), norm(m.group(2))
    return None, norm(h.lstrip("'"))

def build(csv_path, names, ov):
    rows = [r for r in csv.reader(open(csv_path, encoding='utf-8-sig'))]
    hdr, rows = rows[0], [r for r in rows[1:] if r and r[0].strip()]
    excl, alias = set(ov.get('exclude', [])), {norm(k): norm(v) for k, v in ov.get('alias', {}).items()}
    out, report = [], []
    for r in rows:
        name, desc, holders = r[0].strip(), r[1].strip(), [x for x in r[2].split(',') if x.strip()]
        got = []
        for h in holders:
            y, n = parse_holder(h); n = alias.get(n, n)
            hits = [nm for nm in names if norm(split_name(nm)[1]) == n and (y is None or split_name(nm)[0] == y)]
            how = 'exact'
            if not hits and len(n) >= 5:  # 표기 차이(한 글자) 허용
                hits = [nm for nm in names if (y is None or split_name(nm)[0] == y) and lev(norm(split_name(nm)[1]), n) <= 1]; how = 'fuzzy'
            dropped = [x for x in hits if x in excl]; hits = [x for x in hits if x not in excl]
            report.append({'trait': name, 'holder': h.strip(), 'match': hits, 'how': how if hits else 'none', 'excluded': dropped})
            for x in hits:
                if x not in got: got.append(x)
        out.append({'name': name, 'desc': desc, 'holders': got})
    return out, report

if __name__ == '__main__':
    names = json.load(open(sys.argv[2], encoding='utf-8'))
    ov = json.load(open(sys.argv[3], encoding='utf-8')) if len(sys.argv) > 3 else {}
    out, rep = build(sys.argv[1], names, ov)
    json.dump({'traits': out, 'report': rep}, sys.stdout, ensure_ascii=False, indent=1)
