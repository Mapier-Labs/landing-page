"use client";

import { useEffect, useRef } from "react";

interface Spring {
  pos: number;
  vel: number;
  target: number;
  k: number;
  d: number;
  m?: number;
}

export function MapiHat({ size = 160, skipIntro = false }: { size?: number; skipIntro?: boolean }) {
  const hatGroupRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const plRef = useRef<SVGGElement>(null);
  const prRef = useRef<SVGGElement>(null);
  const smileRef = useRef<SVGPathElement>(null);
  const tokRef = useRef(0);
  const idleRafRef = useRef<number | null>(null);

  useEffect(() => {
    const hatGroup = hatGroupRef.current;
    const eyesG = eyesRef.current;
    const pl = plRef.current;
    const pr = prRef.current;
    const smile = smileRef.current;
    if (!hatGroup || !eyesG || !pl || !pr || !smile) return;

    const PL0 = { x: 91, y: 94 };
    const PR0 = { x: 150, y: 94 };
    const H = { ty: 0, sx: 1, sy: 1, rot: 0 };
    const E = { sy: 1 };
    const P = { lx: PL0.x, ly: PL0.y, rx: PR0.x, ry: PR0.y, ps: 1 };
    let smileOp = 0;

    function applyAll() {
      hatGroup!.style.transform = `translateY(${H.ty}px) rotate(${H.rot}deg) scaleX(${H.sx}) scaleY(${H.sy})`;
      eyesG!.style.transform = `scaleY(${E.sy})`;
      pl!.setAttribute("transform", `translate(${P.lx},${P.ly}) scale(${P.ps})`);
      pr!.setAttribute("transform", `translate(${P.rx},${P.ry}) scale(${P.ps})`);
      smile!.setAttribute("opacity", String(smileOp));
    }

    function phase(token: number, springs: Spring[], onFrame: () => void): Promise<void> {
      return new Promise((resolve) => {
        if (token !== tokRef.current) {
          resolve();
          return;
        }
        const dt = 1 / 60;
        function step() {
          if (token !== tokRef.current) {
            resolve();
            return;
          }
          let done = true;
          for (const s of springs) {
            const f = -s.k * (s.pos - s.target) - s.d * s.vel;
            s.vel += (f / (s.m ?? 1)) * dt;
            s.pos += s.vel * dt;
            if (Math.abs(s.pos - s.target) > 0.0015 || Math.abs(s.vel) > 0.0015) done = false;
            else s.pos = s.target;
          }
          onFrame();
          if (done) resolve();
          else requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    function stopIdle() {
      if (idleRafRef.current !== null) {
        cancelAnimationFrame(idleRafRef.current);
        idleRafRef.current = null;
      }
    }

    function startFloat(token: number) {
      const t0 = performance.now();
      function tick(now: number) {
        if (token !== tokRef.current) return;
        const e = now - t0;
        const phi = (e / 3800) * Math.PI * 2;
        H.ty = -Math.sin(phi) * 8;
        H.rot = Math.sin(phi * 0.55) * 1.2;
        hatGroup!.style.transform = `translateY(${H.ty}px) rotate(${H.rot}deg) scaleX(${H.sx}) scaleY(${H.sy})`;
        idleRafRef.current = requestAnimationFrame(tick);
      }
      idleRafRef.current = requestAnimationFrame(tick);
    }

    async function run() {
      tokRef.current++;
      const t = tokRef.current;
      stopIdle();
      smileOp = 0;

      // skipIntro: hat appears in place immediately, skip straight to eyes opening
      if (skipIntro) {
        H.ty = 0;
        H.sx = 1;
        H.sy = 1;
        H.rot = 0;
        E.sy = 0;
        P.lx = PL0.x;
        P.ly = PL0.y;
        P.rx = PR0.x;
        P.ry = PR0.y;
        P.ps = 1;
        applyAll();

        const eyeOpen: Spring = { pos: 0, vel: 0, target: 1, k: 900, d: 16 };
        await phase(t, [eyeOpen], () => {
          E.sy = eyeOpen.pos;
          applyAll();
        });
        if (t !== tokRef.current) return;

        const plxL: Spring = { pos: P.lx, vel: 0, target: PL0.x - 5, k: 400, d: 18 };
        const plyL: Spring = { pos: P.ly, vel: 0, target: PL0.y + 5, k: 400, d: 18 };
        const prxL: Spring = { pos: P.rx, vel: 0, target: PR0.x - 5, k: 400, d: 18 };
        const pryL: Spring = { pos: P.ry, vel: 0, target: PR0.y + 5, k: 400, d: 18 };
        await phase(t, [plxL, plyL, prxL, pryL], () => {
          P.lx = plxL.pos;
          P.ly = plyL.pos;
          P.rx = prxL.pos;
          P.ry = pryL.pos;
          applyAll();
        });
        if (t !== tokRef.current) return;

        const plxS: Spring = { pos: P.lx, vel: 0, target: PL0.x, k: 400, d: 18 };
        const plyS: Spring = { pos: P.ly, vel: 0, target: PL0.y, k: 400, d: 18 };
        const prxS: Spring = { pos: P.rx, vel: 0, target: PR0.x, k: 400, d: 18 };
        const pryS: Spring = { pos: P.ry, vel: 0, target: PR0.y, k: 400, d: 18 };
        const psG: Spring = { pos: 1, vel: 0, target: 1.38, k: 600, d: 18 };
        const smG: Spring = { pos: 0, vel: 0, target: 1, k: 400, d: 16 };
        await phase(t, [plxS, plyS, prxS, pryS, psG, smG], () => {
          P.lx = plxS.pos;
          P.ly = plyS.pos;
          P.rx = prxS.pos;
          P.ry = pryS.pos;
          P.ps = psG.pos;
          smileOp = Math.max(0, Math.min(1, smG.pos));
          applyAll();
        });
        if (t !== tokRef.current) return;

        startFloat(t);
        const LOOKS: [number, number][] = [
          [-5, -5],
          [5, -5],
          [-5, 5],
          [-6, 0],
          [5, 5],
          [6, 0],
        ];
        let li = 0;
        while (t === tokRef.current) {
          const [dx, dy] = LOOKS[li % LOOKS.length];
          const isFirst = li === 0;
          const ss: Spring[] = [
            { pos: P.lx, vel: 0, target: PL0.x + dx, k: 90, d: 12 },
            { pos: P.ly, vel: 0, target: PL0.y + dy, k: 90, d: 12 },
            { pos: P.rx, vel: 0, target: PR0.x + dx, k: 90, d: 12 },
            { pos: P.ry, vel: 0, target: PR0.y + dy, k: 90, d: 12 },
          ];
          if (isFirst) ss.push({ pos: P.ps, vel: 0, target: 1, k: 200, d: 16 });
          await phase(t, ss, () => {
            P.lx = ss[0].pos;
            P.ly = ss[1].pos;
            P.rx = ss[2].pos;
            P.ry = ss[3].pos;
            if (isFirst) P.ps = ss[4].pos;
            applyAll();
          });
          li++;
        }
        return;
      }

      H.ty = -400;
      H.sx = 1;
      H.sy = 1;
      H.rot = 0;
      E.sy = 0;
      P.lx = PL0.x;
      P.ly = PL0.y;
      P.rx = PR0.x;
      P.ry = PR0.y;
      P.ps = 1;
      applyAll();

      // Phase 1+2: Drop + squash on impact (eyes hidden)
      await new Promise<void>((resolve) => {
        if (t !== tokRef.current) {
          resolve();
          return;
        }
        const dt = 1 / 60;
        let landed = false;
        const drop = { pos: -400, vel: 0 };
        const sxS: Spring = { pos: 1, vel: 0, target: 1, k: 900, d: 14 };
        const syS: Spring = { pos: 1, vel: 0, target: 1, k: 900, d: 14 };
        const SQUASH_SX = 1.3;
        const SQUASH_SY = 0.68;
        function step() {
          if (t !== tokRef.current) {
            resolve();
            return;
          }
          if (!landed) {
            const f = -420 * drop.pos - 22 * drop.vel;
            drop.vel += f * dt;
            drop.pos += drop.vel * dt;
            H.ty = drop.pos;
            if (drop.pos >= -1) {
              drop.pos = 0;
              H.ty = 0;
              landed = true;
              sxS.target = SQUASH_SX;
              syS.target = SQUASH_SY;
            }
          }
          if (landed) {
            for (const s of [sxS, syS]) {
              const f = -s.k * (s.pos - s.target) - s.d * s.vel;
              s.vel += f * dt;
              s.pos += s.vel * dt;
            }
            H.sx = sxS.pos;
            H.sy = syS.pos;
          }
          applyAll();
          const done =
            landed &&
            Math.abs(sxS.pos - SQUASH_SX) < 0.002 &&
            Math.abs(syS.pos - SQUASH_SY) < 0.002;
          if (done) resolve();
          else requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      if (t !== tokRef.current) return;

      // Phase 3: Snap back
      const sxN: Spring = { pos: H.sx, vel: 0, target: 1, k: 520, d: 26 };
      const syN: Spring = { pos: H.sy, vel: 0, target: 1, k: 520, d: 26 };
      await phase(t, [sxN, syN], () => {
        H.sx = sxN.pos;
        H.sy = syN.pos;
        applyAll();
      });
      if (t !== tokRef.current) return;

      // Phase 4: Eyes open
      const eyeOpen: Spring = { pos: 0, vel: 0, target: 1, k: 900, d: 16 };
      await phase(t, [eyeOpen], () => {
        E.sy = eyeOpen.pos;
        applyAll();
      });
      if (t !== tokRef.current) return;

      // Phase 5: Look bottom-left
      const plxL: Spring = { pos: P.lx, vel: 0, target: PL0.x - 5, k: 400, d: 18 };
      const plyL: Spring = { pos: P.ly, vel: 0, target: PL0.y + 5, k: 400, d: 18 };
      const prxL: Spring = { pos: P.rx, vel: 0, target: PR0.x - 5, k: 400, d: 18 };
      const pryL: Spring = { pos: P.ry, vel: 0, target: PR0.y + 5, k: 400, d: 18 };
      await phase(t, [plxL, plyL, prxL, pryL], () => {
        P.lx = plxL.pos;
        P.ly = plyL.pos;
        P.rx = prxL.pos;
        P.ry = pryL.pos;
        applyAll();
      });
      if (t !== tokRef.current) return;

      // Phase 6: Look straight + pupils grow + smile — all simultaneous
      const plxS: Spring = { pos: P.lx, vel: 0, target: PL0.x, k: 400, d: 18 };
      const plyS: Spring = { pos: P.ly, vel: 0, target: PL0.y, k: 400, d: 18 };
      const prxS: Spring = { pos: P.rx, vel: 0, target: PR0.x, k: 400, d: 18 };
      const pryS: Spring = { pos: P.ry, vel: 0, target: PR0.y, k: 400, d: 18 };
      const psG: Spring = { pos: 1, vel: 0, target: 1.38, k: 600, d: 18 };
      const smG: Spring = { pos: 0, vel: 0, target: 1, k: 400, d: 16 };
      await phase(t, [plxS, plyS, prxS, pryS, psG, smG], () => {
        P.lx = plxS.pos;
        P.ly = plyS.pos;
        P.rx = prxS.pos;
        P.ry = pryS.pos;
        P.ps = psG.pos;
        smileOp = Math.max(0, Math.min(1, smG.pos));
        applyAll();
      });
      if (t !== tokRef.current) return;

      // Phase 7+: Float + wonder loop
      startFloat(t);
      const LOOKS: [number, number][] = [
        [-5, -5],
        [5, -5],
        [-5, 5],
        [-6, 0],
        [5, 5],
        [6, 0],
      ];
      let lookIdx = 0;

      while (t === tokRef.current) {
        const [dx, dy] = LOOKS[lookIdx % LOOKS.length];
        const isFirst = lookIdx === 0;
        const springs: Spring[] = [
          { pos: P.lx, vel: 0, target: PL0.x + dx, k: 90, d: 12 },
          { pos: P.ly, vel: 0, target: PL0.y + dy, k: 90, d: 12 },
          { pos: P.rx, vel: 0, target: PR0.x + dx, k: 90, d: 12 },
          { pos: P.ry, vel: 0, target: PR0.y + dy, k: 90, d: 12 },
        ];
        if (isFirst) springs.push({ pos: P.ps, vel: 0, target: 1, k: 200, d: 16 });

        await phase(t, springs, () => {
          P.lx = springs[0].pos;
          P.ly = springs[1].pos;
          P.rx = springs[2].pos;
          P.ry = springs[3].pos;
          if (isFirst) P.ps = springs[4].pos;
          applyAll();
        });

        lookIdx++;
      }
    }

    run();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      tokRef.current++;
      stopIdle();
    };
    // skipIntro is intentionally excluded — it only affects the initial sequence
    // and never changes while the component is mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const h = Math.round(size * (200 / 240));
  const hatTransform = skipIntro
    ? "translateY(0px) rotate(0deg) scaleX(1) scaleY(1)"
    : "translateY(-400px) rotate(0deg) scaleX(1) scaleY(1)";

  return (
    <div className="shrink-0" style={{ width: size, height: h }}>
      <svg
        width={size}
        height={h}
        viewBox="0 0 240 200"
        className="overflow-visible"
        aria-hidden="true"
      >
        <g
          ref={hatGroupRef}
          style={{
            transformOrigin: "50% 60%",
            transform: hatTransform,
            willChange: "transform",
          }}
        >
          <ellipse cx="120" cy="168" rx="82" ry="9" fill="rgba(0,0,0,0.25)" />
          <ellipse cx="120" cy="133" rx="95" ry="15" fill="#1e0a0e" />
          <ellipse cx="120" cy="128" rx="95" ry="15" fill="#5c2329" />
          <path d="M 58 126 L 58 100 A 62 64 0 0 1 182 100 L 182 126 Z" fill="#5c2329" />
          <path
            d="M 66 90 C 70 64 88 48 114 42"
            stroke="#8a3f50"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0.28"
          />
          <path d="M 58 110 Q 120 115 182 110 L 182 126 Q 120 131 58 126 Z" fill="#1e0a0e" />

          <g
            ref={eyesRef}
            style={{ transformOrigin: "50% 47%", transform: "scaleY(0)", willChange: "transform" }}
          >
            <circle cx="91" cy="94" r="20" fill="#EDEAE5" />
            <g ref={plRef} transform="translate(91,94)">
              <circle r="12.5" fill="#141010" />
              <circle cx="-5.5" cy="-5.5" r="4.5" fill="white" />
            </g>

            <circle cx="150" cy="94" r="20" fill="#EDEAE5" />
            <g ref={prRef} transform="translate(150,94)">
              <circle r="12.5" fill="#141010" />
              <circle cx="-5.5" cy="-5.5" r="4.5" fill="white" />
            </g>

            <path
              ref={smileRef}
              d="M 103 114 Q 121 125 139 114"
              stroke="#141010"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0"
            />
          </g>

          <path
            d="M 160 120 C 163 112 171 113 173 119 C 171 125 163 126 160 120 Z"
            fill="#3a1318"
          />
          <path
            d="M 186 120 C 183 112 175 113 173 119 C 175 125 183 126 186 120 Z"
            fill="#3a1318"
          />
          <ellipse cx="173" cy="119" rx="4" ry="5" fill="#1e0a0e" />
        </g>
      </svg>
    </div>
  );
}
