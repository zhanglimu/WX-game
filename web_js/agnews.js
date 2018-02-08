var app = angular.module("agnews",[]);
	var pcnavbox = [
		{"url":"index.html","text":"赛事游戏"},
//		{"url":"web_news.html","text":"赛事信息","selected":true},
		{"url":"web_gameuser.html","text":"个人中心"},
//		{"url":"web_gift.html","text":"兑奖中心"},
//		{"url":"web_giftlist.html","text":"兑奖记录"},
		{"url":"http://www.caiex.com/caiex/","text":"公司介绍"}
	];
	app.controller("agpcnavctrl",function(){
		this.pcnavbox = pcnavbox;
		this.src = "web_img/logoSI.png";
		this.src0 = "web_img/logo.png";
		this.header = "web_img/0.jpg"
	});
	var navbox = [
		{"url":"web_falls.html","text":"赛事日期"},
		{"url":"web_tab.html","text":"赛事游戏"},
		{"url":"web_news.html","text":"赛事信息","selected":true},
		{"url":"web_gameuser.html","text":"个人中心"},
		{"url":"web_gift.html","text":"兑奖中心"},
		{"url":"web_giftlist.html","text":"兑奖记录"},
		{"url":"#","text":"关于"}
	];
	app.controller("agnewsctrl",function(){
		this.src0 = "web_img/white.png";
		this.src1 = "web_img/icon.png";
		this.word = "赛事信息";
		this.url = "web_gameuser.html";
		this.src = "web_img/0.jpg";
		this.navbox = navbox;
	});	
	app.controller("xuanctrl",function(){
		this.liansai = "联赛";
		this.zuo = "昨天";
		this.jin = "今天";
		this.ming = "明天";
		this.lsai = lsai;
		
		this.qu = "取消";
		this.ding = "确认";
		
//		this.lsai=function () {
//          $('#lian_overlay').fadeIn('fast', function () {
//              $('#lian_box').animate({ 'top': '150px' }, 500);
//          });
//     };
	});	
	
	var lsai = [
		{"fenlei":"英超"},
		{"fenlei":"意甲"},
		{"fenlei":"西甲"},
		{"fenlei":"欧联"},
		{"fenlei":"英超"},
		{"fenlei":"英超"},
		{"fenlei":"英超"},
		{"fenlei":"英超"},
		{"fenlei":"英超"},
	];
	app.controller("liectrl",function(){
		this.lsai = lsai;
		
		this.qu = "取消";
		this.ding = "确认";
	});	
//	var pointer = [   //主队
//		{"src":"web_img/yellow.png","src1":"web_img/little.png"},
//		{"src":"web_img/usual.png","src1":"web_img/little.png"},
//	];
//	var poiner = [     //客队
//		{"src":"web_img/penalty.png","src1":"web_img/little.png"},
//		{"src":"web_img/red.png","src1":"web_img/little.png"},
//		{"src":"web_img/yere.png","src1":"web_img/little.png"},
//	];
	app.controller("newsctrl",function(){   //比赛
		this.src = "web_img/Mexico.png";
		this.text = "moxige";
		this.wor = "即将开赛";
		this.word = "0 : 0";
		this.wod = "1-29  13:25";
		this.src1 = "web_img/Uruguay.png";
		this.text1 = "阿森纳";
//		this.pointer = pointer;   //主队
//		this.poiner = poiner;    //客队
//		this.url = "web_img/little_gray.png";   //中场点
//		this.ling = "0'";
//		this.jiu = "90'";
		
		this.oulian = "欧联";
	});