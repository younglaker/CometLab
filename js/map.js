$(document).ready(function() {

    var Map = qq.maps.Map;
    var Marker = qq.maps.Marker;
    var LatLng = qq.maps.LatLng;
    var Event = qq.maps.event;
    var MarkerImage = qq.maps.MarkerImage;
    var Point = qq.maps.Point;
    var Size = qq.maps.Size;
    var Translate = qq.maps.convertor.translate;
    var Heading = qq.maps.geometry.spherical.computeHeading;
    var Distance = qq.maps.geometry.spherical.computeDistanceBetween;
    var Offset = qq.maps.geometry.spherical.computeOffset;
    var OffsetOrigin = qq.maps.geometry.spherical.computeOffsetOrigin;

    var _arc = 2 * Math.PI / 360;  //  用于计算弧度，js的三角函数用弧度不是角度

    var _base_url = "http://42.96.140.187:7788/"; //接口地址
    var _map;
    var _user_token = $.userToken(); // 用户token
    var _user_mapPos;  // 用户当前坐标,是地图的LatLng类的实例 LatLng(lat,lng)
    var _user_txLat; // 用户当前腾讯latitude
    var _user_txLng; // 用户当前腾讯longitude
    var _user_gpsPos;  // 用户当前gps坐标,字符串 "lng,lat"
    var _user_gpsLat; // 用户当前gps latitude
    var _user_gpsLng; // 用户当前gps longitude
    var _marker;  // 用户当前坐标的标记
    var _lomo_mark = []; // 萌袋数组
    var _arrow_mark = []; // 箭头数组
    var _icon_lomo = new qq.maps.MarkerImage(
        "img/pack.png"
    );
    var _icon_arrow = new qq.maps.MarkerImage(
        "img/arrow.png"
    );
    var _icon_arrow_size = new qq.maps.Size(30, 30);
    var _icon_arrow_anchor = new qq.maps.Point(15, 15);
    var _data; // 请求返回的萌袋json数据
    var _team; // 请求返回的队伍json数据
    var _teamMate = []; // 请求返回的同队成员json数据

    init();
    checkin(); // 签到

    // 每5秒更新一次地图数据
/*    var _loop = setInterval(
        function() {
            update();
        }, 5000
    );*/

    // 每30秒更新一次队伍数据
/*    var _loop = setInterval(
        function() {
            myTeam();
        }, 30000
    );*/
    // clearInterval(nIntervId)

    // 浏览器窗口变化时重置地图大小
    $(window).resize(setMapSize);

/*console.log("原来的GPS:39.933676862706776,116.35608315379092");
var arr2 = TransGPS.gcj_encrypt(39.933676862706776, 116.35608315379092);
console.log("腾讯坐标:" + arr2['lat']+","+arr2['lon']);
var arr3 = TransGPS.gcj_decrypt_exact(arr2['lat'], arr2['lon']);
console.log('逆算成GPS:' + arr3['lat']+","+arr3['lon']);*/

    /*
     * 设置地图高度
     */
    function setMapSize() {
        var w = $(window).width();
        var h = $(window).height() - 70;
        $(".map").css({
            width: w + "px",
            height:  h + "px"
        });
    }

    /*
     * 初始化地图、用户坐标
     */
    function init() {
        setMapSize();
        if (navigator.geolocation) {
            /*navigator.geolocation.getCurrentPosition(function(position) {
                _user_gpsLat = position.coords.latitude;
                _user_gpsLng = position.coords.longitude;*/
                _user_gpsLat = "24.2708458";
                _user_gpsLng = "109.4412615";
                _user_gpsPos = _user_gpsLng + "," + _user_gpsLat;

                // 调用地图命名空间中的转换接口 type的可选值为
                // 1:gps经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
                Translate(new LatLng(_user_gpsLat, _user_gpsLng), 1, function(res) {
                    // 取出经纬度并且赋值
                    _user_mapPos = res[0];
                    _user_txLat = res[0].lat;
                    _user_txLng = res[0].lng;

                    // 创建地图
                    _map = new Map(document.getElementById("map"), {
                        center          : _user_mapPos,
                        zoom            : 17,
                        mapTypeId       : qq.maps.MapTypeId.ROADMAP,
                        panControl   : false,    // 平移控件
                        zoomControl  : false,   // 缩放控件
                        scaleControl : false,  // 比例尺控件
                        // draggable       : false     // 设置是否可以拖拽
                    });

                    //创建当前用户坐标Marker
                    _marker = new Marker({
                        position : _user_mapPos, //设置Marker的位置坐标
                        map      : _map //设置显示Marker的地图
                    });

                    Event.addListener(_map, 'bounds_changed', nearbyLomo);

                    nearbyLomo();
                    myTeam();
                });

            // });

        } else {
            $("#map").insert("当前浏览器不支持");
        }
    }
    // 结束：初始化地图、用户坐标
    //-----------------------------------

    /*
     * 更新
     */
    function update() {
        setMapSize();
        if (navigator.geolocation) {
            /*navigator.geolocation.getCurrentPosition(function(position) {
                _user_gpsLat = position.coords.latitude;
                _user_gpsLng = position.coords.longitude;*/
                _user_gpsLat = "24.2708458";
                _user_gpsLng = "109.4412615";
                _user_gpsPos = _user_gpsLng + "," + _user_gpsLat;

                Translate(new LatLng(_user_gpsLat, _user_gpsLng), 1, function(res) {
                    // 取出经纬度并且赋值
                    _user_mapPos = res[0];
                    _user_txLat = res[0].lat;
                    _user_txLng = res[0].lng;

                    // 地图中心位置更新用户坐标
                    // 级别15及其以上，不可以拖拽
                    if (_map.getZoom() >= 15) {
                        _map.panTo(_user_mapPos);
                    }

                    // 删除旧的用户marker
                    _marker.setMap(null);

                    //创建当前用户坐标Marker
                    _marker = new Marker({
                        position : _user_mapPos, //设置Marker的位置坐标
                        map      : _map //设置显示Marker的地图
                    });
                });

                Event.addListener(_map, 'bounds_changed', nearbyLomo);

                nearbyLomo();

            // });

        } else {
            $("#map").insert("当前浏览器不支持");
        }
    }
    // 结束：初始化地图、用户坐标
    //-----------------------------------

    /*
     * 获取附近萌袋数据
     */
    function nearbyLomo () {
        var pos;

        // 级别15及其以上，使用用户坐标，否则使用地图中心坐标
        if (_map.getZoom() >= 15) {
            pos = _user_gpsPos;
        } else {
            pos = _map.getCenter().lng + "," + _map.getCenter().lat;
        }

        $.ajax({
            type: "GET",
            url: _base_url + "bag-list",
            dataType : "jsonp",
            crossDomain: true,
            data: {
                token: _user_token, // 身份标识符
                pos: _user_gpsPos // 当前GPS坐标
            }
        }).success(function(msg) {

            _data = msg.DATA.list;

            setLomo(_data);
            boundsChange();

        }).fail(function(msg) {
            console.log(msg);
        });
        // -------end ajax----------
    }
    // 结束：获取附近萌袋数据
    //-----------------------------------

    /*
     * 放置附近的萌袋mark
     */
    function setLomo(_data) {

        // 清除原有的地图标记
        if (_lomo_mark.length !== 0) {
            for (var i in _lomo_mark) {
                if (_lomo_mark[i].marker) {
                    _lomo_mark[i].marker.setMap(null);
                }
            }
        }

        _lomo_mark = [];  // 清空数组

        for(var i = 0; i < _data.length; i++) {
            (function(n) {

                var pos = exchgPos(_data[i].pos); // 返回 {'lat': '', 'lon': ''}，注意是lon不是lng

                _lomo_mark[n] = {
                    "marker"      : "", // 地图上mark
                    "mapLatLng"   : "", // 萌袋所在坐标的LatLng实例
                    // 'posLngLat'   : '', // 萌袋所在坐标
                    'id'          : '', // 萌袋id
                    'type'        : 0, // 萌袋类型
                    'title'       : '', // 标题
                    'balance_lmc' : 0, // 余邻萌币数
                    'total_lmc'   : 0, // 总邻萌币数
                    'join_num'    : 0, // 参加人数
                    'total_num'   : 0, // 总可参加人数
                    'start'       : 0, // 有效期开始时间
                    'end'         : 0, // 有效期截止时间
                    'dis'         : 0, // 用户与萌袋的距离
                    'personal'    : 0, // 找到的萌袋获得的邻萌币个人奖励数
                    'group'       : 0, // 找到的萌袋获得的邻萌币团队奖励数
                    'balance'     : 0, // 萌袋余额
                    'join'        : 0 // 剩余可领取人数
                };

                _lomo_mark[n].mapLatLng   = new LatLng(pos.lat, pos.lon);
                // _lomo_mark[n].posLngLat   = pos;
                _lomo_mark[n].id          = _data[i].id;
                _lomo_mark[n].type        = _data[i].type;
                _lomo_mark[n].title       = _data[i].title;
                _lomo_mark[n].balance_lmc = _data[i].balance_lmc;
                _lomo_mark[n].total_lmc   = _data[i].total_lmc;
                _lomo_mark[n].join_num    = _data[i].join_num;
                _lomo_mark[n].total_num   = _data[i].total_num;
                _lomo_mark[n].end         = _data[i].end;
                _lomo_mark[n].dis         = Distance(_user_mapPos, _lomo_mark[n].mapLatLng).toFixed(0);

                _lomo_mark[n].marker = new Marker({
                    position: _lomo_mark[n].mapLatLng,
                    map: _map
                });

                _lomo_mark[n].marker.setIcon(_icon_lomo);

                // 点击萌袋获取详情弹框
                Event.addListener(_lomo_mark[n].marker, 'click', function() {
                    // 当用户和萌袋距离20米以内且缩放在15级别以上,就算找到萌袋
                    if (_lomo_mark[n].dis < 10 && _map.getZoom() >= 15) {

                        $.ajax({
                            type: "GET",
                            url: _base_url + "bag-find",
                            dataType : "jsonp",
                            crossDomain: true,
                            data: {
                                token: _user_token, // 身份标识符
                                id: _lomo_mark[n].id, // 萌袋ID
                                pos: _user_gpsPos // 当前GPS坐标
                            }
                        }).success(function(msg) {

                            if (msg.ISOK == 1) {
                                /*_lomo_mark[n].personal = msg.DATA.personal;
                                _lomo_mark[n].group    = msg.DATA.group;
                                _lomo_mark[n].balance  = msg.DATA.balance;
                                _lomo_mark[n].join     = msg.DATA.join;*/

                                $.lakerPopup.packPopup({
                                    type        : "get",
                                    id          : _lomo_mark[n].id,
                                    title       : _lomo_mark[n].title,
                                    personal    : msg.DATA.personal,
                                    group       : msg.DATA.group,
                                    balance     : msg.DATA.balance,
                                    join        : msg.DATA.join
                                }, _user_mapPos, _lomo_mark[n].mapLatLng);
                            }
                        }).fail(function(msg) {
                            console.log(msg);
                        });
                        // -------end ajax()----------

                    } else {
                        var days;
                        var tt = new Date();
                        var yy = tt.getFullYear();
                        var mm = tt.getMonth() + 1;
                        var dd = tt.getDate();
                        var today = yy + '/' + mm + '/' + dd;
                        var today_timstamp = new Date(today).getTime() / 1000;

                        days = parseInt( (_lomo_mark[n].end - today_timstamp) / 60 / 60 / 24 );

                        $.lakerPopup.packPopup({
                            type        : "check",
                            id          : _lomo_mark[n].id,
                            title       : _lomo_mark[n].title,
                            dis         : _lomo_mark[n].dis,
                            coins       : _lomo_mark[n].balance_lmc + "/" + _lomo_mark[n].total_lmc,
                            people      : _lomo_mark[n].join_num + "/" + _lomo_mark[n].total_num,
                            days        : days
                        }, _user_mapPos, _lomo_mark[n].mapLatLng);
                    }
                    // -------end if()----------

                });
                // -------end addListener()----------
            })(i);
        }
        // -------end for()----------
    }
    // 结束：放置附近的萌袋mark
    //-----------------------------------

    /*
     * 地图缩放时，边界变动，放置萌袋和箭头
     */
    function boundsChange() {
        var bounds = _map.getBounds();     // 获取函数范围
        var nLat = bounds.getNorthEast().getLat();  //地图边界北纬
        var eLng = bounds.getNorthEast().getLng();  //地图边界东经
        var sLat = bounds.getSouthWest().getLat();  //地图边界南纬
        var wLng = bounds.getSouthWest().getLng();  //地图边界西经

        var coord_ne = new LatLng(nLat, eLng);  // 地图边界东北角
        var coord_nw = new LatLng(nLat, wLng);  // 地图边界西北角
        var coord_se = new LatLng(sLat, eLng);  // 地图边界东南角
        var coord_sw = new LatLng(sLat, wLng);  // 地图边界西南角
        var coord_right = new LatLng((nLat - sLat) / 2 + sLat, eLng);  // 地图边界右边界中心点
        var coord_top = new LatLng(nLat, (eLng - wLng) / 2  + wLng);  // 地图边界上边界中心点

        var arc_user_ne = Heading(_user_mapPos, coord_ne);  // 用户与东北角的航向
        var arc_user_nw = Heading(_user_mapPos, coord_nw);  // 用户与西北角的航向
        var arc_user_se = Heading(_user_mapPos, coord_se);  // 用户与东南角的航向
        var arc_user_sw = Heading(_user_mapPos, coord_sw);  // 用户与西南角的航向

        var dis_hori = Distance(_user_mapPos, coord_right);  // 地图横向长度的一半
        var dis_vert = Distance(_user_mapPos, coord_top);  // 地图纵向长度的一半
        var dis_arrow,  // 箭头与用户的距离
            coord_arrow,  // 箭头坐标
            mark_arrow,  // 箭头图标
            icon_arrow;  // 箭头icon

        // 级别15及其以上，不可以拖拽
        if (_map.getZoom() >= 15) {
            _map.panTo(_user_mapPos);
        }

        // 清除原有的地图标记
        if (_arrow_mark.length !== 0) {
            for (var i in _arrow_mark) {
                if (_arrow_mark[i].marker) {
                    _arrow_mark[i].marker.setMap(null);
                }
            }
        }

        _arrow_mark = [];  // 清空数组

        // 放置附近的箭头mark
        for(var j = 0; j < _data.length; j++) {
            (function(m) {

                // 当萌袋在页面内，不需要箭头指向
                if ( _lomo_mark[j].mapLatLng.lng > wLng && _lomo_mark[j].mapLatLng.lng < eLng && _lomo_mark[j].mapLatLng.lat > sLat && _lomo_mark[j].mapLatLng.lat < nLat )
                    return false;


                _arrow_mark[m] = {"marker": "", "dis": "", "coord": "", "arc": ""};

                _arrow_mark[m].arc = Heading(_user_mapPos, _lomo_mark[j].mapLatLng);  //用户与萌袋的航向

                // 在左右两侧（东边或西边）
                if ( Math.abs(_arrow_mark[m].arc) >= arc_user_ne && Math.abs(_arrow_mark[m].arc) <= arc_user_se ) {
                    // 航向小于90度，东或西边的上半部分
                    if (Math.abs(_arrow_mark[m].arc) <= 90) {

                        //  如果直接用dis_hori，箭头就会落在边缘，所以取5/6
                        _arrow_mark[m].dis = (dis_hori * 5 / 6) / Math.sin( Math.abs(_arrow_mark[m].arc) * _arc);

                    // 航向大于90度，东或西边的下半部分
                    } else {
                        _arrow_mark[m].dis = (dis_hori * 5 / 6) / Math.cos( ( Math.abs( _arrow_mark[m].arc ) - 90 ) * _arc );
                    }

                // 上下两侧（北边或南边）
                } else {
                    // 航向小于90度，上半部分
                    if (Math.abs(_arrow_mark[m].arc) <= 90) {

                        _arrow_mark[m].dis = (dis_vert * 5 / 6) / Math.cos( Math.abs(_arrow_mark[m].arc) * _arc);

                    // 航向大于90度，下半部分
                    } else {

                        _arrow_mark[m].dis = (dis_vert * 5 / 6) / Math.cos( ( 180 - Math.abs(_arrow_mark[m].arc) ) * _arc);
                    }

                }
                // ------- end if() 判断箭头位置 ----------

                _arrow_mark[m].coord = qq.maps.geometry.spherical.computeOffset(_user_mapPos, _arrow_mark[m].dis, _arrow_mark[m].arc );

                _arrow_mark[m].marker = new Marker({
                    position: _arrow_mark[m].coord,
                    map: _map
                });

                icon_arrow = setArrow(_arrow_mark[m].arc, arc_user_ne, arc_user_nw, arc_user_se, arc_user_sw);
                _arrow_mark[m].marker.setIcon(icon_arrow);

            })(j);
        }
        // -------end for()----------
    }
    // -------end boundsChange()----------

    /*
     * 计算箭头方向并放置
     */
    function setArrow(arc, arc_ne, arc_nw, arc_se, arc_sw) {

        var origin, icon;
        var n;

        if (arc === -180) n = 0;
        else if (-180 <= arc && arc <= -150) n = 1;
        else if (-150 < arc && arc <= -120) n = 2;
        else if (-120 < arc && arc <= -100) n = 3;
        else if (-100 < arc && arc <= -70) n = 4;
        else if (-80 < arc && arc <= -60) n = 5;
        else if (-60 < arc && arc <= -30) n = 6;
        else if (-30 < arc && arc <= -10) n = 7;
        else if (-10 < arc && arc <= 10) n = 8;
        else if (10 < arc && arc <= 30) n = 9;
        else if (30 < arc && arc <= 60) n = 10;
        else if (60 < arc && arc <= 80) n = 11;
        else if (80 < arc && arc <= 100) n = 12;
        else if (100 < arc && arc <= 120) n = 13;
        else if (120 < arc && arc <= 150) n = 14;
        else if (150 < arc && arc <= 170) n = 15;
        else if (170 < arc && arc < 180) n = 16;

        origin = new qq.maps.Point(0, 30 * n);

        return icon = new qq.maps.MarkerImage(
            "img/arrows.png",
            _icon_arrow_size,
            origin,
            _icon_arrow_anchor
        );
    }
    // -------end setArrow()----------

    /*
     * 经纬度对换
     */
    function exchgPos(pos) {
        var p = pos.split(",");

        return  TransGPS.gcj_encrypt(parseFloat(p[1]), parseFloat(p[0]));
        // 返回 {'lat': '', 'lon': ''}，注意是lon不是lng
    }
    // -------end 经纬度对换----------

    /*
     * 签到
     */
    function checkin() {
        $.ajax({
            type: "GET",
            url: _base_url + "signin",
            dataType : "jsonp",
            crossDomain: true,
            data: {
                token: _user_token, // 身份标识符
                pos: _user_gpsPos // 当前GPS坐标
            }
        }).success(function(msg) {

            if (msg.ISOK == 1) {
                $.lakerPopup.tip({
                    content: "您今日签到成功，获得" + msg.DATA.count + "LMC"
                });
            } else if (msg.ISOK == 50) { //新用户首次签到
                $.lakerPopup.fresh();
            }
        }).fail(function(msg) {
            console.log(msg);
        });
    }
    // -------end 签到----------

    /*
     * 我的队伍
     */
    function myTeam() {
        $.ajax({
            type: "GET",
            url: _base_url + "group-mine",
            dataType : "jsonp",
            crossDomain: true,
            data: {
                token: _user_token // 身份标识符
            }
        }).success(function(msg) {
            $(".avatar_list").html(""); // 清空之前显示的队伍
            _team = []; // 清空之前存储的数据

            if (msg.ISOK == 1) {
                _team[0] = msg.DATA;

                $(".team_name")
                    .html(_team[0].title + " 的领萌小队")
                    .data("teamid", _team[0].id);

                $(".team_exit")
                    .html("退出队伍")
                    .click(function(){
                        exitTeam();
                    });
                getTeamMate();
            } else {
                nearbyTeam();
            }
        }).fail(function(msg) {
            console.log(msg);
        });
    }
    // -------end 我的队伍----------

    /*
     * 附近队伍
     */
    function nearbyTeam() {
        $(".avatar_list").html(""); // 清空之前显示的队伍
        _team = []; // 清空之前存储的数据
        $.ajax({
            type: "GET",
            url: _base_url + "group-list",
            dataType : "jsonp",
            crossDomain: true,
            data: {
                token: _user_token, // 身份标识符
                pos: _user_gpsPos // 当前GPS坐标
            }
        }).success(function(msg) {
            // console.log(msg);
            if (msg.ISOK == 1) {
                var $avatar_list = $(".avatar_list");

                $(".team_name")
                    .html("附近队伍")
                    .data("teamid", "");

                for (var i = 0; i < msg.DATA.list.length; i++) {
                    _team[i] = msg.DATA.list[i];
                    var li = '<li class="team_acatar" data-teamid="' + _team[i].id + '"><img src="' + _team[i].img + '" alt="team_acatar"></li>';
                    $avatar_list.append(li);
                }

                $(".avatar_block").on("click", ".team_acatar", function(e){
                    $(".bottom_noti").remove(); //删除底部系统公告
                    teamBlock($(this).data("teamid"));
                });
            }
        }).fail(function(msg) {
            console.log(msg);
        });
    }
    // -------end 附近队伍----------

    /*
     * 获取成员信息（未加入）
     */
    function getTeamInfo(teamid) {
        $.ajax({
            type: "GET",
            url: _base_url + "group-member",
            dataType : "jsonp",
            crossDomain: true,
            data: {
                token: _user_token, // 身份标识符
                gid: teamid // 队伍ID
            }
        }).success(function(msg) {
            if (msg.ISOK == 1) {
                var $avatar_list = $(".avatar_list");
                $avatar_list.html("");
                _teamMate = [];
                for (var i = 0; i < msg.DATA.list.length; i++) {

                    _teamMate[i] = msg.DATA.list[i];

                    var li = '<li class="mate_avatar"><img src="' + msg.DATA.list[i].img + '" alt="mate_avatar"></li>';
                    $avatar_list.append(li);
                }
            }
        }).fail(function(msg) {
            console.log(msg);
        });
    }
    // -------end 获取成员信息（未加入）----------

    /*
     * 获取队友信息（已加入）
     */
    function getTeamMate() {
        $.ajax({
            type: "GET",
            url: _base_url + "group-member",
            dataType : "jsonp",
            crossDomain: true,
            data: {
                token: _user_token, // 身份标识符
                gid: _team[0].id // 队伍ID
            }
        }).success(function(msg) {
            if (msg.ISOK == 1) {
                var $avatar_list = $(".avatar_list");

                $avatar_list
                    .html("")
                    .addClass("teamed");
                _teamMate = [];

                for (var i = 0; i < msg.DATA.list.length; i++) {

                    _teamMate[i] = msg.DATA.list[i];

                    var li = '<li class="mate_avatar"><img src="' + msg.DATA.list[i].img + '" alt="avatar"></li>';

                    $(li).appendTo(".avatar_list")
                        .data("order", i)
                        .click(function() {
                            if ($avatar_list.hasClass("im_act")) { // 若在群聊界面，则显示队友战绩
                                mateAward(_teamMate[$(this).data("order")]);
                            } else { // 显示群聊界面
                                $avatar_list.addClass("im_act");
                                $(".bottom_noti").remove(); //删除底部系统公告
                                imBlock();
                            }
                        });
                }
            }
        }).fail(function(msg) {
            console.log(msg);
        });
    }
    // -------end 获取队友信息（已加入）----------

    /*
     * 已关注时的聊天框
     */
    function imBlock() {
        var w = $(window).width();
        var h = $(window).height() - 70;
console.log("imblock");
        if ($(".im_block").length) { // 如果已有im_block，则显示
            $(".im_block").show();
        } else { // 若没有，则创建
            $('<div class="im_block"><div data-page="home" class=" page navbar-fixed toolbar-fixed">\
                    <!-- 发送框 -->\
                    <div class="toolbar messagebar">\
                        <div class="toolbar-inner">\
                            <textarea placeholder="说两句..." class="msgbar"></textarea><a href="#" class="link send">发送</a>\
                        </div>\
                    </div>\
                    <!-- /发送框 -->\
                    <div class="page-content messages-content">\
                        <div class="messages messages-auto-layout">\
                        </div>\
                    </div>\
                </div></div>')
                .appendTo(".page-content")
                .css({
                    width: w + "px",
                    height:  h + "px"
                });

            $('<div class="im_btn_close">关闭群聊</div>')
                .appendTo(".im_block")
                .click(function(){
                    $(".im_block").hide();
                    $(".avatar_list").removeClass("im_act");
                });
            $("body").on("click", ".send", function(e){
                $.sendMsg();
            });
            $("body").on("focus", ".msgbar", function(e){
                $("html, body").animate({
                    scrollTop: $(document).height()
                }, "slow");
            });
        }

    }
    // -------end 已关注时的聊天框----------

    /*
     * 未关注时的聊天框
     */
    function teamBlock(teamid) {
        var w = $(window).width();
        var h = $(window).height() - 70;

        getTeamInfo(teamid);

        $('<div class="team_block"></div>')
            .appendTo(".page-content")
            .css({
                width: w + "px",
                height:  h + "px"
            });

        $('<div class="row control_btn team_btm_block">\
                <div class="col-50 btn_block">\
                </div>\
            </div>')
            .appendTo(".team_block");

        $('<button class="button team_btn_add">确认加入</button>')
            .appendTo(".team_btm_block .btn_block")
            .click(function(){
                joinTeam(teamid);
            });

        $('<div class="team_btn_close">关闭群聊</div>')
            .appendTo(".team_btm_block .btn_block")
            .click(function(){
                $(".team_block").remove();
                nearbyTeam();
            });
    }
    // -------end 未关注时的聊天框----------

    /*
     * 加入队伍
     */
    function joinTeam(teamid) {
        $.ajax({
            type: "GET",
            url: _base_url + "group-join",
            dataType : "jsonp",
            crossDomain: true,
            data: {
                token   : _user_token, // 身份标识符
                pos     : _user_gpsPos, // 当前GPS坐标
                gid     : teamid // 队伍ID
            }
        }).success(function(msg) {
            console.log(msg);
            if (msg.ISOK == 1) {
                _team = [];
                $(".team_exit")
                    .html("退出队伍")
                    .click(function(){
                        exitTeam();
                    });
                $.lakerPopup.tip({
                    content: "已加入该队伍"
                });
                $(".team_block").remove();
                myTeam();
            }
        }).fail(function(msg) {
            console.log(msg);
        });
    }
    // -------end 加入队伍----------

    /*
     * 退出队伍
     */
    function exitTeam() {
        $.ajax({
            type: "GET",
            url: _base_url + "group-cancel",
            dataType : "jsonp",
            crossDomain: true,
            data: {
                token: _user_token, // 身份标识符
                gid: _team[0].id // 队伍ID
            }
        }).success(function(msg) {
            if (msg.ISOK == 1) {
                _team = [];
                $(".team_exit").html(""); //把“退出队伍”文字删除
                $.lakerPopup.tip({
                    content: "已退出该队伍"
                });
                $(".avatar_list").removeClass("im_act");
                $(".im_block").remove();
                nearbyTeam();
            }
        }).fail(function(msg) {
            console.log(msg);
        });
    }
    // -------end 退出队伍----------

    /*
     * 点击成员头像显示战绩
     */
    function mateAward(mate) {
        var full_width = $("body").width();
        var full_height = $("body").height();
        var box_width, left;

        $('<div class="award_page"></div>')
            .appendTo("body")
            .css({
                width: full_width + "px",
                height: full_height + "px"
            })
            .click(function(){
                $(this).remove();
            });;

        $('<div class="award_block">\
                <div class="content name">昵称：' + mate.name + '</div>\
                <div class="content id">id：' + mate.id + '</div>\
                <div class="content">加入团队后战绩：</div>\
                <div class="content">获得邻萌：' + mate.coins + '个</div>\
                <div class="content">团队贡献：' + mate.gcoins + '个</div>\
                <div class="content">获得萌袋：' + mate.bags + '个</div>\
            </div>')
            .appendTo(".award_page");

        box_width = $(".award_block").width();
        left = (full_width - box_width) / 2;

        $(".award_block").css({
                left: left + "px",
                top: "90px"
            });

        return false;
    }
    // -------end 点击成员头像显示战绩----------

    /*
     * 队伍头像列表滚动
     */
    $(".avatar_block").on("click", ".left", function(e){
        // 当然ul宽度小于外面的div，就不用滑动
        if ($(".avatar_list").width() <= $(".center").width())
            return false
/*        if ($(".avatar_list").width() <= $(".center").width()) {
            $(".left i, .right i").hide();
            return false
        } else {
            $(".left i, .right i").show();
        }*/

        var img_list = $(".avatar_list"); //图片列表
        var w = img_list.find('li').outerWidth(true); //一个头像的宽度

        img_list.find("li:last").prependTo(img_list);
        img_list.css({"margin-left": -w});
        img_list.animate({"margin-left": 0});
    });

    $(".avatar_block").on("click", ".right", function(e){
        // 当然ul宽度小于外面的div，就不用滑动
        if ($(".avatar_list").width() <= $(".center").width())
            return false
/*        if ($(".avatar_list").width() <= $(".center").width()) {
            $(".left i, .right i").hide();
            return false
        } else {
            $(".left i, .right i").show();
        }*/

        var img_list = $(".avatar_list"); //图片列表
        var w = img_list.find("li").outerWidth(true); //一个头像的宽度

        img_list.animate({"margin-left": -w},function(){
            img_list.find("li").eq(0).appendTo(img_list);
            img_list.css({"margin-left": 0});
        });
    });

    // -------end 队伍头像列表滚动----------

    /*
     * 关闭底部系统消息
     */
    $(".toolbar-inner").on("click", ".bottom_noti_close ", function(e){
        $(".bottom_noti").remove();
    });

    // -------end 关闭底部系统消息----------

});