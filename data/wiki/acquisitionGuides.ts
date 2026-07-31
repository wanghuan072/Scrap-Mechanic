export type WikiAcquisitionGuide = {
  summary: string;
  locations: Array<{
    name: string;
    detail: string;
    href?: string;
  }>;
  fieldNotes: string[];
};

export const wikiAcquisitionGuides: Record<string, WikiAcquisitionGuide> = {
  "water-bucket": {
    summary:
      "The opening Water Bucket is placed at the pond beside the Crash Site and is required to extinguish the three marked fires inside the crashed ship.",
    locations: [
      {
        name: "Crash Site pond",
        detail:
          "Enter the ship to activate Getting Started, then follow the path opposite the crashed ship entrance. The bucket sits at the pond edge beside seeds, Soil Bags, a planted Tomato, and the farming billboard.",
        href: "/wiki/quests#getting-started",
      },
      {
        name: "Farming patches",
        detail:
          "Some small meadow farming structures contain a placed bucket alongside soil bags, seeds, or fertilizer.",
      },
    ],
    fieldNotes: [
      "Fill the empty Water Bucket at the pond, throw one splash at a marked interior fire, then refill it for the next fire.",
      "Getting Started advances after all three marked fires inside the crashed ship are extinguished.",
      "A filled Water Container can refill an empty bucket after the opening route.",
    ],
  },
  "circuit-board": {
    summary:
      "Circuit Boards are common electronic drops and container loot rather than a resource gathered from terrain.",
    locations: [
      {
        name: "Bot drops",
        detail:
          "Totebots, Haybots, and Farmbots can drop Circuit Boards when defeated.",
        href: "/wiki/bots/haybot",
      },
      {
        name: "Ruins and Warehouses",
        detail:
          "Check damaged crates, ruin chests, lockers, and Warehouse file cabinets while clearing an area.",
      },
    ],
    fieldNotes: [
      "Keep a reserve for interactive parts and crafting stations.",
      "Clear inventory space before opening a long ruin or Warehouse route.",
      "Store boards separately from vehicle fuel and normal building blocks.",
    ],
  },
  "master-battery": {
    summary:
      "The opening route uses two fixed Master Batteries: the nearby ruin battery powers the crashed ship, while the station battery powers the Mechanic Station control panel.",
    locations: [
      {
        name: "Ruin near the Crash Site",
        detail:
          "The Getting Started quest marks the battery used to restore power to the crashed ship.",
        href: "/wiki/quests#getting-started",
      },
      {
        name: "Mechanic Station bunk room",
        detail:
          "The Mechanic Station quest marks a second battery used by the station power slot.",
        href: "/wiki/quests#the-mechanic-station",
      },
    ],
    fieldNotes: [
      "Do not save the Crash Site battery for the Mechanic Station; the station objective marks a second Master Battery.",
      "Follow the active quest marker instead of carrying a battery to an unrelated machine.",
      "Finish nearby combat before moving the progression object.",
      "Do not store it with normal consumable Batteries.",
    ],
  },
  "soil-bag": {
    summary:
      "Starter Soil Bags are placed in early farming areas, while additional soil becomes part of the normal Survival farming supply chain.",
    locations: [
      {
        name: "Crash Site farm tutorial",
        detail:
          "Soil, seeds, a Water Bucket, and a planted Tomato introduce the farming loop beside the nearby pond.",
      },
      {
        name: "Farming patches and supply loot",
        detail:
          "Search small farming structures and farming-related containers when expanding beyond the starter plots.",
      },
    ],
    fieldNotes: [
      "Choose row spacing before placing a large number of plots.",
      "Keep the first plots within easy manual-watering distance.",
      "Leave a service lane for later Vacuum Pump or watering automation.",
    ],
  },
  gasoline: {
    summary:
      "Early Gasoline comes from exploration loot; later supplies can be produced from collected Crude Oil through Survival crafting.",
    locations: [
      {
        name: "Damaged crates and ruins",
        detail:
          "Search the road, early ruins, and other loot containers before the first long vehicle trip.",
      },
      {
        name: "Crude Oil crafting chain",
        detail:
          "Collect oil from underwater deposits and process it through the available crafting recipe.",
        href: "/wiki/resources/oil",
      },
    ],
    fieldNotes: [
      "Plan fuel for the return route, not only the outward journey.",
      "Keep an emergency stack outside the vehicle's normal fuel supply.",
      "Test new vehicles with a small amount before loading the base reserve.",
    ],
  },
  battery: {
    summary:
      "Normal Batteries enter the electrical crafting and loot economy; they are separate from fixed Master Battery quest objects.",
    locations: [
      {
        name: "Exploration containers",
        detail:
          "Search industrial ruins, Warehouses, and electrical loot containers during normal progression.",
      },
      {
        name: "Crafting",
        detail:
          "Use the current Craftbot recipe when a renewable supply is needed for electric systems.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Reserve power for essential transport and recovery.",
      "Size storage after testing the machine's actual consumption.",
      "Label normal Battery storage so it is never confused with story items.",
    ],
  },
  "paint-ammo": {
    summary:
      "Paint Ammo is produced for the Paint Tool rather than gathered as a terrain resource.",
    locations: [
      {
        name: "Craftbot production",
        detail:
          "Use the Paint Ammo recipe after collecting the required Survival materials.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Workshop storage",
        detail:
          "Keep a working supply beside the Paint Tool and any color-sensor test area.",
      },
    ],
    fieldNotes: [
      "Reserve exact colors for Sensor logic when a build depends on them.",
      "Use consistent colors for fuel, water, controls, and hazards.",
      "Paint connection groups before a large build becomes difficult to trace.",
    ],
  },
  fertilizer: {
    summary:
      "Fertilizer appears in farming supplies and can be produced or acquired as the Survival farming chain expands.",
    locations: [
      {
        name: "Crash Site and farming patches",
        detail:
          "Early farming areas can provide a small starter supply beside soil and seeds.",
      },
      {
        name: "Crafting and farming supply routes",
        detail:
          "Use the current recipe or established farming trade supply when larger fields need repeatable stock.",
      },
    ],
    fieldNotes: [
      "Water and plant the row before applying fertilizer.",
      "Use it when faster growth meaningfully shortens exposure or delivery time.",
      "Test automated delivery on one plot before filling a machine.",
    ],
  },
  glowstick: {
    summary:
      "Glowsticks are portable exploration consumables obtained through loot and the Survival crafting supply.",
    locations: [
      {
        name: "Exploration loot",
        detail:
          "Check ruins, industrial areas, and underground-route containers before a dark expedition.",
      },
      {
        name: "Crafting",
        detail:
          "Produce additional Glowsticks when the matching materials and recipe are available.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Mark junctions, drops, and exits rather than every few meters.",
      "Keep part of the stack for the return journey.",
      "Use one consistent side of a tunnel to distinguish the route back.",
    ],
  },
  "structural-blocks": {
    summary:
      "Structural blocks are built from refined resources through hand refinement and Craftbot recipes rather than found as complete vehicle frames.",
    locations: [
      {
        name: "Refined resource chain",
        detail:
          "Process wood, stone, and metal resources into the matching block families.",
        href: "/wiki/resources/wood",
      },
      {
        name: "Craftbot",
        detail:
          "Use the available recipes for higher-grade or specialized structural materials.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Choose material by weight and durability, not appearance alone.",
      "Test the empty chassis before replacing it with heavier blocks.",
      "Keep repair material that matches the important frame sections.",
    ],
  },
  "scrap-wood-block": {
    summary:
      "Scrap Wood Blocks are the early result of refining small wood resources and are commonly used before saw-based forestry is established.",
    locations: [
      {
        name: "Small trees and scrap wood",
        detail:
          "Break early vegetation with the Sledgehammer and refine the recovered resource.",
      },
      {
        name: "Early ruins",
        detail:
          "Existing scrap structures can also provide recyclable building material.",
      },
    ],
    fieldNotes: [
      "Use it for prototypes and temporary shelters.",
      "Replace critical impact areas when stronger material becomes available.",
      "Keep the light weight useful for early vehicles.",
    ],
  },
  "scrap-metal-block": {
    summary:
      "Scrap Metal Blocks come from refined Scrap Metal, most reliably associated with Haybot combat and ruin scavenging.",
    locations: [
      {
        name: "Haybot drops",
        detail:
          "Defeated Haybots always leave a Scrap Metal resource object to refine.",
        href: "/wiki/bots/haybot",
      },
      {
        name: "Ruins",
        detail:
          "Search damaged industrial structures for additional scrap material.",
      },
    ],
    fieldNotes: [
      "Move loose resource objects away from active combat before refining.",
      "Use a Resource Collector when repeated manual carrying becomes slow.",
      "Save stronger refined metal for high-impact frame areas.",
    ],
  },
  "wood-blocks": {
    summary:
      "Standard Wood Blocks are refined from large-tree resources after a Saw Blade makes full forestry possible.",
    locations: [
      {
        name: "Large trees",
        detail:
          "Cut the trunk with a powered Saw Blade, break the logs into resources, and refine them.",
        href: "/wiki/resources/wood",
      },
      {
        name: "Refinebot or hand refining",
        detail:
          "Process collected wood resources at the work site or after transport.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Secure rolling logs before they reach vehicle wheels.",
      "Use a collector truck for repeated forestry runs.",
      "Keep wood away from areas where fire resistance matters.",
    ],
  },
  "metal-blocks": {
    summary:
      "Metal Blocks are refined from mined metal resources and support heavier, more durable vehicle and base construction.",
    locations: [
      {
        name: "Square rock formations",
        detail:
          "Use a Drill to break mineable rock and separate the metal-bearing resource pieces.",
        href: "/wiki/resources/metal",
      },
      {
        name: "Refining",
        detail:
          "Process the collected resource by hand or with a Refinebot.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Account for added mass before rebuilding an entire vehicle in metal.",
      "Concentrate durable material around controls and impact zones.",
      "Retest suspension and engine power after a material upgrade.",
    ],
  },
  "concrete-blocks": {
    summary:
      "Concrete belongs to the stone-and-chemical building chain and is produced for durable stationary construction.",
    locations: [
      {
        name: "Stone mining",
        detail:
          "Drill mineable rock and refine the stone resource needed by the building chain.",
        href: "/wiki/resources/stone",
      },
      {
        name: "Craftbot production",
        detail:
          "Use the matching concrete recipe when its resource requirements are available.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Prefer it for stationary structures where weight is less restrictive.",
      "Keep moving mechanisms separate from heavy wall sections.",
      "Test raid-facing geometry before investing in a large perimeter.",
    ],
  },
  "cardboard-block": {
    summary:
      "Cardboard is a lightweight craftable block used for temporary shapes, tests, and builds that benefit from easy destruction.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce Cardboard Blocks from the current Survival recipe.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Warehouses and packaged structures",
        detail:
          "Cardboard construction and related materials also appear around industrial interiors.",
      },
    ],
    fieldNotes: [
      "Do not treat cardboard as impact protection.",
      "Use it to prototype clearances and disposable mechanisms.",
      "Keep flammability in mind around hazards.",
    ],
  },
  bearing: {
    summary:
      "Bearings are core interactive parts crafted early for steering, wheels, rotating joints, and controller-driven motion.",
    locations: [
      {
        name: "Mini Craftbot",
        detail:
          "The crashed ship tutorial uses early bearings while teaching the first vehicle.",
        href: "/wiki/quests#your-first-car-009fe136",
      },
      {
        name: "Craftbot",
        detail:
          "Produce additional bearings for vehicles and machines at the main workshop.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Inspect rotation arrows before leaving the Lift.",
      "Leave clearance for the full motion range.",
      "Protect bearings that sit on an impact edge.",
    ],
  },
  controller: {
    summary:
      "Controllers are crafted interactive parts used after the basic workshop and electronic material supply are established.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Use Circuit Boards and the current recipe to produce the Controller.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Mechanic Station workshop",
        detail:
          "The station is the practical early base for building and upgrading interactive parts.",
      },
    ],
    fieldNotes: [
      "Test one joint at low speed before sequencing a full machine.",
      "Mark the neutral or safe controller state.",
      "Keep settings accessible after bodywork is added.",
    ],
  },
  piston: {
    summary:
      "Pistons are crafted interactive parts used for controlled linear movement in gates, lifts, tools, and farm machines.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce Pistons through the available interactive-part recipe.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Workshop upgrade chain",
        detail:
          "Use Component Kits when the build requires stronger or more capable part levels.",
        href: "/wiki/resources/component-kit",
      },
    ],
    fieldNotes: [
      "Test full extension without passengers or valuable cargo.",
      "Keep a manual recovery path for a stalled mechanism.",
      "Check collision before increasing force or speed.",
    ],
  },
  "logic-gate": {
    summary:
      "Logic Gates are crafted electronic parts used when several inputs or conditions must control one output.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Build Logic Gates after establishing a supply of electronic crafting materials.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Mechanic Station workshop",
        detail:
          "Use an open wall or test board to keep the first signal paths visible.",
      },
    ],
    fieldNotes: [
      "Write the desired truth states before placing many gates.",
      "Paint input, processing, and output groups differently.",
      "Add a visible reset for memory-based systems.",
    ],
  },
  "gas-engine": {
    summary:
      "Gas Engines are crafted vehicle parts; an early scrap version supports first vehicles before the full upgrade chain.",
    locations: [
      {
        name: "Mini Craftbot and first-car lesson",
        detail:
          "The opening vehicle progression introduces engine-to-seat and engine-to-wheel connections.",
        href: "/wiki/quests#your-first-car-009fe136",
      },
      {
        name: "Craftbot and upgrades",
        detail:
          "Build and improve the engine as the workshop and Component Kit supply expand.",
      },
    ],
    fieldNotes: [
      "Begin at low power and tune with the normal load present.",
      "Carry return-trip Gasoline outside the active fuel supply.",
      "Protect the engine without blocking upgrade access.",
    ],
  },
  "electric-engine": {
    summary:
      "Electric Engines are crafted through the interactive-part chain and use Batteries instead of Gasoline.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Use the available electrical recipe after collecting electronic materials.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Upgrade interface",
        detail:
          "Improve the engine with Component Kits when the machine needs additional capability.",
        href: "/wiki/resources/component-kit",
      },
    ],
    fieldNotes: [
      "Separate power storage from Master Battery quest items.",
      "Test consumption over the real work cycle.",
      "Keep emergency power for recovery.",
    ],
  },
  thruster: {
    summary:
      "Thrusters are advanced crafted interactive parts powered by Gasoline and commonly used after the basic vehicle economy is stable.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce a Thruster through the available interactive-part recipe.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Upgrade chain",
        detail:
          "Use Component Kits for stronger levels rather than multiplying poorly controlled thrusters.",
      },
    ],
    fieldNotes: [
      "Test thrust on the Lift with the area clear.",
      "Place fuel and mass around the intended center of thrust.",
      "Add an unmistakable master stop.",
    ],
  },
  "drivers-seat": {
    summary:
      "Driver's Seats are crafted control parts; early vehicle lessons introduce their steering and engine connections.",
    locations: [
      {
        name: "First-car progression",
        detail:
          "The tutorial asks the player to place a seat and connect it to steering bearings and an engine.",
        href: "/wiki/quests#your-first-car-009fe136",
      },
      {
        name: "Craftbot",
        detail:
          "Produce replacement and upgraded control seats at the workshop.",
      },
    ],
    fieldNotes: [
      "Keep the seat inside the wheelbase and away from tool impacts.",
      "Verify every bearing direction before road testing.",
      "Leave an exit path that bodywork cannot block.",
    ],
  },
  switch: {
    summary:
      "Switches and Buttons are basic crafted controls used throughout vehicles, doors, farm machines, and logic systems.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce controls through the normal electronic-part recipes.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Workshop test board",
        detail:
          "Keep spare controls near logic experiments so temporary inputs remain identifiable.",
      },
    ],
    fieldNotes: [
      "Use a Button for momentary input and a Switch for retained state.",
      "Label controls before several similar switches accumulate.",
      "Place emergency stops away from the moving hazard.",
    ],
  },
  sensor: {
    summary:
      "Sensors are crafted interactive parts used for detection, color checks, automatic doors, and triggered defenses.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Build Sensors through the electronic interactive-part recipe chain.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Upgrade interface",
        detail:
          "Use Component Kits when the build requires greater detection capability.",
      },
    ],
    fieldNotes: [
      "Test detection height against the real target.",
      "Keep the sensor cone clear of the machine itself.",
      "Verify multiplayer traffic before trusting an automated door.",
    ],
  },
  suspension: {
    summary:
      "Sport and Off-Road Suspension parts are crafted for vehicles and tuned after the chassis is tested under its normal load.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce suspension through the vehicle-part recipe chain.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Vehicle workshop",
        detail:
          "Tune ride height and stiffness on a repeatable obstacle with cargo loaded.",
      },
    ],
    fieldNotes: [
      "Change one axle at a time.",
      "Leave room for full wheel travel.",
      "Retest after adding armor, tools, or cargo.",
    ],
  },
  "vacuum-pump": {
    summary:
      "Vacuum Pumps are crafted interactive parts used with containers and pipes for water, chemicals, crops, seeds, and item transfer.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce the pump and required pipe parts at the workshop.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Farm or liquid source",
        detail:
          "Install only after confirming the intended In or Out path and connected storage.",
      },
    ],
    fieldNotes: [
      "Test one item or one water cycle first.",
      "Mark pump direction beside the control.",
      "Stop the machine before changing pipes or storage.",
    ],
  },
  "water-system": {
    summary:
      "Water Cannons and Water Containers are crafted farm-system parts connected to pumps and controls.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce the container, cannon, pump, and pipe parts through their available recipes.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Natural water source",
        detail:
          "Submerge the intake pump and connect it to the container before testing delivery.",
      },
    ],
    fieldNotes: [
      "Confirm supply before debugging the moving watering arm.",
      "Keep a Water Bucket for manual recovery.",
      "Test crop coverage on one row.",
    ],
  },
  "large-chest": {
    summary:
      "Large Chests are crafted storage parts used once the workshop can support larger organized inventories and connected machines.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Build the chest through its storage-part recipe.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Base and vehicle storage",
        detail:
          "Mount it low and keep the opening accessible in the loaded configuration.",
      },
    ],
    fieldNotes: [
      "Separate fuel, electronics, seeds, and quest items.",
      "Retest vehicle balance after loading.",
      "Keep machine input and output chests clearly labeled.",
    ],
  },
  "crafting-bots": {
    summary:
      "Crafting stations are created and unlocked through early Mechanic Station progression, then placed at the player's workshop.",
    locations: [
      {
        name: "Mechanic Station",
        detail:
          "Restore station power and use its progression facilities to establish the main crafting chain.",
        href: "/wiki/quests#the-mechanic-station",
      },
      {
        name: "Player base",
        detail:
          "Place bots with room for upgrades, input access, and connected storage.",
      },
    ],
    fieldNotes: [
      "Do not wall in upgrade and connection points.",
      "Separate food, refining, clothing, and construction workflows.",
      "Check schematic progression when a remembered recipe is locked.",
    ],
  },
  "connect-tool": {
    summary:
      "The Connect Tool is crafted during the opening ship objective and remains the primary way to inspect interactive connections.",
    locations: [
      {
        name: "Crashed ship Mini Craftbot",
        detail:
          "Getting Started asks the player to craft the tool and reconnect the ship console.",
        href: "/wiki/quests#getting-started",
      },
      {
        name: "Player tool inventory",
        detail:
          "Once acquired, keep it available for vehicle, logic, and machine diagnosis.",
      },
    ],
    fieldNotes: [
      "Inspect bearing arrows before the first road test.",
      "Stand where the complete signal path is visible.",
      "Paint dense connection groups before troubleshooting.",
    ],
  },
  lift: {
    summary:
      "The Lift is a core mechanic tool available for placing, raising, testing, and recovering creations rather than normal world loot.",
    locations: [
      {
        name: "Mechanic tool set",
        detail:
          "Use it from the standard tool inventory when beginning a creation.",
      },
      {
        name: "Recovery site",
        detail:
          "Place it under a stranded or rolled vehicle when terrain and clearance allow.",
      },
    ],
    fieldNotes: [
      "Keep the placement point clear on important vehicles.",
      "Test moving parts before removing the creation from the Lift.",
      "Do not block a recovery angle with permanent bodywork.",
    ],
  },
  sledgehammer: {
    summary:
      "The Sledgehammer is a standard starting tool used for early combat, breaking scrap, and gathering small wood resources.",
    locations: [
      {
        name: "Starting tool inventory",
        detail:
          "It is available from the beginning of Survival rather than earned from a chest.",
      },
      {
        name: "Quest schematic variant",
        detail:
          "The side quest Every Bot Looks Like a Nail concerns building a Sledgehammer for a Farmer.",
        href: "/wiki/quests#every-bot-looks-like-a-nail",
      },
    ],
    fieldNotes: [
      "Separate the player's permanent tool from quest construction requirements.",
      "Use spacing and attack timing against Haybots.",
      "Move gathered resources out of combat paths.",
    ],
  },
  "weld-tool": {
    summary:
      "The Weld Tool is crafted through the workshop tool chain and used to attach loose creations or modules.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce it through the available tool recipe after collecting electronic materials.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Workshop",
        detail:
          "Keep clear weld points on modular vehicles and repairable machines.",
      },
    ],
    fieldNotes: [
      "Confirm orientation before final attachment.",
      "Leave a visible module boundary.",
      "Test the joined creation on the Lift.",
    ],
  },
  "paint-tool": {
    summary:
      "The Paint Tool is crafted through the workshop tool chain and consumes Paint Ammo in Survival.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce the tool when the required electronic crafting supply is available.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Workshop labeling station",
        detail:
          "Store it with Paint Ammo near machines that use functional color coding.",
      },
    ],
    fieldNotes: [
      "Reserve colors for inputs, outputs, fuel, water, and hazards.",
      "Use high contrast around moving edges.",
      "Keep color-sensor targets consistent.",
    ],
  },
  handbook: {
    summary:
      "The Handbook is an in-game reference opened from its assigned control rather than a collectible world object.",
    locations: [
      {
        name: "Player interface",
        detail:
          "Open the Handbook from the configured control to review building instructions.",
      },
      {
        name: "Early building sequence",
        detail:
          "Use it alongside the first vehicle lesson and basic connection tutorials.",
        href: "/wiki/quests#your-first-car-009fe136",
      },
    ],
    fieldNotes: [
      "Check current controls if the default key has been rebound.",
      "Use the live Connect Tool view for the creation's actual wiring.",
      "Treat the Handbook as a starting reference, then test the real build.",
    ],
  },
  claygun: {
    summary:
      "The Claygun belongs to terrain-editing and Creative-oriented tooling rather than the normal Survival loot and crafting loop.",
    locations: [
      {
        name: "Creative tool access",
        detail:
          "Use it in the supported creation or terrain-editing context where the tool is available.",
      },
      {
        name: "Not standard Survival loot",
        detail:
          "Do not search Survival ruins or bot drops for this tool.",
      },
    ],
    fieldNotes: [
      "Confirm the active game mode before following tool instructions.",
      "Back up editable worlds before broad terrain changes.",
      "Keep Survival acquisition advice separate from Creative tools.",
    ],
  },
  spudgun: {
    summary:
      "In the 1.0 quest progression, the Spud Gun schematic is awarded during the Watchtower rebuilding chain and then used as a crafting unlock.",
    locations: [
      {
        name: "Home is Where Your Couch Is",
        detail:
          "Complete the main quest to receive the Spud Gun schematic reward.",
        href: "/wiki/quests#home-is-where-your-couch-is",
      },
      {
        name: "Farmers Hideout progression",
        detail:
          "The established Survival trading route remains important for weapons, crops, and Farmer progression.",
      },
    ],
    fieldNotes: [
      "Carry Potatoes as ammunition.",
      "Keep a close-range fallback tool.",
      "Confirm the schematic unlock before diagnosing a missing recipe.",
    ],
  },
  "spud-shotgun": {
    summary:
      "The Spud Shotgun is a later Survival weapon associated with Farmers Hideout trading and high-value crop progression.",
    locations: [
      {
        name: "Farmers Hideout trader",
        detail:
          "Bring the requested packed produce and rescued Farmer requirements for the relevant weapon trade.",
      },
      {
        name: "Warehouse crop progression",
        detail:
          "Broccoli and Pineapple supply chains support the late weapon trades.",
        href: "/wiki/crops/broccoli",
      },
    ],
    fieldNotes: [
      "Use it where close-range spread is an advantage.",
      "Plan ammunition before entering a Warehouse.",
      "Secure the trade cargo route first.",
    ],
  },
  "spudling-gun": {
    summary:
      "The Spudling Gun is a later Survival weapon obtained through the Farmers Hideout's advanced produce-trading progression.",
    locations: [
      {
        name: "Farmers Hideout trader",
        detail:
          "Complete the required high-value crop and rescued-Farmer trade chain.",
      },
      {
        name: "Warehouse crops",
        detail:
          "Warehouse exploration unlocks the Broccoli and Pineapple farming supply used by advanced trades.",
        href: "/wiki/crops/pineapple",
      },
    ],
    fieldNotes: [
      "Its fire rate increases Potato consumption.",
      "Carry a separate ammunition reserve for the return route.",
      "Use controlled bursts when full output is unnecessary.",
    ],
  },
  "mountable-spudgun": {
    summary:
      "The Mountable Spudgun is a crafted creation part used in vehicle and base defenses after its recipe is available.",
    locations: [
      {
        name: "Craftbot",
        detail:
          "Produce the mountable weapon through the appropriate recipe and schematic state.",
        href: "/wiki/parts/crafting-bots",
      },
      {
        name: "Vehicle or defense platform",
        detail:
          "Install with a protected ammunition supply and deliberate trigger.",
      },
    ],
    fieldNotes: [
      "Check Sensor height against bot bodies.",
      "Prevent the weapon from firing into the creation.",
      "Provide a manual disable for maintenance.",
    ],
  },
  cornade: {
    summary:
      "The Cornade belongs to the 1.0 recipe-unlock and crafting progression rather than ordinary early-world loot.",
    locations: [
      {
        name: "Schematic progression",
        detail:
          "Unlock the relevant recipe through current 1.0 progression before checking the Craftbot.",
        href: "/wiki/schematics",
      },
      {
        name: "Craftbot",
        detail:
          "Produce the throwable weapon after its recipe and required materials are available.",
      },
    ],
    fieldNotes: [
      "Test blast behavior away from crops, vehicles, and storage.",
      "Keep throwables separate from normal food supplies.",
      "Confirm the current patch if the recipe remains locked.",
    ],
  },
  "component-kit": {
    summary:
      "Component Kits are combat and loot rewards used to upgrade interactive parts and unlock workshop bots.",
    locations: [
      {
        name: "Bot drops",
        detail:
          "Totebots, Haybots, and Farmbots can drop Component Kits.",
        href: "/wiki/bots/haybot",
      },
      {
        name: "Damaged crates and ruins",
        detail:
          "Search combat areas and exploration containers for additional kits.",
      },
    ],
    fieldNotes: [
      "Save kits for an upgrade that fixes a measured limitation.",
      "Avoid spending the entire reserve on one prototype.",
      "Keep a workshop stock for essential vehicle repairs.",
    ],
  },
  "scrap-metal": {
    summary:
      "Scrap Metal is most reliably obtained as the resource object left by defeated Haybots and can also appear around ruins.",
    locations: [
      {
        name: "Haybots",
        detail:
          "Each defeated Haybot leaves Scrap Metal that can be carried and refined.",
        href: "/wiki/bots/haybot",
      },
      {
        name: "Ruins",
        detail:
          "Industrial scrap areas can provide additional recoverable material.",
      },
    ],
    fieldNotes: [
      "Move the resource out of the combat route before refining.",
      "Use a Resource Collector for repeated runs.",
      "Refine into Scrap Metal Blocks for early durable construction.",
    ],
  },
  wood: {
    summary:
      "Standard Wood resources come from large trees that require a powered Saw Blade rather than the starting Sledgehammer.",
    locations: [
      {
        name: "Large forests and mature trees",
        detail:
          "Cut trunks with a Saw Blade, break the logs into resources, and collect them.",
      },
      {
        name: "Refining",
        detail:
          "Process resources by hand or with a Refinebot into Wood Blocks.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Control rolling logs before they strike wheels.",
      "Keep the saw head visible from the driver's seat.",
      "Unload before cargo removes steering authority.",
    ],
  },
  stone: {
    summary:
      "Stone resources are mined from square rock formations with a Drill and refined for construction.",
    locations: [
      {
        name: "Mineable rock formations",
        detail:
          "Use a powered Drill to split the deposit and separate stone resource pieces.",
      },
      {
        name: "Refining",
        detail:
          "Collect and process the resources by hand or with a Refinebot.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Control tool pressure instead of ramming the formation.",
      "Keep loose pieces away from the steering axle.",
      "Plan collection before beginning a large deposit.",
    ],
  },
  metal: {
    summary:
      "Metal resources are separated from drilled rock deposits and refined into stronger structural material.",
    locations: [
      {
        name: "Mineable rock formations",
        detail:
          "Break square rock deposits with a Drill and collect the metal-bearing resources.",
      },
      {
        name: "Refining",
        detail:
          "Use hand refining or a Refinebot before building with the material.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Expect loaded mining vehicles to steer differently.",
      "Secure refined material low in the chassis.",
      "Use durable metal where impact protection matters most.",
    ],
  },
  chemicals: {
    summary:
      "Chemicals come from the bright pools at Chemical Lakes and can be collected manually or pumped into connected storage.",
    locations: [
      {
        name: "Chemical Lakes",
        detail:
          "Identify the pink pool and green-black industrial tanks; avoid standing in the damaging liquid.",
      },
      {
        name: "Bucket or Vacuum Pump",
        detail:
          "Fill a bucket manually or submerge a pump connected to suitable storage.",
        href: "/wiki/parts/vacuum-pump",
      },
    ],
    fieldNotes: [
      "Approach from safe ground.",
      "Mark the lake for future supply runs.",
      "Confirm container routing before leaving a pump running.",
    ],
  },
  oil: {
    summary:
      "Crude Oil is collected from underwater deposits and supports Gasoline and other crafting chains.",
    locations: [
      {
        name: "Underwater oil deposits",
        detail:
          "Search beneath natural water and collect the visible oil resource nodes.",
      },
      {
        name: "Crafting chain",
        detail:
          "Process the recovered oil through the current recipes for fuel and materials.",
        href: "/wiki/items/gasoline",
      },
    ],
    fieldNotes: [
      "Watch the air meter during repeated collection dives.",
      "Mark a productive water location.",
      "Carry enough fuel to return before depending on newly gathered oil.",
    ],
  },
  cotton: {
    summary:
      "Cotton is gathered from wild cotton plants most commonly associated with autumn-colored forest biomes.",
    locations: [
      {
        name: "Autumn forest",
        detail:
          "Search orange-leaf woodland and collect mature cotton plants.",
      },
      {
        name: "Farm and clothing supply",
        detail:
          "Store gathered Cotton for recipes and Dressbot-related progression.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "Mark productive forest areas for later runs.",
      "Keep clothing material separate from building resources.",
      "Plan cargo space before a long gathering route.",
    ],
  },
  tomato: {
    summary:
      "Tomatoes and Tomato Seeds appear in the starter farming area and remain a core crop for food and Packing Station deliveries.",
    locations: [
      {
        name: "Crash Site farm tutorial",
        detail:
          "A planted Tomato and nearby seeds introduce harvesting and replanting beside the pond.",
      },
      {
        name: "Farming and loot",
        detail:
          "Harvested crops return seeds, while farm structures and containers can expand the supply.",
      },
    ],
    fieldNotes: [
      "Reserve seeds before packing the harvest.",
      "Use straight rows for later automation.",
      "The early vegetable Packing Station accepts Tomatoes.",
    ],
  },
  carrot: {
    summary:
      "Carrot Seeds are available through early farming supplies and normal crop-loot progression.",
    locations: [
      {
        name: "Crash Site and farming patches",
        detail:
          "Check seed supplies beside early soil plots and small meadow farms.",
      },
      {
        name: "Harvest cycle",
        detail:
          "Mature Carrots provide food and replacement seeds for continued planting.",
      },
    ],
    fieldNotes: [
      "Keep the next planting supply before trading or eating the harvest.",
      "Carrots belong to the vegetable Packing Station route.",
      "Match row spacing to the watering method.",
    ],
  },
  redbeet: {
    summary:
      "Redbeet Seeds enter through early farming supplies and can be sustained by harvesting mature crops.",
    locations: [
      {
        name: "Starter farming areas",
        detail:
          "Search Crash Site supplies and farming patches for seeds.",
      },
      {
        name: "Harvest cycle",
        detail:
          "Replant part of every crop return to maintain the seed reserve.",
      },
    ],
    fieldNotes: [
      "Separate food stock from trade stock.",
      "Redbeets use the vegetable Packing Station route.",
      "Protect seeds away from the active crop line.",
    ],
  },
  potato: {
    summary:
      "Potatoes are grown from seeds found through farming and exploration, then used both as food and Spud weapon ammunition.",
    locations: [
      {
        name: "Farm supply and loot",
        detail:
          "Search farming structures and containers for Potato Seeds.",
      },
      {
        name: "Player farm",
        detail:
          "Maintain a dedicated ammunition crop once Spud weapons become important.",
        href: "/wiki/weapons/spudgun",
      },
    ],
    fieldNotes: [
      "Do not consume the entire ammunition crop as food.",
      "Keep seed, food, and combat reserves separate.",
      "Scale production before Warehouse combat.",
    ],
  },
  "cotton-crop": {
    summary:
      "Cotton can be cultivated after obtaining its seed supply, providing a farm-based alternative to repeated wild gathering.",
    locations: [
      {
        name: "Wild Cotton supply",
        detail:
          "Begin with Cotton gathered from autumn forest areas.",
        href: "/wiki/resources/cotton",
      },
      {
        name: "Player farm",
        detail:
          "Plant the available Cotton Seeds in watered soil and preserve replacements.",
      },
    ],
    fieldNotes: [
      "Grow it when clothing demand justifies a dedicated row.",
      "Keep wild-gathered and planted supply organized.",
      "Include Cotton rows in the same watering plan as other crops.",
    ],
  },
  banana: {
    summary:
      "Bananas are later fruit crops connected to fruit-seed exploration and the fruit Packing Station trade route.",
    locations: [
      {
        name: "Fruit seed progression",
        detail:
          "Search higher-value farming loot and progression areas for the initial seed supply.",
      },
      {
        name: "Fruit Packing Station",
        detail:
          "Pack harvested Bananas for Farmer trading and delivery logistics.",
      },
    ],
    fieldNotes: [
      "Reserve seeds before packing the crop.",
      "Use a cargo route tested without valuable crates.",
      "Keep fruit and vegetable station destinations distinct.",
    ],
  },
  blueberry: {
    summary:
      "Blueberries are later fruit crops grown from acquired seeds and used in the fruit Packing Station economy.",
    locations: [
      {
        name: "Fruit seed progression",
        detail:
          "Obtain the first seeds through later farming exploration and loot.",
      },
      {
        name: "Fruit Packing Station",
        detail:
          "Deliver mature fruit through the correct station and trader route.",
      },
    ],
    fieldNotes: [
      "Preserve a replanting reserve.",
      "Separate delivery cargo from food stock.",
      "Protect the field according to its active crop value.",
    ],
  },
  orange: {
    summary:
      "Oranges are later fruit crops supported by acquired seeds and the fruit Packing Station route.",
    locations: [
      {
        name: "Fruit seed progression",
        detail:
          "Search later farming and exploration rewards for the initial seed supply.",
      },
      {
        name: "Fruit Packing Station",
        detail:
          "Use packed Orange crates in Farmers Hideout trade progression.",
      },
    ],
    fieldNotes: [
      "Keep enough seeds to restore the row after a delivery.",
      "Test the hauler route before loading crates.",
      "Do not confuse the fruit and vegetable Packing Stations.",
    ],
  },
  broccoli: {
    summary:
      "Broccoli and its seeds are high-value Warehouse rewards used for advanced farming and weapon trades.",
    locations: [
      {
        name: "Warehouse upper floors",
        detail:
          "Clear a Warehouse and search the reward area for Broccoli and its seed supply.",
      },
      {
        name: "Farmers Hideout trade",
        detail:
          "Pack the harvest for advanced weapon and progression trades.",
        href: "/wiki/weapons/spud-shotgun",
      },
    ],
    fieldNotes: [
      "Bring adequate Potato ammunition into the Warehouse.",
      "Preserve the first seeds before trading the crop.",
      "Plan for the crop's higher watering requirement.",
    ],
  },
  pineapple: {
    summary:
      "Pineapple and its seeds are high-value Warehouse rewards tied to advanced fruit farming and weapon trades.",
    locations: [
      {
        name: "Warehouse upper floors",
        detail:
          "Clear the interior and reach the reward area to obtain the first fruit and seeds.",
      },
      {
        name: "Farmers Hideout trade",
        detail:
          "Use packed Pineapple crates in advanced trading progression.",
        href: "/wiki/weapons/spudling-gun",
      },
    ],
    fieldNotes: [
      "Reserve the initial seeds.",
      "Plan for two waterings unless the crop is fertilized.",
      "Secure the Warehouse return route before carrying rare seeds.",
    ],
  },
  haybot: {
    summary:
      "Haybots roam fields and ruins and also attack active farms during raids.",
    locations: [
      {
        name: "Fields and ruins",
        detail:
          "Expect patrols around agricultural terrain and broken structures.",
      },
      {
        name: "Farm raids",
        detail:
          "Active crops can attract Haybots as the raid level increases.",
      },
    ],
    fieldNotes: [
      "Defeated Haybots leave Scrap Metal and can drop Circuit Boards or Component Kits.",
      "Use distance and attack timing when fighting with the Sledgehammer.",
      "Water briefly stuns them.",
    ],
  },
  farmbot: {
    summary:
      "Farmbots are dangerous heavy enemies found in the world and higher-threat farm encounters.",
    locations: [
      {
        name: "Agricultural world areas",
        detail:
          "Watch large open fields and industrial farming terrain for patrols.",
      },
      {
        name: "High-threat raids",
        detail:
          "Valuable or extensive farms can escalate into encounters with heavier bots.",
      },
    ],
    fieldNotes: [
      "Fight from prepared terrain with a reliable ranged weapon.",
      "Their drops support high-level crafting and progression.",
      "Do not lead one directly into storage and crop rows.",
    ],
  },
  totebot: {
    summary:
      "Green Totebots are common early enemies around ruins, roads, fields, and farm raids.",
    locations: [
      {
        name: "Ruins and roadsides",
        detail:
          "Expect Totebots near loot structures and along early exploration routes.",
      },
      {
        name: "Farm raids",
        detail:
          "They form part of the lower raid tiers around active crops.",
      },
    ],
    fieldNotes: [
      "They can drop Circuit Boards and Component Kits.",
      "Collect heads when a quest or decorative build asks for them.",
      "Clear small groups before opening containers.",
    ],
  },
  tapebot: {
    summary:
      "Tapebots are ranged Warehouse enemies concentrated inside industrial dungeon floors.",
    locations: [
      {
        name: "Warehouses",
        detail:
          "Expect them in corridors, offices, and open interior spaces after using a Warehouse Key.",
      },
      {
        name: "Warehouse approach",
        detail:
          "Prepare ammunition, healing food, and cover before entering.",
      },
    ],
    fieldNotes: [
      "Their tape projectiles are extremely dangerous.",
      "Use cover and avoid crossing large open rooms carelessly.",
      "Clear the return path before carrying rare crops or loot.",
    ],
  },
  "red-explosive-totebot": {
    summary:
      "Red explosive Totebots belong to the expanded 1.0 enemy roster and appear in higher-risk progression areas.",
    locations: [
      {
        name: "1.0 progression zones",
        detail:
          "Expect them where the new story and underground combat increase enemy variety.",
      },
      {
        name: "Confined combat routes",
        detail:
          "Give explosive enemies more space than ordinary Totebots.",
      },
    ],
    fieldNotes: [
      "Do not fight beside valuable machinery or storage.",
      "Use range and terrain to control the blast risk.",
      "Check the active route before backing away.",
    ],
  },
  minerbot: {
    summary:
      "Minerbots belong to the 1.0 mining and underground progression rather than ordinary early meadow patrols.",
    locations: [
      {
        name: "Mining progression",
        detail:
          "Encounter them as the story moves through the Mining Hub and underground facilities.",
        href: "/wiki/quests#the-mining-hub",
      },
      {
        name: "Underground routes",
        detail:
          "Prepare for limited space, industrial hazards, and repeated combat states.",
      },
    ],
    fieldNotes: [
      "Carry light and a clear return route.",
      "Avoid placing the player between the bot and an environmental hazard.",
      "Treat unfamiliar attacks as a reason to create distance first.",
    ],
  },
  woc: {
    summary:
      "Wocs roam grassy farming areas and can be kept near a base when a renewable milk supply is useful.",
    locations: [
      {
        name: "Meadows and fields",
        detail:
          "Look for Wocs grazing in open agricultural terrain.",
      },
      {
        name: "Player-built pen",
        detail:
          "A controlled pen can keep a nearby Woc accessible without blocking vehicles or crops.",
      },
    ],
    fieldNotes: [
      "Feed Corn to receive Woc Milk.",
      "Build enough space that the animal does not jam a gate.",
      "The Heart of Corn and Home is Where the Woc Is quests also feature Wocs.",
    ],
  },
  glowbug: {
    summary:
      "Glowbs live in darker natural areas and can be fed Cardboard as part of their resource interaction and side quest.",
    locations: [
      {
        name: "Dark cave-like areas",
        detail:
          "Search shaded and subterranean terrain for the glowing creature.",
      },
      {
        name: "Cardboard Munchies",
        detail:
          "The creature-request quest asks the player to bring Cardboard to a hungry Glowb.",
        href: "/wiki/quests#cardboard-munchies",
      },
    ],
    fieldNotes: [
      "Carry Cardboard separately from structural materials.",
      "Mark the route back out of dark areas.",
      "Do not block the creature with a vehicle while interacting.",
    ],
  },
  "schematic-box": {
    summary:
      "The most predictable supply is the Farmers Hideout exchange: 1 Broccoli Crate buys 5 Schematic Boxes, and each box can be spent on one random eligible unlock.",
    locations: [
      {
        name: "Farmers Hideout",
        detail:
          "Trade 1 Broccoli Crate for 5 Schematic Boxes. Two exchanges fill the 10-box maximum stack.",
        href: "/wiki/trades?q=Schematic%20box",
      },
      {
        name: "Tapebots and loot crates",
        detail:
          "Standard and Red Tapebots have a 25% chance to drop 1 box. Crate chances range from 13.33% in common surface or underground crates to 16.67% in Common Warehouse and higher-tier crates.",
        href: "/wiki/bots/tapebot",
      },
      {
        name: "Minidungeon Interior 03",
        detail:
          "This specific interior layout contains 2 placed Schematic Boxes. Procedural generation determines whether the layout appears on a route.",
      },
      {
        name: "Schematicbot",
        detail:
          "This fixed station is where a box is consumed. One completed scan selects one recipe from the remaining eligible random pool.",
        href: "/wiki/schematics/schematicbot",
      },
    ],
    fieldNotes: [
      "Bring 2 Broccoli Crates when the goal is one full 10-box stack.",
      "A box is only offered at the station while random-pool recipes remain.",
      "Do not expect a box to select a trader, quest, Growlab, or treasure recipe.",
    ],
  },
  schematicbot: {
    summary:
      "The Schematicbot is a fixed world station. It is not crafted, stored in the inventory, carried on the Lift, or moved into a player workshop.",
    locations: [
      {
        name: "Surface Kiosk layouts",
        detail:
          "Both current Kiosk layout variants contain a placed Schematicbot. A generated world can reuse a layout, so the number of reachable stations is world-dependent.",
      },
      {
        name: "Mining Hub main area",
        detail:
          "The Mining Hub main layout contains another fixed Schematicbot for underground progression.",
        href: "/wiki/quests#the-mining-hub",
      },
      {
        name: "Scan interface",
        detail:
          "The interface presents three eligible inputs at a time. Choose a part for its exact recipe or a box for a random eligible recipe.",
      },
      {
        name: "After the scan",
        detail:
          "Complete the final unlock action, then open the Craftbot or Saw Table to use the new recipe with its normal ingredients.",
        href: "/wiki/parts/crafting-bots",
      },
    ],
    fieldNotes: [
      "A blue-icon part remains in the inventory after an exact scan.",
      "A random scan consumes 1 Schematic Box.",
      "The scan takes about 2 seconds before the final unlock action appears.",
    ],
  },
};
