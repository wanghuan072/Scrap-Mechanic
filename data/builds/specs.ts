export type BuildPart = {
  name: string;
  quantity: number;
  role: string;
  essential?: boolean;
};

export type BuildTool = {
  name: string;
  use: string;
  moment: string;
};

export type BuildStage = {
  number: string;
  title: string;
  goal: string;
  steps: string[];
  checkpoint: string;
};

export type BuildConnection = {
  from: string;
  to: string;
  setting: string;
  purpose: string;
};

export type BuildTest = {
  test: string;
  pass: string;
  ifItFails: string;
};

export type BuildVariant = {
  situation: string;
  change: string;
  tradeoff: string;
};

export type BuildSpec = {
  slug: string;
  blueprintId: string;
  difficulty: "First build" | "Intermediate" | "Advanced";
  buildTime: string;
  crew: string;
  purpose: string;
  bestFor: string[];
  avoidWhen: string[];
  baseline: Array<{ label: string; value: string }>;
  parts: BuildPart[];
  toolkit: BuildTool[];
  stages: BuildStage[];
  connections: BuildConnection[];
  tests: BuildTest[];
  variants: BuildVariant[];
};

export const buildSpecs: Record<string, BuildSpec> = {
  "starter-car": {
    slug: "starter-car",
    blueprintId: "VEH-01",
    difficulty: "First build",
    buildTime: "20–35 minutes",
    crew: "1 mechanic",
    purpose:
      "A four-wheel road chassis that teaches steering, drive bearings, weight placement, and field recovery before cargo or tools are added.",
    bestFor: [
      "First trips between the crash site, Mechanic Station, and nearby ruins",
      "Learning bearing direction and Driver's Seat steering",
      "A repairable platform that can later accept one chest",
    ],
    avoidWhen: [
      "You already need to carry large resource objects",
      "The route is dominated by steep generated terrain",
      "You plan to mount a heavy mining or harvesting head immediately",
    ],
    baseline: [
      { label: "Footprint", value: "10 × 16 blocks" },
      { label: "Ground clearance", value: "2 blocks" },
      { label: "Wheel layout", value: "4 wheels / front steering" },
      { label: "Drive", value: "Rear-wheel or four-wheel" },
      { label: "Starting power", value: "Low, then one step at a time" },
      { label: "Payload target", value: "Driver + one light chest" },
    ],
    parts: [
      { name: "Wood Block Level 1", quantity: 48, role: "Low ladder frame", essential: true },
      { name: "Bearing", quantity: 6, role: "Four wheel hubs plus two steering pivots", essential: true },
      { name: "Wheel", quantity: 4, role: "Road contact", essential: true },
      { name: "Driver's Seat Level 1", quantity: 1, role: "Steering and throttle input", essential: true },
      { name: "Gas Engine Level 1", quantity: 1, role: "Drive power", essential: true },
      { name: "Switch", quantity: 1, role: "Headlight control" },
      { name: "Headlight", quantity: 2, role: "Night route visibility" },
      { name: "Large Chest", quantity: 1, role: "Optional low-mounted cargo" },
    ],
    toolkit: [
      { name: "Lift", use: "Keep the chassis level while wheel and steering bearings are aligned.", moment: "Frame layout and recovery" },
      { name: "Connect Tool", use: "Set wheel rotation, steering direction, engine links, and seat controls.", moment: "Before the first ground test" },
      { name: "Weld Tool", use: "Move the tested chassis onto a stronger frame later without rebuilding every system.", moment: "Upgrade stage" },
    ],
    stages: [
      {
        number: "01",
        title: "Lay out the frame",
        goal: "Create a low, symmetrical ladder frame with open service access.",
        steps: [
          "Build two 16-block rails and join them with at least three crossmembers.",
          "Keep the seat and engine positions inside the wheelbase.",
          "Leave the front corners open for steering movement.",
        ],
        checkpoint: "The bare frame is symmetrical and has a clear Lift point from either side.",
      },
      {
        number: "02",
        title: "Install steering and wheels",
        goal: "Make both front wheels steer together without touching the frame.",
        steps: [
          "Mount one steering bearing on each front corner and mirror their rotation.",
          "Attach one wheel bearing to every hub.",
          "Turn the seat left and right while the chassis remains on the Lift.",
        ],
        checkpoint: "At full steering lock, neither front wheel clips a rail or body block.",
      },
      {
        number: "03",
        title: "Connect drive power",
        goal: "Produce predictable forward and reverse movement at low power.",
        steps: [
          "Connect the engine only to the bearings intended to drive.",
          "Connect the Driver's Seat to the engine.",
          "Reverse individual bearing directions until every driven wheel agrees.",
        ],
        checkpoint: "All driven wheels rotate toward the same travel direction.",
      },
      {
        number: "04",
        title: "Road-test before bodywork",
        goal: "Prove braking, steering, clearance, and recovery on the empty chassis.",
        steps: [
          "Drive straight, reverse, and make one full-lock turn in each direction.",
          "Cross a shallow ditch diagonally.",
          "Roll or tip the vehicle safely and confirm the Lift can recover it.",
        ],
        checkpoint: "The car completes the loop without wheel contact, rollover, or lost steering.",
      },
    ],
    connections: [
      { from: "Driver's Seat", to: "Front steering bearings", setting: "Mirror left/right rotation", purpose: "Steering" },
      { from: "Driver's Seat", to: "Gas Engine", setting: "Seat throttle", purpose: "Forward and reverse control" },
      { from: "Gas Engine", to: "Drive bearings", setting: "Low power for first test", purpose: "Wheel drive" },
      { from: "Switch", to: "Headlights", setting: "Toggle", purpose: "Night visibility" },
    ],
    tests: [
      { test: "Full-lock circle", pass: "Both directions complete without wheel rub", ifItFails: "Widen the front track or reduce steering obstruction" },
      { test: "Slope stop", pass: "Vehicle holds direction while braking", ifItFails: "Lower mass and reduce power before adding weight" },
      { test: "Loaded return", pass: "One chest does not remove steering authority", ifItFails: "Move the chest forward and lower inside the wheelbase" },
    ],
    variants: [
      { situation: "Rough roads", change: "Add four Off-Road Suspension units", tradeoff: "More travel and tuning work; higher chassis" },
      { situation: "Long route", change: "Add protected fuel storage and two Headlights", tradeoff: "More mass and another system to protect" },
      { situation: "Cargo first", change: "Extend the wheelbase before adding a second chest", tradeoff: "Larger turning circle" },
    ],
  },
  "mining-vehicle": {
    slug: "mining-vehicle",
    blueprintId: "MIN-02",
    difficulty: "Advanced",
    buildTime: "60–90 minutes",
    crew: "1–2 mechanics",
    purpose:
      "A low six-wheel mining carrier that keeps a Plasma Drill visible, controls head pressure, and protects steering while hauling recovered material.",
    bestFor: [
      "Repeated Excavation Island mining runs",
      "Players who already have Plasma Drill access and battery supply",
      "Controlled drilling with onboard storage",
    ],
    avoidWhen: [
      "You have not unlocked the Plasma Drill recipe",
      "Battery production cannot support the trip",
      "A handheld or stationary tool can reach the same target safely",
    ],
    baseline: [
      { label: "Footprint", value: "14 × 24 blocks" },
      { label: "Wheel layout", value: "6 wheels / front steering" },
      { label: "Tool travel", value: "2 Pistons, short controlled stroke" },
      { label: "Tool power", value: "Battery supply" },
      { label: "Cargo", value: "1 Large Chest or open collection bay" },
      { label: "Travel state", value: "Head raised and locked" },
    ],
    parts: [
      { name: "Metal Block Level 2", quantity: 96, role: "Tool frame and reinforced chassis", essential: true },
      { name: "Wheel", quantity: 6, role: "Loaded terrain contact", essential: true },
      { name: "Bearing", quantity: 8, role: "Wheel hubs and steering pivots", essential: true },
      { name: "Driver's Seat Level 1", quantity: 1, role: "Vehicle control", essential: true },
      { name: "Gas Engine Level 1", quantity: 1, role: "Travel power", essential: true },
      { name: "Plasma Drill Level 1", quantity: 1, role: "Mining head", essential: true },
      { name: "Piston Level 1", quantity: 2, role: "Short feed and head retraction", essential: true },
      { name: "Controller Level 1", quantity: 1, role: "Repeatable drill-head positions", essential: true },
      { name: "Large Chest", quantity: 1, role: "Recovered material storage" },
      { name: "Switch", quantity: 2, role: "Separate travel lock and tool power", essential: true },
    ],
    toolkit: [
      { name: "Lift", use: "Supports the chassis while the heavy tool head is balanced.", moment: "Frame build and field recovery" },
      { name: "Connect Tool", use: "Separates vehicle drive, head positioning, and drill power.", moment: "Commissioning" },
      { name: "Weld Tool", use: "Attaches the tested drill module to the carrier without rebuilding it.", moment: "Module installation" },
      { name: "Paint Tool", use: "Marks travel position, work position, and emergency stop.", moment: "Before the first mining run" },
    ],
    stages: [
      {
        number: "01",
        title: "Prove the loaded carrier",
        goal: "Build a stable six-wheel chassis before the drill is attached.",
        steps: [
          "Place the steering axle far enough forward to support the future head.",
          "Mount the seat, engine, and storage low inside the wheelbase.",
          "Use temporary blocks equal to the planned head mass during the road test.",
        ],
        checkpoint: "The weighted carrier still turns and reverses on a slope.",
      },
      {
        number: "02",
        title: "Build the drill module separately",
        goal: "Create a short, rigid head with a known neutral position.",
        steps: [
          "Mount the Plasma Drill where the driver can see the contact point.",
          "Use two aligned Pistons rather than a long unsupported arm.",
          "Add physical stops so retraction cannot pull the drill into the chassis.",
        ],
        checkpoint: "The drill reaches work and travel positions without chassis collision.",
      },
      {
        number: "03",
        title: "Separate the controls",
        goal: "Prevent travel inputs from activating the mining head.",
        steps: [
          "Use one Switch for the drill and another for head movement or lock state.",
          "Connect the Controller only to the Pistons or positioning bearings.",
          "Mark the fully retracted travel state.",
        ],
        checkpoint: "Exiting the seat leaves the head stopped in a safe position.",
      },
      {
        number: "04",
        title: "Run a controlled contact test",
        goal: "Apply tool pressure without unloading the steering axle.",
        steps: [
          "Approach square to a safe target at low vehicle power.",
          "Advance the head in short steps.",
          "Reverse immediately if the vehicle begins climbing or the steering wheels lighten.",
        ],
        checkpoint: "The drill remains visible and the vehicle can reverse away under its own power.",
      },
    ],
    connections: [
      { from: "Driver's Seat", to: "Gas Engine", setting: "Low travel power", purpose: "Carrier drive" },
      { from: "Controller", to: "Pistons", setting: "Short synchronized travel", purpose: "Head position" },
      { from: "Tool Switch", to: "Plasma Drill", setting: "Independent toggle", purpose: "Mining power" },
      { from: "Travel Switch", to: "Controller", setting: "Retracted position", purpose: "Head lock" },
    ],
    tests: [
      { test: "Weighted steering", pass: "Front wheels steer with simulated head mass", ifItFails: "Move the front axle forward or shift storage rearward" },
      { test: "Contact test", pass: "Head advances without lifting the chassis", ifItFails: "Lower the contact line and shorten Piston travel" },
      { test: "Emergency reverse", pass: "Vehicle backs away with the head partially extended", ifItFails: "Add clearance and a direct manual retract control" },
    ],
    variants: [
      { situation: "Stationary mine", change: "Remove the vehicle drive and anchor a guided drill frame", tradeoff: "Safer contact but no mobile collection" },
      { situation: "Two-person operation", change: "Separate driving and drill controls", tradeoff: "Better visibility, requires coordination" },
      { situation: "Long mining session", change: "Add protected battery and output storage", tradeoff: "Heavier return trip" },
    ],
  },
  "automatic-watering": {
    slug: "automatic-watering",
    blueprintId: "FRM-03",
    difficulty: "Intermediate",
    buildTime: "35–55 minutes",
    crew: "1 mechanic",
    purpose:
      "A one-row watering gantry with separated water delivery and arm movement, designed to expand only after one complete pass works.",
    bestFor: [
      "Straight crop rows near a fixed water supply",
      "Players learning Controller and Piston timing",
      "Farms that still retain manual bucket access",
    ],
    avoidWhen: [
      "Soil spacing changes from row to row",
      "The farm has no reliable refill path",
      "A Water Bucket is still faster for the current plot size",
    ],
    baseline: [
      { label: "First row", value: "8–12 soil plots" },
      { label: "Gantry width", value: "Row width + 2 blocks" },
      { label: "Water storage", value: "1 Water Container" },
      { label: "Delivery", value: "1 Water Cannon" },
      { label: "Movement", value: "1–2 Pistons" },
      { label: "Fallback", value: "Manual bucket access" },
    ],
    parts: [
      { name: "Metal Block Level 1", quantity: 40, role: "Gantry and service frame", essential: true },
      { name: "Water Container", quantity: 1, role: "Stored water", essential: true },
      { name: "Water Cannon", quantity: 1, role: "Crop delivery", essential: true },
      { name: "Piston Level 1", quantity: 2, role: "Controlled row travel", essential: true },
      { name: "Controller Level 1", quantity: 1, role: "Out-and-return sequence", essential: true },
      { name: "Switch", quantity: 2, role: "Master stop and water enable", essential: true },
      { name: "Button", quantity: 1, role: "Start one watering cycle", essential: true },
      { name: "Sensor Level 1", quantity: 1, role: "Optional end-position confirmation" },
    ],
    toolkit: [
      { name: "Connect Tool", use: "Keeps the start input, movement sequence, and water trigger readable.", moment: "Wiring" },
      { name: "Paint Tool", use: "Marks start, end, stop, and water controls with different colors.", moment: "Commissioning" },
      { name: "Lift", use: "Supports the arm while piston alignment is checked.", moment: "Arm construction" },
    ],
    stages: [
      {
        number: "01",
        title: "Mark the crop envelope",
        goal: "Define the exact first and last soil positions before machinery is built.",
        steps: [
          "Place one straight row of 8–12 soil plots.",
          "Leave a service lane beside the row.",
          "Mark the Cannon height and end clearance with temporary blocks.",
        ],
        checkpoint: "The complete row can still be watered manually.",
      },
      {
        number: "02",
        title: "Prove water delivery",
        goal: "Confirm the Container and Cannon work before movement is added.",
        steps: [
          "Mount and fill the Water Container.",
          "Connect the Cannon through its own Switch.",
          "Aim at the nearest and farthest plot from a fixed position.",
        ],
        checkpoint: "The Cannon waters a test plot without moving the arm.",
      },
      {
        number: "03",
        title: "Add a slow arm sequence",
        goal: "Move through the full row without collision or repeated start inputs.",
        steps: [
          "Align two Pistons on the same travel axis.",
          "Use the Controller to extend and return slowly.",
          "Add a master stop reachable from the service lane.",
        ],
        checkpoint: "A dry pass reaches both limits and returns to the marked start.",
      },
      {
        number: "04",
        title: "Water one complete row",
        goal: "Measure coverage before duplicating the design.",
        steps: [
          "Enable water and trigger one cycle.",
          "Inspect every plot for a missed edge.",
          "Adjust soil or Cannon position rather than adding speed.",
        ],
        checkpoint: "Every plot is watered in one cycle and the arm stops at home.",
      },
    ],
    connections: [
      { from: "Start Button", to: "Controller", setting: "One cycle", purpose: "Arm motion" },
      { from: "Controller", to: "Pistons", setting: "Slow synchronized path", purpose: "Row travel" },
      { from: "Water Switch", to: "Water Cannon", setting: "Independent enable", purpose: "Delivery test and override" },
      { from: "Master Switch", to: "Movement chain", setting: "Safe off state", purpose: "Emergency stop" },
    ],
    tests: [
      { test: "Dry pass", pass: "No moving block enters the crop or service lane", ifItFails: "Raise the gantry or shorten travel" },
      { test: "Coverage count", pass: "Every plot changes to watered state", ifItFails: "Adjust Cannon height or row spacing" },
      { test: "Interrupted cycle", pass: "Master stop halts motion without trapping the arm", ifItFails: "Add a manual position control" },
    ],
    variants: [
      { situation: "Two rows", change: "Duplicate the proven Cannon head, not the control chain", tradeoff: "Higher water demand" },
      { situation: "Mobile farm cart", change: "Replace the gantry with a low-speed wheel guide", tradeoff: "More alignment work" },
      { situation: "Sensor finish", change: "Use an end Sensor to confirm home position", tradeoff: "Extra logic and another failure point" },
    ],
  },
  "base-defense-gate": {
    slug: "base-defense-gate",
    blueprintId: "DEF-04",
    difficulty: "Intermediate",
    buildTime: "40–60 minutes",
    crew: "1 mechanic",
    purpose:
      "A two-Piston farm gate with protected motion parts, controls on both sides, and a separate route when the entrance jams.",
    bestFor: [
      "Vehicle entrances that need to close before a raid",
      "Farms with a second manual escape path",
      "Bases where the mechanism can sit behind the impact wall",
    ],
    avoidWhen: [
      "The gate would become the only way out",
      "Bots can strike Pistons and Controller directly",
      "The largest regular vehicle has not been measured",
    ],
    baseline: [
      { label: "Opening", value: "Vehicle width + 4 blocks" },
      { label: "Height", value: "Vehicle height + 3 blocks" },
      { label: "Motion", value: "2 synchronized Pistons" },
      { label: "Controls", value: "Inside + outside + emergency stop" },
      { label: "Impact layer", value: "Replaceable, ahead of mechanism" },
      { label: "Fallback", value: "Separate mechanic-sized exit" },
    ],
    parts: [
      { name: "Metal Block Level 2", quantity: 72, role: "Gate leaf, guides, and protected frame", essential: true },
      { name: "Piston Level 1", quantity: 2, role: "Gate movement", essential: true },
      { name: "Controller Level 1", quantity: 1, role: "Synchronized open and close", essential: true },
      { name: "Button", quantity: 2, role: "Inside and outside commands", essential: true },
      { name: "Switch", quantity: 1, role: "Emergency motion cutoff", essential: true },
      { name: "Sensor Level 1", quantity: 1, role: "Optional obstruction detection" },
      { name: "Logic Gate", quantity: 2, role: "Optional input and lock state" },
    ],
    toolkit: [
      { name: "Lift", use: "Holds the gate leaf while Piston guides and stops are aligned.", moment: "Mechanical build" },
      { name: "Connect Tool", use: "Traces inside, outside, stop, Controller, and Piston connections.", moment: "Control wiring" },
      { name: "Weld Tool", use: "Moves the tested gate leaf into the defended frame.", moment: "Final installation" },
      { name: "Paint Tool", use: "Marks crush zone and emergency stop.", moment: "Before vehicle testing" },
    ],
    stages: [
      {
        number: "01",
        title: "Measure the real vehicle",
        goal: "Set an opening that includes steering and suspension error.",
        steps: [
          "Park the widest regular vehicle in the proposed entrance.",
          "Add two blocks of clearance on each side.",
          "Mark the highest loaded point plus three blocks.",
        ],
        checkpoint: "The vehicle can stop halfway through without touching the unfinished frame.",
      },
      {
        number: "02",
        title: "Build the moving leaf",
        goal: "Create a rigid panel that cannot rotate into the opening.",
        steps: [
          "Keep the leaf separate from the replaceable impact wall.",
          "Use symmetrical Piston attachment points.",
          "Add physical guides and end stops.",
        ],
        checkpoint: "Manual Piston extension moves the leaf without binding.",
      },
      {
        number: "03",
        title: "Add controls from both sides",
        goal: "Open, close, and stop the gate without entering its sweep zone.",
        steps: [
          "Place one Button inside and one outside.",
          "Route both inputs to the Controller or input logic.",
          "Place the emergency Switch behind the defended line.",
        ],
        checkpoint: "Either side can command the gate and the stop interrupts motion.",
      },
      {
        number: "04",
        title: "Test the failure state",
        goal: "Keep the base usable when power, signal, or clearance fails.",
        steps: [
          "Stop the gate halfway and drive neither vehicle nor player through the crush line.",
          "Use the secondary exit.",
          "Practice manual access to the Piston and Controller settings.",
        ],
        checkpoint: "A jammed gate does not trap the mechanic inside or outside.",
      },
    ],
    connections: [
      { from: "Inside Button", to: "Input logic / Controller", setting: "Momentary command", purpose: "Interior access" },
      { from: "Outside Button", to: "Input logic / Controller", setting: "Momentary command", purpose: "Exterior access" },
      { from: "Controller", to: "Two Pistons", setting: "Matched travel and speed", purpose: "Gate movement" },
      { from: "Emergency Switch", to: "Motion chain", setting: "Normally enabled", purpose: "Immediate stop" },
    ],
    tests: [
      { test: "Largest vehicle pass", pass: "Vehicle clears at full loaded height", ifItFails: "Widen or raise the opening before armor" },
      { test: "Halfway stop", pass: "Leaf stays guided and controls remain reachable", ifItFails: "Reinforce guides and move the stop control" },
      { test: "Impact access", pass: "Outer damage can be repaired without removing Pistons", ifItFails: "Move the mechanism behind a replaceable panel" },
    ],
    variants: [
      { situation: "No vehicle entrance", change: "Use a narrow vertical Piston door", tradeoff: "Cheaper but unsuitable for haulers" },
      { situation: "Frequent traffic", change: "Add a Sensor only after manual controls work", tradeoff: "Convenient, but obstruction logic becomes critical" },
      { situation: "Heavy raid lane", change: "Add a sacrificial impact barrier ahead of the gate", tradeoff: "More repair work, less mechanism damage" },
    ],
  },
  "basic-logic-door": {
    slug: "basic-logic-door",
    blueprintId: "LOG-05",
    difficulty: "First build",
    buildTime: "20–30 minutes",
    crew: "1 mechanic",
    purpose:
      "A small bearing door controlled from both sides, used to learn input states, one mechanical output, and an obvious reset.",
    bestFor: [
      "First Logic Gate project",
      "Workshop rooms and protected pedestrian doors",
      "Testing two inputs before building an airlock",
    ],
    avoidWhen: [
      "The door must resist direct raid impact",
      "A vehicle needs to pass through",
      "The moving panel cannot clear players on both sides",
    ],
    baseline: [
      { label: "Opening", value: "3 × 5 blocks" },
      { label: "Door motion", value: "1 Bearing / 90° swing" },
      { label: "Inputs", value: "2 Buttons" },
      { label: "Logic", value: "1 OR Logic Gate" },
      { label: "Motion control", value: "1 Controller" },
      { label: "Reset", value: "Return to closed" },
    ],
    parts: [
      { name: "Metal Block Level 1", quantity: 24, role: "Door frame and leaf", essential: true },
      { name: "Bearing", quantity: 1, role: "Door hinge", essential: true },
      { name: "Controller Level 1", quantity: 1, role: "Open and closed angles", essential: true },
      { name: "Logic Gate", quantity: 1, role: "Combines two Buttons with OR behavior", essential: true },
      { name: "Button", quantity: 2, role: "Inside and outside input", essential: true },
      { name: "Switch", quantity: 1, role: "Optional maintenance hold" },
    ],
    toolkit: [
      { name: "Connect Tool", use: "Shows the two inputs, OR gate, Controller, and Bearing as one readable chain.", moment: "Wiring" },
      { name: "Paint Tool", use: "Colors inputs, logic, and output differently.", moment: "Debug labeling" },
      { name: "Lift", use: "Supports a test door away from the base wall.", moment: "Prototype" },
    ],
    stages: [
      {
        number: "01",
        title: "Build the hinge first",
        goal: "Prove the door leaf can move without logic.",
        steps: [
          "Mount one Bearing on the protected side of the opening.",
          "Build a light 3 × 5 leaf.",
          "Use a temporary Switch to test the full swing.",
        ],
        checkpoint: "The leaf clears the frame and player path at both end angles.",
      },
      {
        number: "02",
        title: "Set open and closed angles",
        goal: "Give the Controller two predictable positions.",
        steps: [
          "Connect the Controller to the Bearing.",
          "Set a closed position against a physical stop.",
          "Set an open position near 90° without over-rotation.",
        ],
        checkpoint: "Repeated cycles return to the same closed edge.",
      },
      {
        number: "03",
        title: "Combine two inputs",
        goal: "Let either Button request the same door action.",
        steps: [
          "Place one Button on each side outside the sweep.",
          "Set the Logic Gate to OR.",
          "Connect both Buttons to the gate, then the gate to the Controller.",
        ],
        checkpoint: "Either Button activates the door while neither leaves it idle.",
      },
      {
        number: "04",
        title: "Test all four input states",
        goal: "Confirm the behavior is defined rather than accidental.",
        steps: [
          "Test neither input.",
          "Test the outside Button only.",
          "Test the inside Button only.",
          "Test both Buttons together.",
        ],
        checkpoint: "All four states produce a known result and the door has a clear reset.",
      },
    ],
    connections: [
      { from: "Outside Button", to: "OR Logic Gate", setting: "Input A", purpose: "Entry request" },
      { from: "Inside Button", to: "OR Logic Gate", setting: "Input B", purpose: "Exit request" },
      { from: "OR Logic Gate", to: "Controller", setting: "Output", purpose: "Shared command" },
      { from: "Controller", to: "Door Bearing", setting: "Closed / open angles", purpose: "Door movement" },
    ],
    tests: [
      { test: "Four-state input", pass: "Every Button combination matches the plan", ifItFails: "Trace inputs before changing the Controller" },
      { test: "Obstruction test", pass: "Door stops against a safe physical limit", ifItFails: "Reduce angle and move the Button out of the sweep" },
      { test: "Reload state", pass: "Door state is understandable after returning to the world", ifItFails: "Add a visible maintenance reset" },
    ],
    variants: [
      { situation: "Hold-to-open", change: "Use direct Button behavior without toggle memory", tradeoff: "Simple and safe, requires holding or repeated use" },
      { situation: "Automatic entry", change: "Replace one Button with a Sensor", tradeoff: "Hands-free, vulnerable to unwanted triggers" },
      { situation: "Sliding door", change: "Replace Bearing with a Piston", tradeoff: "Smaller sweep, needs straight travel clearance" },
    ],
  },
  "resource-collector-truck": {
    slug: "resource-collector-truck",
    blueprintId: "UTL-06",
    difficulty: "Intermediate",
    buildTime: "50–75 minutes",
    crew: "1–2 mechanics",
    purpose:
      "A six-wheel utility truck that separates the driving chassis from a replaceable Resource Collector module.",
    bestFor: [
      "Wood and stone collection routes",
      "Returning full Resource Collectors to a Refinebot",
      "Players who need a recoverable work truck rather than a huge harvester",
    ],
    avoidWhen: [
      "The route is too narrow for a six-wheel chassis",
      "You cannot unload full collectors at the workshop",
      "The collection head blocks steering or driver visibility",
    ],
    baseline: [
      { label: "Footprint", value: "14 × 24 blocks" },
      { label: "Wheel layout", value: "6 wheels / front steering" },
      { label: "Collectors", value: "2 low-mounted units" },
      { label: "Suspension", value: "6 Off-Road units" },
      { label: "Module control", value: "Independent Switch" },
      { label: "Tune state", value: "Collectors loaded" },
    ],
    parts: [
      { name: "Metal Block Level 1", quantity: 112, role: "Truck frame and module interface", essential: true },
      { name: "Wheel", quantity: 6, role: "Loaded terrain contact", essential: true },
      { name: "Bearing", quantity: 8, role: "Wheel hubs and steering", essential: true },
      { name: "Off-Road Suspension Level 1", quantity: 6, role: "Loaded wheel travel", essential: true },
      { name: "Driver's Seat Level 1", quantity: 1, role: "Driving controls", essential: true },
      { name: "Gas Engine Level 1", quantity: 1, role: "Travel power", essential: true },
      { name: "Resource Collector", quantity: 2, role: "Loose resource storage", essential: true },
      { name: "Switch", quantity: 1, role: "Collection module cutoff", essential: true },
      { name: "Large Chest", quantity: 1, role: "Tools, fuel, and refined items" },
    ],
    toolkit: [
      { name: "Lift", use: "Supports the long chassis and recovers it after a loaded rollover.", moment: "Frame and field recovery" },
      { name: "Weld Tool", use: "Attaches or replaces the collection module at a clear interface.", moment: "Module changes" },
      { name: "Connect Tool", use: "Keeps drive and collection controls separate.", moment: "Commissioning" },
      { name: "Sledgehammer", use: "Moves loose resource objects away from wheels during manual recovery.", moment: "Jam clearing" },
    ],
    stages: [
      {
        number: "01",
        title: "Build the truck without collectors",
        goal: "Prove steering, suspension, and braking on a bare utility chassis.",
        steps: [
          "Build a low 14 × 24 frame with a reinforced module end.",
          "Mount six suspension units at matching settings.",
          "Road-test using temporary weight equal to two loaded collectors.",
        ],
        checkpoint: "The weighted chassis steers and brakes without suspension collapse.",
      },
      {
        number: "02",
        title: "Define the resource path",
        goal: "Keep loose logs and stone away from wheels and the seat.",
        steps: [
          "Mark the entry side for loose resource objects.",
          "Add side boundaries leading toward the collectors.",
          "Leave an open manual unloading side.",
        ],
        checkpoint: "A loose test object cannot roll into a wheel or steering joint.",
      },
      {
        number: "03",
        title: "Attach a serviceable module",
        goal: "Let the collection section fail without disabling the truck.",
        steps: [
          "Mount both collectors low and close to the wheelbase.",
          "Use a short reinforced interface, not decorative bodywork.",
          "Keep weld points and the module Switch visible.",
        ],
        checkpoint: "The truck can reverse and drive home with the module disabled.",
      },
      {
        number: "04",
        title: "Tune the full return load",
        goal: "Make the loaded trip the final acceptance test.",
        steps: [
          "Fill or simulate both collectors.",
          "Drive the roughest part of the planned route.",
          "Adjust suspension equally by axle and keep engine power below rollover speed.",
        ],
        checkpoint: "The full truck retains steering authority and a reachable Lift point.",
      },
    ],
    connections: [
      { from: "Driver's Seat", to: "Gas Engine", setting: "Moderate loaded power", purpose: "Truck drive" },
      { from: "Gas Engine", to: "Drive bearings", setting: "Matched wheel direction", purpose: "Traction" },
      { from: "Module Switch", to: "Collection mechanism", setting: "Independent toggle", purpose: "Jam isolation" },
      { from: "Driver's Seat", to: "Steering bearings", setting: "Front axle only", purpose: "Predictable steering" },
    ],
    tests: [
      { test: "Full collector route", pass: "Steering remains responsive on the return", ifItFails: "Move collectors toward the center and reduce power" },
      { test: "Loose object containment", pass: "Logs and stone stay clear of wheels", ifItFails: "Add guides and lower approach speed" },
      { test: "Module disabled", pass: "Truck reverses and returns without the tool", ifItFails: "Separate structure and control connections" },
    ],
    variants: [
      { situation: "Tree route", change: "Open the rear module and favor long object guides", tradeoff: "Longer vehicle" },
      { situation: "Stone route", change: "Use a lower enclosed collection bay", tradeoff: "More frame weight" },
      { situation: "Refinebot loop", change: "Design collector placement for direct workshop unloading", tradeoff: "Less flexible cargo layout" },
    ],
  },
  "cargo-hauler": {
    slug: "cargo-hauler",
    blueprintId: "HAU-07",
    difficulty: "Intermediate",
    buildTime: "45–70 minutes",
    crew: "1 mechanic",
    purpose:
      "A low-deck six-wheel delivery truck sized around packed produce, safe restraints, and the complete route to the trader.",
    bestFor: [
      "Packing Station and Farmers Hideout delivery loops",
      "Bulky cargo that must stay physically restrained",
      "Known road routes with repeatable turns",
    ],
    avoidWhen: [
      "The cargo envelope has not been measured",
      "The route requires narrow off-road gaps",
      "The deck sits above most heavy components",
    ],
    baseline: [
      { label: "Footprint", value: "14 × 26 blocks" },
      { label: "Deck", value: "Between the axles" },
      { label: "Wheel layout", value: "6 wheels / front steering" },
      { label: "Restraints", value: "Front, sides, removable rear" },
      { label: "Suspension", value: "Tune with normal cargo" },
      { label: "Route reserve", value: "Fuel for delays and return" },
    ],
    parts: [
      { name: "Metal Block Level 1", quantity: 140, role: "Long chassis and cargo restraints", essential: true },
      { name: "Wheel", quantity: 6, role: "Loaded road contact", essential: true },
      { name: "Bearing", quantity: 8, role: "Wheel hubs and steering", essential: true },
      { name: "Off-Road Suspension Level 1", quantity: 6, role: "Cargo load control", essential: true },
      { name: "Driver's Seat Level 1", quantity: 1, role: "Driving controls", essential: true },
      { name: "Gas Engine Level 1", quantity: 1, role: "Loaded route power", essential: true },
      { name: "Switch", quantity: 1, role: "Rear restraint or lights" },
      { name: "Headlight", quantity: 2, role: "Night delivery visibility" },
    ],
    toolkit: [
      { name: "Lift", use: "Provides rollover recovery points at both ends of the long frame.", moment: "Frame layout and route recovery" },
      { name: "Weld Tool", use: "Builds a removable rear restraint or replaces a damaged deck section.", moment: "Cargo system" },
      { name: "Connect Tool", use: "Checks steering, drive, lights, and powered restraint separately.", moment: "Pre-route inspection" },
      { name: "Paint Tool", use: "Marks cargo envelope and loading edge.", moment: "Before real cargo" },
    ],
    stages: [
      {
        number: "01",
        title: "Build the cargo envelope first",
        goal: "Reserve space for the largest normal load before the cab is shaped.",
        steps: [
          "Mark the deck between the axles.",
          "Represent the widest and tallest load with temporary blocks.",
          "Add front and side restraints around that volume.",
        ],
        checkpoint: "Suspension and wheels can move fully without entering the cargo envelope.",
      },
      {
        number: "02",
        title: "Prove the empty route",
        goal: "Measure turns, slopes, and repair pull-offs without valuable cargo.",
        steps: [
          "Drive to the Packing Station or trader empty.",
          "Record the narrowest turn and steepest approach.",
          "Confirm the rear restraint can open at the destination.",
        ],
        checkpoint: "The truck completes the full return route without reversing through every turn.",
      },
      {
        number: "03",
        title: "Tune with disposable weight",
        goal: "Set suspension and engine power for the real operating condition.",
        steps: [
          "Place test mass low and centered on the deck.",
          "Adjust suspension equally on each axle.",
          "Repeat braking, slope, and full-lock tests.",
        ],
        checkpoint: "Cargo weight does not make the steering axle light.",
      },
      {
        number: "04",
        title: "Load and secure the delivery",
        goal: "Keep cargo inside during braking, turning, and rollover.",
        steps: [
          "Load heaviest objects near the deck center.",
          "Close the rear restraint before moving.",
          "Perform a short brake test before leaving the farm.",
        ],
        checkpoint: "No cargo can move into wheels, seat, or suspension travel.",
      },
    ],
    connections: [
      { from: "Driver's Seat", to: "Gas Engine", setting: "Moderate power", purpose: "Loaded route control" },
      { from: "Gas Engine", to: "Drive bearings", setting: "Matched direction", purpose: "Traction" },
      { from: "Driver's Seat", to: "Steering bearings", setting: "Front axle", purpose: "Turning" },
      { from: "Switch", to: "Rear restraint / Headlights", setting: "Clear labeled toggle", purpose: "Loading or night route" },
    ],
    tests: [
      { test: "Brake test", pass: "Cargo stays against its assigned restraints", ifItFails: "Add front/rear stops before more speed" },
      { test: "Full-lock loaded turn", pass: "Deck and cargo clear every wheel", ifItFails: "Raise local deck sections or widen the axle" },
      { test: "Rollover recovery", pass: "Lift points remain accessible with cargo secured", ifItFails: "Add external recovery points" },
    ],
    variants: [
      { situation: "Produce crates", change: "Use a flat low deck and tall removable side restraints", tradeoff: "Large silhouette" },
      { situation: "General storage", change: "Replace open deck with low Large Chests", tradeoff: "Cannot carry bulky loose cargo" },
      { situation: "Off-road shortcut", change: "Shorten the deck and reduce cargo count", tradeoff: "Lower delivery capacity" },
    ],
  },
  "vacuum-harvester": {
    slug: "vacuum-harvester",
    blueprintId: "FRM-08",
    difficulty: "Intermediate",
    buildTime: "40–60 minutes",
    crew: "1 mechanic",
    purpose:
      "A slow four-wheel row harvester that keeps a Vacuum Pump aligned with mature crops and sends them into one dedicated chest.",
    bestFor: [
      "Straight, consistently spaced crop rows",
      "Farms with repeat harvest cycles",
      "Players who can separate seeds from harvested produce",
    ],
    avoidWhen: [
      "Rows curve or change spacing",
      "One mixed chest must also hold seeds and supplies",
      "The driver cannot see the pickup mouth",
    ],
    baseline: [
      { label: "Footprint", value: "8 × 14 blocks" },
      { label: "Row guide", value: "One visible edge or guide wheel" },
      { label: "Pickup", value: "1 Vacuum Pump in In mode" },
      { label: "Storage", value: "1 dedicated Large Chest" },
      { label: "Travel speed", value: "Lowest reliable pass" },
      { label: "Row test", value: "Count misses before speeding up" },
    ],
    parts: [
      { name: "Metal Block Level 1", quantity: 56, role: "Low row-following chassis", essential: true },
      { name: "Wheel", quantity: 4, role: "Slow crop-lane travel", essential: true },
      { name: "Bearing", quantity: 6, role: "Wheel hubs and steering", essential: true },
      { name: "Driver's Seat Level 1", quantity: 1, role: "Row alignment", essential: true },
      { name: "Gas Engine Level 1", quantity: 1, role: "Low-speed drive", essential: true },
      { name: "Vacuum Pump", quantity: 1, role: "Crop pickup", essential: true },
      { name: "Large Chest", quantity: 1, role: "Harvest destination", essential: true },
      { name: "Switch", quantity: 1, role: "Independent Pump control", essential: true },
      { name: "Sensor Level 1", quantity: 1, role: "Optional row-end stop" },
    ],
    toolkit: [
      { name: "Connect Tool", use: "Confirms the Pump, chest, and control are isolated from vehicle drive.", moment: "Collection setup" },
      { name: "Lift", use: "Sets pickup height and allows wheel-guide adjustment.", moment: "Alignment" },
      { name: "Paint Tool", use: "Marks the guide edge, Pump mode, and harvest chest.", moment: "Before mixed-crop use" },
    ],
    stages: [
      {
        number: "01",
        title: "Straighten one test row",
        goal: "Make the farm geometry predictable before building the machine.",
        steps: [
          "Use one straight row with consistent plot spacing.",
          "Leave a service lane beside it.",
          "Mark the side the guide will follow.",
        ],
        checkpoint: "A mechanic can walk the lane without touching crops.",
      },
      {
        number: "02",
        title: "Prove Pump and storage",
        goal: "Collect one mature crop into an empty dedicated chest.",
        steps: [
          "Set the Vacuum Pump to In mode.",
          "Connect it to one empty Large Chest.",
          "Activate it with its own Switch.",
        ],
        checkpoint: "One crop leaves the field and appears in the intended chest.",
      },
      {
        number: "03",
        title: "Set pickup alignment",
        goal: "Hold the Pump at a constant distance and height.",
        steps: [
          "Mount the Pump where the driver can see it.",
          "Add a guide edge or wheel beside the soil line.",
          "Push the empty vehicle through the row before powering it.",
        ],
        checkpoint: "The pickup path crosses every plant center without entering adjacent soil.",
      },
      {
        number: "04",
        title: "Find the reliable speed",
        goal: "Choose speed from missed crops, not preference.",
        steps: [
          "Harvest one row at the lowest power.",
          "Count missed crops and confirm chest contents.",
          "Increase one step only after a zero-miss pass.",
        ],
        checkpoint: "One complete row is collected with zero misses and no chest mix-up.",
      },
    ],
    connections: [
      { from: "Driver's Seat", to: "Gas Engine", setting: "Lowest reliable power", purpose: "Row travel" },
      { from: "Gas Engine", to: "Drive bearings", setting: "Matched direction", purpose: "Movement" },
      { from: "Pump Switch", to: "Vacuum Pump", setting: "In mode", purpose: "Harvest pickup" },
      { from: "Vacuum Pump", to: "Large Chest", setting: "Connected storage path", purpose: "Crop destination" },
    ],
    tests: [
      { test: "Single-crop pickup", pass: "Crop reaches the intended chest", ifItFails: "Check Pump mode and storage connection" },
      { test: "Row alignment", pass: "Pickup crosses every crop center", ifItFails: "Adjust the guide, not driving speed" },
      { test: "Full chest behavior", pass: "Operator can stop before crops are lost", ifItFails: "Add a capacity check and unload rule" },
    ],
    variants: [
      { situation: "Fixed farm", change: "Mount the Pump on a guided rail instead of a vehicle", tradeoff: "More precise, less reusable" },
      { situation: "Two crop rows", change: "Add a second Pump and chest path", tradeoff: "Wider machine and more alignment risk" },
      { situation: "Planting pass", change: "Use a separate Out-mode seed system", tradeoff: "Never share the same unlabeled chest" },
    ],
  },
  "piston-elevator": {
    slug: "piston-elevator",
    blueprintId: "LOG-09",
    difficulty: "Advanced",
    buildTime: "45–70 minutes",
    crew: "1–2 mechanics",
    purpose:
      "A guided two-landing platform using four Pistons, matched movement, landing controls, and an emergency stop outside the shaft.",
    bestFor: [
      "Workshop access between two fixed levels",
      "Moving a mechanic and light cargo vertically",
      "Learning synchronized Piston sequences",
    ],
    avoidWhen: [
      "The platform has no anti-twist guide",
      "Controls sit inside the crush zone",
      "A ramp or stair is safer and simpler",
    ],
    baseline: [
      { label: "Platform", value: "6 × 6 blocks" },
      { label: "Lift stages", value: "4 Pistons in matched pairs" },
      { label: "Landings", value: "2 fixed stops" },
      { label: "Controls", value: "Button at each landing" },
      { label: "Emergency stop", value: "Outside shaft" },
      { label: "Test load", value: "Off-center before passengers" },
    ],
    parts: [
      { name: "Metal Block Level 2", quantity: 80, role: "Platform, shaft guides, and landings", essential: true },
      { name: "Piston Level 1", quantity: 4, role: "Matched vertical movement", essential: true },
      { name: "Controller Level 1", quantity: 1, role: "Landing sequence", essential: true },
      { name: "Button", quantity: 2, role: "Landing calls", essential: true },
      { name: "Switch", quantity: 1, role: "Emergency motion cutoff", essential: true },
      { name: "Sensor Level 1", quantity: 2, role: "Optional landing confirmation" },
      { name: "Logic Gate", quantity: 2, role: "Optional call and lock logic" },
    ],
    toolkit: [
      { name: "Lift", use: "Supports the platform and tests guide clearance before the Pistons carry it.", moment: "Platform fabrication" },
      { name: "Connect Tool", use: "Checks Piston order, landing inputs, sensors, and stop path.", moment: "Sequence wiring" },
      { name: "Weld Tool", use: "Builds the platform as a separate rigid assembly.", moment: "Platform installation" },
      { name: "Paint Tool", use: "Marks moving edges and landing safe zones.", moment: "Before passenger tests" },
    ],
    stages: [
      {
        number: "01",
        title: "Build the guided shaft",
        goal: "Prevent platform twist before power is connected.",
        steps: [
          "Set two straight guide faces across the full travel.",
          "Build a rigid 6 × 6 platform.",
          "Check clearance with the platform held at both landings.",
        ],
        checkpoint: "An off-center push cannot rotate the platform into a guide.",
      },
      {
        number: "02",
        title: "Match the Piston pairs",
        goal: "Move both sides at the same rate and length.",
        steps: [
          "Install Pistons symmetrically.",
          "Test each unit alone at low speed.",
          "Set matched travel before connecting the platform.",
        ],
        checkpoint: "Both sides reach the same height without frame strain.",
      },
      {
        number: "03",
        title: "Program two landings",
        goal: "Give the Controller known lower and upper positions.",
        steps: [
          "Start from the lower physical stop.",
          "Move one stage at a time.",
          "Stop short of maximum extension and mark the upper landing.",
        ],
        checkpoint: "Repeated cycles stop level at both landings.",
      },
      {
        number: "04",
        title: "Test faults before passengers",
        goal: "Keep people out until stop, obstruction, and off-center load tests pass.",
        steps: [
          "Use blocks as an off-center test load.",
          "Trigger the emergency stop mid-travel.",
          "Confirm service access without entering under the platform.",
        ],
        checkpoint: "The platform remains guided and recoverable after an interrupted cycle.",
      },
    ],
    connections: [
      { from: "Lower Button", to: "Controller / call logic", setting: "Upper destination", purpose: "Call from below" },
      { from: "Upper Button", to: "Controller / call logic", setting: "Lower destination", purpose: "Call from above" },
      { from: "Controller", to: "Four Pistons", setting: "Matched staged movement", purpose: "Vertical travel" },
      { from: "Emergency Switch", to: "Motion chain", setting: "Immediate off", purpose: "Fault stop" },
    ],
    tests: [
      { test: "Off-center load", pass: "Platform remains level and guided", ifItFails: "Widen attachment points and strengthen guides" },
      { test: "Mid-travel stop", pass: "Platform can be recovered without entering below", ifItFails: "Move service controls outside the shaft" },
      { test: "Landing repeatability", pass: "Edges align after multiple cycles", ifItFails: "Match Piston travel and add physical stops" },
    ],
    variants: [
      { situation: "One-person lift", change: "Reduce platform and use two Pistons", tradeoff: "Lower material cost, less load tolerance" },
      { situation: "Cargo lift", change: "Widen guides and use a larger platform", tradeoff: "More structure and stronger synchronization needed" },
      { situation: "Automatic landing", change: "Add Sensors after manual operation passes", tradeoff: "More logic and obstruction cases" },
    ],
  },
  "off-road-scout": {
    slug: "off-road-scout",
    blueprintId: "EXP-10",
    difficulty: "Intermediate",
    buildTime: "40–65 minutes",
    crew: "1 mechanic",
    purpose:
      "A compact four-wheel exploration vehicle with moderate suspension travel, protected fuel, lights, and only one priority-loot chest.",
    bestFor: [
      "Finding roads, landmarks, and safe approaches",
      "Long scouting loops with light cargo",
      "Generated terrain where recovery matters more than armor",
    ],
    avoidWhen: [
      "The trip requires bulk cargo",
      "The vehicle is being turned into a mobile base",
      "Heavy armor raises the center of mass above the seat",
    ],
    baseline: [
      { label: "Footprint", value: "10 × 16 blocks" },
      { label: "Suspension", value: "4 Off-Road units" },
      { label: "Wheel layout", value: "4 wheels / front steering" },
      { label: "Storage", value: "1 priority-loot chest" },
      { label: "Lighting", value: "2 forward Headlights" },
      { label: "Recovery", value: "Clear Lift points front and rear" },
    ],
    parts: [
      { name: "Metal Block Level 1", quantity: 72, role: "Compact protected frame", essential: true },
      { name: "Wheel", quantity: 4, role: "Terrain contact", essential: true },
      { name: "Bearing", quantity: 6, role: "Wheel hubs and steering", essential: true },
      { name: "Off-Road Suspension Level 1", quantity: 4, role: "Terrain following", essential: true },
      { name: "Driver's Seat Level 1", quantity: 1, role: "Driving control", essential: true },
      { name: "Gas Engine Level 1", quantity: 1, role: "Route power", essential: true },
      { name: "Large Chest", quantity: 1, role: "Priority loot only", essential: true },
      { name: "Headlight", quantity: 2, role: "Night and weather visibility", essential: true },
      { name: "Switch", quantity: 1, role: "Light control", essential: true },
    ],
    toolkit: [
      { name: "Lift", use: "Recovers the scout from generated terrain and tests wheel droop.", moment: "Suspension setup and expeditions" },
      { name: "Connect Tool", use: "Checks steering, drive, and lights before departure.", moment: "Preflight" },
      { name: "Weld Tool", use: "Repairs or replaces a damaged corner module.", moment: "Field service" },
      { name: "Paint Tool", use: "Marks fuel, storage, and recovery points.", moment: "Loadout" },
    ],
    stages: [
      {
        number: "01",
        title: "Build around recovery",
        goal: "Keep the frame light and reachable after a rollover.",
        steps: [
          "Use a short 10 × 16 frame.",
          "Reserve clear Lift points at both ends.",
          "Mount seat, engine, and chest low inside the wheelbase.",
        ],
        checkpoint: "The empty scout can be lifted from either end.",
      },
      {
        number: "02",
        title: "Set moderate suspension travel",
        goal: "Follow terrain without turning the scout into a tall bouncer.",
        steps: [
          "Install matching Off-Road Suspension units.",
          "Leave full compression clearance around every wheel.",
          "Begin with equal settings and an unloaded chassis.",
        ],
        checkpoint: "No wheel touches the frame at full steering and compression.",
      },
      {
        number: "03",
        title: "Add the expedition loadout",
        goal: "Carry essentials without becoming a cargo truck.",
        steps: [
          "Mount one chest for priority loot.",
          "Protect fuel near the center.",
          "Aim Headlights below the driver's eye line.",
        ],
        checkpoint: "The standard load fits without stacking mass above the seat.",
      },
      {
        number: "04",
        title: "Run the recovery route",
        goal: "Test rough terrain, a controlled rollover, and a damaged corner.",
        steps: [
          "Cross a ditch diagonally at low power.",
          "Tip the scout safely and recover it with the Lift.",
          "Remove one cosmetic corner and confirm steering remains usable.",
        ],
        checkpoint: "The scout can return after a minor impact without a workshop rebuild.",
      },
    ],
    connections: [
      { from: "Driver's Seat", to: "Gas Engine", setting: "Moderate power", purpose: "Terrain drive" },
      { from: "Driver's Seat", to: "Steering bearings", setting: "Front axle", purpose: "Steering" },
      { from: "Gas Engine", to: "Drive bearings", setting: "Four-wheel drive if fuel allows", purpose: "Traction" },
      { from: "Light Switch", to: "Headlights", setting: "Toggle", purpose: "Visibility" },
    ],
    tests: [
      { test: "Diagonal ditch", pass: "At least three wheels retain useful contact", ifItFails: "Reduce stiffness or increase safe clearance" },
      { test: "Controlled rollover", pass: "Lift reaches a structural point", ifItFails: "Expose recovery blocks" },
      { test: "Loaded steering", pass: "One chest does not cause understeer", ifItFails: "Move storage forward and lower" },
    ],
    variants: [
      { situation: "Road scout", change: "Use Sport Suspension and lower ride height", tradeoff: "Less terrain clearance" },
      { situation: "Night survey", change: "Add side work lights with separate control", tradeoff: "More power use and glare management" },
      { situation: "Two-player scout", change: "Add one protected passenger seat", tradeoff: "Longer frame or less cargo room" },
    ],
  },
  "sensor-airlock-door": {
    slug: "sensor-airlock-door",
    blueprintId: "LOG-11",
    difficulty: "Advanced",
    buildTime: "45–70 minutes",
    crew: "1 mechanic",
    purpose:
      "A two-door entry that uses separate Sensors and interlock logic so one door closes before the other is allowed to open.",
    bestFor: [
      "Controlled workshop or farm entry",
      "Learning Sensor range and interlocks",
      "Areas where both doors are protected from direct raid damage",
    ],
    avoidWhen: [
      "A simple two-Button door solves the problem",
      "Sensor sight lines include unrelated traffic",
      "There is no manual release for a trapped player",
    ],
    baseline: [
      { label: "Chamber", value: "4 × 6 blocks minimum" },
      { label: "Doors", value: "2 Piston sliding panels" },
      { label: "Sensors", value: "2, one per approach" },
      { label: "Interlock", value: "3 Logic Gates" },
      { label: "Manual release", value: "Button inside chamber" },
      { label: "Safe default", value: "Both doors closed" },
    ],
    parts: [
      { name: "Metal Block Level 2", quantity: 56, role: "Chamber, guides, and door panels", essential: true },
      { name: "Piston Level 1", quantity: 2, role: "Independent door movement", essential: true },
      { name: "Sensor Level 1", quantity: 2, role: "Outside and inside approach detection", essential: true },
      { name: "Logic Gate", quantity: 3, role: "Requests and mutual exclusion", essential: true },
      { name: "Controller Level 1", quantity: 1, role: "Optional close-then-open timing", essential: true },
      { name: "Button", quantity: 2, role: "Chamber release and maintenance test", essential: true },
      { name: "Switch", quantity: 1, role: "Automation disable", essential: true },
    ],
    toolkit: [
      { name: "Connect Tool", use: "Traces each Sensor request, interlock, door output, and manual release.", moment: "Logic commissioning" },
      { name: "Paint Tool", use: "Assigns distinct colors to outer request, inner request, lock, and outputs.", moment: "Debugging" },
      { name: "Lift", use: "Builds and tests each door panel before chamber installation.", moment: "Mechanical prototype" },
    ],
    stages: [
      {
        number: "01",
        title: "Build two manual doors",
        goal: "Prove both mechanisms independently before automation.",
        steps: [
          "Build two sliding panels with separate Pistons.",
          "Use temporary Switches to test each door.",
          "Set physical open and closed stops.",
        ],
        checkpoint: "Each door cycles without touching the chamber or the other panel.",
      },
      {
        number: "02",
        title: "Aim the Sensors",
        goal: "Detect the intended approach without seeing through the chamber.",
        steps: [
          "Place one Sensor outside each door.",
          "Reduce or position range so unrelated movement is excluded.",
          "Test at the edge of both detection zones.",
        ],
        checkpoint: "Standing in the chamber does not trigger both approach Sensors.",
      },
      {
        number: "03",
        title: "Build the interlock",
        goal: "Block one open request while the opposite door is open.",
        steps: [
          "Route each request through its own logic path.",
          "Use the opposite door state as an inhibit condition.",
          "Keep the final outputs visually separate.",
        ],
        checkpoint: "No tested input combination opens both doors together.",
      },
      {
        number: "04",
        title: "Add manual recovery",
        goal: "Let a mechanic exit after a Sensor or logic fault.",
        steps: [
          "Place a release Button inside the chamber.",
          "Add an automation-disable Switch outside the crush zone.",
          "Test recovery with each Sensor disconnected in turn.",
        ],
        checkpoint: "A player cannot be permanently trapped by one failed input.",
      },
    ],
    connections: [
      { from: "Outer Sensor", to: "Outer request logic", setting: "Approach range only", purpose: "Entry request" },
      { from: "Inner Sensor", to: "Inner request logic", setting: "Approach range only", purpose: "Exit request" },
      { from: "Interlock gates", to: "Door Pistons / Controller", setting: "Mutual exclusion", purpose: "One door at a time" },
      { from: "Release Button", to: "Safe door output", setting: "Manual momentary path", purpose: "Chamber recovery" },
    ],
    tests: [
      { test: "Both Sensors active", pass: "At most one door opens", ifItFails: "Fix the interlock before adding timing" },
      { test: "Sensor edge", pass: "Passing traffic does not trigger the opposite door", ifItFails: "Re-aim or reduce detection range" },
      { test: "Disconnected Sensor", pass: "Manual release still exits the chamber", ifItFails: "Create a direct protected recovery path" },
    ],
    variants: [
      { situation: "Simple workshop", change: "Use Buttons instead of Sensors", tradeoff: "Manual but easier to understand" },
      { situation: "Timed chamber", change: "Add Controller delay after both doors close", tradeoff: "Longer wait and more state debugging" },
      { situation: "Vehicle airlock", change: "Increase chamber and use gate mechanisms", tradeoff: "Much larger clearance and logic burden" },
    ],
  },
};

export const buildSpecList = Object.values(buildSpecs);
