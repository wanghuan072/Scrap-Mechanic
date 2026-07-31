import type { ArticleEntry } from "@/data/types";

export const builds: ArticleEntry[] = [
  {
    slug: "starter-car",
    title: "Starter Car - A Low, Repairable Chassis",
    description:
      "A simple vehicle pattern built around clear connections, a low center of mass, and easy repairs.",
    category: "Vehicles",
    image: "/images/scrap-mechanic/screenshot-10.jpg",
    imageAlt: "A compact Scrap Mechanic vehicle with a low chassis",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "8 min",
    featured: true,
    quickAnswer:
      "Build the minimum driving chassis first, test it off the Lift, then add storage and protection without moving heavy parts above the seat.",
    sections: [
      {
        heading: "Required Systems",
        bullets: [
          "A rigid frame with room around the wheel bearings.",
          "Four wheels and bearings.",
          "A Driver's Seat and an engine.",
          "A clear place for fuel and modest storage.",
        ],
      },
      {
        heading: "Build Order",
        steps: [
          "Create a low rectangular frame on the Lift.",
          "Place and align the wheel bearings before adding bodywork.",
          "Connect the engine and steering, then inspect every direction.",
          "Test the empty chassis on flat ground.",
          "Add storage low and close to the center.",
        ],
      },
      {
        heading: "Improve Only What Fails",
        paragraphs: [
          "If the vehicle flips, widen or lower it before adding more power. If steering shakes, reduce speed and inspect joint alignment. A starter car should remain easy to understand after damage.",
        ],
      },
    ],
    relatedWiki: ["bearing", "connect-tool", "lift", "structural-blocks"],
    seo: {
      title: "Scrap Mechanic Builds - Starter Car - Build Guide",
      description:
        "Build a low, stable, repairable Scrap Mechanic starter car with clear bearing, engine, steering, and storage placement. Verify it under load.",
      keywords: ["Scrap Mechanic starter car", "Scrap Mechanic vehicle build", "Scrap Mechanic beginner car"],
    },
  },
  {
    slug: "mining-vehicle",
    title: "Mining Vehicle - Stable Tool Contact",
    description:
      "Plan a mining vehicle around controlled tool pressure, frame strength, and safe collection.",
    category: "Mining",
    image: "/images/scrap-mechanic/screenshot-02.jpg",
    imageAlt: "A heavy mechanical vehicle in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "9 min",
    featured: true,
    quickAnswer:
      "Keep the tool head visible, mount heavy parts low, control contact instead of ramming, and test the machine against a safe target before a long resource run.",
    sections: [
      {
        heading: "The Tool Head Needs Control",
        paragraphs: [
          "A powerful tool is not useful if the frame bounces away from the target. Design the front of the vehicle so the driver can see contact and apply pressure without lifting the steering wheels.",
        ],
      },
      {
        heading: "Chassis Priorities",
        bullets: [
          "Use a wide stance and low storage.",
          "Protect control connections from direct impact.",
          "Leave clearance for moving arms or pistons.",
          "Keep a reverse route when the tool catches.",
        ],
      },
      {
        heading: "Test Before the Resource Run",
        paragraphs: [
          "Run the tool at low power, inspect the frame for flex, and confirm that recovered material has somewhere to go. Do not discover a steering or collection problem at the far end of the map.",
        ],
      },
    ],
    relatedWiki: ["piston", "controller", "structural-blocks", "bearing"],
    seo: {
      title: "Scrap Mechanic Builds - Mining Vehicle - Build Guide",
      description:
        "Plan a stable Scrap Mechanic mining vehicle with controlled tool contact, a strong chassis, safe storage, and clear visibility. Check its recovery path.",
      keywords: ["Scrap Mechanic mining vehicle", "Scrap Mechanic mining build", "Scrap Mechanic drill vehicle"],
    },
  },
  {
    slug: "automatic-watering",
    title: "Automatic Watering - A Repairable First System",
    description:
      "Automate a small farm with a simple signal path and a watering arm you can inspect.",
    category: "Farm Machines",
    image: "/images/scrap-mechanic/screenshot-06.jpg",
    imageAlt: "A Scrap Mechanic farm ready for an automated watering system",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "8 min",
    quickAnswer:
      "Build one short watering pass, keep every connection visible, and confirm coverage before expanding the field.",
    sections: [
      {
        heading: "Start with One Row",
        paragraphs: [
          "A small working system teaches more than a large half-connected machine. Automate one row, observe the coverage, and only then repeat the pattern.",
        ],
      },
      {
        heading: "System Order",
        steps: [
          "Create a dependable water supply and container.",
          "Build a short arm or rail with clear crop clearance.",
          "Connect the trigger, movement, and water action in a visible order.",
          "Run a dry test before planting underneath it.",
          "Mark the stop and reset controls.",
        ],
      },
      {
        heading: "Make Failures Obvious",
        bullets: [
          "Use paint or lights to identify active and reset controls.",
          "Keep moving joints outside solid walls.",
          "Leave manual bucket access for recovery.",
        ],
      },
    ],
    relatedWiki: ["water-bucket", "controller", "logic-gate", "piston"],
    seo: {
      title: "Scrap Mechanic Builds - Automatic Watering",
      description:
        "Build a simple Scrap Mechanic automatic watering system with visible connections, test coverage, and manual recovery. Check its recovery path.",
      keywords: ["Scrap Mechanic automatic watering", "Scrap Mechanic farm machine", "Scrap Mechanic watering system"],
    },
  },
  {
    slug: "base-defense-gate",
    title: "Base Defense Gate - Protect the Mechanism",
    description:
      "Create a gate that controls movement without exposing every interactive part to the first attack.",
    category: "Base Defense",
    image: "/images/scrap-mechanic/screenshot-05.jpg",
    imageAlt: "A fortified structure suitable for a Scrap Mechanic defense gate",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "7 min",
    quickAnswer:
      "Separate the impact surface from the moving mechanism, add controls on both sides, and keep a manual escape route.",
    sections: [
      {
        heading: "A Gate Is Not the Whole Defense",
        paragraphs: [
          "The gate should slow and direct bots while keeping the movement parts protected. It should not be the only barrier between a raid and the crops.",
        ],
      },
      {
        heading: "Build Priorities",
        bullets: [
          "Protect bearings, pistons, and controllers behind the impact line.",
          "Add an inside control and an outside control.",
          "Keep the opening wide enough for the actual vehicle.",
          "Provide a manual route if the gate loses power or jams.",
        ],
      },
    ],
    relatedWiki: ["piston", "controller", "logic-gate", "structural-blocks"],
    seo: {
      title: "Scrap Mechanic Builds - Base Defense Gate",
      description:
        "Build a Scrap Mechanic defense gate with protected movement parts, two-sided controls, vehicle clearance, and a fallback route. Check its recovery path.",
      keywords: ["Scrap Mechanic base defense", "Scrap Mechanic gate build", "Scrap Mechanic farm gate"],
    },
  },
  {
    slug: "basic-logic-door",
    title: "Basic Logic Door - Open from Either Side",
    description:
      "A first logic project that turns two inputs into one understandable door control.",
    category: "Logic",
    image: "/images/scrap-mechanic/screenshot-11.jpg",
    imageAlt: "An automated mechanical build in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "6 min",
    featured: true,
    quickAnswer:
      "Connect both entry controls to a clear logic stage, then connect that output to one door mechanism and test every state.",
    sections: [
      {
        heading: "Keep the Signal Path Visible",
        paragraphs: [
          "This build is useful because it teaches a reusable pattern: several inputs can control one action without duplicating the door mechanism.",
        ],
      },
      {
        heading: "Test Four States",
        steps: [
          "Test with both controls inactive.",
          "Activate only the outside control.",
          "Activate only the inside control.",
          "Activate both controls and confirm the door remains predictable.",
        ],
      },
      {
        heading: "Label the Reset",
        paragraphs: [
          "If the final design includes memory or a timed sequence, mark how it returns to the closed state. A mechanism that works only when the builder remembers a hidden condition is difficult to maintain.",
        ],
      },
    ],
    relatedWiki: ["logic-gate", "controller", "connect-tool", "bearing"],
    seo: {
      title: "Scrap Mechanic Builds - Basic Logic Door",
      description:
        "Build a Scrap Mechanic logic door that opens from either side with a readable signal path and predictable reset. Verify clearance and recovery under load.",
      keywords: ["Scrap Mechanic logic door", "Scrap Mechanic logic build", "Scrap Mechanic two button door"],
    },
  },
  {
    slug: "resource-collector-truck",
    title: "Resource Collector Truck - Separate Work from Transport",
    description:
      "A stable utility truck with low storage, protected controls, and a detachable or clearly separated collection module.",
    category: "Utility Vehicle",
    image: "/images/scrap-mechanic/screenshot-10.jpg",
    imageAlt: "A rugged Scrap Mechanic utility truck",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "9 min",
    featured: true,
    quickAnswer:
      "Use a wide six-wheel or stable four-wheel chassis, mount cargo low, and keep the moving collection head from transferring every impact into the driver's seat.",
    sections: [
      {
        heading: "Build the Truck Without the Tool",
        steps: [
          "Create a low frame and test steering with an empty cargo bay.",
          "Mount fuel, controls, and recovery supplies inside the wheelbase.",
          "Add the collection module on a reinforced front or rear interface.",
          "Test the tool without cargo, then test cargo without the tool running.",
          "Tune suspension and power for the fully loaded return trip.",
        ],
      },
      {
        heading: "Keep Resource Objects Controlled",
        bullets: [
          "Use side boundaries so loose material cannot reach wheels.",
          "Prevent logs or rock pieces from striking the seat.",
          "Unload before the added mass removes steering authority.",
        ],
      },
      {
        heading: "Use Modular Failure",
        paragraphs: [
          "If the collection head jams, the vehicle should still be able to reverse and return. A separate tool switch, visible joint, and accessible weld point make field recovery much easier.",
        ],
      },
    ],
    relatedWiki: ["suspension", "large-chest", "weld-tool", "gas-engine"],
    seo: {
      title: "Scrap Mechanic Builds - Resource Collector Truck",
      description:
        "Build a stable Scrap Mechanic resource truck with low cargo, protected controls, and a recoverable collection module. Check its recovery path.",
      keywords: ["Scrap Mechanic resource truck", "Scrap Mechanic collector vehicle", "Scrap Mechanic utility build"],
    },
  },
  {
    slug: "cargo-hauler",
    title: "Cargo Hauler - Packing Station Delivery Vehicle",
    description:
      "A low-deck hauler for bulky produce cargo, road stability, easy loading, and reliable trader routes.",
    category: "Logistics",
    image: "/images/scrap-mechanic/screenshot-03.jpg",
    imageAlt: "A cargo vehicle beside a Scrap Mechanic farm",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "8 min",
    featured: true,
    quickAnswer:
      "Place the deck between the axles, use physical side and rear restraints, and choose stability and turning clearance over top speed.",
    sections: [
      {
        heading: "Define the Cargo Envelope",
        paragraphs: [
          "Build a visible box that represents the largest expected load before shaping the vehicle. The deck, restraints, and steering must work around that space.",
        ],
      },
      {
        heading: "Chassis Checklist",
        bullets: [
          "Wide wheel track and low deck height.",
          "Suspension tuned with the normal load present.",
          "Rear access that opens without dropping the cargo.",
          "Fuel and Lift reachable even after a rollover.",
          "Enough steering angle for Packing Station approaches.",
        ],
      },
      {
        heading: "Test the Empty Route",
        steps: [
          "Drive to the destination with no valuable cargo.",
          "Record narrow turns, slopes, and roadside threats.",
          "Adjust deck clearance and power.",
          "Repeat with disposable test weight.",
          "Load the real delivery only after the complete return succeeds.",
        ],
      },
    ],
    relatedWiki: ["suspension", "gas-engine", "drivers-seat", "metal-blocks"],
    seo: {
      title: "Scrap Mechanic Builds - Cargo Hauler - Build Guide",
      description:
        "Build a stable produce cargo hauler for Packing Station and trader routes in Scrap Mechanic. Test its controls, clearance, and recovery path under working load.",
      keywords: ["Scrap Mechanic cargo hauler", "Scrap Mechanic Packing Station vehicle", "Scrap Mechanic delivery truck"],
    },
  },
  {
    slug: "vacuum-harvester",
    title: "Vacuum Harvester - Collect One Crop Row Reliably",
    description:
      "A compact farm machine that aligns a Vacuum Pump, storage, and movement around one predictable crop row.",
    category: "Farming",
    image: "/images/scrap-mechanic/screenshot-06.jpg",
    imageAlt: "An automated harvesting machine in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "10 min",
    quickAnswer:
      "Build around one straight row, set the Vacuum Pump to collect into connected storage, and move slowly enough that every mature crop enters the pickup zone.",
    sections: [
      {
        heading: "Align the Farm Before the Vehicle",
        paragraphs: [
          "A harvester cannot correct inconsistent row spacing. Use a straight test row and leave a service lane wide enough for the machine without touching adjacent crops.",
        ],
      },
      {
        heading: "Collection Path",
        steps: [
          "Mount the Vacuum Pump at a consistent height and distance from the crop line.",
          "Connect the pump to a dedicated output chest.",
          "Verify In mode with one mature crop.",
          "Drive or move the head through the row at low speed.",
          "Check missed plants before increasing speed or width.",
        ],
      },
      {
        heading: "Protect the Harvest",
        bullets: [
          "Keep seeds in a different container from collected crops.",
          "Stop the pump before changing its pipe or chest.",
          "Unload before using the same vehicle for raid defense.",
        ],
      },
    ],
    relatedWiki: ["vacuum-pump", "large-chest", "sensor", "controller"],
    seo: {
      title: "Scrap Mechanic Builds - Vacuum Harvester",
      description:
        "Build a Vacuum Pump harvester that follows one crop row and stores the harvest reliably in Scrap Mechanic. Test the controls before departure.",
      keywords: ["Scrap Mechanic vacuum harvester", "Scrap Mechanic crop harvester", "Scrap Mechanic farm vehicle"],
    },
  },
  {
    slug: "piston-elevator",
    title: "Piston Elevator - Safe Stops and Service Access",
    description:
      "A compact vertical lift with a guided platform, slow test sequence, landing controls, and a reachable emergency stop.",
    category: "Logic Build",
    image: "/images/scrap-mechanic/screenshot-07.jpg",
    imageAlt: "A vertical moving mechanism in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "9 min",
    quickAnswer:
      "Guide the platform against rotation, sequence Pistons slowly with a Controller, and make the default stopped state safe at every landing.",
    sections: [
      {
        heading: "Constrain the Platform",
        paragraphs: [
          "Pistons provide straight motion, but the platform can still twist under an uneven load. Use a symmetrical frame and guide geometry that cannot catch during extension.",
        ],
      },
      {
        heading: "Commissioning Order",
        steps: [
          "Test each Piston alone at the lowest practical speed.",
          "Connect the platform and verify full clearance.",
          "Add the Controller sequence without passengers.",
          "Add landing Buttons and a reachable stop control.",
          "Test an off-center load before enclosing the shaft.",
        ],
      },
      {
        heading: "Do Not Hide the Service Points",
        bullets: [
          "Keep Controller and Piston settings accessible.",
          "Leave room to remove a trapped platform section.",
          "Mark the moving edge with a high-contrast color.",
        ],
      },
    ],
    relatedWiki: ["piston", "controller", "switch", "paint-tool"],
    seo: {
      title: "Scrap Mechanic Builds - Piston Elevator - Build Guide",
      description:
        "In Scrap Mechanic, build a guided Piston elevator with safe Controller sequencing, landing controls, and service access. Verify the current role in-game.",
      keywords: ["Scrap Mechanic piston elevator", "Scrap Mechanic lift build", "Scrap Mechanic Controller sequence"],
    },
  },
  {
    slug: "off-road-scout",
    title: "Off-Road Scout - Exploration Vehicle",
    description:
      "A light, recoverable exploration vehicle with long-route supplies, terrain clearance, and room for priority loot.",
    category: "Exploration Vehicle",
    image: "/images/scrap-mechanic/screenshot-09.jpg",
    imageAlt: "A Scrap Mechanic vehicle exploring rough terrain",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "8 min",
    featured: true,
    quickAnswer:
      "Use moderate wheel travel, a low center of mass, protected fuel, and only enough storage for priority loot so the scout remains easy to recover.",
    sections: [
      {
        heading: "Scout Means Information First",
        paragraphs: [
          "The vehicle should find roads, landmarks, and safe approaches without becoming a mobile warehouse. Heavy armor and excessive storage make a scout harder to free from generated terrain.",
        ],
      },
      {
        heading: "Essential Layout",
        bullets: [
          "Low seat and fuel near the center.",
          "Moderate suspension travel with protected bearings.",
          "One priority-loot chest mounted inside the wheelbase.",
          "Accessible Lift, food, fuel, and repair blocks.",
          "Lights that do not blind the driver in dust or weather.",
        ],
      },
      {
        heading: "Recovery Test",
        steps: [
          "Roll the empty vehicle on safe ground.",
          "Confirm the Lift can reach a useful frame point.",
          "Test steering after a wheel or panel is removed.",
          "Load the standard supplies and repeat the rough-terrain route.",
        ],
      },
    ],
    relatedWiki: ["suspension", "gasoline", "large-chest", "lift"],
    seo: {
      title: "Scrap Mechanic Builds - Off-Road Scout - Build Guide",
      description:
        "In Scrap Mechanic, build a light off-road scout with recovery access, stable suspension, supplies, and priority-loot storage. Verify the current role in-game.",
      keywords: ["Scrap Mechanic scout vehicle", "Scrap Mechanic off road build", "Scrap Mechanic exploration vehicle"],
    },
  },
  {
    slug: "sensor-airlock-door",
    title: "Sensor Airlock Door - Controlled Entry",
    description:
      "A two-door entry system that prevents both sides from opening together and keeps the logic visible for repair.",
    category: "Logic Build",
    image: "/images/scrap-mechanic/screenshot-11.jpg",
    imageAlt: "A sensor-controlled entry system in Scrap Mechanic",
    gameVersion: "1.0",
    published: "2026-07-28",
    updated: "2026-07-28",
    readingTime: "10 min",
    quickAnswer:
      "Build each door manually, then add logic that allows one door to open only when the other is confirmed closed.",
    sections: [
      {
        heading: "Build Two Reliable Doors First",
        paragraphs: [
          "An interlock cannot repair a door that jams physically. Test both doors for clearance, stopped position, and manual control before joining their logic.",
        ],
      },
      {
        heading: "Interlock Sequence",
        steps: [
          "Detect or request entry at the first door.",
          "Confirm the second door is closed.",
          "Open the first door and wait for the player to enter.",
          "Close and confirm the first door.",
          "Allow the second door to open.",
        ],
      },
      {
        heading: "Failure States",
        bullets: [
          "Provide a manual reset from inside the chamber.",
          "Keep moving edges visible and slow during testing.",
          "Do not place both emergency controls behind the same locked door.",
        ],
      },
    ],
    relatedWiki: ["sensor", "logic-gate", "controller", "switch"],
    seo: {
      title: "Scrap Mechanic Builds - Sensor Airlock Door",
      description:
        "Build a two-door Scrap Mechanic airlock with Sensors, interlock logic, safe states, and manual reset controls. Test the controls before departure.",
      keywords: ["Scrap Mechanic airlock door", "Scrap Mechanic sensor door", "Scrap Mechanic logic build"],
    },
  },
];
