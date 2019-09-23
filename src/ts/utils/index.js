var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
var support = {};
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

/**
 * 判断变量是否是方法
 * @param {Object=} arr 
 */
function isFunction(arr){
    return typeof arr === "function";
}

/**
 * 判断变量是否是数组
 * @param {Object=} arr 任意数据
 */
function isArray(arr) {
    return Array.isArray ? Array.isArray(arr) : getType(arr) === 'array';
}

/**
 * 获取参数的类型
 * @param {Object} obj 
 */
function type(x) {
    if(x === null){
        return 'null';
    }

    var t= typeof x;

    if(t !== 'object'){
        return t;
    }

    var c = toString.call(x).slice(8, -1).toLowerCase();
    if(c !== 'object'){
        return c;
    }

    if(x.constructor==Object){
        return c;
    }

    return 'unkonw';
}

/**
 * 判断传入的参数是否为window对象
 * @param {Object} obj 
 */
function isWindow(obj) {
    return obj != null && obj == obj.window;
}

/**
 * 检查是否是纯对象
 * @param {Object} obj 
 */
function isPlainObject(obj){
    var key;

    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (
      !obj ||
      type(obj) !== "object" ||
      obj.nodeType ||
        isWindow(obj)
    ) {
      return false;
    }
    try {
      // Not own constructor property must be Object
      if (
        obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")
      ) {
        return false;
      }
    } catch (e) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Support: IE<9
    // Handle iteration over inherited properties before own properties.
    if (!support.ownFirst) {
      for (key in obj) {
        return hasOwn.call(obj, key);
      }
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    for (key in obj) {
    }
    return key === undefined || hasOwn.call(obj, key);
}

/**
 * 深度复制
 * @param {Object} target 属性
 */
export function extend(target){
    var src,
      copyIsArray,
      copy,
      name,
      options,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
  
    if (typeof target === "boolean") {
      deep = target;
  
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
  
          if (target === copy) {
            continue;
          }
          if (
            deep &&
            copy &&
            (isPlainObject(copy) || (copyIsArray = isArray(copy)))
          ) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && isArray(src) ? src : [];
            } else {
              clone = src && isPlainObject(src) ? src : {};
            }
            target[name] = extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
}