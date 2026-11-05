import { useBehaviors, usePageStyles } from '../../lib/hooks';
import css from './photographer.css?inline';
import { behaviors } from './behaviors';

export default function PhotographerPage() {
  usePageStyles(css);
  useBehaviors(...behaviors);
  return (
    <>
      <title>Photography — Madhav Kalra</title>
      <meta name="description" content="A wall of photographs by Madhav Kalra: portraits, events and street photography you can drag through in any direction." />
      <link rel="canonical" href="https://www.madhavkalra.dev/photographer/" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="author" content="Madhav Kalra" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Madhav Kalra" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content="https://www.madhavkalra.dev/photographer/" />
      <meta property="og:title" content="Photography — Madhav Kalra" />
      <meta property="og:description" content="A wall of photographs by Madhav Kalra: portraits, events and street photography you can drag through in any direction." />
      <meta property="og:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:secure_url" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Madhav Kalra's portfolio" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Photography — Madhav Kalra" />
      <meta name="twitter:description" content="A wall of photographs by Madhav Kalra: portraits, events and street photography you can drag through in any direction." />
      <meta name="twitter:image" content="https://www.madhavkalra.dev/og.jpg?v=3" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Person\",\"@id\":\"https://www.madhavkalra.dev/#madhav\",\"name\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"jobTitle\":\"Agentic AI Developer\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"description\":\"AI-focused Computer Science undergraduate building Generative AI and Agentic AI systems, RAG pipelines and AI-powered web apps, plus Android games.\",\"knowsAbout\":[\"Agentic AI\",\"Generative AI\",\"Retrieval Augmented Generation (RAG)\",\"LLM integration\",\"Prompt engineering\",\"Web development\",\"React\",\"Next.js\",\"FastAPI\",\"Node.js\",\"Android games\"],\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Ambala\",\"addressRegion\":\"Haryana\",\"addressCountry\":\"IN\"},\"knowsLanguage\":[\"en\"],\"worksFor\":{\"@id\":\"https://www.madhavkalra.dev/#org\"},\"alumniOf\":{\"@type\":\"CollegeOrUniversity\",\"name\":\"Chitkara University\"},\"email\":\"madhavkalra2005@gmail.com\",\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"Organization\",\"@id\":\"https://www.madhavkalra.dev/#org\",\"name\":\"Madhav Kalra — Design & Development\",\"alternateName\":\"Madhav Kalra\",\"url\":\"https://www.madhavkalra.dev\",\"image\":\"https://www.madhavkalra.dev/og.jpg?v=3\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://www.madhavkalra.dev/icon-512.png\",\"width\":512,\"height\":512},\"founder\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"email\":\"madhavkalra2005@gmail.com\",\"contactPoint\":{\"@type\":\"ContactPoint\",\"contactType\":\"sales\",\"email\":\"madhavkalra2005@gmail.com\",\"availableLanguage\":\"en\",\"areaServed\":\"Worldwide\"},\"description\":\"AI-powered web development, Agentic AI systems, app and game development, UI/UX and graphic design.\",\"areaServed\":\"Worldwide\",\"hasOfferCatalog\":{\"@type\":\"OfferCatalog\",\"name\":\"Services\",\"itemListElement\":[{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Web development\",\"description\":\"AI-powered websites and web applications built end to end.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"App development\",\"description\":\"Android apps and games, from first idea to a playable build.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"UI/UX design\",\"description\":\"Product and interface design: user flows, wireframes and finished UI.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Graphic design\",\"description\":\"Brand identity, social media creatives, posters and logos.\"}},{\"@type\":\"Offer\",\"itemOffered\":{\"@type\":\"Service\",\"name\":\"Photography\",\"description\":\"Portrait, event and street photography.\"}}]},\"sameAs\":[\"https://github.com/madhavkalra7\",\"https://www.linkedin.com/in/madhav-kalra\",\"https://www.instagram.com/madhavkalra._\"]},{\"@type\":\"WebSite\",\"@id\":\"https://www.madhavkalra.dev/#site\",\"url\":\"https://www.madhavkalra.dev\",\"name\":\"Madhav Kalra — Portfolio\",\"publisher\":{\"@id\":\"https://www.madhavkalra.dev/#madhav\"},\"inLanguage\":\"en\"},{\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://www.madhavkalra.dev/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Photography\",\"item\":\"https://www.madhavkalra.dev/photographer/\"}]}]}" }} />
    <main id="wallMain" style={{ display: "contents" }}>
      <h1 style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>Photography by Madhav</h1>
      <canvas className="sky" id="sky" aria-hidden="true" />
      <div className="wall" id="wall" role="region" aria-label="Photos floating in the dark. Drag, scroll or use the arrow keys to move around, then press Enter to open the photo in the middle of the screen." tabIndex={0}>
        <div className="space" id="space" />
      </div>
      <div className="bar">
        <a className="chip" href="/#works" id="back" style={{ minHeight: "44px" }}>← Back to the doors</a>
        {' '}
        <span className="chip chip--title">Photography</span>
      </div>
      <div className="chip hint" id="hint" aria-hidden="true">Drag in any direction</div>
      <div className="lb" id="lb" role="dialog" aria-modal="true" aria-label="Photo" hidden>
        <img id="lbImg" alt="" />
        {' '}
        <button className="chip lb__close" id="lbClose">Close</button>
        {' '}
        <button className="chip lb__nav lb__nav--p" id="lbPrev" aria-label="Previous photo">←</button>
        {' '}
        <button className="chip lb__nav lb__nav--n" id="lbNext" aria-label="Next photo">→</button>
        {' '}
        <span className="chip lb__count" id="lbCount" />
      </div>
    </main>
    <div className="ck" id="ck" role="region" aria-label="Analytics choice" hidden>
      <p>May I count your visit with Google Analytics? It sets cookies.{' '}<a href="/legal/">Details</a></p>
      <div><button type="button" data-ck="no">No thanks</button><button type="button" data-ck="yes">Allow</button></div>
    </div>
    </>
  );
}
