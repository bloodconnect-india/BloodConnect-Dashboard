/* eslint-disable  */
import * as $ from 'jquery'
var ZCSDK = new (function () {
    var b = !1,
        d,
        e = void 0,
        c = {};
    this._init = function () {
        if (!b) {
            b = !0;
            d = new ZSDK();
            c.appSDK = d;
            var a;
            e = new Promise(function (b, h) {
                a = b;
            });
            d.OnLoad(function () {
                d.getContext()
                    .Event.Trigger("GET_INIT_PARAMS", !0, !0)
                    .then(function (b) {
                        c.initParams = b;
                        d.getContext()
                            .Event.Trigger("GET_QUERY_PARAMS", !0, !0)
                            .then(function (h) {
                                c.queryParams = h;
                                a();
                            });
                    });
            });
        }
        return e;
    };
    this._getInitParams = function () {
        return c.initParams;
    };
    this._getQueryParams = function () {
        return c.queryParams;
    };
    this._getApi = function () {
        return {
            API: { RECORDS: new Records(c) },
            UTIL: new Util(c),
        };
    };
})()
const  ZOHO = new (function () {
        var b = !1,
            d,
            e = void 0,
            c = {};
        return {
            CREATOR: {
                API: new Records(c),
                UTIL: new Util(c),
                init: function () {
                    if (!b) {
                        b = !0;
                        d = new ZSDK();
                        c.appSDK = d;
                        var a;
                        e = new Promise(function (b, h) {
                            a = b;
                        });
                        d.OnLoad(function () {
                            d.getContext()
                                .Event.Trigger("GET_INIT_PARAMS", !0, !0)
                                .then(function (b) {
                                    c.initParams = b;
                                    d.getContext()
                                        .Event.Trigger("GET_QUERY_PARAMS", !0, !0)
                                        .then(function (b) {
                                            c.queryParams = b;
                                            a();
                                        });
                                });
                        });
                    }
                    return e;
                },
            },
        };
    })();
function Records(b) {
    function d(a) {
        a.scope || (a.scope = b.initParams.scope);
        a.appName || (a.appName = b.initParams.appName);
    }
    function e(a, b) {
        var h = !1,
            c;
        for (c in a) {
            var k;
            if ((k = !(b && b.includes(c)))) {
                k = a[c];
                var d = !1,
                    g;
                if (!(g = !k || null == k || "" === k || ("string" == typeof k && 0 == k.trim().length)) && (g = "object" == typeof k))
                    a: {
                        g = void 0;
                        for (g in k) {
                            g = !1;
                            break a;
                        }
                        g = !0;
                    }
                g && (d = !0);
                k = d;
            }
            k && (h = !0);
        }
        return h;
    }
    function c(a) {
        return new Promise(function (b, h) {
            var c = new FileReader();
            c.readAsDataURL(a);
            c.onload = function () {
                b(c.result);
            };
            c.onerror = function (a) {
                h(a);
            };
        });
    }
    return {
        addRecord: function (a) {
            if (e(a))
                return new Promise(function (a, b) {
                    b("Improper Configuration..!!");
                });
            d(a);
            a = { formLinkName: a.formName, body: a.data };
            return b.appSDK.getContext().Event.Trigger("ADD_RECORD", a, !0);
        },
        updateRecord: function (a) {
            if (e(a))
                return new Promise(function (a, b) {
                    b("Improper Configuration..!!");
                });
            var c = a.id.toString().split(",");
            d(a);
            a = { viewLinkName: a.reportName, body: a.data, listOfRecords: c };
            return b.appSDK.getContext().Event.Trigger("EDIT_RECORDS", a, !0);
        },
        deleteRecord: function (a) {
            if (e(a))
                return new Promise(function (a, b) {
                    b("Improper Configuration..!!");
                });
            d(a);
            a = { viewLinkName: a.reportName, criteria: a.criteria };
            return b.appSDK.getContext().Event.Trigger("DELETE_RECORDS", a, !0);
        },
        getRecordById: function (a) {
            if (e(a))
                return new Promise(function (a, b) {
                    b("Improper Configuration..!!");
                });
            d(a);
            a = { viewLinkName: a.reportName, id: a.id };
            return b.appSDK.getContext().Event.Trigger("GET_RECORD", a, !0);
        },
        getAllRecords: function (a) {
            if (e(a, ["criteria", "page", "pageSize"]))
                return new Promise(function (a, b) {
                    b("Improper Configuration..!!");
                });
            d(a);
            a = { viewLinkName: a.reportName, criteria: a.criteria, page: a.page, pageSize: a.pageSize };
            return b.appSDK.getContext().Event.Trigger("GET_RECORDS", a, !0);
        },
        uploadFile: function (a) {
            if (e(a, ["file", "parentId"]))
                return new Promise(function (a, b) {
                    b("Improper Configuration..!!");
                });
            d(a);
            return a.file
                ? a.file.size && 50 < a.file.size / 1024 / 1024
                    ? new Promise(function (a, b) {
                        b("Improper Configuration..!!");
                    })
                    : new Promise(function (k, h) {
                        var d = c(a.file),
                            e = "",
                            q = a.file.name;
                        d.then(function (c) {
                            e = c;
                            c = {
                                viewLinkName: a.reportName,
                                id: a.id,
                                fieldName: a.fieldName,
                                file: e,
                                fileName: q,
                            };
                            a.parentId && (c.parentId = a.parentId);
                            b.appSDK
                                .getContext()
                                .Event.Trigger("UPLOAD_FILE", c, !0)
                                .then(function (a) {
                                    k(a);
                                })
                                .catch(function (a) {
                                    h(a);
                                });
                        }).catch(function (a) {
                            h(a);
                        });
                    })
                : new Promise(function (a, b) {
                    b("Improper Configuration..!!");
                });
        },
    };
}
function Util(b) {
    return {
        setImageData: function (d, e, c) {
            if (e.startsWith("/api/v2/")) {
                var a = {};
                a.src = e;
                b.appSDK
                    .getContext()
                    .Event.Trigger("IMAGE_LOAD", a, !0)
                    .then(function (a) {
                        d.setAttribute("src", a);
                        c({ status: "200", statusText: "success" });
                    })
                    .catch(function (a) {
                        if (c) c(a);
                        else {
                            var b = window.console;
                            b.log("Error: Unable to set image data");
                            b.log(a);
                        }
                    });
            } else d.setAttribute("src", e);
        },
        getInitParams: function () {
            return b.initParams;
        },
        getQueryParams: function () {
            return b.queryParams;
        },
    };
}
function ZSDK() {
    function b() {
        return "function" != typeof t ? void w.Error("No OnLoad Handler provided to execute.") : A ? void w.Error("OnLoad event already triggered.") : (t.call(m, m), void (A = !0));
    }
    function d() {
        u.call(m, m);
    }
    function e() {
        return y;
    }
    function c(a, b, c) {
        return ZSDKMessageManager.TriggerEvent(a, b, c);
    }
    function a(a) {
        w.Info("Setting AppContext data");
        var b = (a && a.model) || {};
        a && a.locale;
        // eslint-disable-next-line no-unused-expressions
        a && a.localeResource;
        if ((isDevMode && a.locale && a.localeResource && 0 === Object.keys(a.localeResource).length && a.localeResource.constructor === Object && a.locale && p(a.locale), "undefined" != typeof ZSDKModelManager)) {
            for (var c in b) ZSDKModelManager.AddModel(c, b[c]);
            m.Model = ZSDKModelManager.GetModelStore();
        }
        f = a.uniqueID;
        n = a.connectors;
        w.Info("App Connectors ", n);
        y = !0;
    }
    function k() {
        return f;
    }
    function h(a) { }
    function v() {
        return n;
    }
    function p(a) {
        q("/app-translations/" + a + ".json", function (a) {
            z = JSON.parse(a);
            x();
        });
    }
    function q(a, b) {
        var c = new XMLHttpRequest();
        c.open("GET", a, !1);
        c.onreadystatechange = function () {
            4 == c.readyState && "200" == c.status && b(c.responseText);
        };
        c.send(null);
    }
    function g(a, b, c) {
        for (var l = ""; l != a;) (l = a), (a = a.replace(b, c));
        return a;
    }
    function r(a, b) {
        b = b.replace(/\[(\w+)\]/g, ".$1");
        b = b.replace(/^\./, "");
        b = b.split(".");
        for (var c = 0, l = b.length; c < l; ++c) {
            var d = b[c];
            if (!(d in a)) return;
            a = a[d];
        }
        return a;
    }
    function x() {
        var a = document.querySelectorAll("[data-i18n]"),
            b;
        for (b in a)
            if (a.hasOwnProperty(b)) {
                var c = r(z, a[b].getAttribute("data-i18n"));
                if (!c) return !1;
                if (a[b].hasAttribute("data-options")) {
                    var l = JSON.parse(JSON.stringify(eval("(" + a[b].getAttribute("data-options") + ")"))),
                        d = Object.keys(l),
                        f;
                    for (f in d) c = g(c, "${" + d[f] + "}", l[d[f]]);
                }
                a[b].innerHTML = c;
            }
    }
    var t,
        u,
        n,
        l,
        f,
        z = {},
        w = ZSDKUtil.getLogger(),
        y = !1,
        A = !1;
    this.isContextReady = !1;
    this.HelperContext = {};
    this.isDevMode = !1;
    this.getContext = function () {
        return m;
    };
    var m = { Model: {}, Event: {} };
    m.Event.Listen = function (a, b) {
        ZSDKEventManager.AttachEventListener(a, b);
    };
    m.Event.Trigger = c;
    m.GetRequest = function (a) {
        return ZSDKMessageManager.SendRequest(a);
    };
    m.QueryParams = l;
    m.Translate = function (a, b) {
        var c = "";
        if ((a && (c = r(z, a)), !c)) return !1;
        if (b) {
            b = JSON.parse(JSON.stringify(eval(b)));
            var l = Object.keys(b);
            for (a in l) c = g(c, "${" + l[a] + "}", b[l[a]]);
        }
        return c;
    };
    this.OnLoad = function (a) {
        if ("function" != typeof a) throw Error("Invalid Function value is passed");
        t = a;
        y && b();
    };
    this.OnUnLoad = function (a) { };
    this.OnContextUpdate = function (a) {
        u = a;
    };
    (function () {
        l = ZSDKUtil.GetQueryParams();
        isDevMode = !!l.isDevMode;
        var f = {};
        f.isDevMode = isDevMode;
        f.ExecuteLoadHandler = b;
        f.SetContext = a;
        f.UpdateContext = h;
        f.QueryParams = l;
        f.GetConnectors = v;
        f.TriggerEvent = c;
        f.ExecuteContextUpdateHandler = d;
        f.getUniqueID = k;
        f.isAppRegistered = e;
        var g = ZSDKMessageManager.Init(f);
        window.addEventListener("message", g);
        window.addEventListener("unload", function () {
            ZSDKMessageManager.DERegisterApp();
        });
        "undefined" != typeof ZSDKModelManager && ZSDKModelManager.Init(f);
        ZSDKMessageManager.RegisterApp();
    })();
}
var ZSDKUtil = (function (b) {
    function d(a) { }
    function e(a) {
        var b = {};
        return (
            (a = a || window.location.href),
            a
                .substr(a.indexOf("?") + 1)
                .split("\x26")
                .forEach(function (a, c) {
                    a = a.split("\x3d");
                    b[a[0]] = a[1];
                }),
            b.hasOwnProperty("serviceOrigin") && (b.serviceOrigin = decodeURIComponent(b.serviceOrigin)),
            b
        );
    }
    var c,
        a = e();
    return (
        (d.prototype.Info = function () {
            (b.isDevMode() || b.isLogEnabled()) && window.console.info.apply(null, arguments);
        }),
        (d.prototype.Error = function () {
            (b.isDevMode() || b.isLogEnabled()) && window.console.error.apply(null, arguments);
        }),
        (b.GetQueryParams = e),
        (b.isDevMode = function () {
            return a && a.isDevMode;
        }),
        (b.isLogEnabled = function () {
            return a && a.isLogEnabled;
        }),
        (b.getLogger = function () {
            return (c && c instanceof d) || (c = new d()), c;
        }),
        (b.Sleep = function (a) {
            for (var b = new Date().getTime(); b + a > new Date().getTime(););
        }),
        b
    );
})(window.ZSDKUtil || {})

const    ZSDKMessageManager = (function (b) {
        function d(b) {
            try {
                var f = "string" == typeof b.data ? JSON.parse(b.data) : b.data;
            } catch (B) {
                f = b.data;
            }
            var l = f.type,
                d = f.eventName;
            try {
                var h;
                if (!(h = "SET_CONTEXT" === d)) {
                    var n = b.source,
                        m = b.origin;
                    h = !(!g.isAppRegistered() || r !== n || x !== m) || Error("Un-Authorized Message.");
                }
                if (h)
                    switch (l) {
                        case "FRAMEWORK.EVENT":
                            var q = (f.data, f.eventName),
                                p = { SET_CONTEXT: e, UPDATE_CONTEXT: c, EVENT_RESPONSE: a, EVENT_RESPONSE_FAILURE: k }[q];
                            p && "function" == typeof p ? p(b, f) : ZSDKEventManager.NotifyEventListeners(g.AppContext, f.eventName, f.data);
                            break;
                        default:
                            g.MessageInterceptor(b, f);
                    }
            } catch (B) {
                t.Error("[SDK.MessageHandler] \x3d\x3e ", B.stack);
            }
        }
        function e(a, b) {
            a.origin;
            r = window.parent;
            x = g.QueryParams.serviceOrigin;
            g.SetContext(b.data);
            g.ExecuteLoadHandler();
        }
        function c(a, b) { }
        function a(a, b) {
            h(b.promiseid, !0, b.data);
        }
        function k(a, b) {
            h(b.promiseid, !1, b.data);
        }
        function h(a, b, c) {
            n.hasOwnProperty(a) && (b ? n[a].resolve(c) : n[a].reject(c), (n[a] = void 0), delete n[a]);
        }
        function v(a) {
            return new Promise(function (b, c) {
                n[a] = { resolve: b, reject: c, time: new Date().getTime() };
            });
        }
        function p(a) {
            if (("object" == typeof a && (a.appOrigin = encodeURIComponent(q())), !r)) throw Error("Parentwindow reference not found.");
            r.postMessage(a, g.QueryParams.serviceOrigin);
        }
        function q() {
            return window.location.protocol + "//" + window.location.host + window.location.pathname;
        }
        var g,
            r,
            x,
            t = ZSDKUtil.getLogger(),
            u = 100,
            n = {};
        /^https?:\/\/[a-zA-Z0-9-_]*.(csez.zohocorpin.com|zoho.com|zohoplatform.com|zohosandbox.com)(:[0-9]{0,4})?$/;
        return (
            (b.Init = function (a, c) {
                if (!a || "object" != typeof a) throw Error("Invalid Context object passed");
                if (c && "object" != typeof c) throw Error("Invalid Configuration Passed to MessageManager");
                return (g = a), d.bind(b);
            }),
            (b.RegisterApp = function () {
                var a = { type: "SDK.EVENT", eventName: "REGISTER", appOrigin: encodeURIComponent(q()) };
                window.top.postMessage(a, g.QueryParams.serviceOrigin);
            }),
            (b.DERegisterApp = function () {
                p({ type: "SDK.EVENT", eventName: "DEREGISTER", uniqueID: g.getUniqueID() });
            }),
            (b.SendRequest = function (a) {
                if (!a || "object" != typeof a) throw Error("Invalid Options passed");
                var b = "Promise" + u++;
                p({ type: "SDK.EVENT", eventName: "HTTP_REQUEST", uniqueID: g.getUniqueID(), time: new Date().getTime(), promiseid: b, data: a });
                a = v(b);
                return a;
            }),
            (b.TriggerEvent = function (a, b, c) {
                if (!a) throw Error("Invalid Eventname : ", a);
                var d = c ? "Promise" + u++ : void 0;
                if ((p({ type: "SDK.EVENT", eventName: a, uniqueID: g.getUniqueID(), time: new Date().getTime(), promiseid: d, data: b }), c)) return v(d);
            }),
            b
        );
    })(window.ZSDKMessageManager || {}),
    ZSDKEventManager = (function (b) {
        var d = ZSDKUtil.getLogger(),
            e = {};
        return (
            (b.AttachEventListener = function (b, a) {
                "function" == typeof a && (Array.isArray(e[b]) || (e[b] = []), e[b].push(a));
            }),
            (b.NotifyEventListeners = function (b, a, k) {
                var c = a.match(/^__[A-Za-z_]+__$/gi);
                if ((c = (Array.isArray(c) && c.length, e[a])) && Array.isArray(c)) for (a = 0; a < c.length; a++) c[a].call(b, k);
                else d.Info("Cannot find EventListeners for Event : ", a);
            }),
            (b.NotifyInternalEventHandler = function (b, a) {
                var c = a.eventName;
                "__APP_INIT__" === c ? (b.SetContext(a.data), b.ExecuteLoadHandler()) : "__APP_CONTEXT_UPDATE__" === c && (b.UpdateContext(a.data), b.ExecuteContextUpdateHandler());
            }),
            b
        );
    })(window.ZSDKEventManager || {});
