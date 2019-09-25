import { getMdEditorPath, extend } from "./utils";
import EditorView, { EditorViewConfig } from "./view/editorview";
import { command } from "./command";
class mdEditor {
    // 要实例化元素
    el:HTMLTextAreaElement
    // 编辑器视图
    editorView:EditorView
    // 输入的初始化参数
    options:mdEditorConfig
    // 整合后的配置信息
    config:mdEditorConfig
    // 指令管理
    command:command
    /**
     * 实例化方法
     * @param options 初始化参数
     */
    constructor(options:mdEditorConfig){
        let el = options && options.el
        this.options = extend(true,{},options);
        this.config = extend(true,{
            el:'',
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
            },// 编辑器配置
            langs:{
                inset:{
                    
                }
            }
        },this.options);
        this.el = el ? (typeof el==="string" ? (document.querySelector(el)): el) : null;
        if(!(this.el instanceof HTMLTextAreaElement)) throw "没有获取到要初始化的元素";
        // 设置编辑器
        this._initEditorView();
        // 初始化指令
        this._initCommand();
    }
    /**
     * 初始化指令管理
     */
    _initCommand(){
        
        this.command = new command(this.editorView,this.config.langs.inset);
    }
    /**
     * 初始化编辑器视图 
     */
    _initEditorView(){
        let _this = this;
        let editorViewConfig:EditorViewConfig = {
            width:_this.config.width,
            height:_this.config.height,
            preview:_this.config.preview,
            subfield:_this.config.subfield,
            readmodel:_this.config.readmodel,
            fullscreen:_this.config.fullscreen,
            catalog:_this.config.catalog,
            codemirrorConfig:_this.config.codemirrorConfig
        }
        this.editorView = new EditorView(this.el,editorViewConfig)
    }
    /**
     * 初始化工具栏
     */
    _initControlbar(){

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
export interface mdEditorConfig{
    el:HTMLTextAreaElement
    height:String|Number
    width:String|Number
    preview:Boolean//预览状态
    subfield:Boolean//分栏初始状态
    readmodel:Boolean//沉浸阅读
    fullscreen:Boolean//全屏
    catalog:Boolean//目录
    codemirrorConfig:CodeMirror.EditorConfiguration
    langs:langConfig
}
export interface langConfig{
    inset:Object,

}
export default mdEditor;