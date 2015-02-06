/**
 * Created by zhenqingwang on 12/1/14.
 */

function generateNoticeMsg(msg) {
    return $.parseStr('<div class="alert alert-info bigger-110" style="margin-bottom: 0px; margin-top: 5px;">%s</div>', msg);
}

function __generateLIHeader(header, icon) {
    return $.parseStr('<li class="%s" style="color: #307ecc; padding-bottom: 10px;">%s</li>', icon, header);
}

function __generateLIData(data) {
    return $.parseStr('<li style="list-style-type:none;padding-left: 20px">%s</li>', data);
}

function __generateDetailHtml(header, header_icon, data_list, with_hr) {
    var html = '';
    html += '<div class="space-4"></div>';
    html += __generateLIHeader(header, header_icon);
    for (var i = 0; i < data_list.length; i++) {
        if (isNull(data_list[i])) {
            html += '<div class="space-4"></div>';
        } else {
            html += __generateLIData(data_list[i]);
        }
    }
    html += '</ul>';
    html += '<div class="space-4"></div>';
    if (with_hr) {
        html += '<hr style="margin: 0 0 10px 0;">'
    }
    return html;
}

//显示编辑对话框
function showEditDialog(formId) {
    var params = {
        "vars": {
            "formId": formId
        }
    };
    $.ajax({
        "contentType": "application/json; charset=utf-8",
        "url": "oa/apply_info",
        "type": "POST",
        "data": JSON.stringify(params),
        success: function (resp) {
            if (resp.errorCode == 0) {
                var data = resp.data;
                var tableMap = data.tableMap;
                var vars = data.vars;
                constructEditDialogDatas(tableMap, vars);
            } else {
                showCommonNoticeDialog('失败', 'icon-warning-sign',
                    generateNoticeMsg(resp.errorMessage), 300);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    });

}


function constructEditDialogDatas(tableMap, vars) {
    $('#edit-form').html(edit_form);
    var fixedInfo = '<div style="text-align:center; vertical-align:middle;">';
    fixedInfo += fixedTableInfo(tableMap, vars);
    fixedInfo += '</div>';
    $('#edit_content').append(fixedInfo);
    $("#dialog-confirm").removeClass('hide').dialog({
        width: 1100,
        height: 1100,
        modal: true,
        draggable: true,
        resizable: false,
        title: "报销页详情",
        close: function () {
            $('#edit-form').empty();
            $("#dialog-confirm").dialog('close');
            $(this).dialog('destroy');
        }
    });
}

function fixedTableInfo(tableMap, vars) {
    var tableList = ["table1", "table6", "table2", "table3", "table4", "table5"];
    var tableHeadList = ["出租车费明细(含汽车燃油费)", "通信费",
        "餐费明细（每人每餐报销不超过50元）",
        "招待费明细", "员工关系费明细", "其他费用"];
    //var tableForm = "<iframe style='height:1100px; width:1200px'></iframe>";
    var tableForm = "";
    tableForm += table0BodyForm(tableMap["table"], vars); //这里应该先加table信息
    for (var i = 0; i < 6; i++) {
        tableForm += tableHeadForm(tableHeadList[i]);
        tableForm += $.parseStr('<table frame="vsides" id="%s" style="width: 1067px;">', tableList[i]);
        var num1 = i;
        var num2 = i;
        if (i > 0) {
            num1 -= 1;
        } else {
            num2 += 1;
        }
        if (tableList[i] == "table6") {
            tableForm += table6BodyForm(vars);
        } else {
            tableForm += tableBodyForm(tableMap, tableList[i], num1);
        }
        tableForm += '</table>';
        if (tableList[i] != "table6") {
            tableForm += tableSumForm(num2, vars);
        }
    }
    tableForm += tableApproveBodyForm(tableMap["table7"]);
    $("#sum").val(vars["sum"]);
    return tableForm;
}

//  每个表的第一行中文字符。
function tableZeroNameDic() {
    var table1Name = ["日期", "起点", "终点", "具体时间", "用途", "同行人(姓名)", "工时", "金额", "备注"];
    var table2Name = ["日期", "就餐地点", "同行人（姓名）", "就餐人数", "实报金额", "人均餐费", "发票金额", "工时", "备注"];
    var table3Name = ["日期", "地点", "业务目的", "客户单位", "客户姓名", "参加人数", "金额"];
    var table4Name = ["日期", "地点", "同行人（姓名）", "活动目的", "金额", "备注"];
    var table5Name = ["费用项目", "金额", "备注"];
    var tableNames = [table1Name, table2Name, table3Name, table4Name, table5Name];
    return tableNames;
}

function tableHeadForm(headName) {
    var tableHead = '';
    tableHead += '<div style="border:solid 1px; background-color: #f0f0f0;text-align: center;">';
    tableHead += $.parseStr('<span style="font-size:18px">%s</span>', headName);
    tableHead += '</div>';
    return tableHead;
}

function tableBodyForm(tableMap, tableId, num) {
    var tableNames = tableZeroNameDic();
    var headNameList = tableNames[num];
    var bodyForm = '';
    var headLen = headNameList.length;
    bodyForm += '<tr>';
    for (i = 0; i < headLen; i++) {
        bodyForm += '<td bgcolor="#96E0E2">';
        bodyForm += headNameList[i];
        bodyForm += '</td>';
    }
    bodyForm += '</tr>';
    var tableInfo = tableMap[tableId];
    var tableLen = tableInfo.length;
    if (tableLen == 0) {
        bodyForm += '<tr>';
        for (var i = 0; i < headLen; i++) {
            bodyForm += '<td>';
            bodyForm += '<input type="text" style="width: 100%" readonly="readonly" value="">';
            bodyForm += '</td>';
        }
        bodyForm += '</tr>';
    } else {
        for (i = 0; i < tableLen; i++) {
            bodyForm += '<tr>';
            for (var j = 0; j < headLen; j++) {
                var value = tableInfo[i][j];
                if (isNull(value)) {
                    value = "";
                }
                bodyForm += '<td>';
                bodyForm += $.parseStr('<input type="text" style="width: 100%;color:#000000" ' +
                'readonly="readonly" value="%s">', value);
                bodyForm += '</td>';
            }
            bodyForm += '</tr>';
        }
    }
    return bodyForm;
}

function table6BodyForm(vars) {
    var form = '';
    form += '<tr>';
    form += '<td>金额</td>';
    form += '<td>';
    form += $.parseStr('<input type="text" value="%s" style="width: 100%;color:#000000" id="sum6">', vars["sum6"]);
    form += '</td>';
    form += '<td>备注(话费实际发生月份)</td>';
    form += '<td>';
    form += $.parseStr('<input type="text" value="%s" style="width: 100%;color:#000000" id="remark">', vars["remark"]);
    form += '</td>';
    form += '</tr>';
    return form;
}

function table0BodyForm(table0, vars) {
    var form = '';
    form += tableHeadForm("个人基本信息");
    form += '<table id="table" frame="vsides" rules="all" style="width: 1067px;">';
    var list1 = ["申请人", "人员编号", "申请日期"];
    var list2 = ["一级部门", "申请部门", "部门编号"];
    var list3 = ["是否直接向VP汇报", "银行卡", "开户银行"];
    var list4 = ["是否有借款", "借款单流水号", "借款金额"];
    var list = [list1, list2, list3, list4];
    var k = 0;
    for (var i = 0; i < 4; i++) {
        form += '<tr>';
        for (var j = 0; j < 3; j++) {
            form += $.parseStr('<td>%s</td>', list[i][j]);
            var value = table0[0][k];
            if (isNull(value)) {
                value = "";
            }
            form += $.parseStr('<td><input type="text" style="width: 100%;color:#000000" ' +
            'readonly="readonly" value="%s"></td>', value);
            k++;
        }
        form += '</tr>';
    }
    form += tableSumForm("", vars);
    return form;
}

function tableApproveBodyForm(table7) {
    var form = '';
    form += tableHeadForm("审批记录");
    form += '<table id="table7" style="width: 1067px;" border="1">';
    var list1 = ["本部门主管意见", "部门总监意见"];
    var list2 = ["部门VP意见", "财务总监意见"];
    var list3 = ["CFO意见", "CEO意见"];
    var list4 = ["报销审核组", "出纳"];
    var list = [list1, list2, list3, list4];
    var k = 0;
    for (var i = 0; i < 4; i++) {
        form += '<tr>';
        for (var j = 0; j < 2; j++) {
            var value1 = table7[k][0];
            var value2 = table7[k][1];
            if (isNull(value1)) {
                value1 = "";
            }
            if (isNull(value2)) {
                value2 = "";
            }
            form += '<td>';
            form += $.parseStr('<table><tr><td style="width: 100px;">%s</td><td>' +
            '<input type="text" value="%s"></td><td><input type="text" value="%s">' +
            '</td></tr></table>', list[i][j], value1, value2);
            form += '</td>';
            k++;
        }
        form += '</tr>';

    }
    return form;
}

function tableSumForm(num, vars) {
    var sumOne = "sum" + num;
    var sum = vars[sumOne];
    var form = '';
    form += '<table style="border-collapse:collapse;width: 1067px;" border="1">';
    form += '<tr>';
    form += '<td>金额总计</td>';
    form += '<td>';
    form += $.parseStr('<input type="text" value="%s" id="%s" readonly="readonly"  style="width: 100%;color:#000000">',
        sum, sumOne);
    form += '</td>';
    form += '<tr>';
    form += '</table>';
    return form;
}


jQuery(function ($) {

    $.extend(true, $.fn.dataTable.defaults, {
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sEmptyTable": "无数据",
            "sProcessing": "正在获取数据，请稍后...",
            "oPaginate.sFirst": "第一页",
            "oPaginate.sLast": "最后一页",
            "oPaginate.sNext": "下一页",
            "oPaginate.sPrevious": "上一页",
            "sInfo": "本页 _START_ - _END_ , 共 _TOTAL_ 条记录",
            "sInfoEmpty": "本页 0 - 0 , 共 0 条记录",
            "sSearch": "搜索: ",
            "sLengthMenu": "共_MENU_记录"
        }
    });

});

function toggleCheck(oTable) {
    $('input', oTable.fnGetNodes()).unbind("click");
    $('input', oTable.fnGetNodes()).on("click", function () {
        $(this).prop('checked', this.checked);
        $(this).attr('checked', this.checked);
    });
    $('#current-checkbox-select-all').unbind("click");
    $('#current-checkbox-select-all').on("click", function () {
        $('input', oTable.fnGetNodes()).prop('checked', this.checked);
        $('input', oTable.fnGetNodes()).attr('checked', this.checked);
    });
}

function showResultDialog(id, header, header_icon, msg, width) {
    $("#"+id).append(msg);
    var title_html_str = $.parseStr('<div class="dialog_title"><li class="%s"></li> %s</div>', header_icon, header);
    var edit_dialog = $("#"+id).removeClass('hide').dialog({
        modal: true,
        width: width,
        resizable: true,
        title: title_html_str,
        title_html: true,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close").hide();
        },
        buttons: [
            {
                text: "确定",
                "class" : "btn btn-primary btn-xs",
                click: function(){
                    $("#"+id).empty();
                    $("#"+id).dialog('destroy');
                }
            }
        ],
        close: function() {
            $("#"+id).empty();
            $("#"+id).dialog('destroy');
        }
    });
}