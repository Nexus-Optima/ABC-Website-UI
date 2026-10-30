// Single source for industries, suites and modules (ported from the design's abc-data.js).
// Add or remove a module by editing its suite's `modules` array.
// dev: true → IN DEVELOPMENT (no features, no screenshots). standalone: true → "Also available standalone" marker.

export type Problem = { icon: string; title: string; text: string };

/** Product screenshot shown in a live module's carousel. Omit `src` to show a placeholder. */
export type Screen = { src?: string; caption: string };

export type Module = {
  id: string;
  name: string;
  icon: string;
  line: string;
  dev?: boolean;
  standalone?: boolean;
  pitch?: string;
  highlights?: string[];
  desc?: string;
  features: string[];
  /** Carousel screens; defaults to one placeholder per feature. */
  screens?: Screen[];
  /** CSS aspect-ratio of the screenshots, e.g. "16 / 10". Defaults to 16 / 9. */
  screenAspect?: string;
  inputs?: string[];
  outputs?: string[];
};

export type SuiteId = "flexible-packaging" | "terry-towel";

export type Suite = {
  id: SuiteId;
  num: string;
  industry: string;
  name: string;
  /** Photo in /public, already cropped by the design's image slot. */
  image: string;
  /** object-position matching the crop chosen in the design. */
  imagePosition: string;
  shot: string;
  lead: string;
  desc: string;
  constraints: string[];
  buying: string;
  flow: string;
  problems: Problem[];
  modules: Module[];
};

export const suites: Suite[] = [
  {
    id: "flexible-packaging", num: "01", industry: "Packaging Films", name: "ABC for Packaging Films",
    image: "/images/industry-flexible-packaging.webp", imagePosition: "50% 50%",
    shot: "Primary slitter cutting a jumbo roll of film into customer rolls",
    lead: "Plans how every jumbo roll is cut into customer rolls, with the least trim and fewest knife changes.",
    desc: "BOPP, BOPET and other film manufacturers running film lines, metallising and slitting. Jumbo rolls come off the line in one width; customers order many widths, cores and lengths. The plan works out how to cut each jumbo roll to fill those orders with the least waste.",
    constraints: ["Jumbo widths, minimum trim and slit positions", "Primary, metalliser and secondary stages", "Grade pooling for metallising", "Core sizes and core-mix rules"],
    buying: "Buy the suite, or either module on its own.",
    flow: "Campaign Planner sets campaigns by material group. Slitting Planner decides how each jumbo roll is cut. Line Planner plans each line in detail, by material code.",
    problems: [
      { icon: "content_cut", title: "Trim Loss Accepted, Not Minimised", text: "Deckle combinations are worked out by hand, so the first plan that fits is the one that runs." },
      { icon: "event_busy", title: "Dates Promised Without Capacity", text: "Sales commits dates the line cannot hold, and planners absorb the difference." },
      { icon: "approval", title: "Sign-Off Holds Up the Release", text: "Extra rolls cut to save trim need a sales decision, and one slow answer holds back every order in the plan." },
      { icon: "table_chart", title: "A Plan That Lives in One Excel File", text: "Planning depends on one person's Excel file. When they are away, planning stops." },
    ],
    modules: [
      { id: "campaign", dev: true, pitch: "Sequence every line to cut changeovers and hold due dates.", highlights: [], name: "Campaign Planner", icon: "event_note",
        line: "Plans production campaigns by material group across your film lines.",
        desc: "Takes pending orders and forecasts, groups them by grade, thickness and colour, and sequences campaigns to minimise changeover while holding due dates.",
        features: [], inputs: [], outputs: [] },
      { id: "slitting", standalone: true, pitch: "Cut every master roll into orders with the least trim.", highlights: ["Deckle optimisation across roll widths", "Knife and minimum-slit limits enforced", "Trim % shown before release"], name: "Slitting Planner", icon: "content_cut",
        line: "Plans how jumbo rolls are cut, with the least trim and setting changes.",
        desc: "Combines order widths across master roll deckles, respecting knife counts, minimum slit widths and core sizes. Every plan shows its trim percentage before it is released to the floor.",
        features: ["Primary, metalliser and secondary in one plan", "Least trim and fewest knife-setting changes", "Several distinct plans to choose from", "Hand edits blocked if they break machine limits", "Sales review of over- and under-production"],
        screenAspect: "16 / 10",
        screens: [
          { src: "/images/slitting-planner/01-overview.png", caption: "Orders by material group, ready to plan" },
          { src: "/images/slitting-planner/02-configurations.png", caption: "Machine limits and order priorities per configuration" },
          { src: "/images/slitting-planner/03-output.png", caption: "Several distinct plans to choose from" },
          { src: "/images/slitting-planner/04-plan.png", caption: "Every jumbo roll cut, with trim shown per pattern" },
        ],
        inputs: ["Order widths and lengths", "Master roll widths", "Slitter limits"],
        outputs: ["Slitting plan", "Trim report", "Machine instructions"] },
      { id: "line", dev: true, name: "Line Planner", icon: "article",
        line: "Plans each film line in detail, down to the material code.", features: [] },
    ],
  },
  {
    id: "terry-towel", num: "02", industry: "Terry Towel", name: "ABC for Terry Towel",
    image: "/images/industry-terry-towel.webp", imagePosition: "100% 50%",
    shot: "Terry loom — loop pile forming at the fell",
    lead: "Weaving plans for terry mills, built on your loom categories, sorts, changeovers and weaving cutoffs. Planning for the rest of the route is in development.",
    desc: "Integrated terry towel mills, from yarn to finished towel. Every stage has its own bottleneck: dye lots, warp beams, loom changeovers, processing capacity. A delay at one stage moves every stage after it. With one plan across every stage, each team sees what the next one needs.",
    constraints: ["Yarn dye-lot sizes and shade matching", "Loom eligibility and changeovers by type", "Dyeing machine capacity and batch compatibility", "Order due dates across the full route", "Availability of trims and packing materials"],
    buying: "Buy the complete APS, or any single module.",
    flow: "Yarn Dyeing plans dye lots, Warping builds beams, the Loom Planner schedules weaving, then Processing and Cutting, Sewing & Packing finish the towel.",
    problems: [
      { icon: "palette", title: "Dye Lots That Don't Match Demand", text: "Yarn is dyed in lot sizes that leave shade remnants or short orders." },
      { icon: "grid_on", title: "Changeovers Decided Loom by Loom", text: "Quality and size changes are sequenced by hand across many looms, so changeover time is never minimised." },
      { icon: "invert_colors", title: "Batches Filled by Rule of Thumb", text: "Dyeing batches are filled to capacity, not to due date or shade sequence." },
      { icon: "timeline", title: "One Delay Moves Everything", text: "A late yarn lot pushes looms, dyeing and dispatch, and nobody sees it until dispatch." },
    ],
    modules: [
      { id: "yarn-dyeing", dev: true, name: "Yarn Dyeing Planner", icon: "palette",
        line: "Plans yarn dye lots against loom demand.", features: [] },
      { id: "warping", dev: true, name: "Warping Planner", icon: "timeline",
        line: "Plans warping, the preparatory stage that builds beams for the looms.", features: [] },
      { id: "loom", standalone: true, pitch: "Put the right order on the right loom, with fewer beam changes.", highlights: ["Allocation by width, design and pile", "Beam change minimisation", "Yarn availability checked"], name: "Loom Planner", icon: "grid_on",
        line: "Assigns orders to looms and sequences them.",
        desc: "Allocates orders across looms by width, pile height and design, and sequences them to minimise beam changes while holding dispatch dates.",
        features: ["One live plan across every loom", "Cutoffs first, then least changeover time", "Loom eligibility enforced, not advised", "What-if scenarios beside the live plan", "Capacity holds and dates for enquiries"],
        screens: [
          { src: "/images/loom-planner/01-scheduler.png", caption: "One live plan across every loom" },
          { src: "/images/loom-planner/02-reassign-split.png", caption: "Reassign or split a run across looms" },
          { src: "/images/loom-planner/03-what-if-scenarios.png", caption: "What-if scenarios beside the live plan" },
          { src: "/images/loom-planner/04-production-variance.png", caption: "Planned against actual production, loom by loom" },
        ],
        inputs: ["Orders", "Loom master", "Yarn availability"],
        outputs: ["Loom schedule", "Beam change plan", "Greige output dates"] },
      { id: "processing", dev: true, name: "Processing", icon: "invert_colors",
        line: "Plans post-weaving processing of the woven fabric.", features: [] },
      { id: "csp", dev: true, name: "CSP Planner", icon: "content_cut",
        line: "Plans Cutting, Sewing & Packing, the last stage before dispatch.", features: [] },
    ],
  },
];

export function getSuite(id: string): Suite | undefined {
  return suites.find((s) => s.id === id);
}

/** Homepage "Industries We Serve" cards. Names differ from the suite copy on purpose. */
export const homeIndustries = [
  { id: "flexible-packaging" as SuiteId, num: "01", name: "Flexible Packaging" },
  { id: "terry-towel" as SuiteId, num: "02", name: "Terry Towel" },
];
