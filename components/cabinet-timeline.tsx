"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ExternalLink, X } from "lucide-react";

// Types
interface Person {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  quote: string;
  quoteSource?: string;
  photo: string;
}

interface Role {
  id: string;
  title: string;
  shortTitle: string;
}

// Data
const roles: Role[] = [
  { id: "president", title: "President", shortTitle: "President" },
  { id: "vp", title: "Vice President", shortTitle: "VP" },
  { id: "sos", title: "Secretary of State", shortTitle: "Sec. State" },
  { id: "ag", title: "Attorney General", shortTitle: "AG" },
  { id: "cos", title: "Chief of Staff", shortTitle: "Chief of Staff" },
  { id: "secdef", title: "Secretary of Defense", shortTitle: "Sec. Def." },
  { id: "nsa", title: "National Security Advisor", shortTitle: "NSA" },
  { id: "cjcs", title: "Chairman Joint Chiefs", shortTitle: "CJCS" },
  { id: "dni", title: "Director of National Intelligence", shortTitle: "DNI" },
  { id: "seced", title: "Secretary of Education", shortTitle: "Sec. Ed." },
  { id: "sectrans", title: "Secretary of Transportation", shortTitle: "Sec. Trans." },
];

const people: Person[] = [
  {
    id: "trump",
    name: "Donald Trump",
    role: "president",
    startDate: "2017-01",
    endDate: "2021-01",
    quote: "I know the best people. I know the best managers. I know the best dealmakers. I know people who will make us so strong. I know guys that are so good.",
    quoteSource: "https://www.ms.now/top-stories/latest/trump-white-house-cabinet-project-2025-rcna177081",
    photo: "/photos/trump.jpg",
  },
  {
    id: "pence",
    name: "Mike Pence",
    role: "vp",
    startDate: "2017-01",
    endDate: "2021-01",
    quote: "President Trump was wrong. I had no right to overturn the election. And his reckless words endangered my family and everyone at the Capitol.",
    quoteSource: "https://www.nytimes.com/2022/02/04/us/politics/pence-trump-jan-6.html",
    photo: "/photos/pence.jpg",
  },
  {
    id: "tillerson",
    name: "Rex Tillerson",
    role: "sos",
    startDate: "2017-02",
    endDate: "2018-03",
    quote: "[He is] a man who is pretty undisciplined, doesn't like to read, doesn't read briefing reports, doesn't like to get into the details of a lot of things.",
    quoteSource: "https://www.bbc.com/news/world-us-canada-46492744",
    photo: "/photos/tillerson.jpg",
  },
  {
    id: "pompeo",
    name: "Mike Pompeo",
    role: "sos",
    startDate: "2018-04",
    endDate: "2021-01",
    quote: "You know, Donald Trump the other day said that, in quote, if he tells a soldier to commit a war crime, the soldier will just go do it. He said they'll do as I tell them to do.",
    quoteSource: "https://www.newsweek.com/mike-pompeo-trump-obama-2016-authoritarian-president-ignored-constitution-1455073",
    photo: "/photos/pompeo.jpg",
  },
  {
    id: "sessions",
    name: "Jeff Sessions",
    role: "ag",
    startDate: "2017-02",
    endDate: "2018-11",
    quote: "He is a person who has no loyalty. He doesn't understand the concepts of law and justice.",
    quoteSource: "https://www.theatlantic.com/politics/archive/2020/11/jeff-sessions-trump-loyalty/617180/",
    photo: "/photos/sessions.jpg",
  },
  {
    id: "whitaker",
    name: "Matt Whitaker",
    role: "ag",
    startDate: "2018-11",
    endDate: "2019-02",
    quote: "The president... does he have anyone that has the president's ear? Or does he just kind of watch news accounts and responds to [them], which is a little dangerous.",
    quoteSource: "https://theweek.com/speedreads/810363/acting-attorney-general-matthew-whitaker-criticized-trump-interviews-unlikable-selfserving-dangerous",
    photo: "/photos/whitaker.jpg",
  },
  {
    id: "barr",
    name: "William Barr",
    role: "ag",
    startDate: "2019-02",
    endDate: "2020-12",
    quote: "He is a consummate narcissist and constantly engages in reckless conduct that puts his political party and the country at risk.",
    quoteSource: "https://www.npr.org/2022/03/06/1084883520/william-barr-new-book-trump-2024-election",
    photo: "/photos/barr.jpg",
  },
  {
    id: "priebus",
    name: "Reince Priebus",
    role: "cos",
    startDate: "2017-01",
    endDate: "2017-07",
    quote: "No woman should ever be described in these terms or talked about in this manner. Ever.",
    quoteSource: "https://www.pbs.org/newshour/politics/headline-republicans-react-trump-comments-objectifying-women",
    photo: "/photos/priebus.jpg",
  },
  {
    id: "kelly",
    name: "John Kelly",
    role: "cos",
    startDate: "2017-07",
    endDate: "2019-01",
    quote: "A person that has no idea what America stands for and has no idea what being an American is all about... He is a person who admires autocrats and murderous dictators.",
    quoteSource: "https://www.nytimes.com/2023/10/02/us/politics/john-kelly-trump-fitness-office.html",
    photo: "/photos/kelly.jpg",
  },
  {
    id: "mulvaney",
    name: "Mick Mulvaney",
    role: "cos",
    startDate: "2019-01",
    endDate: "2020-03",
    quote: "He failed at being the president when we needed him to be that.",
    quoteSource: "https://www.cnbc.com/2022/06/28/trump-was-wrong-mick-mulvaney-says-hes-changed-views-on-jan-6.html",
    photo: "/photos/mulvaney.jpg",
  },
  {
    id: "meadows",
    name: "Mark Meadows",
    role: "cos",
    startDate: "2020-03",
    endDate: "2021-01",
    quote: "If I can get through this job and manage to keep him out of jail, I'll have done a good job.",
    quoteSource: "https://www.nbcnews.com/politics/donald-trump/cassidy-hutchinson-reveals-details-disarray-trumps-white-house-rcna117344",
    photo: "/photos/meadows.jpg",
  },
  {
    id: "mattis",
    name: "Jim Mattis",
    role: "secdef",
    startDate: "2017-01",
    endDate: "2019-01",
    quote: "Donald Trump is the first president in my lifetime who does not try to unite the American people—does not even pretend to try. Instead, he tries to divide us.",
    quoteSource: "https://www.theatlantic.com/politics/archive/2020/06/james-mattis-denounces-trump-protests-militarization/612640/",
    photo: "/photos/mattis.jpg",
  },
  {
    id: "shanahan",
    name: "Patrick Shanahan",
    role: "secdef",
    startDate: "2019-01",
    endDate: "2019-06",
    quote: "I expect you to remind leaders at all levels in the Department to reinforce the apolitical nature of military service and professionalism.",
    quoteSource: "https://www.cbsnews.com/news/patrick-shanahan-acting-defense-secretary-urges-military-to-maintain-apolitical-nature-in-new-internal-memo/",
    photo: "/photos/shanahan.jpg",
  },
  {
    id: "esper",
    name: "Mark Esper",
    role: "secdef",
    startDate: "2019-07",
    endDate: "2020-11",
    quote: "I do regard him as a threat to democracy... I think he's unfit for office.",
    quoteSource: "https://www.cbsnews.com/news/mark-esper-former-defense-secretary-60-minutes-2022-05-08/",
    photo: "/photos/esper.jpg",
  },
  {
    id: "mcmaster",
    name: "H.R. McMaster",
    role: "nsa",
    startDate: "2017-02",
    endDate: "2018-04",
    quote: "[Trump'] encouraged an attack, you know, on the first branch of government, and an attack on the peaceful transition of power, and I think that that was an abandonment of his responsibilities to the Constitution",
    quoteSource: "https://www.cbsnews.com/news/h-r-mcmaster-at-war-with-ourselves-my-tour-of-duty-in-the-trump-white-house",
    photo: "/photos/mcmaster.jpg",
  },
  {
    id: "bolton",
    name: "John Bolton",
    role: "nsa",
    startDate: "2018-04",
    endDate: "2019-09",
    quote: "I don't think he's fit for office. I don't think he has the competence to carry out the job.",
    quoteSource: "https://abcnews.go.com/Politics/john-bolton-book-interview-trump-fit-office-reelection/story?id=71334168",
    photo: "/photos/bolton.jpg",
  },
  {
    id: "obrien",
    name: "Robert O'Brien",
    role: "nsa",
    startDate: "2019-09",
    endDate: "2021-01",
    quote: "And Donald Trump is—has said that he's willing to scrap our alliance with NATO. He's willing to scrap our… alliances in the Pacific with Japan and Korea and South Korea. I mean, these are extraordinarily dangerous statements at a time that the world does not need that sort of inconsistent and wavering American leadership given the threats that we're facing.",
    quoteSource: "https://www.cnn.com/2019/10/05/politics/robert-obrien-extraordinarily-dangerous-kfile",
    photo: "/photos/obrien.jpg",
  },
  {
    id: "dunford",
    name: "Joseph Dunford",
    role: "cjcs",
    startDate: "2017-01",
    endDate: "2019-09",
    quote: "The military remains apolitical. Our oath is to the Constitution.",
    quoteSource: "https://www.defense.gov/News/Transcripts/Transcript/Article/1959014/chairman-of-the-joint-chiefs-of-staff-gen-joe-dunford-retirement-ceremony/",
    photo: "/photos/dunford.jpg",
  },
  {
    id: "milley",
    name: "Mark Milley",
    role: "cjcs",
    startDate: "2019-09",
    endDate: "2021-01",
    quote: "We don't take an oath to a wannabe dictator. We take an oath to the Constitution.",
    quoteSource: "https://www.cnn.com/2023/10/01/politics/mark-milley-retirement-ceremony/index.html",
    photo: "/photos/milley.jpg",
  },
  {
    id: "coats",
    name: "Dan Coats",
    role: "dni",
    startDate: "2017-03",
    endDate: "2019-08",
    quote: "To him, a lie is not a lie. It’s just what he thinks. He doesn’t know the difference between the truth and a lie.",
    quoteSource: "https://edition.cnn.com/2020/09/09/politics/president-trump-national-security-advisers-rage-book",
    photo: "/photos/coats.jpg?v=3",
  },
  {
    id: "ratcliffe",
    name: "John Ratcliffe",
    role: "dni",
    startDate: "2020-05",
    endDate: "2021-01",
    quote: "It could spiral out of control and potentially be dangerous either for our democracy or the way things were going for [Jan.] 6.",
    quoteSource: "https://www.texastribune.org/2022/06/28/john-ratcliffe-cassidy-hutchinson-trump-jan-6",
    photo: "/photos/ratcliffe.jpg?v=3",
  },
  {
    id: "devos",
    name: "Betsy DeVos",
    role: "seced",
    startDate: "2017-02",
    endDate: "2021-01",
    quote: "There is no mistaking the impact your rhetoric had on the situation, and it is the inflection point for me.",
    quoteSource: "https://apnews.com/article/betsy-devos-government-and-politics-political-resignations-ap-news-alert-a210824e4b216c874dec9380d82f23fc",
    photo: "/photos/devos.jpg?v=3",
  },
  {
    id: "chao",
    name: "Elaine Chao",
    role: "sectrans",
    startDate: "2017-01",
    endDate: "2021-01",
    quote: "I was deeply troubled by the events of yesterday... It has deeply troubled me in a way that I simply cannot set aside.",
    quoteSource: "https://abcnews.go.com/Politics/chao-trump-cabinet-member-resign-capitol-storming/story?id=75113253",
    photo: "/photos/chao.jpg?v=3",
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

// Height (in pixels) of a single month row in the timeline grid.
// Kept at module scope so both the scroll handler and the render logic agree.
const ROW_HEIGHT = 40;

// Helper functions
function parseYearMonth(dateStr: string): { year: number; month: number } {
  const [year, month] = dateStr.split("-").map(Number);
  return { year, month };
}

function generateMonthRange(
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number
): { year: number; month: number; label: string }[] {
  const months: { year: number; month: number; label: string }[] = [];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  let currentYear = startYear;
  let currentMonth = startMonth;

  while (
    currentYear < endYear ||
    (currentYear === endYear && currentMonth <= endMonth)
  ) {
    months.push({
      year: currentYear,
      month: currentMonth,
      label: `${monthNames[currentMonth - 1]} ${currentYear}`,
    });

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return months;
}

function getMonthIndex(
  year: number,
  month: number,
  startYear: number,
  startMonth: number
): number {
  return (year - startYear) * 12 + (month - startMonth);
}

// QuotePanel component
function QuotePanel({
  person,
  isVisible,
  isClickMode,
  onClose,
}: {
  person: Person | null;
  isVisible: boolean;
  isClickMode: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`
        fixed z-50 bg-card/95 backdrop-blur-sm border-border
        transition-all duration-500 ease-out
        left-0 right-0 bottom-0 w-full max-h-[80vh] overflow-y-auto
        rounded-t-2xl border-t p-5
        md:left-auto md:right-0 md:bottom-auto md:top-1/2 md:w-96 md:max-h-none md:overflow-visible
        md:rounded-t-none md:rounded-l-lg md:border md:p-8
        ${isVisible && person
          ? "translate-y-0 opacity-100 md:translate-x-0 md:-translate-y-1/2"
          : "translate-y-full opacity-0 md:translate-x-full md:-translate-y-1/2"
        }
      `}
    >
      {/* Mobile drag indicator */}
      <div className="md:hidden flex justify-center mb-3">
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>
      {person && (
        <div className="space-y-4">
          {/* Close button - only visible in click mode */}
          {isClickMode && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Close quote panel"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          <div className="flex items-center gap-4 pr-8">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-2xl font-semibold text-foreground truncate">
                {person.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {roles.find((r) => r.id === person.role)?.title}
              </p>
            </div>
          </div>
          <blockquote className="text-sm md:text-lg text-foreground/90 italic border-l-2 border-primary pl-4">
            &ldquo;{person.quote}&rdquo;
            {person.quoteSource && (
              <a
                href={person.quoteSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center ml-2 text-primary hover:text-primary/80 transition-colors"
                aria-label="View quote source"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </blockquote>
          <div className="text-xs text-muted-foreground">
            <p>
              {parseYearMonth(person.startDate).year} &mdash;{" "}
              {parseYearMonth(person.endDate).year}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Main component
export function CabinetTimeline() {
  const [highlightedPersonId, setHighlightedPersonId] = useState<string | null>(null);
  const [scheduleOverride, setScheduleOverride] = useState<{
    quote?: string;
    quoteSource?: string;
  } | null>(null);
  const [clickedPersonId, setClickedPersonId] = useState<string | null>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const clickedPersonIdRef = useRef<string | null>(null);
  const justClickedRef = useRef<boolean>(false);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Keep ref in sync with state so scroll handler reads latest value
  useEffect(() => {
    clickedPersonIdRef.current = clickedPersonId;
  }, [clickedPersonId]);

  // Generate month range from data
  const months = useMemo(() => {
    return generateMonthRange(2017, 1, 2021, 1);
  }, []);

  // Calculate grid positions for each person
  const personPositions = useMemo(() => {
    return people.map((person) => {
      const start = parseYearMonth(person.startDate);
      const end = parseYearMonth(person.endDate);
      const roleIndex = roles.findIndex((r) => r.id === person.role);
      const startRow = getMonthIndex(start.year, start.month, 2017, 1);
      const endRow = getMonthIndex(end.year, end.month, 2017, 1);
      return { person, roleIndex, startRow, endRow };
    });
  }, []);

  // Fast lookup: "YYYY-MM" -> ScheduleEntry
  const scheduleByMonth = useMemo(() => {
    const map = new Map<string, ScheduleEntry>();
    for (const entry of scrollSchedule) {
      map.set(entry.month, entry);
    }
    return map;
  }, []);

  // Handle scroll to detect which person should be highlighted.
  // Priority: (1) scroll schedule entry for the current month, (2) closest
  // person-block to the viewport center (legacy fallback).
  // Stable reference (no deps) so the scroll listener isn't re-attached on state changes.
  const handleScroll = useCallback(() => {
    // If a person was clicked, the first scroll event after clicking should clear the click
    // and return to normal scroll storytelling.
    if (clickedPersonIdRef.current) {
      // Skip the scroll event fired as a result of the click itself
      if (justClickedRef.current) {
        justClickedRef.current = false;
        return;
      }
      setClickedPersonId(null);
    }

    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    // --- 1. Schedule-driven highlight ------------------------------------
    // Figure out which month row is currently at the viewport center, then
    // look it up in the scroll schedule.
    const grid = gridRef.current;
    if (grid && scheduleByMonth.size > 0) {
      const gridRect = grid.getBoundingClientRect();
      const offsetFromGridTop = viewportCenter - gridRect.top;
      const rowIndex = Math.floor(offsetFromGridTop / ROW_HEIGHT);
      const monthsLength = (2021 - 2017) * 12 + 1; // inclusive: 2017-01..2021-01
      const isWithinTimeline = rowIndex >= 0 && rowIndex < monthsLength;

      if (isWithinTimeline) {
        // Convert rowIndex back into a "YYYY-MM" key.
        const year = 2017 + Math.floor(rowIndex / 12);
        const monthNum = (rowIndex % 12) + 1;
        const key = `${year}-${String(monthNum).padStart(2, "0")}`;
        const entry = scheduleByMonth.get(key);

        if (entry) {
          setHighlightedPersonId(entry.personId);
          setScheduleOverride(
            entry.quote || entry.quoteSource
              ? { quote: entry.quote, quoteSource: entry.quoteSource }
              : null
          );
          return;
        }
      }
    }

    // --- 2. Fallback: closest person-block to viewport center ------------
    const threshold = viewportHeight * 0.25;
    let closestPerson: string | null = null;
    let closestDistance = Infinity;

    blockRefs.current.forEach((element, personId) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elementCenter - viewportCenter);
      const isInViewport = rect.top < viewportHeight && rect.bottom > 0;

      if (isInViewport && distance < threshold && distance < closestDistance) {
        closestDistance = distance;
        closestPerson = personId;
      }
    });

    setHighlightedPersonId(closestPerson);
    setScheduleOverride(null);
  }, [scheduleByMonth]);

  // Handle person click
  const handlePersonClick = useCallback((personId: string) => {
    // Guard: ignore the scroll event that may fire as a result of this click
    justClickedRef.current = true;
    setClickedPersonId(personId);
  }, []);

  // Close the clicked quote panel
  const handleCloseQuote = useCallback(() => {
    setClickedPersonId(null);
  }, []);

  useEffect(() => {
    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Drive the role-header row from the timeline's horizontal scroll by mirroring
  // scrollLeft. Using a real scroll container (instead of transform) lets
  // `position: sticky` work natively on the Date cell, so it locks to the left
  // edge just like the date column below — they move in unison.
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

    // Initial sync
    apply();
    timeline.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      timeline.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const setBlockRef = useCallback((personId: string, element: HTMLDivElement | null) => {
    if (element) {
      blockRefs.current.set(personId, element);
    } else {
      blockRefs.current.delete(personId);
    }
  }, []);

  // Clicked person takes priority over scroll-highlighted person.
  // When the schedule override is active (and we're not in click mode), apply
  // the override quote/source on top of the person's default data.
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
  const highlightedPerson = clickedPerson || scrollPersonWithOverride;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky title + role headers */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 py-3 md:py-6">
          <h1 className="text-lg md:text-3xl font-bold text-foreground text-balance">
            The Best People
          </h1>
          <p className="text-muted-foreground mt-1 text-xs md:text-base">
            <span className="md:hidden">Scroll vertically for timeline, swipe horizontally for positions</span>
            <span className="hidden md:inline">Scroll to explore cabinet positions from 2017-2021</span>
          </p>
        </div>

        {/* Role headers row — mirrors the timeline's scrollLeft. Using a real scroll
            container lets the sticky Date cell lock to the left edge (in unison with
            the date column below). The user only scrolls the timeline; this row
            follows programmatically (pointer-events-none). */}
        <div
          ref={headerScrollRef}
          className="overflow-x-scroll overflow-y-hidden scrollbar-hide pointer-events-none"
        >
          <div className="min-w-[980px] px-3 md:px-4 md:min-w-0 md:max-w-[1400px] md:mx-auto">
            <div
              className="grid gap-x-1 gap-y-0 pt-2 pb-2"
              style={{
                gridTemplateColumns: `48px repeat(${roles.length}, minmax(80px, 140px))`,
              }}
            >
              <div className="text-[10px] md:text-xs text-muted-foreground font-medium text-right pr-1 md:pr-2 flex items-end justify-end sticky left-0 z-20 bg-background border-r border-border/40">
                Date
              </div>
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="text-center px-1 flex items-end justify-center"
                >
                  <span className="hidden lg:block text-xs font-semibold text-foreground uppercase tracking-wider">
                    {role.title}
                  </span>
                  <span className="lg:hidden text-[9px] md:text-[10px] font-semibold text-foreground uppercase tracking-wider leading-tight">
                    {role.shortTitle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content with horizontal scroll on mobile */}
      <main className="relative pb-32" ref={containerRef}>
        <div
          ref={timelineScrollRef}
          className="overflow-x-auto momentum-scroll"
        >
          <div className="min-w-[980px] px-3 md:px-4 md:min-w-0 md:max-w-[1400px] md:mx-auto mt-3">
            {/* Timeline Grid — no vertical gap so the sticky date column renders as a solid sidebar */}
            <div
              ref={gridRef}
              className="grid gap-x-1 gap-y-0 relative"
              style={{
                gridTemplateColumns: `48px repeat(${roles.length}, minmax(80px, 140px))`,
                gridTemplateRows: `repeat(${months.length}, ${ROW_HEIGHT}px)`,
              }}
            >
              {/* Month labels (frozen on horizontal scroll) */}
              {months.map((month, idx) => (
                <div
                  key={`month-${month.year}-${month.month}`}
                  className="flex items-center justify-end pr-2 text-xs text-muted-foreground sticky left-0 z-30 bg-background border-r border-border/40"
                  style={{
                    gridColumn: 1,
                    gridRow: idx + 1,
                  }}
                >
                  {month.month === 1 ? (
                    <span className="font-semibold text-foreground">{month.year}</span>
                  ) : (
                    <span>{month.label.split(" ")[0]}</span>
                  )}
                </div>
              ))}

              {/* Grid lines */}
              {months.map((month, idx) => (
                roles.map((_, roleIdx) => (
                  <div
                    key={`grid-${idx}-${roleIdx}`}
                    className="border-b border-border/10"
                    style={{
                      gridColumn: roleIdx + 2,
                      gridRow: idx + 1,
                    }}
                  />
                ))
              ))}

              {/* Person blocks */}
              {personPositions.map(({ person, roleIndex, startRow, endRow }) => {
                // When a person is clicked, ONLY that person is highlighted.
                // Otherwise, fall back to the scroll-based highlight.
                const isHighlighted = clickedPersonId
                  ? clickedPersonId === person.id
                  : highlightedPersonId === person.id;
                return (
                  <div
                    key={person.id}
                    ref={(el) => setBlockRef(person.id, el)}
                    onClick={() => handlePersonClick(person.id)}
                    className={`
                    relative flex flex-col justify-start items-center p-1.5 md:p-3 gap-1 md:gap-2
                    rounded border cursor-pointer overflow-hidden touch-manipulation
                    transition-all duration-300 ease-out
                    ${isHighlighted
                        ? "bg-primary/30 border-primary shadow-lg shadow-primary/20 scale-[1.03] z-20"
                        : "bg-muted/40 border-border/50 hover:bg-muted/60 hover:border-border"
                      }
                  `}
                    style={{
                      gridColumn: roleIndex + 2,
                      gridRowStart: startRow + 1,
                      gridRowEnd: endRow + 1,
                    }}
                  >
                    {/* Photo */}
                    <div
                      className={`
                      w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0
                      border-2 transition-all duration-300
                      ${isHighlighted ? "border-primary" : "border-border/50"}
                    `}
                    >
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Name */}
                    <span
                      className={`
                      text-[9px] md:text-xs font-medium text-center leading-tight
                      transition-colors duration-300 line-clamp-2
                      ${isHighlighted ? "text-foreground" : "text-foreground/70"}
                    `}
                    >
                      {person.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Quote Panel */}
      <QuotePanel
        person={highlightedPerson || null}
        isVisible={!!highlightedPerson}
        isClickMode={!!clickedPersonId}
        onClose={handleCloseQuote}
      />

      {/* Scroll indicator - desktop only to avoid overlapping mobile bottom sheet */}
      <div
        className={`
          hidden md:flex
          fixed bottom-8 left-1/2 -translate-x-1/2 z-40
          flex-col items-center gap-2 transition-opacity duration-500
          ${highlightedPersonId || clickedPersonId ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-muted-foreground/50 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-muted-foreground rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
