import EditorView from "../view/editorview";
import { insetConfig } from "./insetConfig";
import { langConfig } from "..";
export class command {
    EditorView:EditorView
    manage:Map<String,Function>
    constructor(EditorView:EditorView,langs:langConfig['inset']) {
        
        this.manage = new Map();
        this.EditorView = EditorView;
        // 初始化
        this.init();
    }
    private init(){
        let cm = this.EditorView.cm;
        let state = this.EditorView.state;




    }
    add(key,value:commandInfo){
        
    }
    exec(key){

    }
}
interface commandInfo{
    keymap?:String,
    handler?:Function
}