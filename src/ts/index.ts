import { getMdEditorPath, extend, each } from "./utils";
import EditorView, { EditorViewConfig } from "./view/editorview";
import CodeMirror from "codemirror"
import { insetValue } from "./command";
import { toolbar } from "./toolbar";
import { removeClass, addClass } from "./utils/dom";
class mdEditor {
    // 要实例化元素
    el:HTMLTextAreaElement
    // 编辑器视图
    editorView:EditorView
    // 控制栏
    toolbar:toolbar
    // 输入的初始化参数
    options:mdEditorConfig
    // 整合后的配置信息
    config:mdEditorConfig
    // 判断是否是苹果
    isMac:Boolean
    /**
     * 实例化方法
     * @param options 初始化参数
     */
    constructor(options:mdEditorConfig){
        let el = options && options.el
        // 判断元素textarea是否存在
        this.el = el ? (typeof el==="string" ? (document.querySelector(el)): el) : null;
        if(!(this.el instanceof HTMLTextAreaElement)) throw "没有获取到要初始化的元素";
        this.options = extend(true,{},options);
        // 获取配置信息
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
            toolbar:['bold','italic','header','divider','strikethrough','mark'],
            langs:{
                inset:{
                    bold:'粗体',
                    italic:'斜体',
                    header:'标题',
                    strikethrough:'删除线',
                    mark:'标记',
                    alignleft:'居左',
                    aligncenter:'居中',
                    alignright:'居右',
                    quote:'段落引用',
                    listOl:'有序列表',
                    listUl:'无序列表',
                    h:'标题'
                }
            }
        },this.options);
        // 设置编辑器
        this._initEditorView();
        // 设置快捷键
        this._initKeyMap();
        // 设置控制栏
        this._initControlbar();
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
     * 初始化快捷键
     */
    _initKeyMap(){
        this.isMac = ((CodeMirror as any).keyMap as any).default == ((CodeMirror as any).keyMap as any).macDefault;
        let _this = this,runKey = (this.isMac ? "Cmd" : "Ctrl"),extraKeys={};
        extraKeys[runKey+'-B'] = _this.bold;
        extraKeys[runKey+'-I'] = _this.italic;
        extraKeys[runKey+'-U'] = _this.underline;
        extraKeys[runKey+'-~'] = _this.strikethrough;
        extraKeys[runKey+'-Delete'] = 'trash';
        extraKeys[runKey] = 'autocomplete';
        extraKeys[runKey+'-Z'] = _this.undo;
        extraKeys[runKey+'-Y'] = _this.redo;
        extraKeys['F9'] = _this.preview;
        extraKeys['F11'] = 'readmodel';
        extraKeys['F10'] = 'fullscreen';
        // 设置一层代理
        each(extraKeys,function(key,fn){
            let keymap = {};
            keymap[key] = function(cm){
                fn.call(_this,cm);
            }
            _this.editorView.cm.addKeyMap(keymap);
        })
    }
    /**
     * 初始化工具栏
     */
    _initControlbar(){
        let _this = this;
        if(this.config.toolbar===false || (this.config.toolbar as []).length==0) return;
        let runKey = (this.isMac ? "Cmd" : "Ctrl")
        // 默认的按钮
        let defaultItems = [{
            name:'bold',//按钮的唯一标识
            icon:'dui-icon-bold',// 图标
            title:'粗体 ('+runKey+'+ B)',//提示信息
            handler:_this.bold,//回调方法
        },
        {
            name:'italic',//按钮的唯一标识
            icon:'dui-icon-italic',// 图标
            title:'斜体 ('+runKey+'+ I)',//提示信息
            handler:_this.italic,//回调方法
        },
        {
            name:'header',//按钮的唯一标识
            icon:'dui-icon-header',// 图标
            type:'dropdown',
            children:[
                
            ]
        },
        {
            name:'strikethrough',//按钮的唯一标识
            icon:'dui-icon-strikethrough',// 图标
            title:'删除线 ('+runKey+'+ ~)',//提示信息
            handler:_this.strikethrough,//回调方法
        },
        {
            name:'mark',//按钮的唯一标识
            icon:'dui-icon-mark',// 图标
            title:'标记 ('+runKey+'+ M)',//提示信息
            handler:_this.mark,//回调方法
        }];
        let cur = [];
        // 组合当前应该有的
        each(this.config.toolbar,function(i,newItem){
            if(newItem && typeof newItem==="object"){
                cur.push(newItem);
                return;
            }
            if(newItem && typeof newItem==="string" && newItem=='divider'){
                cur.push(newItem);
                return;
            }
            each(defaultItems,function(j,defaultItem){
                if(newItem && typeof newItem==="string" && newItem==defaultItem.name){
                    cur.push(defaultItem);
                    return;
                }
            })
        })
        /**
         * 工具栏回调函数
         */
        function clickFn(e,name){
            if(_this.toolbar.buttons.has(name) && _this.toolbar.buttons.get(name).handler
            && typeof _this.toolbar.buttons.get(name).handler==="function"){
                _this.toolbar.buttons.get(name).handler.call(_this,_this.editorView.cm,e);
            }
        }
        // 创建一个工具条
        this.toolbar = new toolbar(this.editorView,cur,clickFn);
    }
    /**
     * 动态添加快捷键
     */
    addKeyMap(key,fn){
        let _this = this;
        let keymap = {};
        keymap[key] = function(cm){
            fn.call(_this,cm);
        }
        _this.editorView.cm.addKeyMap(keymap);
    }
    /**
     * 加粗
     */
    bold(){
        insetValue(this.editorView,'**','**',this.config.langs.inset.bold);
    }
    /**
     * 标题1
     */
    header(level:Number){
        let prefix = '\n';
        for (let i = 0; i < level; i++) {
            prefix += '#';
        }
        prefix += ' ';
        insetValue(this.editorView,prefix,'',this.config.langs.inset.h);
    }
    /**
     * 斜体
     */
    italic(){
        insetValue(this.editorView,'*','*',this.config.langs.inset.italic);
    }
    /**
     * 删除线
     */
    strikethrough(){
        insetValue(this.editorView,'~~','~~',this.config.langs.inset.strikethrough);
    }
    /**
     * 标记
     */
    mark(){
        insetValue(this.editorView,'==','==',this.config.langs.inset.mark);
    }
    /**
     * 下划线
     */
    quote(){
        insetValue(this.editorView,'> ','',this.config.langs.inset.quote);
    }
    /**
     * 有序列表
     */
    listOl(){
        insetValue(this.editorView,'1. ','',this.config.langs.inset.listOl);
    }
    /**
     * 有序列表
     */
    listUl(){
        insetValue(this.editorView,'- ','',this.config.langs.inset.listUl);
    }
    /**
     * 上一步
     */
    undo(){
        this.editorView.cm.getDoc().undo();
    }
    /**
     * 下一步
     */
    redo(){
        this.editorView.cm.getDoc().redo();
    }
    /**
     * 预览或者编辑
     */
    preview(){
        if(this.editorView.state.preview===true){
            //当前处于预览状态
            this.editorView.state.preview = false;
            removeClass(this.editorView.panelContainer,'preview-selected')
        }else{
            //编辑状态
            this.editorView.state.preview = true;
            addClass(this.editorView.panelContainer,'preview-selected')
        }
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
    toolbar:Boolean|Array<String|Object>
    langs:langConfig
}
export interface langConfig{
    inset:insetLangConfig,

}
export interface insetLangConfig{
    bold:string
    italic:string
    underline:string
    strikethrough:string
    mark:string
    quote:string
    listOl:string
    listUl:string
    h:string
}
export default mdEditor;