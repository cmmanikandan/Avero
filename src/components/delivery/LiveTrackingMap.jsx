import React, { useState, useEffect, useRef } from 'react';
import { Truck, Navigation, MapPin, Phone, Clock, Shield, Zap, Wind, CheckCircle2, Radio, Star } from 'lucide-react';

// Waypoints along the delivery route path (SVG coordinate space 0-700 x 0-280)
const WAYPOINTS = [
  { x: 58,  y: 200, label: 'Dispatch Hub',       milestone: true  },
  { x: 150, y: 200, label: 'Anna Nagar Gate',    milestone: false },
  { x: 220, y: 120, label: 'Bypass Junction',    milestone: true  },
  { x: 340, y: 80,  label: 'NH-36 Highway',      milestone: false },
  { x: 460, y: 80,  label: 'City Toll Gate',     milestone: true  },
  { x: 560, y: 140, label: 'Final Mile Zone',    milestone: false },
  { x: 638, y: 60,  label: 'Your Doorstep',      milestone: true  },
];

// Build SVG path from waypoints
const buildPath = (pts) =>
  pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');

const ROUTE_D = buildPath(WAYPOINTS);

// Interpolate position along waypoints based on progress 0..1
function interpolatePos(waypoints, progress) {
  const segments = waypoints.length - 1;
  const totalT = progress * segments;
  const seg = Math.min(Math.floor(totalT), segments - 1);
  const t = totalT - seg;
  const a = waypoints[seg];
  const b = waypoints[seg + 1] || waypoints[segments];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export default function LiveTrackingMap({
  driverName  = 'Suresh Kumar',
  driverPhone = '+91 98450 12345',
  destination = 'Karur Central',
  orderId     = 'ORD-00142',
}) {
  const [progress,    setProgress]    = useState(0.35);
  const [etaSec,      setEtaSec]      = useState(14 * 60); // seconds
  const [speed,       setSpeed]       = useState(32);      // km/h
  const [pulseR,      setPulseR]      = useState(0);
  const [milestones,  setMilestones]  = useState([
    { label: 'Order Dispatched', time: '10:14 AM', done: true  },
    { label: 'Picked Up from Hub', time: '10:38 AM', done: true  },
    { label: 'Anna Nagar Gate', time: '11:02 AM', done: true  },
    { label: 'NH-36 Highway', time: 'In Progress', done: false },
    { label: 'City Toll Gate', time: 'ETA: ~8 min', done: false },
    { label: 'Out for Final Mile', time: 'Pending', done: false },
    { label: 'Delivered', time: 'Pending', done: false },
  ]);
  const [showRating, setShowRating]  = useState(false);
  const [traffic,    setTraffic]     = useState('Moderate');
  const pulseRef = useRef(null);

  // Move truck along route
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        const next = p + 0.004;
        if (next >= 1) { clearInterval(iv); setShowRating(true); return 1; }
        return next;
      });
      setEtaSec(s => Math.max(0, s - 2));
      setSpeed(28 + Math.round(Math.random() * 12));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Pulse animation
  useEffect(() => {
    const iv = setInterval(() => setPulseR(r => (r >= 24 ? 0 : r + 1)), 50);
    return () => clearInterval(iv);
  }, []);

  // Update milestones based on progress
  useEffect(() => {
    setMilestones(prev => prev.map((m, i) => {
      const threshold = i / (prev.length - 1);
      if (progress >= threshold && !m.done) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        return { ...m, done: true, time: timeStr };
      }
      return m;
    }));
  }, [progress]);

  const pos = interpolatePos(WAYPOINTS, Math.min(progress, 0.97));

  const etaMins = Math.floor(etaSec / 60);
  const etaSecs = etaSec % 60;
  const distKm  = Math.max(0.1, Number(((1 - progress) * 4.8).toFixed(1)));

  const completedWPs = WAYPOINTS.filter((_, i) => progress >= i / (WAYPOINTS.length - 1));

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

      {/* ── Status Bar ── */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)', color: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', animation: 'blink 1.2s ease infinite' }} />
          <span style={{ fontWeight: '800', fontSize: '13px' }}>Live GPS Vehicle Tracking</span>
          <span style={{ fontSize: '11px', color: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '20px' }}>#{orderId}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#FCD34D' }}>
            <Clock size={13} />
            <span style={{ fontWeight: '800' }}>{etaMins}:{etaSecs.toString().padStart(2,'0')} ETA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#93C5FD' }}>
            <Navigation size={13} />
            <span style={{ fontWeight: '700' }}>{distKm} km away</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6EE7B7' }}>
            <Zap size={13} />
            <span style={{ fontWeight: '700' }}>{speed} km/h</span>
          </div>
        </div>
      </div>

      {/* ── SVG Animated Map ── */}
      <div style={{ position: 'relative', height: '280px', backgroundColor: '#F0F4F8', overflow: 'hidden' }}>
        <svg width="100%" height="280" viewBox="0 0 700 280" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid slice">

          {/* Map Background */}
          <rect width="700" height="280" fill="#EFF4F9" />

          {/* Park / green areas */}
          <rect x="380" y="130" width="60" height="50" rx="8" fill="#DCFCE7" opacity="0.8" />
          <rect x="100" y="30" width="80" height="40" rx="8" fill="#DCFCE7" opacity="0.6" />

          {/* Building blocks */}
          {[[20,20,50,40],[90,20,40,35],[240,100,40,30],[300,110,35,25],[400,160,40,30],[480,110,45,35],[580,180,40,30],[620,100,35,25],[520,190,35,25]].map(([x,y,w,h],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#CBD5E1" opacity="0.5" />
          ))}

          {/* Street grid */}
          <line x1="0" y1="200" x2="700" y2="200" stroke="#D1D5DB" strokeWidth="14" />
          <line x1="0" y1="80" x2="700" y2="80"  stroke="#D1D5DB" strokeWidth="10" />
          <line x1="120" y1="0" x2="120" y2="280" stroke="#D1D5DB" strokeWidth="10" />
          <line x1="340" y1="0" x2="340" y2="280" stroke="#D1D5DB" strokeWidth="10" />
          <line x1="540" y1="0" x2="540" y2="280" stroke="#D1D5DB" strokeWidth="10" />
          <line x1="220" y1="0" x2="220" y2="280" stroke="#E2E8F0" strokeWidth="6" />
          <line x1="460" y1="0" x2="460" y2="280" stroke="#E2E8F0" strokeWidth="6" />

          {/* Street labels */}
          {[['Anna Nagar Rd', 5, 196], ['NH-36 Highway', 5, 76], ['Main St', 0, 125]].map(([t,x,y]) => (
            <text key={t} x={x} y={y} fontSize="8" fill="#9CA3AF" fontWeight="600">{t}</text>
          ))}

          {/* Completed route (glowing blue) */}
          <path d={buildPath(WAYPOINTS.slice(0, Math.max(2, completedWPs.length)))}
            fill="none" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />

          {/* Remaining route (dashed grey) */}
          <path d={buildPath(WAYPOINTS.slice(Math.max(1, completedWPs.length - 1)))}
            fill="none" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="8 6" opacity="0.7" />

          {/* Waypoint dots */}
          {WAYPOINTS.map((wp, i) => {
            const done = progress >= i / (WAYPOINTS.length - 1);
            return wp.milestone ? (
              <g key={i}>
                <circle cx={wp.x} cy={wp.y} r="7" fill={done ? '#2563EB' : '#CBD5E1'} stroke="#fff" strokeWidth="2" />
                {i === WAYPOINTS.length - 1 && (
                  <>
                    <circle cx={wp.x} cy={wp.y} r={14 + (pulseR / 24) * 10} fill="rgba(239,68,68,0.15)" />
                    <circle cx={wp.x} cy={wp.y} r="8" fill="#EF4444" stroke="#fff" strokeWidth="2.5" />
                    <text x={wp.x} y={wp.y - 16} textAnchor="middle" fontSize="9" fill="#EF4444" fontWeight="800">YOU</text>
                  </>
                )}
                {i > 0 && i < WAYPOINTS.length - 1 && done && (
                  <text x={wp.x + 8} y={wp.y - 9} fontSize="8" fill="#2563EB" fontWeight="700">{wp.label}</text>
                )}
              </g>
            ) : (
              <circle key={i} cx={wp.x} cy={wp.y} r="4" fill={done ? '#93C5FD' : '#E2E8F0'} />
            );
          })}

          {/* Animated Truck */}
          <g transform={"translate(" + pos.x + "," + pos.y + ")"}>
            {/* Outer pulse ring */}
            <circle cx="0" cy="0" r={18 + (pulseR / 24) * 10} fill="rgba(37,99,235,0.12)" />
            {/* Inner ring */}
            <circle cx="0" cy="0" r="20" fill="rgba(37,99,235,0.2)" />
            {/* Truck body */}
            <circle cx="0" cy="0" r="14" fill="#1D4ED8" stroke="#fff" strokeWidth="2.5" />
            {/* Truck icon SVG path */}
            <path d="M-6,-3 L3,-3 L3,3 L-6,3 Z" fill="#fff" />
            <path d="M3,-3 L7,-3 L7,3 L3,3 Z" fill="#fff" opacity="0.7" />
            <circle cx="-4" cy="4" r="1.5" fill="#1D4ED8" stroke="#fff" strokeWidth="0.8" />
            <circle cx="4" cy="4" r="1.5" fill="#1D4ED8" stroke="#fff" strokeWidth="0.8" />
            {/* Speed chip above truck */}
            <rect x="-18" y="-32" width="36" height="14" rx="7" fill="#0F172A" opacity="0.85" />
            <text x="0" y="-22" textAnchor="middle" fontSize="8" fill="#FCD34D" fontWeight="800">{speed} km/h</text>
          </g>

          {/* Traffic indicator */}
          <g transform="translate(580,240)">
            <rect x="0" y="0" width="90" height="22" rx="6" fill="rgba(255,255,255,0.9)" />
            <circle cx="10" cy="11" r="5" fill={traffic === 'Clear' ? '#10B981' : traffic === 'Moderate' ? '#F59E0B' : '#EF4444'} />
            <text x="20" y="15" fontSize="8" fill="#374151" fontWeight="700">Traffic: {traffic}</text>
          </g>
        </svg>

        {/* Destination Label */}
        <div style={{ position: 'absolute', right: '16px', top: '10px', backgroundColor: '#fff', borderRadius: '10px', padding: '6px 12px', boxShadow: '0 2px 10px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0', fontSize: '11px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={13} color="#EF4444" /> {destination}
        </div>

        {/* Weather chip */}
        <div style={{ position: 'absolute', left: '12px', top: '10px', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '10px', padding: '5px 10px', fontSize: '11px', fontWeight: '700', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Wind size={12} color="#64748B" /> 26°C · Partly Cloudy
        </div>
      </div>

      {/* ── Driver Card ── */}
      <div style={{ padding: '14px 18px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Driver Avatar */}
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900', flexShrink: 0 }}>
            {driverName.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '14px', color: '#0F172A' }}>{driverName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= 4 ? '#FBBF24' : 'none'} color={s <= 4 ? '#FBBF24' : '#D1D5DB'} />)}
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>4.8 · 1,240 deliveries</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                <Shield size={11} /> Verified
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>MH 04 AB 2345 · KA 01 XZ 9987</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href={"tel:" + driverPhone} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#fff', color: '#374151', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
            <Phone size={14} color="#059669" /> Call Driver
          </a>
          <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            <Radio size={14} /> Share Location
          </button>
        </div>
      </div>

      {/* ── Milestone Timeline ── */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>Delivery Timeline</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {milestones.map((m, i) => (
            <div key={m.label} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
              {/* Timeline vertical line */}
              {i < milestones.length - 1 && (
                <div style={{ position: 'absolute', left: '7px', top: '18px', width: '2px', height: '32px', backgroundColor: m.done ? '#2563EB' : '#E2E8F0', transition: 'background-color 0.5s' }} />
              )}
              {/* Dot */}
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: m.done ? '#2563EB' : '#E2E8F0', border: m.done ? '2px solid #BFDBFE' : '2px solid #E2E8F0', flexShrink: 0, marginTop: '2px', transition: 'all 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.done && <CheckCircle2 size={10} color="#fff" strokeWidth={3} />}
              </div>
              <div style={{ paddingBottom: i < milestones.length - 1 ? '16px' : '0' }}>
                <div style={{ fontSize: '12px', fontWeight: m.done ? '700' : '500', color: m.done ? '#0F172A' : '#94A3B8' }}>{m.label}</div>
                <div style={{ fontSize: '10px', color: m.done ? '#2563EB' : '#94A3B8', fontWeight: '600', marginTop: '1px' }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rating Prompt (shown on delivery) ── */}
      {showRating && (
        <div style={{ padding: '16px 20px', backgroundColor: '#F0FDF4', borderTop: '2px solid #DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="#16A34A" />
            <span style={{ fontWeight: '800', fontSize: '14px', color: '#15803D' }}>Package Delivered! Rate your experience</span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                <Star size={24} fill="#FBBF24" color="#FBBF24" />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
