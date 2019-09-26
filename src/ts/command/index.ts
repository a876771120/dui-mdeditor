import EditorView from "../view/editorview";
export function insetValue(editorView:EditorView,prefix:string,suffix:string,insetLang:string){
    let defaultText = insetLang,cm = editorView.cm;
    var cursor    = cm.getDoc().getCursor();
    var selection = cm.getDoc().getSelection();
    var start = {
        line:0,
        ch:0
    };
    var end = {
        line:0,
        ch:0
    };
    // 获取行数
    var tmp = /(\n)/.exec(prefix as string);
    var prefixLine = tmp ? tmp.length : 0;
    var prefixlen = prefix.length - prefixLine + function(){
        var res = /([\f\t\v])/.exec(prefix as string);
        return res ? res.length : 0;
    }()
    var tmp2 = /(\n)/.exec(suffix as string);
    var suffixLine = tmp2 ? tmp2.length : 0;
    var suffixlen = suffix.length - suffixLine + function(){
        var res = /([\f\t\v])/.exec(suffix as string);
        return res ? res.length : 0;
    }()
    if(selection){
        // 从后往前选
        if(cursor.sticky=='after'){
            start.line = cursor.line - prefixLine;
            end.line = cursor.line + suffixLine;
            start.ch = prefixLine ? 0 : (cursor.ch-prefixlen);
            end.ch = cursor.ch +defaultText.length+ suffixlen;
        }else{
            start.line = cursor.line - prefixLine;
            end.line = cursor.line + suffixLine;
            start.ch = prefixLine ? 0 : (cursor.ch-defaultText.length-prefixlen);
            end.ch = cursor.ch + suffixlen;
        }
        var checkvalue = cm.getDoc().getRange(start,end)
        if(checkvalue==prefix+selection+suffix){
            cm.getDoc().setSelection(start,end);
            if(selection==defaultText){
                cm.getDoc().replaceSelection('');
            }else{
                cm.getDoc().replaceSelection(selection);
            }
        }else{
            cm.getDoc().replaceSelection(prefix+selection+suffix);
        }
    }else{
        start.line = cursor.line + prefixLine
        start.ch = prefixLine ? 0 : (cursor.ch + prefixlen);
        end.line = cursor.line + suffixLine;
        end.ch = suffixLine ? suffixlen : (cursor.ch + defaultText.length + prefixlen);
        // 添加字符串
        cm.getDoc().replaceSelection(prefix+defaultText+suffix);
        // 设置选中
        cm.getDoc().setSelection(start,end);
    }
    cm.focus();
}