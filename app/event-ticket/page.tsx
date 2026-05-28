import { EventTicket } from '@/components/event-ticket';

const CARD_W = 1907;
const CARD_H = 953;
const PREVIEW_SCALE = 0.7;

export default function EventTicketDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#D9E3EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: CARD_W * PREVIEW_SCALE,
          height: CARD_H * PREVIEW_SCALE,
          boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: 'top left',
          }}
        >
          <EventTicket
            invitationLabel="You are invited to"
            title={'Online Event \nPlanning 101'}
            description="Plan better than event. (this is the description for the event.)"
            date="Oct 12-14, 2026"
            location="Los Angeles, CA"
            locationLong={'Los Angeles,\nCalifornia'}
            host={{
              label: 'Host by',
              name: 'MAPI',
              sticker: '/event-ticket/host-mapi.png',
            }}
            participants={{
              label: 'Participants',
              name: 'Bruce',
              sticker: '/event-ticket/participants.png',
            }}
            ctaLabel="Accept Invite"
            textureImage="/event-ticket/paper-texture.png"
            barcodeImage="/event-ticket/barcode.png"
          />
        </div>
      </div>
    </div>
  );
}
