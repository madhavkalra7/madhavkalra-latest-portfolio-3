import type { CSSProperties } from 'react';

/**
 * One project in a room's stack of cards (web-developer and ui-ux-designer share the same card markup and behaviour;
 * only their PROJECTS differ). Asset URLs are root-absolute (`/web-developer/genetix.webp`).
 */
export interface Project {
  kind: string;
  title: string;
  sub: string;
  desc: string;
  tags: string[];
  /** live site: shows a "Visit live site" link instead of the note */
  url?: string;
  /** caption when there is no live site (default 'Screen recording of the build') */
  note?: string;
  /** screen recording + its poster */
  video?: string;
  poster?: string;
  /** recording's (or a single-viewport screenshot's) aspect ratio, e.g. '1917 / 923' (the screen takes that shape) */
  ar?: string;
  /** recording's background colour (default '#000') and object-fit (default 'contain') */
  bg?: string;
  fit?: CSSProperties['objectFit'];
  /** full-page screenshot that scrolls itself on the screen (when there is no video) */
  shot?: string;
}

const Arrow = () => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
);

/** The stacked project cards, the same DOM the original 01 script's template produced (and pre-rendered). */
export function ProjectCards({ projects }: { projects: Project[] }) {
  return (
    <>
      {projects.map((p, i) => (
        <article key={i} className={'card' + (i % 2 ? ' flip' : '')} style={{ '--i': String(i) } as CSSProperties} aria-labelledby={`p${i}`}>
          <div className="card__in">
            <div className="card__info">
              <p className="card__meta"><span>{p.kind}</span></p>
              <h2 id={`p${i}`}>{p.title}</h2>
              <p className="sub">{p.sub}</p>
              <p className="desc">{p.desc}</p>
              <ul className="tags">{p.tags.map((t, k) => <li key={k}>{t}</li>)}</ul>
              {p.url
                ? <a className="live" href={p.url} target="_blank" rel="noopener noreferrer">Visit live site <Arrow /></a>
                : <span className="note">{p.note || 'Screen recording of the build'}</span>}
            </div>
            <div className="stage" aria-hidden="true">
              <div className="mon">
                <div className="mon__body">
                  <div className={'mon__screen' + (p.ar ? ' vid' : '')} style={p.ar ? ({ '--ar': p.ar } as CSSProperties) : undefined}>
                    {p.video
                      ? <video muted loop playsInline preload="metadata" poster={p.poster} src={p.video} style={{ background: p.bg || '#000', objectFit: p.fit || 'contain' }} />
                      : <img className="page" src={p.shot} alt={`${p.title}: full-page screenshot`} decoding="async" loading={i < 1 ? 'eager' : 'lazy'} />}
                  </div>
                </div>
                <div className="mon__neck" />
                <div className="mon__foot" />
              </div>
            </div>
          </div>
          <div className="card__dim" />
        </article>
      ))}
    </>
  );
}
