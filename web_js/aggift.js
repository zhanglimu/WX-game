var app = angular.module("aggift",[]);
var pcnavbox = [
		{"url":"web_match.html","text":"赛事游戏"},
		{"url":"web_news.html","text":"赛事信息","selected":true},
		{"url":"web_gameuser.html","text":"个人中心"},
		{"url":"web_gift.html","text":"兑奖中心"},
		{"url":"web_giftlist.html","text":"兑奖记录"},
		{"url":"www.caiex.com","text":"公司介绍"}
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
		{"url":"web_news.html","text":"赛事信息"},
		{"url":"web_gameuser.html","text":"个人中心"},
		{"url":"web_gift.html","text":"兑奖中心","selected":true},
		{"url":"web_giftlist.html","text":"兑奖记录"},
		{"url":"#","text":"关于"}
	];
	var liwus =[
		{"src":"web_img/gift1.jpg","text":"精美礼盒","dollar":"兑换币：200"},
		{"src":"web_img/gift.jpg","text":"工艺品","dollar":"兑换币：200"},
		{"src":"web_img/gift1.jpg","text":"精美礼盒","dollar":"兑换币：200"},
		{"src":"web_img/gift2.jpg","text":"精美鲜花礼盒","dollar":"兑换币：200"},
		{"src":"web_img/gift3.jpg","text":"鲜花包装卡","dollar":"兑换币：200"},
		{"src":"web_img/gift1.jpg","text":"精美礼盒","dollar":"兑换币：200"},
	]
	app.controller("aggiftctrl",function(){
		this.src0 = "web_img/white.png";
		this.src1 = "web_img/icon.png";
		this.word = "兑奖中心";
		this.url = "web_gameuser.html";
		this.src = "web_img/0.jpg";
		this.navbox = navbox;
	});
	app.controller("agduigiftctrl",function(){
		this.liwus = liwus;
		this.liwu=function() {
            $('#overlaygift').fadeIn('fast', function () {
                $('#boxgift').animate({ 'top': '100px' }, 500);
            });
      	};
	});
	app.controller("agdgiftctrl",function(){
		this.xushu = "请确认花费800金币兑换当前礼品！";
      	this.git = "web_img/gift.jpg";
      	this.wu = "鲜花包装卡";
      	this.dol = "兑换币：800";
      	this.xiao = "取  消";
      	this.href = "web_giftlist.html";
      	this.huan = "兑  换";
	});