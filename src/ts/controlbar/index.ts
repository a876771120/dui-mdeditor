import EditorView from "../view/editorview";
export class controlbar {
    constructor(edit:EditorView,options:Array<buttonConfig>|Map<String,buttonConfig>) {
        console.log(edit,options);
    }
    on(){

    }
}
export interface buttonConfig{
    name:String
    icon?:String|stateConfig
    text?:String|stateConfig
    title?:String|stateConfig
    float?:Boolean
    handler:Function
    children?:buttonConfig
}
export interface stateConfig{
    selected:String,
    unSelected:String
}