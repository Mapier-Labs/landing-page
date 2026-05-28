'use client';

import React, { CSSProperties } from 'react';
import { Barcode } from './Barcode';
import type { EventTicketProps } from './types';

/* ==================================================================
   EXACT FIGMA VALUES — node 7469:27151, Mapier Mobile App
   All dimensions/gaps/colors below are pulled from the Figma metadata.
   Card matches Figma frame 1907×953 (2.0:1).
   ================================================================== */

/* Card frame */
const CARD_W = 1907;
const CARD_H = 953;

/* Main content area */
const MAIN_X = 182;
const MAIN_Y = 162;
const MAIN_W = 1175;
const MAIN_H = 651;

/* Gaps */
const MAIN_GAP = 65;
const TITLE_GAP = 34;
const TIME_GAP_OUTER = 47;
const TIME_GAP_INNER = 16;
const BOTTOM_GAP = 34;

const TITLE_BLOCK_W = 560;
const TIME_BLOCK_W = 332;

/* Colors */
const INK = '#131311';
const CTA_BG = '#2d3e72';
const CTA_FG = '#f1ede8';

const NUNITO = '"Nunito", system-ui, sans-serif';
const HORNBILL = '"HornbillTrial-Bold", "Hornbill", "Fraunces", "DM Serif Display", Georgia, serif';

/* ------------------------------------------------------------------ */
/* Helper: rotated text whose visible bbox lands at (bboxX/Y/W/H)     */
/* ------------------------------------------------------------------ */

interface RotatedTextProps {
  bboxX: number;
  bboxY: number;
  bboxW: number;
  bboxH: number;
  unrotatedW: number;
  unrotatedH: number;
  rotateDeg: number;
  text: string;
  style?: CSSProperties;
}

const RotatedText: React.FC<RotatedTextProps> = ({
  bboxX,
  bboxY,
  bboxW,
  bboxH,
  unrotatedW,
  unrotatedH,
  rotateDeg,
  text,
  style,
}) => {
  const centerX = bboxX + bboxW / 2;
  const centerY = bboxY + bboxH / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: centerX - unrotatedW / 2,
        top: centerY - unrotatedH / 2,
        width: unrotatedW,
        height: unrotatedH,
        transform: `rotate(${rotateDeg}deg)`,
        whiteSpace: 'pre-line',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* ==================================================================
   Component
   ================================================================== */

export const EventTicket: React.FC<EventTicketProps> = ({
  invitationLabel = 'You are invited to',
  title,
  description,
  date,
  location,
  locationLong,
  host,
  participants,
  ctaLabel = 'Accept Invite',
  onAccept,
  textureImage,
  barcodeImage,
}) => {
  const stubLocation = locationLong ?? location;

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Paper background image */}
      {textureImage && (
        <img
          src={textureImage}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          draggable={false}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          position: 'absolute',
          left: MAIN_X,
          top: MAIN_Y,
          width: MAIN_W,
          height: MAIN_H,
          display: 'flex',
          flexDirection: 'column',
          gap: MAIN_GAP,
        }}
      >
        {/* TOP ROW */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          {/* Title block */}
          <div style={{ width: TITLE_BLOCK_W, display: 'flex', flexDirection: 'column', gap: TITLE_GAP }}>
            <p style={{ fontFamily: NUNITO, fontSize: 36, lineHeight: '36px', color: INK, fontWeight: 500, margin: 0 }}>
              {invitationLabel}
            </p>
            <h2
              style={{
                fontFamily: HORNBILL,
                fontSize: 98,
                lineHeight: '98px',
                color: INK,
                fontWeight: 700,
                letterSpacing: '-4.9px',
                margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {title}
            </h2>
            <p style={{ fontFamily: NUNITO, fontSize: 36, lineHeight: '36px', color: INK, fontWeight: 500, margin: 0 }}>
              {description}
            </p>
          </div>

          {/* Time / Location block */}
          <div
            style={{
              width: TIME_BLOCK_W,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: TIME_GAP_OUTER,
            }}
          >
            <p style={{ fontFamily: NUNITO, fontSize: 36, lineHeight: '36px', color: INK, fontWeight: 500, textAlign: 'right', margin: 0 }}>
              Time & Location
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: TIME_GAP_INNER }}>
              <p style={{ fontFamily: HORNBILL, fontSize: 48, lineHeight: '48px', color: INK, fontWeight: 700, letterSpacing: '-2.4px', textAlign: 'right', margin: 0 }}>
                {date}
              </p>
              <p style={{ fontFamily: HORNBILL, fontSize: 48, lineHeight: '48px', color: INK, fontWeight: 700, letterSpacing: '-2.4px', textAlign: 'right', margin: 0 }}>
                {location}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          {/* Left cluster: host + participants */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: BOTTOM_GAP, alignItems: 'flex-end' }}>
            {/* Host group */}
            <div style={{ width: 244, height: 195, position: 'relative', overflow: 'visible' }}>
              <div style={{ position: 'absolute', top: 8, left: 0 }}>
                <p style={{ fontFamily: NUNITO, fontSize: 24, lineHeight: '36px', color: INK, fontWeight: 500, margin: 0 }}>
                  {host.label ?? 'Host by'}
                </p>
                <p style={{ fontFamily: NUNITO, fontSize: 36, lineHeight: '36px', color: INK, fontWeight: 500, margin: 0 }}>
                  {host.name}
                </p>
              </div>
              {host.sticker && (
                <div
                  style={{
                    position: 'absolute',
                    left: 15,
                    top: 14,
                    width: 239,
                    height: 226,
                    transform: 'rotate(-17.15deg)',
                  }}
                >
                  <img
                    src={host.sticker}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    draggable={false}
                  />
                </div>
              )}
            </div>

            {/* Participants group */}
            <div style={{ width: 345, height: 195, position: 'relative', overflow: 'visible' }}>
              <div style={{ position: 'absolute', top: 8, left: 0 }}>
                <p style={{ fontFamily: NUNITO, fontSize: 24, lineHeight: '36px', color: INK, fontWeight: 500, margin: 0 }}>
                  {participants.label ?? 'Participants'}
                </p>
                <p style={{ fontFamily: NUNITO, fontSize: 36, lineHeight: '36px', color: INK, fontWeight: 500, margin: 0 }}>
                  {participants.name}
                </p>
              </div>
              {participants.sticker && (
                <div
                  style={{
                    position: 'absolute',
                    left: -13,
                    top: -42,
                    width: 375,
                    height: 339,
                  }}
                >
                  <img
                    src={participants.sticker}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={onAccept}
            style={{
              all: 'unset',
              cursor: 'pointer',
              boxSizing: 'border-box',
              width: 493,
              height: 100,
              backgroundColor: CTA_BG,
              borderRadius: 99,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '18px 28px',
              transition: 'transform 80ms ease, opacity 80ms ease',
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.92';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.opacity = '';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.opacity = '';
            }}
          >
            <span style={{ fontFamily: HORNBILL, color: CTA_FG, fontSize: 64, lineHeight: '64px', fontWeight: 700, letterSpacing: '-3.2px' }}>
              {ctaLabel}
            </span>
            <span style={{ color: CTA_FG, fontSize: 64, lineHeight: '64px', fontWeight: 700, marginLeft: 6 }}>
              →
            </span>
          </button>
        </div>
      </div>

      {/* STUB ELEMENTS */}

      {/* "Los Angeles, California" — top-left of stub */}
      <RotatedText
        bboxX={1495}
        bboxY={180}
        bboxW={70}
        bboxH={220}
        unrotatedW={220}
        unrotatedH={70}
        rotateDeg={-90}
        text={stubLocation}
        style={{
          fontFamily: NUNITO,
          color: INK,
          fontSize: 24,
          lineHeight: '36px',
          fontWeight: 500,
          textAlign: 'right',
        }}
      />

      {/* Barcode — middle of stub */}
      <div
        style={{
          position: 'absolute',
          left: 1505,
          top: 336,
          width: 115,
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {barcodeImage ? (
          <img src={barcodeImage} alt="" style={{ width: 115, height: 280, objectFit: 'contain' }} draggable={false} />
        ) : (
          <Barcode width={115} height={280} color={INK} />
        )}
      </div>

      {/* Stub title — right of stub, long vertical 2-column */}
      <RotatedText
        bboxX={1650}
        bboxY={191}
        bboxW={95}
        bboxH={570}
        unrotatedW={570}
        unrotatedH={95}
        rotateDeg={-90}
        text={title}
        style={{
          fontFamily: HORNBILL,
          color: INK,
          fontSize: 48,
          lineHeight: '48px',
          fontWeight: 700,
          letterSpacing: '-2.4px',
          textAlign: 'center',
        }}
      />

      {/* "Oct 12-14, 2026" — bottom-left of stub, LEFT-aligned */}
      <RotatedText
        bboxX={1495}
        bboxY={604}
        bboxW={70}
        bboxH={170}
        unrotatedW={170}
        unrotatedH={70}
        rotateDeg={-90}
        text={date}
        style={{
          fontFamily: NUNITO,
          color: INK,
          fontSize: 24,
          lineHeight: '36px',
          fontWeight: 500,
          textAlign: 'left',
        }}
      />
    </div>
  );
};
