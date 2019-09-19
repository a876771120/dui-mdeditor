export class EditorSatte {
    // 被初始化
    el:HTMLTextAreaElement
    config:EditorConfig
    constructor(config:EditorConfig) {
        this.el = config.el ?
        typeof config.el==="string" ? document.querySelector(config.el) :
        (config.el instanceof HTMLTextAreaElement) ? config.el : null : null; 
        if(!this.el || !(this.el instanceof HTMLTextAreaElement)) throw "初始化失败，要初始化元素只能是textarea";
        
    }
    private init(){

    }
}
interface EditorConfig{
    el:HTMLTextAreaElement //编辑框元素
    preview:Boolean

}