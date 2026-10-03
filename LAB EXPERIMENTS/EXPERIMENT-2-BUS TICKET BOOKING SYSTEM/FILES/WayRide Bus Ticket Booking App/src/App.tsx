import { FormEvent, ReactNode, useMemo, useState } from "react"

type Page = "home" | "results" | "seats" | "passengers" | "payment" | "confirmation" | "bookings" | "ticket" | "destinations" | "help" | "login" | "signup"

type Search = {
  from: string
  to: string
  date: string
  passengers: number
  trip: "One way" | "Round trip"
}

type Service = {
  operator: string
  code: string
  type: string
  departure: string
  arrival: string
  duration: string
  price: number
  seats: number
  rating: number
  amenities: string[]
}

const cities = [
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Coimbatore",
  "Madurai",
  "Kochi",
  "Mysuru",
  "Pune",
  "Mumbai",
  "Goa",
]
const routes = [
  ["Chennai", "Bengaluru"],
  ["Chennai", "Coimbatore"],
  ["Chennai", "Madurai"],
  ["Chennai", "Hyderabad"],
  ["Bengaluru", "Mysuru"],
  ["Bengaluru", "Hyderabad"],
  ["Bengaluru", "Chennai"],
  ["Hyderabad", "Bengaluru"],
  ["Hyderabad", "Chennai"],
  ["Coimbatore", "Chennai"],
  ["Madurai", "Chennai"],
  ["Kochi", "Bengaluru"],
  ["Bengaluru", "Kochi"],
  ["Pune", "Mumbai"],
  ["Mumbai", "Pune"],
  ["Mumbai", "Goa"],
  ["Goa", "Mumbai"],
  ["Chennai", "Kochi"],
  ["Kochi", "Chennai"],
  ["Bengaluru", "Goa"],
]

const operators = [
  ["WayRide Express", "WR204"],
  ["Swift Travels", "ST108"],
  ["BlueLine Coaches", "BL312"],
  ["MetroBus Premium", "MB421"],
  ["CityRide Travels", "CR205"],
  ["Royal Roadways", "RR118"],
  ["GreenLine Express", "GL410"],
  ["NightStar Travels", "NS520"],
  ["UrbanCoach", "UC308"],
  ["SouthLine Travels", "SL612"],
  ["ComfortRide", "CO214"],
  ["StarBus Premium", "SB320"],
  ["RoadKing Travels", "RK401"],
  ["TravelNest", "TN509"],
  ["PurpleLine Coaches", "PL220"],
  ["FastTrack Bus", "FT311"],
  ["Horizon Travels", "HT415"],
  ["BlueSky Coaches", "BS206"],
  ["GrandRoute Express", "GR502"],
  ["CityLink Premium", "CL610"],
]
const times = [
  ["06:30", "12:45", "6h 15m"],
  ["07:15", "13:50", "6h 35m"],
  ["08:45", "15:20", "6h 35m"],
  ["10:10", "16:40", "6h 30m"],
  ["12:30", "19:15", "6h 45m"],
  ["14:00", "20:20", "6h 20m"],
  ["16:45", "23:30", "6h 45m"],
  ["18:30", "01:15", "6h 45m"],
  ["19:15", "02:00", "6h 45m"],
  ["20:00", "03:10", "7h 10m"],
  ["20:45", "03:30", "6h 45m"],
  ["21:15", "04:05", "6h 50m"],
  ["21:45", "04:30", "6h 45m"],
  ["22:00", "05:00", "7h"],
  ["22:20", "05:10", "6h 50m"],
  ["22:45", "05:40", "6h 55m"],
  ["23:00", "05:45", "6h 45m"],
  ["23:15", "06:10", "6h 55m"],
  ["23:30", "06:30", "7h"],
  ["23:45", "06:45", "7h"],
]
const allServices: Service[] = operators.map(([operator, code], i) => ({
  operator,
  code,
  type: [
    "Premium AC Sleeper",
    "AC Multi-Axle Seater",
    "Volvo AC Semi-Sleeper",
    "Executive Sleeper",
  ][i % 4],
  departure: times[i][0],
  arrival: times[i][1],
  duration: times[i][2],
  price: 649 + (i % 7) * 75,
  seats: 7 + ((i * 7) % 24),
  rating: 4.1 + (i % 8) / 10,
  amenities: [
    ["Wi-Fi", "Charging", "AC", "Blanket"],
    ["Charging", "AC", "Water"],
    ["Wi-Fi", "AC", "Reclining seats"],
    ["AC", "Sleeper", "Blanket"],
  ][i % 4],
}))

const faq = [
  [
    "How do I change my seat?",
    "You can change an available seat from Manage booking up to two hours before departure.",
  ],
  [
    "Can I cancel my booking?",
    "Yes. Open My bookings and choose Manage booking. The refund depends on the operator cancellation window.",
  ],
  [
    "When will I receive my ticket?",
    "Your ticket is available immediately after payment and is also sent to your email and mobile.",
  ],
  [
    "What luggage can I bring?",
    "Each passenger can carry one cabin bag and one checked bag up to 15 kg at no extra cost.",
  ],
  [
    "How long do refunds take?",
    "Approved refunds usually reach the original payment method within 5–7 business days.",
  ],
]

function Icon({ name, size = 20 }: { name: string size?: number }) {
  const paths: Record<string, ReactNode> = {
    bus: (
      <>
        <rect x="4" y="3" width="16" height="17" rx="3" />
        <path d="M7 17h10M7 7h10v6H7zM7 21v-1M17 21v-1" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.7 2.7 0 1 1 4 2.4c-1 .5-1.5 1.1-1.5 2.1M12 17h.01" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    wifi: (
      <>
        <path d="M5 12.6a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
        <circle cx="12" cy="19" r="1" />
      </>
    ),
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7z" />,
    ac: (
      <>
        <path d="M12 2v20M4 7l16 10M4 17 20 7" />
        <path d="m9 4 3-2 3 2M9 20l3 2 3-2" />
      </>
    ),
    seat: (
      <>
        <path d="M7 12V6a3 3 0 0 1 6 0v8M5 10v6a3 3 0 0 0 3 3h9" />
        <path d="M17 10v11" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    download: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      </>
    ),
    ticket: (
      <>
        <path d="M3 8a2 2 0 0 0 0 4v5h18v-5a2 2 0 0 0 0-4V3H3z" />
        <path d="M8 3v14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    steering: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2" />
        <path d="M4.5 10h15M12 14v6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15" />
      </>
    ),
  }
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  onClick,
  secondary = false,
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  secondary?: boolean
  disabled?: boolean
  type?: "button" | "submit"
  className?: string
}) {
  return (
    <button
      type={type}
      className={`btn ${secondary ? "btn-secondary" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className={`field ${error ? "field-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </label>
  )
}

function Header({ page, go }: { page: Page go: (page: Page) => void }) {
  return (
    <header className="header">
      <div className="shell header-inner">
        <button className="brand" onClick={() => go("home")}>
          <span className="brand-mark">
            <Icon name="bus" size={23} />
          </span>
          <span>WayRide</span>
        </button>
        <nav>
          <button
            className={page === "home" || page === "results" ? "active" : ""}
            onClick={() => go("home")}
          >
            Book a journey
          </button>
          <button
            className={page === "destinations" ? "active" : ""}
            onClick={() => go("destinations")}
          >
            Destinations
          </button>
          <button
            className={page === "bookings" || page === "ticket" ? "active" : ""}
            onClick={() => go("bookings")}
          >
            My bookings
          </button>
          <button
            className={page === "help" ? "active" : ""}
            onClick={() => go("help")}
          >
            Help centre
          </button>
        </nav>
        <div className="header-tools">
          <button>
            <Icon name="globe" size={17} /> EN
          </button>
          <button onClick={() => go("help")}>
            <Icon name="help" size={17} /> Help
          </button>
          <button onClick={() => go("login")}>
            <Icon name="user" size={17} /> Sign in
          </button>
        </div>
      </div>
    </header>
  )
}

function SearchPanel({
  search,
  setSearch,
  submit,
  compact = false,
}: {
  search: Search
  setSearch: (s: Search) => void
  submit: () => void
  compact?: boolean
}) {
  const valid = search.from !== search.to
  return (
    <div className={`search-panel ${compact ? "compact" : ""}`}>
      <div className="trip-toggle">
        {(["One way", "Round trip"] as const).map((trip) => (
          <button
            key={trip}
            className={search.trip === trip ? "active" : ""}
            onClick={() => setSearch({ ...search, trip })}
          >
            <span /> {trip}
          </button>
        ))}
      </div>
      <div className="search-grid">
        <Field label="FROM">
          <select
            value={search.from}
            onChange={(e) => setSearch({ ...search, from: e.target.value })}
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <button
          className="swap"
          onClick={() =>
            setSearch({ ...search, from: search.to, to: search.from })
          }
          aria-label="Swap cities"
        >
          ⇄
        </button>
        <Field label="TO">
          <select
            value={search.to}
            onChange={(e) => setSearch({ ...search, to: e.target.value })}
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="DEPARTURE">
          <input
            type="date"
            value={search.date}
            onChange={(e) => setSearch({ ...search, date: e.target.value })}
          />
        </Field>
        <Field label="PASSENGERS">
          <select
            value={search.passengers}
            onChange={(e) =>
              setSearch({ ...search, passengers: Number(e.target.value) })
            }
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Adult" : "Adults"}
              </option>
            ))}
          </select>
        </Field>
        <Button onClick={submit} disabled={!valid}>
          Search buses <Icon name="arrow" size={18} />
        </Button>
      </div>
      {!valid && (
        <p className="search-error">From and destination must be different.</p>
      )}
    </div>
  )
}

function Home({
  search,
  setSearch,
  onSearch,
  go,
}: {
  search: Search
  setSearch: (s: Search) => void
  onSearch: () => void
  go: (p: Page) => void
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-photo" />
        <div className="hero-overlay" />
        <div className="shell hero-content">
          <div className="eyebrow light">WELCOME ABOARD</div>
          <h1>
            Your next great
            <br />
            journey starts here.
          </h1>
          <p>
            Book comfortable bus journeys, choose your favourite seat, and
            travel with confidence.
          </p>
          <SearchPanel
            search={search}
            setSearch={setSearch}
            submit={onSearch}
          />
        </div>
      </section>
      <section className="trust-strip">
        <div className="shell trust-grid">
          <div>
            <b>20+</b>
            <span>Trusted operators</span>
          </div>
          <div>
            <b>200+</b>
            <span>Daily departures</span>
          </div>
          <div>
            <b>40</b>
            <span>Connected cities</span>
          </div>
          <div>
            <b>4.8/5</b>
            <span>Traveller rating</span>
          </div>
        </div>
      </section>
      <section className="shell home-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">POPULAR ROUTES</div>
            <h2>Travel favourites</h2>
            <p>Reliable connections, fair fares, and comfortable coaches.</p>
          </div>
          <button className="text-link" onClick={() => go("destinations")}>
            View all destinations <Icon name="arrow" size={17} />
          </button>
        </div>
        <div className="route-cards">
          {[
            ["Chennai", "Bengaluru", "from ₹649"],
            ["Bengaluru", "Goa", "from ₹899"],
            ["Mumbai", "Pune", "from ₹549"],
          ].map(([from, to, fare], i) => (
            <button
              key={to}
              className={`route-card route-${i}`}
              onClick={() => {
                setSearch({ ...search, from, to })
                onSearch()
              }}
            >
              <span className="route-number">0{i + 1}</span>
              <span>
                <b>{from}</b>
                <Icon name="arrow" size={17} />
                <b>{to}</b>
              </span>
              <small>Daily departures · {fare}</small>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}

function Results({
  search,
  setSearch,
  services,
  select,
  go,
}: {
  search: Search
  setSearch: (s: Search) => void
  services: Service[]
  select: (s: Service) => void
  go: (p: Page) => void
}) {
  const [open, setOpen] = useState<string | null>(null)
  const [direct, setDirect] = useState(true)
  const [timesFilter, setTimesFilter] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [seatTypes, setSeatTypes] = useState<string[]>([])
  const [operatorFilters, setOperatorFilters] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(2000)
  const [sort, setSort] = useState("Recommended")
  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  let filtered = services.filter((s) => {
    const hour = Number(s.departure.split(":")[0])
    const period = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening"
    return (
      (!timesFilter.length || timesFilter.includes(period)) &&
      (!amenities.length || amenities.every((a) => s.amenities.includes(a))) &&
      (!operatorFilters.length || operatorFilters.includes(s.operator)) &&
      (!seatTypes.length || seatTypes.some((t) => s.type.includes(t))) &&
      s.price <= maxPrice
    )
  })
  if (sort === "Lowest price")
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === "Top rated")
    filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  const date = new Date(search.date + "T12:00:00")
  const dates = [-2, -1, 0, 1, 2].map((offset) => {
    const d = new Date(date)
    d.setDate(d.getDate() + offset)
    return d
  })
  return (
    <main className="page">
      <div className="shell">
        <div className="breadcrumbs">
          <button onClick={() => go("home")}>Home</button>
          <span>/</span>
          <span>Search</span>
          <span>/</span>
          <b>Bus results</b>
        </div>
        <section className="results-summary">
          <div>
            <span className="route-kicker">YOUR JOURNEY</span>
            <h1>
              {search.from} <Icon name="arrow" size={28} /> {search.to}
            </h1>
            <p>
              {date.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              <i /> {search.passengers}{" "}
              {search.passengers === 1 ? "adult" : "adults"}
            </p>
          </div>
          <Button secondary onClick={() => go("home")}>
            Modify search
          </Button>
        </section>
        <div className="date-strip">
          {dates.map((d, i) => (
            <button
              key={i}
              className={i === 2 ? "active" : ""}
              onClick={() =>
                setSearch({ ...search, date: d.toISOString().slice(0, 10) })
              }
            >
              <span>{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
              <b>
                {d.getDate()}{" "}
                {d.toLocaleDateString("en-IN", { month: "short" })}
              </b>
            </button>
          ))}
        </div>
        <div className="results-layout">
          <aside className="filters card">
            <div className="filter-head">
              <h3>Filters</h3>
              <button
                onClick={() => {
                  setTimesFilter([])
                  setAmenities([])
                  setSeatTypes([])
                  setOperatorFilters([])
                  setDirect(true)
                }}
              >
                Clear all
              </button>
            </div>
            <FilterGroup title="Journey type">
              <Check
                label="Direct buses only"
                checked={direct}
                onChange={() => setDirect(!direct)}
              />
            </FilterGroup>
            <FilterGroup title="Departure time">
              {["Morning", "Afternoon", "Evening"].map((x) => (
                <Check
                  key={x}
                  label={x}
                  checked={timesFilter.includes(x)}
                  onChange={() => toggle(timesFilter, x, setTimesFilter)}
                />
              ))}
            </FilterGroup>
            <FilterGroup title="Price range">
              <div className="range-label">
                <span>₹500</span>
                <span>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input
                className="range"
                type="range"
                min="500"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </FilterGroup>
            <FilterGroup title="Operators">
              {[
                "WayRide Express",
                "Swift Travels",
                "BlueLine Coaches",
                "MetroBus Premium",
                "CityRide Travels",
              ].map((x) => (
                <Check
                  key={x}
                  label={x}
                  checked={operatorFilters.includes(x)}
                  onChange={() =>
                    toggle(operatorFilters, x, setOperatorFilters)
                  }
                />
              ))}
            </FilterGroup>
            <FilterGroup title="Amenities">
              {["Wi-Fi", "Charging", "AC", "Sleeper"].map((x) => (
                <Check
                  key={x}
                  label={x}
                  checked={amenities.includes(x)}
                  onChange={() => toggle(amenities, x, setAmenities)}
                />
              ))}
            </FilterGroup>
            <FilterGroup title="Seat type">
              {["Seater", "Sleeper", "Semi-Sleeper"].map((x) => (
                <Check
                  key={x}
                  label={x}
                  checked={seatTypes.includes(x)}
                  onChange={() => toggle(seatTypes, x, setSeatTypes)}
                />
              ))}
            </FilterGroup>
          </aside>
          <section className="results-list">
            <div className="list-head">
              <div>
                <h2>{filtered.length} buses found</h2>
                <p>
                  {search.from} to {search.to}
                </p>
              </div>
              <Field label="SORT BY">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option>Recommended</option>
                  <option>Lowest price</option>
                  <option>Top rated</option>
                </select>
              </Field>
            </div>
            {filtered.length ? (
              filtered.map((s) => (
                <BusCard
                  key={s.code}
                  service={s}
                  from={search.from}
                  to={search.to}
                  open={open === s.code}
                  toggle={() => setOpen(open === s.code ? null : s.code)}
                  select={() => select(s)}
                />
              ))
            ) : (
              <div className="empty card">
                <Icon name="search" size={32} />
                <h3>No buses match these filters</h3>
                <p>Try clearing one or more filters.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="filter-group">
      <h4>{title}</h4>
      {children}
    </div>
  )
}
function Check({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="box">{checked && <Icon name="check" size={13} />}</span>
      <span>{label}</span>
    </label>
  )
}
function BusCard({
  service: s,
  from,
  to,
  open,
  toggle,
  select,
}: {
  service: Service
  from: string
  to: string
  open: boolean
  toggle: () => void
  select: () => void
}) {
  return (
    <article className="bus-card card">
      <div className="bus-main">
        <div className="operator">
          <div>
            <h3>{s.operator}</h3>
            <p>{s.type}</p>
            <span>Service {s.code}</span>
          </div>
          <b className="rating">★ {s.rating.toFixed(1)}</b>
        </div>
        <div className="schedule">
          <div>
            <strong>{s.departure}</strong>
            <span>{from}</span>
          </div>
          <div className="duration">
            <span>{s.duration} · Direct</span>
            <i />
            <Icon name="bus" size={18} />
          </div>
          <div>
            <strong>{s.arrival}</strong>
            <span>{to}</span>
          </div>
        </div>
        <div className="fare">
          <strong>₹{s.price}</strong>
          <span>per adult</span>
          <b>{s.seats} seats left</b>
        </div>
      </div>
      <div className="bus-footer">
        <div className="amenities">
          {s.amenities.map((a) => (
            <span key={a}>
              <Icon
                name={
                  a === "Wi-Fi"
                    ? "wifi"
                    : a === "Charging"
                      ? "bolt"
                      : a === "AC"
                        ? "ac"
                        : "seat"
                }
                size={15}
              />
              {a}
            </span>
          ))}
        </div>
        <div>
          <button className="details" onClick={toggle}>
            Bus details & policies <Icon name="chevron" size={16} />
          </button>
          <Button onClick={select}>Select seats</Button>
        </div>
      </div>
      {open && (
        <div className="policies">
          <div>
            <h4>Cancellation policy</h4>
            <p>
              Free cancellation up to 24 hours before departure. 50% fee within
              24 hours.
            </p>
          </div>
          <div>
            <h4>Boarding points</h4>
            <p>Central Bus Terminal · City Centre · Airport Link Road</p>
          </div>
          <div>
            <h4>Dropping points</h4>
            <p>Silk Board · Madiwala · Central Station</p>
          </div>
          <div>
            <h4>Luggage & operator</h4>
            <p>
              15 kg checked bag included. Operated by {s.operator}, a verified
              WayRide partner.
            </p>
          </div>
        </div>
      )}
    </article>
  )
}

function Progress({ active }: { active: number }) {
  return (
    <div className="progress">
      {["Select bus", "Choose seats", "Passengers", "Payment"].map((x, i) => (
        <div key={x} className={i <= active ? "active" : ""}>
          <span>{i < active ? <Icon name="check" size={14} /> : i + 1}</span>
          <b>{x}</b>
          {i < 3 && <i />}
        </div>
      ))}
    </div>
  )
}

function Summary({
  search,
  service,
  selected,
  action,
  actionLabel,
  disabled = false,
}: {
  search: Search
  service: Service
  selected: number[]
  action?: () => void
  actionLabel?: string
  disabled?: boolean
}) {
  const fare = selected.length * service.price
  const total = fare + 49
  return (
    <aside className="summary-card card">
      <span className="route-kicker">YOUR JOURNEY</span>
      <h3>
        {search.from} <Icon name="arrow" size={19} /> {search.to}
      </h3>
      <p>
        <Icon name="calendar" size={16} />
        {new Date(search.date + "T12:00:00").toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
      <div className="summary-service">
        <span className="brand-mark small">
          <Icon name="bus" size={17} />
        </span>
        <div>
          <b>{service.operator}</b>
          <span>
            {service.departure} · {service.type}
          </span>
        </div>
      </div>
      <div className="summary-row">
        <span>Selected seats</span>
        <b>{selected.length ? selected.map(formatSeat).join(", ") : "None"}</b>
      </div>
      <div className="summary-row">
        <span>Fare</span>
        <b>
          {selected.length} × ₹{service.price} = ₹{fare}
        </b>
      </div>
      <div className="summary-row">
        <span>Booking fee</span>
        <b>₹49</b>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <b>₹{total}</b>
      </div>
      {action && (
        <Button onClick={action} disabled={disabled} className="full">
          {actionLabel} <Icon name="arrow" size={17} />
        </Button>
      )}
      <small className="secure">
        <Icon name="lock" size={13} /> Secure checkout · No hidden fees
      </small>
    </aside>
  )
}

const formatSeat = (n: number) =>
  n <= 20 ? `${Math.ceil(n / 2)}${n % 2 ? "A" : "B"}` : `L${n - 20}`

function SeatSelection({
  search,
  service,
  selected,
  setSelected,
  next,
  back,
}: {
  search: Search
  service: Service
  selected: number[]
  setSelected: (v: number[]) => void
  next: () => void
  back: () => void
}) {
  const [message, setMessage] = useState("")
  const occupied = [2, 5, 8, 13, 17, 22, 27, 31, 35, 39]
  const choose = (n: number) => {
    if (occupied.includes(n)) return
    if (selected.includes(n)) {
      setSelected(selected.filter((x) => x !== n))
      setMessage("")
      return
    }
    if (selected.length >= search.passengers) {
      setMessage(
        `Please select only ${search.passengers} ${
          search.passengers === 1 ? "seat" : "seats"
        }.`,
      )
      return
    }
    setSelected([...selected, n])
    setMessage("")
  }
  return (
    <main className="page">
      <div className="shell booking-page">
        <button className="back-link" onClick={back}>
          ← Back to bus results
        </button>
        <Progress active={1} />
        <div className="page-title">
          <span className="eyebrow">CHOOSE YOUR PLACE</span>
          <h1>Select your seats</h1>
          <p>
            Pick {search.passengers}{" "}
            {search.passengers === 1 ? "seat" : "seats"} for your journey with{" "}
            {service.operator}.
          </p>
        </div>
        <div className="booking-layout">
          <section className="seat-section card">
            <div className="seat-top">
              <div>
                <h3>{service.type}</h3>
                <p>Lower deck · {service.code}</p>
              </div>
              <div className="legend">
                <span>
                  <i className="available" />
                  Available
                </span>
                <span>
                  <i className="selected" />
                  Selected
                </span>
                <span>
                  <i className="occupied" />
                  Occupied
                </span>
              </div>
            </div>
            {message && (
              <div className="seat-message">
                {message}
                <button onClick={() => setMessage("")}>
                  <Icon name="close" size={15} />
                </button>
              </div>
            )}
            <div className="coach">
              <div className="coach-front">
                <span>FRONT OF COACH</span>
                <div className="driver">
                  <Icon name="steering" size={25} />
                  <small>Driver</small>
                </div>
                <div className="door">DOOR</div>
              </div>
              <div className="coach-labels">
                <span>SEATER</span>
                <span>AISLE</span>
                <span>SLEEPER BERTHS</span>
              </div>
              <div className="coach-body">
                <div className="seater-grid">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => choose(n)}
                      className={`coach-seat ${
                        occupied.includes(n)
                          ? "occupied"
                          : selected.includes(n)
                            ? "selected"
                            : ""
                      }`}
                      disabled={occupied.includes(n)}
                    >
                      <span>{formatSeat(n)}</span>
                      <i />
                    </button>
                  ))}
                </div>
                <div className="aisle">
                  <span>WALKWAY</span>
                  <span>→</span>
                </div>
                <div className="berth-grid">
                  {Array.from({ length: 20 }, (_, i) => i + 21).map((n) => (
                    <button
                      key={n}
                      onClick={() => choose(n)}
                      className={`berth ${
                        occupied.includes(n)
                          ? "occupied"
                          : selected.includes(n)
                            ? "selected"
                            : ""
                      }`}
                      disabled={occupied.includes(n)}
                    >
                      <i />
                      <span>{formatSeat(n)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="coach-rear">REAR OF COACH</div>
            </div>
          </section>
          <Summary
            search={search}
            service={service}
            selected={selected}
            action={next}
            actionLabel="Continue to passenger details"
            disabled={selected.length !== search.passengers}
          />
        </div>
      </div>
    </main>
  )
}

type Passenger = { first: string last: string age: string gender: string }
function PassengerDetails({
  search,
  service,
  selected,
  passengers,
  setPassengers,
  contact,
  setContact,
  next,
  back,
}: {
  search: Search
  service: Service
  selected: number[]
  passengers: Passenger[]
  setPassengers: (p: Passenger[]) => void
  contact: { email: string phone: string assistance: boolean }
  setContact: (c: { email: string phone: string assistance: boolean }) => void
  next: () => void
  back: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const update = (i: number, k: keyof Passenger, v: string) => {
    const copy = [...passengers]
    copy[i] = { ...copy[i], [k]: v }
    setPassengers(copy)
  }
  const errors =
    passengers.some((p) => !p.first || !p.last || !p.age || !p.gender) ||
    !contact.email ||
    !contact.phone
  const submit = () => {
    setSubmitted(true)
    if (!errors) next()
  }
  return (
    <main className="page">
      <div className="shell booking-page">
        <button className="back-link" onClick={back}>
          ← Back to seat selection
        </button>
        <Progress active={2} />
        <div className="page-title">
          <span className="eyebrow">PASSENGER INFORMATION</span>
          <h1>Who's coming along?</h1>
          <p>
            Add passenger details. You're one step closer to your next
            adventure.
          </p>
        </div>
        <div className="booking-layout">
          <section>
            {passengers.map((p, i) => (
              <div className="form-card card" key={i}>
                <div className="form-card-head">
                  <div className="passenger-number">{i + 1}</div>
                  <div>
                    <h3>Passenger {i + 1}</h3>
                    <p>Seat {formatSeat(selected[i])}</p>
                  </div>
                </div>
                <div className="form-grid">
                  <Field
                    label="First name *"
                    error={
                      submitted && !p.first ? "First name is required" : ""
                    }
                  >
                    <input
                      value={p.first}
                      onChange={(e) => update(i, "first", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </Field>
                  <Field
                    label="Last name *"
                    error={submitted && !p.last ? "Last name is required" : ""}
                  >
                    <input
                      value={p.last}
                      onChange={(e) => update(i, "last", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </Field>
                  <Field
                    label="Age *"
                    error={submitted && !p.age ? "Age is required" : ""}
                  >
                    <input
                      value={p.age}
                      onChange={(e) => update(i, "age", e.target.value)}
                      type="number"
                      placeholder="Age"
                    />
                  </Field>
                  <Field
                    label="Gender *"
                    error={submitted && !p.gender ? "Select gender" : ""}
                  >
                    <select
                      value={p.gender}
                      onChange={(e) => update(i, "gender", e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option>Female</option>
                      <option>Male</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </select>
                  </Field>
                </div>
              </div>
            ))}
            <div className="form-card card">
              <div className="form-card-head">
                <span className="contact-icon">
                  <Icon name="user" />
                </span>
                <div>
                  <h3>Contact details</h3>
                  <p>Your ticket and travel updates will be sent here.</p>
                </div>
              </div>
              <div className="form-grid two">
                <Field
                  label="Email address *"
                  error={submitted && !contact.email ? "Email is required" : ""}
                >
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                    placeholder="you@example.com"
                  />
                </Field>
                <Field
                  label="Mobile number *"
                  error={
                    submitted && !contact.phone
                      ? "Mobile number is required"
                      : ""
                  }
                >
                  <input
                    value={contact.phone}
                    onChange={(e) =>
                      setContact({ ...contact, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                  />
                </Field>
              </div>
              <Check
                label="I need accessibility assistance"
                checked={contact.assistance}
                onChange={() =>
                  setContact({ ...contact, assistance: !contact.assistance })
                }
              />
            </div>
          </section>
          <Summary
            search={search}
            service={service}
            selected={selected}
            action={submit}
            actionLabel="Continue to payment"
          />
        </div>
      </div>
    </main>
  )
}

function Payment({
  search,
  service,
  selected,
  next,
  back,
}: {
  search: Search
  service: Service
  selected: number[]
  next: () => void
  back: () => void
}) {
  const [method, setMethod] = useState("Card")
  const [terms, setTerms] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const total = selected.length * service.price + 49
  const pay = () => {
    setSubmitted(true)
    if (terms) next()
  }
  return (
    <main className="page">
      <div className="shell booking-page">
        <button className="back-link" onClick={back}>
          ← Back to passenger details
        </button>
        <Progress active={3} />
        <div className="page-title">
          <span className="eyebrow">SECURE CHECKOUT</span>
          <h1>Review and pay securely</h1>
          <p>Your payment details are encrypted and protected.</p>
        </div>
        <div className="booking-layout">
          <section>
            <div className="review-route card">
              <div className="review-icon">
                <Icon name="bus" size={24} />
              </div>
              <div>
                <span>JOURNEY</span>
                <h3>
                  {search.from} <Icon name="arrow" size={18} /> {search.to}
                </h3>
                <p>
                  {new Date(search.date + "T12:00:00").toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long", year: "numeric" },
                  )}{" "}
                  · {search.passengers} adults · Seats{" "}
                  {selected.map(formatSeat).join(", ")}
                </p>
              </div>
            </div>
            <div className="payment-card card">
              <h3>Choose a payment method</h3>
              <div className="payment-tabs">
                {["Card", "UPI", "Net Banking", "Wallet"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={method === m ? "active" : ""}
                  >
                    <span />
                    {m === "Card" ? "Credit / Debit Card" : m}
                  </button>
                ))}
              </div>
              {method === "Card" && (
                <div className="payment-fields">
                  <Field label="Card number">
                    <input placeholder="1234 5678 9012 3456" />
                  </Field>
                  <div className="form-grid two">
                    <Field label="Expiry date">
                      <input placeholder="MM / YY" />
                    </Field>
                    <Field label="CVV">
                      <input placeholder="•••" />
                    </Field>
                  </div>
                  <Field label="Cardholder name">
                    <input placeholder="Name on card" />
                  </Field>
                </div>
              )}
              {method === "UPI" && (
                <div className="payment-fields">
                  <Field label="UPI ID">
                    <input placeholder="name@bank" />
                  </Field>
                  <p className="muted">
                    A payment request will be sent to your UPI app.
                  </p>
                </div>
              )}
              {(method === "Net Banking" || method === "Wallet") && (
                <div className="payment-fields">
                  <Field
                    label={
                      method === "Wallet" ? "Choose wallet" : "Choose bank"
                    }
                  >
                    <select>
                      <option>Select an option</option>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                    </select>
                  </Field>
                </div>
              )}
              <div className="terms">
                <Check
                  label="I agree to the Terms & Conditions and Privacy Policy."
                  checked={terms}
                  onChange={() => setTerms(!terms)}
                />
                {submitted && !terms && (
                  <small>Please accept the terms to continue.</small>
                )}
              </div>
              <Button onClick={pay} className="pay-btn">
                Pay ₹{total} securely <Icon name="lock" size={16} />
              </Button>
            </div>
          </section>
          <Summary search={search} service={service} selected={selected} />
        </div>
      </div>
    </main>
  )
}

function Confirmation({
  search,
  service,
  selected,
  go,
}: {
  search: Search
  service: Service
  selected: number[]
  go: (p: Page) => void
}) {
  const total = selected.length * service.price + 49
  return (
    <main className="confirmation page">
      <div className="confirm-wrap">
        <div className="success-icon">
          <Icon name="check" size={34} />
        </div>
        <span className="eyebrow">BOOKING COMPLETE</span>
        <h1>
          Your journey is confirmed! <span>🎉</span>
        </h1>
        <p>
          Your ticket is ready. We've also sent a copy to your email and mobile.
        </p>
        <div className="confirmation-card card">
          <div className="confirm-head">
            <div>
              <span>BOOKING ID</span>
              <b>WR-20261010-7824</b>
            </div>
            <span className="confirmed">
              <Icon name="check" size={14} /> Confirmed
            </span>
          </div>
          <div className="confirm-route">
            <div>
              <strong>{service.departure}</strong>
              <b>{search.from}</b>
              <span>
                {new Date(search.date + "T12:00:00").toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "short", year: "numeric" },
                )}
              </span>
            </div>
            <div className="route-line">
              <Icon name="bus" size={21} />
              <i />
              <span>{service.duration}</span>
            </div>
            <div>
              <strong>{service.arrival}</strong>
              <b>{search.to}</b>
              <span>Same/next day</span>
            </div>
          </div>
          <div className="confirm-info">
            <div>
              <span>Operator</span>
              <b>{service.operator}</b>
            </div>
            <div>
              <span>Seats</span>
              <b>{selected.map(formatSeat).join(", ")}</b>
            </div>
            <div>
              <span>Passengers</span>
              <b>{search.passengers} adults</b>
            </div>
            <div>
              <span>Total paid</span>
              <b>₹{total}</b>
            </div>
          </div>
          <div className="confirm-actions">
            <Button onClick={() => go("ticket")}>
              <Icon name="ticket" size={17} /> View ticket
            </Button>
            <Button secondary onClick={() => window.print()}>
              <Icon name="download" size={17} /> Download ticket
            </Button>
          </div>
        </div>
        <div className="confirm-links">
          <button onClick={() => go("home")}>Back to home</button>
          <i />
          <button onClick={() => go("bookings")}>Go to My bookings</button>
        </div>
      </div>
    </main>
  )
}

function Bookings({
  search,
  service,
  selected,
  go,
}: {
  search: Search
  service: Service
  selected: number[]
  go: (p: Page) => void
}) {
  const [tab, setTab] = useState("Upcoming")
  return (
    <main className="page">
      <div className="shell simple-page">
        <span className="eyebrow">YOUR TRIPS</span>
        <h1>My bookings</h1>
        <p>View and manage all your journeys in one place.</p>
        <div className="tabs">
          {["Upcoming", "Completed", "Cancelled"].map((x) => (
            <button
              key={x}
              className={tab === x ? "active" : ""}
              onClick={() => setTab(x)}
            >
              {x}
              <span>{x === "Upcoming" ? 1 : 0}</span>
            </button>
          ))}
        </div>
        {tab === "Upcoming" ? (
          <article className="booking-card card">
            <div className="booking-accent" />
            <div className="booking-top">
              <div>
                <span className="confirmed">
                  <Icon name="check" size={13} /> Confirmed
                </span>
                <h3>{service.operator}</h3>
                <p>
                  {service.type} · {service.code}
                </p>
              </div>
              <div>
                <span>BOOKING ID</span>
                <b>WR-20261010-7824</b>
              </div>
            </div>
            <div className="booking-route">
              <div>
                <strong>{service.departure}</strong>
                <b>{search.from}</b>
                <span>
                  {new Date(search.date + "T12:00:00").toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" },
                  )}
                </span>
              </div>
              <div className="route-line">
                <Icon name="bus" />
                <i />
                <span>{service.duration}</span>
              </div>
              <div>
                <strong>{service.arrival}</strong>
                <b>{search.to}</b>
                <span>Arrival</span>
              </div>
            </div>
            <div className="booking-bottom">
              <div>
                <span>Seats</span>
                <b>{selected.map(formatSeat).join(", ") || "7A, 7B"}</b>
              </div>
              <div>
                <span>Passengers</span>
                <b>{search.passengers} adults</b>
              </div>
              <div className="booking-buttons">
                <Button secondary>Manage booking</Button>
                <Button onClick={() => go("ticket")}>View ticket</Button>
              </div>
            </div>
          </article>
        ) : (
          <div className="empty-state card">
            <Icon name="ticket" size={34} />
            <h3>No {tab.toLowerCase()} trips</h3>
            <p>Your {tab.toLowerCase()} journeys will appear here.</p>
            <Button onClick={() => go("home")}>Book a journey</Button>
          </div>
        )}
      </div>
    </main>
  )
}

function QR() {
  return (
    <div className="qr" aria-label="QR code placeholder">
      {Array.from({ length: 81 }, (_, i) => (
        <i
          key={i}
          className={
            (i * 7 + (i % 5)) % 3 === 0 ||
            [
              0, 1, 2, 9, 11, 18, 19, 20, 60, 61, 62, 69, 71, 78, 79, 80,
            ].includes(i)
              ? "on"
              : ""
          }
        />
      ))}
    </div>
  )
}
function Ticket({
  search,
  service,
  selected,
  passengers,
  go,
}: {
  search: Search
  service: Service
  selected: number[]
  passengers: Passenger[]
  go: (p: Page) => void
}) {
  return (
    <main className="page">
      <div className="shell ticket-page">
        <button className="back-link" onClick={() => go("bookings")}>
          ← Back to bookings
        </button>
        <div className="ticket-heading">
          <div>
            <span className="eyebrow">E-TICKET</span>
            <h1>Your ticket</h1>
            <p>Present this ticket and a valid photo ID when boarding.</p>
          </div>
          <Button secondary onClick={() => window.print()}>
            <Icon name="download" size={17} /> Download ticket
          </Button>
        </div>
        <article className="ticket-card">
          <div className="ticket-top">
            <div className="brand inverse">
              <span className="brand-mark">
                <Icon name="bus" size={22} />
              </span>
              WayRide
            </div>
            <div>
              <span>BOOKING ID</span>
              <b>WR-20261010-7824</b>
            </div>
          </div>
          <div className="ticket-body">
            <div className="ticket-main">
              <div className="ticket-route">
                <div>
                  <span>DEPARTURE</span>
                  <strong>{service.departure}</strong>
                  <b>{search.from}</b>
                  <small>
                    {new Date(search.date + "T12:00:00").toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </small>
                </div>
                <div className="route-line">
                  <Icon name="bus" />
                  <i />
                  <span>{service.duration}</span>
                </div>
                <div>
                  <span>ARRIVAL</span>
                  <strong>{service.arrival}</strong>
                  <b>{search.to}</b>
                  <small>Same / next day</small>
                </div>
              </div>
              <div className="ticket-details">
                <div>
                  <span>PASSENGERS</span>
                  <b>
                    {passengers
                      .filter((p) => p.first)
                      .map((p) => `${p.first} ${p.last}`)
                      .join(", ") || "Aarav Sharma, Meera Sharma"}
                  </b>
                </div>
                <div>
                  <span>OPERATOR</span>
                  <b>{service.operator}</b>
                  <small>
                    {service.code} · {service.type}
                  </small>
                </div>
                <div>
                  <span>SEATS</span>
                  <b>{selected.map(formatSeat).join(", ") || "7A, 7B"}</b>
                </div>
                <div>
                  <span>BOARDING</span>
                  <b>Central Bus Terminal</b>
                  <small>Report 20 min early</small>
                </div>
              </div>
            </div>
            <aside className="ticket-qr">
              <QR />
              <b>Scan to board</b>
              <span>Keep this code visible</span>
            </aside>
          </div>
          <div className="ticket-foot">
            <span>
              <Icon name="help" size={16} /> Need help? Call 1800 123 9274
            </span>
            <b>Have a smooth journey.</b>
          </div>
        </article>
        <div className="ticket-actions">
          <Button secondary>
            <Icon name="calendar" size={17} /> Add to calendar
          </Button>
          <Button secondary onClick={() => go("bookings")}>
            Back to bookings
          </Button>
        </div>
      </div>
    </main>
  )
}

const cityDescriptions: Record<string, string> = {
  Chennai: "Coastal culture and timeless temples",
  Bengaluru: "Gardens, cafés and creative energy",
  Hyderabad: "Heritage, biryani and bustling bazaars",
  Coimbatore: "Gateway to the Western Ghats",
  Madurai: "Ancient temples and vibrant streets",
  Kochi: "Backwaters and colonial charm",
  Mysuru: "Palaces, gardens and quiet grace",
  Pune: "Culture, campuses and hill escapes",
  Mumbai: "The city of dreams by the sea",
  Goa: "Golden shores and laid-back days",
}
function Destinations({
  search,
  setSearch,
  onSearch,
}: {
  search: Search
  setSearch: (s: Search) => void
  onSearch: () => void
}) {
  const fares = [599, 649, 749, 549, 529, 699, 449, 499, 549, 799]
  return (
    <main className="page">
      <div className="destination-hero">
        <div className="shell">
          <span className="eyebrow light">EXPLORE INDIA</span>
          <h1>Where will you go next?</h1>
          <p>
            Discover vibrant cities, coastal escapes and cultural favourites
            connected by comfortable buses.
          </p>
        </div>
      </div>
      <div className="shell destination-section">
        <div className="section-heading">
          <div>
            <h2>Popular destinations</h2>
            <p>Handpicked places for your next road journey.</p>
          </div>
        </div>
        <div className="destination-grid">
          {cities.map((city, i) => (
            <article className="destination-card card" key={city}>
              <div className={`city-art city-${i}`}>
                <span>{city.slice(0, 2).toUpperCase()}</span>
                <div className="city-lines" />
              </div>
              <div>
                <h3>{city}</h3>
                <p>{cityDescriptions[city]}</p>
                <span>
                  Journeys from <b>₹{fares[i]}</b>
                </span>
                <Button
                  secondary
                  onClick={() => {
                    const from = city === "Chennai" ? "Bengaluru" : "Chennai"
                    setSearch({ ...search, from, to: city })
                    setTimeout(onSearch, 0)
                  }}
                >
                  Explore buses <Icon name="arrow" size={16} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

function Help() {
  const [open, setOpen] = useState(0)
  const [query, setQuery] = useState("")
  const items = faq.filter(
    (x) =>
      x[0].toLowerCase().includes(query.toLowerCase()) ||
      x[1].toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <main className="page">
      <section className="help-hero">
        <div className="shell">
          <span className="eyebrow light">HELP CENTRE</span>
          <h1>How can we help?</h1>
          <div className="help-search">
            <Icon name="search" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookings, payments, cancellations..."
            />
          </div>
        </div>
      </section>
      <div className="shell help-content">
        <div className="help-categories">
          {[
            ["ticket", "Booking"],
            ["lock", "Payments"],
            ["seat", "Seat selection"],
            ["close", "Cancellation"],
            ["arrow", "Refunds"],
            ["map", "Travel information"],
          ].map(([icon, label]) => (
            <button key={label}>
              <Icon name={icon} />
              <span>{label}</span>
              <Icon name="arrow" size={15} />
            </button>
          ))}
        </div>
        <section className="faq-section">
          <div>
            <span className="eyebrow">POPULAR QUESTIONS</span>
            <h2>Frequently asked questions</h2>
            <p>Quick answers to help make your journey simpler.</p>
            <div className="support-card">
              <Icon name="help" size={25} />
              <h3>Still need help?</h3>
              <p>Our support team is available around the clock.</p>
              <Button>Contact support</Button>
            </div>
          </div>
          <div className="faq-list">
            {items.map((x, i) => (
              <article
                key={x[0]}
                className={`faq-item ${open === i ? "open" : ""}`}
              >
                <button onClick={() => setOpen(open === i ? -1 : i)}>
                  <b>{x[0]}</b>
                  <span>{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <p>{x[1]}</p>}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function Auth({ signup, go }: { signup: boolean go: (p: Page) => void }) {
  const [remember, setRemember] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    go("home")
  }
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-overlay" />
        <div className="auth-brand brand inverse">
          <span className="brand-mark">
            <Icon name="bus" size={22} />
          </span>
          WayRide
        </div>
        <div className="auth-copy">
          <span className="eyebrow light">TRAVEL, SIMPLIFIED</span>
          <h1>
            Better journeys
            <br />
            begin with WayRide.
          </h1>
          <p>
            Comfortable buses, transparent prices and support whenever you need
            it.
          </p>
          <div className="auth-proof">
            <span>✓ Choose your seat</span>
            <span>✓ Secure payments</span>
            <span>✓ Instant tickets</span>
          </div>
        </div>
      </section>
      <section className="auth-form-wrap">
        <button className="auth-home" onClick={() => go("home")}>
          ← Back to home
        </button>
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">
            {signup ? "JOIN WAYRIDE" : "WELCOME BACK"}
          </span>
          <h1>{signup ? "Create your account" : "Sign in to WayRide"}</h1>
          <p>
            {signup
              ? "Plan journeys and keep all your tickets in one place."
              : "Access your bookings and continue your journey."}
          </p>
          {signup && (
            <div className="form-grid two">
              <Field label="First name">
                <input required placeholder="First name" />
              </Field>
              <Field label="Last name">
                <input required placeholder="Last name" />
              </Field>
            </div>
          )}
          <Field label="Email address">
            <input type="email" required placeholder="you@example.com" />
          </Field>
          {signup && (
            <Field label="Mobile number">
              <input required placeholder="+91 98765 43210" />
            </Field>
          )}
          <Field label="Password">
            <input
              type="password"
              required
              placeholder="At least 8 characters"
            />
          </Field>
          {signup && (
            <Field label="Confirm password">
              <input type="password" required placeholder="Repeat password" />
            </Field>
          )}
          {!signup && (
            <div className="remember">
              <Check
                label="Remember me"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <button type="button">Forgot password?</button>
            </div>
          )}
          <Button type="submit" className="full">
            {signup ? "Create account" : "Sign in"}{" "}
            <Icon name="arrow" size={17} />
          </Button>
          <div className="auth-switch">
            {signup ? "Already have an account?" : "New to WayRide?"}{" "}
            <button
              type="button"
              onClick={() => go(signup ? "login" : "signup")}
            >
              {signup ? "Sign in" : "Create an account"}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [search, setSearch] = useState<Search>({
    from: "Chennai",
    to: "Bengaluru",
    date: "2026-10-17",
    passengers: 2,
    trip: "One way",
  })
  const [service, setService] = useState<Service>(allServices[0])
  const [selected, setSelected] = useState<number[]>([13, 14])
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: 2 }, () => ({
      first: "",
      last: "",
      age: "",
      gender: "",
    })),
  )
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    assistance: false,
  })
  const go = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const routeServices = useMemo(() => {
    const idx = Math.max(
      0,
      routes.findIndex((r) => r[0] === search.from && r[1] === search.to),
    )
    const count = 4 + (idx % 5)
    return Array.from(
      { length: count },
      (_, i) => allServices[(idx * 3 + i) % 20],
    )
  }, [search.from, search.to])
  const doSearch = () => go("results")
  const chooseService = (s: Service) => {
    setService(s)
    setSelected([])
    go("seats")
  }
  const toPassengers = () => {
    setPassengers(
      Array.from(
        { length: search.passengers },
        (_, i) => passengers[i] || { first: "", last: "", age: "", gender: "" },
      ),
    )
    go("passengers")
  }
  const noHeader = page === "login" || page === "signup"
  return (
    <div className="app">
      {!noHeader && <Header page={page} go={go} />}
      {page === "home" && (
        <Home
          search={search}
          setSearch={setSearch}
          onSearch={doSearch}
          go={go}
        />
      )}
      {page === "results" && (
        <Results
          search={search}
          setSearch={setSearch}
          services={routeServices}
          select={chooseService}
          go={go}
        />
      )}
      {page === "seats" && (
        <SeatSelection
          search={search}
          service={service}
          selected={selected}
          setSelected={setSelected}
          next={toPassengers}
          back={() => go("results")}
        />
      )}
      {page === "passengers" && (
        <PassengerDetails
          search={search}
          service={service}
          selected={selected}
          passengers={passengers}
          setPassengers={setPassengers}
          contact={contact}
          setContact={setContact}
          next={() => go("payment")}
          back={() => go("seats")}
        />
      )}
      {page === "payment" && (
        <Payment
          search={search}
          service={service}
          selected={selected}
          next={() => go("confirmation")}
          back={() => go("passengers")}
        />
      )}
      {page === "confirmation" && (
        <Confirmation
          search={search}
          service={service}
          selected={selected}
          go={go}
        />
      )}
      {page === "bookings" && (
        <Bookings
          search={search}
          service={service}
          selected={selected}
          go={go}
        />
      )}
      {page === "ticket" && (
        <Ticket
          search={search}
          service={service}
          selected={selected}
          passengers={passengers}
          go={go}
        />
      )}
      {page === "destinations" && (
        <Destinations
          search={search}
          setSearch={setSearch}
          onSearch={doSearch}
        />
      )}
      {page === "help" && <Help />}
      {page === "login" && <Auth signup={false} go={go} />}
      {page === "signup" && <Auth signup go={go} />}
    </div>
  )
}
