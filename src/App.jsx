import { useEffect, useRef, useState } from "react";

const TOPICS = [
  { id: "transit", label: "Transit", icon: "🚌" },
  { id: "housing", label: "Housing", icon: "🏠" },
  { id: "environment", label: "Environment", icon: "🌿" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "seniors", label: "Senior Citizens", icon: "👴" },
  { id: "safety", label: "Public Safety", icon: "👮" },
  { id: "health", label: "Healthcare", icon: "🏥" },
  { id: "business", label: "Small Business", icon: "💼" },
];

const BILLS = {
  transit: [
    {
      id: "b1",
      title: "NYC Congestion Pricing Expansion Act",
      status: "LIVE",
      statusLabel: "Vote this week",
      summary:
        "Expands congestion pricing zones to include Brooklyn and Queens bridges, generating $1.2B annually for MTA capital improvements.",
      impact: "Affects your commute on the L and J trains in your district",
      repPosition: "Opposed",
      neighbors: 312,
      hearing: "April 10, 2PM - City Hall",
      support: 58,
    },
    {
      id: "b2",
      title: "Bus Rapid Transit Corridor Bill",
      status: "UPCOMING",
      statusLabel: "Hearing April 15",
      summary:
        "Creates dedicated bus lanes on 5 major corridors across all 5 boroughs, reducing average commute times by an estimated 12 minutes.",
      impact: "3 new BRT stops planned within 0.5 miles of your address",
      repPosition: "Supporting",
      neighbors: 189,
      hearing: "April 15, 10AM - DOT Office",
      support: 74,
    },
  ],
  housing: [
    {
      id: "b3",
      title: "Rent Stabilization Expansion Act",
      status: "LIVE",
      statusLabel: "Committee vote today",
      summary:
        "Extends rent stabilization protections to 400,000 additional units built before 1993, capping annual increases at 3% or CPI.",
      impact:
        "Affects ~8,200 units in your district - Crown Heights and Prospect Heights",
      repPosition: "Supporting",
      neighbors: 891,
      hearing: "Today, 11AM - City Council Chambers",
      support: 81,
    },
    {
      id: "b4",
      title: "Affordable Housing Inclusionary Zoning Reform",
      status: "UPCOMING",
      statusLabel: "Hearing April 12",
      summary:
        "Requires 25% affordable units in all new developments over 10 units citywide, up from the current 20% requirement.",
      impact: "2 pending developments in your zip code would be affected",
      repPosition: "Undecided",
      neighbors: 423,
      hearing: "April 12, 2PM - Brooklyn Borough Hall",
      support: 67,
    },
  ],
  environment: [
    {
      id: "b5",
      title: "NYC Green New Deal Implementation Bill",
      status: "UPCOMING",
      statusLabel: "Hearing April 18",
      summary:
        "Mandates all city buildings over 25,000 sq ft achieve net-zero emissions by 2030, with a $500M retrofit fund for low-income buildings.",
      impact: "14 buildings in your district qualify for retrofit funding",
      repPosition: "Supporting",
      neighbors: 267,
      hearing: "April 18, 1PM - Environmental Committee",
      support: 79,
    },
  ],
  education: [
    {
      id: "b6",
      title: "Universal Pre-K Funding Expansion",
      status: "LIVE",
      statusLabel: "Vote this week",
      summary:
        "Increases per-pupil Pre-K funding by $2,400 annually and adds 85 new classrooms across underserved districts.",
      impact: "3 schools in your district would receive new classrooms",
      repPosition: "Supporting",
      neighbors: 544,
      hearing: "April 9, 3PM - Education Committee",
      support: 88,
    },
  ],
  seniors: [
    {
      id: "b7",
      title: "Senior Center Funding Protection Act",
      status: "LIVE",
      statusLabel: "Budget vote this week",
      summary:
        "Prevents $40M in proposed cuts to NYC senior center programming, maintaining meals, healthcare, and social services for 60,000 seniors.",
      impact: "2 senior centers in your district face closure without this bill",
      repPosition: "Supporting",
      neighbors: 203,
      hearing: "April 10, 10AM - City Council",
      support: 91,
    },
  ],
  safety: [
    {
      id: "b8",
      title: "Community Safety & Accountability Act",
      status: "UPCOMING",
      statusLabel: "Hearing April 14",
      summary:
        "Establishes civilian oversight boards with subpoena power in each borough and requires body cam footage release within 30 days.",
      impact: "Creates a new oversight board covering your precinct",
      repPosition: "Undecided",
      neighbors: 378,
      hearing: "April 14, 2PM - Public Safety Committee",
      support: 63,
    },
  ],
  health: [
    {
      id: "b9",
      title: "Mental Health Crisis Response Reform",
      status: "LIVE",
      statusLabel: "Vote this week",
      summary:
        "Routes non-violent mental health 911 calls to trained crisis responders instead of police, with $80M in new funding for mobile teams.",
      impact: "Your district had 1,200+ mental health 911 calls last year",
      repPosition: "Supporting",
      neighbors: 456,
      hearing: "April 9, 1PM - Health Committee",
      support: 72,
    },
  ],
  business: [
    {
      id: "b10",
      title: "Small Business Commercial Rent Relief Act",
      status: "UPCOMING",
      statusLabel: "Hearing April 16",
      summary:
        "Provides rent stabilization protections for commercial tenants with under $3M annual revenue, preventing arbitrary lease non-renewals.",
      impact: "47 small businesses on your main corridor would be protected",
      repPosition: "Supporting",
      neighbors: 291,
      hearing: "April 16, 11AM - Small Business Committee",
      support: 76,
    },
  ],
};

const REP = {
  name: "Council Member Pierina Sanchez",
  district: "District 14 - Bronx",
  party: "Democrat",
  alignment: 78,
};

const STATUS_COLORS = {
  LIVE: { bg: "rgba(255, 90, 90, 0.14)", text: "#ff7e72", dot: "#ff5a5a" },
  UPCOMING: { bg: "rgba(248, 168, 46, 0.14)", text: "#f8a82e", dot: "#f8a82e" },
  PASSED: { bg: "rgba(32, 185, 129, 0.14)", text: "#20b981", dot: "#20b981" },
};

const PIN_COORDS = {
  b1: { x: 35, y: 30 },
  b2: { x: 68, y: 22 },
  b3: { x: 22, y: 48 },
  b4: { x: 60, y: 62 },
  b5: { x: 78, y: 30 },
  b6: { x: 25, y: 68 },
  b7: { x: 52, y: 18 },
  b8: { x: 45, y: 78 },
  b9: { x: 55, y: 52 },
  b10: { x: 72, y: 70 },
};

function genTestimony(bill, stance) {
  const action = stance === "support" ? "urge you to vote YES" : "urge you to vote NO";

  return `Dear ${REP.name},

I am a constituent in ${REP.district} writing to ${stance} the ${bill.title}.

${bill.impact}. This directly affects my community.

${
    stance === "support"
      ? `This legislation is a meaningful step forward. I ${action} on this bill.`
      : `I have serious concerns about this legislation. I ${action} on this bill.`
  }

Respectfully,
A constituent of ${REP.district}`;
}

function CivicLogo({ small = false }) {
  return (
    <div className={`brand-lockup ${small ? "small" : ""}`}>
      <div className="brand-mark">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="7" r="3" stroke="white" strokeWidth="1.8" />
          <path
            d="M8 2C5.24 2 3 4.24 3 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"
            stroke="white"
            strokeWidth="1.6"
            fill="none"
          />
        </svg>
      </div>
      <span>CivicPulse</span>
    </div>
  );
}

function Landing({ onEnter }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return undefined;

    const width = el.offsetWidth || 560;
    const height = 300;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    el.appendChild(svg);

    const make = (tag, attrs) => {
      const node = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    };

    svg.appendChild(make("rect", { width, height, fill: "#09111f" }));

    for (let x = 0; x < width; x += 28) {
      svg.appendChild(
        make("line", {
          x1: x,
          y1: 0,
          x2: x,
          y2: height,
          stroke: "rgba(93, 146, 255, 0.07)",
          "stroke-width": "0.5",
        }),
      );
    }

    for (let y = 0; y < height; y += 28) {
      svg.appendChild(
        make("line", {
          x1: 0,
          y1: y,
          x2: width,
          y2: y,
          stroke: "rgba(93, 146, 255, 0.07)",
          "stroke-width": "0.5",
        }),
      );
    }

    [
      [0.1, 0.5, 0.9, 0.48],
      [0.25, 0, 0.27, 1],
      [0.52, 0, 0.5, 1],
      [0.75, 0, 0.77, 1],
      [0.3, 0.3, 0.72, 0.33],
      [0.15, 0.68, 0.85, 0.7],
    ].forEach(([x1, y1, x2, y2]) => {
      svg.appendChild(
        make("line", {
          x1: x1 * width,
          y1: y1 * height,
          x2: x2 * width,
          y2: y2 * height,
          stroke: "rgba(255,255,255,0.06)",
          "stroke-width": "6",
        }),
      );
      svg.appendChild(
        make("line", {
          x1: x1 * width,
          y1: y1 * height,
          x2: x2 * width,
          y2: y2 * height,
          stroke: "rgba(255,255,255,0.08)",
          "stroke-width": "1",
        }),
      );
    });

    const pins = [
      { x: 0.33, y: 0.28, c: "#ff5a5a", l: "LIVE" },
      { x: 0.57, y: 0.2, c: "#ff5a5a", l: "LIVE" },
      { x: 0.2, y: 0.5, c: "#f8a82e", l: "891" },
      { x: 0.65, y: 0.38, c: "#f8a82e", l: "456" },
      { x: 0.42, y: 0.6, c: "#f8a82e", l: "312" },
      { x: 0.78, y: 0.52, c: "#20b981", l: "OK" },
      { x: 0.18, y: 0.72, c: "#20b981", l: "OK" },
      { x: 0.6, y: 0.68, c: "#f8a82e", l: "189" },
    ];

    pins.forEach(({ x, y, c, l }) => {
      const px = x * width;
      const py = y * height;

      if (c === "#ff5a5a") {
        svg.appendChild(make("circle", { cx: px, cy: py, r: "18", fill: c, opacity: "0.14" }));
      }

      const group = make("g", {});
      group.appendChild(make("rect", { x: px - 16, y: py - 28, width: 32, height: 20, rx: "10", fill: c }));
      group.appendChild(make("polygon", { points: `${px - 4},${py - 10} ${px + 4},${py - 10} ${px},${py - 3}`, fill: c }));
      const text = make("text", {
        x: px,
        y: py - 14,
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        fill: "white",
        "font-size": l === "LIVE" ? "7.5" : "9",
        "font-weight": "700",
        "font-family": "IBM Plex Sans, sans-serif",
      });
      text.textContent = l;
      group.appendChild(text);
      svg.appendChild(group);
    });

    svg.appendChild(make("circle", { cx: width * 0.47, cy: height * 0.5, r: "7", fill: "#5d92ff" }));
    svg.appendChild(
      make("circle", {
        cx: width * 0.47,
        cy: height * 0.5,
        r: "14",
        fill: "none",
        stroke: "#5d92ff",
        "stroke-width": "1.6",
        opacity: "0.35",
      }),
    );

    return () => {
      if (el.contains(svg)) {
        el.removeChild(svg);
      }
    };
  }, []);

  return (
    <div className="landing-shell">
      <header className="landing-topbar">
        <CivicLogo small />
        <button className="btn btn-primary" onClick={onEnter}>
          Get started
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Launching in NYC - April 2026</div>
          <h1>
            Your city is making decisions <span>right now.</span>
            <br />
            Are you there?
          </h1>
          <p>
            Real-time civic intelligence for your neighborhood. Know what is being
            voted on, see what is live nearby, and make your voice heard before the
            gavel drops.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onEnter}>
              See your district
            </button>
            <button className="btn btn-secondary" onClick={onEnter}>
              Watch demo
            </button>
          </div>
        </div>

        <div className="hero-map-card">
          <div className="map-overlay-copy">
            <span>District 14 pulse</span>
            <strong>4 votes happening now</strong>
          </div>
          <div ref={mapRef} className="hero-map" />
        </div>
      </section>

      <section className="stats-grid">
        {[
          ["847K", "NYC residents affected"],
          ["23", "Active bills today"],
          ["4", "Votes happening now"],
          ["1-tap", "Testimony sent"],
        ].map(([value, label]) => (
          <article key={label} className="stat-card">
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="section-label">What is happening now</div>
          <div className="timeline">
            {[
              [
                "Rent Stabilization Expansion Act",
                "Committee vote - 11AM City Council Chambers",
                "#ff5a5a",
                "891",
              ],
              [
                "Mental Health Crisis Response Reform",
                "Vote this week - 1PM Health Committee",
                "#ff5a5a",
                "456",
              ],
              ["Bus Rapid Transit Corridor Bill", "Hearing April 15 - DOT Office", "#f8a82e", "189"],
            ].map(([name, meta, color, count]) => (
              <div className="timeline-row" key={name}>
                <span className="timeline-dot" style={{ background: color }} />
                <div>
                  <h3>{name}</h3>
                  <p>{meta}</p>
                </div>
                <span className="timeline-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-label">How it works</div>
          <div className="steps-grid">
            {[
              ["01", "Enter address", "Find your district, ward, and local representatives."],
              ["02", "Pick issues", "Tailor the feed to what matters in your neighborhood."],
              ["03", "See what is live", "Watch map pins pulse when a vote or hearing is active."],
              ["04", "Send testimony", "Generate a letter fast and copy it into action."],
            ].map(([num, title, body]) => (
              <article key={num} className="step-card">
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <div className="section-label">Ready to demo it</div>
          <h2>Your neighborhood needs you present.</h2>
          <p>Step into the product flow and explore the district dashboard.</p>
        </div>
        <button className="btn btn-light" onClick={onEnter}>
          Open app
        </button>
      </section>
    </div>
  );
}

function Pin({ bill, onClick, selected }) {
  const color = STATUS_COLORS[bill.status].dot;
  const label = bill.status === "LIVE" ? "LIVE" : String(bill.neighbors);
  const pos = PIN_COORDS[bill.id] || { x: 50, y: 50 };

  return (
    <div
      className={`map-pin ${selected ? "selected" : ""}`}
      onClick={() => onClick(bill)}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <div className="map-pin-label" style={{ background: color }}>
        {label}
      </div>
      <div className="map-pin-tip" style={{ borderTopColor: color }} />
    </div>
  );
}

function MapView({ feed, onTestify, onViewFeed }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState(null);
  const filtered = filter ? feed.filter((bill) => bill.status === filter) : feed;

  return (
    <div className="map-view">
      <div className="district-map">
        <div className="district-map-bg">
          <svg width="100%" height="100%" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 15 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={i * 28}
                y1={0}
                x2={i * 28}
                y2={360}
                stroke="rgba(93, 146, 255, 0.06)"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 14 }, (_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * 28}
                x2={400}
                y2={i * 28}
                stroke="rgba(93, 146, 255, 0.06)"
                strokeWidth="0.5"
              />
            ))}
            {[
              [40, 180, 360, 175],
              [100, 0, 108, 360],
              [200, 0, 196, 360],
              [300, 0, 308, 360],
              [120, 120, 288, 132],
              [60, 270, 340, 278],
            ].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
              </g>
            ))}
          </svg>
        </div>

        <div className="map-filter-row">
          {[null, "LIVE", "UPCOMING"].map((status) => (
            <button
              key={status ?? "all"}
              className={`chip ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status === "LIVE" ? "Live" : status === "UPCOMING" ? "Upcoming" : "All"}
            </button>
          ))}
        </div>

        <div className="district-badge">District 14 - Bronx</div>

        <div className="map-pin-layer">
          {filtered.map((bill) => (
            <Pin
              key={bill.id}
              bill={bill}
              selected={selected?.id === bill.id}
              onClick={(nextBill) => setSelected(selected?.id === nextBill.id ? null : nextBill)}
            />
          ))}
          <div className="you-are-here" />
        </div>

        {selected && (
          <div className="map-bottom-sheet">
            <div className="map-sheet-top">
              <span
                className="status-pill"
                style={{
                  background: STATUS_COLORS[selected.status].bg,
                  color: STATUS_COLORS[selected.status].text,
                }}
              >
                {selected.statusLabel}
              </span>
              <button className="icon-button" onClick={() => setSelected(null)}>
                x
              </button>
            </div>
            <h3>{selected.title}</h3>
            <p>{selected.impact}</p>
            <div className="split-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  onTestify(selected);
                  setSelected(null);
                }}
              >
                Testify
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  onViewFeed();
                  setSelected(null);
                }}
              >
                View bill
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="panel subtle">
        <div className="section-label">Active in your district</div>
        <div className="mini-list">
          {feed.slice(0, 4).map((bill) => (
            <button key={bill.id} className="mini-list-row" onClick={() => setSelected(bill)}>
              <span className="timeline-dot" style={{ background: STATUS_COLORS[bill.status].dot }} />
              <div>
                <strong>{bill.title}</strong>
                <p>{bill.hearing}</p>
              </div>
              <span>{bill.neighbors}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardShell({
  address,
  selectedTopics,
  onOpenTestimony,
  testimonyBill,
  testimony,
  setTestimony,
  copied,
  setCopied,
  votes,
  setVotes,
  activeTab,
  setActiveTab,
}) {
  const [filterTopic, setFilterTopic] = useState(null);

  const getFeed = () => {
    const topics = filterTopic
      ? [filterTopic]
      : selectedTopics.length
        ? selectedTopics
        : Object.keys(BILLS);
    return topics.flatMap((topic) => BILLS[topic] || []);
  };

  const feed = getFeed();
  const liveBill = feed.find((bill) => bill.status === "LIVE");

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <CivicLogo small />
          <p>{address || "Demo address"} - District 14, Bronx</p>
        </div>
        <div className="signal-card">
          <span>Live civic signal</span>
          <strong>4 active actions</strong>
        </div>
      </header>

      <nav className="tabs">
        {["feed", "map", "rep", "calendar", "testimony"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "feed"
              ? "My Feed"
              : tab === "map"
                ? "Map"
                : tab === "rep"
                  ? "My Rep"
                  : tab === "calendar"
                    ? "This Week"
                    : "Testimony"}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeTab === "feed" && (
          <section>
            {liveBill && (
              <div className="alert-card">
                <div className="live-dot" />
                <div>
                  <span>Live now - {liveBill.hearing}</span>
                  <strong>{liveBill.title} is active in your district.</strong>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => onOpenTestimony(liveBill, "support")}
                >
                  Generate testimony
                </button>
              </div>
            )}

            <div className="topic-row">
              <button
                className={`chip ${filterTopic === null ? "active" : ""}`}
                onClick={() => setFilterTopic(null)}
              >
                All
              </button>
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  className={`chip ${filterTopic === topic.id ? "active" : ""}`}
                  onClick={() => setFilterTopic(filterTopic === topic.id ? null : topic.id)}
                >
                  {topic.icon} {topic.label}
                </button>
              ))}
            </div>

            <div className="feed-list">
              {feed.map((bill) => {
                const uv = votes[bill.id];
                const sc = STATUS_COLORS[bill.status];

                return (
                  <article className="bill-card" key={bill.id}>
                    <div className="bill-head">
                      <span className="status-pill" style={{ background: sc.bg, color: sc.text }}>
                        {bill.statusLabel}
                      </span>
                      <span className="muted">{bill.neighbors} neighbors</span>
                    </div>

                    <h3>{bill.title}</h3>
                    <p className="summary">{bill.summary}</p>
                    <div className="impact-box">{bill.impact}</div>

                    <div className="bill-meta">
                      <span>
                        Rep position:{" "}
                        <strong
                          className={
                            bill.repPosition === "Supporting"
                              ? "support"
                              : bill.repPosition === "Opposed"
                                ? "oppose"
                                : "undecided"
                          }
                        >
                          {bill.repPosition}
                        </strong>
                      </span>
                      <span>{bill.support}% community support</span>
                    </div>

                    <div className="support-bar">
                      <span style={{ width: `${bill.support}%` }} />
                    </div>

                    <div className="split-actions">
                      <button
                        className={`vote-btn ${uv === "support" ? "selected support" : ""}`}
                        onClick={() => !uv && setVotes((prev) => ({ ...prev, [bill.id]: "support" }))}
                      >
                        {uv === "support" ? "Supporting" : "Support"}
                      </button>
                      <button
                        className={`vote-btn ${uv === "oppose" ? "selected oppose" : ""}`}
                        onClick={() => !uv && setVotes((prev) => ({ ...prev, [bill.id]: "oppose" }))}
                      >
                        {uv === "oppose" ? "Opposed" : "Oppose"}
                      </button>
                      <button className="btn btn-secondary" onClick={() => onOpenTestimony(bill, uv || "support")}>
                        Testify
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "map" && (
          <MapView
            feed={feed}
            onTestify={(bill) => onOpenTestimony(bill, "support")}
            onViewFeed={() => setActiveTab("feed")}
          />
        )}

        {activeTab === "rep" && (
          <section className="two-column">
            <div className="panel">
              <div className="rep-card">
                <div className="rep-avatar">PS</div>
                <div>
                  <h3>{REP.name}</h3>
                  <p>
                    {REP.district} - {REP.party}
                  </p>
                </div>
              </div>

              <div className="alignment-card">
                <span>Alignment with your issues</span>
                <div className="alignment-row">
                  <div className="support-bar">
                    <span style={{ width: `${REP.alignment}%` }} />
                  </div>
                  <strong>{REP.alignment}%</strong>
                </div>
              </div>

              <button className="btn btn-secondary">Contact Representative</button>
            </div>

            <div className="panel">
              <div className="section-label">Recent positions</div>
              <div className="mini-list">
                {feed.slice(0, 5).map((bill) => (
                  <div key={bill.id} className="mini-static-row">
                    <span className="timeline-dot" style={{ background: STATUS_COLORS[bill.status].dot }} />
                    <div>
                      <strong>{bill.title}</strong>
                      <p>{bill.repPosition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "calendar" && (
          <section className="panel">
            <div className="section-label">Hearings and votes in District 14 this week</div>
            {[
              ["Today, Apr 8", 0],
              ["Thu, Apr 10", 1],
              ["Mon, Apr 14", 2],
              ["Tue, Apr 15", 3],
              ["Wed, Apr 16", 4],
              ["Thu, Apr 18", 5],
            ].map(([day, i]) => {
              const dayBills = feed.filter((_, idx) => idx % 6 === i);
              return (
                <div className="calendar-group" key={day}>
                  <h3>{day}</h3>
                  {dayBills.length ? (
                    dayBills.map((bill) => (
                      <div className="calendar-item" key={bill.id}>
                        <span style={{ background: STATUS_COLORS[bill.status].dot }} />
                        <div>
                          <strong>{bill.title}</strong>
                          <p>{bill.hearing}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="muted">No hearings scheduled</p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {activeTab === "testimony" && testimonyBill && (
          <section className="panel testimony-panel">
            <div className="testimony-head">
              <div>
                <div className="section-label">AI testimony draft</div>
                <h3>{testimonyBill.title}</h3>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveTab("feed")}>
                Back to feed
              </button>
            </div>

            <div className="split-actions">
              <button
                className="vote-btn support selected"
                onClick={() => setTestimony(genTestimony(testimonyBill, "support"))}
              >
                Support this bill
              </button>
              <button
                className="vote-btn oppose selected"
                onClick={() => setTestimony(genTestimony(testimonyBill, "oppose"))}
              >
                Oppose this bill
              </button>
            </div>

            <textarea
              rows={12}
              value={testimony}
              onChange={(event) => setTestimony(event.target.value)}
            />

            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  if (navigator.clipboard) {
                    await navigator.clipboard.writeText(testimony);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  }
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Copied to clipboard" : "Copy and send to rep"}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function Onboarding({ address, setAddress, selectedTopics, setSelectedTopics, onFinish }) {
  const [screen, setScreen] = useState("address");

  if (screen === "address") {
    return (
      <div className="onboarding-shell">
        <div className="onboarding-card">
          <CivicLogo />
          <div>
            <div className="section-label">Step 1</div>
            <h2>Where do you live?</h2>
            <p>
              We will find your district, representatives, and the local bills that
              affect your neighborhood.
            </p>
          </div>

          <input
            type="text"
            value={address}
            placeholder="Enter your NYC address..."
            onChange={(event) => setAddress(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && address.trim().length > 3) {
                setScreen("topics");
              }
            }}
          />

          <button
            className="btn btn-primary"
            onClick={() => address.trim().length > 3 && setScreen("topics")}
          >
            Find my district
          </button>

          <span className="helper">Demo uses District 14 - Bronx</span>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card wide">
        <CivicLogo />
        <div>
          <div className="section-label">Step 2</div>
          <h2>What do you care about?</h2>
          <p>Pick as many topics as you want. The dashboard will center them.</p>
        </div>

        <div className="topics-grid">
          {TOPICS.map((topic) => {
            const selected = selectedTopics.includes(topic.id);
            return (
              <button
                key={topic.id}
                className={`topic-card ${selected ? "selected" : ""}`}
                onClick={() =>
                  setSelectedTopics((prev) =>
                    prev.includes(topic.id)
                      ? prev.filter((item) => item !== topic.id)
                      : [...prev, topic.id],
                  )
                }
              >
                <span>{topic.icon}</span>
                <strong>{topic.label}</strong>
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={onFinish}>
          Show my civic dashboard
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [address, setAddress] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [testimonyBill, setTestimonyBill] = useState(null);
  const [testimony, setTestimony] = useState("");
  const [copied, setCopied] = useState(false);
  const [votes, setVotes] = useState({});

  const openTestimony = (bill, stance) => {
    setTestimonyBill(bill);
    setTestimony(genTestimony(bill, stance));
    setActiveTab("testimony");
  };

  return (
    <div className="app-shell">
      {screen === "landing" && <Landing onEnter={() => setScreen("onboarding")} />}
      {screen === "onboarding" && (
        <Onboarding
          address={address}
          setAddress={setAddress}
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          onFinish={() => setScreen("dashboard")}
        />
      )}
      {screen === "dashboard" && (
        <DashboardShell
          address={address}
          selectedTopics={selectedTopics}
          onOpenTestimony={openTestimony}
          testimonyBill={testimonyBill}
          testimony={testimony}
          setTestimony={setTestimony}
          copied={copied}
          setCopied={setCopied}
          votes={votes}
          setVotes={setVotes}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
