"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/locale";
import { countries, resolveCountries } from "@/lib/travel/countries";
import { getTravelMapCopy, regionFilterKey } from "@/lib/travel/copy";

interface Geometry {
  type: string;
  coordinates: unknown;
}

interface Feature {
  type: string;
  properties?: Record<string, unknown>;
  id?: string;
  geometry: Geometry;
}

interface TravelMapProps {
  initialLocale: Locale;
}

const GEOJSON_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const LAND = "#EAE8E0";
const STROKE = "#1B3BE0";
const AVAILABLE = "#A8B2EC";
const SELECTED = "#1B3BE0";
const MAP_BG = "#F3F2ED";

function project(point: number[]): [number, number] {
  return [(point[0] + 180) * (900 / 360), (90 - point[1]) * (450 / 180)];
}

function ringPath(ring: number[][]) {
  return (
    ring
      .map((p, i) => {
        const [x, y] = project(p);
        return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

function featurePath(geometry: Geometry): string {
  if (geometry.type === "Polygon") return (geometry.coordinates as number[][][]).map(ringPath).join(" ");
  if (geometry.type === "MultiPolygon")
    return (geometry.coordinates as number[][][][]).flatMap((p) => p.map(ringPath)).join(" ");
  return "";
}

const aliases: Record<string, string> = {
  Japan: "JPN",
  "United States of America": "USA",
  USA: "USA",
  France: "FRA",
  Thailand: "THA",
  Australia: "AUS",
  Taiwan: "TWN",
  Singapore: "SGP",
  "United Kingdom": "GBR",
  "New Zealand": "NZL",
  Canada: "CAN",
};

function countryCode(feature: Feature): string {
  const p = feature.properties || {};
  const code = String(p.iso_a3 || p.ISO_A3 || p.adm0_a3 || feature.id || "");
  if (countries.some((c) => c.code === code)) return code;
  return aliases[String(p.name || p.NAME || "")] || "";
}

export function TravelMap({ initialLocale }: TravelMapProps) {
  const locale = initialLocale;
  const copy = getTravelMapCopy(locale);
  const localized = useMemo(() => resolveCountries(locale), [locale]);
  const [selectedCode, setSelectedCode] = useState(localized[0]?.code || "JPN");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<string>(copy.regions[0]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setRegion(getTravelMapCopy(locale).regions[0]);
    setSearch("");
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(GEOJSON_URL, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Map unavailable");
        return r.json();
      })
      .then((json: { features?: Feature[] }) => setFeatures(json.features || []))
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      });
    return () => controller.abort();
  }, []);

  const selected = localized.find((c) => c.code === selectedCode) || localized[0];

  const filtered = useMemo(() => {
    const key = regionFilterKey(locale, region);
    const q = search.trim().toLowerCase();
    return localized.filter((c) => {
      const raw = countries.find((item) => item.code === c.code);
      const regionMatch = key === "all" || raw?.region.en === key;
      const searchMatch = !q || `${c.name} ${c.nameEn} ${c.code}`.toLowerCase().includes(q);
      return regionMatch && searchMatch;
    });
  }, [localized, locale, region, search]);

  return (
    <div className="travel-map">
      <div className="travel-map-kicker">{copy.kicker}</div>

      <div className="travel-map-hero">
        <h1 className="travel-map-title">
          MAP
          <br />
          {copy.titleLine}
        </h1>
        <p className="travel-map-intro">{copy.intro}</p>
      </div>

      <div className="travel-map-filters">
        <label className="travel-map-search">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label={copy.searchLabel}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchPlaceholder}
          />
        </label>
        <label className="travel-map-region">
          <span className="sr-only">{copy.regionLabel}</span>
          <select aria-label={copy.regionLabel} value={region} onChange={(e) => setRegion(e.target.value)}>
            {copy.regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <span aria-hidden="true">↓</span>
        </label>
      </div>

      <div className="travel-map-body">
        <div className="travel-map-stage">
          <div className="travel-map-meta">
            <span>{copy.mapHint}</span>
            <span className="travel-map-legend">
              <span>
                <i style={{ background: AVAILABLE }} />
                {copy.legendAvailable}
              </span>
              <span>
                <i style={{ background: SELECTED }} />
                {copy.legendSelected}
              </span>
            </span>
          </div>

          <div className="travel-map-frame">
            <svg viewBox="0 0 900 450" role="img" aria-label={copy.mapAria}>
              <rect width="900" height="450" fill={MAP_BG} />
              {features.map((feature, i) => {
                const code = countryCode(feature);
                const active = code === selected.code;
                const available = localized.some((c) => c.code === code);
                return (
                  <path
                    key={i}
                    d={featurePath(feature.geometry)}
                    fill={active ? SELECTED : available ? AVAILABLE : LAND}
                    stroke={STROKE}
                    strokeWidth="0.5"
                    fillRule="evenodd"
                    className={available ? "is-clickable" : undefined}
                    onClick={() => {
                      if (available) setSelectedCode(code);
                    }}
                  >
                    {available ? <title>{localized.find((c) => c.code === code)?.name}</title> : null}
                  </path>
                );
              })}
              {features.length === 0 ? (
                <text x="450" y="230" textAnchor="middle" fill="#7d8be6" fontSize="18">
                  {loadError ? copy.loadError : copy.loading}
                </text>
              ) : null}
            </svg>
          </div>

          <div className="travel-map-chips">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                className={selected.code === c.code ? "is-active" : undefined}
                aria-pressed={selected.code === c.code}
                onClick={() => setSelectedCode(c.code)}
              >
                {c.flag} {c.name}
              </button>
            ))}
            {filtered.length === 0 ? <span className="travel-map-empty">{copy.empty}</span> : null}
          </div>
        </div>

        <aside className="travel-map-aside" aria-live="polite">
          <div className="travel-map-aside-hero">
            <span className="travel-map-aside-kicker">
              {copy.guideLabel} · {selected.region}
            </span>
            <h2>{selected.name}</h2>
            <p>
              {selected.nameEn.toUpperCase()} {selected.flag}
            </p>
          </div>

          <div className="travel-map-aside-block">
            <span>{copy.entry}</span>
            <p>{selected.entry}</p>
          </div>
          <div className="travel-map-aside-block">
            <span>{copy.prep}</span>
            <p>{selected.preparation}</p>
          </div>
          <div className="travel-map-aside-block travel-map-aside-links">
            <span>{copy.official}</span>
            {selected.official.map((o) => (
              <a key={o.url} href={o.url} target="_blank" rel="noopener noreferrer">
                <span>{o.label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <p className="travel-map-disclaimer">{copy.disclaimer}</p>
        </aside>
      </div>
    </div>
  );
}
