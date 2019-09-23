export default class EditorView {
    /**
     * @param original 原始的textarea
     */
    original:HTMLTextAreaElement
    /**
     * 初始化参数
     * @param el textarea元素
     * @param options 额外参数
     *  @param options.width 
     */
    constructor(el:HTMLTextAreaElement,options:EditorViewConfig) {
        
    }
}

interface EditorViewConfig{
    width:String|Number
    height:String|Number
    codemirrorConfig:codemirrorConfig

}

interface codemirrorConfig{

}