;(function($){

	var full_width, full_height;
    var _base_url = "http://42.96.140.187:7788/"; //接口地址
    var Map = qq.maps.Map;
    var Marker = qq.maps.Marker;
    var LatLng = qq.maps.LatLng;
	var Translate = qq.maps.convertor.translate;
    var Distance = qq.maps.geometry.spherical.computeDistanceBetween;
    var _icon_lomo = new qq.maps.MarkerImage(
        "img/pack.png"
    );

	var dialog = {
		/*
		 * 初始化弹框外层
		 */
		init: function () {
			// 会同时多个tip，只需一个laker_popup_page
			if ($(".laker_popup_page").length != 0)
				return false;

			var popuo_page = '<div class="laker_popup_page"></div>';

			full_width = $("body").width();
			full_height = $("body").height();

			$(popuo_page)
				.appendTo("body")
				.css({
					width: full_width + "px",
					height: full_height + "px"
				});

			$("body").on("click", ".laker_popup_page", function(e) {
				$(this).remove();
			});

			// 窗口变化时，更改弹框大小和位置
    		$(window).resize(function() {

				var full_width = $("body").width();
				var full_height = $("body").height();

    			$(".laker_popup_page")
					.css({
						width: full_width + "px",
						height: full_height + "px"
					});

				// tip和 详情页不是居中的布局，不需要，要排除
				if ($(".laker_popup").length != 0) {
					var $laker_popup = $(".laker_popup");
					var box_width = $laker_popup.width();
					var box_height= $laker_popup.height();
					var left = (full_width - box_width) / 2;
					var top = (full_height - box_height) / 2;
					$laker_popup.css({
						left: left + "px",
						top: top + "px"
					});
				}
    		});
		},

		/*
		 * 绑定关闭按钮的事件
		 */
		close: function (popup_box) {
			popup_box.on("click", ".popup_close", function(e){
				popup_box.closest(".laker_popup_page").remove();
			});

			// 注销scroll事件
			$("div").off("scroll");

			return false;
		},

		/*
		 * 绑定查看萌袋详情事件
		 */
		checkDetail: function (popup_box, user_locat, lomo_locat) {
			popup_box.on("click", ".btn_check_detail", function(e){

				$.lakerPopup.lomoDetail(user_locat, lomo_locat);
			});
			return false;
		},

		/*
		 * 设置居中
		 */
		center: function (popup_box) {
			var box_width, box_height, left, top;
			box_width = popup_box.width();
			box_height= popup_box.height();
			left = (full_width - box_width) / 2;
			top = (full_height - box_height) / 2;

			popup_box.css({
				left: left + "px",
				top: top + "px"
			});
		}
	};

	$.lakerPopup = {

		/*
		 * 普通黄色tip弹框
		 */
	    tip: function (u_opts) {
			var opt = $.extend({
				content: "Hello Word"
			}, u_opts);
			// var popup_outer = '<div class="laker_popup_outer"></div>'
	        var popup_box = '<div class="tip">' + opt.content + '</div>';
			var $popup_box;
			dialog.init();

			$popup_box = $(popup_box);

			if ($(".laker_popup_page").find(".laker_popup_outer").length == 0) {
				$(".laker_popup_page").append('<div class="laker_popup_outer"></div>');
			}
			$popup_box.appendTo(".laker_popup_outer");

			var a = setInterval(
				function() {
					if ($(".tip").length == 1) {
						$(".laker_popup_page").remove();
						clearInterval(a);
					} else {
						$popup_box.remove();
					}
				}, 3000
			);

/*			box_width = $popup_box.width();
			box_height= $popup_box.height();
			left = (full_width - box_width) / 2;
			top = (full_height - box_height) / 2;

			$popup_box.css({
				left: left + "px",
				top: top + "px"
			});*/

			return $popup_box;
	    },
		//结束：和普通黄色tip弹框
		//-----------------------------------

		/*
		 * 查看萌袋基本信息、获取萌袋
		 */
		packPopup: function (u_opts, user_locat, lomo_locat) {
			var control_btn;
			var opt = $.extend({
				type        : "", // 萌袋类型
				id			: "", // 萌袋id
				title       : "", // 萌袋名
				dis  		: 0, // 用户与萌袋的距离
				coins       : "", // 余邻萌币数/总邻萌币数
				people      : "", // 参加人数/总可参加人数
				days        : "", // 剩余天数
                personal    : "", // 找到的萌袋获得的邻萌币个人奖励数
                group       : "", // 找到的萌袋获得的邻萌币团队奖励数
                balance     : "", // 萌袋余额
                join        : "" // 剩余可领取人数
			}, u_opts);
	        var popup_box;

	        if(opt.dis !== "") {
	        	opt.dis = "(据您约" + opt.dis +  "米)";
	        }

	        switch(opt.type) {
	        	case "check":
					popup_box = '<div class="laker_popup pack_popup">\
									<input type="text" class="lomo_id hidden" value="' + opt.id + '">\
									<i class="popup_close close_icon icon-close-thin"></i>\
									<div class="title_box">\
										<div class="title_main">' + opt.title + '的萌袋</div>\
										<div class="dis">' + opt.dis + '</div>\
									</div>\
									<div class="confirm_box">\
										<div class="content">邻萌宝数：' + opt.coins + ' ;领取人数: ' + opt.people + '</div>\
										<div class="content">有效期:' + opt.days + '天</div>\
										<!--div class="content">平均每人获得15个邻萌宝</div-->\
										<div class="content">祝您好运！</div>\
										<div class="row control_btn one_btn">\
											<div class="col-50 btn_block">\
												<a href="#" class="button btn_check_detail">查看详情</a>\
											</div>\
										</div>\
									</div>\
								</div>';
	        		break;

	        	case "get":
					popup_box = '<div class="laker_popup pack_popup">\
									<input type="text" class="lomo_id hidden" value="' + opt.id + '">\
									<i class="popup_close close_icon icon-close-thin"></i>\
									<div class="title_box">\
										<div class="title_main">恭喜您获得</div>\
										<div class="">' + opt.title + '</div>\
									</div>\
									<div class="confirm_box">\
										<div class="content">您获得' + opt.personal + '个邻萌宝</div>\
										<div class="content">团队收益' + opt.group + '个邻萌宝</div>\
										<div class="content">该萌袋中还剩 ' + opt.balance + ' 邻萌宝，' + opt.join + '人可领</div>\
										<div class="row control_btn more_btn">\
											<div class="col-50 btn_block">\
												<a href="#" class="button btn_check_detail">查看萌袋详情</a>\
											</div>\
											<div class="col-50 btn_block">\
												<a href="#" class="button">发送好友</a>\
											</div>\
										</div>\
									</div>\
								</div>';
	        		break;
	        }

			var $popup_box = $(popup_box);

			dialog.init();
			dialog.checkDetail($popup_box, user_locat, lomo_locat);
			dialog.close($popup_box);

			$popup_box
				.appendTo(".laker_popup_page");

			dialog.center($popup_box);

			return $popup_box;
	    },
		// 结束：查看萌袋基本信息、获取萌袋
		//-----------------------------------

		/*
		 * 确认弹框
		 */
		confirm: function (u_opts) {
			var control_btn;
			var opt = $.extend({
				btn_1     : "",
				btn_2     : "",
				content   : "",
				close     : "",
				box_class : "",
				fn        : ""
			}, u_opts);
	        var popup_box;

	        popup_box = '<div class="laker_popup confirm ' + opt.box_class + '">\
							<div class="content_box">' + opt.content + '</div>\
							<div class="row control_btn no-gutter">\
								<div class="col-50 btn_block btn_1">\
									<a href="#" class="button">' + opt.btn_1 + '</a>\
								</div>\
								<div class="col-50 btn_block btn_2">\
									<a href="#" class="button">' + opt.btn_2 + '</a>\
								</div>\
							</div>\
						</div>';
			var $popup_box = $(popup_box);

			dialog.init();
			if (opt.close !== "") {
				dialog.close($(opt.close));
			}

			$popup_box
				.appendTo(".laker_popup_page");

			if (opt.fn != "") {
				opt.fn();
			}

			dialog.center($popup_box);

			return $popup_box;
	    },
		// 结束：确认弹框
		//-----------------------------------

		/*
		 * 萌袋详情弹框
		 */
		lomoDetail: function(user_locat, lomo_locat) {
			var user_token = $.userToken(); // 用户token
			var data;
			var prompt;
			var days;
			var tt = new Date();
			var yy = tt.getFullYear()
			var mm = tt.getMonth() + 1;
			var dd = tt.getDate()
			var today = yy + '/' + mm + '/' + dd
			var today_timstamp = new Date(today).getTime() / 1000;
			var list = "";
			var table = "";
			var map;
			var user_mark;
			var lomo_mark;

			// 获取萌袋详情
	        $.ajax({
	            type: "GET",
	            url: _base_url + "bag-check",
	            dataType : "jsonp",
	            crossDomain: true,
	            data: {
	                token: user_token, // 身份标识符
	                id: $(".lomo_id").val() // 萌袋id
	            }
	        }).success(function(msg) {
				var distance = Distance(user_locat, lomo_locat).toFixed(0);

	            data = msg.DATA[0];

				if (data.list.length != 0) {
					for (var i = 0; i < data.list.length; i++) {
						var last = parseInt(data.total_num) - (i + 1);
						list = list + '<tr>\
										<td>被领取</td>\
										<td>' + data.list[i].name + '</td>\
										<td>' + stampToTime(data.list[i].date) + '</td>\
										<td>-' + data.list[i].count + '</td>\
										<td>还可供' + last + '人领取</td>\
									</tr>';
					}

					table = '<table>\
								<thead>\
									<tr>\
										<th>事件</th>\
										<th>人物</th>\
										<th>时间</th>\
										<th>邻萌宝</th>\
										<th>备注</th>\
									</tr>\
								</thead>\
								<tbody>' + list + '\
								</tbody>\
							</table>';
				}

				prompt = '恭喜您获得<span class="money">' + data.self + '</span>邻萌宝';
				if (data.self == 0) {
					prompt = "您尚未获取该萌袋";
				}
				if (data.self == 0 && data.balance_lmc == 0) {
					prompt = "您来晚了，该萌袋已被领光";
				}

				days = parseInt( (data.end - today_timstamp) / 60 / 60 / 24 );

				var popup_box = '<div data-page="home" class="page bg_white">\
								    <div class="page-content no_padd_bott">\
										<!-- Home page heeder -->\
										<div class="home_header">\
											<img src="' + data.img + '" class="avatar">\
											<span class="user_name">' + data.unick + '</span>\
										</div>\
										<!-- /Home page heeder -->\
										<div class="message_block">\
											<p class="">' + data.title + '的邻萌宝盒</p>\
											<p class="fz_l">' + prompt + '</p>\
										</div>\
										<div class="lomo_info_block pargh_block_transp txt_center">\
											<p>该萌袋中共有邻萌宝 ' + data.balance_lmc + ' / ' + data.total_lmc + ' 个</p>\
											<p>可领人数： ' + data.join_num + ' / ' + data.total_num + ' 人</p>\
											<p>剩余天数：' + days + '天</p>\
										</div>\
										<div id="map_view" class="map_view"></div>\
										<p class="txt_center fc_red">此萌袋距离您约 ' + distance + ' 米</p>\
										<!-- Envent list -->\
											' + table + '\
										</table>\
										<!-- /Envent list -->\
										<div class="pargh_block_transp txt_center">微信转发此萌袋给好友，邀请好友加入邻萌宝成为您的跟班，即可获得跟班90天内收益的10%奖励！</div>\
										<!-- lomo_detail_blcok -->\
										<div class="lomo_detail_blcok">\
											<div class="lomo_info">\
												<div class="lomo_info_title">萌袋主人的话：</div>\
												<div class="msg_box">\
													<pre>' + data.subtitle + '</pre>\
												</div>\
											</div>\
											<div class="img_list">\
												<img src="img/lomo_detail_img.png">\
												<img src="img/lomo_detail_img.png">\
												<img src="img/lomo_detail_img.png">\
											</div>\
											<!--div class="row control_btn">\
												<div class="col-60 btn_block">\
													<a href="#" class="button button-big">删除萌袋</a>\
												</div>\
											</div-->\
										</div>\
										<!-- /lomo_detail_blcok -->\
								    </div>\
								</div>\
								<div class="close_top_block">\
									<i class="fa fa-times fa-2x popup_close"></i>\
								</div>';

				var $popup_box = $(popup_box);

				dialog.init();
				dialog.close($popup_box);

				$popup_box
					.appendTo(".laker_popup_page");

                map = new Map(document.getElementById("map_view"), {
                    center          : lomo_locat,
                    zoom            : 17,
                    mapTypeId       : qq.maps.MapTypeId.ROADMAP,
                    panControl   : false,    // 平移控件
                    zoomControl  : false,   // 缩放控件
                    scaleControl : false,  // 比例尺控件
                    // draggable       : false     // 设置是否可以拖拽
                });

				lomo_mark = new Marker({
				    position: lomo_locat,
				    map: map
				});

				lomo_mark.setIcon(_icon_lomo);

                //创建当前用户坐标Marker
                marker = new Marker({
                    position : user_locat, //设置Marker的位置坐标
                    map      : map //设置显示Marker的地图
                });

				// 滑动屏幕时，头部关闭按钮的block的样式变化
				$("div").scroll(function () {
					var scroll = $(this).scrollTop();
					if (scroll > 200) {
						$(".close_top_block").css({"background": "rgba(171, 171, 171, 0.71)"});
					} else {
						$(".close_top_block").css({"background": "transparent"});
					}
				});

				// 注销点击弹框关闭的事件
				$("body").off("click", ".laker_popup_page");

				dialog.center($popup_box);

				return $popup_box;
	        }).fail(function(msg) {
	            console.log(msg);
	        });

		},
		// 结束：萌袋详情弹框
		//-----------------------------------

		/*
		 * 新人签到
		 */
		fresh: function() {

	        var popup_box;

			popup_box = '<div class="fresh laker_popup">\
							<div class="title_box">\
								<div class="title_main">欢迎来到神奇的邻萌宝世界！</div>\
							</div>\
							<div class="content_box">\
								<div class="content txt_center fz_l mg_bt_10">您已获赠内测期新人大礼包</div>\
								<div class="content txt_center fz_l mg_bt_10">邻萌宝<span class="fc_red"> 50 </span>枚！！！</div>\
								<div class="content txt_center">请关注邻萌宝公众号后，在“我的钱包”查看 </div>\
								<div class="content txt_center">大型微信地图真人寻宝游戏</div>\
								<div class="content txt_center mg_bt_15">5种玩法免费获得邻萌宝</div>\
								<div class="content">1. 每日签到即获赠 1个邻萌宝</div>\
								<div class="content">2. 与好友组队，可获每日3个邻萌宝的团队奖励</div>\
								<div class="content"3. 地图上搜寻并获取萌袋，更多惊喜等着您></div>\
								<div class="content">4. 团队成员拾取萌袋，您还可获赠搭车奖励</div>\
								<div class="content mg_bt_15">5. 免费派发自己的创意萌袋，系统奖励10%</div>\
								<div class="content fc_light">邻萌宝是划时代颠覆性的新一代虚拟货币，具有不可预测的升值潜力，建议您立即绑定手机，保障您的邻萌宝账户安全性！</div>\
							</div>\
							<div class="row control_btn no-gutter">\
								<div class="col-50 btn_block btn_1">\
									<a href="#" class="button">现在就去绑定手机</a>\
								</div>\
								<div class="col-50 btn_block btn_2">\
									<a href="#" class="button popup_close">试玩一会再说</a>\
								</div>\
							</div>\
						</div>';

			var $popup_box = $(popup_box);

			dialog.init();
			dialog.close($popup_box);
			console.log($(popup_box));

			$popup_box
				.appendTo(".laker_popup_page");

			dialog.center($popup_box);

			return $popup_box;
		},
		// 结束：新人签到
		//-----------------------------------

		/*
		 * 萌袋预览
		 */
		lomoPreiew: function() {
			var days;
			var tt = new Date();
			var yy = tt.getFullYear()
			var mm = tt.getMonth() + 1;
			var dd = tt.getDate()
			var today = yy + '/' + mm + '/' + dd
			var today_timstamp = new Date(today).getTime() / 1000;
			var form_title = $("#form_title").val();
			var form_limit = $("#form_limit").val();
			var form_coins = $("#form_coins").val();
			var form_end = new Date($("#form_end").val()).getTime() / 1000;
			var form_pos = $("#form_pos").val();
			var form_subtitle = $("#form_subtitle").val();
			var map;
			var user_mark;
			var user_locat = $("#form_pos").data("user_mapPos");
			var lomo_locat = $("#form_pos").data("choice_locat");
			var lomo_mark;

			// 获取个人信息
	        $.ajax({
				type: "POST",
				url: _base_url + "token",
				dataType : "jsonp",
				crossDomain: true,
				data: {
					token   : $.userToken() // 身份标识符
				}
	        }).success(function(msg) {
	        	var data = msg.DATA;

				days = parseInt( (form_end - today_timstamp) / 60 / 60 / 24 );

				var popup_box = '<div data-page="home" class="page bg_white">\
								    <div class="page-content no_padd_bott">\
										<!-- Home page heeder -->\
										<div class="home_header">\
											<img src="' + data.img + '" class="avatar">\
											<span class="user_name">' + data.unick + '</span>\
										</div>\
										<!-- /Home page heeder -->\
										<div class="message_block">\
											<p class="">' + form_title + '的邻萌宝盒</p>\
										</div>\
										<div class="lomo_info_block pargh_block_transp txt_center">\
											<p>该萌袋中共有邻萌宝 ' + form_coins + ' / ' + form_coins + ' 个</p>\
											<p>可领人数：0 / ' + form_limit + ' 人</p>\
											<p>剩余天数：' + days + '天</p>\
										</div>\
										<div id="map_view" class="map_view"></div>\
										<div class="pargh_block_transp txt_center">微信转发此萌袋给好友，邀请好友加入邻萌宝成为您的跟班，即可获得跟班90天内收益的10%奖励！</div>\
										<!-- lomo_detail_blcok -->\
										<div class="lomo_detail_blcok">\
											<div class="lomo_info">\
												<div class="lomo_info_title">萌袋主人的话：</div>\
												<div class="msg_box">\
													<pre>' + form_subtitle + '</pre>\
												</div>\
											</div>\
											<div class="img_list">\
												<img src="img/lomo_detail_img.png">\
												<img src="img/lomo_detail_img.png">\
												<img src="img/lomo_detail_img.png">\
											</div>\
										</div>\
										<!-- /lomo_detail_blcok -->\
								    </div>\
								</div>\
								<div class="close_top_block">\
									<i class="fa fa-times fa-2x popup_close"></i>\
								</div>';

				var $popup_box = $(popup_box);

				dialog.init();
				dialog.close($popup_box);

				$popup_box
					.appendTo(".laker_popup_page");


                map = new Map(document.getElementById("map_view"), {
                    center          : user_locat,
                    zoom            : 17,
                    mapTypeId       : qq.maps.MapTypeId.ROADMAP,
                    panControl   : false,    // 平移控件
                    zoomControl  : false,   // 缩放控件
                    scaleControl : false,  // 比例尺控件
                    // draggable       : false     // 设置是否可以拖拽
                });

                //创建当前用户坐标Marker
                user_mark = new Marker({
                    position : user_locat, //设置Marker的位置坐标
                    map      : map //设置显示Marker的地图
                });

				lomo_mark = new Marker({
				    position: lomo_locat,
				    map: map
				});

				lomo_mark.setIcon(_icon_lomo);

				// 滑动屏幕时，头部关闭按钮的block的样式变化
				$("div").scroll(function () {
					var scroll = $(this).scrollTop();
					if (scroll > 200) {
						$(".close_top_block").css({"background": "rgba(171, 171, 171, 0.71)"});
					} else {
						$(".close_top_block").css({"background": "transparent"});
					}
				});

				// 注销点击弹框关闭的事件
				$("body").off("click", ".laker_popup_page");

				dialog.center($popup_box);

				return $popup_box;
	        }).fail(function(msg) {
	            console.log(msg);
	        });

		},
		// 结束：萌袋预览
		//-----------------------------------
	}

	/*
	 * 把时间戳转为年月日 2016/2/3
	 */
	function stampToTime(stamp) {
	   return new Date(parseInt(stamp) * 1000).toLocaleString().match(/\d+\/\d+\/\d+/)[0];
	}

})(window.Zepto || window.jQuery)