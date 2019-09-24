import { getMdEditorPath } from "./utils";
import EditorView, { EditorViewConfig } from "./view/editorview";
import { command } from "./command";
class mdEditor {
    // 要实例化元素
    el:HTMLTextAreaElement
    // 编辑器视图
    editorView:EditorView
    // 输入的初始化参数
    options:mdEditorConfig
    // 指令管理
    command:command
    /**
     * 实例化方法
     * @param options 初始化参数
     */
    constructor(options:mdEditorConfig){
        let el = options && options.el
        this.options = options;
        this.el = el ? (typeof el==="string" ? (document.querySelector(el)): el) : null;
        if(!(this.el instanceof HTMLTextAreaElement)) throw "没有获取到要初始化的元素";
        // 指令管理
        this.command = new command();
        // 设置编辑器
        this.initEditorView();
    }
    /**
     * 初始化指令管理
     */
    initCommand(){

    }
    /**
     * 初始化编辑器视图 
     */
    initEditorView(){
        let _this = this;
        let editorViewConfig:EditorViewConfig = {
            width:_this.options.width,
            height:_this.options.height,
            codemirrorConfig:{

            },
            command:_this.command
        }
        this.editorView = new EditorView(this.el,editorViewConfig)
    }
    /**
     * 初始化工具栏
     */
    initControlbar(){

    }
}
namespace mdEditor{
    export let version = '1.0.0';
    export let path = getMdEditorPath();
    export let $EditorView = EditorView;
    export let create = function(options){
        return new mdEditor(options);
    }
}
interface mdEditorConfig{
    el:HTMLTextAreaElement
    height:String|Number
    width:String|Number
}
export default mdEditor;