import { person, projects } from "@/content/profile";
import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  const name = project?.name ?? "Open Source Project";
  const summary = project?.summary ?? person.metaDescription;
  const status = project?.status ?? "active";
  const tags = project?.tags ?? [];
  const language = project?.programmingLanguage ?? "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0c0b0a",
        color: "#fafaf9",
        padding: "64px",
        fontFamily: "sans-serif",
        border: "1px solid #26221f",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#c084fc",
        }}
      >
        <span>~/{person.handle}/projects</span>
        <span
          style={{
            backgroundColor: "rgba(74, 222, 128, 0.14)",
            color: "#4ade80",
            borderRadius: 999,
            padding: "6px 18px",
            fontSize: 20,
          }}
        >
          ● {status}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#fafaf9",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.45,
            color: "#b6b0a8",
            maxWidth: "94%",
          }}
        >
          {summary}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #26221f",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: "#141210",
                border: "1px solid #39332e",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 20,
                color: "#c084fc",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 22, color: "#928b82" }}>
          {language ? `${language} · ` : ""}
          {person.name}
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
