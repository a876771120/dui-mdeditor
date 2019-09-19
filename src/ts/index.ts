import commands from "./command";
import { EditorSatte } from "./state";
import toolBar from "./toolbar/index";
import I18n from "./i18n/index";
class mdEditor {
    // 指令
    command:commands
    // 配置信息
    config:mdEditorConfig
    // 状态
    state:EditorSatte
    /**
     * 初始化调用函数
     * @param config 初始化参数
     *  @param config.state 初始化状态
     *  @param config.toolbar 工具条
     *  @param config.lang 语言包
     */
    constructor(config:mdEditorConfig) {
        // 设置基础架构
        // 设置指令
        this.command = new commands({});
        // 设置配置信息
        this.state = config.state;
    }
}
/**
 * 命名空间
 */
namespace mdEditor{
    export let toolbar = toolBar;
    export let render = function(options:renderConfig){
        let state = new EditorSatte({
            el:options.el,
            preview:options.preview

        });
        return new mdEditor({state});
    }
    export let i18n = I18n;
}
interface mdEditorConfig{
    state:EditorSatte//textarea元素
    toolbar?:toolBar//工具栏
    lang?:I18n//语言包
}

interface renderConfig{
    el:HTMLTextAreaElement//要初始化的元素
    preview:Boolean
}
export default mdEditor;