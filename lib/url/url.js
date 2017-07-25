;(function($){
    var _base_url = "http://42.96.140.187:7788/"; //接口地址

    /*
     * 获取地址参数
     */
    $.URL = function (arg) {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
            // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    };

    $.userToken = function () {
        return $.URL().token || "56d3fd18a20b662c628b4568";
    };

    $.userName = function () {
        return $.URL().unick || "o6_bmjrPTlm7_2s0Vt7hMZOPf92M";
    }

})(window.Zepto || window.jQuery)