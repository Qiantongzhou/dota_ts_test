

/**
 * Turn a table object into an array.
 * @param obj The object to transform to an array.
 * @returns An array with items of the value type of the original object.
 */
function toArray<T>(obj: Record<number, T>): T[] {
    const result = [];
    
    let key = 1;
    while (obj[key]) {
        result.push(obj[key]);
        key++;
    }

    return result;
}

async function sleep(time: number): Promise<void> {
    return new Promise<void>((resolve) => $.Schedule(time, resolve));
}
/// <reference path="panels.d.ts" />


function create<K extends keyof PanoramaPanelNameMap>(
    type: K, parent: Panel, id: string
): PanoramaPanelNameMap[K] {
    const panel = $.CreatePanel(type as string, parent, id) as PanoramaPanelNameMap[K];
    return panel;
}

/** -------- boot ---------- */
const rootHub = $.GetContextPanel();
rootHub.RemoveAndDeleteChildren();           // hot-reload friendly
rootHub.style.flowChildren      = "down";
rootHub.style.width             = "100%";
rootHub.style.height            = "100%";
rootHub.style.backgroundColor   = "rgba(0,0,0,0.0)";

/* ---------------- 1. TOP BAR : divided into 5 lanes ---------------- */
const topBarHub = create("Panel", rootHub, "TopBar");
topBarHub.style.width          = "100%";
topBarHub.style.height         = "10%";
topBarHub.style.flowChildren   = "right";   // children line up horizontally
topBarHub.style.horizontalAlign= "center";
topBarHub.style.margin         = "8px 0";

/** helper – makes a lane that always takes 20 % width */
function makeLane(idx: number): Panel {
    const p = create("Panel", topBarHub, `Lane${idx}`);
    p.style.width  = "10%";                // five equal parts
    p.style.height = "100%";
    p.style.flowChildren = "right";        // widgets inside line up too
    p.style.horizontalAlign = "center";
    p.style.verticalAlign   = "center";
    return p;
}

/* create the five lanes */
const [lane1, lane2, lane3, lane4, lane5, lane6, lane7, lane8, lane9, lane10] =
    [1,2,3,4,5,6,7,8,9,10].map(makeLane);

/* put the label + timer in the 4th lane ----------------------------- */

const bossLbl  = create("Label", lane9, "BossLabel");
bossLbl.text   = "Next boss in";
bossLbl.style.color            = "#DDD";
bossLbl.style.fontSize         = "18px";
bossLbl.style.horizontalAlign  = "center";   // centre inside lane
bossLbl.style.zIndex          =2;
const timerBar = create("ProgressBar", lane9, "BossTimer");
timerBar.min   = 0;
timerBar.max   = 600;
timerBar.value = timerBar.max;
timerBar.style.width           = "260px";
timerBar.style.height          = "20px";
timerBar.style.horizontalAlign = "right";
timerBar.style.zIndex          =1;

/* (Optional) lane placeholders – remove when you populate them */
[lane1,lane2,lane3,lane5].forEach(l => {
    l.AddClass("LanePlaceholder"); // CSS can give a faint outline
});


/** server → client event payload  */
interface BossTimerUpdate { remaining: number }   // secs

GameEvents.Subscribe<BossTimerUpdate>("boss_timer_update", ({ remaining }) => {
    timerBar.value = remaining;
    timerBar.max   = 600;                        // keep in sync in case you change interval
});

/* ---------------- 2. TABS -------------------- */
const tabRow = create("Panel", rootHub, "TabRow");
tabRow.style.flowChildren    = "right";
tabRow.style.horizontalAlign = "center";
tabRow.style.marginTop       = "10px";

/** stash of the centre panels so we can hide/show */
const centre: Record<string, Panel> = {};

/** creates a button & a correspondingly stacked panel  */
/* ---------------------------------------------------- */
/* 1. keep a handle to the “currently open” tab name    */
let currentTab: string | null = null;



/* ---------------------------------------------------- */
/** creates a button & a correspondingly stacked panel  */
function makeTab(tabName: string, snippetName: string) {

    /* ----------  BUTTON  ---------- */
    const btn = create("Button", lane2, `Btn${tabName}`);
    btn.style.width           = "42px";
    btn.style.height          = "32px";
    // base look
    btn.style.backgroundColor = "gradient( linear, 0% 0%, 0% 100%, from( #222 ), to( #111 ) )";
    btn.style.border          = "1px solid #444";
    btn.style.borderRadius    = "6px";
    btn.style.transition      = "brightness 0.08s ease-in-out 0s";  // smooth glow

    /* label inside the button */
    const lbl = create("Label", btn, "");
    lbl.text                = tabName;
    lbl.style.fontSize      = "16px";
    lbl.style.color         = "#FFF";
    lbl.style.horizontalAlign = lbl.style.verticalAlign = "center";

    /*  ----------  HOVER & ACTIVE effect  ---------- */
    // brighten on hover
    btn.SetPanelEvent("onmouseover", () => {
        btn.style.brightness = "1.35";
    });
    // restore when mouse leaves (unless it’s the active tab)
    btn.SetPanelEvent("onmouseout", () => {
        btn.style.brightness = (currentTab === tabName) ? "1.35" : "1.0";
    });

    /* ----------  CLICK → switch panel  ---------- */
    btn.SetPanelEvent("onactivate", () => {
        switchPanel(tabName);           // built-in page swap
        Game.EmitSound("ui_generic_button_click");   // optional click sound

        /* If other scripts need a signal, broadcast a local event:   */
        $.DispatchEvent("HubTabChanged", tabName);   // other TS files can subscribe
    });

    /* ----------  PAGE PANEL (initially hidden)  ---------- */
    const pnl = create("Panel", centreContainer, `${tabName}Panel`);
    pnl.style.width  = "100%";
    pnl.style.height = "100%";
    pnl.visible      = false;

    if (pnl.BHasLayoutSnippet(snippetName)) {
        pnl.BLoadLayoutSnippet(snippetName);
    }

    centre[tabName] = pnl;
}


/* all centre panels are *stacked* on top of each other; only one visible */
const centreContainer = create("Panel", rootHub, "CentreContainer");
centreContainer.style.flowChildren = "right";
centreContainer.style.width        = "100%";
centreContainer.style.height       = "fill-parent-flow(1)";
centreContainer.style.marginTop    = "8px";

/** show one panel, hide the others */
function switchPanel(name: string) {
    Object.entries(centre).forEach(([k, p]) => p.visible = (k === name));
}

/* --------------- create tabs in the order you want -------------- */
makeTab("Bosses",   "BossListSnippet");     // your BossList.ts controls this snippet
makeTab("Shop",     "ShopSnippet");         // your Shop.ts   controls this snippet
makeTab("Settings", "SettingsSnippet");     // your Settings.ts controls this snippet
switchPanel("Bosses");                      // default tab

/* --------------- 3. Local fallback timer (optional) -------------- */
/* If the server hasn’t yet started emitting boss_timer_update events
   we tick client-side so the bar isn’t stuck at 100%. */
let local = timerBar.max;
function clientTick() {
    if (local > 0) {
        local -= 0.1;
        timerBar.value = local;
        $.Schedule(0.1, clientTick);
    }
}
clientTick();

/* --------------- 4. API for other scripts ------------------------ */
/** Other TS files can simply call:
 *     GameEvents.SendCustomGameEventToServer("hub_switch_panel", { id: "Shop" });
 */
interface HubSwitch { id: string; }
GameEvents.Subscribe<HubSwitch>("hub_switch_panel", ({ id }) => switchPanel(id));

$.Msg("Main hub UI initialised");
