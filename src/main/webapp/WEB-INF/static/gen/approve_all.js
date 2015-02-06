
ACCOUT_DETAIL_UL = '<ul class="list-unstyled spaced0">';

jQuery.fn.dataTableExt.oApi.fnSetFilteringPressEnter = function (oSettings) {
    /*
    * Type:        Plugin for DataTables (www.datatables.net) JQuery plugin.
    * Name:        dataTableExt.oApi.fnSetFilteringPressEnter
    * Version:     2.2.1
    * Description: Enables filtration to be triggered by pressing the enter key instead of keyup or delay.
    * Inputs:      object:oSettings - dataTables settings object
    *             
    * Returns:     JQuery
    * Usage:       $('#example').dataTable().fnSetFilteringPressEnter();
    * Requires:   DataTables 1.6.0+
    *
    * Author:      Jon Ranes (www.mvccms.com)
    * Created:     4/17/2011
    * Language:    Javascript
    * License:     GPL v2 or BSD 3 point style
    * Contact:     jranes /AT\ mvccms.com
    */
    var _that = this;
 
    this.each(function (i) {
        $.fn.dataTableExt.iApiIndex = i;
        var $this = this;
        var anControl = $('input', _that.fnSettings().aanFeatures.f);
        anControl.unbind('keyup').bind('keypress', function (e) {
            if (e.which == 13) {
                $.fn.dataTableExt.iApiIndex = i;
                _that.fnFilter(anControl.val());
            }
        });
        return this;
    });
    return this;
};

String.format = function(src) {  
    if (arguments.length == 0) return null;  
    var args = Array.prototype.slice.call(arguments, 1);  
    return src.replace(/\{(\d+)\}/g, function(m, i){  
        return args[i];  
    }); 
}; 

jQuery(function($) {
    // 进入页面后，默认显示待审批的申请
    reloadCurrentApproveTable('host');
    // 切换Tab时，进行刷新
    $('#current-approve-tab').on("click", function() {
        reloadCurrentApproveTable();
        showCurrentApproveDetailsList();
    });
    $('#history-approve-tab').on("click", function() {
        reloadHistoryApproveTable();
        showHistoryApproveDetailsList();
    });
});

function addHelpLinkToTab() {
    var ori = $('#approve-tab').html();
    if(ori.indexOf("<a href=") > 0) {
        return;
    }
    ori += '<div style="float: right; color: green; padding-right: 20px"><i class="icon-question"></i>&nbsp;<a href="http://wiki.corp.qunar.com/pages/viewpage.action?pageId=52069490" target="_blank">help</a></div>';
    $('#approve-tab').html(ori);
}

function loadCurrentApproveTable() {
    $("#approve-page").mask("加载中...");
    var oTable = $('#current-approve-table').dataTable({
        bFilter: false,
        iDisplayLength: -1,
        bLengthChange: false,
        bAutoWidth: false,
        bProcessing: true,
        bServerSide: false,
        bInfo: true,
        bSort: true,
        aoColumns: [
            {"sTitle": '<input id="current-approve-table-select-all" ' +
                'type="checkbox" value="ALL">',
            "sWidth": "30px", "bSortable": false},
            {"sTitle": '<li class="icon-key"></li> ID', "sWidth": "75px"},
            {"sTitle": '<li class="icon-desktop"></li> 主机名'},
            {"sTitle": '<li class="icon-user"></li> 申请人', "sWidth": "150px"},
            {"sTitle": '<li class="icon-group"></li> 隶属组', "sWidth": "150px"}
        ],
        aaSorting: [[ 1, "desc" ]],
        aoColumnDefs: [
            {
                mRender: function (data, type, full) {
                    return '<input type="checkbox" value="'+ full[1] +'">';
                },
                aTargets: [ 0 ]
            },
        ],
        sAjaxSource: "approver/current_approve",
        fnServerData : function(sSource, aDataSet, fnCallback) {
            createCurrentApproveToolbar();
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
                        showCommonNoticeDialog('获取审批列表失败', 'icon-warning-sign',
                            generateNoticeMsg(resp.msg), 300);
                    }
                    $("#approve-page").unmask();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#approve-page").unmask();
                    showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                        generateNoticeMsg('网络错误，请刷新后重试!'), 300);
                }
            })
        },
        fnInitComplete: function() {
            $('#current-approve-table-select-all').prop('checked', false);
            $('#current-approve-table-select-all').attr('checked', false);
            var div = document.createElement("div");
            div.id="current-approve-table-height-limter";
            $("#current-approve-table").wrap(div);
            $.setObjectFull($("#current-approve-table-height-limter"), 200, 9, 0);
            toggleCheck(oTable);
        },
        fnDrawCallback: function() {
            $("#current-approve-table tbody tr").unbind("click");
            $("#current-approve-table tbody tr").on("click", function(e) {
                try {
                    var sTitle;
                    var nTds = $('td', this);
                    var id = $(nTds[1]).text();
                    showCurrentApproveDetailsList(id);
                } catch (e) {
                }
            }).on("dblclick", function(e){ e.preventDefault(); });
            $("#approve-pass").unbind("click");
            $("#approve-pass").on("click", function(e) {
                approvePass(oTable);
            }).on("dblclick", function(e){ e.preventDefault(); });
            $("#approve-reject").unbind("click");
            $("#approve-reject").on("click", function(e) {
                approveReject(oTable);
            }).on("dblclick", function(e){ e.preventDefault(); });
        }
    });
    addHelpLinkToTab();
}

function reloadCurrentApproveTable() {
    var ex = document.getElementById('current-approve-table');
    if($.fn.dataTable.fnIsDataTable(ex)){
        $(ex).dataTable().fnDestroy();
    }
    loadCurrentApproveTable();
}

function reloadHistoryApproveTable() {
    var ex = document.getElementById('history-approve-table');
    if($.fn.dataTable.fnIsDataTable(ex)){
        $(ex).dataTable().fnDestroy();
    }
    loadHistoryApproveTable();
}

function loadHistoryApproveTable() {
    $("#approve-page").mask("加载中...");
    var oTable = $('#history-approve-table').dataTable({
        bFilter: true,
        aLengthMenu: [[50, 100, 300, 500, -1], [50, 100, 300, 500, "所有"]],
        iDisplayStart: 0,
        iDisplayLength: 50,
        bPaginate: true,
        bAutoWidth: false,
        bProcessing: true,
        bServerSide: true,
        bInfo: true,
        bSort: false,
        aoColumns: [
            {"sTitle": '<li class="icon-key"></li> ID', "sWidth": "75px"},
            {"sTitle": '<li class="icon-desktop"></li> 主机名'},
            {"sTitle": '<li class="icon-user"></li> 申请人', "sWidth": "150px"},
            {"sTitle": '<li class="icon-group"></li> 隶属组', "sWidth": "150px"},
            {"sTitle": '<li class="icon-legal"></li> 审批结果', "sWidth": "200px"}
        ],
        //aaSorting: [[ 1, "desc" ]],
        sAjaxSource: "approver/approve/history",
        fnServerData : function(sSource, aoData, fnCallback, oSettings) {
            $.ajax({
                dataType: 'json',
                url: sSource,
                type: "POST",
                data: aoData,
                success: function(resp) {
                    if (resp.success) {
                        var data = resp.data.length != 0 ? resp.data : {aaData: []};
                        fnCallback(data);
                    } else {
                        fnCallback({aaData: []});
                        showCommonNoticeDialog('获取审批历史失败', 'icon-warning-sign',
                            generateNoticeMsg(resp.msg), 300);
                    }
                    $("#approve-page").unmask();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#approve-page").unmask();
                    showCommonNoticeDialog('网络错误', 'icon-warning-sign',
                        generateNoticeMsg('网络错误，请刷新后重试!'), 300);
                }
            })
        },
        fnInitComplete: function() {
            var div = document.createElement("div");
            div.id="history-approve-table-height-limter";
            $("#history-approve-table").wrap(div);
            $.setObjectFull($("#history-approve-table-height-limter"), 200, 9, 0);
            oTable.fnSetFilteringPressEnter();
        },
        fnRowCallback: function(nRow, aData, iDisplayIndex) {
            try {
                state = aData[5];
                if (state == "同意") {
                    $('td:eq(5)', nRow).html('<span class="label label-success arrowed-in-right arrowed">' + state + '</span>');
                } else if (state == "拒绝") {
                    $('td:eq(5)', nRow).html('<span class="label label-inverse arrowed-in-right arrowed">' + state + '</span>');
                } else {
                    $('td:eq(5)', nRow).html('<span class="label label-info arrowed-in-right arrowed">' + state + '</span>');
                }
            } catch (e) {
            }
        },
        fnDrawCallback: function() {
            $('#history-approve-table').contextmenu({
                target:'#context-menu',
                onItem: function(e, item) {
                    if ($(item).text() == '已手工修复') {
                        try {
                            var id = oTable.$('tr.row_selected')[0]['childNodes'][0]['innerText'];
                            approveFix(id);
                            reloadHistoryApproveTable();
                        } catch (e) {
                        }
                    }
                }
            });
            $("#history-approve-table tbody tr").unbind("click");
            $("#history-approve-table tbody tr").on("click", function(e) {
                try {
                    var sTitle;
                    var nTds = $('td', this);
                    var id = $(nTds[0]).text();
                    if ($(this).hasClass('row_selected')) {
                        $(this).removeClass('row_selected');
                    } else {
                        oTable.$('tr.row_selected').removeClass('row_selected');
                        $(this).addClass('row_selected');
                    }
                    showHistoryApproveDetailsList(id);
                } catch (e) {
                }
            }).on("dblclick", function(e){ e.preventDefault(); });
        }
    });
    addHelpLinkToTab();
}

function generateNoticeMsg(msg) {
    return String.format('<div class="alert alert-info bigger-110" style="margin-bottom: 0px; margin-top: 5px;">{0}</div>', msg);
}

function __generateLIHeader(header, icon) {
    return String.format('<li class="{0}" style="color: #307ecc; padding-bottom: 10px;"> {1}</li>', icon, header);
}

function __generateLIData(data) {
    return String.format('<li>{0}</li>', data);
}

function __generateDetailHtml(header, header_icon, data_list, with_hr) {
    var html = ACCOUT_DETAIL_UL;
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

function showCurrentApproveDetailsList(id) {
    if (id == undefined || id == '') {
        $("#current-approve-details-list").html('');
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
                        html += __generateDetailHtml('申请理由', 'icon-comment-alt', details['msg']);
                        html += __generateDetailHtml('当前审批状态', 'icon-eye-open', details['current_state']);
                        html += __generateDetailHtml('审批人列表', 'icon-group', details['approver_list']);
                        html += __generateDetailHtml('审批历史', 'icon-book', details['approve_hisroty']);
                        html += __generateDetailHtml('申请时间', 'icon-calendar', details['approve_time'], false);
                        $("#current-approve-details-list").html(html);
                    } catch (e) {
                    }
                } else {
                    $("#current-approve-details-list").html('无详细信息');
                }
            } else {
                $("#current-approve-details-list").html(resp.msg);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showCommonNoticeDialog('网络错误', 'icon-warning-sign', 
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    })
}

function showHistoryApproveDetailsList(id) {
    if (id == undefined || id == '') {
        $("#history-approve-details-list").html('');
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
                        $("#history-approve-details-list").html(html);
                    } catch (e) {
                    }
                } else {
                    $("#history-approve-details-list").html('无详细信息');
                }
            } else {
                $("#history-approve-details-list").html(resp.msg);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showCommonNoticeDialog('网络错误', 'icon-warning-sign', 
                generateNoticeMsg('网络错误，请刷新后重试!'), 300);
        }
    })
}

function toggleCheck(oTable) {
    $('input', oTable.fnGetNodes()).unbind("click");
    $('input', oTable.fnGetNodes()).on("click", function() {
        $(this).prop('checked', this.checked);
        $(this).attr('checked', this.checked);
    });
    $('#current-approve-table-select-all').unbind("click");
    $('#current-approve-table-select-all').on("click", function() {
        $('input', oTable.fnGetNodes()).prop('checked', this.checked);
        $('input', oTable.fnGetNodes()).attr('checked', this.checked);
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

function createCurrentApproveToolbar() {
    var toolbar = '';
    toolbar += '<div style="float: right;">';
    toolbar += '<button id="approve-pass" class="btn btn-xs btn-primary">同意</button>';
    toolbar += '<button id="approve-reject" class="btn btn-xs btn-info">拒绝</button>';
    toolbar += '</div>';
    $("#current-approve-table_wrapper > div:nth-child(1) > div:nth-child(2)").html(toolbar);
}

function approvePass(oTable) {
    var url = "approver/approve/pass";
    var action = '同意';
    approveProxy(oTable, action, url);
}

function approveReject(oTable) {
    var url = "approver/approve/reject";
    var action = '拒绝';
    approveProxy(oTable, action, url);
}

function approveFix(id) {
    var url = "approver/approve/fix";
    var action = '手工修复';
    try {
        $("#approve-page").mask("加载中...");
        var params = {
            "uid": id
        };
        if (id == undefined) {
            $("#approve-page").unmask();
            showApproveResultDialog('审批', 'icon-lightbulb', 
                generateNoticeMsg('请选择要审批的条目!'), 300);
            return;
        }
        $.ajax({
            datatype: 'json',
            url: url,
            type: "post",
            data: params,
            success: function(resp) {
                var title_html_str = '';
                try {
                    if (resp.success) {
                        title_html_str = String.format('<div class="dialog_title"><li class="icon-info-sign"></li> {0}申请</div>', action);
                        $("#approve-result-dialog").append('手工修复成功');
                    } else {
                        title_html_str = String.format('<div class="dialog_title"><li class="icon-exclamation-sign"></li> {0}申请</div>', action);
                        $("#approve-result-dialog").append(generateNoticeMsg(resp.msg));
                    }
                } catch (e) {
                }
                $("#approve-page").unmask();
                var dialog = $("#approve-result-dialog").removeClass('hide').dialog({
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
                                $("#approve-result-dialog").empty();
                                $("#approve-result-dialog").dialog('destroy')
                            }
                        }
                    ],
                    close: function() {
                        $("#approve-result-dialog").empty();
                        $("#approve-application-result-dialog").dialog('destroy');
                    }
                });
                reloadCurrentApproveTable();
            },
            "error": function(jqxhr, textstatus, errorthrown) {
                $("#approve-page").unmask();
                showApproveResultDialog('网络错误', 'icon-warning-sign', 
                    generateNoticeMsg('网络错误，请刷新后重试!'), 300);
            }
        });
    } catch(e) {
        $("#approve-page").unmask();
    }
}

function enableCurrentApproveToolbarButton(enable) {
    if (enable) {
        $("#approve-pass").removeAttr('disabled');
        $("#approve-reject").removeAttr('disabled');
    } else {
        $("#approve-pass").attr('disabled', 'true');
        $("#approve-reject").attr('disabled', 'true');
    }
}

function approveProxy(oTable, action, url) {
    try {
        $("#approve-page").mask("加载中...");
        enableCurrentApproveToolbarButton(false);
        var ids = [];
        $("input:checked", oTable.fnGetNodes()).each(function() {
            ids.push($(this).val());
        });
        var params = {
            "bpm_ids": ids.join(',')
        };
        if (ids.length < 1) {
            $("#approve-page").unmask();
            enableCurrentApproveToolbarButton(true);
            showApproveResultDialog('审批', 'icon-lightbulb', 
                generateNoticeMsg('请选择要审批的条目!'), 300);
            return;
        }
        $.ajax({
            datatype: 'json',
            url: url,
            type: "post",
            data: params,
            success: function(resp) {
                var title_html_str = '';
                try {
                    if (resp.success) {
                        title_html_str = String.format('<div class="dialog_title"><li class="icon-info-sign"></li> {0}申请</div>', action);
                        var succeed_list = resp.data.succeed;
                        var failed_list = resp.data.failed;
                        if (failed_list.length != 0) {
                            var failed_list_html = '<b style="color: red;"><li class="icon-ban-circle"></li> 失败:</b><br/>';
                            for(var i = 0; i < failed_list.length; i++) { 
                                failed_list_html += '&nbsp;&nbsp;&nbsp;&nbsp;' + failed_list[i] + '<br/>';
                            } 
                            $("#approve-result-dialog").append(generateNoticeMsg(failed_list_html));
                        } else {
                            var succeed_html = '<b><li class="icon-check"></li> 成功</b><br/>';
                            $("#approve-result-dialog").append(generateNoticeMsg(succeed_html));
                        }
                    } else {
                        title_html_str = String.format('<div class="dialog_title"><li class="icon-exclamation-sign"></li> {0}申请</div>', action);
                        $("#approve-result-dialog").append(generateNoticeMsg(resp.msg));
                    }
                } catch (e) {
                }
                $("#approve-page").unmask();
                var dialog = $("#approve-result-dialog").removeClass('hide').dialog({
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
                                enableCurrentApproveToolbarButton(true);
                                $("#approve-result-dialog").empty();
                                $("#approve-result-dialog").dialog('destroy')
                            }
                        }
                    ],
                    close: function() {
                        enableCurrentApproveToolbarButton(true);
                        $("#approve-result-dialog").empty();
                        $("#approve-application-result-dialog").dialog('destroy');
                    }
                });
                reloadCurrentApproveTable();
            },
            "error": function(jqxhr, textstatus, errorthrown) {
                $("#approve-page").unmask();
                enableCurrentApproveToolbarButton(true);
                showApproveResultDialog('网络错误', 'icon-warning-sign', 
                    generateNoticeMsg('网络错误，请刷新后重试!'), 300);
            }
        });
    } catch(e) {
        $("#approve-page").unmask();
    }
}

function enableCurrentApproveToolbarButton(enable) {
    if (enable) {
        $("#approve-pass").removeAttr('disabled');
        $("#approve-reject").removeAttr('disabled');
    } else {
        $("#approve-pass").attr('disabled', 'true');
        $("#approve-reject").attr('disabled', 'true');
    }
}


