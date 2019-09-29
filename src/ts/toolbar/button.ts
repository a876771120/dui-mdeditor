import crel from "../utils/crel";
import { classPrefix } from "../view/editorview";
import { on } from "../utils/dom";
import { each } from "../utils";
export class button {
    // name
    name:String
    // 元素
    dom:HTMLButtonElement
    // 按钮类型
    type:buttonType
    // 提示信息
    title:String
    // 回调方法
    handler:Function
    /**
     * 
     * @param attr 初始化参数
     *  @param attr.name 名称
     *  @param attr.icon 图标
     *  @param attr.type 按钮类型
     *  @param attr.title 提示
     *  @param attr.handler 回调函数
     */
    constructor(attr:buttonAttr){
        let attributes = {} as any;
        attr = (typeof attr ==="string") ? ({type:attr} as any) : attr;
        this.type = attr.type ? attr.type : buttonType.button;
        this.name = attr.name ? attr.name :'';
        this.title = attr.title ? attr.title : '';
        this.handler = attr.handler ? attr.handler : function(){};
        if(this.type==buttonType.button){
            attributes.class = classPrefix+'__toolbar-op '+attr.icon;
            attributes.title = attr.title;
            this.dom = crel('button',attributes);
        }else if(this.type==buttonType.divider){
            attributes.class = classPrefix+'__toolbar-divider';
            this.dom = crel('span',attributes);
        }else if(this.type==buttonType.dropdown){
            attributes.class = classPrefix+'__toolbar-op '+attr.icon;
            this.dom = crel('button',attributes);
            // 创建子节点
            let childrens = each(attr.children,function(i,item){
                
            })
        }
    }
    /**
     * 设置提示信息
     */
    setTootip(){

    }
}

export interface buttonAttr{
    name:String//名称
    icon:String//图标
    type:buttonType//按钮类型
    title?:String//提示
    handler?:Function//回调
    children?:dropdownItem//dropdown专用属性
}
export interface dropdownItem{
    name:String // 名称
    text:String // 显示名称
    handler:Function //回调方法
}
export enum buttonType{
    button="button",
    divider="divider",
    dropdown="dropdown"
}