import type { Metadata } from "next";
import { WorkIndex } from "@/components/work-index";
import { getRequestLocale } from "@/lib/get-locale";
import { getSiteCopy } from "@/lib/site-copy";
import { getWorkListItem, workProjects } from "@/lib/work-projects";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getSiteCopy(locale).work;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  };
}

export default async function WorkPage() {
  const locale = await getRequestLocale();
  const copy = getSiteCopy(locale).work;
  const projects = workProjects.map((project) => getWorkListItem(project, locale));

  return (
    <WorkIndex
      title={copy.title}
      subtitle={copy.subtitle}
      years={copy.years}
      filters={copy.filters}
      columns={copy.columns}
      empty={copy.empty}
      projects={projects}
    />
  );
}
