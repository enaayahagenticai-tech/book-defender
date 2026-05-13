// journey-screens.jsx — BookSentinel operator journey, mobile screens
// All screens use the cream/coral/brown palette consistent with BookSentinel Cream.html.

const J_C = {
  bg0: '#F4EDDF', bg1: '#ECE2CC', bg2: '#FAF6EC', bg3: '#E2D5BA',
  line: 'rgba(64,38,22,.12)', line2: 'rgba(64,38,22,.22)',
  fg1: '#2A1810', fg2: '#5C4632', fg3: '#8B7355', fg4: '#B8A687',
  primary: '#C15F3C', primary2: '#D97757', primarySoft: 'rgba(193,95,60,.10)',
  success: '#6B7F4A', successSoft: 'rgba(107,127,74,.12)',
  warning: '#C8841C', warningSoft: 'rgba(200,132,28,.12)',
  destructive: '#A4361F', destructiveSoft: 'rgba(164,54,31,.10)',
};

const J_FONT = '-apple-system, "SF Pro Text", "Inter", system-ui, sans-serif';
const J_MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

// ───── Primitives ─────
const Eyebrow = ({ children, color = J_C.fg3 }) => (
  <div style={{ fontFamily: J_MONO, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color }}>{children}</div>
);

const Mono = ({ children, size = 12, weight = 400, color = J_C.fg1, style = {} }) => (
  <span style={{ fontFamily: J_MONO, fontSize: size, fontWeight: weight, color, ...style }}>{children}</span>
);

const Corner = ({ pos, color = J_C.primary }) => {
  const s = { position: 'absolute', width: 8, height: 8 };
  if (pos === 'tl') Object.assign(s, { top: -1, left: -1, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` });
  if (pos === 'tr') Object.assign(s, { top: -1, right: -1, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` });
  if (pos === 'bl') Object.assign(s, { bottom: -1, left: -1, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` });
  if (pos === 'br') Object.assign(s, { bottom: -1, right: -1, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` });
  return <div style={s} />;
};
const FourCorners = ({ color }) => (
  <>
    <Corner pos="tl" color={color} /><Corner pos="tr" color={color} />
    <Corner pos="bl" color={color} /><Corner pos="br" color={color} />
  </>
);

const Dot = ({ c, size = 6, pulse = false }) => (
  <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: 99, background: c,
    boxShadow: pulse ? `0 0 0 0 ${c}` : 'none',
    animation: pulse ? 'jPulse 1.8s ease-in-out infinite' : 'none',
  }} />
);

const GridBg = ({ size = 16, alpha = .05 }) => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: `linear-gradient(to right, rgba(64,38,22,${alpha}) 1px, transparent 1px),linear-gradient(to bottom, rgba(64,38,22,${alpha}) 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  }} />
);

// Tab bar at bottom (iOS-style for our app)
const TabBar = ({ active = 'command' }) => {
  const items = [
    { id: 'command',  label: 'COMMAND',  icon: '◧' },
    { id: 'takedown', label: 'TAKEDOWN', icon: '⌖' },
    { id: 'registry', label: 'REGISTRY', icon: '▦' },
    { id: 'settings', label: 'SYSTEM',   icon: '⚙' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: J_C.bg2, borderTop: `1px solid ${J_C.line}`,
      padding: '8px 12px 28px', display: 'flex', gap: 4, justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const isActive = active === it.id;
        return (
          <div key={it.id} style={{ flex: 1, textAlign: 'center', padding: '6px 0' }}>
            <div style={{ fontSize: 18, color: isActive ? J_C.primary : J_C.fg3, lineHeight: 1 }}>{it.icon}</div>
            <div style={{ marginTop: 4, fontFamily: J_MONO, fontSize: 9, letterSpacing: '.18em', color: isActive ? J_C.primary : J_C.fg3 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const ScreenHeader = ({ title, subtitle, right }) => (
  <div style={{ padding: '12px 18px 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <div>
      <Eyebrow>{subtitle}</Eyebrow>
      <div style={{ marginTop: 4, fontFamily: J_FONT, fontSize: 26, fontWeight: 700, color: J_C.fg1, letterSpacing: '-0.02em' }}>{title}</div>
    </div>
    {right}
  </div>
);

const RiskBar = ({ value, height = 4 }) => {
  const c = value >= 85 ? J_C.destructive : value >= 70 ? J_C.warning : value >= 40 ? J_C.primary : J_C.success;
  return (
    <div style={{ height, borderRadius: 99, background: 'rgba(64,38,22,.10)', overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: c }} />
    </div>
  );
};

// ───── 1. AIRLOCK / FaceID ─────
function S1_Airlock() {
  return (
    <div style={{ background: J_C.bg0, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <GridBg size={24} alpha={.05} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(80% 60% at 50% 35%, rgba(193,95,60,.16), transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', padding: '90px 28px 0', textAlign: 'center' }}>
        <Eyebrow color={J_C.fg2}>AIRLOCK · v4.12</Eyebrow>
        <div style={{ marginTop: 12, fontFamily: J_FONT, fontSize: 30, fontWeight: 800, color: J_C.fg1, letterSpacing: '-0.03em' }}>
          BOOK<span style={{ color: J_C.primary }}>SENTINEL</span>
        </div>
        <div style={{ marginTop: 10, fontFamily: J_FONT, fontSize: 14, color: J_C.fg2, lineHeight: 1.5 }}>
          Awaiting biometric clearance.<br/>Hold the device to your face.
        </div>

        {/* Face scan card */}
        <div style={{
          marginTop: 56, position: 'relative', borderRadius: 14,
          background: J_C.bg2, border: `1px solid ${J_C.line2}`,
          padding: 28, boxShadow: '0 18px 48px -28px rgba(64,38,22,.25)',
        }}>
          <FourCorners color={J_C.primary} />
          <svg viewBox="0 0 200 200" style={{ width: 180, height: 180, margin: '0 auto', display: 'block' }}>
            <defs>
              <linearGradient id="airlockScan" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={J_C.primary} stopOpacity="0" />
                <stop offset="50%" stopColor={J_C.primary} stopOpacity=".55" />
                <stop offset="100%" stopColor={J_C.primary} stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke={J_C.primary} strokeWidth="2.4" fill="none">
              <path d="M20 60 V20 H60" /><path d="M140 20 H180 V60" />
              <path d="M180 140 V180 H140" /><path d="M60 180 H20 V140" />
            </g>
            <g stroke={J_C.fg3} strokeWidth="1.4" fill="none" opacity=".85">
              <ellipse cx="100" cy="100" rx="48" ry="60" />
              <circle cx="84" cy="92" r="3" fill={J_C.fg3} /><circle cx="116" cy="92" r="3" fill={J_C.fg3} />
              <path d="M84 122 q16 10 32 0" /><path d="M100 96 v18" />
            </g>
            <rect x="20" y="50" width="160" height="14" fill="url(#airlockScan)">
              <animate attributeName="y" values="40;150;40" dur="2.4s" repeatCount="indefinite" />
            </rect>
          </svg>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Dot c={J_C.primary} pulse />
            <Mono size={11} weight={600} color={J_C.primary} style={{ letterSpacing: '.22em' }}>VERIFYING…</Mono>
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${J_C.line}`, display: 'flex', justifyContent: 'space-between' }}>
            <Mono size={10} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>OPERATOR</Mono>
            <Mono size={10} color={J_C.fg2} style={{ letterSpacing: '.22em' }}>O. KESTREL · A4</Mono>
          </div>
        </div>

        <div style={{ marginTop: 18, fontFamily: J_MONO, fontSize: 10, color: J_C.fg3, letterSpacing: '.22em' }}>
          OR USE PASSCODE · SUPABASE AUTH
        </div>
      </div>
    </div>
  );
}

// ───── 2. COMMAND CENTER ─────
function S2_Command() {
  const stats = [
    { label: 'ACTIVE', value: 37, color: J_C.destructive },
    { label: 'PENDING', value: 12, color: J_C.warning },
    { label: 'PURGED', value: 204, color: J_C.success },
  ];
  return (
    <div style={{ background: J_C.bg0, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <ScreenHeader subtitle="MISSION · 24H · NORTH-AM" title="Command Center" right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 9px', border: `1px solid ${J_C.line2}`, borderRadius: 6 }}>
          <Dot c={J_C.success} pulse /><Mono size={9} color={J_C.fg2} style={{ letterSpacing: '.22em' }}>LIVE</Mono>
        </div>
      }/>

      <div style={{ padding: '20px 18px 0' }}>
        {/* System Health */}
        <div style={{ padding: 14, background: J_C.bg2, border: `1px solid ${J_C.line}`, borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>STATUS</Mono>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dot c={J_C.success} pulse />
              <Mono size={13} weight={600} color={J_C.success}>ONLINE</Mono>
            </div>
          </div>
          <div>
            <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>UPTIME</Mono>
            <Mono size={13} weight={600} color={J_C.fg1} style={{ display: 'block', marginTop: 4 }}>312d 04h</Mono>
          </div>
          <div>
            <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>LAST SCAN</Mono>
            <Mono size={13} weight={600} color={J_C.primary} style={{ display: 'block', marginTop: 4 }}>12s ago</Mono>
          </div>
        </div>

        {/* KPI tiles */}
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {stats.map(s => (
            <div key={s.label} style={{ padding: 12, background: J_C.bg2, border: `1px solid ${J_C.line}`, borderRadius: 8 }}>
              <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>{s.label}</Mono>
              <div style={{ marginTop: 4, fontFamily: J_FONT, fontSize: 26, fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Deploy scout button */}
        <button style={{
          marginTop: 12, width: '100%', padding: '14px',
          background: J_C.primary, color: '#FFF8EC', border: 0, borderRadius: 8,
          fontFamily: J_MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.22em',
        }}>⚡ DEPLOY SCOUT AGENT</button>

        {/* Active threats list */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Mono size={10} color={J_C.fg2} weight={700} style={{ letterSpacing: '.22em' }}>ACTIVE THREATS · 3 SHOWN</Mono>
            <Mono size={10} color={J_C.primary} style={{ letterSpacing: '.22em' }}>VIEW ALL →</Mono>
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'T-2031', dom: 'freebooks-vault[.]ru/atlas-of-fog', risk: 96 },
              { id: 'T-2024', dom: 'lit-mirror[.]to/shadow-archive',    risk: 88 },
              { id: 'T-2018', dom: 'phish-readers[.]xyz/login',         risk: 82 },
            ].map(t => (
              <div key={t.id} style={{
                padding: 12, background: J_C.bg2, border: `1px solid ${J_C.line}`, borderRadius: 8,
                boxShadow: `inset 3px 0 0 0 ${t.risk >= 85 ? J_C.destructive : J_C.warning}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Mono size={10} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>{t.id} · PIRATED PDF</Mono>
                  <Mono size={10} weight={700} color={t.risk >= 85 ? J_C.destructive : J_C.warning} style={{ letterSpacing: '.18em' }}>RISK {t.risk}</Mono>
                </div>
                <Mono size={13} weight={600} color={J_C.fg1} style={{ display: 'block', marginTop: 4 }}>{t.dom}</Mono>
                <div style={{ marginTop: 8 }}><RiskBar value={t.risk} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="command" />
    </div>
  );
}

// ───── 3. PUSH NOTIFICATION (lock screen) ─────
function S3_Notification() {
  return (
    <div style={{ background: '#1a1207', height: '100%', position: 'relative', overflow: 'hidden', color: '#FFF8EC' }}>
      {/* warm gradient bg suggesting dusk lock screen */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 50% at 50% 0%, rgba(193,95,60,.30), transparent 70%), radial-gradient(60% 60% at 50% 100%, rgba(107,127,74,.18), transparent 70%)' }} />
      {/* lock screen time */}
      <div style={{ position: 'relative', padding: '40px 24px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: J_FONT, fontSize: 13, color: 'rgba(255,248,236,.7)', letterSpacing: '.04em' }}>Tuesday, 14 May</div>
        <div style={{ fontFamily: J_FONT, fontSize: 84, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1, marginTop: 4 }}>14:08</div>

        {/* lock icon */}
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
            <rect x="3" y="11" width="16" height="13" rx="2" stroke="rgba(255,248,236,.85)" strokeWidth="1.6"/>
            <path d="M6 11V7a5 5 0 0 1 10 0v4" stroke="rgba(255,248,236,.85)" strokeWidth="1.6"/>
          </svg>
        </div>

        {/* notification banner */}
        <div style={{
          marginTop: 60, padding: 14, textAlign: 'left',
          background: 'rgba(255,248,236,.10)', backdropFilter: 'blur(20px) saturate(160%)',
          border: `1px solid rgba(255,248,236,.18)`, borderRadius: 16,
          boxShadow: '0 12px 32px rgba(0,0,0,.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: J_C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 3 5v6c0 5 3.8 9.5 9 11 5.2-1.5 9-6 9-11V5l-9-3Z" stroke="#FFF8EC" strokeWidth="1.6"/>
                <path d="M12 7v10M7 12h10" stroke="#FFF8EC" strokeWidth="1.6"/>
              </svg>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: J_FONT, fontSize: 13, fontWeight: 600, letterSpacing: '.02em', color: '#FFF8EC' }}>BOOKSENTINEL</div>
              <div style={{ fontFamily: J_FONT, fontSize: 12, color: 'rgba(255,248,236,.6)' }}>now</div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontFamily: J_FONT, fontSize: 15, fontWeight: 600, color: '#FFF8EC', letterSpacing: '-0.01em' }}>
            CRITICAL THREAT DETECTED
          </div>
          <div style={{ marginTop: 4, fontFamily: J_FONT, fontSize: 14, color: 'rgba(255,248,236,.78)', lineHeight: 1.4 }}>
            High-confidence vector on “Atlas of Fog” — risk 96. Action required.
          </div>
          {/* iOS interactive action buttons */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,248,236,.15)', display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '7px 0', fontFamily: J_FONT, fontSize: 13, color: 'rgba(255,248,236,.75)' }}>Ignore</div>
            <div style={{ flex: 1, textAlign: 'center', padding: '7px 0', fontFamily: J_FONT, fontSize: 13, fontWeight: 600, color: J_C.primary2 }}>Open</div>
          </div>
        </div>

        {/* tactical pre-brief */}
        <div style={{ marginTop: 16, padding: 12, textAlign: 'left', background: 'rgba(164,54,31,.18)', border: '1px solid rgba(164,54,31,.4)', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Mono size={9} color="rgba(255,248,236,.7)" style={{ letterSpacing: '.22em' }}>SECTOR · EU-WEST</Mono>
            <Mono size={9} weight={700} color="#FFB59A" style={{ letterSpacing: '.22em' }}>HIGH RISK</Mono>
          </div>
          <Mono size={11} color="#FFF8EC" weight={600} style={{ display: 'block', marginTop: 4 }}>freebooks-vault[.]ru/atlas-of-fog</Mono>
          <Mono size={10} color="rgba(255,248,236,.6)" style={{ display: 'block', marginTop: 2 }}>14 mirrors · OVHcloud · 1st seen 02:14:33Z</Mono>
        </div>
      </div>
    </div>
  );
}

// ───── 4. THREAT DETAIL (inspection) ─────
function S4_Threat() {
  return (
    <div style={{ background: J_C.bg0, height: '100%', position: 'relative', overflow: 'auto' }}>
      <ScreenHeader subtitle="T-2031 · INSPECTION" title="Threat Detail" right={
        <Mono size={11} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>← BACK</Mono>
      }/>

      <div style={{ padding: '18px 18px 100px' }}>
        {/* Hero summary */}
        <div style={{ padding: 16, background: J_C.bg2, border: `1px solid ${J_C.line2}`, borderRadius: 8, position: 'relative' }}>
          <FourCorners color={J_C.destructive} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Mono size={10} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>PIRATED PDF · 14 MIRRORS</Mono>
            <Mono size={11} weight={700} color={J_C.destructive} style={{ letterSpacing: '.18em' }}>⚠ RISK 96</Mono>
          </div>
          <Mono size={16} weight={700} color={J_C.fg1} style={{ display: 'block', marginTop: 8, wordBreak: 'break-all' }}>
            freebooks-vault[.]ru/atlas-of-fog
          </Mono>
          <div style={{ marginTop: 10 }}><RiskBar value={96} height={5} /></div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="HOST" v="OVHcloud · RU" />
            <Field label="REGISTRAR" v="r01-registrar" />
            <Field label="FIRST SEEN" v="2h 14m ago" />
            <Field label="MIRRORS" v="14 detected" />
          </div>
        </div>

        {/* Title attribution */}
        <Section title="MATCHED IP">
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 64, height: 92, background: 'linear-gradient(140deg, #6B5238, #2A1810)', borderRadius: 3, boxShadow: '0 6px 16px -10px rgba(0,0,0,.4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 6 }}>
              <Mono size={6} weight={700} color="#E8DCC4" style={{ letterSpacing: '.18em', textAlign: 'center' }}>VANGUARD</Mono>
              <div>
                <Mono size={7} color="#E8DCC4" style={{ display: 'block', textAlign: 'center' }}>ATLAS</Mono>
                <Mono size={7} color="#E8DCC4" style={{ display: 'block', textAlign: 'center' }}>OF FOG</Mono>
              </div>
              <Mono size={5} color="rgba(232,220,196,.7)" style={{ letterSpacing: '.18em', textAlign: 'center' }}>E. MARWICK</Mono>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: J_FONT, fontSize: 15, fontWeight: 700, color: J_C.fg1 }}>Atlas of Fog</div>
              <Mono size={11} color={J_C.fg2} style={{ display: 'block', marginTop: 2 }}>E. Marwick · Vanguard Press · 2024</Mono>
              <Mono size={11} color={J_C.fg3} style={{ display: 'block', marginTop: 8, letterSpacing: '.04em' }}>
                Fingerprint: <Mono size={11} color={J_C.fg1} weight={600}>0xA4E1…2F09</Mono>
              </Mono>
              <Mono size={11} color={J_C.fg3} style={{ display: 'block', marginTop: 2 }}>
                Content match: <Mono size={11} color={J_C.success} weight={700}>98.7%</Mono>
              </Mono>
            </div>
          </div>
        </Section>

        {/* Gemini analysis */}
        <Section title="GEMINI · TRIAGE">
          <div style={{ padding: 12, background: J_C.bg2, border: `1px solid ${J_C.line}`, borderRadius: 8 }}>
            <Mono size={11} color={J_C.fg1} style={{ display: 'block', lineHeight: 1.5 }}>
              Direct PDF mirror with intact ISBN + cover. Host is on a known repeat-infringer ASN. DDoS-protected behind Cloudflare; counter-notice unlikely.
            </Mono>
            <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['PIRATED PDF', 'REPEAT INFRINGER', 'NO COUNTER LIKELY', 'EU/EN'].map(t => (
                <Mono key={t} size={9} color={J_C.fg2} style={{ letterSpacing: '.18em', padding: '3px 6px', border: `1px solid ${J_C.line2}`, borderRadius: 4 }}>{t}</Mono>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <div style={{ marginTop: 18 }}>
          <button style={{ width: '100%', padding: '14px', background: J_C.primary, color: '#FFF8EC', border: 0, borderRadius: 8, fontFamily: J_MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.22em' }}>
            BEGIN TAKEDOWN →
          </button>
          <button style={{ marginTop: 8, width: '100%', padding: '13px', background: 'transparent', color: J_C.fg2, border: `1px solid ${J_C.line2}`, borderRadius: 8, fontFamily: J_MONO, fontSize: 12, letterSpacing: '.22em' }}>
            MARK FALSE POSITIVE
          </button>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, v }) => (
  <div>
    <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>{label}</Mono>
    <Mono size={12} color={J_C.fg1} weight={500} style={{ display: 'block', marginTop: 2 }}>{v}</Mono>
  </div>
);
const Section = ({ title, children }) => (
  <div style={{ marginTop: 18 }}>
    <Mono size={10} color={J_C.fg2} weight={700} style={{ letterSpacing: '.22em', display: 'block', marginBottom: 8 }}>{title}</Mono>
    {children}
  </div>
);

// ───── 5. SWIPE TO PURGE ─────
function S5_Swipe() {
  return (
    <div style={{ background: J_C.bg0, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <ScreenHeader subtitle="QUEUE · 8 PENDING" title="Triage" right={
        <Mono size={11} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>1/8</Mono>
      }/>

      <div style={{ position: 'relative', margin: '24px 18px 0', height: 460 }}>
        {/* Third card (back) */}
        <Card style={{ top: 24, transform: 'scale(.92)', opacity: .5, zIndex: 1 }} faint />
        {/* Second card */}
        <Card style={{ top: 12, transform: 'scale(.96)', opacity: .85, zIndex: 2 }} faint />
        {/* Top card — mid-swipe */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, transform: 'translateX(60px) rotate(8deg)' }}>
          <Card showStamp="purge" />
        </div>

        {/* PURGE stamp floating */}
      </div>

      {/* action row */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center', gap: 24 }}>
        <CircleBtn color={J_C.destructive} bg="rgba(164,54,31,.10)" border="rgba(164,54,31,.45)" glyph="✕" />
        <div style={{ textAlign: 'center' }}>
          <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em', display: 'block', marginBottom: 4 }}>VERIFY</Mono>
          <CircleBtn color={J_C.primary} bg={J_C.bg2} border={J_C.line2} glyph={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.5" stroke={J_C.primary} strokeWidth="1.6"/><path d="M5 20a7 7 0 0 1 14 0" stroke={J_C.primary} strokeWidth="1.6"/></svg>
          } size={48} />
        </div>
        <CircleBtn color={J_C.success} bg="rgba(107,127,74,.10)" border="rgba(107,127,74,.45)" glyph="✓" />
      </div>

      <TabBar active="takedown" />
    </div>
  );
}

const CircleBtn = ({ color, bg, border, glyph, size = 56 }) => (
  <div style={{
    width: size, height: size, borderRadius: 99,
    background: bg, border: `1px solid ${border}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color, fontSize: 22, fontWeight: 700,
  }}>{glyph}</div>
);

const Card = ({ style = {}, showStamp = null, faint = false }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    background: J_C.bg2, border: `1px solid ${J_C.line2}`, borderRadius: 12,
    padding: 18, overflow: 'hidden', boxShadow: '0 18px 48px -28px rgba(64,38,22,.30)',
    ...style,
  }}>
    <FourCorners color={J_C.primary} />
    <GridBg size={14} alpha={.04} />
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>T-2031 · PIRATED PDF</Mono>
        <Mono size={10} weight={700} color={J_C.destructive} style={{ letterSpacing: '.18em' }}>⚠ 96</Mono>
      </div>
      <div style={{ marginTop: 18 }}>
        <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>TARGET VECTOR</Mono>
        <Mono size={15} weight={700} color={J_C.fg1} style={{ display: 'block', marginTop: 4, wordBreak: 'break-all' }}>
          freebooks-vault[.]ru/atlas-of-fog
        </Mono>
      </div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="HOST" v="OVHcloud · RU" />
        <Field label="MIRRORS" v="14 detected" />
      </div>
      <div style={{ marginTop: 16 }}>
        <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em', display: 'block', marginBottom: 4 }}>CONFIDENCE</Mono>
        <RiskBar value={96} />
        <Mono size={10} color={J_C.fg2} style={{ display: 'block', marginTop: 4, textAlign: 'right' }}>96/100</Mono>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['PIRATED PDF', 'EU/EN', 'FIRST SEEN 2H'].map(t => (
          <Mono key={t} size={9} color={J_C.fg2} style={{ letterSpacing: '.18em', padding: '3px 6px', border: `1px solid ${J_C.line2}`, borderRadius: 4 }}>{t}</Mono>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', paddingTop: 18 }}>
        <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>← IGNORE</Mono>
        <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>PURGE →</Mono>
      </div>
    </div>

    {showStamp === 'purge' && (
      <div style={{
        position: 'absolute', top: 24, right: 18, transform: 'rotate(12deg)',
        padding: '6px 10px', border: `2.5px solid ${J_C.success}`, borderRadius: 4,
        fontFamily: J_MONO, fontSize: 18, fontWeight: 800, letterSpacing: '.08em', color: J_C.success,
        background: 'rgba(255,253,247,.7)',
      }}>PURGE</div>
    )}
  </div>
);

// ───── 6. BIOMETRIC AUTH SHEET ─────
function S6_Biometric() {
  return (
    <div style={{ background: J_C.bg0, height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Dimmed background — show swipe screen blurred */}
      <div style={{ position: 'absolute', inset: 0, filter: 'blur(6px) brightness(.55)', pointerEvents: 'none' }}>
        <S5_Swipe />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(42,24,16,.45)' }} />

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: J_C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '14px 22px 36px',
        boxShadow: '0 -20px 60px rgba(0,0,0,.35)',
      }}>
        <div style={{ width: 38, height: 4, background: 'rgba(64,38,22,.18)', borderRadius: 99, margin: '0 auto 16px' }} />
        <div style={{ textAlign: 'center' }}>
          <Eyebrow color={J_C.fg2}>AIRLOCK · AUTHORIZE TAKEDOWN</Eyebrow>
          <div style={{ marginTop: 8, fontFamily: J_FONT, fontSize: 19, fontWeight: 700, color: J_C.fg1, letterSpacing: '-0.02em' }}>
            Authorize purge of T-2031
          </div>
          <Mono size={12} color={J_C.fg2} style={{ display: 'block', marginTop: 4, wordBreak: 'break-all' }}>
            freebooks-vault[.]ru/atlas-of-fog
          </Mono>
        </div>

        {/* Mini face scan */}
        <div style={{ marginTop: 18, position: 'relative', borderRadius: 12, background: J_C.bg0, border: `1px solid ${J_C.line2}`, padding: 20 }}>
          <FourCorners color={J_C.primary} />
          <svg viewBox="0 0 200 200" style={{ width: 130, height: 130, margin: '0 auto', display: 'block' }}>
            <defs>
              <linearGradient id="bioScan" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={J_C.primary} stopOpacity="0" />
                <stop offset="50%" stopColor={J_C.primary} stopOpacity=".55" />
                <stop offset="100%" stopColor={J_C.primary} stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke={J_C.primary} strokeWidth="2.4" fill="none">
              <path d="M20 60 V20 H60" /><path d="M140 20 H180 V60" />
              <path d="M180 140 V180 H140" /><path d="M60 180 H20 V140" />
            </g>
            <g stroke={J_C.fg3} strokeWidth="1.4" fill="none" opacity=".75">
              <ellipse cx="100" cy="100" rx="48" ry="60" />
              <circle cx="84" cy="92" r="3" fill={J_C.fg3} /><circle cx="116" cy="92" r="3" fill={J_C.fg3} />
              <path d="M84 122 q16 10 32 0" />
            </g>
            <rect x="20" y="50" width="160" height="14" fill="url(#bioScan)">
              <animate attributeName="y" values="40;150;40" dur="2.2s" repeatCount="indefinite" />
            </rect>
          </svg>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Dot c={J_C.primary} pulse />
            <Mono size={11} weight={700} color={J_C.primary} style={{ letterSpacing: '.22em' }}>HOLD FOR FACE ID</Mono>
          </div>
        </div>

        {/* Risk summary */}
        <div style={{ marginTop: 14, padding: 12, background: 'rgba(164,54,31,.08)', border: '1px solid rgba(164,54,31,.30)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
          <Mono size={10} color={J_C.fg2} style={{ letterSpacing: '.22em' }}>SIGNING TAKEDOWN · NOTICE-2031.PDF</Mono>
          <Mono size={10} weight={700} color={J_C.destructive} style={{ letterSpacing: '.22em' }}>RISK 96</Mono>
        </div>

        {/* Buttons */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button style={{ padding: '13px', background: 'transparent', color: J_C.fg2, border: `1px solid ${J_C.line2}`, borderRadius: 8, fontFamily: J_MONO, fontSize: 12, letterSpacing: '.22em' }}>CANCEL</button>
          <button style={{ padding: '13px', background: J_C.primary, color: '#FFF8EC', border: 0, borderRadius: 8, fontFamily: J_MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.22em' }}>AUTHORIZE</button>
        </div>
        <Mono size={9} color={J_C.fg3} style={{ display: 'block', textAlign: 'center', marginTop: 12, letterSpacing: '.22em' }}>
          OR ENTER PASSCODE
        </Mono>
      </div>
    </div>
  );
}

// ───── 7. EVIDENCE CAPTURED ─────
function S7_Evidence() {
  const items = [
    { ok: true,  label: 'PAGE SNAPSHOT · 4 angles' },
    { ok: true,  label: 'WHOIS + ASN trace' },
    { ok: true,  label: 'PDF FINGERPRINT · 0xA4E1…2F09' },
    { ok: true,  label: 'CONTENT MATCH · 98.7%' },
    { ok: true,  label: 'RFC 3161 TIMESTAMP · sigfox.tsa' },
    { ok: 'live',label: 'COMPILING EVIDENCE BUNDLE…' },
  ];
  return (
    <div style={{ background: J_C.bg0, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <ScreenHeader subtitle="T-2031 · AUTHORIZED" title="Building Evidence" />
      <div style={{ padding: '20px 18px' }}>
        <div style={{ padding: 14, background: J_C.bg2, border: `1px solid ${J_C.line}`, borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Mono size={10} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>FORENSIC PIPELINE</Mono>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dot c={J_C.success} pulse />
              <Mono size={10} weight={700} color={J_C.success} style={{ letterSpacing: '.22em' }}>REC</Mono>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 99, flexShrink: 0,
                  background: it.ok === 'live' ? 'rgba(193,95,60,.14)' : 'rgba(107,127,74,.16)',
                  border: `1px solid ${it.ok === 'live' ? J_C.primary : J_C.success}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: it.ok === 'live' ? J_C.primary : J_C.success, fontSize: 11, fontWeight: 800,
                }}>{it.ok === 'live' ? '·' : '✓'}</div>
                <Mono size={11} color={J_C.fg1} weight={500} style={{ letterSpacing: '.06em' }}>{it.label}</Mono>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ height: 4, borderRadius: 99, background: 'rgba(64,38,22,.10)', overflow: 'hidden' }}>
              <div style={{ width: '82%', height: '100%', background: J_C.primary }} />
            </div>
            <Mono size={9} color={J_C.fg3} style={{ display: 'block', marginTop: 6, letterSpacing: '.22em' }}>82% · BUNDLING TO NOTICE-2031.PDF</Mono>
          </div>
        </div>

        {/* PDF preview thumbnail */}
        <div style={{ marginTop: 14 }}>
          <Mono size={10} color={J_C.fg2} weight={700} style={{ letterSpacing: '.22em', display: 'block', marginBottom: 8 }}>PREVIEW</Mono>
          <div style={{
            background: '#FBF8EE', border: `1px solid ${J_C.line2}`, borderRadius: 6,
            padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
            boxShadow: '0 8px 24px -16px rgba(64,38,22,.30)',
          }}>
            {/* mini page preview */}
            <div style={{ width: 58, height: 78, background: '#fff', border: `1px solid ${J_C.line2}`, borderRadius: 2, padding: 4, flexShrink: 0 }}>
              <div style={{ height: 4, background: J_C.fg1, marginBottom: 3 }} />
              <div style={{ height: 1.5, background: J_C.fg4, marginBottom: 1.5 }} />
              <div style={{ height: 1.5, background: J_C.fg4, marginBottom: 1.5 }} />
              <div style={{ height: 1.5, background: J_C.fg4, marginBottom: 1.5, width: '60%' }} />
              <div style={{ height: 16, background: J_C.bg1, marginTop: 4 }} />
              <div style={{ marginTop: 4, height: 1.5, background: J_C.fg4 }} />
              <div style={{ marginTop: 1.5, height: 1.5, background: J_C.fg4 }} />
              <div style={{ marginTop: 1.5, height: 1.5, background: J_C.fg4, width: '80%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Mono size={12} weight={700} color={J_C.fg1}>NOTICE-2031.PDF</Mono>
              <Mono size={10} color={J_C.fg3} style={{ display: 'block', marginTop: 2, letterSpacing: '.06em' }}>14 pages · 2.4MB · signed</Mono>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <Mono size={9} color={J_C.success} weight={700} style={{ letterSpacing: '.18em', padding: '3px 6px', background: 'rgba(107,127,74,.12)', borderRadius: 4 }}>RFC 3161</Mono>
                <Mono size={9} color={J_C.primary} weight={700} style={{ letterSpacing: '.18em', padding: '3px 6px', background: 'rgba(193,95,60,.12)', borderRadius: 4 }}>COURT-READY</Mono>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ width: '100%', padding: '14px', background: J_C.primary, color: '#FFF8EC', border: 0, borderRadius: 8, fontFamily: J_MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.22em' }}>
            REVIEW DMCA NOTICE →
          </button>
          <button style={{ width: '100%', padding: '13px', background: 'transparent', color: J_C.fg2, border: `1px solid ${J_C.line2}`, borderRadius: 8, fontFamily: J_MONO, fontSize: 12, letterSpacing: '.22em' }}>
            EXPORT PDF TO LEGAL
          </button>
        </div>
      </div>
      <TabBar active="takedown" />
    </div>
  );
}

// ───── 8. RESOLUTION ─────
function S8_Resolution() {
  return (
    <div style={{ background: J_C.bg0, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <ScreenHeader subtitle="ACTIONED · 14:11:08Z" title="Purged" right={
        <Mono size={11} color={J_C.success} weight={700} style={{ letterSpacing: '.22em' }}>✓</Mono>
      }/>
      <div style={{ padding: '20px 18px' }}>
        {/* Hero */}
        <div style={{ padding: 22, background: J_C.bg2, border: `1px solid ${J_C.line2}`, borderRadius: 8, textAlign: 'center', position: 'relative' }}>
          <FourCorners color={J_C.success} />
          <div style={{
            width: 56, height: 56, borderRadius: 99, background: 'rgba(107,127,74,.14)',
            border: `1.5px solid ${J_C.success}`, color: J_C.success, fontSize: 26, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
          }}>✓</div>
          <div style={{ marginTop: 14, fontFamily: J_FONT, fontSize: 20, fontWeight: 700, color: J_C.fg1, letterSpacing: '-0.02em' }}>
            Takedown dispatched.
          </div>
          <Mono size={12} color={J_C.fg2} style={{ display: 'block', marginTop: 4, lineHeight: 1.5 }}>
            Notice + evidence delivered to OVHcloud abuse and to the registrar.
          </Mono>
          <div style={{ marginTop: 14, padding: 10, background: J_C.bg0, border: `1px solid ${J_C.line}`, borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
            <Mono size={10} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>STATUS</Mono>
            <Mono size={10} weight={700} color={J_C.warning} style={{ letterSpacing: '.22em' }}>AWAITING HOST ACK</Mono>
          </div>
          <div style={{ marginTop: 6, padding: 10, background: J_C.bg0, border: `1px solid ${J_C.line}`, borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
            <Mono size={10} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>EST. MTTR</Mono>
            <Mono size={10} weight={700} color={J_C.fg1} style={{ letterSpacing: '.22em' }}>14–42 MIN</Mono>
          </div>
        </div>

        {/* Updated registry */}
        <div style={{ marginTop: 18 }}>
          <Mono size={10} color={J_C.fg2} weight={700} style={{ letterSpacing: '.22em', display: 'block', marginBottom: 8 }}>REGISTRY · NEXT IN QUEUE</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RegRow id="T-2031" dom="freebooks-vault[.]ru/atlas-of-fog" status="pending" risk={96} />
            <RegRow id="T-2024" dom="lit-mirror[.]to/shadow-archive" status="active" risk={88} />
            <RegRow id="T-2018" dom="phish-readers[.]xyz/login" status="active" risk={82} />
          </div>
        </div>

        <button style={{
          marginTop: 18, width: '100%', padding: '14px', background: J_C.primary, color: '#FFF8EC', border: 0, borderRadius: 8,
          fontFamily: J_MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.22em',
        }}>CONTINUE TRIAGE →</button>
      </div>
      <TabBar active="takedown" />
    </div>
  );
}

const RegRow = ({ id, dom, status, risk }) => {
  const map = {
    active: { c: J_C.destructive, label: 'ACTIVE' },
    pending: { c: J_C.warning, label: 'PENDING' },
    resolved: { c: J_C.success, label: 'RESOLVED' },
  };
  const s = map[status];
  return (
    <div style={{
      padding: 12, background: J_C.bg2, border: `1px solid ${J_C.line}`, borderRadius: 8,
      boxShadow: `inset 3px 0 0 0 ${s.c}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Mono size={9} color={J_C.fg3} style={{ letterSpacing: '.22em' }}>{id}</Mono>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={s.c} />
          <Mono size={9} weight={700} color={s.c} style={{ letterSpacing: '.22em' }}>{s.label}</Mono>
        </div>
      </div>
      <Mono size={12} weight={600} color={J_C.fg1} style={{ display: 'block', marginTop: 4 }}>{dom}</Mono>
      <div style={{ marginTop: 6 }}><RiskBar value={risk} height={3} /></div>
    </div>
  );
};

Object.assign(window, {
  J_C, J_FONT, J_MONO,
  Eyebrow, Mono, Corner, FourCorners, Dot, GridBg, TabBar, ScreenHeader, RiskBar, Field, Section,
  S1_Airlock, S2_Command, S3_Notification, S4_Threat, S5_Swipe, S6_Biometric, S7_Evidence, S8_Resolution,
});
