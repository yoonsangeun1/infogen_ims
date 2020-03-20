/**********************************************
jquery-uti.js
공통 jquery util
history
    - 2020.03 이병욱 최초작성
***********************************************/

var g_dialog;       // 다이얼로그 공통
var g_modal;        // 모달 공통
var g_toast;        // 토스트 팝업 공통
var g_mask;         // 로딩 마스크 공통

/********************************************
페이지 로딩 후 공통 적용
********************************************/
$(document).ready(function(){
    // 공통 다이얼로그 생성, alert이나 confirm팝업
    g_dialog = new ax5.ui.dialog({
        title: '',
        lang:{
            "ok": "확인", "cancel": "취소"
        }
    });

    // 공통 모달 팝업 생성
    g_modal = new ax5.ui.modal({
        onStateChanged: function () {

        }
    });

    // 공통 토스트 팝업생성
    g_toast = new ax5.ui.toast({
        containerPosition: "top-right",
        onStateChanged: function(){

        }
    });

	// 공통 로딩 마스크 생성
	g_mask = new ax5.ui.mask();

    // ajax csrftoken 설정
	$.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });

    // ajax 요정 시작시 로딩 마스크 실행
	$(document).ajaxStart(function(){
		g_mask.open({
			content: '<h1><i class="fa fa-spinner fa-spin"></i> Loading</h1>'
		});
	});

    // ajax 종료시 로딩 마스크 close
	$(document).ajaxStop(function(){
		g_mask.close();
	});
});

/**********************************************8
쿠키 가져오기
************************************************/
function getCookie(c_name){
    if (document.cookie.length > 0){
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1){
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 }

/*********************************************************
그리드 공통
그리드 생성 후 그리드 반환
ex) $('divID').initGrid(json type grid option);
**********************************************************/
(function($){
	$.fn.initGrid = function(opts){
		var options = $.extend({}, $.fn.initGrid.defaultOpts, opts);
		options.target = this;

		var grid = new ax5.ui.grid();
		grid.setConfig(options);

		return grid;
	};
	
	$.fn.initGrid.defaultOpts = {
	    columns: [
	        {key: "a", label: "field  A", align: "center"},
	        {key: "b", label: "field  B", align: "center"},
	        {key: "c", label: "field  C", align: "center"},
	        {key: "d", label: "field  D", align: "center"},
	        {key: "e", label: "field  E", align: "center"}
	    ],
		showLineNumber: true,
		showRowSelector: false,
        multipleSelect: false,
        lineNumberColumnWidth: 40,
        rowSelectorColumnWidth: 27,
		frozenColumnIndex: 0,
        frozenRowIndex: 0,
		header: {
			align: "center",
			columnHeight: 40
        },
        body: {
			align: "center",
			columnHeight: 40
		},
		sortable: false,
		multiSort: false,
		mergeCells: false
	};
})(jQuery);

/*********************************************************
ajax 공통
특정 div나 form 등 특정 태그 내의 input, select box, textarea의 값들을 json 데이터로 변환하여 ajax 요청
ex) $('divID or formID or etcID...').ajaxCall(json type jquery ajax option);
**********************************************************/
(function($){
	$.fn.ajaxCall = function(opts){
	    var data = {};

	    $(this).find('input,select,textarea').each(function(idx){
            var key = $(this).attr('name');
            var val = $(this).val();
            var type = $(this).attr('type');

            if(val != ''){
                if(type == 'checkbox'){
                    if($(this).is(':checked')){
                        if(data.hasOwnProperty(key)){
                            data[key].push(val);
                        }else{
                            var arr = new Array();
                            arr.push(val);

                            data[key] = arr;
                        }
                    }
                }else{
                    data[key] = val;
                }
            }else{
                data[key] = '';
            }
	    });

	    var ajaxOpts = {
	        method: opts.method,
            url: opts.url,
            data: {param : JSON.stringify(data)},
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown ){
                g_dialog.setConfig({
                    title: 'Error!!'
                });

                g_dialog.alert(jqXHR.statusText);
            },
            success: function(data, textStatus, jqXHR){
                if(typeof opts.callbackFn == 'function') opts.callbackFn(data);
	            else if(typeof opts.callbackFn == 'string') eval(opts.callbackFn + '(data)');
            }
	    }
	    if(opts.global != undefined && typeof opts.global == 'boolean') ajaxOpts.global = opts.global;
	    if(opts.global != undefined && (opts.global == 'true' || opts.global == 'false')) ajaxOpts.global = (opts.global == 'true');

        $.ajax(ajaxOpts);
	};
})(jQuery);

/*********************************************************
ajax 공통
개발자가 직접 생성한 데이터로 ajax 호출
ex) $.ajaxCall(json type data, json type jquery ajax option);
**********************************************************/
(function($){
	$.ajaxCall = function(data, opts){
	    var ajaxOpts = {
	        method: opts.method,
            url: opts.url,
            data: {param : JSON.stringify(data)},
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown ){
                g_dialog.setConfig({
                    title: 'Error!!'
                });

                g_dialog.alert(jqXHR.statusText);
            },
            success: function(data, textStatus, jqXHR){
                if(typeof opts.callbackFn == 'function') opts.callbackFn(data);
	            else if(typeof opts.callbackFn == 'string') eval(opts.callbackFn + '(data)');
            }
	    }
	    if(opts.global != undefined && typeof opts.global == 'boolean') ajaxOpts.global = opts.global;
	    if(opts.global != undefined && (opts.global == 'true' || opts.global == 'false')) ajaxOpts.global = (opts.global == 'true');

        $.ajax(ajaxOpts);

	};
})(jQuery);

function alertMsg(comment){
    var title = '<span style="color:#c82333;font-size:20px;"><i class="fa fa-exclamation-circle"></i></span> ALERT';
    //var msg = '<div class="row">'
    //msg += '<div class="col-3"><span style="color:#c82333"><i class="fa fa-exclamation-circle fa-5x"></i></span></div>';
    //msg += '<div class="col-9">' + comment + '</div>';
    //msg += '</div>';

    g_dialog.alert({
        theme : 'info',
        title : title,
        msg : comment
    });
}

function confirmMsg(comment, callbackfn){
    var title = '<span style="color:#fd7e14;font-size:20px;"><i class="fa fa-check-circle"></i></span> CHECK';
    //var msg = '<div class="row">'
    //msg += '<div class="col-3"><span style="color:#fd7e14"><i class="fa fa-check-circle fa-5x"></i></span></div>';
    //msg += '<div class="col-9">' + comment + '</div>';
    //msg += '</div>';

    g_dialog.confirm({
        theme : 'info',
        title : title,
        msg : comment
    }, function(){
        if(typeof callbackfn == 'function') callbackfn();
        else if(typeof callbackfn == 'string') eval(callbackfn + '()');
    });
}

function getCodes(grpArr, callbackFn){
    var data = {
        grps : grpArr
    };
    var options = {
        method : 'get',
        url : '',
        global : false,
        callbackFn :  callbackFn
    };

    $.ajaxCall(data, options);
}

(function($){
    $.fn.selectbox = function(opts){
        var grpArr = new Array();
        var selArr = new Array();
        $(this).each(function(){
            var grp = $(this).attr('grp');
            if(grp != undefined && grp != ''){
                grpArr.push(grp);
                selArr.push(this);
            }
        });

        getCodes(grpArr, function(data){
            $(selArr).each(function(idx){
                var codes = data[grpArr[idx]];
                var options = '<option value="">선택</option>';

                for(var i = 0;i < codes.length;i++){
                    options += '<option value="' + codes[i].cmm_api_cd + '">' + codes[i].cmm_api_cd_nm + '</option>';
                }

                $(this).html(options);
            });
        });
    };
});