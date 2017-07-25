$(document).ready(function() {
	var Map = qq.maps.Map;
    var Marker = qq.maps.Marker;
    var LatLng = qq.maps.LatLng;
    var Event = qq.maps.event;
    var Distance = qq.maps.geometry.spherical.computeDistanceBetween;
    var Translate = qq.maps.convertor.translate;

    var _arc = 2 * Math.PI / 360;  //  用于计算弧度，js的三角函数用弧度不是角度

    var _base_url = "http://42.96.140.187:7788/"; //接口地址
    var _lomo = {token: "", id: "", type: "", title: "", limit: "", coins: "", end: "", mypos: "", pos: "", subtitle: ""};
    var _map;
    var _marker;  // 用户当前坐标的标记
    var _icon_lomo = new qq.maps.MarkerImage(
        "img/pack.png"
    );
    var _map_prompt = $(".map_prompt"); // 地图提示
    var _choice_mark = "";
    var _user_mapPos;  // 用户当前坐标,是地图的LatLng类的实例 LatLng(lat,lng)
    var _user_txLat; // 用户当前腾讯latitude
    var _user_txLng; // 用户当前腾讯longitude
    var _user_gpsPos;  // 用户当前gps坐标,字符串 "lng,lat"
    var _user_gpsLat; // 用户当前gps latitude
    var _user_gpsLng; // 用户当前gps longitude
    var _user_token = $.userToken(); // 用户token

    setImgUpSize();

    // 浏览器窗口变化时重置上传图片、图片预览框的高度
    $(window).resize(setImgUpSize);

    /*
     * 设置上传图片、图片预览框的高度
     */
    function setImgUpSize() {
    	// 减2: 减掉border宽度
        var w = $(".img_upload .img_box").width() - 2;

        $(".img_upload .img_box").css({
            height:  w + "px"
        });

    }

    /*
     * 获取萌袋ID
     */
	$.ajax({
	    type: "GET",
	    url: _base_url + "bag-id",
	    dataType : "jsonp",
	    crossDomain: true,
	    data: {
			token    : _user_token
	    }
	}).success(function(msg) {
	    if (msg.ISOK == 1) {
	    	_lomo.id = msg.DATA.id;
	    }
	}).fail(function(msg) {
	    console.log(msg);
	});
	// 结束：获取萌袋ID
	//-----------------------------------

    /*
     * 发布萌袋
     */
	$(".btn_release").click(function(){

		// 表单检测不通过则停止
		/*if (!checkLomoForm()) {
			return false;
		}*/

		getLomoForm();

 		$.lakerPopup.confirm({
			btn_1     : "取消",
			btn_2     : "确定",
			content   : "<div class='content'>萌袋一经发布，将从您钱包中冻结" + $("#form_coins")				.val() +"邻萌宝。</div><div class='content'>是否发布此萌袋？</div>",
			close     : "btn_1",
			box_class : "edt_conf_1",
			fn: sendConfirm
		});

		return false;
	});
	// 结束：发布萌袋
	//-----------------------------------

    /*
     * 确认弹框
     */
    function sendConfirm() {
    	// 确认发布
		$("body").on("click", ".edt_conf_1 .btn_2 a", function(){
			// sendLomoForm();
			sendImg();
		});
    }

    function editConfirm2(msg) {
		// 关闭
		$("body").on("click", function(){
			console.log("body");
			if ("URL" in msg) {
				window.location.href = msg.URL;
			}
			return false;
		});

		// 关闭
		$("body").on("click", ".edt_conf_2 .btn_1 a", function(){
			if ("URL" in msg) {
				window.location.href = msg.URL;
			}
			return false;
		});

		// 分享
		$("body").on("click", ".edt_conf_2 .btn_2 a", function(e){
			if ("URL" in msg) {
				window.location.href = msg.URL;
			}
			return false;
		});
    }
	// 结束：确认弹框
	//-----------------------------------

    /*
     * 获取表单信息
     */
	function getLomoForm() {
		var date = $("#form_end").val();

		_lomo.title = $("#form_title").val();
		_lomo.limit = $("#form_limit").val();
		_lomo.coins = $("#form_coins").val();
		_lomo.end = new Date(date).getTime() / 1000; // getTime()到毫秒级，除以1000获取秒级
		_lomo.pos = $("#form_pos").val();
		_lomo.subtitle = $("#form_subtitle").val();
	}
	// 结束：获取表单信息
	//-----------------------------------

    /*
     * 发布图片
     */
	function sendImg() {

		        var form_data = new FormData();
		        var file_data = $("#img_input1").prop("files")[0];

		        form_data.append("token", _user_token);
		        form_data.append("id", _lomo.id);
		        form_data.append("img", file_data);
		        $.ajax({
		            type: "POST",
		            url: _base_url + "bag-img",
		            dataType : "json",
		            crossDomain: true,
		            // async: false,	// 注意：保证循环顺利，不用异步
					processData: false,  // 注意：tell jQuery not to process the data
					contentType: false,  // 注意：tell jQuery not to set contentType
		            data: form_data
		        }).success(function(msg) {
		            if (msg.ISOK == 1) {
		            	console.log(msg);
		            } else {
		            	console.log(msg);
		            }

		        }).fail(function(msg) {
		            console.log(msg);
		        });
/*		var img_list = "";
		for (var i = 1; i <= 3 ; i++) {
			if( !$(".img_label" + i).hasClass("no_img") ) {

		        var form_data = new FormData();
		        var file_data = $("#img_input" + i).prop("files")[0];

		        form_data.append("token", _user_token);
		        form_data.append("id", _lomo.id);
		        form_data.append("img", file_data);

		        $.ajax({
		            type: "POST",
		            url: _base_url + "bag-img",
		            dataType : "json",
		            crossDomain: true,
		            // async: false,	// 注意：保证循环顺利，不用异步
					processData: false,  // 注意：tell jQuery not to process the data
					contentType: false,  // 注意：tell jQuery not to set contentType
		            data: form_data
		        }).success(function(msg) {
		            if (msg.ISOK == 1) {
		            	console.log(msg);
		            } else {
		            	console.log(msg);
		            }

		        }).fail(function(msg) {
		            console.log(msg);
		        });
			}
		}*/
	}
	// 结束：发布图片
	//-----------------------------------
	
    /*
     * 发布表单信息
     */
	function sendLomoForm() {
        $.ajax({
            type: "POST",
            url: _base_url + "bag-create",
            dataType : "jsonp",
            crossDomain: true,
            data: {
				token     : _user_token, // 身份标识符
				id        : _lomo.id, // 发布萌袋时获取的ID
				type      : 1, // 萌袋类型：1-手气，2-平均
				title     : _lomo.title, // 萌袋标题
				limit     : _lomo.limit, // 限领人数
				coins     : _lomo.coins, // 总币数
				end       : _lomo.end, // 有效期
				mypos     : _user_gpsPos, // 我的坐标
				pos       : _lomo.pos, // 萌袋放置坐标
				subtitle  : _lomo.subtitle // 简单描述
            }
        }).success(function(msg) {
            if (msg.ISOK == 1) {
		 		$.lakerPopup.confirm({
					btn_1     : "关闭",
					btn_2     : "分享",
					content   : "<div class='content'>萌袋发布成功！</div><div class='content'>分享此萌袋给好友，新用户将成为您的跟班，3个月内您可获得跟班收益的8%！</div>",
					close     : "btn_1",
					box_class : "edt_conf_2",
					fn: editConfirm2(msg)
				});
            } else {
				$.lakerPopup.tip({
					content: msg.MSG
				});
            }

        }).fail(function(msg) {
            console.log(msg);
        });
	}
	// 结束：发布表单信息
	//-----------------------------------

    /*
     * 表单检测
     */
	function checkLomoForm() {
		var valid = true; // 判断表单是否有效的标记
		var tt = new Date();
		var yy = tt.getFullYear();
		var mm = tt.getMonth() + 1;
		var dd = tt.getDate();
		var today = yy + '/' + mm + '/' + dd;

		// 之前有问题的表单样式重置
		$('#form_new_lomo')
			.find("input, textarea")
			.each(function() {
				$(this)
					.attr("placeholder", "")
					.closest("li")
					.css({"border": "none"});
			});

		// 空值检测
		$('#form_new_lomo')
			.find("input, textarea")
			.each(function() {
				if(!$(this).val()) {
					$(this)
						.attr("placeholder", "不能为空")
						.closest("li")
						.css({"border": "1px solid #f00"});
					valid = false;
				}
			});

		// 数值检测
		$('#form_new_lomo')
			.find("#form_limit")
			.each(function() {
				// 取整
				$(this).val(parseInt($(this).val()));

				// 非正数检测
				if($(this).val() <= 0) {
					$(this)
						.val("")
						.attr("placeholder", "请输入大于0的整数")
						.closest("li")
						.css({"border": "1px solid #f00"});
					valid = false;
				}
			});

		// 总币数不能小于人数
		if ($("#form_coins").val() < $("#form_limit").val() ) {
			$("#form_coins")
				.val("")
				.attr("placeholder", "币数要大于人数")
				.closest("li")
				.css({"border": "1px solid #f00"});
			valid = false;
		}

		// 时间检测
		$('#form_new_lomo')
			.find("#form_end")
			.each(function() {
				// 选择的时间不能小于当前日期，通过时间戳判断
				if(new Date($("#form_end").val()).getTime() < new Date(today).getTime()) {
					$(this)
						.closest("li")
						.css({"border": "1px solid #f00"});
					valid = false;
				}
			});

		return valid;
	}
	// 结束：表单检测
	//-----------------------------------

    initMap();

    // 浏览器窗口变化时重置地图大小
    $(window).resize(setMapSize);

    /*
     * 设置地图高度
     */
    function setMapSize() {
        var w = $(window).width();
        var h = $(window).height();
        var h2 = h - 110;
        $(".editor_map_block").css({
            width: w + "px",
            height:  h + "px"
        });
        $("#editor_map").css({
            width: w + "px",
            height:  h2 + "px"
        });
    }
	// 结束：设置地图高度
	//-----------------------------------

    /*
     * 初始化地图、用户坐标
     */
    function initMap() {
        setMapSize();
        if (navigator.geolocation) {
            /*navigator.geolocation.getCurrentPosition(function(position) {
                _user_gpsLat = position.coords.latitude;
                _user_gpsLng = position.coords.longitude;*/

                _user_gpsLat = '24.2708458';
                _user_gpsLng= '109.4412615';

                _user_gpsPos = _user_gpsLng + "," + _user_gpsLat;

                Translate(new LatLng(_user_gpsLat, _user_gpsLng), 1, function(res) {
                    // 取出腾讯经纬度并且赋值
                    _user_mapPos = res[0];
                    _user_txLat = res[0].lat;
                    _user_txLng = res[0].lng;

					// 创建地图
	                _map = new Map(document.getElementById("editor_map"), {
	                    center: _user_mapPos,
	                    zoom: 17,
	                    mapTypeId: qq.maps.MapTypeId.ROADMAP,
	                    panControl: false,    // 平移控件
	                    zoomControl: false,   // 缩放控件
	                    scaleControl: false,  // 比例尺控件
	                    // draggable: false     // 设置是否可以拖拽
	                });

	                $("#form_pos").data("user_mapPos", _user_mapPos);

	                //创建当前用户坐标Marker
	                _marker = new Marker({
	                    position: _user_mapPos,
	                    map: _map
	                });

	                Event.addListener(_map, 'bounds_changed', function() {
	                	_map.panTo(_user_mapPos);
	                });

	                Event.addListener(_map, 'click', function(e) {
	                	var choice_txLat = e.latLng.lat; // 腾讯坐标
	                	var choice_txLng = e.latLng.lng;
	                	var choice_gpsPos = TransGPS.gcj_decrypt_exact(choice_txLat, choice_txLng); // 转GPS坐标
	                	var choice_gpsLat = choice_gpsPos.lat;
	                	var choice_gpsLng = choice_gpsPos.lon;
	                	var choice_locat = new LatLng(choice_txLat, choice_txLng);
	                	var dis = Distance(_user_mapPos, choice_locat);

	                	if (dis <= 100) {

	                		delChoiceMaker();

	                		_choice_mark = new Marker({
			                    position: choice_locat,
			                    map: _map
			                });

	                		_choice_mark.setIcon(_icon_lomo);

			                _map_prompt.html("您选择的位置坐标是(" + choice_txLng.toFixed(5) + ", " + choice_txLat.toFixed(5) + ")");

			                // 把坐标填写到form_pos
			                $("#form_pos")
			                	.val(choice_gpsLng + "," + choice_gpsLat )
			                	.data("choice_locat", choice_locat);

	                	} else {

	                		delChoiceMaker();

			                _map_prompt.html("请选择离您方圆百里内的地点");

			                $("#form_pos").val("");
	                	}
	                });
        			// -------end Event Listener click----------
				});
        		// -------end Event Listener click----------

            // });

        } else {
            $("#map").insert("当前浏览器不支持");
        }
    }
	// 结束：初始化地图、用户坐标
	//-----------------------------------

    /*
     * 删除选择的地点
     */
	function delChoiceMaker() {
	    if (_choice_mark != "") {
	        _choice_mark.setMap(null);
	        _choice_mark = "";
	    }
	}
	// 结束：删除选择的地点
	//-----------------------------------

	/*
	 * 地图选择的弹框
	 */
	// 确定按钮
	$(".editor_map_block").on("click", ".btn_map_ok", function(e){
		if ($("#form_pos").val() == "") {
			_map_prompt.html("请选择位置");
			return false;
		}
		$(".editor_map_block").slideUp();
	})

    // 取消按钮
	$(".editor_map_block").on("click", ".btn_map_cancel", function(e){
		$(".editor_map_block").slideUp();
	})
	// 结束：地图选择的弹框
	//-----------------------------------

    /*
     * 显示地图选择
     */
	$(".map_show").on("click", function(e){
		$(".editor_map_block").slideDown();
	})
	// 结束：显示地图选择
	//-----------------------------------

    /*
     * 预览萌袋
     */
	$(".btn_preview").click(function(){

		// 表单检测不通过则停止
		if (!checkLomoForm()) {
			return false;
		}

		$.lakerPopup.lomoPreiew();
		return false;
	});
	// 结束：发布萌袋
	//-----------------------------------

    /*
     * 预览照片
     */

    $(".img_upload").on("change", ".img_input", function(e){

		var file = e.target.files[0]; //获取图片资源
		var $img_upload = $(".img_upload");
		var $upload_input = $(this); //当前input

		// 只选择图片文件
		if (!file.type.match('image.*')) {
			return false;
		}

		var reader = new FileReader();

		reader.readAsDataURL(file); // 读取文件

		// 渲染文件
		reader.onload = function(arg) {
			var index = 0;
			var next = 0;

			// 当前input是含有.no_img的最小的label
			for (var i = 1; i <= 3 ; i++) {
				if( $(".img_label" + i).hasClass("no_img") ) {
					index = i;
					break;
				}
			}

			var img = '<div class="col-33 img_box">\
							<img class="img_pre preview' + index + '" src="' + arg.target.result + '" alt="preview"/>\
							<i class="icon-close-thin img_del" data-index=' + index + '></i>\
						</div>';
			$img_upload.append(img);

			setImgUpSize(); // 设置img_box高度

			$(".img_label" + index).removeClass("no_img").hide();

			// 选取含有.no_img的最小的label作为下一个选图
			for (var j = 1; j <= 3 ; j++) {
				if( $(".img_label" + j).hasClass("no_img") ) {
					next = j;
					break;
				}
			}
			// 显示下一个label并插入.img_upload末尾
			$(".img_label" + next).show().appendTo(".img_upload");
		}
    });

	// 预览照片
	//-----------------------------------

	/*
	 * 删除照片
	 */
	$(".img_upload").on("click", ".img_del", function(e){
		var $btn_del = $(this); // 点击的删除按钮
		var index = $btn_del.data("index"); // 删除图片的index
		var next = 0;

		$btn_del.closest(".img_box").remove(); //删除预览图
		$(".no_img").hide(); // 把其他.no_imgd都隐藏，待会重新寻找最小的labels
		$(".img_label" + index).addClass("no_img"); // 把该label重设为.no_img
		$(".img_input" + index).val(""); // 清空该input存储的图片数据

		// 选取含有.no_img的最小的label作为下一个选图
		for (var j = 1; j <= 3 ; j++) {
			if( $(".img_label" + j).hasClass("no_img") ) {
				next = j;
				break;
			}
		}
		$(".img_label" + next).show().appendTo(".img_upload");
	});
	// 删除照片
	//-----------------------------------
});