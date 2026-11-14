import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppPrivacy } from "@/lib/app-privacy";
import { getRequestLocale } from "@/lib/get-locale";

interface PrivacyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const copy = getAppPrivacy(slug, locale);
  if (!copy) return { title: "Privacy Policy" };
  return {
    title: `${copy.title} · ${copy.kicker}`,
    description: copy.intro[0],
  };
}

export default async function WorkPrivacyPage({ params }: PrivacyPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const copy = getAppPrivacy(slug, locale);
  if (!copy) notFound();

  return (
    <div className="privacy-page">
      <div className="privacy-nav">
        <Link href={`/work/${slug}`}>{copy.back}</Link>
      </div>

      <header className="privacy-hero">
        <p className="privacy-kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <p>{copy.updated}</p>
        <p>{copy.effective}</p>
      </header>

      <div className="privacy-body">
        {copy.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {copy.sections.map((section) => (
          <section key={section.title} className="privacy-section">
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.subsections?.map((sub) => (
              <div key={sub.title} className="privacy-sub">
                <h3>{sub.title}</h3>
                {sub.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {sub.bullets ? (
                  <ul>
                    {sub.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            {section.table ? (
              <div className="privacy-table-wrap">
                <table className="privacy-table">
                  <thead>
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join("-")}>
                        {row.map((cell, index) => (
                          <td key={`${row[0]}-${index}`}>
                            {cell.startsWith("http") ? (
                              <a href={cell} target="_blank" rel="noreferrer">
                                {cell.replace(/^https?:\/\//, "")}
                              </a>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
