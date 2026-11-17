import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin,
  Search,
  CalendarDays,
  Users,
  Clock,
  Wifi,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Headphones,
  Bus,
  Star,
  MessageCircle,
} from "lucide-react";
import heroBus from "@/assets/hero-bus.jpg";
import advMpesa from "@/assets/adv-mpesa.jpg";
import advComfort from "@/assets/adv-comfort.jpg";
import advSupport from "@/assets/adv-support.jpg";
import { CITIES, findTrips, type Trip } from "@/lib/routes-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tahmeed Express Coach — Book Bus Tickets Online in Kenya & East Africa" },
      {
        name: "description",
        content:
          "Search luxury Tahmeed Express Coach routes across Kenya, Uganda, and Tanzania. VIP Sleeper & Executive departures with instant WhatsApp booking at +254 735 145 442.",
      },
      { property: "og:title", content: "Tahmeed Express — Royal Class Luxury Travel" },
      {
        property: "og:description",
        content: "Search routes, select your preferred departure, and reserve your Tahmeed coach seat instantly on WhatsApp.",
      },
    ],
  }),
  component: Index,
});

const WHATSAPP_NUMBER = "254735145442";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function Index() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(todayISO());
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState<Trip[] | null>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const f = from.trim();
    const t = to.trim();
    if (!f || !t) {
      setError("Please enter both a departure and destination town.");
      setResults(null);
      return;
    }
    if (f.toLowerCase() === t.toLowerCase()) {
      setError("Departure and destination cannot be the same.");
      setResults(null);
      return;
    }
    setError("");
    setResults(findTrips(f, t));
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const book = (trip: Trip) => {
    const message = [
      "*TAHMEED EXPRESS COACH — BOOKING REQUEST*",
      "",
      `Route: ${trip.from} → ${trip.to}`,
      `Travel date: ${date}`,
      `Departure: ${trip.departure} (arrives ${trip.arrival})`,
      `Bus: ${trip.busType}`,
      `Passengers: ${passengers}`,
      `Fare: KSh ${trip.price.toLocaleString()} per seat`,
      `Total: KSh ${(trip.price * passengers).toLocaleString()}`,
      "",
      "Please confirm my seat availability.",
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Bus className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-xl font-extrabold tracking-tight text-foreground leading-tight">
                TAHMEED
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                EXPRESS &bull; ROYAL CLASS
              </span>
            </div>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex">
            <a className="transition-smooth hover:text-primary" href="#routes">Routes</a>
            <a className="transition-smooth hover:text-primary" href="#advantages">Why Tahmeed</a>
            <a className="transition-smooth hover:text-primary" href="#how">How to Book</a>
            <a className="transition-smooth hover:text-primary" href="#support">Support</a>
          </nav>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ink-foreground transition-smooth hover:bg-primary shadow-sm hover:shadow-glow"
          >
            <MessageCircle className="h-4 w-4 text-primary-glow" />
            <span>+254 735 145 442</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <img
          src={heroBus}
          alt="Tahmeed Coach luxury emerald green coach bus cruising Kenyan highway at sunset"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-ink opacity-85" />
        <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary-glow backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-current" /> East Africa's Premier Luxury Coach
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold text-ink-foreground sm:text-7xl">
            Book. Pay. <span className="text-primary-glow">Travel.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-foreground/80 sm:text-lg">
            Search daily routes across Kenya & East Africa. Secure your VIP or Executive seat with instant WhatsApp confirmation.
          </p>
        </div>

        {/* Search card */}
        <div className="relative mx-auto -mb-16 max-w-5xl translate-y-[-3rem] px-5">
          <form
            onSubmit={handleSearch}
            className="rounded-3xl border border-border/60 bg-card p-5 shadow-card sm:p-7"
          >
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="From" icon={<MapPin className="h-4 w-4" />}>
                <input
                  list="cities"
                  value={from}
                  onChange={(e) => setFrom(e.target.value.slice(0, 60))}
                  placeholder="Departure town"
                  className="w-full bg-transparent text-base font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
              </Field>
              <Field label="To" icon={<MapPin className="h-4 w-4" />}>
                <input
                  list="cities"
                  value={to}
                  onChange={(e) => setTo(e.target.value.slice(0, 60))}
                  placeholder="Destination"
                  className="w-full bg-transparent text-base font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
              </Field>
              <Field label="Travel date" icon={<CalendarDays className="h-4 w-4" />}>
                <input
                  type="date"
                  value={date}
                  min={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-base font-semibold text-foreground outline-none"
                />
              </Field>
              <Field label="Passengers" icon={<Users className="h-4 w-4" />}>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-transparent text-base font-semibold text-foreground outline-none"
                >
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} passenger{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <datalist id="cities">
              {CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}

            <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-4 font-display text-base font-bold text-primary-foreground shadow-glow transition-smooth hover:brightness-110 active:scale-[0.99]"
            >
              <Search className="h-5 w-5" /> Search Buses
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="mx-auto max-w-5xl scroll-mt-24 px-5 pb-6 pt-24">
        {results && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  {from} <ArrowRight className="inline h-6 w-6 text-primary" /> {to}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {results.length} departures found for {date} · {passengers} passenger
                  {passengers > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {results.map((trip) => (
                <article
                  key={trip.id}
                  className="group grid gap-5 rounded-2xl border border-border/70 bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/50 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                        {trip.busType}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" /> {trip.duration}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {trip.seatsLeft} seats left
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div>
                        <p className="font-display text-2xl font-bold text-foreground">
                          {trip.departure}
                        </p>
                        <p className="text-xs text-muted-foreground">{trip.from}</p>
                      </div>
                      <div className="h-px flex-1 bg-border" />
                      <Bus className="h-5 w-5 text-primary" />
                      <div className="h-px flex-1 bg-border" />
                      <div className="text-right">
                        <p className="font-display text-2xl font-bold text-foreground">
                          {trip.arrival}
                        </p>
                        <p className="text-xs text-muted-foreground">{trip.to}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {trip.amenities.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          <Wifi className="h-3 w-3" /> {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <div className="text-right">
                      <p className="font-display text-2xl font-extrabold text-foreground">
                        KSh {trip.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">per seat</p>
                    </div>
                    <Button
                      onClick={() => book(trip)}
                      className="rounded-xl bg-gradient-primary px-6 py-5 font-display font-bold text-primary-foreground shadow-glow transition-smooth hover:brightness-110"
                    >
                      Book now
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-muted-foreground">
              Booking details are sent to our WhatsApp desk for instant confirmation.
            </p>
          </>
        )}
      </section>

      {/* Popular routes */}
      <section id="routes" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <h2 className="font-display text-3xl font-bold text-foreground">Popular routes</h2>
        <p className="mt-2 text-muted-foreground">Tap a route to search instantly.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Nairobi", "Mombasa"],
            ["Nairobi", "Kisumu"],
            ["Mombasa", "Malindi"],
            ["Nairobi", "Eldoret"],
            ["Nairobi", "Kampala"],
            ["Kisumu", "Nakuru"],
          ].map(([a, b]) => (
            <button
              key={`${a}${b}`}
              onClick={() => {
                setFrom(a!);
                setTo(b!);
                setError("");
                setResults(findTrips(a!, b!));
                setTimeout(
                  () =>
                    document
                      .getElementById("results")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                  60,
                );
              }}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-5 text-left shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/60"
            >
              <span className="font-display text-lg font-bold text-foreground">
                {a} <ArrowRight className="inline h-4 w-4 text-primary" /> {b}
              </span>
              <span className="text-sm font-semibold text-primary">Search</span>
            </button>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section id="advantages" className="bg-gradient-ink py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-4xl font-extrabold text-ink-foreground">
            Our advantages
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                image: advMpesa,
                icon: <Ticket className="h-6 w-6" />,
                title: "Lipa Na M-Pesa",
                text: "Pay from anywhere with M-Pesa and other convenient options.",
              },
              {
                image: advComfort,
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "We care",
                text: "The most comfortable coaches on Kenyan roads, with ample legroom.",
              },
              {
                image: advSupport,
                icon: <Headphones className="h-6 w-6" />,
                title: "24/7 WhatsApp desk",
                text: "Real people confirming your seat and answering questions any time.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="overflow-hidden rounded-2xl border border-primary/20 bg-ink/60 backdrop-blur transition-smooth hover:border-primary/60"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-48 w-full object-cover"
                />
                <div className="p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    {c.icon}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-ink-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-foreground/70">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <h2 className="font-display text-3xl font-bold text-foreground">How booking works</h2>
        <p className="mt-2 text-muted-foreground">Three steps from search to seat.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              icon: <Search className="h-5 w-5" />,
              title: "Search your route",
              text: "Enter your departure town, destination and travel date to see all departures.",
            },
            {
              step: "02",
              icon: <MessageCircle className="h-5 w-5" />,
              title: "Send on WhatsApp",
              text: "Tap Book now and your trip details are forwarded to our booking desk instantly.",
            },
            {
              step: "03",
              icon: <Ticket className="h-5 w-5" />,
              title: "Pay & travel",
              text: "Confirm with M-Pesa, receive your ticket and board with a reserved seat.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="relative rounded-2xl border border-border/70 bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/60"
            >
              <span className="absolute right-6 top-5 font-display text-4xl font-extrabold text-primary/15">
                {s.step}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                {s.icon}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Tahmeed, I'd like to book a bus ticket.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp us to book"
        className="group fixed bottom-6 right-5 z-50 flex items-center gap-3 rounded-full bg-whatsapp px-5 py-4 font-display text-sm font-bold text-whatsapp-foreground shadow-whatsapp transition-smooth hover:scale-105 hover:brightness-110 active:scale-100"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40" />
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline">WhatsApp us to book</span>
        <span className="sm:hidden">Book</span>
      </a>


      <footer id="support" className="border-t border-border bg-card/60 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Bus className="h-4 w-4" />
            </span>
            <span className="font-display text-xl font-extrabold text-foreground">TAHMEED EXPRESS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Direct Bookings & Customer Enquiries:{" "}
            <a
              className="font-bold text-primary hover:underline"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              +254 735 145 442
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tahmeed Express Coach Kenya. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-2xl border border-border bg-muted/50 px-4 py-3 transition-smooth focus-within:border-primary focus-within:bg-card">
      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {icon} {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
