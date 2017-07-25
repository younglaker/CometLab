;(function($){

    var _base_url = "http://42.96.140.187:7788/"; //接口地址
    var _user = {"token" : "", "id": "", "img": "", "unick": "", "uname": "", "utype": "", "rtoken": ""}
    _user.token = $.userToken(); // 用户token
	//或者使用RongIMLib.TextMessage.obtain 方法.具体使用请参见文档
	//var msg = RongIMLib.TextMessage.obtain("hello");
	var _conversationType = RongIMLib.ConversationType.GROUP; // 群组
	var _teamId; // 目标 Id


	getUserInfo();

    /*
     * 获取用户信息
     */
	function getUserInfo () {
        $.ajax({
            type: "POST",
            url: _base_url + "token",
            dataType : "jsonp",
            crossDomain: true,
            data: {
            	token   : _user.token // 身份标识符
            }
        }).success(function(msg) {
			_user.id = msg.DATA.id;
			_user.img = msg.DATA.img;
			// _user.img = "img/avatar1.jpg";
			_user.rtoken = msg.DATA.rtoken;
			_user.uname = msg.DATA.uname;
			_user.unick = msg.DATA.unick;
            connect();

        }).fail(function(msg) {
            console.log(msg);
        });
	}
    // -------end 获取用户信息----------

	// 初始化
	// RongIMClient.init(appkey, [dataAccessProvider]);
	// appkey:官网注册的appkey。
	// dataAccessProvider:自定义本地存储方案的实例，不传默认为内存存储，自定义需要实现WebSQLDataProvider所有的方法，此参数必须是传入实例后的对象。
	RongIMClient.init("4z3hlwrv3ti7t");

    /*
     * 连接状态监听器（ status 标识当前连接状态）
     */
	 RongIMClient.setConnectionStatusListener({
	    onChanged: function (status) {
	        switch (status) {
	            //链接成功
	            case RongIMLib.ConnectionStatus.CONNECTED:
	                console.log('链接成功');
	                break;
	            //正在链接
	            case RongIMLib.ConnectionStatus.CONNECTING:
	                console.log('正在链接');
	                break;
	            //重新链接
	            case RongIMLib.ConnectionStatus.DISCONNECTED:
	                console.log('断开连接');
	                break;
	            //其他设备登陆
	            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
	                console.log('其他设备登陆');
	                break;
	              //网络不可用
	            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
	              console.log('网络不可用');
	              break;
	        }
	    }
	});
    // -------end 连接状态监听器----------

    /*
     * 连接融云服务器
     */
	function connect (arg) {
		RongIMClient.connect(_user.rtoken, {
			onSuccess: function(userId) {
				// console.log("Login successfully." + userId);
			},
			onTokenIncorrect: function() {
				console.log('token无效');
			},
			onError:function(errorCode){
				var info = '';
				switch (errorCode) {
					case RongIMLib.ErrorCode.TIMEOUT:
						info = '超时';
						break;
					case RongIMLib.ErrorCode.UNKNOWN_ERROR:
						info = '未知错误';
						break;
					case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
						info = '不可接受的协议版本';
						break;
					case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
						info = 'appkey不正确';
						break;
					case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
						info = '服务器不可用';
						break;
				}
				console.log(errorCode);
			}
		});
	}
    // -------end 连接融云服务器----------

    /*
     * 发送信息
     */
	$.sendMsg = function () {
		//定义消息类型,文字消息使用 RongIMLib.TextMessage
		var ctn = $(".msgbar").val().replace(/^\s+|\s+$/g, "");
		// 检测空值
		if (ctn == "")
			return false;

		// content: 主要信息
		// extra: 附加信息,非必填
		var msg = new RongIMLib.TextMessage({
			"content": ctn,
			"extra": {
				name: _user.unick,
				img: _user.img
			}});

		_teamId = $(".team_name").data("teamid"); // 目标 Id

		RongIMClient.getInstance().sendMessage(_conversationType, _teamId, msg, {
			// 发送消息成功
			onSuccess: function (message) {
			    //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
			    console.log("Send successfully");
				var msg_box = '<div class="message message-sent message-with-avatar">\
								<div style="background-image:url(' + _user.img + ')" class="message-avatar"></div>\
								<pre class="message-text">' + ctn + '</pre>\
							</div>';
				$(msg_box).appendTo(".messages");
				$(".msgbar").val("");
			},
			onError: function (errorCode,message) {
			    var info = '';
			    switch (errorCode) {
			        case RongIMLib.ErrorCode.TIMEOUT:
			            info = '超时';
			            break;
			        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
			            info = '未知错误';
			            break;
			        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
			            info = '在黑名单中，无法向对方发送消息';
			            break;
			        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
			            info = '不在讨论组中';
			            break;
			        case RongIMLib.ErrorCode.NOT_IN_GROUP:
			            info = '不在群组中';
			            break;
			        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
			            info = '不在聊天室中';
			            break;
			        default :
			            info = x;
			            break;
			    }
			    console.log('发送失败:' + info);
			}
		});
	};
    // -------end 发送信息----------

    /*
     * 消息监听器
     */
	 RongIMClient.setOnReceiveMessageListener({
	    // 接收到的消息
	    onReceived: function (message) {
	    	console.log(message);
	        // 判断消息类型
	        switch(message.messageType){
	            case RongIMClient.MessageType.TextMessage:
	                   console.log(message.content.extra);
	                //发送的消息内容将会被打印

					var msg_box = '<div class="message message-received message-with-avatar message-last message-with-tail message-first">\
									<div class="message-name">' + message.content.extra.name + '</div>\
									<div style="background-image:url(' + message.content.extra.img + ')" class="message-avatar"></div>\
									<pre class="message-text">' + message.content.content + '</pre>\
								</div>';
					$(msg_box).appendTo(".messages");

	                break;
	            case RongIMClient.MessageType.ImageMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.DiscussionNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.LocationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.RichContentMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.DiscussionNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.InformationNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.ContactNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.ProfileNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.CommandNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.CommandMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.UnknownMessage:
	                // do something...
	                break;
	            default:
	                // 自定义消息
	                // do something...
	        }
	    }
	});
    // -------end 消息监听器----------


})(window.Zepto || window.jQuery)
