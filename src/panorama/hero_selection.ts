"use strict";
// hero_selection.ts – use with the TypeScriptAddonTemplate build
// -------------------------------------------------------------------
//  🎨  THEME  – one stop for colour tweaks
const PALETTE = {
    bgMain:         "#1b1f23",   // almost-black background
    bgPanel:        "#262c31",   // generic dark panel
    hudGold:        "#d1b35b",   // Dota-style gold
    hudGreen:       "#7fbd46",   // soft ability-green
    hudBlue:        "#4a90e2",   // bright rune-blue
    hudRed:         "#d64a4a",   // warning / highlight
    textLight:      "#e8e8e8",   // light text
    textMuted:      "#b0b0b0"
};

// -------------------------------------------------------------------
const root = $.GetContextPanel();
root.RemoveAndDeleteChildren();
root.style.width            = "100%";
root.style.height           = "100%";
root.style.backgroundColor  = PALETTE.bgMain;
root.style.flowChildren     = "down";
root.hittest                =true;

// ────────────────────────────────────────────────────────────────────
// 1.  TOP BAR  –  ability mini-icons   +   timer diamond
// ────────────────────────────────────────────────────────────────────
const topBar = $.CreatePanel("Panel", root, "TopBar");
topBar.style.width          = "100%";
topBar.style.height         = "64px";
topBar.style.flowChildren   = "right";
topBar.style.horizontalAlign= "center";
topBar.style.padding        = "0 12px";
topBar.style.backgroundColor= PALETTE.bgPanel;
topBar.style.boxShadow      = "0 0 6px #000b";

// (a) 5 small ability hexes
for (let i = 0; i < 5; ++i) {
    const mini = $.CreatePanel("Image", topBar, `MiniHex_${i}`);
    mini.SetImage("file://{images}/custom/hex_small.png");
    mini.style.width = mini.style.height = "32px";
    mini.style.marginRight = "8px";
    mini.style.washColor = PALETTE.hudBlue;     // 💙
}

// (b) TIMER  –  gold diamond countdown
const timerWrap = $.CreatePanel("Panel", topBar, "TimerDiamond");
timerWrap.style.width          = timerWrap.style.height = "88px";
timerWrap.style.transform      = "rotateZ(45deg)";
timerWrap.style.backgroundColor= PALETTE.hudGold;
timerWrap.style.marginLeft     = "4px";
timerWrap.style.boxShadow      = "0 0 10px #0009";

const timerLabel = $.CreatePanel("Label", timerWrap, "TimerLabel");
timerLabel.text               = "60";
timerLabel.style.transform    = "rotateZ(-45deg)";   // cancel diamond rotation
timerLabel.style.color        = PALETTE.textLight;
timerLabel.style.fontSize     = "32px";
timerLabel.style.fontWeight   = "bold";
timerLabel.style.horizontalAlign = "center";
timerLabel.style.verticalAlign   = "center";

// ────────────────────────────────────────────────────────────────────
// 2.  MAIN BODY  –  LEFT column & RIGHT playground
// ────────────────────────────────────────────────────────────────────
const main = $.CreatePanel("Panel", root, "MainArea");
main.style.width          = "100%";
main.style.height         = "fill-parent-flow(1)";
main.style.flowChildren   = "right";

// ===== 2A.  LEFT COLUMN (hero list + stash) ========================
const leftCol = $.CreatePanel("Panel", main, "LeftColumn");
leftCol.style.flowChildren   = "down";
leftCol.style.width          = "35%";
leftCol.style.height         = "100%";

// (i) hero grid
const heroGrid = $.CreatePanel("Panel", leftCol, "HeroGrid");
heroGrid.style.backgroundColor = "#313740";
heroGrid.style.height          = "60%";
heroGrid.style.width           = "100%";
heroGrid.style.flowChildren    = "right-wrap";
heroGrid.style.padding         = "6px";

/* NEW  ─ add vertical scrolling, keep horizontal squished/hidden */
heroGrid.style.overflow        = "scroll";   // X  Y
// - or -  heroGrid.style.overflow = "clip   scroll";


// (ii) savings / perks
const HeroAbilities = $.CreatePanel("Panel", leftCol, "HeroAbilities");
HeroAbilities.style.backgroundColor = PALETTE.bgPanel;
HeroAbilities.style.borderTop       = `2px solid ${PALETTE.hudGreen}`;
HeroAbilities.style.height          = "20%";
HeroAbilities.style.width           = "100%";
HeroAbilities.style.flowChildren    = "right";

// (iii) boosters toggled on
const boostersPanel = $.CreatePanel("Panel", leftCol, "BoostersPanel");
boostersPanel.style.height          = "20%";
boostersPanel.style.width           = "100%";
boostersPanel.style.backgroundColor = PALETTE.bgPanel;
boostersPanel.style.borderTop       = `2px solid ${PALETTE.hudBlue}`;

// ===== 2B.  RIGHT “PLAYGROUND” =====================================
const playCol = $.CreatePanel("Panel", main, "Playground");
playCol.style.flowChildren   = "down";
playCol.style.width          = "55%";
playCol.style.height         = "100%";
playCol.style.paddingLeft    = "12px";

// slim level column (10 %) stays untouched; you can theme later
const lvlcol = $.CreatePanel("Panel", main, "lvlselect");
lvlcol.style.flowChildren   = "down";
lvlcol.style.width          = "10%";
lvlcol.style.height         = "100%";
lvlcol.style.paddingLeft    = "12px";
lvlcol.style.backgroundColor= "#0000";         // transparent until themed

// (i) info banner
const OtherPlayerBar = $.CreatePanel("Panel", playCol, "OtherPlayerBar");
OtherPlayerBar.style.height          = "30%";
OtherPlayerBar.style.backgroundColor = PALETTE.bgPanel;
OtherPlayerBar.style.width           = "100%";
OtherPlayerBar.style.boxShadow       = "inset 0 -4px 8px #0006";
OtherPlayerBar.style.flowChildren    = "right-wrap";  // arrange many widgets
OtherPlayerBar.style.padding         = "4px 6px";


// (ii) portrait + abilities
const midArea = $.CreatePanel("Panel", playCol, "MidArea");
midArea.style.height          = "43%";
midArea.style.flowChildren    = "right";
midArea.style.width           = "100%";
midArea.style.marginTop       = "16px";

//     hero portrait
const portrait = $.CreatePanel("Panel", midArea, "Portrait");
portrait.style.width           = "35%";
portrait.style.height          = "100%";
portrait.style.backgroundColor = "#2e343b";
portrait.style.boxShadow       = "0 0 8px #000c";
portrait.style.overflow        = "clip";    // trim any inner zoom effects

//     three big ability hexes
const hexContainer = $.CreatePanel("Panel", midArea, "BigHexes");
hexContainer.style.width           = "60%";
hexContainer.style.height          = "100%";
hexContainer.style.flowChildren    = "down";
hexContainer.style.verticalAlign   = "center";
hexContainer.style.backgroundColor = "#0000";   // transparent

for (let i = 0; i < 3; ++i) {
    const big = $.CreatePanel("Image", hexContainer, `BigHex_${i}`);
    big.SetImage("file://{images}/custom/hex_big.png");
    big.style.width  = "128px";
    big.style.height = "112px";
    big.style.marginBottom = "12px";
    big.style.washColor = PALETTE.hudBlue;
}

// (iii) Selectedabilities bar
const Selectedabilities = $.CreatePanel("Panel", playCol, "Selectedabilities");
Selectedabilities.style.height          = "9%";
Selectedabilities.style.backgroundColor = "#3b4249";
Selectedabilities.style.marginTop       = "8px";
Selectedabilities.style.width           = "100%";
Selectedabilities.style.flowChildren    = "right";   // icons flow left → right
Selectedabilities.style.paddingLeft     = "6px";
// (iv) bottom row – green token + START button
const bottomRow = $.CreatePanel("Panel", playCol, "BottomRow");
bottomRow.style.height           = "12%";
bottomRow.style.marginTop        = "8px";
bottomRow.style.flowChildren     = "right";
bottomRow.style.horizontalAlign  = "left";
bottomRow.style.width            = "100%";

// blue START
const startBtn = $.CreatePanel("TextButton", bottomRow, "StartBtn");
startBtn.text  = "START";
startBtn.style.marginLeft       = "12px";
startBtn.style.width            = "30%";
startBtn.style.height           = "100%";
startBtn.style.fontSize         = "24px";
startBtn.style.fontWeight       = "bold";
startBtn.style.color            = PALETTE.textLight;
startBtn.style.backgroundColor  = PALETTE.hudBlue;
startBtn.style.transition       = "background-color 0.15s ease-in-out 0s";
startBtn.SetPanelEvent("onmouseover",()=>startBtn.style.backgroundColor=PALETTE.hudGreen);
startBtn.SetPanelEvent("onmouseout",()=>startBtn.style.backgroundColor=PALETTE.hudBlue);
startBtn.SetPanelEvent("onactivate", tryReady);

// green placeholder
const tinyGreen = $.CreatePanel("Panel", bottomRow, "TinyGreen");
tinyGreen.style.width            = "70%";
tinyGreen.style.height           = "100%";
tinyGreen.style.backgroundColor  = PALETTE.hudGreen;

// ────────────────────────────────────────────────────────────────────
// 3.  HERO CARD BUILDER  –  yellow grid swapped for darker cards
// ────────────────────────────────────────────────────────────────────
// hero_selection.ts – inside your UI initialisation -----------------
let HEROES: string[] = [];               // now mutable

const localID = Players.GetLocalPlayer();

function buildHeroArray(): string[] {
    /* 1 ─ Pull the two rows we need ─────────────────────────────────── */
    const data = CustomNetTables.GetTableValue("hero_data_table", "data")
  
    const picksObj = CustomNetTables.GetTableValue(
                       "hero_table", String(localID))
  
    if (!data || !picksObj) return [];           // tables not ready yet
  
    /* 2 ─ Copy object → numeric array to preserve sort order ────────── */
    const idList: number[] = [];
    for (const k in picksObj) {
      if (Object.prototype.hasOwnProperty.call(picksObj, k)) {
        idList.push(picksObj[k]);                // "k" is "1","2"…
      }
    }
    idList.sort((a, b) => a - b);                // same order as server
   
    /* 3 ─ Map idList → hero names without using Array.map ───────────── */
    const heroes: string[] = [];
    for (let i = 0; i < idList.length; ++i) {
      const id       = idList[i];
      const heroInfo = data[String(id)];
      if (heroInfo && heroInfo.heroName) {
        heroes.push(heroInfo.heroName);
      }
    }
    return heroes;                               // ready for buildHeroCards
  }
  

/** Re-draws the grid whenever our pool changes */
function refreshHeroGrid(picks?: number[]) {
    
  // If called from the listener, we already have the new array → skip fetch
  HEROES = picks ? picks.map(i => {
              const d = CustomNetTables.GetTableValue("hero_data_table","data")!;
              
              return d[String(i)].heroName;
           })
         : buildHeroArray();

  heroGrid.RemoveAndDeleteChildren();    // wipe old cards
  buildHeroCards(heroGrid);              // uses the new global HEROES
}

// ──────────────────────────────────────────────────────────────
// Initial pull (documents guarantee the table exists by now)
refreshHeroGrid();

// Live updates – only handle the key that matches *our* player
CustomNetTables.SubscribeNetTableListener("hero_table",
  (_, key, value) => {
    if (Number(key) === localID) refreshHeroGrid(value as number[]);
  });

//buildHeroCards(heroGrid);
let selected: string | undefined;

function buildHeroCards(parent: Panel) {
    for (const heroName of HEROES) {
        const card = $.CreatePanel("Panel", parent, heroName);
        card.AddClass("hero_card");
        card.hittest           = true;
        card.style.width       = "17%";
        card.style.height      = "12%";
        card.style.margin      = "1%";
        card.style.backgroundColor = PALETTE.bgPanel;
        card.style.borderRadius    = "6px";
        card.style.transition      = "transform 0.08s ease 0s, background-color 0.08s ease 0s";

        const img = $.CreatePanel("DOTAHeroImage", card, "");
        img.heroname           = heroName;
        img.style.width        = img.style.height = "100%";

        card.SetPanelEvent("onmouseover", () => {
            card.style.transform   = "scale3d(1.05,1.05,1)";
            img.style.saturation   = "1";
        });
        card.SetPanelEvent("onmouseout", () => {
            if (selected !== heroName)
                card.style.transform = "scale3d(1,1,1)";
            img.style.saturation     = "0.85";
        });
        card.SetPanelEvent("onactivate", () => chooseHero(heroName, card));
    }
}

function chooseHero(hero: string, card: Panel) {
    if (selected) {
        const prev = $(`#${selected}`)!;
        prev.style.transform   = "scale3d(1,1,1)";
        prev.style.boxShadow   = "none";
    }
    selected = hero;
    card.style.boxShadow       = `0 0 12px 2px ${PALETTE.hudGold}`;
    // TODO: Update portrait, ability hexes, etc.
      // — refresh the portrait panel —
  portrait.RemoveAndDeleteChildren();          // wipe any old image

  const img = $.CreatePanel("DOTAHeroMovie", portrait, "HeroPortraitImg");
  img.heroname           = hero;               // auto-loads hero render
  img.style.width        = "100%";
  img.style.height       = "100%";
  img.style.saturation   = "1";
  img.style.opacity      = "0";                // start faded-out
  img.style.transition   = "opacity 0.15s ease-in-out 0s";
  $.Schedule(0.0, () => (img.style.opacity = "1")); // next frame → fade-in

    showAbilityHero(hero);
}

    interface AbilityPoolSection {          // e.g. { axe: ["axe_berserkers_call", …] }
      [heroName: string]: string[];
    }

    let ABILITY_POOL: CustomNetTableDeclarations["ability_pool"] | undefined;

    function cacheAbilityPool() {
      ABILITY_POOL = {
        normal:  CustomNetTables.GetTableValue("ability_pool", "normal")  as AbilityPoolSection,
        special: CustomNetTables.GetTableValue("ability_pool", "special") as AbilityPoolSection,
      };
    }
    
    cacheAbilityPool();  // initial pull
    CustomNetTables.SubscribeNetTableListener("ability_pool", cacheAbilityPool);
    let currentHeroShown: string | undefined;              // which hero pool UI is open
    let abilityPanels: Record<string, Panel> = {};         // abilityName ➜ panel
  
    function showAbilityHero(hero: string) {
        currentHeroShown = hero;           // remember which list is displayed
        abilityPanels    = {};             // wipe previous mapping
      
        HeroAbilities.RemoveAndDeleteChildren();
        if (!ABILITY_POOL) return;
      
        const raw = ABILITY_POOL.normal[hero];
        if (!raw) return;
      
        const picks     = Array.isArray(raw) ? raw : Object.values(raw) as string[];
        const selected  = getPlayerSelectedSet();   // helper below
      
        for (const name of picks) {
          const img = $.CreatePanel("DOTAAbilityImage", HeroAbilities, "");
          img.abilityname      = name;
          img.style.width      = "90px";
          img.style.height     = "90px";
          img.style.marginRight= "12px";
      
          abilityPanels[name] = img;       // register for live updates
          applyPickedStyle(img, selected.has(name));  // initial style
      
          if (selected.has(name)) continue;           // disable already-chosen
      
          img.hittest          = true;
          img.SetPanelEvent("onmouseover", () => {
            $.DispatchEvent("DOTAShowAbilityTooltip", img, name);   // tooltip
            if (!selected.has(name)) img.style.transform = "scale3d(1.05,1.05,1)";
          });
      
          img.SetPanelEvent("onmouseout", () => {
            $.DispatchEvent("DOTAHideAbilityTooltip", img);
            if (!selected.has(name)) img.style.transform = "scale3d(1,1,1)";
          });
          img.SetPanelEvent("onactivate", () => {
            GameEvents.SendCustomGameEventToServer("ability_selected", {
              playerId : localID,
              ability  : name,
              heroName : hero
            });
          });
        }
      }

      
      function getPlayerSelectedSet(): Set<string> {
        const row = CustomNetTables.GetTableValue("selected_abilitys_table", String(localID))
                 
        return new Set(row ? Object.values(row) : []);
      }
      
      
  
function tryReady() {
    if (!selected) {
        $.Msg("Pick a hero first!");
        return;
    }
    GameEvents.SendCustomGameEventToServer("hero_selected", {playerId:localID, hero: selected });
    GameEvents.SendCustomGameEventToServer("player_ready", {player_id:localID});
    $.Msg("ui.pick_play");
}


  
  // -----------------------------------------------------------------------------
  // 3 · draw / refresh the icons in the panel
  // -----------------------------------------------------------------------------
  function repaintSelectedAbilities(picks: string[]) {
    Selectedabilities.RemoveAndDeleteChildren();
  
    for (const name of picks) {
      const icon = $.CreatePanel("DOTAAbilityImage", Selectedabilities, "");
      icon.abilityname      = name;
      icon.style.width      = "72px";
      icon.style.height     = "72px";
      icon.style.marginRight= "6px";
      icon.hittest          = true;              // ← enable mouse events
  
      /* optional hover tint */
      icon.SetPanelEvent("onmouseover", () => {icon.style.brightness = "1.2"
        $.DispatchEvent("DOTAShowAbilityTooltip", icon, name); 
      });
      icon.SetPanelEvent("onmouseout",  () => {icon.style.brightness = "1"
        $.DispatchEvent("DOTAHideAbilityTooltip", icon);
      }
    );
  
      /* click to remove */
      icon.SetPanelEvent("onactivate", () => {
        /* quick 0.15 s fade-out then delete */
        icon.style.transition = "opacity 0.15s ease 0s";
        icon.style.opacity    = "0";
        icon.DeleteAsync(0.15);
  
        GameEvents.SendCustomGameEventToServer("ability_unselected", {
          player_id: Players.GetLocalPlayer(),
          ability   : name
        });
      });
    }
  
    if (picks.length === 0) {
      const label = $.CreatePanel("Label", Selectedabilities, "");
      label.text  = $.Localize("#hud_no_abilities_selected");
      label.style.color = "#999";
      label.style.verticalAlign = "center";
    }
  }
  
  
  // -----------------------------------------------------------------------------
  // 4 · subscribe once – fires on every SetTableValue
  // -----------------------------------------------------------------------------

  
  CustomNetTables.SubscribeNetTableListener(
    "selected_abilitys_table",
    (_, key, row) => {
      if (Number(key) !== localID) return;           // ignore other players
      repaintSelectedAbilities(rowToArray(row as Record<string,string>));

    // only react if we’re currently showing a hero pool
    if (!currentHeroShown) return;

    const selected = new Set(Object.values(row as Record<string,string>));

    // loop over the panels we rendered and toggle their style
    for (const [ability, panel] of Object.entries(abilityPanels)) {
      if (!panel.IsValid()) continue;             // panel may have been deleted
      applyPickedStyle(panel, selected.has(ability));
    }
    }
  );
  
  // -----------------------------------------------------------------------------
  // 5 · initial pull (in case the row already existed before we subscribed)
  // -----------------------------------------------------------------------------
  const initialRow = CustomNetTables.GetTableValue(
    "selected_abilitys_table",
    String(localID)
  ) as Record<string, string> | undefined;
  
  repaintSelectedAbilities(rowToArray(initialRow));




  
  interface PlayerRowWidgets {
    root      : Panel;            // the outer frame
    nameLabel : LabelPanel;
    portrait  : HeroImage;
    abilityWrap: Panel;           // holds ≤ 10 icons
  }
  
  const playerRows: Record<string, PlayerRowWidgets> = {};
  
  function ensureRow(pid: string): PlayerRowWidgets {
    if (playerRows[pid]) return playerRows[pid];
  
    /* root frame — fixed size so all cells line up */
    const root   = $.CreatePanel("Panel", OtherPlayerBar, `PlayerRow_${pid}`);
    root.style.width        = "170px";
    root.style.height       = "270px";
    root.style.margin       = "6px";
    root.style.border       = "2px solid #0008";
    root.style.borderRadius = "6px";
    root.style.backgroundColor = "#262c55";
    root.style.flowChildren = "down";     // three stacked blocks
  
    /* 1️⃣  name bar -------------------------------------------------- */
    const nameLabel = $.CreatePanel("Label", root, "");
    nameLabel.text  = Players.GetPlayerName(Number(pid) as PlayerID) || `Player ${pid}`;
    nameLabel.style.height   = "24px";
    nameLabel.style.margin   = "4px";
    nameLabel.style.horizontalAlign = "center";
    nameLabel.style.fontSize = "16px";
    nameLabel.style.color    = "#d1b35b";
  
    /* 2️⃣  hero portrait -------------------------------------------- */
    const portrait = $.CreatePanel("DOTAHeroMovie", root, "");
    portrait.style.width  ="80%";
    portrait.style.height  ="60%";
    portrait.style.horizontalAlign  ="center";
    /* 👇  this trims everything beyond those bounds */
    portrait.style.overflow = "clip";   // same as "clip clip"
  
    /* 3️⃣  ability grid (2 × 5) ------------------------------------ */
    const abilityWrap = $.CreatePanel("Panel", root, "");
    abilityWrap.style.width        = "100%";
    abilityWrap.style.height       = "70px";
    abilityWrap.style.flowChildren = "right-wrap";
    abilityWrap.style.horizontalAlign = "center";
    abilityWrap.style.padding      = "2px 6px";
  
    playerRows[pid] = { root, nameLabel, portrait: portrait as unknown as HeroImage, abilityWrap };
    return playerRows[pid];
  }
  
  
  function rowToArray(row: Record<string, string> | undefined): string[] {
    if (!row) return [];
    // row arrives as { "1":"axe_berserkers_call", "2":"axe_culling_blade", … }
    const out: string[] = [];
    for (const k in row) {
      if (Object.prototype.hasOwnProperty.call(row, k)) {
        out.push(row[k]);
      }
    }
    return out.sort();  // keep a stable visual order (optional)
  }
  
  function applyPickedStyle(panel: Panel, picked: boolean) {
    panel.hittest        = true;
    panel.style.saturation = picked ? "0"   : "1";
    panel.style.opacity    = picked ? "0.35": "1";
  }
  function repaintPlayer(pid: string) {
    const heroRow    = CustomNetTables.GetTableValue("player_hero_table", pid);
    const abilityRow = CustomNetTables.GetTableValue("selected_abilitys_table", pid)as Record<string, string> | undefined;
  
    const w = ensureRow(pid);

    /* hero portrait */
    w.portrait.heroname = heroRow?.hero? heroRow.hero: "";   // blank until chosen
  
    /* ability grid */
    w.abilityWrap.RemoveAndDeleteChildren();
    rowToArray(abilityRow).forEach(name => {
      const ico = $.CreatePanel("DOTAAbilityImage", w.abilityWrap, "");
      ico.abilityname  = name;
      ico.style.width  = ico.style.height = "27px";
      ico.style.margin = "2px";
      applyPickedStyle(ico,false);                     // always greyed
    });
  }
  
  /* hero chosen */
CustomNetTables.SubscribeNetTableListener("player_hero_table",
    (_, k) => repaintPlayer(k));
  
  /* abilities added/removed */
  CustomNetTables.SubscribeNetTableListener("selected_abilitys_table",
    (_, k) => repaintPlayer(k));
  
  /* one-time pass for players who locked in before we opened the UI */
  Game.GetAllPlayerIDs().forEach(()=>repaintPlayer);
  
  let   hostID    = 0;
let   currentDiff = 0;
/* ---------------------------------------------------------------
   3 · build the level buttons once  (after lvlcol is created)
-----------------------------------------------------------------*/
function buildDifficultyButtons(levels: number[]) {
  lvlcol.RemoveAndDeleteChildren();          // wipe any old build
  levels.forEach(diff => {
    const btn = $.CreatePanel("Panel", lvlcol, `Diff_${diff}`);
    btn.style.width  = "100%";
    btn.style.height = "56px";
    btn.style.marginBottom = "12px";
    btn.style.border       = "2px solid #0008";
    btn.style.borderRadius = "4px";
    btn.style.backgroundColor = "#3b4249";
    btn.style.flowChildren = "down";

    /* label (big digit) */
    const lbl = $.CreatePanel("Label", btn, "");
    lbl.text  = String(diff + 1);            // show 1-based
    lbl.style.horizontalAlign = "center";
    lbl.style.verticalAlign   = "center";
    lbl.style.fontSize        = "28px";
    lbl.style.color           = "#e8e8e8";
    lbl.style.textShadow      = "0 0 4px #000";

    /* hover & click only if host */
    const interactive = () => localID === hostID;

    btn.SetPanelEvent("onmouseover", () => {
      if (interactive()) {btn.style.transform = "scale3d(1.08,1.08,1)"
        btn.style.backgroundColor="#d1b35b";
        lbl.style.color           = "black";
      };
    });
    btn.SetPanelEvent("onmouseout", () => {
      if (interactive()) {btn.style.transform = "scale3d(1,1,1)";
      btn.style.backgroundColor="#3b4249";
      lbl.style.color           = "#e8e8e8";
    }
    });
    btn.SetPanelEvent("onactivate", () => {
      if (!interactive()) {
        $.Msg("Only the lobby host may pick the difficulty.");
        return;
      }
      GameEvents.SendCustomGameEventToServer("difficulty_selected", {
        difficulty: diff
      });
    });
  });

  highlightDifficulty(currentDiff);          // mark current pick
}

/* ---------------------------------------------------------------
   4 · highlight helper
-----------------------------------------------------------------*/
function highlightDifficulty(diff: number) {
  currentDiff = diff;
  (lvlcol.Children() as Panel[]).forEach(p => {
    const isSel = p.id === `Diff_${diff}`;
    p.style.border = isSel
      ? "3px solid #d1b35b"  // gold highlight
      : "2px solid #0008";
      p.style.backgroundColor= isSel
      ? "#d1b35b"  // gold highlight
      : "#3b4249";
  });
}

/* ---------------------------------------------------------------
   5 · net-table listeners
-----------------------------------------------------------------*/
function syncFromMapInfo(row?: { difficulty: number; hostId: number }) {
  if (!row) return;
  //hostID = row.hostId;
  highlightDifficulty(row.difficulty);
}

CustomNetTables.SubscribeNetTableListener("map",
  (_, __, value) => syncFromMapInfo(value as any));

/* — optional: pool may arrive after map loads — */
CustomNetTables.SubscribeNetTableListener("difficulty_pool",
  (_, __, tbl)  => buildDifficultyButtons((tbl as { list:number[] }).list));

/* ---------------------------------------------------------------
   6 · initial pull (works even on reload)
-----------------------------------------------------------------*/
const startMapInfo = CustomNetTables.GetTableValue("map", "difficulty");
syncFromMapInfo(startMapInfo as any);

const poolRow = CustomNetTables.GetTableValue("difficulty_pool", "list") as { list:number[] }|undefined;
buildDifficultyButtons(poolRow?.list ?? [0,1,2,3,4]);  // default 5 levels if none sent

GameEvents.Subscribe("close_selection_panel", () => {
  root.style.opacity="0";
  root.style.transition="opacity 0.25s ease-in-out 0s;";
  $.Schedule(0.25, () => root.DeleteAsync(0));  // remove after 250 ms
});