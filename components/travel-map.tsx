"use client";

import { useEffect, useMemo, useState } from "react";
import { countries, type Country } from "@/lib/travel/countries";

type Geometry = { type: string; coordinates: unknown };
type Feature = { type: string; properties?: Record<string, unknown>; id?: string; geometry: Geometry };
const GEOJSON_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

function project(point: number[]): [number, number] {
  return [(point[0] + 180) * (900 / 360), (90 - point[1]) * (450 / 180)];
}
function ringPath(ring: number[][]) {
  return ring.map((p, i) => {
    const [x,y] = project(p);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";
}
function featurePath(geometry: Geometry): string {
  if (geometry.type === "Polygon") return (geometry.coordinates as number[][][]).map(ringPath).join(" ");
  if (geometry.type === "MultiPolygon") return (geometry.coordinates as number[][][][]).flatMap(p => p.map(ringPath)).join(" ");
  return "";
}
const aliases: Record<string,string> = {
  Japan:"JPN", "United States of America":"USA", USA:"USA", France:"FRA",
  Thailand:"THA", Australia:"AUS", Taiwan:"TWN", Singapore:"SGP",
  "United Kingdom":"GBR", "New Zealand":"NZL", Canada:"CAN",
};
function countryCode(feature: Feature): string {
  const p = feature.properties || {};
  const code = String(p.iso_a3 || p.ISO_A3 || p.adm0_a3 || feature.id || "");
  if (countries.some(c => c.code === code)) return code;
  return aliases[String(p.name || p.NAME || "")] || "";
}

export function TravelMap() {
  const [selected, setSelected] = useState<Country>(countries[0]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("전체");
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch(GEOJSON_URL, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("Map unavailable"); return r.json(); })
      .then((json: { features?: Feature[] }) => setFeatures(json.features || []))
      .catch(() => { if (!controller.signal.aborted) setLoadError(true); });
    return () => controller.abort();
  }, []);
  const filtered = useMemo(() => countries.filter(c =>
    (region === "전체" || c.region === region) &&
    (`${c.name} ${c.code}`.toLowerCase().includes(search.trim().toLowerCase()))
  ), [search, region]);
  return (
    <div style={{maxWidth:1180,margin:"0 auto",padding:"clamp(24px,5vw,64px) 20px 90px",color:"#203C53"}}>
      <div style={{fontSize:12,fontWeight:800,letterSpacing:3,color:"#2B83B4",marginBottom:12}}>BIBIBIGBAR · TRAVEL GUIDE</div>
      <h1 style={{fontSize:"clamp(30px,5vw,52px)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.15}}>세계 여행 정보 지도</h1>
      <p style={{marginTop:14,color:"#667D8B",lineHeight:1.8}}>국가를 선택해 입국 준비 정보와 공식 안내 사이트를 확인하세요. 한국 여권의 일반 관광 여행을 중심으로 정리했습니다.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,margin:"28px 0 20px"}}>
        <input aria-label="국가 검색" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔎 국가 검색 (예: 일본)"
          style={{flex:"1 1 230px",border:"1px solid #C9DDE5",borderRadius:14,padding:"13px 16px",background:"#fff",color:"#203C53"}}/>
        <select aria-label="지역 필터" value={region} onChange={e=>setRegion(e.target.value)}
          style={{border:"1px solid #C9DDE5",borderRadius:14,padding:"12px 16px",background:"#fff",color:"#203C53"}}>
          {["전체","아시아","유럽","북미","오세아니아"].map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,420px),1fr))",gap:20,alignItems:"start"}}>
        <div style={{background:"#E8F3F7",borderRadius:22,padding:"20px 12px",border:"1px solid #D6E8ED"}}>
          <div style={{fontSize:12,color:"#547D8C",margin:"0 12px 12px"}}>지도의 국가를 클릭하거나 아래 목록에서 선택하세요</div>
          <svg viewBox="0 0 900 450" role="img" aria-label="국가 선택이 가능한 세계 지도" style={{width:"100%",height:"auto",display:"block"}}>
            <rect width="900" height="450" rx="14" fill="#E8F3F7"/>
            {features.map((feature,i)=>{
              const code=countryCode(feature);
              const active=code===selected.code;
              const available=countries.some(c=>c.code===code);
              return <path key={i} d={featurePath(feature.geometry)} fill={active?"#F3C951":available?"#75B5C4":"#B8D5C8"}
                stroke="#E8F3F7" strokeWidth="0.75" fillRule="evenodd"
                style={{cursor:available?"pointer":"default",transition:"fill .15s"}}
                onClick={()=>{const match=countries.find(c=>c.code===code);if(match)setSelected(match);}}>
                {available?<title>{countries.find(c=>c.code===code)?.name}</title>:null}
              </path>;
            })}
            {features.length===0?<text x="450" y="220" textAnchor="middle" fill="#547D8C" fontSize="22">{loadError?"지도 불러오기 실패 · 아래 국가 목록을 이용하세요":"세계지도를 불러오는 중..."}</text>:null}
          </svg>
          <p style={{fontSize:12,color:"#547D8C",padding:"0 12px"}}>파란색: 정보 제공 국가 · 노란색: 선택 국가</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,padding:"18px 10px 8px"}}>
            {filtered.map(c=><button key={c.code} type="button" onClick={()=>setSelected(c)}
              aria-pressed={selected.code===c.code}
              style={{border:selected.code===c.code?"2px solid #D9A728":"1px solid #C5DDE5",borderRadius:24,padding:"9px 13px",background:selected.code===c.code?"#FFF0B9":"#fff",color:"#254D62",cursor:"pointer",fontWeight:700}}>
              {c.flag} {c.name}</button>)}
            {filtered.length===0?<span style={{padding:12}}>검색 결과가 없습니다.</span>:null}
          </div>
        </div>
        <section aria-live="polite" style={{background:"#fff",border:"1px solid #D8E6EC",borderRadius:22,padding:"clamp(22px,4vw,36px)",boxShadow:"0 12px 36px rgba(31,76,94,.06)"}}>
          <div style={{fontSize:12,fontWeight:800,color:"#3982A1",letterSpacing:1}}>COUNTRY GUIDE · {selected.region}</div>
          <h2 style={{fontSize:32,fontWeight:900,margin:"12px 0 20px"}}>{selected.flag} {selected.name}</h2>
          <div style={{padding:"18px 0",borderTop:"1px solid #E4EDF0"}}>
            <h3 style={{fontWeight:800,marginBottom:8}}>🛂 입국 정보</h3><p style={{lineHeight:1.8,color:"#536E7D"}}>{selected.entry}</p>
          </div>
          <div style={{padding:"18px 0",borderTop:"1px solid #E4EDF0"}}>
            <h3 style={{fontWeight:800,marginBottom:8}}>🧳 여행 준비</h3><p style={{lineHeight:1.8,color:"#536E7D"}}>{selected.preparation}</p>
          </div>
          <div style={{padding:"18px 0",borderTop:"1px solid #E4EDF0"}}>
            <h3 style={{fontWeight:800,marginBottom:10}}>🔗 공식 정보 확인</h3>
            {selected.official.map(o=><a key={o.url} href={o.url} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-block",background:"#246F9A",color:"#fff",borderRadius:12,padding:"12px 18px",fontWeight:700,textDecoration:"none",margin:"0 8px 8px 0"}}>{o.label} ↗</a>)}
          </div>
          <div style={{background:"#F2F7F8",padding:16,borderRadius:12,fontSize:13,color:"#627A86",lineHeight:1.7}}>
            이 페이지는 여행 준비를 돕는 요약 안내이며 실시간 입국 심사·여행경보를 제공하지 않습니다. 규정은 수시로 바뀔 수 있으므로 예약·출발 전 반드시 공식 기관에서 최신 조건을 확인하세요.
          </div>
        </section>
      </div>
    </div>
  );
}
