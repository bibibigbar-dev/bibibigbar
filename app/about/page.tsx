import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/get-locale";
import { getSiteCopy } from "@/lib/site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getSiteCopy(locale).about;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  };
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const copy = getSiteCopy(locale).about;

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>{copy.title}</h1>
        <div className="about-portrait" aria-hidden="true">
          {copy.portrait}
        </div>
      </div>

      <div className="about-hello">
        <span>{copy.hello}</span>
        <p>{copy.body}</p>
      </div>

      <div className="about-resume-head">
        <span>{copy.resume}</span>
        <span className="about-pdf is-disabled" aria-disabled="true">
          {copy.downloadPdf}
        </span>
      </div>

      <div className="about-timeline">
        {copy.timeline.map((item) => (
          <div key={`${item.period}-${item.role}`} className="about-timeline-row">
            <span>{item.period}</span>
            <strong>{item.role}</strong>
            <span>{item.detail}</span>
          </div>
        ))}
      </div>

      <div className="about-tools">
        <span>{copy.tools}</span>
        <div className="about-skills">
          {copy.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="about-channels">
        {copy.channels.map((channel) => (
          <a
            key={channel.title}
            href={channel.href}
            className="about-channel"
            target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={channel.href.startsWith("mailto:") ? undefined : "noreferrer"}
          >
            <span>{channel.label}</span>
            <strong>{channel.title}</strong>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
