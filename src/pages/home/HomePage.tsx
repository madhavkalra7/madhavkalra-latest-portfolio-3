import type { CSSProperties } from 'react';
import { useBehaviors, usePageStyles } from '../../lib/hooks';
import css from './home.css?inline';
import { behaviors } from './behaviors';
import { NAV } from './data';

export default function HomePage() {
  usePageStyles(css);
  useBehaviors(...behaviors);
  return (
    <>
      <title>Madhav Kalra — Agentic AI Developer, Web &amp; App Developer</title>
      <meta name="description" content="Agentic AI and web developer building AI-powered web apps, RAG systems and Android games. Computer Science (AI) student at Chitkara University, based in Ambala, India. Replies within 5 hours." />
      <link rel="canonical" href="https://www.madhavkalra.dev/" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="author" content="Madhav Kalra" />
      <meta property="og:type" content="profile" />
      <meta property="og:site_name" content="Madhav Kalra" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content="https://www.madhavkalra.dev/" />
      <meta property="og:title" content={"Madhav Kalra — Agentic AI Developer, Web & App Developer"} />
      <meta property="og:description" content="Agentic AI and web developer building AI-powered web apps, RAG systems and Android games. Computer Science (AI) student at Chitkara University, based in Ambala, India. Replies within 5 hours." />
      <meta property="og:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:secure_url" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Madhav Kalra's portfolio" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={"Madhav Kalra — Agentic AI Developer, Web & App Developer"} />
      <meta name="twitter:description" content="Agentic AI and web developer building AI-powered web apps, RAG systems and Android games. Computer Science (AI) student at Chitkara University, based in Ambala, India. Replies within 5 hours." />
      <meta name="twitter:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Person\",\"@id\":\"https://www.madhavkalra.dev/#madhav\",\"name\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"jobTitle\":\"Agentic AI Developer\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"description\":\"AI-focused Computer Science undergraduate building Generative AI and Agentic AI systems, RAG pipelines and AI-powered web apps, plus Android games.\",\"knowsAbout\":[\"Agentic AI\",\"Generative AI\",\"Retrieval Augmented Generation (RAG)\",\"LLM integration\",\"Prompt engineering\",\"Web development\",\"React\",\"Next.js\",\"FastAPI\",\"Node.js\",\"Android games\"],\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Ambala\",\"addressRegion\":\"Haryana\",\"addressCountry\":\"IN\"},\"knowsLanguage\":[\"en\"],\"worksFor\":{\"@id\":\"https://www.madhavkalra.dev/#org\"},\"alumniOf\":{\"@type\":\"CollegeOrUniversity\",\"name\":\"Chitkara University\"},\"email\":\"madhavkalra2005@gmail.com\",\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"Organization\",\"@id\":\"https://www.madhavkalra.dev/#org\",\"name\":\"Madhav Kalra — Design & Development\",\"alternateName\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://www.madhavkalra.dev/icon-512.png\",\"width\":512,\"height\":512},\"founder\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"email\":\"madhavkalra2005@gmail.com\",\"contactPoint\":{\"@type\":\"ContactPoint\",\"contactType\":\"sales\",\"email\":\"madhavkalra2005@gmail.com\",\"availableLanguage\":\"en\",\"areaServed\":\"Worldwide\"},\"description\":\"AI-powered web development, Agentic AI systems, app and game development, UI/UX and graphic design.\",\"areaServed\":\"Worldwide\",\"hasOfferCatalog\":{\"@type\":\"OfferCatalog\",\"name\":\"Services\",\"itemListElement\":[{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Web development\",\"description\":\"AI-powered websites and web applications built end to end.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"App development\",\"description\":\"Android apps and games, from first idea to a playable build.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"UI/UX design\",\"description\":\"Product and interface design: user flows, wireframes and finished UI.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Graphic design\",\"description\":\"Brand identity, social media creatives, posters and logos.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Photography\",\"description\":\"Portrait, event and street photography.\"}}]},\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"WebSite\",\"@id\":\"https://www.madhavkalra.dev/#site\",\"url\":\"https://www.madhavkalra.dev\",\"name\":\"Madhav Kalra — Portfolio\",\"publisher\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"inLanguage\":\"en\"}]}" }} />
    <a className="skip" href="#main">Skip to content</a>
    {/* ============ PageLoader ============ */}
    <div className="loader" id="loader" aria-hidden="true">
      <div className="ld__bg" />
      <div className="ld__stack">
        <div className="ld__pill" style={{ "--k": "0", "--c": "#1F1C1C", "--t": "#E8E4E0", "--dir": "1" } as CSSProperties}><span>Madhav Kalra</span></div>
        <div className="ld__pill" style={{ "--k": "1", "--c": "#22304a", "--t": "#E8E4E0", "--dir": "-1" } as CSSProperties}><span>Web development</span></div>
        <div className="ld__pill" style={{ "--k": "2", "--c": "#4a3540", "--t": "#E8E4E0", "--dir": "1" } as CSSProperties}><span>App development</span></div>
        <div className="ld__pill" style={{ "--k": "3", "--c": "#7a8670", "--t": "#F3EEEC", "--dir": "-1" } as CSSProperties}><span>UI/UX design</span></div>
        <div className="ld__pill" style={{ "--k": "4", "--c": "#a4552c", "--t": "#F3EEEC", "--dir": "1" } as CSSProperties}><span>Graphic design</span></div>
        <div className="ld__pill" style={{ "--k": "5", "--c": "#C4B0B0", "--t": "#1A1818", "--dir": "-1" } as CSSProperties}><span>Photography</span></div>
      </div>
      <div className="ld__hud">
        <div className="ld__top"><span><b>Madhav Kalra</b>{' '}· Portfolio</span><span>Web · App · UI/UX · Graphic design</span></div>
        <div className="ld__bot">
          <p className="ld__num"><small>Opening up the work</small><span id="ldCount">000</span></p>
          <div className="ld__bar"><i /></div>
        </div>
      </div>
    </div>
    {/* ============ Header ============ */}
    <header className="hdr rv">
      <div className="shell hdr__in">
        <nav aria-label="Primary">
          <ul className="nav">
            <li><button data-go="home" aria-current="page"><span data-h="y 0 -2|o .8 1" data-hs="320 22" data-ht="button">Home</span></button></li>
            <li><button data-door="0"><span data-h="y 0 -2|o .8 1" data-hs="320 22" data-ht="button">Web Development</span></button></li>
            <li><button data-door="1"><span data-h="y 0 -2|o .8 1" data-hs="320 22" data-ht="button">App Development</span></button></li>
            <li><button data-door="2"><span data-h="y 0 -2|o .8 1" data-hs="320 22" data-ht="button">UI/UX Design</span></button></li>
            <li><button data-door="3"><span data-h="y 0 -2|o .8 1" data-hs="320 22" data-ht="button">Graphic Design</span></button></li>
            <li><button data-go="about"><span data-h="y 0 -2|o .8 1" data-hs="320 22" data-ht="button">My story</span></button></li>
            <li><button data-contact=""><span data-h="y 0 -2|o .8 1" data-hs="320 22" data-ht="button">Contact</span></button></li>
          </ul>
        </nav>
        <div className="hdr__right">
          <div className="chip clock" aria-label="Local time">
            <span className="clock__lbl">Local time</span>
            {' '}
            <span className="clock__time tnum" data-time="">9:41am</span>
            {' '}
            <span className="clock__sep" aria-hidden="true">•</span>
            {' '}
            <span className="clock__date" data-date="">12 March, 2025</span>
            <span className="clock__ds" data-dshort="">12 Mar</span>
          </div>
          <button className="chip menu-btn" id="menuBtn" style={{ minHeight: "44px", minWidth: "44px" }} aria-haspopup="dialog" aria-controls="navm" aria-label="Menu">
            <span data-h="s 1 1.05" data-hs="320 18" data-ht=".menu-btn">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span className="word">Menu</span>
            </span>
          </button>
        </div>
      </div>
    </header>
    {/* ============ Pull cord: light / dark switch ============ */}
    <div className="cord" id="cord">
      <canvas className="cord__cv" aria-hidden="true" />
      {' '}
      <button className="cord__hit" id="cordHit" role="switch" aria-checked="false" aria-label="Dark mode (pull the cord)" />
    </div>
    <main id="main">
      {/* ============ Hero ============ */}
      <section id="home" className="hero" aria-label="Introduction">
        <div className="hero__vig" aria-hidden="true" />
        <div className="hero__stage">
          <div className="fig" id="fig">
            <img id="figBase" src="/home/portrait-bw.webp" alt="" decoding="async" fetchPriority="high" aria-hidden="true" />
            {' '}
            <canvas id="figCanvas" aria-hidden="true" />
            {' '}
            <button className="fig__card" id="holoOpen" aria-haspopup="dialog" aria-controls="holo">My ability card</button>
          </div>
        </div>
        <div className="shell hero__content">
          <div className="hero__left">
            <p className="eyebrow rv" style={{ "--d": "200ms" } as CSSProperties}>Agentic AI Developer</p>
            <h1 className="h1">
              <span className="sr-only">Hi, I'm Madhav. I am an agentic AI developer, web developer and app developer.</span>
              {' '}
              <span aria-hidden="true">
                <span className="line"><span style={{ "--d": "250ms" } as CSSProperties}>Hi, I'm Madhav.</span></span>
                {' '}
                <span className="line"><span className="soft" style={{ "--d": "370ms" } as CSSProperties}>I am a</span></span>
                {' '}
                <span className="cal-line">
                  <span className="cal rv" id="cal" style={{ "--d": "520ms" } as CSSProperties}>
                    <span className="cal__body">
                      <span className="cal__stand" />
                      {' '}
                      <span className="cal__stack">
                        <span className="cal__back"><span className="cal__holes" /></span>
                        {' '}
                        <span className="cal__page" data-under="">
                          <span className="cal__holes" />
                          <span className="cal__word" />
                          <span className="cal__no" />
                          <span className="cal__shade" />
                        </span>
                        {' '}
                        <span className="cal__leaf">
                          <span className="cal__face">
                            <span className="cal__holes" />
                            <span className="cal__word" />
                            <span className="cal__no" />
                            <span className="cal__shade" />
                          </span>
                          {' '}
                          <span className="cal__rear"><span className="cal__holes" /></span>
                        </span>
                      </span>
                      {' '}
                      <span className="cal__rings" />
                    </span>
                    {' '}
                    <span className="cal__measure" />
                  </span>
                </span>
              </span>
            </h1>
            <div className="ctas rv" style={{ "--d": "750ms" } as CSSProperties}>
              <button className="pill pill--dark pill--arrow" data-contact="">
                <span className="pill__in" data-h="s 1 1.04" data-hs="320 18" data-ht=".pill">
                  Hire me{' '}
                  <span className="pill__badge">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-h="x 0 3" data-hs="320 18" data-ht=".pill">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </button>
              {' '}
              <button className="pill pill--outline" data-go="works">
                <span className="pill__in" data-h="s 1 1.04" data-hs="320 18" data-ht=".pill">See my work</span>
              </button>
            </div>
          </div>
        </div>
        <div className="shell hero__bar rv">
          <span>Available for work</span>
          {' '}
          <span className="mid">Ambala, India · remote worldwide</span>
          {' '}
          <span className="scroll">Scroll to explore{' '}<i aria-hidden="true">↓</i></span>
        </div>
      </section>
      {/* ============ Doors ============ */}
      <section id="works" className="doors" aria-labelledby="doorsTitle">
        <div className="doors__tex" aria-hidden="true" />
        <div className="doors__pin">
          <div className="shell doors__wall">
            <h2 className="sr-only" id="doorsTitle">My work, one door per skill</h2>
            <p className="paint" aria-hidden="true">Magic happens{' '}<br className="mbr" />behind the doors</p>
            <p className="doors__hint" aria-hidden="true">Swipe along the wall</p>
            <div className="dinfo" id="dinfo" aria-live="polite">
              <h3 className="dinfo__h" />
              <p className="dinfo__t" />
              <ul className="dinfo__p" />
            </div>
            <p className="doors__dots" aria-hidden="true"><i className="on" /><i /><i /><i /></p>
            <ul className="doors__row">
              <li className="unit" style={{ "--i": "0", "--door": "#22304a", "--door-dk": "#1c2840" } as CSSProperties}>
                <button className="doorway" aria-label="Open the Web Developer door">
                  <span className="casing" />
                  {' '}
                  <span className="opening">
                    <span className="room" />
                    {' '}
                    <span className="spill" />
                    {' '}
                    <span className="door">
                      <span className="door__flute" />
                      {' '}
                      <span className="plate">Web Developer</span>
                      {' '}
                      <span className="handle"><span className="handle__lever" /><span className="handle__lock" /></span>
                      {' '}
                      <span className="door__shade" />
                      {' '}
                      <span className="leak" />
                    </span>
                    {' '}
                    <span className="sill" />
                  </span>
                  {' '}
                  <span className="pool" />
                </button>
              </li>
              <li className="unit" style={{ "--i": "1", "--door": "#4a3540", "--door-dk": "#3f2d37" } as CSSProperties}>
                <button className="doorway" aria-label="Open the App Developer door">
                  <span className="casing" />
                  {' '}
                  <span className="opening">
                    <span className="room" />
                    {' '}
                    <span className="spill" />
                    {' '}
                    <span className="door">
                      <span className="door__flute" />
                      {' '}
                      <span className="plate">App Developer</span>
                      {' '}
                      <span className="handle"><span className="handle__lever" /><span className="handle__lock" /></span>
                      {' '}
                      <span className="door__shade" />
                      {' '}
                      <span className="leak" />
                    </span>
                    {' '}
                    <span className="sill" />
                  </span>
                  {' '}
                  <span className="pool" />
                </button>
              </li>
              <li className="unit" style={{ "--i": "2", "--door": "#7a8670", "--door-dk": "#66705d" } as CSSProperties}>
                <button className="doorway" aria-label="Open the UI/UX Designer door">
                  <span className="casing" />
                  {' '}
                  <span className="opening">
                    <span className="room" />
                    {' '}
                    <span className="spill" />
                    {' '}
                    <span className="door">
                      <span className="door__flute" />
                      {' '}
                      <span className="plate">UI/UX Designer</span>
                      {' '}
                      <span className="handle"><span className="handle__lever" /><span className="handle__lock" /></span>
                      {' '}
                      <span className="door__shade" />
                      {' '}
                      <span className="leak" />
                    </span>
                    {' '}
                    <span className="sill" />
                  </span>
                  {' '}
                  <span className="pool" />
                </button>
              </li>
              <li className="unit" style={{ "--i": "3", "--door": "#a4552c", "--door-dk": "#8c4826" } as CSSProperties}>
                <button className="doorway" aria-label="Open the Graphic Designer door">
                  <span className="casing" />
                  {' '}
                  <span className="opening">
                    <span className="room" />
                    {' '}
                    <span className="spill" />
                    {' '}
                    <span className="door">
                      <span className="door__flute" />
                      {' '}
                      <span className="plate">Graphic Designer</span>
                      {' '}
                      <span className="handle"><span className="handle__lever" /><span className="handle__lock" /></span>
                      {' '}
                      <span className="door__shade" />
                      {' '}
                      <span className="leak" />
                    </span>
                    {' '}
                    <span className="sill" />
                  </span>
                  {' '}
                  <span className="pool" />
                </button>
              </li>
              <li className="unit unit--secret" style={{ "--i": "4", "--door": "#262523", "--door-dk": "#201f1d" } as CSSProperties} inert>
                <button className="doorway" aria-label="Open the Photographer door">
                  <span className="casing" />
                  {' '}
                  <span className="opening">
                    <span className="room" />
                    {' '}
                    <span className="spill" />
                    {' '}
                    <span className="door">
                      <span className="door__flute" />
                      {' '}
                      <span className="plate">Photographer</span>
                      {' '}
                      <span className="handle"><span className="handle__lever" /><span className="handle__lock" /></span>
                      {' '}
                      <span className="door__shade" />
                      {' '}
                      <span className="leak" />
                    </span>
                    {' '}
                    <span className="sill" />
                  </span>
                  {' '}
                  <span className="pool" />
                </button>
              </li>
            </ul>
          </div>
          <div className="doors__floor" aria-hidden="true" />
        </div>
      </section>
      <section id="about" className="story" aria-labelledby="storyTitle" style={{ "--n": "5" } as CSSProperties}>
        <div className="story__amb" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="story__track">
          <div className="story__pin">
            <div className="shell story__stage">
              <div className="story__clock">
                <canvas className="story__bg" aria-hidden="true" />
                <p className="eyebrow">My story</p>
                <h2 className="story__h" id="storyTitle">Let's go back in time.</h2>
                <div className="story__yr" aria-hidden="true">
                  <span className="dg"><span className="dg__c"><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span></span>
                  <span className="dg"><span className="dg__c"><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span></span>
                  <span className="dg"><span className="dg__c"><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span></span>
                  <span className="dg"><span className="dg__c"><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span></span>
                </div>
                <p className="story__when" aria-hidden="true">2026 — Now</p>
                <div className="story__meter" aria-hidden="true">
                  <svg aria-hidden="true" focusable="false" className="story__rw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  {' '}
                  <span className="story__count">01</span>
                  <span className="story__of">/ 05</span>
                  {' '}
                  <i className="story__bar"><b /></i>
                </div>
              </div>
              <div className="story__line">
                <span className="story__rail" aria-hidden="true" />
                <span className="story__ttrack" aria-hidden="true"><span className="story__tail" /></span>
                <span className="story__dtrack" aria-hidden="true"><span className="story__dot" /></span>
                <ol className="story__list">
                  <li className="ch ch--now" data-y="2026" data-when="2026 — Now">
                    <p className="ch__date">2026 — Now</p>
                    <h3 className="ch__t">Agentic AI developer</h3>
                    <p className="ch__org">Building with LLMs, agents and RAG</p>
                    <ul className="ch__b">
                      <li>Generative AI and agentic AI systems: RAG pipelines, autonomous AI workflows and LLM-powered platforms.</li>
                      <li>Prompt engineering, FastAPI back-ends, API integrations and AI agent orchestration.</li>
                    </ul>
                  </li>
                  <li className="ch" data-y="2026" data-when="2026">
                    <p className="ch__date">2026</p>
                    <h3 className="ch__t">EvidenceAI</h3>
                    <p className="ch__org">Multimodal forensic RAG assistant</p>
                    <ul className="ch__b">
                      <li>A multimodal RAG system for forensic reports and evidence, with Groq LLM and HuggingFace embeddings.</li>
                      <li>Hybrid search (vector + BM25), a case-aware ChromaDB store, LLM guardrails and RAG evaluation.</li>
                    </ul>
                  </li>
                  <li className="ch" data-y="2025" data-when="2025">
                    <p className="ch__date">2025</p>
                    <h3 className="ch__t">Genetix</h3>
                    <p className="ch__org">AI website builder platform</p>
                    <ul className="ch__b">
                      <li>AI-driven workflows that generate websites from structured prompts and LLM APIs.</li>
                      <li>Agent workflows where LLMs generate, refine and execute code, cutting manual setup by 80%.</li>
                    </ul>
                  </li>
                  <li className="ch" data-y="2024" data-when="2024">
                    <p className="ch__date">2024</p>
                    <h3 className="ch__t">NoteGenie</h3>
                    <p className="ch__org">AI study assistant</p>
                    <ul className="ch__b">
                      <li>An AI learning assistant for summaries, flashcards and notes, built on LLM APIs.</li>
                      <li>Structured prompts for consistent output, and back-end APIs to orchestrate AI responses.</li>
                    </ul>
                  </li>
                  <li className="ch" data-y="2023" data-when="2023 — 2027">
                    <p className="ch__date">2023 — 2027</p>
                    <h3 className="ch__t">B.E. Computer Science Engineering (AI)</h3>
                    <p className="ch__org">Chitkara University, Punjab</p>
                    <ul className="ch__b">
                      <li>Pre-final year, CGPA 9.37: where it all started.</li>
                      <li>Certified in AI Agents &amp; Agentic AI (Vanderbilt University) and Python for Data Science, AI &amp; ML (IBM); 200+ DSA problems solved on LeetCode.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
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
            <button className="sf__btn" data-contact="">
              Hire me{' '}
              <b>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </b>
            </button>
            {' '}
            <button className="sf__ghost" data-go="works">See my work</button>
          </div>
          <div className="sf__cols">
            <div>
              <h3>Work</h3>
              <ul className="work">
                <li><a href="/web-developer/" data-door="0">Web Development</a></li>
                <li><a href="/app-developer/" data-door="1">App Development</a></li>
                <li><a href="/ui-ux-designer/" data-door="2">UI/UX Design</a></li>
                <li><a href="/graphic-designer/" data-door="3">Graphic Design</a></li>
                <li><a href="/photographer/" data-door="4">Photography</a></li>
              </ul>
            </div>
            <div>
              <h3>Navigate</h3>
              <ul>
                <li><a href="/" data-go="home">Home</a></li>
                <li><a href="/#about" data-go="about">My story</a></li>
                <li><button data-contact="">Contact</button></li>
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
            <button data-go="home">Back to top ↑</button>
          </div>
        </div>
      </footer>
    </div>
    <button className="totop" data-go="home" aria-label="Back to top">
      <svg className="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /></svg>
      <svg className="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      <span className="lbl">Back to top</span>
    </button>
    {/* ============ Door cursor + walk-through veil ============ */}
    <div className="door-cursor" id="doorCursor" aria-hidden="true">Click to enter</div>
    <div className="veil" id="veil" aria-hidden="true" hidden />
    <div className="shade" id="shade" aria-hidden="true" hidden />
    <div className="passage" id="passage" aria-hidden="true" hidden />
    <div className="wallv" id="wallv" />
    {/* ============ NavMenu ============ */}
    <div className="navm" id="navm" role="dialog" aria-modal="true" aria-label="Menu" hidden>
      <div className="shell navm__top">
        <span className="brand">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" fill="currentColor"><path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" /></svg>
          Madhav
        </span>
        {' '}
        <button className="close-btn" id="navClose">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l16 16M20 4 4 20" /></svg>
          Close
        </button>
      </div>
      <nav className="shell navm__nav" aria-label="Menu">
        <ul id="navList">
          {NAV.map(([l], i) => (
            <li key={i}><button className="navm__item" style={{ "--d": `${i * 45 + 80}ms` } as CSSProperties} data-i={i}><small>{`0${i + 1}`}</small><span>{l}</span></button></li>
          ))}
        </ul>
      </nav>
      <div className="shell navm__bot">
        <span>Local time<span data-navtime="" /></span>
        {' '}
        <button id="navStart" style={{ minHeight: "44px" }}>Hire me →</button>
      </div>
    </div>
    {/* ============ Ability card ============ */}
    <div className="holo" id="holo" role="dialog" aria-modal="true" aria-label="Madhav's ability card" hidden>
      <div className="holo__ld" id="holoLd" aria-hidden="true">
        <div className="cl" aria-hidden="true">
          <p className="cl__name">Madhav Kalra</p>
          <div className="cl__line"><i /></div>
          <p className="cl__row"><span>Loading the card</span><b id="holoPct">0%</b></p>
        </div>
      </div>
      <div className="holo__lite" id="holoLite" hidden>
        <button className="hc" id="hc" aria-label="Flip the card">
          <i className="hc__aura" />
          <span className="hc__in">
            <span className="hc__face hc__front">
              <span className="hc__win">
                <img className="hc__bg" src="/card/win_bg.webp" loading="lazy" alt="" decoding="async" />
                <img className="hc__sub" src="/card/win_sub.webp" loading="lazy" alt="" decoding="async" />
                <i className="hc__wsh" />
              </span>
              <img className="hc__plate" src="/card/plate.webp" loading="lazy" alt="Madhav Kalra's ability card: agentic AI 90, web development 90, app development 80, backend and databases 80." decoding="async" />
              <i className="hc__foil" />
              <i className="hc__sheen" />
              <i className="hc__glare" />
              <i className="hc__rim" />
            </span>
            <span className="hc__face hc__back">
              <img className="hc__backimg" src="/card/back.webp" loading="lazy" alt="" decoding="async" />
              <i className="hc__foil" />
              <i className="hc__glare" />
              <i className="hc__rim" />
            </span>
          </span>
        </button>
        <p className="hc__hint"><span className="hc__hm">Move across the card</span><span className="hc__ht">Tilt or drag it</span>{' '}· tap to flip</p>
      </div>
      <button className="holo__x" id="holoClose">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
        Close
      </button>
    </div>
    {/* ============ RequestModal ============ */}
    <div className="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle" hidden>
      <div className="modal__panel" id="mPanel">
        <button className="x-btn" id="mClose" aria-label="Close">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l16 16M20 4 4 20" /></svg>
        </button>
        <div id="mForm">
          <div className="mhead">
            <p>Hire me</p>
            <h2 id="mTitle">Tell me what you need built.</h2>
          </div>
          <form className="mform" id="reqForm" name="contact" method="POST" action="/" data-netlify="true" netlify-honeypot="company">
            <input type="hidden" name="form-name" value="contact" />
            <p className="mform__hp" aria-hidden="true"><label>Leave this empty{' '}<input name="company" tabIndex={-1} autoComplete="off" /></label></p>
            <label htmlFor="f-name">
              <span>Name</span>
              <input id="f-name" name="name" type="text" required maxLength={80} placeholder="Your name" autoComplete="name" />
            </label>
            {' '}
            <label htmlFor="f-email">
              <span>Email</span>
              <input id="f-email" name="email" type="email" required maxLength={120} placeholder="you@company.com" autoComplete="email" />
            </label>
            {' '}
            <label htmlFor="f-phone">
              <span>Phone</span>
              <input id="f-phone" name="phone" type="tel" required maxLength={20} minLength={7} pattern={"[\\d\\s\\-\\+\\(\\)]{7,20}"} placeholder="+91 98765 43210" autoComplete="tel" title="Phone number with country code" />
            </label>
            {' '}
            <label htmlFor="f-project">
              <span>What do you need?</span>
              <textarea id="f-project" name="project" rows={4} required maxLength={1500} placeholder="Describe the work you'd like done — scope, timeline and budget." />
            </label>
            <div className="mform__bot">
              <small>I reply within one business day.</small>
              {' '}
              <button type="submit" className="pill pill--dark pill--arrow" id="mSend">
                <span className="pill__in" data-h="s 1 1.04" data-hs="320 18" data-ht=".pill">
                  <span id="mSendLbl">Write the email</span>
                  {' '}
                  <span className="pill__badge">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-h="x 0 2|y 0 -2" data-hs="320 18" data-ht=".pill">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
          </form>
        </div>
        <div className="msuccess" id="mSuccess" role="status" aria-live="polite" hidden>
          <div className="msuccess__badge">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" fill="currentColor"><path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" /></svg>
          </div>
          <h2 id="mOkT">Almost there</h2>
          <p id="mOkP">Your email app has opened with your message ready to go. Press send there and I'll reply within one business day.</p>
          <p className="msuccess__alt">Email app didn't open? Write to{' '}<a data-mail="" href="#contact">my email</a>.</p>
          <button className="pill pill--dark" id="mDone"><span className="pill__in" data-h="s 1 1.04" data-hs="320 18" data-ht=".pill">Close</span></button>
        </div>
      </div>
    </div>
    <div className="ck" id="ck" role="region" aria-label="Analytics choice" hidden>
      <p>May I count your visit with Google Analytics? It sets cookies.{' '}<a href="/legal/">Details</a></p>
      <div><button type="button" data-ck="no">No thanks</button><button type="button" data-ck="yes">Allow</button></div>
    </div>
    </>
  );
}
