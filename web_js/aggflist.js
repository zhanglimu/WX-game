var app = angular.module("aggflist",[]);
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
		{"url":"web_gift.html","text":"兑奖中心"},
		{"url":"web_giftlist.html","text":"兑奖记录","selected":true},
		{"url":"#","text":"关于"}
	];
	var userry = [
		{"text":"收入方式"},
		{"text":"收入"},
		{"text":"时间"},
		{"text":"支出方式"},
		{"text":"支出"},
		{"text":"时间"}
	];
	var useey = [
		{"te":"签到","tex":"200金币","text":"01-13 15:35","text1":"买票","text2":"500金币","text3":"17:20",},
		{"te":"卖票","tex":"200金币","text":"01-13 15:35","text1":"买票","text2":"500金币","text3":"17:20",},
		{"te":"兑换","tex":"200金币","text":"01-13 15:35","text1":"买票","text2":"500金币","text3":"17:20",},
	];
	var ussy = [
		{"text":"用户名"},
		{"text":"买家兑换币"},
		{"text":"兑换方式"},
		{"text":"兑换礼品"},
		{"text":"兑换状态"}
	];
	var usey = [
		{"te":"hdjfh","tex":"-6000币","text":"1000币+票价","text1":"十元滴滴代金券","text2":"已成功兑换"},
		{"te":"hdjfh","tex":"-6000币","text":"1000币+票价","text1":"十元滴滴代金券","text2":"已成功兑换"},
		{"te":"hdjfh","tex":"-6000币","text":"1000币+票价","text1":"十元滴滴代金券","text2":"已成功兑换"},
	];
	var uusey = [
		{"te":"hdjfh","tex":"-6000币","text":"1000币+票价","text1":"十元滴滴代金券","text2":"已成功兑换"},
		{"te":"zhan哈酒","tex":"-6000币","text":"1000币+票价","text1":"十元滴滴代金券","text2":"已成功兑换"},
		{"te":"dhjsjf","tex":"-6000币","text":"1000币+票价","text1":"十元滴滴代金券","text2":"已成功兑换"},
	];
	app.controller("aggflistctrl",function(){
		this.src0 = "web_img/white.png";
		this.src1 = "web_img/icon.png";
		this.word = "兑奖记录";
		this.url = "web_gameuser.html";
		this.src = "web_img/0.jpg";
		this.navbox = navbox;
	});
	app.controller("aghuanctrl",function(){
		
		this.hai = "web_img/0.jpg"; 
		this.jinbi = "web_img/sum.png";
		this.mon = "2315.548";
		this.hu = "共兑换";
		this.ci = "56次";
		this.auto = "连续签到7天，奖250金币。";
		this.auto0 = "连续签到一个月可获支付宝10元代金券一张";
		
		this.user = "账户"; 
		this.ren = "个人记录";
		this.lu = "其它记录";
		
		this.userry = userry;
		this.useey = useey;
		
		this.ussy = ussy;
		this.usey = usey;
		
		this.uusey = uusey;
		
		this.hu = "共兑换";
		this.ci = "56次";
		this.auto = "连续签到7天，奖250金币。";
		this.auto0 = "连续签到一个月可获支付宝10元代金券一张";
	});