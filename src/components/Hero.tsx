import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { resumeData } from '../data/resume';
import { heroGazeCalibration } from '../data/heroGazeCalibration';

const CENTER_FRAME_PATH = '/frames/center.webp';
const HERO_BACKGROUND = '#E30B08';
const FACE_CENTER = { x: 0.472, y: 0.322 };
const CURSOR_DOT_SHARPNESS = 60;
const CURSOR_RING_SHARPNESS = 24;
const CURSOR_HOVER_SHARPNESS = 10;
const CENTER_ENTER_DISTANCE = 1;
const CENTER_EXIT_DISTANCE = 1.15;
const CENTER_RADIUS_X = { min: 153, ideal: 0.136, max: 187 };
const CENTER_RADIUS_Y = { min: 176, ideal: 0.2, max: 216 };
const ANCHOR_SNAP_DEGREES = 3;
const SHOW_GAZE_ACCURACY_DEBUG = false; // ← diagnostic mode: disable before shipping
const FACE_DEBUG = false; // set true to draw a circle at (faceX, faceY) for visual verification

const TRANSITION_ORDER = [
  'UP_TO_UP_RIGHT',
  'UP_RIGHT_TO_RIGHT',
  'RIGHT_TO_DOWN_RIGHT',
  'DOWN_RIGHT_TO_DOWN',
  'DOWN_TO_DOWN_LEFT',
  'DOWN_LEFT_TO_LEFT',
  'LEFT_TO_UP_LEFT',
  'UP_LEFT_TO_UP',
] as const;

type TransitionKey = (typeof TRANSITION_ORDER)[number];

// Screen-space angles: RIGHT=0°, DOWN=90°, LEFT=180°, UP=270°.
// Each 45° sector maps directly onto one manually calibrated transition path.
const ANGLE_SECTORS: readonly { start: number; transition: TransitionKey }[] = [
  { start: 0, transition: 'RIGHT_TO_DOWN_RIGHT' },
  { start: 45, transition: 'DOWN_RIGHT_TO_DOWN' },
  { start: 90, transition: 'DOWN_TO_DOWN_LEFT' },
  { start: 135, transition: 'DOWN_LEFT_TO_LEFT' },
  { start: 180, transition: 'LEFT_TO_UP_LEFT' },
  { start: 225, transition: 'UP_LEFT_TO_UP' },
  { start: 270, transition: 'UP_TO_UP_RIGHT' },
  { start: 315, transition: 'UP_RIGHT_TO_RIGHT' },
] as const;

const RUNTIME_FRAME_NUMBERS = Array.from(
  new Set(TRANSITION_ORDER.flatMap((transition) => [...heroGazeCalibration.transitions[transition]])),
);

type DirectionFrameSelection = {
  frame: number;
  transition: TransitionKey;
  progress: number;
  frameIndex: number;
  isSnap: boolean;
};

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

function signedAngleDelta(fromDegrees: number, toDegrees: number) {
  let delta = normalizeDegrees(toDegrees) - normalizeDegrees(fromDegrees);
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

function angularDistance(degreesA: number, degreesB: number) {
  return Math.abs(signedAngleDelta(degreesA, degreesB));
}

// Returns the index of the frame whose calibrated angle is nearest to cursorAngle.
// Used for sectors where frames are not evenly spaced in visual gaze angle.
function nearestFrameByAngle(calibAngles: readonly number[], cursorAngle: number): number {
  return calibAngles.reduce<number>(
    (best, ang, i) =>
      Math.abs(ang - cursorAngle) < Math.abs(calibAngles[best] - cursorAngle) ? i : best,
    0,
  );
}


function frameForDirection(
  dx: number,
  dy: number,
): DirectionFrameSelection & { angle: number } {
  const angle = normalizeDegrees((Math.atan2(dy, dx) * 180) / Math.PI);
  const nearestAnchorIndex = Math.round(angle / 45) % 8;
  const nearestAnchorAngle = nearestAnchorIndex * 45;

  if (angularDistance(angle, nearestAnchorAngle) <= ANCHOR_SNAP_DEGREES) {
    const offsetFromAnchor = signedAngleDelta(nearestAnchorAngle, angle);
    const sectorIndex = offsetFromAnchor < 0 ? (nearestAnchorIndex + 7) % 8 : nearestAnchorIndex;
    const sector = ANGLE_SECTORS[sectorIndex];
    const frames = heroGazeCalibration.transitions[sector.transition];
    const frameIndex = offsetFromAnchor < 0 ? frames.length - 1 : 0;

    return {
      frame: frames[frameIndex],
      transition: sector.transition,
      progress: frameIndex / (frames.length - 1),
      frameIndex,
      isSnap: true,
      angle,
    };
  }

  const sectorIndex = Math.min(7, Math.floor(angle / 45));
  const sector = ANGLE_SECTORS[sectorIndex];
  const frames = heroGazeCalibration.transitions[sector.transition];
  const transitionStart = sector.start + ANCHOR_SNAP_DEGREES;
  const transitionEnd = sector.start + 45 - ANCHOR_SNAP_DEGREES;
  const progress = clamp((angle - transitionStart) / (transitionEnd - transitionStart), 0, 1);
  const exactIndex = progress * (frames.length - 1);

  // Non-uniform calibration: DOWN_LEFT_TO_LEFT frames are not evenly spaced in visual
  // gaze angle, so use nearest-angle matching instead of linear interpolation.
  // For all other sectors, fall back to Math.round (no aggressive directional bias).
  const nonUniformAngles: readonly number[] | undefined =
    sector.transition === 'DOWN_LEFT_TO_LEFT'
      ? heroGazeCalibration.nonUniformAt.DOWN_LEFT_TO_LEFT
      : undefined;

  const frameIndex = nonUniformAngles
    ? nearestFrameByAngle(nonUniformAngles, angle)
    : clamp(Math.round(exactIndex), 0, frames.length - 1);

  return {
    frame: frames[frameIndex],
    transition: sector.transition,
    progress,
    frameIndex,
    isSnap: false,
    angle,
  };
}

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  ringX: number;
  ringY: number;
  dotScale: number;
  ringScale: number;
  hover: boolean;
  visible: boolean;
};

type CoverGeometry = ReturnType<typeof getCoverGeometry> & {
  width: number;
  height: number;
  image: HTMLImageElement;
};

function frameRateIndependentAmount(sharpness: number, deltaSeconds: number) {
  return 1 - Math.exp(-sharpness * deltaSeconds);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getCoverGeometry(image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = (height - drawHeight) / 2;

  return {
    drawX,
    drawY,
    drawWidth,
    drawHeight,
    faceX: drawX + drawWidth * FACE_CENTER.x,
    faceY: drawY + drawHeight * FACE_CENTER.y,
    centerRadiusX: clamp(drawWidth * CENTER_RADIUS_X.ideal, CENTER_RADIUS_X.min, CENTER_RADIUS_X.max),
    centerRadiusY: clamp(drawHeight * CENTER_RADIUS_Y.ideal, CENTER_RADIUS_Y.min, CENTER_RADIUS_Y.max),
    gazeRangeX: Math.max(120, Math.min(width * 0.42, Math.min(width - (drawX + drawWidth * FACE_CENTER.x), drawX + drawWidth * FACE_CENTER.x) * 0.86)),
    gazeRangeY: Math.max(96, Math.min(height * 0.36, Math.min(height - (drawY + drawHeight * FACE_CENTER.y), drawY + drawHeight * FACE_CENTER.y) * 0.92)),
  };
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const geometry = getCoverGeometry(image, width, height);
  ctx.drawImage(image, geometry.drawX, geometry.drawY, geometry.drawWidth, geometry.drawHeight);
}

// `bio` lets a page replace the line under the name; without it the original line is shown.
export function Hero({ bio }: { bio?: string } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const debugPanelRef = useRef<HTMLPreElement | null>(null);
  const debugLabelRef = useRef<HTMLDivElement | null>(null);
  const framesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const centerRef = useRef<HTMLImageElement | null>(null);
  const geometryRef = useRef<CoverGeometry | null>(null);
  const pointerRef = useRef<PointerState>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2,
    dotScale: 1,
    ringScale: 1,
    hover: false,
    visible: false,
  });
  const selectedFrameRef = useRef<number | null>(null);
  const isCenteredRef = useRef(true);
  const [ready, setReady] = useState(false);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let cancelled = false;

    async function loadImage(src: string) {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      await image.decode();
      return image;
    }

    Promise.all([...RUNTIME_FRAME_NUMBERS.map((frame) => `/frames/${String(frame).padStart(2, '0')}.webp`), CENTER_FRAME_PATH].map(loadImage))
      .then((images) => {
        if (cancelled) return;
        framesRef.current = new Map(
          RUNTIME_FRAME_NUMBERS.map((frame, index) => [frame, images[index]]),
        );
        centerRef.current = images[RUNTIME_FRAME_NUMBERS.length];
        setReady(true);
      })
      .catch(() => setReady(false));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerRef.current.visible) {
        pointerRef.current.x = event.clientX;
        pointerRef.current.y = event.clientY;
        pointerRef.current.ringX = event.clientX;
        pointerRef.current.ringY = event.clientY;
        pointerRef.current.visible = true;
      }

      pointerRef.current.targetX = event.clientX;
      pointerRef.current.targetY = event.clientY;
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      pointerRef.current.hover = Boolean(target?.closest('a, button'));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerover', onPointerOver);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrame = 0;
    let previousTime = performance.now();
    let lastDrawnKey = '';
    let forceRedraw = true;

    const resize = () => {
      const dpr = 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      // The source WebPs already contain the final portrait. 'high' resampling can
      // add avoidable work on every pose change without a visible benefit here.
      ctx.imageSmoothingQuality = 'medium';
      geometryRef.current = null;
      forceRedraw = true;
    };

    const damp = (current: number, target: number, sharpness: number, deltaSeconds: number) => {
      return current + (target - current) * frameRateIndependentAmount(sharpness, deltaSeconds);
    };

    const render = (time: number) => {
      const deltaSeconds = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pointer = pointerRef.current;
      const frames = framesRef.current;
      const centerFrame = centerRef.current;
      const referenceImage = centerFrame || frames.get(RUNTIME_FRAME_NUMBERS[0]);

      pointer.x = damp(pointer.x, pointer.targetX, CURSOR_DOT_SHARPNESS, deltaSeconds);
      pointer.y = damp(pointer.y, pointer.targetY, CURSOR_DOT_SHARPNESS, deltaSeconds);
      pointer.ringX = damp(pointer.ringX, pointer.targetX, CURSOR_RING_SHARPNESS, deltaSeconds);
      pointer.ringY = damp(pointer.ringY, pointer.targetY, CURSOR_RING_SHARPNESS, deltaSeconds);
      pointer.dotScale = damp(
        pointer.dotScale,
        pointer.hover ? 1.62 : 1,
        CURSOR_HOVER_SHARPNESS,
        deltaSeconds,
      );
      pointer.ringScale = damp(
        pointer.ringScale,
        pointer.hover ? 1.48 : 1,
        CURSOR_HOVER_SHARPNESS,
        deltaSeconds,
      );

      if (referenceImage) {
        const cachedGeometry = geometryRef.current;
        const geometry =
          cachedGeometry &&
          cachedGeometry.width === width &&
          cachedGeometry.height === height &&
          cachedGeometry.image === referenceImage
            ? cachedGeometry
            : {
                ...getCoverGeometry(referenceImage, width, height),
                width,
                height,
                image: referenceImage,
              };
        geometryRef.current = geometry;

        // Direction is intentionally calculated from the CURRENT pointer position.
        // There is no gaze-vector smoothing and no nearest-pose search, so the
        // portrait cannot lag behind or jump to an unrelated directional pose.
        const dx = pointer.targetX - geometry.faceX;
        const dy = pointer.targetY - geometry.faceY;
        const centerDistance = Math.hypot(
          dx / geometry.centerRadiusX,
          dy / geometry.centerRadiusY,
        );

        if (isCenteredRef.current && centerDistance > CENTER_EXIT_DISTANCE) {
          isCenteredRef.current = false;
        } else if (!isCenteredRef.current && centerDistance < CENTER_ENTER_DISTANCE) {
          isCenteredRef.current = true;
        }

        const isCentered = isCenteredRef.current || !ready;
        const selection: (DirectionFrameSelection & { angle: number }) | null =
          isCentered ? null : frameForDirection(dx, dy);
        const selectedFrame = selection?.frame ?? null;
        selectedFrameRef.current = isCentered ? null : selectedFrame;

        const image = isCentered
          ? (centerFrame ?? referenceImage)
          : (frames.get(selectedFrame!) ?? referenceImage);

        // Full-screen canvas painting is expensive. Only repaint when the
        // selected portrait changes (or after resize), while cursor DOM motion
        // continues every RAF. In debug mode always repaint so the overlay
        // (face marker + direction line) tracks the cursor smoothly.
        const drawKey = isCentered ? 'center' : String(selectedFrame);

        if (image && (forceRedraw || drawKey !== lastDrawnKey || SHOW_GAZE_ACCURACY_DEBUG)) {
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = HERO_BACKGROUND;
          ctx.fillRect(0, 0, width, height);
          drawCover(ctx, image, width, height);
          if (!SHOW_GAZE_ACCURACY_DEBUG) {
            lastDrawnKey = drawKey;
            forceRedraw = false;
          }
        }

        // ── Canvas debug overlay ───────────────────────────────────────────
        if ((FACE_DEBUG || SHOW_GAZE_ACCURACY_DEBUG) && geometry) {
          const fx = geometry.faceX;
          const fy = geometry.faceY;
          ctx.save();

          // Direction line from face to real cursor (yellow)
          const px = pointer.targetX;
          const py = pointer.targetY;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = 'rgba(255,220,0,0.85)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,220,0,0.9)';
          ctx.fill();

          // Face origin (always shown, green)
          ctx.beginPath();
          ctx.arc(fx, fy, 10, 0, Math.PI * 2);
          ctx.strokeStyle = '#00ff88';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(fx, fy, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#00ff88';
          ctx.fill();

          ctx.restore();
        }

        // ── Debug text panel ───────────────────────────────────────────────
        if (SHOW_GAZE_ACCURACY_DEBUG && debugPanelRef.current) {
          const angle = normalizeDegrees((Math.atan2(dy, dx) * 180) / Math.PI);
          const snap = selection?.isSnap ?? false;
          debugPanelRef.current.textContent = [
            `cursor:  (${Math.round(pointer.targetX)}, ${Math.round(pointer.targetY)})`,
            `face:    (${Math.round(geometry.faceX)}, ${Math.round(geometry.faceY)})`,
            `dx/dy:   (${Math.round(dx)}, ${Math.round(dy)})`,
            `angle:   ${angle.toFixed(1)}°`,
            `snap:    ${snap ? `YES (±${ANCHOR_SNAP_DEGREES}° zone)` : 'no'}`,
            `sector:  ${selection?.transition ?? 'CENTER'}`,
            `progress:${(selection?.progress ?? 0).toFixed(3)}`,
            `frame:   ${isCentered ? 'center.webp' : `${String(selectedFrame).padStart(2, '0')}.webp`}`,
          ].join('\n');
        }
      }

      if (dotRef.current && ringRef.current) {
        const opacity = pointer.visible ? '1' : '0';
        dotRef.current.style.opacity = opacity;
        ringRef.current.style.opacity = opacity;
        dotRef.current.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%) scale(${pointer.dotScale})`;
        ringRef.current.style.transform = `translate(${pointer.ringX}px, ${pointer.ringY}px) translate(-50%, -50%) scale(${pointer.ringScale})`;
      }

      if (SHOW_GAZE_ACCURACY_DEBUG && debugLabelRef.current) {
        debugLabelRef.current.textContent = selectedFrameRef.current === null
          ? 'center'
          : `frame ${selectedFrameRef.current}`;
        debugLabelRef.current.style.opacity = pointer.visible ? '1' : '0';
        debugLabelRef.current.style.transform = `translate(${pointer.targetX + 16}px, ${pointer.targetY + 18}px)`;
      }

      animationFrame = requestAnimationFrame(render);
    };

    resize();
    animationFrame = requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [ready]);

  return (
    <section id="hero" className="lux-hero" style={{ backgroundColor: HERO_BACKGROUND }}>
      <canvas
        ref={canvasRef}
        className="lux-hero-canvas"
        aria-label="Interactive portrait animation"
      />

      <nav className="lux-hero-nav" aria-label="Primary">
        <button onClick={() => go('projects')}>WORK</button>
        <button onClick={() => go('building')}>ABOUT</button>
        <button onClick={() => go('contact')}>CONTACT</button>
      </nav>

      <div className="lux-hero-copy">
        <p className="lux-hero-kicker">Hi, I'm</p>
        <h1 className="lux-hero-name">Yesha</h1>
        <p className="lux-hero-bio">
          {bio ?? 'Full stack developer crafting polished interfaces, resilient backend systems, and AI-powered products that feel calm, fast, and human.'}
        </p>
        <div className="lux-hero-actions">
          <a className="lux-hero-btn lux-hero-btn-solid" href={resumeData.personalInfo.resumePdf}>
            Resume <ArrowUpRight size={17} strokeWidth={1.8} />
          </a>
          <a className="lux-hero-btn lux-hero-btn-glass" href={`mailto:${resumeData.personalInfo.email}`}>
            <Mail size={16} strokeWidth={1.8} /> Let's Talk
          </a>
        </div>
      </div>

      <div ref={ringRef} className="lux-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="lux-cursor-dot" aria-hidden="true" />
      {SHOW_GAZE_ACCURACY_DEBUG && (
        <>
          <pre ref={debugPanelRef} className="lux-gaze-debug-panel" aria-hidden="true" />
          <div ref={debugLabelRef} className="lux-gaze-debug-label" aria-hidden="true" />
        </>
      )}

    </section>
  );
}
