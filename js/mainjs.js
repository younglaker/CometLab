$(document).ready(function() {

    var _base_url = "http://42.96.140.187:7788/"; //接口地址

    /*
     * 文本框聚焦失焦时外面Li的样式
     */
	nabTitleCenter();

	$(".lomo_form").on("focus", "input, textarea", function(e){
		$(this).closest("li").css({"border": "1px solid #B8B8B8"});
	}).on("blur", "input, textarea", function(e){
		$(this).closest("li").css({"border": "none"});
	});

	function nabTitleCenter () {
		var nav_width = $(".navbar-inner").width();
		var title_width = $(".navbar_title").width();
		var distance = (nav_width - title_width) / 2;

		if (!$(".navbar_title").siblings(".left").length) {
			$(".navbar_title").css({"left": distance});
			return false;
		}

		if (!$(".navbar_title").siblings(".right").length) {
			$(".navbar_title").css({"right": distance});
		}
	}

	$( window ).resize(function() {
		nabTitleCenter();
	});
	// 结束：文本框聚焦失焦时外面Li的样式
	//-----------------------------------

    /*
     * 我的账单，点击显示明细
     */
	$(".bill_block").on("click", ".detail_head", function(e){
		$this = $(this);
		if ($this.hasClass("hide")) {
			// 修改当前detail_head状态标记和icon样式
			$this
				.removeClass("hide")
				.find(".item-after i")
				.removeClass("fa-chevron-down")
				.addClass("fa-chevron-up");

			// 显示当前detail_block
			$this
				.siblings(".detail_block")
				.show();

			// 隐藏其他detail_block
			$this
				.closest(".bill_box")
				.siblings(".bill_box")
				.find(".detail_block")
				.hide();

			// 修改其他detail_head状态标记和icon样式
			$this
				.closest(".bill_box")
				.siblings(".bill_box")
				.find(".detail_head")
				.addClass("hide")
				.find(".item-after i")
				.removeClass("fa-chevron-up")
				.addClass("fa-chevron-down");

		} else {

			// 修改当前detail_head状态标记和icon样式
			$this
				.addClass("hide")
				.find(".item-after i")
				.removeClass("fa-chevron-up")
				.addClass("fa-chevron-down");

			// 隐藏当前detail_block
			$this
				.siblings(".detail_block")
				.hide();
		}
	});
	// 结束：我的账单，点击显示明细
	//-----------------------------------


});