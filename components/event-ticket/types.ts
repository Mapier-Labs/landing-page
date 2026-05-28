export interface EventTicketProps {
  /** Small kicker text above the title. Defaults to "You are invited to". */
  invitationLabel?: string;
  /** Event title shown in serif font on the left side and rotated on the stub. */
  title: string;
  /** Event description / subtitle paragraph. */
  description: string;
  /** Date string, e.g. "Oct 12-14, 2026". */
  date: string;
  /** Short location label shown in the time/location block, e.g. "Los Angeles, CA". */
  location: string;
  /** Longer location text shown on the rotated stub. Falls back to `location`. */
  locationLong?: string;
  /** Host metadata. */
  host: {
    label?: string;
    name: string;
    sticker?: string; // src URL/path
  };
  /** Participants metadata. */
  participants: {
    label?: string;
    name: string;
    sticker?: string;
  };
  /** CTA button label. */
  ctaLabel?: string;
  /** Press handler for the CTA button. */
  onAccept?: () => void;
  /** Optional paper-texture background image used as the full card chrome. */
  textureImage?: string;
  /** Optional barcode image used on the stub. */
  barcodeImage?: string;
}
