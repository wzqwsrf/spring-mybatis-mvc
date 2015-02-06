
String.format = function(src) {  
    if (arguments.length == 0) return null;  
    var args = Array.prototype.slice.call(arguments, 1);  
    return src.replace(/\{(\d+)\}/g, function(m, i){  
        return args[i];  
    }); 
}; 

jQuery(function($) {
    // 进入页面后，默认显示正在审批的申请
    reloadUnfinishedApplicationTable();
    // 切换Tab时，进行刷新
    $('#unfinished-application-tab').on("click", function() {
        reloadUnfinishedApplicationTable();
        showUnfinishedApplicationDetailsList();
    });
    $('#history-application-tab').on("click", function() {
        reloadHistoryApplicationTable();
        showHistoryApplicationDetailsList();
    });
    $('#user-hostlist-tab').on("click", function() {
        reloadUserHostListTable();
        showHostInfo();
    });
});

function showHostInfo(hostname) {
    if (hostname == undefined || hostname == '') {
        $("#host-info").html('');
        return;
    }
    $.ajax({
        dataType: 'json',
        url: "host/details?hostname=" + hostname,
        type: "GET",
        success: function(resp) {
            if (resp.success) {
                if (resp.data.length != 0) {
                    try {
                        var details = resp.data;
                        var html = '';
                        html += __generateDetailHtml('主机名', 'icon-desktop', details['hostname']);
                        html += __generateDetailHtml('IP', 'icon-bolt', details['hostip']);
                        html += __generateDetailHtml('用途', 'icon-cogs', details['usage']);
                        html += __generateDetailHtml('操作系统类型', 'icon-laptop', details['os_name']);
                        html += __generateDetailHtml('类型', 'icon-cloud', details['type']);
                        $("#host-info").html(html);
                    } catch (e) {
                    }
                } else {
                    $("#host-info").html('无详细信息');
                }
            } else {
                $("#host-info").html(resp.msg);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showCommonNoticeDialog('网络错误', 'icon-warning-sign', 
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    })
}

function loadUserHostListTable() {
    $("#account-page").mask("加载中...");
    var oTable = $('#user-hostlist-table').dataTable({
        bFilter: true,
        aLengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "所有"]],
        iDisplayLength: 50,
        bAutoWidth: false,
        bProcessing: true,
        bServerSide: false,
        bInfo: true,
        bSort: true,
        aoColumns: [
            {"sTitle": '<li class="icon-desktop"></li> 主机名'},
            {"sTitle": '<li class="icon-group"></li> 隶属组'}
        ],
        aaSorting: [[ 0, "asc" ]],
        sAjaxSource: "user/hosts",
        fnServerData : function(sSource, aDataSet, fnCallback) {
            $.ajax({
                dataType: 'json',
                url: sSource,
                type: "GET",
                success: function(resp) {
                    if (resp.success) {
                        var data = resp.data.length != 0 ? resp.data : {aaData: []};
                        fnCallback(data);
                    } else {
                        fnCallback({aaData: []});
                        showCommonNoticeDialog('获取我的主机列表失败', 'icon-warning-sign',
                            generateNoticeMsg(resp.msg), 300);
                    }
                    $("#account-page").unmask();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#account-page").unmask();
                    showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                        generateNoticeMsg('网络错误，请刷新后重试!'), 300);
                }
            })
        },
        fnInitComplete: function() {
            var div = document.createElement("div");
            div.id="user-hostlist-table-height-limter";
            $("#user-hostlist-table").wrap(div);
            $.setObjectFull($("#user-hostlist-table-height-limter"), 200, 9, 0);
        },
        fnDrawCallback: function() {
            $("#user-hostlist-table tbody tr").unbind("click");
            $("#user-hostlist-table tbody tr").on("click", function(e) {
                try {
                    var sTitle;
                    var nTds = $('td', this);
                    var hostname = $(nTds[0]).text();
                    showHostInfo(hostname);
                } catch (e) {
                }
            }).on("dblclick", function(e){
                e.preventDefault();  
            });
        }
    });
    addHelpLinkToTab();
}

function reloadUserHostListTable() {
    var ex = document.getElementById('user-hostlist-table');
    if($.fn.dataTable.fnIsDataTable(ex)){
        $(ex).dataTable().fnDestroy();
    }
    loadUserHostListTable();
}

function loadUnfinishedApplicationTable() {
    $("#account-page").mask("加载中...");
    var oTable = $('#unfinished-application-table').dataTable({
        bFilter: false,
        aLengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "所有"]],
        iDisplayLength: 50,
        bAutoWidth: false,
        bProcessing: true,
        bServerSide: false,
        bInfo: true,
        bSort: true,
        aoColumns: [
            //{"sTitle": '<input id="unfinished-application-table-select-all" ' +
                //'type="checkbox" value="ALL">&nbsp;&nbsp;<span>全选</span>',
            {"sTitle": '<input id="unfinished-application-table-select-all" ' +
                'type="checkbox" value="ALL">',
            "sWidth": "30px", "bSortable": false},
            {"sTitle": '<li class="icon-key"></li> ID', "sWidth": "75px"},
            {"sTitle": '<li class="icon-desktop"></li> 主机名'},
            {"sTitle": '<li class="icon-group"></li> 隶属组', "sWidth": "150px"}
        ],
        aaSorting: [[ 1, "desc" ]],
        aoColumnDefs: [
            {
                "fnRender": function (obj) {
                    return '<input type="checkbox" value="'+ obj.aData[1] +'">';
                },
                "aTargets": [ 0 ]
            }
        ],
        sAjaxSource: "user/application/unfinished",
        fnServerData : function(sSource, aDataSet, fnCallback) {
            $.ajax({
                dataType: 'json',
                url: sSource,
                type: "GET",
                success: function(resp) {
                    if (resp.success) {
                        var data = resp.data.length != 0 ? resp.data : {aaData: []};
                        fnCallback(data);
                    } else {
                        fnCallback({aaData: []});
                        showCommonNoticeDialog('获取正在审批列表失败', 'icon-warning-sign',
                            generateNoticeMsg(resp.msg), 300);
                    }
                    $("#account-page").unmask();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#account-page").unmask();
                    showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                        generateNoticeMsg('网络错误，请刷新后重试!'), 300);
                }
            })
        },
        fnInitComplete: function() {
            var div = document.createElement("div");
            div.id="unfinished-application-table-height-limter";
            $("#unfinished-application-table").wrap(div);
            $.setObjectFull($("#unfinished-application-table-height-limter"), 200, 9, 0);
        },
        fnDrawCallback: function() {
            $("#unfinished-application-table tbody tr").unbind("click");
            $("#unfinished-application-table tbody tr").on("click", function(e) {
                try {
                    var sTitle;
                    var nTds = $('td', this);
                    var id = $(nTds[1]).text();
                    showUnfinishedApplicationDetailsList(id);
                } catch (e) {
                }
            }).on("dblclick", function(e){
                e.preventDefault();  
            });
            $('#unfinished-application-table-select-all').unbind("click");
            $('#unfinished-application-table-select-all').on("click", function() {
                $('input', oTable.fnGetNodes()).prop('checked', this.checked);
                $('input', oTable.fnGetNodes()).attr('checked', this.checked);
                //var text = this.checked ? '全不选' : '全选';
                //$('#unfinished-application-table > thead > tr > th.sorting_disabled > span').html(text);
            }).on("dblclick", function(e){
                e.preventDefault();  
            });
            $('#account-passphrase').unbind("click");
            $('#account-passphrase').on("click", function() {
                accountPasshrase(oTable);
            }).on("dblclick", function(e){
                e.preventDefault();  
            });
            $('#account-application').unbind("click");
            $('#account-application').on("click", function() {
                accountApplication(oTable);
            }).on("dblclick", function(e){
                e.preventDefault();  
            });
            $('#cancel-application').unbind("click");
            $('#cancel-application').on("click", function() {
                cancelApplication(oTable);
            }).on("dblclick", function(e){
                e.preventDefault();  
            });
        }
    });
    $("#unfinished-application-table_wrapper > div:nth-child(1) > div:nth-child(2)").html(
            '<button id="account-passphrase" class="btn btn-xs btn-info" style="float: right">获取Passphrase</button>' +
            '<button id="account-application" class="btn btn-xs btn-primary" style="float: right">申请帐号</button>' +
            '<button id="cancel-application" class="btn btn-xs btn-info" style="float: right">撤销申请</button>');
    addHelpLinkToTab();
}

function addHelpLinkToTab() {
    var ori = $('#application-tab').html();
    if(ori.indexOf("<a href=") > 0) {
        return;
    }
    ori += '<div style="float: right; color: green; padding-right: 20px"><i class="icon-question"></i>&nbsp;<a href="http://wiki.corp.qunar.com/pages/viewpage.action?pageId=52069490" target="_blank">help</a></div>';
    $('#application-tab').html(ori);
}

function loadHistoryApplicationTable() {
    $("#account-page").mask("加载中...");
    var oTable = $('#history-application-table').dataTable({
        bFilter: true,
        aLengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "所有"]],
        iDisplayLength: 50,
        bAutoWidth: false,
        bProcessing: false,
        bServerSide: false,
        bMutiSelect: false,
        bInfo: true,
        bSort: true,
        aoColumns: [
            {"sTitle": "ID", "sWidth": "50px"},
            {"sTitle": "主机名"},
            {"sTitle": "隶属组", "sWidth": "150px"},
            {"sTitle": "申请时间", "sWidth": "100px"},
            {"sTitle": "审批结果", "sWidth": "200px"}
        ],
        aaSorting: [[ 0, "desc" ]],
        sAjaxSource: "",
        fnServerData: function(sSource, aDataSet, fnCallback) {
            $.ajax({
                dataType: 'json',
                url: "user/application/history",
                type: "POST",
                success: function(resp) {
                    if (resp.success) {
                        var data = resp.data.length != 0 ? resp.data : {aaData: []};
                        fnCallback(data);
                    } else {
                        fnCallback({aaData: []});
                        showCommonNoticeDialog('获取历史审批列表失败', 'icon-warning-sign',
                            generateNoticeMsg(resp.msg), 300);
                    }
                    $("#account-page").unmask();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#account-page").unmask();
                    showCommonNoticeDialog('网络错误', 'icon-warning-sign', 
                        generateNoticeMsg('网络错误，请刷新后重试!'), 300);
                }
            })
        },
        fnInitComplete: function() {
            var div = document.createElement("div");
            div.id="history-application-table-height-limter";
            $("#history-application-table").wrap(div);
            $.setObjectFull($("#history-application-table-height-limter"), 200, 9, 0);
        },
        fnDrawCallback: function() {
            $("#history-application-table tbody tr").unbind("click");
            $("#history-application-table tbody tr").on("click", function(e) {
                try {
                    var sTitle;
                    var nTds = $('td', this);
                    var id = $(nTds[0]).text();
                    if ( $(this).hasClass('row_selected') ) {
                        $(this).removeClass('row_selected');
                    } else {
                        oTable.$('tr.row_selected').removeClass('row_selected');
                        $(this).addClass('row_selected');
                    }
                    showHistoryApplicationDetailsList(id);
                } catch (e) {
                }
            }).on("dblclick", function(e){
                e.preventDefault();  
            });
        },
        fnRowCallback: function(nRow, aData, iDisplayIndex) {
            try {
                state = aData[4];
                if (state == "同意") {
                    $('td:eq(4)', nRow).html('<span class="label label-success arrowed-in-right arrowed">' + state + '</span>');
                } else if (state == "拒绝") {
                    $('td:eq(4)', nRow).html('<span class="label label-inverse arrowed-in-right arrowed">' + state + '</span>');
                } else {
                    $('td:eq(4)', nRow).html('<span class="label label-info arrowed-in-right arrowed">' + state + '</span>');
                }
            } catch (e) {
            }
        },
    });
    addHelpLinkToTab();
}

function __generateLIHeader(header, icon) {
    return String.format('<li class="{0}" style="color: #307ecc; padding-bottom: 10px;"> {1}</li>', icon, header);
}

function __generateLIData(data) {
    return String.format('<li>{0}</li>', data);
}

function __generateDetailHtml(header, header_icon, data_list, with_hr) {
    var html = '<ul class="list-unstyled spaced0">';
    var with_hr = arguments[3] != undefined ? arguments[3] : true;
    html += __generateLIHeader(header, header_icon);
    for(var i = 0; i < data_list.length; i++) { 
        html += __generateLIData(data_list[i]);
    } 
    html += '</ul>';
    if (with_hr) {
        html += '<hr style="margin: 0px 0px 10px 0px;">'
    }
    return html;
}

function showUnfinishedApplicationDetailsList(id) {
    if (id == undefined || id == '') {
        $("#unfinished-application-details-list").html('');
        return;
    }
    $.ajax({
        dataType: 'json',
        url: "approve/details?id=" + id,
        type: "GET",
        success: function(resp) {
            if (resp.success) {
                if (resp.data.length != 0) {
                    try {
                        var details = resp.data;
                        var html = '';
                        html += __generateDetailHtml('主机名', 'icon-desktop', details['hostname']);
                        html += __generateDetailHtml('隶属组', 'icon-group', details['group']);
                        html += __generateDetailHtml('当前审批状态', 'icon-eye-open', details['current_state']);
                        html += __generateDetailHtml('审批人列表', 'icon-group', details['approver_list']);
                        html += __generateDetailHtml('审批历史', 'icon-book', details['approve_hisroty']);
                        html += __generateDetailHtml('申请理由', 'icon-comment-alt', details['msg']);
                        html += __generateDetailHtml('申请时间', 'icon-calendar', details['approve_time'], false);
                        $("#unfinished-application-details-list").html(html);
                    } catch (e) {
                    }
                } else {
                    $("#unfinished-application-details-list").html('无详细信息');
                }
            } else {
                $("#unfinished-application-details-list").html(resp.msg);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showCommonNoticeDialog('网络错误', 'icon-warning-sign', 
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    })
}

function showHistoryApplicationDetailsList(id) {
    if (id == undefined || id == '') {
        $("#history-application-details-list").html('');
        return;
    }
    $.ajax({
        dataType: 'json',
        url: "approve/details?id=" + id,
        type: "GET",
        success: function(resp) {
            if (resp.success) {
                if (resp.data.length != 0) {
                    try {
                        var details = resp.data;
                        var html = '';
                        html += __generateDetailHtml('主机名', 'icon-desktop', details['hostname']);
                        html += __generateDetailHtml('隶属组', 'icon-group', details['group']);
                        html += __generateDetailHtml('当前审批状态', 'icon-eye-open', details['current_state']);
                        html += __generateDetailHtml('审批人列表', 'icon-group', details['approver_list']);
                        html += __generateDetailHtml('审批历史', 'icon-book', details['approve_hisroty']);
                        html += __generateDetailHtml('申请理由', 'icon-comment-alt', details['msg']);
                        html += __generateDetailHtml('申请时间', 'icon-calendar', details['approve_time'], false);
                        $("#history-application-details-list").html(html);
                    } catch (e) {
                    }
                } else {
                    $("#history-application-details-list").html('无详细信息');
                }
            } else {
                $("#history-application-details-list").html(resp.msg);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    })
}

function enableAccountApplicationDialogButton(enable) {
    if (enable) {
        $("#account-application-submit").removeAttr('disabled');
        $("#account-application-cancel").removeAttr('disabled');
    } else {
        $("#account-application-submit").attr('disabled', 'true');
        $("#account-application-cancel").attr('disabled', 'true');
    }
}

function enableAccountApplicationToolbarButton(enable) {
    if (enable) {
        $("#account-passphrase").removeAttr('disabled');
        $("#account-application").removeAttr('disabled');
        $("#cancel-application").removeAttr('disabled');
    } else {
        $("#account-passphrase").attr('disabled', 'true');
        $("#cancel-application").attr('disabled', 'true');
    }
}

function accountPasshrase(oTable) {
    $.ajax({
        dataType: 'json',
        url: 'user/passphrase',
        type: "GET",
        success: function(resp) {
            if (resp.success) {
                showCommonNoticeDialog('passphrase', 'icon-info-sign',
                    generateNoticeMsg(resp.data), 300);
            } else {
                showCommonNoticeDialog('获取passphrase失败', 'icon-warning-sign',
                    generateNoticeMsg(resp.msg), 300);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    })
}

function accountApplication(oTable) {
    try {
        $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
            _title: function(title){
                var $title = this.options.title || '&nbsp;';
                if(("title_html" in this.options) && (this.options.title_html == true))
                    title.html($title);
                else title.text($title);
            }
        }));
        dialog_width = Math.min(Math.round(window.screen.width*0.7), 900);
        dialog_height = Math.min(Math.round(window.screen.height*0.7), 600);
        $("#account-application-dialog").empty();
        $("#account-application-dialog").append(createAccountApplicationForm(dialog_height - 50));
        $("#group-list").chosen({width: "200px", "disable_search_threshold": 10});
        var dialog = $("#account-application-dialog").removeClass('hide').dialog({
            modal: true,
            width: dialog_width,
            height: dialog_height,
            title: '<div style="color: DodgerBlue; padding: 4px; height: 28px; font-size: 14px; font-weight: bold"><li class="icon-user"></li> 申请帐号</div>',
            title_html: true,
            closeOnEscape: false,
            open: function(event, ui) {
                $(".ui-dialog-titlebar-close").hide();
            },
            buttons: [
                {
                    id: "account-application-submit",
                    text: "提交",
                    "class": "btn btn-primary btn-xs",
                    click: function(e) {
                        $("#account-application-dialog").mask("加载中...");
                        var Me = this;
                        enableAccountApplicationDialogButton(false);
                        try {
                            var this_form = $("#account-application-dialog").find("form");
                            var postData = this_form.serializeArray();
                            for (var i in postData) {
                                if (postData[i]['name'] == 'hostlist') {
                                    if (postData[i]['value'].length == 0) {
                                        $("#account-application-dialog").unmask();
                                        enableAccountApplicationDialogButton(true);
                                        showCommonNoticeDialog('主机名错误', 'icon-warning-sign',
                                            generateNoticeMsg('主机名不能为空'), 300);
                                        return;
                                    }
                                } else if (postData[i]['name'] == 'msg') {
                                    if (postData[i]['value'].length >= 100) {
                                        $("#account-application-dialog").unmask();
                                        enableAccountApplicationDialogButton(true);
                                        showCommonNoticeDialog('申请理由错误', 'icon-warning-sign',
                                            generateNoticeMsg('申请理由不能超过100个字符'), 300);
                                        return;
                                    }
                                }
                            }
                            $.ajax(
                                {
                                    "url": "user/application",
                                    type: "POST",
                                    data : postData,
                                    dataType: "json",
                                    success:function(resp, textStatus, jqXHR) 
                                    {   
                                        try {
                                            enableAccountApplicationDialogButton(true);
                                            $("#account-application-dialog").unmask();
                                            if (resp.success) {
                                                title_html_str = '<div class="dialog_title"><li class="icon-info-sign"></li> 申请账号</div>';
                                                $("#account-application-result-dialog").append(generateNoticeMsg('创建申请成功'));
                                            } else {
                                                title_html_str = '<div class="dialog_title"><li class="icon-exclamation-sign"></li> 申请帐号</div>';
                                                $("#account-application-result-dialog").append(generateNoticeMsg(resp.msg));
                                            }
                                        } catch (e) {
                                        }
                                        var dialog = $("#account-application-result-dialog").removeClass('hide').dialog({
                                            modal: true,
                                            width: 400,
                                            resizable: true,
                                            title: title_html_str,
                                            title_html: true,
                                            closeOnEscape: false,
                                            buttons: [
                                                {
                                                    text: "确定",
                                                    "class" : "btn btn-primary btn-xs",
                                                    click: function(){
                                                        $("#account-application-result-dialog").empty();
                                                        $("#account-application-result-dialog").dialog('destroy');
                                                        reloadUnfinishedApplicationTable();
                                                        if (resp.success) {
                                                            $(Me).dialog("close"); 
                                                        }
                                                    }
                                                }
                                            ],
                                            close: function() {
                                                $("#account-application-result-dialog").empty();
                                                $("#account-application-result-dialog").dialog('destroy');
                                            }
                                        });
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) 
                                    {
                                        $("#account-application-dialog").unmask();
                                        enableAccountApplicationDialogButton(true);
                                        showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                                            generateNoticeMsg('网络错误，请刷新后重试!'), 300);
                                    }
                                });
                                e.preventDefault(); //STOP default action
                        } catch (e) {
                            $("#account-application-dialog").unmask();
                            enableAccountApplicationDialogButton(true);
                            showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
                        }
                    } 
                },
                {
                    id: "account-application-cancel",
                    text: "取消",
                    "class" : "btn btn-xs",
                    click: function() {
                        $(this).dialog("close"); 
                    } 
                }
            ]
        });
    } catch (e) {
        enableAccountApplicationDialogButton(true);
        showCommonNoticeDialog('网络错误', 'icon-warning-sign',
            generateNoticeMsg('网络错误，请刷新后重试!'), 300);
    }
}

function createAccountApplicationForm(height) {
    var form = '<form style="width: 100%; background-color: white"> ';
    form += '<div>';
    form += '<label><li class="icon-desktop"></li> 主机列表：</label>';
    var tips = 'Tips: 可使用范围表达式 l-cloud[1-8].ops.cn1 多组主机之间使用换行分割';
    form += String.format('<textarea id="hostlist-textarea" class="form-control" name="hostlist" style="height: {0}px;" placeholder="{1}"></textarea>', height / 7 * 3, tips);
    form += '</div>';
    form += '<hr>';
    form += '<div><label><li class="icon-group"></li> 隶属组：</label><select id="group-list" name="group" class="chosen-select level-list-select" data-placeholder="隶属组">';
    form += '<option value="qunarengineer">工程师权限</option>';
    form += '<option value="qunardep">自助发布权限</option>';
    form += '<option value="qunarpe">sudo权限</option>';
    form += '</select>';
    form += '</div>';
    form += '<hr>';
    form += '<div>';
    form += '<label><li class="icon-comments"></li> 申请理由：</label>';
    tips = 'Tips: 申请理由请不要超过100个字符';
    form += String.format('<textarea class="form-control" name="msg" style="height: {0}px;" placeholder="{1}"></textarea>', height / 7, tips);
    form += '</div>';
    form += '</form>';
    return form;
}


function cancelApplication(oTable) {
    try {
        enableAccountApplicationToolbarButton(false);
        var ids = [];
        $("input:checked", oTable.fnGetNodes()).each(function() {
            ids.push($(this).val());
        });
        var params = {
            "bpm_ids": ids.join(',')
        };
        if (ids.length < 1) {
            enableAccountApplicationToolbarButton(true);
            showCancelApplicationResultDialog('撤销申请', 'icon-lightbulb', 
            generateNoticeMsg('请选择要撤销申请的条目!'), 300);
            return;
        }
        $("#cancel-application-confirm-dialog").append('<div class="alert alert-info bigger-110">确认撤销申请？</div>');
        title_html_str = '<div class="dialog_title"><li class="icon-lightbulb"></li> 撤销申请</div>';
        var dialog = $("#cancel-application-confirm-dialog").removeClass('hide').dialog({
            modal: true,
            width: 300,
            resizable: true,
            title: title_html_str,
            title_html: true,
            buttons: [
                {
                    text: "提交",
                    "class" : "btn btn-danger btn-xs",
                    click: function(){
                        $("#account-page").mask("加载中...");
                        $("#cancel-application-confirm-dialog").empty();
                        $("#cancel-application-confirm-dialog").dialog('destroy');
                        __cancelReuqest(oTable, params);
                    }
                },
                {
                    text: "取消",
                    "class" : "btn btn-primary btn-xs",
                    click: function(){
                        $("#cancel-application-confirm-dialog").empty();
                        $("#cancel-application-confirm-dialog").dialog('destroy');
                        enableAccountApplicationToolbarButton(true);
                    }
                }],
            close: function() {
                $("#cancel-application-confirm-dialog").empty();
                $("#cancel-application-confirm-dialog").dialog('destroy');
                enableAccountApplicationToolbarButton(true);
            }
        });
    } catch(e) {
    }
}

function __cancelReuqest(oTable, params) {
    $.ajax({
        datatype: 'json',
        url: "user/application/cancel",
        type: "post",
        data: params,
        success: function(resp) {
            var title_html_str = '';
            try {
                if (resp.success) {
                    title_html_str = '<div class="dialog_title"><li class="icon-info-sign"></li> 撤销申请</div>';
                    var succeed_list = resp.data.succeed;
                    var failed_list = resp.data.failed;
                    console.log(resp);
                    if (failed_list.length != 0) {
                        var failed_list_html = '<b style="color: red;"><li class="icon-ban-circle"></li> 撤销失败:</b><br/>';
                        for(var i = 0; i < failed_list.length; i++) { 
                            failed_list_html += '&nbsp;&nbsp;&nbsp;&nbsp;' + failed_list[i] + '<br/>';
                        } 
                        $("#cancel-application-result-dialog").append(generateNoticeMsg(failed_list_html));
                    } else {
                        var succeed_html = '<b><li class="icon-check"></li> 撤销成功</b><br/>';
                        $("#cancel-application-result-dialog").append(generateNoticeMsg(succeed_html));
                    }
                } else {
                    title_html_str = '<div class="dialog_title"><li class="icon-exclamation-sign"></li> 撤销申请</div>';
                    console.debug(resp.msg);
                    $("#cancel-application-result-dialog").append(generateNoticeMsg(resp.msg));
                }
            } catch (e) {
            }
            $("#account-page").unmask();
            var dialog = $("#cancel-application-result-dialog").removeClass('hide').dialog({
                modal: true,
                width: 400,
                resizable: true,
                title: title_html_str,
                title_html: true,
                closeOnEscape: false,
                buttons: [
                    {
                        text: "确定",
                        "class" : "btn btn-primary btn-xs",
                        click: function(){
                            $("#cancel-application-result-dialog").empty();
                            $("#cancel-application-result-dialog").dialog('destroy');
                            enableAccountApplicationToolbarButton(true);
                        }
                    }
                ],
                close: function() {
                    $("#cancel-application-result-dialog").empty();
                    $("#cancel-application-result-dialog").dialog('destroy');
                    enableAccountApplicationToolbarButton(true);
                }
            });
            var ex = document.getElementById('unfinished-application-table');
            if($.fn.dataTable.fnIsDataTable(ex)){
                $(ex).dataTable().fnDestroy();
            }
            loadUnfinishedApplicationTable();
        },
        "error": function(jqxhr, textstatus, errorthrown) {
            $("#account-page").unmask();
            enableAccountApplicationToolbarButton(true);
            showCancelApplicationResultDialog('网络错误', 'icon-warning-sign', 
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    });
}

function generateNoticeMsg(msg) {
    return String.format('<div class="alert alert-info bigger-110" style="margin-bottom: 0px; margin-top: 5px;">{0}</div>', msg);
}

function reloadUnfinishedApplicationTable() {
    var ex = document.getElementById('unfinished-application-table');
    if($.fn.dataTable.fnIsDataTable(ex)){
        $(ex).dataTable().fnDestroy();
    }
    loadUnfinishedApplicationTable();
}

function reloadHistoryApplicationTable() {
    var ex = document.getElementById('history-application-table');
    if($.fn.dataTable.fnIsDataTable(ex)){
        $(ex).dataTable().fnDestroy();
    }
    loadHistoryApplicationTable();
}

function showCancelApplicationResultDialog(header, header_icon, msg, width) {
    $("#cancel-application-result-dialog").append(msg);
    title_html_str = String.format('<div class="dialog_title"><li class="{0}"></li> {1}</div>', header_icon, header);
    var edit_dialog = $("#cancel-application-result-dialog").removeClass('hide').dialog({
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
                    $("#cancel-application-result-dialog").empty();
                    $("#cancel-application-result-dialog").dialog('destroy')
                }
            }
        ],
        close: function() {
            $("#cancel-application-result-dialog").empty();
            $("#cancel-application-result-dialog").dialog('destroy')
        }
    });
}

function showCommonNoticeDialog(header, header_icon, msg, width) {
    $("#common-notice-dialog").append(msg);
    title_html_str = String.format('<div class="dialog_title"><li class="{0}"></li> {1}</div>', header_icon, header);
    var dialog = $("#common-notice-dialog").removeClass('hide').dialog({
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
                click: function() {
                    $("#common-notice-dialog").empty();
                    $("#common-notice-dialog").dialog('destroy');
                }
            }
        ],
        close: function() {
            $("#common-notice-dialog").empty();
            $("#common-notice-dialog").dialog('destroy');
        }
    });
    $(dialog).parent().find('a.ui-dialog-titlebar-close').remove();
}
