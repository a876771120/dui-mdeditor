import codemirror from "codemirror/lib/codemirror";
import crel from "crel";
export let classPrefix = 'dui-mdeditor';//样式名
export default class EditorView {
    // 初始化的元素
    el:HTMLTextAreaElement
    // 主体元素
    mdEditorContainer:HTMLDivElement
    // 编辑器与预览界面的容器
    panelContainer:HTMLDivElement
    // 编辑器容器
    editorContainer:HTMLDivElement
    // 预览容器
    previewContainer:HTMLDivElement
    // 编辑器类
    cm:any
    /**
     * 初始化方法
     * @param el 要初始化的元素
     * @param options 初始化参数
     *  @param options.height 编辑框的高度
     */
    constructor(el:HTMLTextAreaElement,options) {
        this.el = el ? (typeof el==="string" ? (document.querySelector(el)): el) : null;
        if(!(this.el instanceof HTMLTextAreaElement)) throw "没有获取到要初始化的元素";
        // 创建视图
        let isRender = (this.el as any).isRender ? true : false;
        // 如果已经渲染了
        if(isRender){
            // 销毁
            this.cm.toTextarea();
            // 把textarea复原位置
            this.mdEditorContainer.before(this.el);
            // 
        }
        // 设置主体元素
        this.mdEditorContainer =  crel('div',{'class':classPrefix})
        // 设置panel
        this.panelContainer = crel('div',{"class":classPrefix+'__panel'})
        // 设置编辑器容器
        this.editorContainer = crel('div',{'class':classPrefix+'__edit'})
        // 设置编辑器容器
        this.previewContainer = crel('div',{'class':classPrefix+'__show'})
        // 组装视图
        this.initView();
    }
    initView(){
        // 设置主题
        this.el.after(this.mdEditorContainer)
        // 设置面板
        this.mdEditorContainer.append(this.panelContainer);
        // 设置编辑器
        this.panelContainer.append(this.editorContainer);
        // 设置预览视图
        this.panelContainer.append(this.previewContainer);
        // 设置textarea
        this.editorContainer.append(this.el);
    }
}