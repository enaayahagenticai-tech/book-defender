// journey-app.jsx — Composes the BookSentinel operator journey on a design canvas

function App() {
  const ios = (label, Comp, idx) => (
    <DCArtboard id={`m${idx}`} label={`${String(idx).padStart(2,'0')} · ${label}`} width={402} height={874}>
      <IOSDevice dark={false}>
        <Comp />
      </IOSDevice>
    </DCArtboard>
  );

  return (
    <DesignCanvas>
      <DCSection
        id="journey"
        title="Operator Journey"
        subtitle="The full takedown flow — alert to resolution. Read left-to-right, top-to-bottom."
      >
        {ios('Airlock · FaceID lock',         S1_Airlock,     1)}
        {ios('Push alert · lock screen',      S3_Notification,2)}
        {ios('Command Center · HUD',          S2_Command,     3)}
        {ios('Threat Detail · inspection',    S4_Threat,      4)}
        {ios('Swipe to Purge · mid-swipe',    S5_Swipe,       5)}
        {ios('Biometric Authorization',       S6_Biometric,   6)}
        {ios('Evidence Bundling',             S7_Evidence,    7)}
        {ios('Resolved · queue continues',    S8_Resolution,  8)}
      </DCSection>

      <DCSection
        id="evidence"
        title="Forensic Evidence Bundle"
        subtitle="The court-admissible PDF that gets attached to every takedown notice. 4 pages: cover, capture, fingerprint, statement."
      >
        <DCArtboard id="pdf" label="NOTICE-2031.pdf · 4 pages" width={660} height={3360}>
          <PDF_Bundle />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="dmca"
        title="Outbound Notice"
        subtitle="The formal DMCA / EUCD §17 takedown message we dispatch to the host, registrar, and CDN — paired with the PDF evidence bundle."
      >
        <DCArtboard id="dmca" label="DMCA Notice · email letter" width={768} height={1400}>
          <DMCA_Notice />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// Inject the pulse keyframe once
if (typeof document !== 'undefined' && !document.getElementById('journey-anim')) {
  const s = document.createElement('style');
  s.id = 'journey-anim';
  s.textContent = `
    @keyframes jPulse {
      0%,100% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
      50%     { box-shadow: 0 0 0 6px transparent; opacity: .55; }
    }
  `;
  document.head.appendChild(s);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
