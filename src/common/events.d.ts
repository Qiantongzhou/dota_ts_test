/**
 * This file contains types for the events you want to send between the UI (Panorama)
 * and the server (VScripts).
 * 
 * IMPORTANT: 
 * 
 * The dota engine will change the type of event data slightly when it is sent, so on the
 * Panorama side your event handlers will have to handle NetworkedData<EventType>, changes are:
 *   - Booleans are turned to 0 | 1
 *   - Arrays are automatically translated to objects when sending them as event. You have
 *     to change them back into arrays yourself! See 'toArray()' in src/panorama/hud.ts
 */

// To declare an event for use, add it to this table with the type of its data
interface CustomGameEventDeclarations {
    example_event: ExampleEventData,
    selected_difficulty:difficultySelect,
    ui_panel_closed: UIPanelClosedEventData
}

// Define the type of data sent by the example_event event
interface ExampleEventData {
    myNumber: number;
    myBoolean: boolean;
    myString: string;
    myArrayOfNumbers: number[]
}
interface difficultySelect{
    value: number
}

// This event has no data
interface UIPanelClosedEventData {}
interface ability_sync{}
// src/common/events.d.ts
interface CustomGameEventDeclarations {
    hero_selected: { playerId: PlayerID; hero: string };
    difficulty_vote: { playerId: PlayerID; difficulty: number };
    hud_toggle: { visible: boolean };
    ability_selected:{playerId:PlayerID;ability:any;heroName:any};
    ability_sync     : {};   
    ability_unselected: { player_id: PlayerID; ability: string };

    // …add more events as your UI grows
}
