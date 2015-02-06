/**
 * Created by zhenqing.wang on 11/28/14.
 */



function showApplyTodoOrHistoryDetailsList(id, tableId, status) {
    if (isNull(id)) {
        $("#" + tableId).html('');
        return;
    }
    var params = {
        "vars": {
            "formId": id
        }
    };
    $.ajax({
        "contentType": "application/json; charset=utf-8",
        "url": "approve_info",
        "type": "POST",
        "data": JSON.stringify(params),
        success: function (resp) {
            if (resp.errorCode == 0) {
                if (resp.data.length != 0) {
                    try {
                        var details = resp.data;
                        var html = '';
                        html += __generateDetailHtml('当前审批状态', 'icon-eye-open', [status], true);
                        html += __generateDetailHtml('审批历史', 'icon-book', details, true);
                        $("#" + tableId).html(html);
                    } catch (e) {
                    }
                } else {
                    $("#" + tableId).html('无详细信息');
                }
            } else {
                $("#" + tableId).html(resp.errorMessage);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    });
}

function sendEmailToCandidate(id) {
    var params = {
        "vars": {
            "formId": id
        }
    };
    $.ajax({
        "contentType": "application/json; charset=utf-8",
        "type": "POST",
        "url": "push_approve",
        "data": JSON.stringify(params),
        "success": function (resp) {
            if (resp.errorCode == 0) {
                showSuccessTips(resp.data);
            } else {
                showCommonNoticeDialog('失败', 'icon-warning-sign',
                    generateNoticeMsg(resp.errorMessage), 300);
            }
        },
        error: function () {
            showCommonNoticeDialog('网络错误', 'icon-bolt',
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    });
}

function restartForm(id) {
    var params = {
        "vars": {
            "formId": id
        }
    };
    $.ajax({
        "contentType": "application/json; charset=utf-8",
        "type": "POST",
        "url": "restart_form",
        "data": JSON.stringify(params),
        "success": function (resp) {
            if (resp.errorCode == 0) {
                showSuccessTips(resp.data);
            } else {
                showCommonNoticeDialog('失败', 'icon-warning-sign',
                    generateNoticeMsg(resp.errorMessage), 300);
            }
        },
        error: function () {
            showCommonNoticeDialog('网络错误', 'icon-bolt', generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    });
}


