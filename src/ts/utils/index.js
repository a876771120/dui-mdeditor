// mdEditor所在的路径
export function getMdEditorPath(){
    var patharr = getCurSrc().split('/');
    delete patharr[patharr.length-1]
    return patharr.join('/');
}
/**
 * 获取当前运行js的路径
 */
let currentlyAddingScript=null,
interactiveScript = null;
export function getCurSrc() {
    if(document.currentScript){
        return document.currentScript.src;
    }
    if (currentlyAddingScript) {
        return currentlyAddingScript.src;
    }
    // For IE6-9 browsers, the script onload event may not fire right
    // after the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script
    // ref: http://goo.gl/JHfFW
    if (interactiveScript && interactiveScript.readyState === "interactive") {
        return interactiveScript.src;
    }
  
    var scripts = document.head.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        if (script.readyState === "interactive") {
            interactiveScript = script;
            return interactiveScript.src;
        }
    }
    return null;
}