import { useBehaviors, usePageStyles } from '../../lib/hooks';
import css from './ability-card.css?inline';
import { behaviors } from './behaviors';

// phones and tablets: the card follows the device's tilt, and a double tap flips it
const TOUCH = typeof window !== 'undefined' && matchMedia('(hover: none), (pointer: coarse)').matches;

export default function AbilityCardPage() {
  usePageStyles(css);
  useBehaviors(...behaviors);
  return (
    <>
      <title>Madhav Kalra — Ability Card</title>
    <main style={{ display: "contents" }}>
      <div id="scene" role="img" aria-label="Madhav Kalra's ability card: agentic AI 90, web development 90, app development 80, backend and databases 80. Move the pointer to tilt it, drag to rotate, double-click or press F to flip it over." />
      <p className="mark" aria-hidden="true">Madhav Kalra<small>Ability card</small></p>
      <p className="hint" id="hint" aria-hidden="true">{TOUCH ? 'Tilt your phone · Drag to rotate · Double-tap to flip' : 'Hover to tilt · Drag to rotate · Double-click to flip'}</p>
      <div id="loading" role="progressbar" aria-label="Loading the ability card" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
        <div className="cl" aria-hidden="true">
          <p className="cl__name">Madhav Kalra</p>
          <div className="cl__line"><i /></div>
          <p className="cl__row"><span>Loading the card</span><b id="ld-pct">0%</b></p>
          <span id="ld-fill" hidden />
          <span id="ld-stage" hidden>Charging up</span>
        </div>
      </div>
    </main>
    </>
  );
}
