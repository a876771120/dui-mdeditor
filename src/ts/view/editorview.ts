import { extend } from "../utils"
import { command } from "../command";
import { getSize, addClass, setStyle, addCSSRule } from "../utils/dom";
import crel from "crel";
import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/gfm/gfm";
export let classPrefix = 'dui-editor'
export let guid = 1;
export default class EditorView {
    /**
     * @param state 状态
     */
    state:Object
    /**
     * @param id 当前编辑器的唯一编号
     */
    id:String
    /**
     * @param original 原始的textarea
     */
    original:HTMLTextAreaElement
    /**
     * @param config 初始化参数
     */
    config:EditorViewConfig
    /**
     * @param cm codemirror实例
     */
    cm:any
    /**
     * @param mdEditorContainer 主体容器
     */
    mdEditorContainer:HTMLDivElement
    /**
     * @param panelContainer 主体容器
     */
    panelContainer:HTMLDivElement
    /**
     * @param panelContainer 主体容器
     */
    editorContainer:HTMLDivElement
    /**
     * @param panelContainer 主体容器
     */
    previewContainer:HTMLDivElement
    /**
     * 初始化参数
     * @param el textarea元素
     * @param options 额外参数
     *  @param options.width  编辑器视图宽
     *  @param options.height 编辑器视图高
     *  @param options.preview 预览状态
     *  @param options.subfield 分栏初始状态
     *  @param options.readmodel 沉浸阅读
     *  @param options.fullscreen 全屏编辑
     *  @param options.codemirrorConfig 编辑器配置
     *  @param options.command 指令管理器
     */
    constructor(el:HTMLTextAreaElement,options:EditorViewConfig) {
        this.config = extend(true,{
            width:'100%',//初始宽度
            height:'org',//初始高度
            preview:true,//预览状态
            subfield:true,//分栏初始状态
            readmodel:false,//沉浸阅读
            fullscreen:false,//全屏
            catalog:false,//目录
            codemirrorConfig:{
                mode                      : 'gfm',
                theme                     : 'default',
                tabSize                   : 4,//一个table相当于移动多少字符
                dragDrop                  : false,
                autofocus                 : true,//是否在初始化时自动获取焦点
                autoCloseTags             : true,//在键入' >'或' 时自动关闭XML标记
                readOnly                  : false,//这会禁止用户编辑编辑器内容。如果"nocursor"给出特殊值（而不是简单true），则不允许对编辑器进行聚焦
                indentUnit                : 4,//应该缩进一个块（无论编辑语言中的含义）多少个空格。默认值为2
                lineNumbers               : true,//是否显示行数
                lineWrapping              : true,//CodeMirror是否自动换行
                extraKeys                 : '',
                gutters                   : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                matchBrackets             : true,//括号匹配
                indentWithTabs            : true,//在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符
                styleActiveLine           : true,//当前行背景高亮
                styleSelectedText         : true,//表示选中后文本颜色是否改变
                autoCloseBrackets         : true,//自动闭合符号
                showTrailingSpace         : true,//显示选中行的样式
            }// 编辑器配置
        },options);
        // 设置原始元素
        this.original = el
        // 完全只读
        if(this.config.codemirrorConfig.readOnly===true){
            this.config.codemirrorConfig.readOnly = 'nocursor';
        }
        // 判断是否已经渲染过
        let isRender = (this.original as any).isRender ? true : false;
        // 如果已经渲染需要回复到最初状态
        if(isRender){
            // 销毁
            this.cm.toTextarea();
            // 把textarea复原位置
            this.mdEditorContainer.before(this.original);
            // 删除元素
            this.mdEditorContainer.remove();
        }
        // 设置唯一编号
        this.id = classPrefix+'-md-'+guid++;
        // 设置初始化状态
        this.state = {
            preview:this.config.preview,// 设置预览状态
            subfield:this.config.subfield,// 设置分栏状态
            readmodel:this.config.readmodel,// 阅读模式
            fullscreen:this.config.fullscreen,// 全屏模式
            catalog:this.config.catalog // 目录
        };
        // 初始化视图
        this.initView();
    }
    /**
     * 初始化视图
     */
    private initView(){
        // 设置主体元素
        this.mdEditorContainer =  crel('div',{'class':classPrefix})
        // 设置panel
        this.panelContainer = crel('div',{"class":classPrefix+'__panel'})
        // 设置编辑器容器
        this.editorContainer = crel('div',{'class':classPrefix+'__edit'})
        // 设置编辑器容器
        this.previewContainer = crel('div',{'class':classPrefix+'__show'})
        // 设置初始化样式
        this.initStyle();
        // 添加元素在页面
        this.addElement();
        // 初始化codemirror
        this.initCodemirror();
    }
    /**
     * 初始化样式
     */
    private initStyle(){
        let _this=this,state = _this.state,config=_this.config;
        // 根据配置的状态
        for (const key in state) {
            if (state.hasOwnProperty(key)) {
                const val = state[key];
                if(val===true){
                    addClass(_this.panelContainer,key+'-selected')
                }
            }
        }
        // 计算元素的高
        let height = function(){
            if(config.height=='org'){
                return (getSize(_this.original).height)+'px';
            }else if(config.height=='auto'){
                return 'auto';
            }else if(config.height.toString().indexOf('%')){
                return window.innerHeight * (parseFloat(config.height.toString())) /100;
            }else{
                return parseFloat(config.height.toString())+'px';
            }
        }()
        // 计算元素的宽
        let width = function(){
            if(config.width=='org'){
                return (getSize(_this.original).width)+'px';
            }else if(config.width.toString().indexOf('%')){
                return config.width;
            }else{
                return parseFloat(config.width.toString())+'px';
            }
        }()
        // 设置当前主体元素高度
        setStyle(_this.mdEditorContainer,'height',height);
        // 设置当前主体元素的宽
        setStyle(_this.mdEditorContainer,'width',width);
        // 隐藏原始元素
        // 添加一个样式规则
        addCSSRule(document.styleSheets[0],'.'+this.id,'display:none!important')
        // 原始textarea设置一个class
        addClass(this.original,this.id)
    }
    /**
     * 添加元素
     */
    private addElement(){
        // 原始元素后面添加主体元素
        this.original.after(this.mdEditorContainer);
        // 主体元素添加panel元素
        this.mdEditorContainer.append(this.panelContainer)
        // panel元素有编辑器元素和视图元素
        this.panelContainer.append(this.editorContainer)
        this.panelContainer.append(this.previewContainer)
        // 原始元素后添加主体元素
        this.original.after(this.mdEditorContainer);
        // 再把原始元素放入编辑器元素
        this.editorContainer.append(this.original);
    }
    /**
     * 初始化codemirror在线编辑器
     */
    private initCodemirror(){
        this.cm = CodeMirror.fromTextArea(this.original,this.config.codemirrorConfig)
    }
}
export interface EditorViewConfig{
    width?:String|Number
    height?:String|Number
    preview?:Boolean 
    subfield?:Boolean 
    readmodel?:Boolean 
    fullscreen?:Boolean 
    catalog?:Boolean 
    codemirrorConfig?:CodeMirror.EditorConfiguration 
    command:command
}