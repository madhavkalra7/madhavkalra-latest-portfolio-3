import type { CSSProperties } from 'react';
import { useBehaviors, usePageStyles } from '../../lib/hooks';
import css from './graphic-designer.css?inline';
import { behaviors } from './behaviors';
import { WORLDS } from './data';

export default function GraphicDesignerPage() {
  usePageStyles(css);
  useBehaviors(...behaviors);
  return (
    <>
      <title>Freelance Graphic Designer — Madhav Kalra</title>
      <meta name="description" content="Brand identity, social media creatives, posters and logo design. Freelance graphic designer working remotely with clients in the US, UK and worldwide." />
      <link rel="canonical" href="https://www.madhavkalra.dev/graphic-designer/" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="author" content="Madhav Kalra" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Madhav Kalra" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content="https://www.madhavkalra.dev/graphic-designer/" />
      <meta property="og:title" content="Freelance Graphic Designer — Madhav Kalra" />
      <meta property="og:description" content="Brand identity, social media creatives, posters and logo design. Freelance graphic designer working remotely with clients in the US, UK and worldwide." />
      <meta property="og:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:secure_url" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Madhav Kalra's portfolio" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Freelance Graphic Designer — Madhav Kalra" />
      <meta name="twitter:description" content="Brand identity, social media creatives, posters and logo design. Freelance graphic designer working remotely with clients in the US, UK and worldwide." />
      <meta name="twitter:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Person\",\"@id\":\"https://www.madhavkalra.dev/#madhav\",\"name\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"jobTitle\":\"Agentic AI Developer\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"description\":\"AI-focused Computer Science undergraduate building Generative AI and Agentic AI systems, RAG pipelines and AI-powered web apps, plus Android games.\",\"knowsAbout\":[\"Agentic AI\",\"Generative AI\",\"Retrieval Augmented Generation (RAG)\",\"LLM integration\",\"Prompt engineering\",\"Web development\",\"React\",\"Next.js\",\"FastAPI\",\"Node.js\",\"Android games\"],\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Ambala\",\"addressRegion\":\"Haryana\",\"addressCountry\":\"IN\"},\"knowsLanguage\":[\"en\"],\"worksFor\":{\"@id\":\"https://www.madhavkalra.dev/#org\"},\"alumniOf\":{\"@type\":\"CollegeOrUniversity\",\"name\":\"Chitkara University\"},\"email\":\"madhavkalra2005@gmail.com\",\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"Organization\",\"@id\":\"https://www.madhavkalra.dev/#org\",\"name\":\"Madhav Kalra — Design & Development\",\"alternateName\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://www.madhavkalra.dev/icon-512.png\",\"width\":512,\"height\":512},\"founder\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"email\":\"madhavkalra2005@gmail.com\",\"contactPoint\":{\"@type\":\"ContactPoint\",\"contactType\":\"sales\",\"email\":\"madhavkalra2005@gmail.com\",\"availableLanguage\":\"en\",\"areaServed\":\"Worldwide\"},\"description\":\"AI-powered web development, Agentic AI systems, app and game development, UI/UX and graphic design.\",\"areaServed\":\"Worldwide\",\"hasOfferCatalog\":{\"@type\":\"OfferCatalog\",\"name\":\"Services\",\"itemListElement\":[{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Web development\",\"description\":\"AI-powered websites and web applications built end to end.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"App development\",\"description\":\"Android apps and games, from first idea to a playable build.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"UI/UX design\",\"description\":\"Product and interface design: user flows, wireframes and finished UI.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Graphic design\",\"description\":\"Brand identity, social media creatives, posters and logos.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Photography\",\"description\":\"Portrait, event and street photography.\"}}]},\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"WebSite\",\"@id\":\"https://www.madhavkalra.dev/#site\",\"url\":\"https://www.madhavkalra.dev\",\"name\":\"Madhav Kalra — Portfolio\",\"publisher\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"inLanguage\":\"en\"},{\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://www.madhavkalra.dev/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Freelance Graphic Designer\",\"item\":\"https://www.madhavkalra.dev/graphic-designer/\"}]}]}" }} />
    <div className="glow" aria-hidden="true" />
    <header className="rn" id="rn">
      <div className="rn__in">
        <nav aria-label="Primary">
          <ul>
            <li><button data-nav="home">Home</button></li>
            <li><button data-nav="door:0">Web Development</button></li>
            <li><button data-nav="door:1">App Development</button></li>
            <li><button data-nav="door:2">UI/UX Design</button></li>
            <li><button data-nav="door:3" aria-current="page">Graphic Design</button></li>
            <li><button data-nav="about">My story</button></li>
            <li><button data-nav="contact">Contact</button></li>
          </ul>
        </nav>
        <div className="rn__clock" aria-label="Local time">
          <span>Local time</span>
          <b data-ftime="">—</b>
          <span className="d">•</span>
          <span className="d" data-fdate="" />
        </div>
        <button className="rn__menu" id="rnMenu" aria-expanded="false" aria-controls="rnPanel">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span>Menu</span>
        </button>
      </div>
      <div className="rn__panel" id="rnPanel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="rn__phead">
          <span className="rn__plbl">Menu</span>
          {' '}
          <button className="rn__pclose" id="rnClose" aria-label="Close menu">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="rn__plist">
          <button data-nav="home">Home</button>
          <button data-nav="door:0">Web Development</button>
          <button data-nav="door:1">App Development</button>
          <button data-nav="door:2">UI/UX Design</button>
          <button data-nav="door:3" aria-current="page">Graphic Design</button>
          <button data-nav="about">My story</button>
          <button data-nav="contact">Contact</button>
        </div>
        <p className="rn__pfoot">Madhav Kalra — available for new work<br />Replies within 5 hours</p>
      </div>
    </header>
    <main>
      <div className="wrap">
        <div className="top"><a className="chip" href="/#works">← Back to the doors</a></div>
        <section className="intro">
          <h1>Graphic Design</h1>
          <p>
            Brand campaigns, social media creatives, posters and logos. Each brand hangs on its own line, in its own colours: scroll to walk along it, click any print to see it up close.
          </p>
          <span className="how"><i />Scroll to walk the line</span>
        </section>
      </div>
      <section className="worlds" id="worlds" aria-label="Graphic design work">
        {/*pre*/}
        {WORLDS.map((w, wi) => (
          <section key={w.k} className="world" data-k={w.k} data-i={wi} style={{ '--wbg': w.bg, '--wfg': w.fg, '--wacc': w.acc } as CSSProperties} aria-label={w.label}>
            <div className="pin">
              <header className="w-head">
                <p className="w-kicker"><span>{String(wi + 1).padStart(2, '0')}</span><i /><span>{w.kicker}</span></p>
                <h2 className="w-name">{w.name.pre}{w.name.em && <em>{w.name.em}</em>}</h2>
                <div><p className="w-desc">{w.desc}</p><ul className="w-tags">{w.tags.map((t) => <li key={t}>{t}</li>)}</ul></div>
              </header>
              <div className="line"><div className="track">
                {w.items.map((it, ii) => (
                  <figure key={ii} className={'print' + (it.deck ? ' deck' : '') + (it.dark ? ' dark' : '')} data-ii={ii} style={{ '--ar': String(it.w / it.h) } as CSSProperties}>
                    <span className="peg" aria-hidden="true" />
                    {' '}
                    <button className="paper" aria-label={`Open ${it.title || w.label} ${ii + 1}`}><img src={it.f} alt="" loading={wi < 1 ? 'eager' : 'lazy'} decoding="async" width={it.w} height={it.h} />{it.deck && <span className="badge">{`Carousel · ${it.deck.length} slides`}</span>}</button>
                  </figure>
                ))}
              </div></div>
              <div className="w-foot"><div className="w-bar"><i /></div><span className="w-hint">{wi === 0 ? 'Scroll →' : w.label}</span></div>
            </div>
          </section>
        ))}
        {/*/pre*/}
      </section>
    </main>
    <div className="sfw">
      <footer className="sf" id="contact-footer" aria-labelledby="sfTitle">
        <div className="sf__in">
          <p className="sf__eye"><i />Available for new work</p>
          <h2 className="sf__h" id="sfTitle">Need something built?<span>Let's make it happen.</span></h2>
          <p className="sf__p">
            I'm available for freelance work and internships: AI-powered web apps, agentic AI workflows and apps. Tell me what you need and I'll get back to you within a day.
          </p>
          <div className="sf__cta">
            <button className="sf__btn" data-nav="contact">
              Hire me{' '}
              <b>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </b>
            </button>
          </div>
          <div className="sf__cols">
            <div>
              <h3>Work</h3>
              <ul className="work">
                <li><a href="/web-developer/" data-nav="door:0">Web Development</a></li>
                <li><a href="/app-developer/" data-nav="door:1">App Development</a></li>
                <li><a href="/ui-ux-designer/" data-nav="door:2">UI/UX Design</a></li>
                <li><a href="/graphic-designer/" data-nav="door:3">Graphic Design</a></li>
                <li><a href="/photographer/" data-nav="door:4">Photography</a></li>
              </ul>
            </div>
            <div>
              <h3>Navigate</h3>
              <ul>
                <li><a href="/" data-nav="home">Home</a></li>
                <li><a href="/#about" data-nav="about">My story</a></li>
                <li><button data-nav="contact">Contact</button></li>
                <li><a href="https://github.com/madhavkalra7" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/madhav-kalra" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://www.instagram.com/madhavkalra._" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="/cv/madhav-kalra-resume.pdf" target="_blank" rel="noopener">Download CV</a></li>
              </ul>
            </div>
            <div>
              <h3>Status</h3>
              <ul>
                <li className="st">Available for work</li>
                <li className="st">Ambala, India · remote worldwide</li>
                <li className="st">Local time{' '}<span data-ftime="">—</span></li>
              </ul>
            </div>
          </div>
          <div className="sf__bot">
            <span>©{' '}<span data-fyear="">2026</span>{' '}Madhav Kalra. Designed and built by Madhav.</span>
            <span className="sf__legal"><a href="/legal/" target="_top">Privacy &amp; credits</a></span>
            <button data-nav="top">Back to top ↑</button>
          </div>
        </div>
      </footer>
    </div>
    <button className="totop" data-nav="top" aria-label="Back to top">
      <svg className="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /></svg>
      <svg className="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      <span className="lbl">Back to top</span>
    </button>
    <div className="lb" id="lb" role="dialog" aria-modal="true" aria-label="Design viewer" hidden>
      <div className="lb__top">
        <p className="lb__t" id="lbT" />
        <button className="lb__x" id="lbX" aria-label="Close">×</button>
      </div>
      <div className="lb__stage">
        <button className="lb__nav prev" id="lbP" aria-label="Previous">←</button>
        <img id="lbI" alt="" />
        <button className="lb__nav next" id="lbN" aria-label="Next">→</button>
      </div>
      <div className="lb__dots" id="lbD" />
    </div>
    <div className="ck" id="ck" role="region" aria-label="Analytics choice" hidden>
      <p>May I count your visit with Google Analytics? It sets cookies.{' '}<a href="/legal/">Details</a></p>
      <div><button type="button" data-ck="no">No thanks</button><button type="button" data-ck="yes">Allow</button></div>
    </div>
    </>
  );
}
