import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Apps and websites by bibibigbar. The project list is still being collected.",
};

const projects = [
  { index: "01", title: "Project index", meta: "Coming soon" },
  { index: "02", title: "Apps", meta: "iOS / Android" },
  { index: "03", title: "Websites", meta: "Next.js" },
];

export default function WorkPage() {
  return (
    <div className="container page-hero">
      <p className="page-kicker">Work · soon</p>
      <h1>Apps and websites.</h1>
      <p className="mt-8 max-w-2xl text-xl leading-relaxed">
        The project list is not ready yet. This page will hold the things I have built.
      </p>
      <div className="soon-list mt-12">
        {projects.map((project) => (
          <div key={project.index} className="soon-row">
            <span className="soon-index">{project.index}</span>
            <span>{project.title}</span>
            <span className="home-door-soon">{project.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
