// Single source for industries, suites and modules (ported from the design's abc-data.js).
// Add or remove a module by editing its suite's `modules` array.
// dev: true → IN DEVELOPMENT (no features, no screenshots). standalone: true → "Also available standalone" marker.

export type Problem = { icon: string; title: string; text: string };

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
    id: "flexible-packaging", num: "01", industry: "Polyfilms", name: "ABC for Polyfilms",
    image: "/images/industry-flexible-packaging.webp", imagePosition: "50% 50%",
    shot: "Primary slitter cutting a jumbo roll of film into customer rolls",
    lead: "Slitting plans for BOPP, BOPET and other film plants, built on your jumbo widths, machine limits and core rules. Campaign planning is in development.",
    desc: "Film plants running extrusion lines, primary slitting, metallising and secondary slitting. Orders arrive as widths, lengths and core sizes; jumbo rolls come off the line in one width. The plan has to cut one into the other with the least trim and the fewest knife-setting changes.",
    constraints: ["Jumbo widths, minimum trim and slit positions", "Core sizes and core-mix rules", "Roll diameter limits and excess length by grade", "Primary, metalliser and secondary stages"],
    buying: "Buy the suite, or either module on its own.",
    flow: "Campaign Planner decides what runs on each film line and when. Slitting Planner then decides how each jumbo roll is cut into customer rolls.",
    problems: [
      { icon: "content_cut", title: "Trim loss accepted, not minimised", text: "Deckle combinations are worked out by hand, so the first plan that fits is the one that runs." },
      { icon: "swap_horiz", title: "Knife settings changed more than needed", text: "Patterns are built one at a time, so the slitter stops for setting changes a better plan would avoid." },
      { icon: "event_busy", title: "Sign-off holds up the release", text: "Extra rolls cut to save trim need a sales decision, and one slow answer holds back every order in the plan." },
      { icon: "table_chart", title: "A plan that lives in one workbook", text: "Planning depends on one person's spreadsheet. When they are away, planning stops." },
    ],
    modules: [
      { id: "campaign", dev: true, pitch: "Sequence every line to cut changeovers and hold due dates.", highlights: [], name: "Campaign Planner", icon: "event_note",
        line: "Groups orders into production campaigns and sequences them across lines.",
        desc: "Takes pending orders and forecasts, groups them by grade, thickness and colour, and sequences campaigns to minimise changeover while holding due dates.",
        features: [], inputs: [], outputs: [] },
      { id: "slitting", standalone: true, pitch: "Cut every master roll into orders with the least trim.", highlights: ["Deckle optimisation across roll widths", "Knife and minimum-slit limits enforced", "Trim % shown before release"], name: "Slitting Planner", icon: "content_cut",
        line: "Converts master rolls into customer orders with the least trim.",
        desc: "Combines order widths across master roll deckles, respecting knife counts, minimum slit widths and core sizes. Every plan shows its trim percentage before it is released to the floor.",
        features: ["Primary, metalliser and secondary in one plan", "Least trim and fewest knife-setting changes", "Several distinct plans, one exact to order", "Hand edits blocked if they break machine limits", "Sales review of over- and under-production"],
        inputs: ["Order widths and lengths", "Master roll widths", "Slitter limits"],
        outputs: ["Slitting plan", "Trim report", "Machine instructions"] },
    ],
  },
  {
    id: "terry-towel", num: "02", industry: "Terry Towel", name: "ABC for Terry Towel",
    image: "/images/industry-terry-towel.webp", imagePosition: "100% 50%",
    shot: "Terry loom — loop pile forming at the fell",
    lead: "Weaving plans for terry mills, built on your loom categories, sorts, changeovers and weaving cutoffs. Planning for the rest of the route is in development.",
    desc: "Integrated terry mills running from yarn to finished towel. Every stage has its own bottleneck — dye-lot sizes, beam changes, batch capacity — and a delay at one moves every stage after it.",
    constraints: ["Yarn dye-lot sizes and shade matching", "Loom eligibility and changeovers by type", "Dyeing machine capacity and batch compatibility", "Order due dates across the full route"],
    buying: "Buy the complete APS, or any single module.",
    flow: "Yarn Dyeing plans dye lots, Warping builds beams, the Loom Planner schedules weaving, then Processing and Cutting, Sewing & Packing finish the towel.",
    problems: [
      { icon: "palette", title: "Dye lots that don't match demand", text: "Yarn is dyed in lot sizes that leave shade remnants or short orders." },
      { icon: "grid_on", title: "Changeovers decided loom by loom", text: "Quality and size changes are sequenced by hand across many looms, so changeover time is never minimised." },
      { icon: "invert_colors", title: "Batches filled by rule of thumb", text: "Dyeing batches are filled to capacity, not to due date or shade sequence." },
      { icon: "timeline", title: "One delay moves everything", text: "A late yarn lot pushes looms, dyeing and dispatch, and nobody sees it until dispatch." },
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

/** Homepage "Industries We Serve" cards. Names and segments differ from the suite copy on purpose. */
export const homeIndustries = [
  { id: "flexible-packaging" as SuiteId, num: "01", name: "Flexible Packaging",
    subs: ["Food & snack packaging", "Pouches & sachets", "Laminates & lidding films", "Shrink & stretch films", "Labels & sleeves", "Pharma & healthcare packaging"] },
  { id: "terry-towel" as SuiteId, num: "02", name: "Terry Towel",
    subs: ["Bath towels", "Hand & face towels", "Beach towels", "Bathrobes", "Hospitality linen", "Home furnishing"] },
];
