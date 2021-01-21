/**
 * Script um Knöpfe einer Fernbedienung mit Aktionen zu verknüpfen
 * Typ: TypeScript
 * 
 * = Anleitung =
 * In der Funktion "main" eine neue Klasse (der Name ist irrelevant) mit
 * folgenden Parametern erstellen:
 *  - Objekt-ID der Fernbedienung (des Ordners)
 *  - Array aus
 *  -- source: Datenpunkt des Knopfes (letzter Teil)
 *  -- target: Datenpunkt in den geschrieben werden soll
 *  -- value: Wert der geschrieben werden soll
 *  -- callback: Eine Funktion, die den Wert der geschrieben werden soll, bestimmt
 * 
 * Wird 'callback' angeben wird, wird 'value' ignoriert
 * 
 * Aus 'linkeddevices.0.Fernbedienung.Badezimmer.up_click' wird
 * Objekt-ID: 'linkeddevices.0.Fernbedienung.Badezimmer'
 * source: 'up_click'
 * 
 */

/** Fernbedienungen definieren */
function main(){
    /** Fernbedienung Badezimmer */
    new Fernbedienung("linkeddevices.0.Fernbedienung.Badezimmer",[
        /** Anfang Knopf 1 */
        {
            source: "up_click", // linkeddevices.0.Fernbedienung.Badezimmer.>up_click<
            target: "heos.0.players.1372300996.volume_up",
            value: true,
        },
        /** Ende Knopf 1 */
        {
            source: "right_click",
            target: "heos.0.players.1372300996.next",
            value: true,
        },
        {
            source: "down_click",
            target: "heos.0.players.1372300996.volume_down",
            value: true,
        },
        {
            source: "left_click",
            target: "heos.0.players.1372300996.prev",
            value: true,
        },
        {
            source: "toggle",
            target: "heos.0.players.1372300996.play",
            value: true,
        },
    ])
    /** Fernbedienung Küche */
    new Fernbedienung("linkeddevices.0.Fernbedienung.Kueche",[
        {
            source: "up_click",
            target: "zigbee.0.ccccccfffe622518.brightness",
            callback: () => getState("zigbee.0.ccccccfffe622518.brightness").val + 10,
        },
        {
            source: "down_click",
            target: "zigbee.0.ccccccfffe622518.brightness",
            callback: () => getState("zigbee.0.ccccccfffe622518.brightness").val - 10,
        },
    ])
    /** Template */
    // new Fernbedienung("<OID>",[
    //     {
    //         source: "up_click",
    //         target: "",
    //         value: "", // nur notwendig wenn 'callback' nicht angegeben wird
    //         // callback: () => "", // Wenn gesetzt wird 'value' ignoriert
    //     },
    //     {
    //         source: "right_click",
    //         target: "",
    //         value: "",
    //         // callback: () => "",
    //     },
    //     {
    //         source: "down_click",
    //         target: "",
    //         value: "",
    //         // callback: () => "",
    //     },
    //     {
    //         source: "left_click",
    //         target: "",
    //         value: "",
    //         // callback: () => "",
    //     },
    //     {
    //         source: "toggle",
    //         target: "",
    //         value: "",
    //         // callback: () => "",
    //     },        
    // ])
}

interface action{
    source: string,
    target: string,
    value?: string | boolean | number
    callback?: Function
}
// interface myCallbackType { (): any }
class Fernbedienung{
    oid: string
    actions: action[]
    constructor(oid: string, actions: action[]){
        this.oid = oid
        this.actions = actions
        this.subscribe(this.oid)
    }
    subscribe(oid){
        this.actions.forEach(function(action){
            on({id: oid + "." + action.source, change: "any", val: true}, function (obj) {
                if (action.target) {
                    let newValue: any
                    if (typeof(action.callback) == "function"){
                        newValue = action.callback()
                    } else if(action.value){
                        newValue = action.value
                    }
                    setState(action.target,newValue)
                }
            })
        })
    }
}
main()
