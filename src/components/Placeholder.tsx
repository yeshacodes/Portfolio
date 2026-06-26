import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

type PlaceholderProps = {
  /** CSS aspect-ratio, e.g. "4 / 5" or "16 / 10". */
  ratio?: string;
  /** Small label shown in the frame, e.g. "Portrait". */
  label?: string;
  /** Optional second line, e.g. a hint on what to drop in. */
  hint?: string;
  /** Optional image URL. The photo is shown only once it actually loads;
   *  until then (or if the file is missing) the placeholder stays. */
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * A styled image frame. It preloads `src` in the background and swaps the photo
 * in only after a successful decode — so a missing file simply shows the elegant
 * placeholder instead of a broken image. Drop a real file at the path and it
 * appears on next load; no code changes needed.
 */
export function Placeholder({
  ratio = '4 / 5',
  label = 'Photo',
  hint,
  src,
  alt = '',
  className = '',
  style,
}: PlaceholderProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    setLoaded(false);
    const img = new Image();
    let active = true;
    img.onload = () => {
      // Guard against non-image responses (e.g. a dev-server HTML fallback).
      if (active && img.naturalWidth > 0) setLoaded(true);
    };
    img.src = src;
    return () => {
      active = false;
    };
  }, [src]);

  return (
    <div
      className={`ed-frame${loaded ? ' has-image' : ''} ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      {loaded && src ? (
        <img src={src} alt={alt} className="ed-frame-img" />
      ) : (
        <div className="ed-frame-empty" aria-hidden="true">
          <span className="ed-frame-mark" />
          <span className="ed-frame-label">{label}</span>
          {hint && <span className="ed-frame-hint">{hint}</span>}
        </div>
      )}
    </div>
  );
}
