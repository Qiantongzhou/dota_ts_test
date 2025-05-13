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

// (ii) savings / perks
const savingsPanel = $.CreatePanel("Panel", leftCol, "SavingsPanel");
savingsPanel.style.backgroundColor = PALETTE.bgPanel;
savingsPanel.style.borderTop       = `2px solid ${PALETTE.hudGreen}`;
savingsPanel.style.height          = "20%";
savingsPanel.style.width           = "100%";

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
const infoBar = $.CreatePanel("Panel", playCol, "InfoBar");
infoBar.style.height          = "16%";
infoBar.style.backgroundColor = PALETTE.hudGreen;
infoBar.style.width           = "100%";
infoBar.style.boxShadow       = "inset 0 -4px 8px #0006";

// (ii) portrait + abilities
const midArea = $.CreatePanel("Panel", playCol, "MidArea");
midArea.style.height          = "53%";
midArea.style.flowChildren    = "right";
midArea.style.width           = "100%";
midArea.style.marginTop       = "16px";

//     hero portrait
const portrait = $.CreatePanel("Panel", midArea, "Portrait");
portrait.style.width           = "40%";
portrait.style.height          = "100%";
portrait.style.backgroundColor = "#2e343b";
portrait.style.boxShadow       = "0 0 8px #000c";

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

// (iii) description bar
const descBar = $.CreatePanel("Panel", playCol, "DescBar");
descBar.style.height          = "19%";
descBar.style.backgroundColor = "#3b4249";
descBar.style.marginTop       = "8px";
descBar.style.width           = "100%";

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
const HEROES = [
    "npc_dota_hero_axe", "npc_dota_hero_lina",
    "npc_dota_hero_sven","npc_dota_hero_drow_ranger",
    "npc_dota_hero_crystal_maiden",
    // … add the other 25
];

buildHeroCards(heroGrid);
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
        img.style.saturation   = "0.85";

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
}

function tryReady() {
    if (!selected) {
        $.Msg("Pick a hero first!");
        return;
    }
    GameEvents.SendCustomGameEventToServer("hero_selected", { hero: selected });
    $.Msg("ui.pick_play");
}
