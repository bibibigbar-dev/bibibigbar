"use client";

import { useState } from "react";

export function CircusStage() {
  const [lightsOn, setLightsOn] = useState(false);

  return (
    <div className={`circus-stage${lightsOn ? " lights-on" : ""}`}>
      <div className="stage-caption"><span>THE BIBIBIGBAR CIRCUS</span><span>EST. NOW</span></div>
      <div className="stage-art">
        <svg viewBox="0 0 520 510" role="img" aria-labelledby="circus-title">
          <title id="circus-title">별과 달 아래 펼쳐진 빨간 줄무늬 서커스 텐트</title>
          <defs>
            <pattern id="tent-stripes" width="66" height="220" patternUnits="userSpaceOnUse">
              <rect width="66" height="220" fill="#f7ecd2" />
              <rect width="33" height="220" fill="#c24332" />
            </pattern>
            <pattern id="roof-stripes" width="1" height="1" patternContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="#f7ecd2" />
              <path d="M.5 0 0 1H.18L.5 0 .35 1H.52L.5 0 .7 1H.87L.5 0 1 1V.8Z" fill="#c24332" />
            </pattern>
          </defs>
          <g fill="#e8b954">
            <path d="m81 111 5 12 13 1-10 9 3 13-11-7-12 7 3-13-10-9 14-1Z" />
            <path d="m436 169 4 9 10 1-8 7 2 10-8-5-9 5 2-10-8-7 11-1Z" />
            <path d="M407 63a28 28 0 1 0 27 39 24 24 0 0 1-27-39Z" />
            <circle cx="133" cy="61" r="2" /><circle cx="350" cy="49" r="2" />
            <circle cx="471" cy="262" r="2" /><circle cx="51" cy="252" r="2" />
          </g>
          <g stroke="#f7ecd2" strokeWidth="1.5" fill="none">
            <path d="M172 125v14m-7-7h14M364 130v12m-6-6h12M52 188v10m-5-5h10M463 116v10m-5-5h10" />
            <path d="M51 220Q260 300 469 220" opacity=".45" />
          </g>
          <g fill="#e8b954">
            <path d="m68 228 15 5-12 14Zm39 12 15 4-10 15Zm40 9 15 3-9 15Zm211 0 15-3-6 18Zm41-9 15-4-5 19Zm39-11 15-5-3 19Z" />
          </g>
          <ellipse cx="261" cy="448" rx="208" ry="19" fill="#102e33" />
          <g className="stage-light-beams" fill="#f7d577" opacity=".14">
            <path d="M260 181 52 442h180Z" /><path d="m260 181 28 261h180Z" />
          </g>
          <path d="M260 105v81" stroke="#e8b954" strokeWidth="4" />
          <path d="M262 107c22-16 39 13 63-1v34c-23 12-42-16-63-1Z" fill="#c24332" />
          <path d="M117 301h286v138H117Z" fill="url(#tent-stripes)" stroke="#f7ecd2" strokeWidth="2" />
          <path d="M260 181C220 236 167 264 87 304h346c-81-40-133-68-173-123Z" fill="url(#roof-stripes)" stroke="#f7ecd2" strokeWidth="2" strokeLinejoin="round" />
          <path d="M87 304h346v13q-17 27-35 0-17 27-35 0-17 27-35 0-17 27-35 0-17 27-35 0-17 27-35 0-17 27-35 0-17 27-35 0-17 27-35 0-17 27-31 0Z" fill="#c24332" stroke="#f7ecd2" strokeWidth="2" />
          <path d="M216 439V365a44 44 0 0 1 88 0v74Z" fill="#173d42" stroke="#e8b954" strokeWidth="3" />
          <path d="M219 352q15 38 3 84h-24l17-70Zm82 0q-15 38-3 84h24l-17-70Z" fill="#c24332" />
          <path d="M260 350v87" stroke="#e8b954" strokeDasharray="3 6" opacity=".5" />
          <path d="M105 441h310" stroke="#e8b954" strokeWidth="5" />
          <g fill="#e8b954">
            <circle cx="124" cy="305" r="3" /><circle cx="158" cy="305" r="3" /><circle cx="192" cy="305" r="3" /><circle cx="226" cy="305" r="3" /><circle cx="260" cy="305" r="3" /><circle cx="294" cy="305" r="3" /><circle cx="328" cy="305" r="3" /><circle cx="362" cy="305" r="3" /><circle cx="396" cy="305" r="3" />
          </g>
          <path d="m117 325-44 112m330-112 44 112" stroke="#f7ecd2" opacity=".6" />
          <path d="M73 431v13m374-13v13" stroke="#e8b954" strokeWidth="3" />
          <g className="stage-twinkles" fill="#f7d577">
            <path d="m184 187 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" />
            <path d="m350 209 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
            <path d="m260 388 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" />
          </g>
        </svg>
        <div className="stage-seal" aria-hidden="true"><span>COME AS<br />YOU ARE</span><b>✷</b></div>
      </div>
      <div className="stage-bottom">
        <span aria-live="polite">{lightsOn ? "THE SHOW IS YOURS. ENJOY!" : "A LITTLE WONDER AWAITS INSIDE"}</span>
        <button type="button" onClick={() => setLightsOn(!lightsOn)} aria-pressed={lightsOn}>
          <span aria-hidden="true">{lightsOn ? "☀" : "✧"}</span> {lightsOn ? "조명 끄기" : "조명 켜기"}
        </button>
      </div>
    </div>
  );
}
