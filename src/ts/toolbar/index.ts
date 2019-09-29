import EditorView, { classPrefix } from "../view/editorview";
import { button, buttonType } from "./button";
import { each } from "../utils";
import crel from "../utils/crel";
import { on } from "../utils/dom";
export class toolbar {
    toolbarContainer:HTMLDivElement
    toolbarLeftContainer:HTMLDivElement
    toolbarRightContainer:HTMLDivElement
    buttonsLeft:Array<button>
    buttonsRight:Array<button>
    buttons:Map<String,button>
    constructor(edit:EditorView,Items,clickFn) {
        let _this = this;this.buttons = new Map();
        this.buttonsLeft = [];this.buttonsRight = [];
        // 主容器
        this.toolbarContainer = crel('div',{"class":classPrefix+"__toolbar"})
        // 左侧容器
        this.toolbarLeftContainer = crel('div',{"class":classPrefix+"_toolbar-left"})
        // 左侧容器
        this.toolbarRightContainer = crel('div',{"class":classPrefix+"_toolbar-right"})
        // 循环添加按钮
        each(Items,function(i,item){
            // 初始化一个工具条按钮
            let btn = new button(item)
            // 如果工具条按钮是右侧的
            if(item.right){
                _this.buttonsRight.push(btn);
                _this.toolbarRightContainer.append(btn.dom);
            }else{
                _this.buttonsLeft.push(btn);
                _this.toolbarLeftContainer.append(btn.dom);
            }
            // 如果不是分割线
            if(btn.type!=buttonType.divider){
                _this.buttons.set(item.name,btn)
                // 设置事件
                if(btn.dom && btn.type==buttonType.button){
                    on(btn.dom,'click',function(e){
                        clickFn.call(this,e,btn.name);
                    });
                }
            }
        })
        // 如果有左侧按钮
        if(this.buttonsLeft.length>0){
            _this.toolbarContainer.append(_this.toolbarLeftContainer);
        }
        // 如果有右侧按钮
        if(this.buttonsRight.length>0){
            _this.toolbarContainer.append(_this.toolbarRightContainer);
        }
        // 如果有内容
        if(this.buttonsLeft.length>0 || this.buttonsRight.length>0){
            edit.panelContainer.before(this.toolbarContainer);
        }
    }
    
}

