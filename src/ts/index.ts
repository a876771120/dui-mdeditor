import { getMdEditorPath } from "./utils";
import EditorViews from "./view";

class duiMdEditor {
    constructor(EditorViews:EditorViews) {
        
    }
}

namespace duiMdEditor{
    export let version = '1.0.0';
    export let path = getMdEditorPath();
    export let EditorView = EditorViews;
    export let create = function(el,options){
        let EditorView = new EditorViews(el,options)
        return EditorView;
    }
}
export default duiMdEditor;