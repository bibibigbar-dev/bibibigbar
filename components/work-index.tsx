"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface WorkProject {
  slug: string;
  index: string;
  title: string;
  type: string;
  filter: string;
  year: string;
  clickable: boolean;
}

interface WorkIndexProps {
  title: string;
  subtitle: string;
  years: string;
  filters: readonly string[];
  columns: { no: string; project: string; type: string; year: string };
  empty: string;
  projects: readonly WorkProject[];
}

export function WorkIndex({ title, subtitle, years, filters, columns, empty, projects }: WorkIndexProps) {
  const [active, setActive] = useState(filters[0]);
  const allLabel = filters[0];

  const visible = useMemo(() => {
    if (active === allLabel) return projects;
    return projects.filter((project) => project.filter === active);
  }, [active, allLabel, projects]);

  return (
    <div className="work-page">
      <div className="work-hero">
        <h1>{title}</h1>
        <div className="work-hero-meta">
          <span>{subtitle}</span>
          <span>{years}</span>
        </div>
      </div>

      <div className="work-filters" role="tablist" aria-label={columns.type}>
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={active === filter}
            className={active === filter ? "is-active" : undefined}
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="work-table-head">
        <span>{columns.no}</span>
        <span>{columns.project}</span>
        <span>{columns.type}</span>
        <span>{columns.year}</span>
      </div>

      {visible.map((project) => {
        const cells = (
          <>
            <span className="work-row-no">{project.index}</span>
            <span className="work-row-title">{project.title}</span>
            <span className="work-row-type">{project.type}</span>
            <span className="work-row-year">{project.year}</span>
          </>
        );
        if (!project.clickable) {
          return (
            <div key={project.slug} className="work-row is-static">
              {cells}
            </div>
          );
        }
        return (
          <Link key={project.slug} href={`/work/${project.slug}`} className="work-row">
            {cells}
          </Link>
        );
      })}

      {visible.length === 0 ? <p className="work-empty">{empty}</p> : null}
    </div>
  );
}
