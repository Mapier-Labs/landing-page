"use client";

import { Draggable } from "./Draggable";
import { LINKEDIN_URL } from "./landingConfig";

const PLACEHOLDER_IMG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function LandingHero() {
  return (
    <>
      <Draggable
        className="draggable--icon"
        initRotate={2}
        style={{
          left: "14%",
          top: "30%",
          width: 88,
          height: 88,
          zIndex: 22,
          transform: "rotate(2deg)",
        }}
      >
        <img id="app-icon-img" src={PLACEHOLDER_IMG} alt="Mapier" draggable={false} />
      </Draggable>

      <Draggable
        className="draggable--title"
        initRotate={-1}
        style={{
          left: "calc(14% + 102px)",
          top: "31%",
          zIndex: 21,
          transform: "rotate(-1deg)",
        }}
      >
        <h1>Mapier</h1>
      </Draggable>

      <Draggable
        className="draggable--desc"
        initRotate={0}
        style={{
          left: "14%",
          top: "48%",
          zIndex: 20,
          transform: "rotate(0deg)",
        }}
      >
        <p>
          Reimagine how you explore, create, and share maps — where artificial intelligence meets
          the art of cartography.
        </p>
      </Draggable>

      <Draggable
        className="draggable--btn"
        initRotate={0}
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
      </Draggable>

      <Draggable
        className="draggable--btn"
        initRotate={0}
        style={{
          left: "calc(14% + 210px)",
          top: "64%",
          zIndex: 19,
          transform: "rotate(0deg)",
        }}
      >
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--secondary btn--link"
        >
          Work With Us
        </a>
      </Draggable>
    </>
  );
}
