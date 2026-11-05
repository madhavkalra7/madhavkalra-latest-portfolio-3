import { useBehaviors, usePageStyles } from '../../lib/hooks';
import css from './legal.css?inline';
import { behaviors } from './behaviors';

export default function LegalPage() {
  usePageStyles(css);
  useBehaviors(...behaviors);
  return (
    <>
      <title>Privacy &amp; credits — Madhav Kalra</title>
      <meta name="description" content="How this portfolio handles your data, and the credits and licences for what it is built with." />
      <link rel="canonical" href="https://www.madhavkalra.dev/legal/" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="author" content="Madhav Kalra" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Madhav Kalra" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content="https://www.madhavkalra.dev/legal/" />
      <meta property="og:title" content={"Privacy & credits — Madhav Kalra"} />
      <meta property="og:description" content="How this portfolio handles your data, and the credits and licences for what it is built with." />
      <meta property="og:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:secure_url" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Madhav Kalra's portfolio" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={"Privacy & credits — Madhav Kalra"} />
      <meta name="twitter:description" content="How this portfolio handles your data, and the credits and licences for what it is built with." />
      <meta name="twitter:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Person\",\"@id\":\"https://www.madhavkalra.dev/#madhav\",\"name\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"jobTitle\":\"Agentic AI Developer\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"description\":\"AI-focused Computer Science undergraduate building Generative AI and Agentic AI systems, RAG pipelines and AI-powered web apps, plus Android games.\",\"knowsAbout\":[\"Agentic AI\",\"Generative AI\",\"Retrieval Augmented Generation (RAG)\",\"LLM integration\",\"Prompt engineering\",\"Web development\",\"React\",\"Next.js\",\"FastAPI\",\"Node.js\",\"Android games\"],\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Ambala\",\"addressRegion\":\"Haryana\",\"addressCountry\":\"IN\"},\"knowsLanguage\":[\"en\"],\"worksFor\":{\"@id\":\"https://www.madhavkalra.dev/#org\"},\"alumniOf\":{\"@type\":\"CollegeOrUniversity\",\"name\":\"Chitkara University\"},\"email\":\"madhavkalra2005@gmail.com\",\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"Organization\",\"@id\":\"https://www.madhavkalra.dev/#org\",\"name\":\"Madhav Kalra — Design & Development\",\"alternateName\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://www.madhavkalra.dev/icon-512.png\",\"width\":512,\"height\":512},\"founder\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"email\":\"madhavkalra2005@gmail.com\",\"contactPoint\":{\"@type\":\"ContactPoint\",\"contactType\":\"sales\",\"email\":\"madhavkalra2005@gmail.com\",\"availableLanguage\":\"en\",\"areaServed\":\"Worldwide\"},\"description\":\"AI-powered web development, Agentic AI systems, app and game development, UI/UX and graphic design.\",\"areaServed\":\"Worldwide\",\"hasOfferCatalog\":{\"@type\":\"OfferCatalog\",\"name\":\"Services\",\"itemListElement\":[{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Web development\",\"description\":\"AI-powered websites and web applications built end to end.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"App development\",\"description\":\"Android apps and games, from first idea to a playable build.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"UI/UX design\",\"description\":\"Product and interface design: user flows, wireframes and finished UI.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Graphic design\",\"description\":\"Brand identity, social media creatives, posters and logos.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Photography\",\"description\":\"Portrait, event and street photography.\"}}]},\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"WebSite\",\"@id\":\"https://www.madhavkalra.dev/#site\",\"url\":\"https://www.madhavkalra.dev\",\"name\":\"Madhav Kalra — Portfolio\",\"publisher\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"inLanguage\":\"en\"},{\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://www.madhavkalra.dev/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Privacy & credits\",\"item\":\"https://www.madhavkalra.dev/legal/\"}]}]}" }} />
    <main className="wrap">
      <div className="top"><a className="chip" href="/">← Back to the portfolio</a></div>
      <p className="eye">Privacy &amp; credits</p>
      <h1>Your privacy, and who made what.</h1>
      <p className="lead">
        This site is a personal portfolio. It only measures visits if you say yes, and it doesn't collect anything else about you unless you choose to contact me.
      </p>
      <h2>Privacy notice</h2>
      <div className="box">
        <p>
          <b>In short:</b>
          {' '}no advertising, no tracking pixels and no third-party embeds. Page-load speed is measured anonymously, without cookies. Visits are counted with Google Analytics only if you choose “Allow” on the banner; until then nothing is sent to Google and no cookies are set.
        </p>
      </div>
      <h3>Who is responsible</h3>
      <p>
        Madhav Kalra, an independent freelancer based in India. You can reach me at{' '}
        <a data-mail="" href="#">my email address</a>
        {' '}(madhavkalra2005 at gmail dot com).
      </p>
      <h3>What this site stores on your device</h3>
      <p>
        Two things, both in your browser's local storage: your light or dark mode choice (key{' '}
        <code>madhav-mode</code>
        ) and your answer to the analytics question (key{' '}
        <code>madhav-analytics</code>
        ). Neither is a cookie and neither leaves your device. You can clear them any time from your browser settings, which also brings the analytics question back.
      </p>
      <h3>Analytics</h3>
      <p>
        If you choose “Allow”, this site loads Google Analytics 4 (Google LLC / Google Ireland Ltd.), which sets cookies (names starting{' '}
        <code>_ga</code>
        , kept for up to 2 years) and receives your approximate location, device and browser type, the pages you view and how you arrived. I use it only to see which work people look at; it is not used for advertising, and Google Analytics does not store full IP addresses. If you choose “No thanks”, Google Analytics is never loaded. Your consent is the legal basis for this, and you can withdraw it at any time by clearing this site's data in your browser.
      </p>
      <h3>Performance measurement</h3>
      <p>
        This site is hosted on Vercel (Vercel Inc., USA) and uses Vercel Speed Insights to measure how fast pages load. On each visit your browser reports loading-time metrics together with the page address, your device type, browser and approximate country. No cookies are set, and the data is anonymous and cannot identify you. I use it only to keep the site fast.
      </p>
      <h3>When you contact me</h3>
      <p>
        The "Hire me" form doesn't send anything itself: it opens your own email app with your name, email address, phone number and message filled in, addressed to me. Nothing is sent until you press send there, and the email then goes to my inbox (Gmail, run by Google).
      </p>
      <p>
        I collect your phone number so I can reach you quickly about your project. I will only call or message you in relation to the enquiry you submit, never for marketing. I use what you send only to reply to you and to discuss your project. I keep it only as long as it is useful for our work together, and I'll delete it, if you ask.
      </p>
      <h3>The hosting provider</h3>
      <p>
        Like every website, this one is delivered by a hosting company, whose servers briefly process technical details such as your IP address and browser type to deliver the pages and protect them from abuse. That is governed by the hosting provider's own privacy policy. I don't receive or use those logs to identify visitors.
      </p>
      <h3>Links to other websites</h3>
      <p>Some projects link to live websites run by other companies. Once you follow a link you are on their site and under their privacy policy.</p>
      <h3>Your rights</h3>
      <p>
        You can ask me what personal data I hold about you, ask me to correct it, or ask me to delete it, by emailing me. I'll respond within 30 days. This notice is written to meet India's Digital Personal Data Protection Act, 2023 and the EU and UK GDPR.
      </p>
      <h2>Work shown on this site</h2>
      <p>
        The projects shown here were made by me, alone or as part of a team, for clients and employers. Client names, logos, products, screenshots and brand material belong to their respective owners and are shown only to describe my role in that work; showing them does not mean those companies endorse this site. If you own any of this material and would like it changed or removed, email me and I'll act on it promptly.
      </p>
      <p>
        The photographs and original designs on this site are © Madhav Kalra. Please don't copy, republish or use them (including for training AI models) without my written permission.
      </p>
      <h2>Credits &amp; licences</h2>
      <p>
        This site is built with the open-source work below. Their full licence texts are in{' '}
        <a href="/legal/licenses.txt">licenses.txt</a>
        .
      </p>
      <table>
        <thead>
          <tr>
            <th>Software or font</th>
            <th>Used for</th>
            <th>Licence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>three.js r180 — © 2010–2025 three.js authors</td>
            <td>The 3D ability card</td>
            <td>MIT</td>
          </tr>
          <tr>
            <td>ThreeUI holo card component — © 2026 Meng To</td>
            <td>The ability card's renderer and frame art</td>
            <td>MIT (ThreeUI Community)</td>
          </tr>
          <tr>
            <td>Lenis 1.3.23 — © 2024 darkroom.engineering</td>
            <td>Smooth scrolling on desktop</td>
            <td>MIT</td>
          </tr>
          <tr>
            <td>Onest — © 2021 The Onest Project Authors</td>
            <td>The site's typeface</td>
            <td>SIL Open Font License 1.1</td>
          </tr>
          <tr>
            <td>EB Garamond — © 2017 The EB Garamond Project Authors</td>
            <td>Small captions on the ability card</td>
            <td>SIL Open Font License 1.1</td>
          </tr>
        </tbody>
      </table>
      <h2>No warranty</h2>
      <p>This site is provided for information about my work. I try to keep it accurate and up to date, but it is provided as is, without any guarantee.</p>
      <p className="small">Last updated 3 November 2026. ©{' '}<span data-fyear="">2026</span>{' '}Madhav Kalra.</p>
    </main>
    <div className="ck" id="ck" role="region" aria-label="Analytics choice" hidden>
      <p>May I count your visit with Google Analytics? It sets cookies.{' '}<a href="/legal/">Details</a></p>
      <div><button type="button" data-ck="no">No thanks</button><button type="button" data-ck="yes">Allow</button></div>
    </div>
    </>
  );
}
