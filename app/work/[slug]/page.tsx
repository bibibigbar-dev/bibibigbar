import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestLocale } from "@/lib/get-locale";
import { getWorkDetailCopy, getWorkProject, workProjects } from "@/lib/work-projects";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return workProjects.filter((project) => project.clickable !== false).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) return { title: "Work" };
  const locale = await getRequestLocale();
  return {
    title: project.fullName[locale],
    description: project.overview[locale],
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project || project.clickable === false) notFound();

  const locale = await getRequestLocale();
  const copy = getWorkDetailCopy(locale);
  const clickableProjects = workProjects.filter((item) => item.clickable !== false);
  const index = clickableProjects.findIndex((item) => item.slug === project.slug);
  const next = clickableProjects[(index + 1) % clickableProjects.length];
  const ctaIsExternal = Boolean(project.cta?.href.startsWith("http"));

  return (
    <div className="work-detail">
      <div className="work-detail-nav">
        <Link href="/work">{copy.back}</Link>
        <span>
          {project.index} / {String(workProjects.length).padStart(2, "0")}
        </span>
      </div>

      <h1 className="work-detail-title">{project.title}</h1>
      <p className="work-detail-fullname">{project.fullName[locale]}</p>

      <div className="work-detail-facts">
        <div>
          <span>{copy.role}</span>
          <strong>{project.role[locale]}</strong>
        </div>
        <div>
          <span>{copy.stack}</span>
          <strong>{project.stack}</strong>
        </div>
        {project.year ? (
          <div>
            <span>{copy.year}</span>
            <strong>{project.year}</strong>
          </div>
        ) : null}
        {project.cta ? (
          ctaIsExternal ? (
            <a href={project.cta.href} target="_blank" rel="noreferrer" className="work-detail-cta">
              <span>Live</span>
              <strong>{project.cta.label[locale]}</strong>
            </a>
          ) : (
            <Link href={project.cta.href} className="work-detail-cta">
              <span>Live</span>
              <strong>{project.cta.label[locale]}</strong>
            </Link>
          )
        ) : (
          <div className="work-detail-cta is-muted">
            <span>Live</span>
            <strong>—</strong>
          </div>
        )}
      </div>

      <div className="work-detail-overview">
        <span>{copy.overview}</span>
        <p>{project.overview[locale]}</p>
      </div>

      {project.privacyHref ? (
        <div className="work-detail-actions">
          <Link href={project.privacyHref} className="work-detail-privacy">
            {copy.privacy}
          </Link>
        </div>
      ) : null}

      <div className="work-detail-hero">
        {project.heroImage ? (
          <Image src={project.heroImage} alt={project.fullName[locale]} width={1920} height={820} className="work-detail-hero-img" />
        ) : (
          <div className="work-detail-placeholder">{copy.screenshot}</div>
        )}
      </div>

      <div className="work-detail-screens">
        {(project.screens && project.screens.length > 0
          ? project.screens
          : [null, null, null]
        ).map((src, i) =>
          src ? (
            <div key={src} className="work-detail-screen">
              <Image src={src} alt={`${project.fullName[locale]} screen ${i + 1}`} width={780} height={1688} />
            </div>
          ) : (
            <div key={`ph-${i}`} className="work-detail-screen is-empty">
              {copy.mobile}
            </div>
          ),
        )}
      </div>

      <Link href={`/work/${next.slug}`} className="work-detail-next">
        <span>{copy.next}</span>
        <strong>{next.title}</strong>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
