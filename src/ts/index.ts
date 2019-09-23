import { getMdEditorPath } from "./utils";
import EditorViews from "./view/editorview";
class duiMdEditor {
    // 编辑区实例
    EditorView:EditorViews
    /**
     * 初始化方法
     * @param EditorViews 编辑区实例
     * @param options 额外参数
     */
    constructor(EditorViews:EditorViews,options?) {
        this.EditorView = EditorViews;

    }
}

namespace duiMdEditor{
    export let version = '1.0.0';
    export let path = getMdEditorPath();
    export let EditorView = EditorViews;
}
export default duiMdEditor;