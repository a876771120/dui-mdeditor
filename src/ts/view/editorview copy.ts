import codemirror from "codemirror/lib/codemirror";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/gfm/gfm";
import crel from "crel";
import { getSize, addClass, addCSSRule, setStyle } from "../utils/dom";
import { extend } from "../utils";
import { command } from "../command";
export let classPrefix = 'dui-mdeditor';//样式名
let index = 1;
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
    // 唯一编号
    id:String
    // 配置信息
    config:EditorViewConfig

    command:command
    /**
     * 初始化方法
     * @param el 要初始化的元素
     * @param options 初始化参数
     *  @param options.height 编辑框的高度
     *  @param options.width 编辑框的宽度
     *  @param options.toolbar 工具条
     */
    constructor(el:HTMLTextAreaElement,options:EditorViewConfig) {
        this.el = el ? (typeof el==="string" ? (document.querySelector(el)): el) : null;
        if(!(this.el instanceof HTMLTextAreaElement)) throw "没有获取到要初始化的元素";
        // 创建视图
        let isRender = (this.el as any).isRender ? true : false;
        // 如果已经渲染了
        if(isRender){
            // 销毁
            this.cm.toTextarea();
            // 还原元素
            this.cm.toTextArea();
            // 把textarea复原位置
            this.mdEditorContainer.before(this.el);
            // 删除元素
            this.mdEditorContainer.remove();
        }
        // 设置id
        this.id = 'dui-mdeditor-'+(index++)
        // 设置配置信息
        this.config = extend(true,{
            height:'textarea',
            width:'textarea',
        },options);
        // 设置指令管理器
        this.command = new command(this.cm);
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
    /**
     * 初始化样式
     */
    initView(){
        let config = this.config;
        let element = this.el;
        let height = function(){
            if(config.height=='textarea'){
                return getSize(element).height;
            }else if(config.height=='auto'){
                return 'auto';
            }else if(config.height.toString().indexOf('%')){
                return window.innerHeight * (Number(config.height)) /100;
            }else{
                return Number(config.height);
            }
        }()
        let width = function(){
            if(config.width=='textarea'){
                return getSize(element).width;
            }else if(config.width.toString().indexOf('%')){
                return window.innerWidth * (Number(config.width)) /100;
            }else{
                return Number(config.width);
            }
        }()
        // 设置面板
        this.mdEditorContainer.append(this.panelContainer);
        // 设置编辑器
        this.panelContainer.append(this.editorContainer);
        // 设置预览视图
        this.panelContainer.append(this.previewContainer);
        // 设置主体宽高
        setStyle(this.mdEditorContainer,'height',((typeof height==="number") ? height+'px': height))
        setStyle(this.mdEditorContainer,'width',((typeof height==="number") ? width+'px': width))
        // 设置主主体
        this.el.after(this.mdEditorContainer)
        // 设置textarea
        this.editorContainer.append(this.el);
        // 添加一个样式规则
        addCSSRule(document.styleSheets[0],'.'+this.id,'display:none!important')
        // 原始textarea设置一个class
        addClass(this.el,this.id)
        // 设置codemirror
        this.cm = codemirror.fromTextArea(this.el,{
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
        });
        // 设置状态为已经渲染
        (this.el as any).isRender = true;
    }
}
interface EditorViewConfig{
    height:String|Number//高度
    width:String|Number//宽度
    
}
interface codemirrorConfig{

}