$(document).ready(function() {
    var LatLng = qq.maps.LatLng;
    var Translate = qq.maps.convertor.translate;
    var _base_url = "http://42.96.140.187:7788/"; //接口地址
    var _team = {token: "", title: "", desc: "", pos: ""};
    var _user_token = $.userToken(); // 用户token

    /*
     * 创建队伍
     */
	$(".btn_release").click(function(){

		// 表单检测不通过则停止
		if (!checkteamForm()) {
			return false;
		}

		getTeamForm();

 		$.lakerPopup.confirm({
			btn_1     : "取消",
			btn_2     : "确定",
			content   : "<div class='content'>是否确认创建？</div>",
			close     : "btn_1",
			box_class : "edt_conf_1",
			fn: sendConfirm
		});

		return false;
	});
	// 结束：创建队伍
	//-----------------------------------

    /*
     * 确认弹框
     */
    function sendConfirm() {
    	// 确认发布
		$("body").on("click", ".edt_conf_1 .btn_2 a", function(e){
			sendLomoForm();
		});
    }

    function editConfirm2(msg) {
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
	function getTeamForm() {
		_team.title = $("#form_title").val();
		_team.desc = $("#form_desc").val();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
/*                _user_mapPos = new LatLng(24.2708458,109.4412615);
                var lat = '24.2708458';
                var lng = '109.4412615';*/
                // _user_mapPos = new LatLng(position.coords.latitude, position.coords.longitude);
                //
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                _team.pos = lng + "," + lat;

                // Translate(new LatLng(lat, lng), 1, function(res) {
                    // 取出经纬度并且赋值
                    // _team.pos = res[0].lng + "," + res[0].lat;
				// });
            });

        } else {
            console.log("当前浏览器不支持");
        }
	}
	// 结束：获取表单信息
	//-----------------------------------

    /*
     * 发布表单信息
     */
	function sendLomoForm(fnPoup) {
		console.log(_team.pos);
        $.ajax({
            type: "POST",
            url: _base_url + "group-create",
            dataType : "jsonp",
            crossDomain: true,
            data: {
				token   : _user_token, // 身份标识符
				title   : _team.title, // 队伍名
				desc    : _team.desc, // 队伍描述
				pos     : _team.pos // 当前GPS坐标
            }
        }).success(function(msg) {
        	console.log(msg);
            if (msg.ISOK == 1) {
		 		$.lakerPopup.confirm({
					btn_1     : "关闭",
					btn_2     : "分享",
					content   : "<div class='content'>队伍创建成功！</div>",
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
	function checkteamForm() {
		var valid = true; // 判断表单是否有效的标记

		// 之前有问题的表单样式重置
		$('#form_new_team')
			.find("input, textarea")
			.each(function() {
				$(this)
					.attr("placeholder", "")
					.closest("li")
					.css({"border": "none"});
			});

		// 空值检测
		$('#form_new_team')
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

		// 队伍描述检测
		if ($("#form_desc").val().length > 100) {
			valid = false;
		}

		return valid;
	}
	// 结束：表单检测
	//-----------------------------------

});