// 现有彩票
$(function() {
	/*$("#tab>li:first").addClass("se");
	$("#tab_content>div:not(:first)").hide();
	$("#tab>li").click(function() {
		$("#tab_content").children(":eq("+$(this).index()+")").show().siblings().hide();
		$(this).addClass().addClass("se").siblings().removeClass("se")
	});*/
});
//读取cookies 
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//获取用户
function getTGamePlayersCookie() {
	var obj=new Object();
	obj.player_id='';
	obj.player_nickname='';
	obj.headPicUrl='';
    var strCookie = document.cookie;
    if(strCookie!=null){
    	var arrCookie = strCookie.split("; ");
	for(var i = 0; i < arrCookie.length; i++) {
		var arr = arrCookie[i].split("=");
		if("TGamePlayers" == arr[0]) {
			var gamePlayers = arr[1];
			if(gamePlayers!=null && gamePlayers!="" && gamePlayers!="null"){
				var tGamePlayers = jQuery.parseJSON(gamePlayers);
				obj = jQuery.parseJSON(tGamePlayers);
			}
			
		}
	}
   }
	
	return obj;
}
//退出 删除

function clearCookie(){ 
var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
	if (keys) { 
	for (var i = keys.length; i--;) 
	document.cookie=keys[i]+'=0; expires=' + new Date( 0).toUTCString() +"; path=/";
	} 
}

$(function() {
	$("#tabb>li:first").addClass("se");
	$("#tabb_content>div:not(:first)").hide();
	$("#tabb>li").click(function() {
		$("#tabb_content").children(":eq(" + $(this).index() + ")").show().siblings().hide();
		$(this).addClass().addClass("se").siblings().removeClass("se")
	});
});
function randomString(len){
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
// 交易记录
/*$(function() {
	$("#menu>li:first").addClass("se");
	$("#menu_content>div:not(:first)").hide();
	$("#menu>li").click(function() {
		$("#menu_content").children(":eq(" + $(this).index() + ")").show().siblings().hide();
		$(this).addClass().addClass("se").siblings().removeClass("se")
	});
});*/
//naver
$(function() {
	$("#naver>li:first").addClass("se");
	$("#naver_content>div:not(:first)").hide();
	$("#naver>li").click(function() {
		$("#naver_content").children(":eq(" + $(this).index() + ")").show().siblings().hide();
		$(this).addClass().addClass("se").siblings().removeClass("se")
	});
});

//兑奖记录
$(function() {
	$("#tabGift>li:first").addClass("se");
	$("#contentgift>div:not(:first)").hide();
	$("#tabGift>li").click(function() {
		$("#contentgift").children(":eq(" + $(this).index() + ")").show().siblings().hide();
		$(this).addClass().addClass("se").siblings().removeClass("se")
	});
});

//刷新图片转换
$(function() {
	$(".refresh").click(function(event) {
		$(".refresh").attr('src', 'web_img/refresh1.png');
		setTimeout(function() {
			$(".refresh").attr('src', 'web_img/refresh.png');
		}, 500);
		event.stopPropagation(); //  阻止事件冒泡
	});
});
$(function() {
	$(".refreshing").click(function(event) {
		$(".refreshing").attr('src', 'web_img/refresh1.png');
		setTimeout(function() {
			$(".refreshing").attr('src', 'web_img/refresh.png');
		}, 500);
		event.stopPropagation(); //  阻止事件冒泡
	});
});

//签到
$(function() {
	$(".pc,.qiandao").click(function() {
		$('#web_overlay').fadeIn('fast', function() {
			$('#web_box').animate({
				'top': '100px'
			}, 500);
		});
	});
	$('#web_boxclose').click(function() {
		$('#web_box').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#web_overlay').fadeOut('fast');
		});
	});
	$(".signbutton").click(function() {
		$('#web_box').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#web_overlay').fadeOut('fast');
		});
	});
});
// 报名
$(function() {
	$(".Bombbox").click(function() {
		$('#overlay1').fadeIn('fast', function() {
			$('#box1').animate({
				'top': '100px'
			}, 500);
		});
	});
	$('#boxclose1').click(function() {
		$('#box1').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlay1').fadeOut('fast');
		});
	});
});

//买入

$(function() {
	$("[name='activatorkeep']").click(function() {

		$('#overlaykeep').fadeIn('fast', function() {
			$('#boxkeep').animate({
				'top': '100px'
			}, 500);
		});
	});
	$('#boxclosekeep').click(function() {
		$('#boxkeep').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlaykeep').fadeOut('fast');
		});
	});
	$(".surekeep, .cancelkeep").click(function() {
		$('#boxkeep').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlaykeep').fadeOut('fast');
		});
	});
});

//卖出
$(function() {
	$("[name='activatorsell']").click(function() {
		$('#overlaysell').fadeIn('fast', function() {
			$('#boxsell').animate({
				'top': '100px'
			}, 500);
		});
	});
	$('#boxclosesell').click(function() {
		$('#boxsell').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlaysell').fadeOut('fast');
		});
	});
	$(".suresell, .cancelsell").click(function() {
		$('#boxsell').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlaysell').fadeOut('fast');
		});
	});
});

//兑换
$(function() {
	$("[name='gift']").click(function() {
		$('#overlaygift').fadeIn('fast', function() {
			$('#boxgift').animate({
				'top': '100px'
			}, 500);
		});
	});
	$('#boxclosegift').click(function() {
		$('#boxgift').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlaygift').fadeOut('fast');
		});
	});
	$(".giftleft").click(function() {
		$('#boxgift').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlaygift').fadeOut('fast');
		});
	});
	$(".giftright").click(function() {
		$('#boxgift').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#overlaygift').fadeOut('fast');
		});
		alert("兑换成功");
	});
});

//个人账户昨今明
$(function() {
//	$("#jtLi").addClass("se");
//	$("#mingctrl").hide();
//	$("#zuoctrl").hide();
//	$("#tabTime>li").click(function() {
//		$("#tabTime_content").children(":eq(" + $(this).index() + ")").show().siblings().hide();
//		$(this).addClass().addClass("se").siblings().removeClass("se")
//	});
});
$(function() {
	/*$("#tab1>li:first").addClass("se");
	$("#tab1_content>div:not(:first)").hide();
	$("#tab1>li").click(function() {
		$("#tab1_content").children(":eq(" + $(this).index() + ")").show().siblings().hide();
		$(this).addClass().addClass("se").siblings().removeClass("se")
	});*/
});
$(function() {
	/*$("#tab2>li:first").addClass("se");
	$("#tab2_content>div:not(:first)").hide();
	$("#tab2>li").click(function() {
		$("#tab2_content").children(":eq(" + $(this).index() + ")").show().siblings().hide();
		$(this).addClass().addClass("se").siblings().removeClass("se")
	});*/
});

// 侧拉菜单
jQuery(document).ready(function($) {
	var isLateralNavAnimating = false;
	//o打开或关闭导航菜单
	$('.cd-nav-trigger').on('click', function(event) {
		event.preventDefault();
		//若动画正在进行，则停止 
		if(!isLateralNavAnimating) {
			if($(this).parents('.csstransitions').length > 0)
				isLateralNavAnimating = true;
				
			$('body').toggleClass('navigation-is-open');
			$('.cd-navigation-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
				//动画结束
				isLateralNavAnimating = false;
			});
		}
	});
});
//隐藏左侧菜单功能
$(function(){
	$('#close').bind('click',function( event){
		$('.cd-nav').hide();
		$('body').toggleClass('navigation-is-open');
	})	
	$('.cd-nav-trigger').bind('click',function(){
		$('.cd-nav').show();
	})
});
//news-详情
$(function() {
		/*$("[name='teamBody']").click(function() {
			window.location.href = "web_newsdetails.html";
		})*/
	})
	//队员信息
$(function() {
	$(".data").click(function() {
		$('#player_overlay').fadeIn('fast', function() {
			$('#player_box').animate({
				'top': '50px'
			}, 500);
		});
	});
	$('#player_boxclose').click(function() {
		$('#player_box').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#player_overlay').fadeOut('fast');
		});
	});
});
//队员赛迹
$(function() {
	$(".data1").click(function() {
		$('#track_overlay').fadeIn('fast', function() {
			$('#track_box').animate({
				'top': '50px'
			}, 500);
			$(document.body).css("overflow", "hidden");
		});
	});
	$('#track_boxclose').click(function() {
		$('#track_box').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#track_overlay').fadeOut('fast');
			$(document.body).css("overflow", "auto");
		});
	});
	var ttr;
	$("[name='tr']").click(function(e) {
		if(!ttr) {
			ttr = $(e.currentTarget);
			ttr.css("background-color", "#cef4ce"); //tr点击换色
		} else {
			ttr.css("background-color", "#fff");
			ttr = $(e.currentTarget);
			ttr.css("background-color", "#cef4ce");
		}

	});
});

//联赛
$(function() {
	$(".lian").click(function() {
		$('#lian_overlay').fadeIn('fast', function() {
			$('#lian_box').animate({
				'top': '150px'
			}, 500);
		});
	});
	$('#lian_boxclose,.lian_cancle,.lian_sure').click(function() {
		$('#lian_box').animate({
			'top': '-1000px'
		}, 500, function() {
			$('#lian_overlay').fadeOut('fast');
		});
	});
	var lli = $('#lian_box li'); //筛选li点2下变色
	lli.click(function() {
		var filter = $(this).attr("filter");
		if(filter == "1") {
			$(this).removeClass('active');
			$(this).attr("filter", "0");
		} else {
			$(this).addClass('active');;
			$(this).attr("filter", "1");
		}
		return false;
	});
});
//切换昨今明
$(function() {
	$(".ytm>button:first").addClass("ytm_se");
	$("#ytm_tab>div:not(:first)").hide();
	$(".ytm>button").click(function() {
		var div = $("#ytm_tab").children(":eq(" + $(this).index() + ")");
		div.show().siblings().hide();
		$(this).addClass().addClass("ytm_se").siblings().removeClass("ytm_se")
	});
});

function getNowFormatDate(addDate) {
	var day = new Date();
	day.setDate(day.getDate() + addDate);

	var Year = 0;
	var Month = 0;
	var Day = 0;
	var CurrentDate = "";
	Year = day.getFullYear(); //ie火狐下都可以
	Month = day.getMonth() + 1;
	Day = day.getDate();
	CurrentDate += Year + "-";
	if(Month >= 10) {
		CurrentDate += Month + "-";
	} else {
		CurrentDate += "0" + Month + "-";
	}
	if(Day >= 10) {
		CurrentDate += Day;
	} else {
		CurrentDate += "0" + Day;
	}

	return CurrentDate;
}

function getNowStrDate(day,addDate) {
	day.setDate(day.getDate() + addDate);
	var Year = 0;
	var Month = 0;
	var Day = 0;
	var CurrentDate = "";
	Year = day.getFullYear(); //ie火狐下都可以
	Month = day.getMonth() + 1;
	Day = day.getDate();
	CurrentDate += Year + "-";
	if(Month >= 10) {
		CurrentDate += Month + "-";
	} else {
		CurrentDate += "0" + Month + "-";
	}
	if(Day >= 10) {
		CurrentDate += Day;
	} else {
		CurrentDate += "0" + Day;
	}

	return CurrentDate;
}


