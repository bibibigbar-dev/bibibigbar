"use client";

import { useState } from "react";

interface PostShareProps {
  url: string;
  title: string;
  shareLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

export function PostShare({ url, title, shareLabel, copyLabel, copiedLabel }: PostShareProps) {
  const [copied, setCopied] = useState(false);
  const text = `${title} ${url}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="post-share">
      <span>{shareLabel}</span>
      <button type="button" onClick={copyLink}>
        {copied ? copiedLabel : copyLabel}
      </button>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
        X
      </a>
      <a href={`https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
        Threads
      </a>
    </div>
  );
}
