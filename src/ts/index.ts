import commands from "./command";
import codeMirror from "codemirror";
import Editor from "./editor";
class mdEditor {
    /**
     * 初始化调用函数
     * @param options 初始化参数
     */
    constructor(options) {
        
    }
}
namespace mdEditor{
    export let command = commands;
    export let codemirror = codeMirror;
    export let editor = Editor;
}
export default mdEditor;