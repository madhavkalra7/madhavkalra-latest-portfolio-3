import type { CSSProperties } from 'react';
import { useBehaviors, usePageStyles } from '../../lib/hooks';
import css from './app-developer.css?inline';
import { behaviors } from './behaviors';
import { PROJECTS } from './data';

/* the little pieces of the card template (original page script: ARROW, SIG, WIFI, BATT) */
const ARROW = <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>;
const SIG = <svg aria-hidden="true" focusable="false" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>;
const WIFI = <svg aria-hidden="true" focusable="false" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .7 3.2L2 4.6a8.7 8.7 0 0 1 6-2.4Zm0 3.8c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.7 1.8l1.3 1.4C5.5 6.5 6.7 6 8 6Zm0 3.7c-.6 0-1.1.2-1.5.6L8 12l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z" /></svg>;
const BATT = <svg aria-hidden="true" focusable="false" viewBox="0 0 27 12" fill="none"><rect x=".5" y=".5" width="22" height="11" rx="3.2" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor" /><path d="M24.5 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45" /></svg>;

export default function AppDeveloperPage() {
  usePageStyles(css);
  useBehaviors(...behaviors);
  return (
    <>
      <title>App and Game Developer — Madhav Kalra</title>
      <meta name="description" content="Android games by Madhav Kalra, built for immersive gameplay, strategy and offline fun: Single Pointer 3D, Raja Rani Chor Sipahi and 2 Player Games." />
      <link rel="canonical" href="https://www.madhavkalra.dev/app-developer/" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="author" content="Madhav Kalra" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Madhav Kalra" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content="https://www.madhavkalra.dev/app-developer/" />
      <meta property="og:title" content="App and Game Developer — Madhav Kalra" />
      <meta property="og:description" content="Android games by Madhav Kalra, built for immersive gameplay, strategy and offline fun: Single Pointer 3D, Raja Rani Chor Sipahi and 2 Player Games." />
      <meta property="og:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:secure_url" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Madhav Kalra's portfolio" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="App and Game Developer — Madhav Kalra" />
      <meta name="twitter:description" content="Android games by Madhav Kalra, built for immersive gameplay, strategy and offline fun: Single Pointer 3D, Raja Rani Chor Sipahi and 2 Player Games." />
      <meta name="twitter:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Person\",\"@id\":\"https://www.madhavkalra.dev/#madhav\",\"name\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"jobTitle\":\"Agentic AI Developer\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"description\":\"AI-focused Computer Science undergraduate building Generative AI and Agentic AI systems, RAG pipelines and AI-powered web apps, plus Android games.\",\"knowsAbout\":[\"Agentic AI\",\"Generative AI\",\"Retrieval Augmented Generation (RAG)\",\"LLM integration\",\"Prompt engineering\",\"Web development\",\"React\",\"Next.js\",\"FastAPI\",\"Node.js\",\"Android games\"],\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Ambala\",\"addressRegion\":\"Haryana\",\"addressCountry\":\"IN\"},\"knowsLanguage\":[\"en\"],\"worksFor\":{\"@id\":\"https://www.madhavkalra.dev/#org\"},\"alumniOf\":{\"@type\":\"CollegeOrUniversity\",\"name\":\"Chitkara University\"},\"email\":\"madhavkalra2005@gmail.com\",\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"Organization\",\"@id\":\"https://www.madhavkalra.dev/#org\",\"name\":\"Madhav Kalra — Design & Development\",\"alternateName\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://www.madhavkalra.dev/icon-512.png\",\"width\":512,\"height\":512},\"founder\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"email\":\"madhavkalra2005@gmail.com\",\"contactPoint\":{\"@type\":\"ContactPoint\",\"contactType\":\"sales\",\"email\":\"madhavkalra2005@gmail.com\",\"availableLanguage\":\"en\",\"areaServed\":\"Worldwide\"},\"description\":\"AI-powered web development, Agentic AI systems, app and game development, UI/UX and graphic design.\",\"areaServed\":\"Worldwide\",\"hasOfferCatalog\":{\"@type\":\"OfferCatalog\",\"name\":\"Services\",\"itemListElement\":[{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Web development\",\"description\":\"AI-powered websites and web applications built end to end.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"App development\",\"description\":\"Android apps and games, from first idea to a playable build.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"UI/UX design\",\"description\":\"Product and interface design: user flows, wireframes and finished UI.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Graphic design\",\"description\":\"Brand identity, social media creatives, posters and logos.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Photography\",\"description\":\"Portrait, event and street photography.\"}}]},\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"WebSite\",\"@id\":\"https://www.madhavkalra.dev/#site\",\"url\":\"https://www.madhavkalra.dev\",\"name\":\"Madhav Kalra — Portfolio\",\"publisher\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"inLanguage\":\"en\"},{\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://www.madhavkalra.dev/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Freelance iOS App Developer\",\"item\":\"https://www.madhavkalra.dev/app-developer/\"}]}]}" }} />
    <div className="glow" aria-hidden="true" />
    <header className="rn" id="rn">
      <div className="rn__in">
        <nav aria-label="Primary">
          <ul>
            <li><button data-nav="home">Home</button></li>
            <li><button data-nav="door:0">Web Development</button></li>
            <li><button data-nav="door:1" aria-current="page">App Development</button></li>
            <li><button data-nav="door:2">UI/UX Design</button></li>
            <li><button data-nav="door:3">Graphic Design</button></li>
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
          <button data-nav="door:1" aria-current="page">App Development</button>
          <button data-nav="door:2">UI/UX Design</button>
          <button data-nav="door:3">Graphic Design</button>
          <button data-nav="about">My story</button>
          <button data-nav="contact">Contact</button>
        </div>
        <p className="rn__pfoot">Madhav Kalra — available for new work<br />Replies within 5 hours</p>
      </div>
    </header>
    <main className="wrap">
      <div className="top"><a className="chip" href="/#works">← Back to the doors</a></div>
      <section className="intro">
        <h1>App Development</h1>
        <div>
          <p>
            Premium Android games, built for immersive gameplay, strategy and offline fun: from a 3D precision game to classic party games for friends on a single device.
          </p>
        </div>
      </section>
      <section className="stack" id="stack" aria-label="Projects">
        {/*pre*/}
        {PROJECTS.map((p, i) => (
          <article key={i} className={'card' + (i % 2 ? ' flip' : '')} style={{ '--i': String(i) } as CSSProperties} aria-labelledby={`p${i}`}>
            <div className="card__in">
              <div className="card__info">
                <div className="app"><p className="card__meta"><span>{p.kind}</span></p></div>
                <h2 id={`p${i}`}>{p.title}</h2>
                <p className="sub">{p.sub}</p>
                <p className="desc">{p.desc}</p>
                <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                <a className="live" href={p.url} target="_blank" rel="noopener noreferrer">Download APK {ARROW}</a>
              </div>
              <div className="stage" aria-hidden="true">
                <div className="phone"><div className="phone__body">
                  <i className="phone__btn l" style={{ top: '19%', height: '4%' }} /><i className="phone__btn l" style={{ top: '26%', height: '7.5%' }} /><i className="phone__btn l" style={{ top: '35%', height: '7.5%' }} /><i className="phone__btn r" style={{ top: '28%', height: '11%' }} />
                  <div className="phone__screen" style={{ backgroundImage: `url(${p.lqip})` }}>
                    <img className="shot" src={p.shot} alt={`${p.title}: screenshot`} decoding="async" loading={i < 1 ? 'eager' : 'lazy'} />
                    <div className="sbar"><span>9:41</span><span>{SIG}{WIFI}{BATT}</span></div><div className="island" />
                  </div>
                </div></div>
              </div>
            </div>
            <div className="card__dim" />
          </article>
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
    <div className="ck" id="ck" role="region" aria-label="Analytics choice" hidden>
      <p>May I count your visit with Google Analytics? It sets cookies.{' '}<a href="/legal/">Details</a></p>
      <div><button type="button" data-ck="no">No thanks</button><button type="button" data-ck="yes">Allow</button></div>
    </div>
    </>
  );
}
