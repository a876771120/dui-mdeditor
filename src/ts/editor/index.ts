import codemirror from "codemirror"
import "codemirror/mode/markdown/markdown";
export default class editor {
    $codemirror:any
    constructor(options) {
        this.$codemirror = codemirror.fromTextArea(options.textarea,options)
    }
}