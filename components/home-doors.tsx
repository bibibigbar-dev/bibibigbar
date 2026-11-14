"use client";

import Link from "next/link";
import { useEffect, useState, type FocusEvent, type MouseEvent } from "react";

export interface HomeDoorItem {
  index: string;
  title: string;
  copy: string;
  href: string;
  external: boolean;
  soon?: boolean;
  previewKey?: "blog";
}

export interface HomePreviewPost {
  title: string;
  coverImageUrl: string;
  href: string;
}

interface HomeDoorsProps {
  doors: HomeDoorItem[];
  soonLabel: string;
  blogPreview: HomePreviewPost | null;
}

export function HomeDoors({ doors, soonLabel, blogPreview }: HomeDoorsProps) {
  const [activeKey, setActiveKey] = useState<"blog" | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!activeKey) {
      setIsVisible(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, [activeKey]);

  function onEnter(key: HomeDoorItem["previewKey"], event: MouseEvent) {
    if (!key) return;
    if (key === "blog" && !blogPreview) return;
    setActiveKey(key);
    setPointer({ x: event.clientX, y: event.clientY });
  }

  function onMove(event: MouseEvent) {
    if (!activeKey) return;
    setPointer({ x: event.clientX, y: event.clientY });
  }

  function onLeave() {
    setActiveKey(null);
  }

  const preview = activeKey === "blog" ? blogPreview : null;

  return (
    <div className="home-doors" onMouseMove={onMove}>
      {doors.map((door) => {
        const inner = (
          <>
            <span className="home-door-index">{door.index}</span>
            <span className="home-door-title">{door.title}</span>
            <span className="home-door-copy">{door.copy}</span>
            {door.soon ? (
              <span className="home-door-soon">{soonLabel}</span>
            ) : (
              <span className="home-door-soon line-arrow">{"\u2197\uFE0E"}</span>
            )}
          </>
        );

        const shared = {
          className: "home-door",
          onMouseEnter: (event: MouseEvent) => onEnter(door.previewKey, event),
          onMouseLeave: onLeave,
          onFocus: (_event: FocusEvent) => {
            if (door.previewKey === "blog" && blogPreview) setActiveKey("blog");
          },
          onBlur: onLeave,
        };

        if (door.external) {
          return (
            <a key={door.index} href={door.href} {...shared}>
              {inner}
            </a>
          );
        }

        return (
          <Link key={door.index} href={door.href} {...shared}>
            {inner}
          </Link>
        );
      })}

      {preview ? (
        <div
          className={`home-preview ${isVisible ? "is-visible" : ""}`}
          style={{
            left: pointer.x,
            top: pointer.y,
          }}
          aria-hidden="true"
        >
          <div className="home-preview-card">
            {preview.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.coverImageUrl} alt="" />
            ) : (
              <span>latest post</span>
            )}
            <p>{preview.title}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
