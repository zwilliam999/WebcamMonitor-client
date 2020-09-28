(function (name, context, factory) {
    // AMD ,Node ,browser context
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else context[name] = factory(context);
})("Sb", typeof window !== "undefined" ? window : this, function () {
    "use strict";
    let context = window?window:this;
    var sbStr = {
        i: "i",
        px: "px",
        dot:".",
        div: "div",
        top: "top",
        span: "span",
        left: "left",
        kls: "class",
        nullSpace: " ",
        nbsp:"&nbsp;",
        right: "right",
        tId: "data-tid",
        tPos: "data-pos",
        sbTip: "sb-tip",
        middle: "middle",
        bottom: "bottom",
        offsetTop: "48px",
        sbToast: "sb-toast",
        offsetBottom: "100px",
        success:"success",
        sbTipType: "sb-tip-",//sb-tip-error sb-tip-warning sb-tip-success
        msgErrText: "'msg' must be a non-empty string",
        durationErrText: "'duration' must be a number",
        posErrText: "'pos' must be a non-empty string ('top','middle','bottom')",
        toastParamErrText: "please transfer some arguments just like {msg:'toast',position:'top',during:2000}",
        tipParamErrText: "please transfer some arguments just like {msg:'tip',position:'top',during:2000}"
    };
    var commonDuration = 2000;
    var toastQueue = [];
    var tipQueue = [];
    context['onresize'] = function () {
        for(var i=0;i<toastQueue.length;i++){
            toastQueue[i].style.left = (context.innerWidth - toastQueue[i].offsetWidth) / 2 + sbStr.px;
            if(toastQueue[i].dataset.pos){
                toastQueue[i].style.top = (context.innerHeight - toastQueue[i].offsetHeight) / 2 + sbStr.px;
            }
        }
        for(var j=0;j<tipQueue.length;j++){
            tipQueue[j].style.left = (context.innerWidth - tipQueue[j].offsetWidth) / 2 + sbStr.px;
        }
    };
    function isNull(val) {
        return val === null;
    }

    function isNullString(val) {
        return val === "";
    }

    function isObject(val) {
        if (val !== null && typeof val === "object") {
            return val.constructor === Object;
        }
        return false;
    }

    function isUndefined(val) {
        return val === undefined;
    }

    function isNumber(val) {
        return typeof val === 'number';
    }

    function isString(val) {
        return typeof val === 'string';
    }

    function isBoolean(val) {
        return val === true || val === false;
    }

    function isTrue(val) {
        return val === true;
    }

    function isFalse(val) {
        return val === false;
    }

    function isArray(val) {
        return val instanceof Array
    }

    /**
     * @constructor
     */
    function Sb() {

    }

    Sb.prototype = {
        Constructor: Sb,
        ctx: context,
        doc: context.document,
        toast: toast,
        tip: tip,
    };
    /**
     *
     *  position ,string, 'top','middle','bottom'
     *  text ,string, 'toast...'
     *  during，number,
     */
    function toast() {
        var windowH = this.ctx.innerHeight;
        var windowW = this.ctx.innerWidth;
        var div = this.doc.createElement(sbStr.div);
        var timeout = null;
        var currentDuration = null;
        var that = this;
        div.setAttribute(sbStr.kls, sbStr.sbToast);
        div.setAttribute(sbStr.tId, (new Date().getTime()).toString());
        if (arguments.length >= 1) {
            if (isObject(arguments[0])) {
                if (!isNull(arguments[0].msg) && !isUndefined(arguments[0].msg) && !isNullString(arguments[0].msg)) {
                    div.innerHTML = arguments[0].msg;
                    this.doc.body.appendChild(div);
                } else {
                    throw new Error(sbStr.msgErrText)
                }
                if (!isNull(arguments[0].pos) && !isUndefined(arguments[0].pos) && !isNullString(arguments[0].pos)) {
                    switch (arguments[0].pos) {
                        case sbStr.top:
                            div.style.top = sbStr.offsetTop;
                            break;
                        case sbStr.middle:
                            div.style.top = (windowH - div.offsetHeight) / 2 + sbStr.px;
                            div.setAttribute(sbStr.tPos, sbStr.middle);
                            break;
                        case sbStr.bottom:
                            div.style.bottom = sbStr.offsetBottom;
                            break;
                        default:
                            div.style.top = (windowH - div.offsetHeight) / 2 + sbStr.px;
                            break;
                    }
                } else {
                    div.style.top = (windowH - div.offsetHeight) / 2 + sbStr.px;
                }
                if (!isNullString(arguments[0].duration) && isNumber(arguments[0].duration) && !isUndefined(arguments[0].duration)) {
                    currentDuration = arguments[0].duration
                }
            }
        } else {
            throw new Error(sbStr.toastParamErrText)
        }
        div.style.left = (windowW - div.offsetWidth) / 2 + sbStr.px;
        toastQueue.push(div);
        timeout = setTimeout(function () {
            that.doc.body.removeChild(div);
            toastQueue.splice(toastQueue.length-1,1);
            clearTimeout(timeout)
        }, currentDuration ? currentDuration : commonDuration);
    }
    function tip() {
        var div = this.doc.createElement(sbStr.div);　
        var i = this.doc.createElement(sbStr.i);
        var span = this.doc.createElement(sbStr.span);
        var windowW = this.ctx.innerWidth;
        var currentDuration = null;
        var timeout = null;
        var that = this;
        i.innerHTML = sbStr.nbsp;
        if (arguments.length >= 1) {
            if (isObject(arguments[0])) {
                if (!isNull(arguments[0].msg) && !isUndefined(arguments[0].msg) && !isNullString(arguments[0].msg)) {
                    span.innerHTML = arguments[0].msg;
                    div.appendChild(i);
                    div.appendChild(span);
                    this.doc.body.appendChild(div);
                } else {
                    throw new Error(sbStr.msgErrText);
                }
                if (!isNull(arguments[0].type) && !isUndefined(arguments[0].type) && !isNullString(arguments[0].type)) {
                    div.setAttribute(sbStr.kls, sbStr.sbTip+sbStr.nullSpace+sbStr.sbTipType+arguments[0].type);
                } else {
                    div.setAttribute(sbStr.kls, sbStr.sbTip+sbStr.nullSpace+sbStr.sbTipType+sbStr.success);
                }
                if (!isNullString(arguments[0].duration) && isNumber(arguments[0].duration) && !isUndefined(arguments[0].duration)) {
                    currentDuration = arguments[0].duration
                }
            }
        } else {
            throw new Error(sbStr.toastParamErrText)
        }
        div.style.left = (windowW - div.offsetWidth) / 2 + sbStr.px;
        tipQueue.push(div);
        timeout = setTimeout(function () {
            that.doc.body.removeChild(div);
            tipQueue.splice(tipQueue.length-1,1);
            clearTimeout(timeout)
        }, currentDuration ? currentDuration : commonDuration);
    }
    return new Sb();
});