var now = new Date();
var minDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
//var maxDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
var datePickerCfg = {
	theme: 'android-holo-light',   //mobiscroll   
	lang: 'zh',    					  
	display: 'modal',  				  
	mode: 'clickpick',
	min: minDate
};
function dateTimePicker(id) {
	$('#'+id).mobiscroll().datetime({
		theme: datePickerCfg.theme,      
		lang: datePickerCfg.lang,    					  
		display: datePickerCfg.display,  				  
		mode: datePickerCfg.mode,
		min: datePickerCfg.min
	});
}
function datePicker(id) {
	$('#'+id).mobiscroll().date({
		theme: datePickerCfg.theme,                          				 
		lang: datePickerCfg.lang,                                           
		display: datePickerCfg.display,                                     
		mode: datePickerCfg.mode,
		min: datePickerCfg.min			
	});
}
function datePickerDaily(id) {
	$('#'+id).mobiscroll().date({
		theme: datePickerCfg.theme,                          				 
		lang: datePickerCfg.lang,                                           
		display: datePickerCfg.display,                                     
		mode: datePickerCfg.mode,
		minDate: datePickerCfg.min,
		maxDate: new Date()
	});
}

//打分
function markscore(id, score) {
	var scoreArr = new Array();
	for(var i=1; i<=parseInt(score); i++) {
		scoreArr.push(i + "分");
	}
	$('#'+id).mobiscroll().rating({
	    theme: 'mobiscroll',
	    display: 'bottom',
	    lang: 'zh', 
	    values: scoreArr,
	    label: 'Rating',
	    onSelect: function (event, inst) {
        	//alert(inst.getVal());
        	$('#'+id+'_dummy').val(inst.getVal());
        	$('#'+id+'_dummySpan').text(inst.getVal());
    	}
	});
}
//下拉选择(从本地加载数据)
function dropDown(id, headerText, placeholder) {
	$('#'+id).mobiscroll().select({
	    theme: 'mobiscroll',
	    display: 'bottom',
	    lang: 'zh',
	    headerText:headerText,
	    placeholder: placeholder,
	    selectedText: '',
	    minWidth: 200
	});
}
//下拉选择(从远程服务器加载数据)
function dropDownRemote(id, headerText, data) {
	$('#'+id).mobiscroll().select({
	    theme: 'mobiscroll',
	    display: 'bottom',
	    lang: 'zh',
	    headerText: headerText,
	    data: data,
	    minWidth: 200
	});
}
