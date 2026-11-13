"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, ExternalLink, X } from "lucide-react";

// Photos live in /public/photos. Respect the optional sub-path deployment
// (NEXT_PUBLIC_BASE_PATH, e.g. "/thebestpeople") instead of hard-coding it.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const photo = (file: string) => `${BASE_PATH}/photos/${file}`;

// Types
interface Person {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  quote: string;
  quoteSource?: string;
  /** When the quote was said, "YYYY-MM". Only the year is displayed. */
  quoteDate?: string;
  /** Attribution caveat, e.g. when the quote is second-hand. */
  quoteNote?: string;
  /** How the person left the job. */
  exit: { label: string; kind: ExitKind };
  photo: string;
}

type ExitKind = "fired" | "resigned" | "replaced" | "term";

interface Role {
  id: string;
  title: string;
  shortTitle: string;
}

// Data
const roles: Role[] = [
  { id: "president", title: "President", shortTitle: "President" },
  { id: "vp", title: "Vice President", shortTitle: "Vice President" },
  { id: "sos", title: "Secretary of State", shortTitle: "State" },
  { id: "ag", title: "Attorney General", shortTitle: "Attorney General" },
  { id: "cos", title: "Chief of Staff", shortTitle: "Chief of Staff" },
  { id: "secdef", title: "Secretary of Defense", shortTitle: "Defense" },
  {
    id: "nsa",
    title: "National Security Advisor",
    shortTitle: "Nat. Security Advisor",
  },
  { id: "cjcs", title: "Chairman Joint Chiefs", shortTitle: "Joint Chiefs" },
  {
    id: "dni",
    title: "Director of National Intelligence",
    shortTitle: "Nat. Intelligence",
  },
  { id: "seced", title: "Secretary of Education", shortTitle: "Education" },
  {
    id: "sectrans",
    title: "Secretary of Transportation",
    shortTitle: "Transportation",
  },
];

const people: Person[] = [
  {
    id: "trump",
    name: "Donald Trump",
    role: "president",
    startDate: "2017-01",
    endDate: "2021-01",
    quote:
      "I know the best people. I know the best managers. I know the best dealmakers. I know people who will make us so strong. I know guys that are so good.",
    quoteSource:
      "https://www.ms.now/top-stories/latest/trump-white-house-cabinet-project-2025-rcna177081",
    quoteDate: "2016-04",
    exit: { label: "Term ended", kind: "term" },
    photo: photo("trump.jpg"),
  },
  {
    id: "pence",
    name: "Mike Pence",
    role: "vp",
    startDate: "2017-01",
    endDate: "2021-01",
    quote:
      "President Trump was wrong. I had no right to overturn the election. And his reckless words endangered my family and everyone at the Capitol.",
    quoteSource:
      "https://www.nytimes.com/2022/02/04/us/politics/pence-trump-jan-6.html",
    quoteDate: "2022-02",
    exit: { label: "Term ended", kind: "term" },
    photo: photo("pence.jpg"),
  },
  {
    id: "tillerson",
    name: "Rex Tillerson",
    role: "sos",
    startDate: "2017-02",
    endDate: "2018-03",
    quote:
      "[He is] a man who is pretty undisciplined, doesn't like to read, doesn't read briefing reports, doesn't like to get into the details of a lot of things.",
    quoteSource: "https://www.bbc.com/news/world-us-canada-46492744",
    quoteDate: "2018-12",
    exit: { label: "Fired by tweet", kind: "fired" },
    photo: photo("tillerson.jpg"),
  },
  {
    id: "pompeo",
    name: "Mike Pompeo",
    role: "sos",
    startDate: "2018-04",
    endDate: "2021-01",
    quote:
      "You know, Donald Trump the other day said that, in quote, if he tells a soldier to commit a war crime, the soldier will just go do it. He said they'll do as I tell them to do.",
    quoteSource:
      "https://www.newsweek.com/mike-pompeo-trump-obama-2016-authoritarian-president-ignored-constitution-1455073",
    quoteDate: "2016-03",
    exit: { label: "Served to end of term", kind: "term" },
    photo: photo("pompeo.jpg"),
  },
  {
    id: "sessions",
    name: "Jeff Sessions",
    role: "ag",
    startDate: "2017-02",
    endDate: "2018-11",
    quote:
      "He is a person who has no loyalty. He doesn't understand the concepts of law and justice.",
    quoteSource:
      "https://www.theatlantic.com/politics/archive/2020/11/jeff-sessions-trump-loyalty/617180/",
    exit: { label: "Forced out", kind: "fired" },
    photo: photo("sessions.jpg"),
  },
  {
    id: "whitaker",
    name: "Matt Whitaker",
    role: "ag",
    startDate: "2018-11",
    endDate: "2019-02",
    quote:
      "The president... does he have anyone that has the president's ear? Or does he just kind of watch news accounts and responds to [them], which is a little dangerous.",
    quoteSource:
      "https://theweek.com/speedreads/810363/acting-attorney-general-matthew-whitaker-criticized-trump-interviews-unlikable-selfserving-dangerous",
    quoteDate: "2017-06",
    exit: { label: "Acting, replaced", kind: "replaced" },
    photo: photo("whitaker.jpg"),
  },
  {
    id: "barr",
    name: "William Barr",
    role: "ag",
    startDate: "2019-02",
    endDate: "2020-12",
    quote:
      "He is a consummate narcissist and constantly engages in reckless conduct that puts his political party and the country at risk.",
    quoteSource:
      "https://www.npr.org/2022/03/06/1084883520/william-barr-new-book-trump-2024-election",
    exit: { label: "Resigned", kind: "resigned" },
    photo: photo("barr.jpg"),
  },
  {
    id: "priebus",
    name: "Reince Priebus",
    role: "cos",
    startDate: "2017-01",
    endDate: "2017-07",
    quote:
      "No woman should ever be described in these terms or talked about in this manner. Ever.",
    quoteSource:
      "https://www.pbs.org/newshour/politics/headline-republicans-react-trump-comments-objectifying-women",
    quoteDate: "2016-10",
    exit: { label: "Forced out", kind: "fired" },
    photo: photo("priebus.jpg"),
  },
  {
    id: "kelly",
    name: "John Kelly",
    role: "cos",
    startDate: "2017-07",
    endDate: "2019-01",
    quote:
      "A person that has no idea what America stands for and has no idea what being an American is all about... He is a person who admires autocrats and murderous dictators.",
    quoteSource:
      "https://www.nytimes.com/2023/10/02/us/politics/john-kelly-trump-fitness-office.html",
    quoteDate: "2023-10",
    exit: { label: "Forced out", kind: "fired" },
    photo: photo("kelly.jpg"),
  },
  {
    id: "mulvaney",
    name: "Mick Mulvaney",
    role: "cos",
    startDate: "2019-01",
    endDate: "2020-03",
    quote: "He failed at being the president when we needed him to be that.",
    quoteSource:
      "https://www.cnbc.com/2022/06/28/trump-was-wrong-mick-mulvaney-says-hes-changed-views-on-jan-6.html",
    quoteDate: "2022-06",
    exit: { label: "Acting, replaced", kind: "replaced" },
    photo: photo("mulvaney.jpg"),
  },
  {
    id: "meadows",
    name: "Mark Meadows",
    role: "cos",
    startDate: "2020-03",
    endDate: "2021-01",
    quote:
      "If I can get through this job and manage to keep him out of jail, I'll have done a good job.",
    quoteSource:
      "https://www.nbcnews.com/politics/donald-trump/cassidy-hutchinson-reveals-details-disarray-trumps-white-house-rcna117344",
    quoteNote: "As recounted by his aide Cassidy Hutchinson",
    exit: { label: "Served to end of term", kind: "term" },
    photo: photo("meadows.jpg"),
  },
  {
    id: "mattis",
    name: "Jim Mattis",
    role: "secdef",
    startDate: "2017-01",
    endDate: "2019-01",
    quote:
      "Donald Trump is the first president in my lifetime who does not try to unite the American people—does not even pretend to try. Instead, he tries to divide us.",
    quoteSource:
      "https://www.theatlantic.com/politics/archive/2020/06/james-mattis-denounces-trump-protests-militarization/612640/",
    quoteDate: "2020-06",
    exit: { label: "Resigned in protest", kind: "resigned" },
    photo: photo("mattis.jpg"),
  },
  {
    id: "shanahan",
    name: "Patrick Shanahan",
    role: "secdef",
    startDate: "2019-01",
    endDate: "2019-06",
    quote:
      "I expect you to remind leaders at all levels in the Department to reinforce the apolitical nature of military service and professionalism.",
    quoteSource:
      "https://www.cbsnews.com/news/patrick-shanahan-acting-defense-secretary-urges-military-to-maintain-apolitical-nature-in-new-internal-memo/",
    quoteDate: "2019-03",
    exit: { label: "Acting, withdrew", kind: "replaced" },
    photo: photo("shanahan.jpg"),
  },
  {
    id: "esper",
    name: "Mark Esper",
    role: "secdef",
    startDate: "2019-07",
    endDate: "2020-11",
    quote:
      "I do regard him as a threat to democracy... I think he's unfit for office.",
    quoteSource:
      "https://www.cbsnews.com/news/mark-esper-former-defense-secretary-60-minutes-2022-05-08/",
    quoteDate: "2022-05",
    exit: { label: "Fired by tweet", kind: "fired" },
    photo: photo("esper.jpg"),
  },
  {
    id: "mcmaster",
    name: "H.R. McMaster",
    role: "nsa",
    startDate: "2017-02",
    endDate: "2018-04",
    quote:
      "[Trump] encouraged an attack, you know, on the first branch of government, and an attack on the peaceful transition of power, and I think that that was an abandonment of his responsibilities to the Constitution",
    quoteSource:
      "https://www.cbsnews.com/news/h-r-mcmaster-at-war-with-ourselves-my-tour-of-duty-in-the-trump-white-house",
    quoteDate: "2024-08",
    exit: { label: "Forced out", kind: "fired" },
    photo: photo("mcmaster.jpg"),
  },
  {
    id: "bolton",
    name: "John Bolton",
    role: "nsa",
    startDate: "2018-04",
    endDate: "2019-09",
    quote:
      "I don't think he's fit for office. I don't think he has the competence to carry out the job.",
    quoteSource:
      "https://abcnews.go.com/Politics/john-bolton-book-interview-trump-fit-office-reelection/story?id=71334168",
    quoteDate: "2020-06",
    exit: { label: "Forced out", kind: "fired" },
    photo: photo("bolton.jpg"),
  },
  {
    id: "obrien",
    name: "Robert O'Brien",
    role: "nsa",
    startDate: "2019-09",
    endDate: "2021-01",
    quote:
      "And Donald Trump is—has said that he's willing to scrap our alliance with NATO. He's willing to scrap our… alliances in the Pacific with Japan and Korea and South Korea. I mean, these are extraordinarily dangerous statements at a time that the world does not need that sort of inconsistent and wavering American leadership given the threats that we're facing.",
    quoteSource:
      "https://www.cnn.com/2019/10/05/politics/robert-obrien-extraordinarily-dangerous-kfile",
    quoteDate: "2016-06",
    exit: { label: "Served to end of term", kind: "term" },
    photo: photo("obrien.jpg"),
  },
  {
    id: "dunford",
    name: "Joseph Dunford",
    role: "cjcs",
    startDate: "2017-01",
    endDate: "2019-09",
    quote: "The military remains apolitical. Our oath is to the Constitution.",
    quoteSource:
      "https://www.defense.gov/News/Transcripts/Transcript/Article/1959014/chairman-of-the-joint-chiefs-of-staff-gen-joe-dunford-retirement-ceremony/",
    quoteDate: "2019-09",
    exit: { label: "Term ended", kind: "term" },
    photo: photo("dunford.jpg"),
  },
  {
    id: "milley",
    name: "Mark Milley",
    role: "cjcs",
    startDate: "2019-09",
    endDate: "2021-01",
    quote:
      "We don't take an oath to a wannabe dictator. We take an oath to the Constitution.",
    quoteSource:
      "https://www.cnn.com/2023/10/01/politics/mark-milley-retirement-ceremony/index.html",
    quoteDate: "2023-09",
    exit: { label: "Served to end of term", kind: "term" },
    photo: photo("milley.jpg"),
  },
  {
    id: "coats",
    name: "Dan Coats",
    role: "dni",
    startDate: "2017-03",
    endDate: "2019-08",
    quote:
      "To him, a lie is not a lie. It’s just what he thinks. He doesn’t know the difference between the truth and a lie.",
    quoteSource:
      "https://edition.cnn.com/2020/09/09/politics/president-trump-national-security-advisers-rage-book",
    quoteDate: "2020-09",
    quoteNote: "As reported by Bob Woodward in his book Rage",
    exit: { label: "Resigned", kind: "resigned" },
    photo: photo("coats.jpg?v=3"),
  },
  {
    id: "ratcliffe",
    name: "John Ratcliffe",
    role: "dni",
    startDate: "2020-05",
    endDate: "2021-01",
    quote:
      "It could spiral out of control and potentially be dangerous either for our democracy or the way things were going for [Jan.] 6.",
    quoteSource:
      "https://www.texastribune.org/2022/06/28/john-ratcliffe-cassidy-hutchinson-trump-jan-6",
    quoteNote: "As recounted by Cassidy Hutchinson in testimony",
    exit: { label: "Served to end of term", kind: "term" },
    photo: photo("ratcliffe.jpg?v=3"),
  },
  {
    id: "devos",
    name: "Betsy DeVos",
    role: "seced",
    startDate: "2017-02",
    endDate: "2021-01",
    quote:
      "There is no mistaking the impact your rhetoric had on the situation, and it is the inflection point for me.",
    quoteSource:
      "https://apnews.com/article/betsy-devos-government-and-politics-political-resignations-ap-news-alert-a210824e4b216c874dec9380d82f23fc",
    quoteDate: "2021-01",
    exit: { label: "Resigned after Jan. 6", kind: "resigned" },
    photo: photo("devos.jpg?v=3"),
  },
  {
    id: "chao",
    name: "Elaine Chao",
    role: "sectrans",
    startDate: "2017-01",
    endDate: "2021-01",
    quote:
      "I was deeply troubled by the events of yesterday... It has deeply troubled me in a way that I simply cannot set aside.",
    quoteSource:
      "https://abcnews.go.com/Politics/chao-trump-cabinet-member-resign-capitol-storming/story?id=75113253",
    quoteDate: "2021-01",
    exit: { label: "Resigned after Jan. 6", kind: "resigned" },
    photo: photo("chao.jpg?v=3"),
  },
];

// ============================================================================
// SCROLL SCHEDULE
// ----------------------------------------------------------------------------
// Specify exactly which person's quote should pop up when the user scrolls
// past a given month. Each entry is: { month, personId, quote?, quoteSource? }.
//
//   - `month` must be in "YYYY-MM" format and fall within the timeline range
//     (currently 2017-01 through 2021-01).
//   - `personId` must match an `id` from the `people` array above.
//   - `quote` and `quoteSource` are OPTIONAL overrides. If omitted, the
//     person's default quote from the `people` array is shown.
//
// Months that are NOT in this schedule fall back to the automatic
// "closest-person-to-viewport-center" highlight behavior. To make the entire
// experience schedule-driven, add one entry per month.
//
// Example:
//   { month: "2017-01", personId: "trump" },
//   { month: "2017-06", personId: "sessions", quote: "Custom quote here." },
// ============================================================================
interface ScheduleEntry {
  month: string; // "YYYY-MM"
  personId: string;
  quote?: string;
  quoteSource?: string;
}

const scrollSchedule: ScheduleEntry[] = [
  // Add entries here, e.g.:
  // { month: "2017-01", personId: "trump" },
  // { month: "2017-02", personId: "tillerson" },
  // { month: "2017-03", personId: "mattis" },
];

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================
// Height (in pixels) of a single month row in the timeline grid.
const ROW_HEIGHT = 60;
// Minimum scroll distance (px) between two people taking the spotlight, so
// people who started in the same month still get their own beat.
const MIN_TRIGGER_GAP = 90;
// Space reserved at the bottom of each block for the "how they left" tag.
const EXIT_TAG_SPACE = 30;
const TIMELINE_START = { year: 2017, month: 1 };
const TIMELINE_END = { year: 2021, month: 1 };

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper functions
function parseYearMonth(dateStr: string): { year: number; month: number } {
  const [year, month] = dateStr.split("-").map(Number);
  return { year, month };
}

function rowOf(dateStr: string): number {
  const { year, month } = parseYearMonth(dateStr);
  return (year - TIMELINE_START.year) * 12 + (month - TIMELINE_START.month);
}

function formatMonth(dateStr: string): string {
  const { year, month } = parseYearMonth(dateStr);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function tenureMonths(person: Person): number {
  return rowOf(person.endDate) - rowOf(person.startDate) + 1;
}

function formatTenure(months: number, long = false): string {
  if (months < 12)
    return `${months} ${long ? (months === 1 ? "month" : "months") : "mo"}`;
  const years = (months / 12).toFixed(1).replace(".0", "");
  return `${years} ${long ? (years === "1" ? "year" : "years") : "yrs"}`;
}

/** "2018 · after leaving office" etc., based on when the quote was said. */
function quoteTiming(person: Person): string | null {
  if (!person.quoteDate) return null;
  const year = person.quoteDate.slice(0, 4);
  const when =
    person.quoteDate < person.startDate
      ? "before taking office"
      : person.quoteDate > person.endDate
        ? "after leaving office"
        : "while in office";
  return `Said in ${year}, ${when}`;
}

const TOTAL_ROWS = rowOf(`${TIMELINE_END.year}-${TIMELINE_END.month}`) + 1;

const months = Array.from({ length: TOTAL_ROWS }, (_, idx) => {
  const month = ((TIMELINE_START.month - 1 + idx) % 12) + 1;
  const year =
    TIMELINE_START.year + Math.floor((TIMELINE_START.month - 1 + idx) / 12);
  return { year, month, name: MONTH_NAMES[month - 1] };
});

// Grid placement for each person. A tenure covers its start month through its
// end month inclusive, unless the successor starts in that same month, in
// which case the successor gets the row.
const personPositions = people.map((person) => {
  const roleIndex = roles.findIndex((r) => r.id === person.role);
  const startRow = rowOf(person.startDate);
  let endRowExclusive = rowOf(person.endDate) + 1;
  for (const other of people) {
    if (other.role !== person.role || other.id === person.id) continue;
    const otherStart = rowOf(other.startDate);
    if (otherStart > startRow && otherStart < endRowExclusive) {
      endRowExclusive = otherStart;
    }
  }
  return { person, roleIndex, startRow, endRowExclusive };
});

// Stretches of a role with nobody shown (vacant, acting, or not included).
const gaps = roles.flatMap((role, roleIndex) => {
  const covered = new Array<boolean>(TOTAL_ROWS).fill(false);
  for (const p of personPositions) {
    if (p.roleIndex !== roleIndex) continue;
    for (let r = p.startRow; r < p.endRowExclusive; r++) covered[r] = true;
  }
  const out: {
    roleIndex: number;
    startRow: number;
    endRowExclusive: number;
  }[] = [];
  let start = -1;
  for (let r = 0; r <= TOTAL_ROWS; r++) {
    const empty = r < TOTAL_ROWS && !covered[r];
    if (empty && start === -1) start = r;
    if (!empty && start !== -1) {
      out.push({ roleIndex, startRow: start, endRowExclusive: r });
      start = -1;
    }
  }
  return out;
});

// The order people take the spotlight while scrolling: by arrival, then by
// column. Each gets a trigger offset (px from the top of the grid).
const scrollTriggers = (() => {
  const ordered = [...personPositions].sort(
    (a, b) => a.startRow - b.startRow || a.roleIndex - b.roleIndex,
  );
  let previous = -Infinity;
  return ordered.map(({ person, startRow }) => {
    const offset = Math.max(startRow * ROW_HEIGHT, previous + MIN_TRIGGER_GAP);
    previous = offset;
    return { personId: person.id, offset };
  });
})();

const scheduleByMonth = new Map(
  scrollSchedule.map((entry) => [entry.month, entry]),
);

const GRID_COLUMNS = `48px repeat(${roles.length}, minmax(0, 1fr))`;

const exitTagClass: Record<ExitKind, string> = {
  fired: "text-destructive",
  resigned: "text-primary",
  replaced: "text-muted-foreground",
  term: "text-muted-foreground/70",
};

// ============================================================================
// Quote card (shared by the desktop rail and the mobile sheet)
// ============================================================================
function QuoteCard({ person, compact }: { person: Person; compact?: boolean }) {
  const role = roles.find((r) => r.id === person.role);
  const timing = quoteTiming(person);
  return (
    <div
      key={person.id + person.quote}
      className="animate-in fade-in slide-in-from-bottom-1 duration-300"
    >
      <div className="flex items-center gap-3 pr-8">
        <img
          src={person.photo}
          alt=""
          className={`rounded-full object-cover ring-1 ring-primary/70 ring-offset-2 ring-offset-background flex-shrink-0 ${
            compact ? "w-11 h-11" : "w-16 h-16"
          }`}
        />
        <div className="min-w-0">
          <h3
            className={`font-serif font-medium text-foreground leading-tight ${
              compact ? "text-xl" : "text-3xl"
            }`}
          >
            {person.name}
          </h3>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mt-1">
            {role?.title}
          </p>
        </div>
      </div>

      <blockquote className={`relative ${compact ? "mt-3" : "mt-8"}`}>
        {!compact && (
          <span
            aria-hidden
            className="block font-serif text-7xl leading-none text-primary h-9 select-none"
          >
            &ldquo;
          </span>
        )}
        <p
          className={`font-serif text-foreground text-pretty ${
            compact ? "text-[17px] leading-snug" : "text-2xl leading-[1.35]"
          }`}
        >
          {compact && <span className="text-primary">&ldquo;</span>}
          {person.quote}
          {compact && <span className="text-primary">&rdquo;</span>}
        </p>
      </blockquote>

      <div
        className={`text-xs text-muted-foreground space-y-1 ${compact ? "mt-3" : "mt-6"}`}
      >
        {(timing || person.quoteNote) && (
          <p>
            {[timing, person.quoteNote].filter(Boolean).join(". ")}
            {person.quoteSource && (
              <>
                {" "}
                <a
                  href={person.quoteSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-2"
                >
                  Source <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </p>
        )}
        {!timing && !person.quoteNote && person.quoteSource && (
          <p>
            <a
              href={person.quoteSource}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-2"
            >
              Source <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        )}
        <p
          className={compact ? "hidden" : "pt-4 mt-4 border-t border-border/60"}
        >
          {formatMonth(person.startDate)} to {formatMonth(person.endDate)} ·{" "}
          {formatTenure(tenureMonths(person), true)} ·{" "}
          <span className={exitTagClass[person.exit.kind]}>
            {person.exit.label}
          </span>
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Hero
// ============================================================================
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-16 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 38%, color-mix(in oklch, var(--primary) 13%, transparent), transparent 70%)",
        }}
      />
      <p className="relative text-[11px] md:text-xs uppercase tracking-[0.28em] text-muted-foreground">
        The White House · 2017 to 2021
      </p>
      <h1 className="relative font-serif font-medium text-foreground text-balance tracking-tight leading-[0.95] text-6xl sm:text-7xl md:text-[9rem] mt-6">
        The Best People
      </h1>
      <p className="relative font-serif italic text-primary text-balance text-2xl md:text-4xl mt-6 md:mt-8">
        What a few employees think of their boss.
      </p>

      <div className="relative flex flex-wrap justify-center max-w-xl mt-10 md:mt-14 pl-2">
        {people
          .filter((p) => p.id !== "trump")
          .map((p) => (
            <img
              key={p.id}
              src={p.photo}
              alt={p.name}
              title={p.name}
              className="w-9 h-9 md:w-11 md:h-11 -ml-2 mb-1 rounded-full object-cover grayscale opacity-80 ring-2 ring-background"
            />
          ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}

// ============================================================================
// Main component
// ============================================================================
export function CabinetTimeline() {
  const [highlightedPersonId, setHighlightedPersonId] = useState<string | null>(
    null,
  );
  const [scheduleOverride, setScheduleOverride] = useState<{
    quote?: string;
    quoteSource?: string;
  } | null>(null);
  const [clickedPersonId, setClickedPersonId] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(120);

  const blockRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const innerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const clickedPersonIdRef = useRef<string | null>(null);
  const justClickedRef = useRef<boolean>(false);
  const headerHeightRef = useRef(headerHeight);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync with state so the scroll handler reads the latest values
  useEffect(() => {
    clickedPersonIdRef.current = clickedPersonId;
  }, [clickedPersonId]);

  // Track the sticky header's height: portraits pin just beneath it.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => {
      headerHeightRef.current = header.offsetHeight;
      setHeaderHeight(header.offsetHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // On narrow screens the timeline scrolls sideways inside its own container,
  // which disables CSS `position: sticky` for the portraits. Pin them by hand.
  const pinPortraits = useCallback(() => {
    const timeline = timelineScrollRef.current;
    if (!timeline) return;
    const needsManualPin = timeline.scrollWidth > timeline.clientWidth + 1;
    const pinTop = headerHeightRef.current + 10;
    innerRefs.current.forEach((inner, personId) => {
      if (!needsManualPin) {
        if (inner.style.transform) inner.style.transform = "";
        return;
      }
      const block = blockRefs.current.get(personId);
      if (!block) return;
      const rect = block.getBoundingClientRect();
      const max = Math.max(
        0,
        rect.height - inner.offsetHeight - EXIT_TAG_SPACE,
      );
      const shift = Math.min(Math.max(pinTop - rect.top, 0), max);
      inner.style.transform = shift ? `translateY(${shift}px)` : "";
    });
  }, []);

  // Decide who is in the spotlight.
  // Priority: (1) a scroll-schedule entry for the month at the focus line,
  // (2) the most recent arrival whose trigger offset has been scrolled past.
  const handleScroll = useCallback(() => {
    pinPortraits();

    // The first scroll after clicking someone returns to scroll storytelling.
    if (clickedPersonIdRef.current) {
      if (justClickedRef.current) {
        justClickedRef.current = false;
        return;
      }
      setClickedPersonId(null);
    }

    const grid = gridRef.current;
    if (!grid) return;
    const top = headerHeightRef.current;
    const focusY = top + (window.innerHeight - top) * 0.3;
    const gridRect = grid.getBoundingClientRect();
    const offset = focusY - gridRect.top;

    if (offset < 0 || offset > gridRect.height) {
      setHighlightedPersonId(null);
      setScheduleOverride(null);
      return;
    }

    const month =
      months[Math.min(TOTAL_ROWS - 1, Math.floor(offset / ROW_HEIGHT))];
    const entry = scheduleByMonth.get(
      `${month.year}-${String(month.month).padStart(2, "0")}`,
    );
    if (entry) {
      setHighlightedPersonId(entry.personId);
      setScheduleOverride(
        entry.quote || entry.quoteSource
          ? { quote: entry.quote, quoteSource: entry.quoteSource }
          : null,
      );
      return;
    }

    let active: string | null = null;
    for (const trigger of scrollTriggers) {
      if (trigger.offset > offset) break;
      active = trigger.personId;
    }
    setHighlightedPersonId(active);
    setScheduleOverride(null);
  }, [pinPortraits]);

  useEffect(() => {
    handleScroll();
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        handleScroll();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  // The role-header row mirrors the timeline's horizontal scroll.
  useEffect(() => {
    const timeline = timelineScrollRef.current;
    const header = headerScrollRef.current;
    if (!timeline || !header) return;

    let rafId: number | null = null;
    const apply = () => {
      rafId = null;
      header.scrollLeft = timeline.scrollLeft;
    };
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(apply);
    };

    apply();
    timeline.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      timeline.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // When the spotlight moves to a column that is off screen (narrow screens),
  // bring that column into view.
  useEffect(() => {
    const timeline = timelineScrollRef.current;
    const block =
      highlightedPersonId && blockRefs.current.get(highlightedPersonId);
    if (!timeline || !block) return;
    if (timeline.scrollWidth <= timeline.clientWidth + 1) return;
    const frame = timeline.getBoundingClientRect();
    const rect = block.getBoundingClientRect();
    const dateColumn = 48;
    if (rect.left >= frame.left + dateColumn && rect.right <= frame.right)
      return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    timeline.scrollTo({
      left:
        timeline.scrollLeft +
        (rect.left - frame.left) -
        (frame.width + dateColumn - rect.width) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [highlightedPersonId]);

  const handlePersonClick = useCallback((personId: string) => {
    // Guard: ignore a scroll event that may fire as a result of this click
    justClickedRef.current = true;
    setClickedPersonId((current) => (current === personId ? null : personId));
    window.setTimeout(() => {
      justClickedRef.current = false;
    }, 150);
  }, []);

  const handleCloseQuote = useCallback(() => {
    setClickedPersonId(null);
  }, []);

  // Clicked person takes priority over the scroll-highlighted person. A
  // schedule override (when not in click mode) replaces the default quote.
  const clickedPerson = people.find((p) => p.id === clickedPersonId);
  const scrollPerson = people.find((p) => p.id === highlightedPersonId);
  const scrollPersonWithOverride: Person | undefined =
    scrollPerson && scheduleOverride
      ? {
          ...scrollPerson,
          quote: scheduleOverride.quote ?? scrollPerson.quote,
          quoteSource: scheduleOverride.quoteSource ?? scrollPerson.quoteSource,
        }
      : scrollPerson;
  const activePerson = clickedPerson || scrollPersonWithOverride || null;
  const activeId = activePerson?.id ?? null;

  const closeButton = clickedPersonId && (
    <button
      onClick={handleCloseQuote}
      className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Close quote"
    >
      <X className="w-4 h-4" />
    </button>
  );

  return (
    <div
      className="min-h-screen bg-background"
      style={{ "--header-h": `${headerHeight}px` } as React.CSSProperties}
    >
      <Hero />

      {/* Sticky title + role headers */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-y border-border/60"
      >
        <div className="xl:pr-[380px]">
          <div className="max-w-[1200px] mx-auto px-4 pt-3 md:pt-4 flex items-baseline justify-between gap-4">
            <p className="font-serif text-xl md:text-2xl text-foreground leading-none">
              The Best People
            </p>
            <p className="text-[11px] md:text-xs text-muted-foreground text-right">
              <span className="lg:hidden">Swipe sideways for more roles</span>
              <span className="hidden lg:inline">
                What a few employees think of their boss
              </span>
            </p>
          </div>

          {/* Role headers row. Mirrors the timeline's scrollLeft; the user only
              scrolls the timeline and this row follows (pointer-events-none). */}
          <div
            ref={headerScrollRef}
            className="overflow-x-scroll overflow-y-hidden scrollbar-hide pointer-events-none"
          >
            <div className="min-w-[980px] lg:min-w-0 max-w-[1200px] mx-auto px-3 md:px-4">
              <div
                className="grid gap-x-1.5 pt-3 pb-2.5"
                style={{ gridTemplateColumns: GRID_COLUMNS }}
              >
                <div className="sticky left-0 z-20 bg-background" />
                {roles.map((role) => (
                  <div
                    key={role.id}
                    title={role.title}
                    className="flex items-end justify-center text-center px-0.5 text-[9px] xl:text-[10px] font-medium uppercase tracking-[0.1em] leading-tight text-foreground/80"
                  >
                    {role.shortTitle}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <main className="relative pt-3 pb-[50vh] xl:pb-40 xl:pr-[380px]">
        <div
          ref={timelineScrollRef}
          className="overflow-x-auto lg:overflow-visible momentum-scroll"
        >
          <div className="min-w-[980px] lg:min-w-0 max-w-[1200px] mx-auto px-3 md:px-4">
            <div
              ref={gridRef}
              className="grid gap-x-1.5 gap-y-0 relative"
              style={{
                gridTemplateColumns: GRID_COLUMNS,
                gridTemplateRows: `repeat(${TOTAL_ROWS}, ${ROW_HEIGHT}px)`,
                backgroundImage:
                  "linear-gradient(to bottom, color-mix(in oklch, var(--border) 30%, transparent) 1px, transparent 1px)",
                backgroundSize: `100% ${ROW_HEIGHT}px`,
              }}
            >
              {/* Year rules */}
              {months.map((month, idx) =>
                month.month === 1 ? (
                  <div
                    key={`year-${month.year}`}
                    aria-hidden
                    className="border-t border-primary/35 pointer-events-none"
                    style={{ gridColumn: "1 / -1", gridRow: idx + 1 }}
                  />
                ) : null,
              )}

              {/* Month labels (frozen on horizontal scroll) */}
              {months.map((month, idx) => (
                <div
                  key={`month-${month.year}-${month.month}`}
                  className={`sticky left-0 z-30 bg-background flex items-start justify-end pr-2 pt-1 ${
                    month.month === 1 ? "border-t border-primary/35" : ""
                  }`}
                  style={{ gridColumn: 1, gridRow: idx + 1 }}
                >
                  {month.month === 1 ? (
                    <span className="font-serif text-base text-primary leading-none">
                      {month.year}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      {month.name}
                    </span>
                  )}
                </div>
              ))}

              {/* Vacant / acting / not shown */}
              {gaps.map((gap) => (
                <div
                  key={`gap-${gap.roleIndex}-${gap.startRow}`}
                  title="Vacant, acting, or not shown"
                  className="hatched rounded-md my-0.5"
                  style={{
                    gridColumn: gap.roleIndex + 2,
                    gridRowStart: gap.startRow + 1,
                    gridRowEnd: gap.endRowExclusive + 1,
                  }}
                />
              ))}

              {/* Person blocks */}
              {personPositions.map(
                ({ person, roleIndex, startRow, endRowExclusive }) => {
                  const isActive = activeId === person.id;
                  return (
                    <button
                      key={person.id}
                      type="button"
                      ref={(el) => {
                        if (el) blockRefs.current.set(person.id, el);
                        else blockRefs.current.delete(person.id);
                      }}
                      onClick={() => handlePersonClick(person.id)}
                      aria-pressed={clickedPersonId === person.id}
                      aria-label={`${person.name}, ${roles[roleIndex].title}. Show quote.`}
                      className={`
                      group relative block w-full my-0.5 rounded-md border text-center
                      cursor-pointer touch-manipulation
                      transition-[background-color,border-color,box-shadow] duration-500 ease-out
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                      ${
                        isActive
                          ? "border-primary/80 shadow-[0_0_32px_-8px] shadow-primary/40 z-10"
                          : "bg-card/70 border-border/50 hover:border-border hover:bg-card"
                      }
                    `}
                      style={{
                        gridColumn: roleIndex + 2,
                        gridRowStart: startRow + 1,
                        gridRowEnd: endRowExclusive + 1,
                        backgroundImage: isActive
                          ? "linear-gradient(to bottom, color-mix(in oklch, var(--primary) 20%, var(--card)), color-mix(in oklch, var(--primary) 7%, var(--card)))"
                          : undefined,
                      }}
                    >
                      {/* Buttons centre their content vertically, so the pinned
                        portrait lives in an absolutely positioned track. */}
                      <div
                        className="absolute inset-x-0 top-0"
                        style={{ bottom: EXIT_TAG_SPACE }}
                      >
                        <div
                          ref={(el) => {
                            if (el) innerRefs.current.set(person.id, el);
                            else innerRefs.current.delete(person.id);
                          }}
                          className="lg:sticky flex flex-col items-center gap-1.5 px-1 pt-2.5 pb-1 will-change-transform"
                          style={{ top: "calc(var(--header-h) + 10px)" }}
                        >
                          <img
                            src={person.photo}
                            alt=""
                            loading="lazy"
                            className={`
                          w-10 h-10 lg:w-14 lg:h-14 rounded-full object-cover
                          transition-[filter,opacity,box-shadow] duration-500
                          ${
                            isActive
                              ? "grayscale-0 opacity-100 ring-2 ring-primary ring-offset-2 ring-offset-background"
                              : "grayscale opacity-60 ring-1 ring-border group-hover:grayscale-0 group-hover:opacity-100"
                          }
                        `}
                          />
                          <span
                            className={`text-[10px] lg:text-xs font-medium leading-tight text-balance transition-colors duration-500 ${
                              isActive
                                ? "text-foreground"
                                : "text-foreground/65"
                            }`}
                          >
                            {person.name}
                          </span>
                          <span className="text-[9px] lg:text-[10px] text-muted-foreground tabular-nums leading-none">
                            {formatTenure(tenureMonths(person))}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`absolute inset-x-1 bottom-1.5 text-[8px] lg:text-[9px] uppercase tracking-wide leading-tight text-balance ${exitTagClass[person.exit.kind]}`}
                      >
                        {person.exit.label}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quote rail (wide screens): its own column, never covers the grid */}
      <aside
        aria-live="polite"
        className={`
          hidden xl:flex fixed right-0 bottom-0 z-30 w-[380px] flex-col justify-center
          border-l border-border/60 bg-background px-9
          transition-opacity duration-500
          ${activePerson ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        style={{ top: "var(--header-h)" }}
      >
        {closeButton}
        {activePerson && <QuoteCard person={activePerson} />}
      </aside>

      {/* Quote sheet (narrow screens) */}
      <div
        className={`
          xl:hidden fixed z-50 inset-x-0 bottom-0 max-h-[45vh] overflow-y-auto
          md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[560px] md:bottom-4 md:rounded-xl md:border
          bg-card/95 backdrop-blur-md border-t border-border rounded-t-2xl
          px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]
          shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.6)]
          transition-[translate,opacity] duration-500 ease-out
          ${activePerson ? "translate-y-0 opacity-100" : "translate-y-[calc(100%+1rem)] opacity-0"}
        `}
      >
        {closeButton}
        {activePerson && <QuoteCard person={activePerson} compact />}
      </div>
    </div>
  );
}
