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

function weekDates(date) {
	var arys1 = new Array();
	var arys2 = new Array();
	var day = 0;
	if(date != null && date != "") {
		arys2 = date.split(' ');
		arys1 = arys2[0].split('-'); //日期为输入日期，格式为 2013-3-10
		var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
		day = ssdate.getDay();
	}
	var weekDate = "";
	switch(day) {
		case 1:
			weekDate = "周一";
			break;
		case 2:
			weekDate = "周二";
			break;
		case 3:
			weekDate = "周三";
			break;
		case 4:
			weekDate = "周四";
			break;
		case 5:
			weekDate = "周五";
			break;
		case 6:
			weekDate = "周六";
			break;
		case 0:
			weekDate = "周日";
			break;
		default:
			weekDate = "错误";
	}
	return weekDate;
}

function matchList($http, $scope, $rootScope, matchDay) {
	$http.get(url + 'queryMatchInfo.do?matchDay=' + matchDay).success(function(data) {
		var matchList = data.listMatchInfo;
		var list = new Array();
		if(matchList.length == 0) {
			$rootScope.type = false;
		}
		for(var i = 0; i < matchList.length; i++) {
			$rootScope.type = true;
			var matchInfo = matchList[i];
			var obj = new Object();
			var hscore_half = "";
			var hscore = "";
			var ascore_half = "";
			var ascore = "";

			if(matchInfo.home_score_half == null) {
				hscore_half = "";
			} else {
				hscore_half = matchInfo.home_score_half;
			}
			if(matchInfo.home_score == null) {
				hscore = "";
			} else {
				hscore = matchInfo.home_score;
			}
			if(matchInfo.away_score_half == null) {
				ascore_half = "";
			} else {
				ascore_half = matchInfo.away_score_half;
			}
			if(matchInfo.away_score == null) {
				ascore = "";
			} else {
				ascore = matchInfo.away_score;
			}
			obj.title = matchInfo.match_code + "     " + matchInfo.home_team + "  VS  " + matchInfo.away_team + "      " + matchInfo.rq_type + "    " + matchInfo.code + "     " + hscore_half + "-" + ascore_half + "        " + hscore + "-" + ascore;
			obj.match_code = matchInfo.match_code;
			var maps = jQuery.parseJSON(matchInfo.weekid);
			var paramp1 = maps.paramp1;
			var paramp2 = maps.paramp2;
			var paramp3 = maps.paramp3;
			var paramp4 = maps.paramp4;
			if(matchInfo.rq_type == "未") {
				obj.font = "font-size:11";
			} else {
				obj.font = "";
			}
			obj.time1 = paramp1.prama4;
			obj.time2 = paramp2.prama4;
			obj.time3 = paramp3.prama4;
			obj.time4 = paramp4.prama4;

			obj.score1 = paramp1.prama5;
			obj.score2 = paramp2.prama5;
			obj.score3 = paramp3.prama5;
			obj.score4 = paramp4.prama5;

			obj.H1 = paramp1.prama1;
			obj.H2 = paramp2.prama1;
			obj.H3 = paramp3.prama1;
			obj.H4 = paramp4.prama1;

			obj.line1 = paramp1.prama3;
			obj.line2 = paramp2.prama3;
			obj.line3 = paramp3.prama3;
			obj.line4 = paramp4.prama3;

			obj.A1 = paramp1.prama2;
			obj.A2 = paramp2.prama2;
			obj.A3 = paramp3.prama2;
			obj.A4 = paramp4.prama2;
			list[i] = obj;
		}
		$rootScope.playlists = list;
	}).finally(function() {
		$scope.$broadcast('scroll.refreshComplete');
	});
}