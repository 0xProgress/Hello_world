import { ImageResponse } from 'next/og';
import { person } from '@/content/profile';
import { getAllPostsMeta } from '@/lib/posts';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export async function generateStaticParams() {
  return getAllPostsMeta({ includeUnlisted: true }).map((post) => ({
    slug: post.slug,
  }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getAllPostsMeta({ includeUnlisted: true }).find(
    (p) => p.slug === slug
  );

  const title = post?.title ?? 'Engineering Note';
  const description = post?.description ?? person.metaDescription;
  const date = post?.date ?? '';
  const readingTime = post?.readingTime ?? '';
  const tags = post?.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0c0b0a',
          color: '#fafaf9',
          padding: '64px',
          fontFamily: 'sans-serif',
          border: '1px solid #26221f',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#c084fc',
          }}
        >
          <span>~/{person.handle}/writing</span>
          <span style={{ color: '#928b82' }}>
            {date} {readingTime ? `· ${readingTime}` : ''}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#fafaf9',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.45,
              color: '#b6b0a8',
              maxWidth: '95%',
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #26221f',
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: '#141210',
                  border: '1px solid #39332e',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 20,
                  color: '#c084fc',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 22, color: '#928b82' }}>{person.name}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
