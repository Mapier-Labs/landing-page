"use client";

import { useEffect } from "react";
import { ICON_VARIANTS } from "@/components/landing/landingConfig";

export function useDraggableLanding() {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const draggables = document.querySelectorAll<HTMLElement>(".draggable");
    let topZ = 30;
    let resetting = false;

    const appIconImg = document.getElementById("app-icon-img") as HTMLImageElement | null;
    if (appIconImg) {
      appIconImg.src = ICON_VARIANTS[Math.floor(Math.random() * ICON_VARIANTS.length)];
    }

    draggables.forEach((el) => {
      (el as HTMLElement & { _initStyle?: string })._initStyle = el.getAttribute("style") ?? "";
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
          }
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
      const ext = el as HTMLElement & {
        _baseRotate?: number;
        _hoverRotate?: number;
        _initStyle?: string;
      };
      ext._baseRotate = baseRotate;
      ext._hoverRotate = baseRotate;

      const onMouseEnter = () => {
        if (dragging || resetting) return;
        hovering = true;
        const nudge = (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 2);
        ext._hoverRotate = baseRotate + nudge;
        el.style.transform = `rotate(${ext._hoverRotate}deg)`;
      };

      const onMouseLeave = () => {
        if (dragging) return;
        hovering = false;
        el.style.transform = `rotate(${baseRotate}deg)`;
      };

      const onGrab = (e: MouseEvent | TouchEvent) => {
        if (resetting) return;
        const target = e.target as HTMLElement;
        if (target.closest("a[href]")) return;
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

        const base = hovering ? ext._hoverRotate : baseRotate;
        grabRotate = Number((base! + (Math.random() - 0.5) * 4).toFixed(1));
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
          }
        );

        bounce.onfinish = () => {
          bounce.cancel();
          el.style.transform = "rotate(0deg)";
          el.style.filter = "";
          ext._baseRotate = 0;
          ext._hoverRotate = 0;
        };

        createBurst(el);
      };

      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
      el.addEventListener("mousedown", onGrab);
      el.addEventListener("touchstart", onGrab as EventListener, {
        passive: false,
      });
      document.addEventListener("mousemove", onMove);
      document.addEventListener("touchmove", onMove as EventListener, {
        passive: false,
      });
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
          { duration: dur, easing: "ease-out", fill: "forwards" }
        );

        window.setTimeout(() => line.remove(), dur + 50);
      }
    }

    const resetBtn = document.querySelector(".reset-btn");
    if (resetBtn && !isMobile) {
      resetBtn.addEventListener("click", () => {
        if (resetting) return;
        resetting = true;

        const items = Array.from(draggables);
        const totalDur = 450;
        let finished = 0;

        const snapshots = items.map((el) => {
          const from = (el as HTMLElement).getBoundingClientRect();
          const initStyle = (el as HTMLElement & { _initStyle?: string })._initStyle ?? "";

          const clone = el.cloneNode(true) as HTMLElement;
          clone.setAttribute("style", initStyle);
          clone.style.visibility = "hidden";
          clone.style.pointerEvents = "none";
          document.body.appendChild(clone);
          const to = clone.getBoundingClientRect();
          clone.remove();

          return {
            el: el as HTMLElement,
            dx: to.left - from.left,
            dy: to.top - from.top,
            initRotate: (el as HTMLElement).dataset.initRotate ?? "0",
          };
        });

        snapshots.forEach((s, i) => {
          const anim = s.el.animate(
            [
              { transform: "translate(0,0) rotate(0deg)" },
              {
                transform: `translate(${s.dx}px,${s.dy}px) rotate(${s.initRotate}deg)`,
              },
            ],
            {
              duration: totalDur,
              easing: "cubic-bezier(0.25, 1, 0.5, 1)",
              delay: i * 20,
              fill: "forwards",
            }
          );

          anim.onfinish = () => {
            s.el.setAttribute(
              "style",
              (s.el as HTMLElement & { _initStyle?: string })._initStyle ?? ""
            );
            anim.cancel();
            const ext = s.el as HTMLElement & { _baseRotate?: number; _hoverRotate?: number };
            ext._baseRotate = parseFloat(s.initRotate) || 0;
            ext._hoverRotate = ext._baseRotate;
            finished++;
            if (finished === items.length) {
              resetting = false;
              topZ = 30;
            }
          };
        });

        const svg = document.querySelector(".reset-btn svg");
        if (svg) {
          svg.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(-360deg)" }], {
            duration: totalDur,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          });
        }
      });
    }
  }, []);
}
