"use client";

import { useEffect } from "react";

const iconVariants = [
  "/landing/app icon/Property 1=Default.png",
  "/landing/app icon/Property 1=Variant2.png",
  "/landing/app icon/Property 1=Variant3.png",
];

export function LandingExperience() {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const draggables = document.querySelectorAll<HTMLElement>(".draggable");
    let topZ = 30;
    let resetting = false;

    const appIconImg = document.getElementById("app-icon-img") as HTMLImageElement | null;
    if (appIconImg) {
      const picked = iconVariants[Math.floor(Math.random() * iconVariants.length)];
      appIconImg.src = picked;
    }

    draggables.forEach((el) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el as any)._initStyle = el.getAttribute("style") ?? "";
    });

    if (!isMobile) {
      draggables.forEach((el) => initDraggable(el as HTMLElement));
    }

    if (!isMobile) {
      draggables.forEach((el, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 18 + Math.random() * 14;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const base = (el as HTMLElement).style.transform;
        (el as HTMLElement).animate(
          [{ transform: `translate(${dx}px, ${dy}px) ${base}` }, { transform: base }],
          {
            duration: 1400 + Math.random() * 400,
            easing: "cubic-bezier(0.08, 0.6, 0.18, 1)",
            delay: i * 60,
            fill: "backwards",
          },
        );
      });
    }

    function initDraggable(el: HTMLElement) {
      let dragging = false;
      let hovering = false;
      let ox = 0;
      let oy = 0;
      let grabRotate = 0;

      const baseRotate = parseFloat(el.dataset.initRotate ?? "0") || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el as any)._baseRotate = baseRotate;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (el as any)._hoverRotate = baseRotate;

      const onMouseEnter = () => {
        if (dragging || resetting) return;
        hovering = true;
        const nudge = (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 2);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (el as any)._hoverRotate = baseRotate + nudge;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        el.style.transform = `rotate(${(el as any)._hoverRotate}deg)`;
      };

      const onMouseLeave = () => {
        if (dragging) return;
        hovering = false;
        el.style.transform = `rotate(${baseRotate}deg)`;
      };

      const onGrab = (e: MouseEvent | TouchEvent) => {
        if (resetting) return;
        e.preventDefault();
        dragging = true;
        topZ += 1;
        el.style.zIndex = String(topZ);

        const pt = "touches" in e ? e.touches[0] : e;
        const rect = el.getBoundingClientRect();
        ox = pt.clientX - rect.left;
        oy = pt.clientY - rect.top;

        el.style.left = `${rect.left}px`;
        el.style.top = `${rect.top}px`;
        el.style.right = "auto";
        el.style.bottom = "auto";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const base = hovering ? (el as any)._hoverRotate : baseRotate;
        grabRotate = Number((base + (Math.random() - 0.5) * 4).toFixed(1));
        el.style.transform = `scale(0.92) rotate(${grabRotate}deg)`;
        el.classList.add("is-grabbing");
        document.body.classList.add("is-dragging");
      };

      const onMove = (e: MouseEvent | TouchEvent) => {
        if (!dragging) return;
        e.preventDefault();
        const pt = "touches" in e ? e.touches[0] : e;
        el.style.left = `${pt.clientX - ox}px`;
        el.style.top = `${pt.clientY - oy}px`;
      };

      const onRelease = () => {
        if (!dragging) return;
        dragging = false;
        hovering = false;
        el.classList.remove("is-grabbing");
        document.body.classList.remove("is-dragging");

        const bounce = el.animate(
          [
            {
              transform: `scale(0.92) rotate(${grabRotate}deg)`,
              filter: "drop-shadow(0px 16px 28px rgba(0,0,0,0.20))",
            },
            {
              transform: "scale(1) rotate(0deg)",
              filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.10))",
            },
          ],
          {
            duration: 350,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          },
        );

        bounce.onfinish = () => {
          bounce.cancel();
          el.style.transform = "rotate(0deg)";
          el.style.filter = "";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (el as any)._baseRotate = 0;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (el as any)._hoverRotate = 0;
        };

        createBurst(el);
      };

      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
      el.addEventListener("mousedown", onGrab);
      el.addEventListener("touchstart", onGrab as EventListener, { passive: false });
      document.addEventListener("mousemove", onMove);
      document.addEventListener("touchmove", onMove as EventListener, { passive: false });
      document.addEventListener("mouseup", onRelease);
      document.addEventListener("touchend", onRelease);
    }

    function createBurst(el: HTMLElement) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = Math.max(rect.width, rect.height) * 0.48;

      const count = 7 + Math.floor(Math.random() * 3);
      const angleStep = 360 / count;

      for (let i = 0; i < count; i += 1) {
        const angle = angleStep * i + (Math.random() - 0.5) * angleStep * 0.6;
        const rad = (angle * Math.PI) / 180;
        const dist = radius + 6 + Math.random() * 8;
        const len = 11 + Math.random() * 15;

        const line = document.createElement("div");
        line.className = "burst-line";
        line.style.width = `${len}px`;
        line.style.left = `${cx + Math.cos(rad) * dist}px`;
        line.style.top = `${cy + Math.sin(rad) * dist - 1.25}px`;
        document.body.appendChild(line);

        const dur = 300 + Math.random() * 100;
        line.animate(
          [
            { opacity: 0, transform: `rotate(${angle}deg) scaleX(0)` },
            {
              opacity: 0.8,
              transform: `rotate(${angle}deg) scaleX(1)`,
              offset: 0.25,
            },
            {
              opacity: 0.4,
              transform: `rotate(${angle}deg) scaleX(0.85)`,
              offset: 0.6,
            },
            { opacity: 0, transform: `rotate(${angle}deg) scaleX(0.6)` },
          ],
          { duration: dur, easing: "ease-out", fill: "forwards" },
        );

        window.setTimeout(() => line.remove(), dur + 50);
      }
    }
  }, []);

  return (
    <>
      <div className="bg" />

      <button className="reset-btn" type="button" title="Reset layout">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>

      <div
        className="draggable draggable--icon"
        data-init-rotate="2"
        style={{
          left: "14%",
          top: "30%",
          width: 88,
          height: 88,
          zIndex: 22,
          transform: "rotate(2deg)",
        }}
      >
        <img
          id="app-icon-img"
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="Mapier"
          draggable={false}
        />
      </div>

      <div
        className="draggable draggable--title"
        data-init-rotate="-1"
        style={{
          left: "calc(14% + 102px)",
          top: "31%",
          zIndex: 21,
          transform: "rotate(-1deg)",
        }}
      >
        <h1>Mapier</h1>
      </div>

      <div
        className="draggable draggable--desc"
        data-init-rotate="0"
        style={{
          left: "14%",
          top: "48%",
          zIndex: 20,
          transform: "rotate(0deg)",
        }}
      >
        <p>
          Reimagine how you explore, create, and share maps — where artificial intelligence meets the
          art of cartography.
        </p>
      </div>

      <div
        className="draggable draggable--btn"
        data-init-rotate="0"
        style={{
          left: "14%",
          top: "64%",
          zIndex: 20,
          transform: "rotate(0deg)",
        }}
      >
        <div className="btn btn--cta">
          Join the Waitlist
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>

      <div
        className="draggable draggable--btn"
        data-init-rotate="0"
        style={{
          left: "calc(14% + 210px)",
          top: "64%",
          zIndex: 19,
          transform: "rotate(0deg)",
        }}
      >
        <div className="btn btn--secondary">Work With Us</div>
      </div>

      <div
        className="draggable draggable--phone"
        data-init-rotate="3"
        style={{
          left: "64%",
          top: "12%",
          width: 260,
          zIndex: 18,
          transform: "rotate(3deg)",
        }}
      >
        <img src="/landing/stickers/phone.png" alt="Mapier App" draggable={false} />
      </div>

      <div
        className="draggable"
        data-init-rotate="-12"
        style={{
          left: "-2%",
          top: "-3%",
          width: 150,
          zIndex: 13,
          transform: "rotate(-12deg)",
        }}
      >
        <img src="/landing/stickers/Frame 3185590.png" alt="" draggable={false} />
      </div>

      <div
        className="draggable"
        data-init-rotate="5"
        style={{
          right: "45%",
          top: "50%",
          width: 80,
          zIndex: 11,
          transform: "rotate(5deg)",
        }}
      >
        <img src="/landing/stickers/Frame 3185629.png" alt="" draggable={false} />
      </div>

      <div
        className="draggable"
        data-init-rotate="8"
        style={{
          left: "88%",
          top: "-4%",
          width: 130,
          zIndex: 14,
          transform: "rotate(8deg)",
        }}
      >
        <img src="/landing/stickers/Group 210.png" alt="" draggable={false} />
      </div>

      <div
        className="draggable"
        data-init-rotate="10"
        style={{
          left: "-2%",
          top: "80%",
          width: 90,
          zIndex: 10,
          transform: "rotate(10deg)",
        }}
      >
        <img src="/landing/stickers/Group 2619.png" alt="" draggable={false} />
      </div>

      <div
        className="draggable"
        data-init-rotate="-6"
        style={{
          left: "92%",
          top: "62%",
          width: 85,
          zIndex: 10,
          transform: "rotate(-6deg)",
        }}
      >
        <img src="/landing/stickers/Group 2620.png" alt="" draggable={false} />
      </div>

      <div
        className="draggable"
        data-init-rotate="-4"
        style={{
          left: "30%",
          top: "76%",
          width: 135,
          zIndex: 15,
          transform: "rotate(-4deg)",
        }}
      >
        <img src="/landing/stickers/Group 2625.png" alt="" draggable={false} />
      </div>

      <div
        className="draggable"
        data-init-rotate="4"
        style={{
          left: "76%",
          top: "74%",
          width: 140,
          zIndex: 14,
          transform: "rotate(4deg)",
        }}
      >
        <img src="/landing/stickers/Group 2626.png" alt="" draggable={false} />
      </div>
    </>
  );
}
