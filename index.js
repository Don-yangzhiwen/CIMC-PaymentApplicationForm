function remove_ie_header_and_footer() {
  var hkey_path;
  hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
  try {
    var RegWsh = new ActiveXObject("WScript.Shell");
    RegWsh.RegWrite(hkey_path + "header", "");
    RegWsh.RegWrite(hkey_path + "footer", "");
  } catch (e) {}
};
//打印
function printme() {
  if (!!window.ActiveXObject || "ActiveXObject" in window) { //是否ie
    remove_ie_header_and_footer();
  };
  var oldStr = document.body.innerHTML;
  document.body.innerHTML = document.getElementById('box').innerHTML;
  window.print();
  document.body.innerHTML = oldStr;
};
var url = 'http://10.33.178.32:8080/gflow/apply/object.do';
//表格1
$.get('./table-1.json', function (data) {
  $('.applyCode').text(data.applyCode != null ? data.applyCode : '');
  $('.createBy').text(data.createBy != null ? data.createBy : '');
  $('.currency').text(data.currency != null ? data.currency : '');
  $('.payer').text(data.payer != null ? data.payer : '');
  $('.projectName').text(data.projectName != null ? data.projectName : '');
  $('.agreementAmount').text(data.agreementAmount != null ? data.agreementAmount : '');
  $('.paymentAmount').text(data.paymentAmount != null ? data.paymentAmount : '');
  $('.plainDate').text(data.plainDate != null ? data.plainDate : '');
  $('.account').text(data.account != null ? data.account : '');
  $('.invoice').text(data.invoice == '00' ? '否' : '是');
  $('.paymentDate').text(data.paymentDate != null ? data.paymentDate : '');
  $('.applyType').text(data.applyType != null ? getApplyType(data.applyType) : '');
  $('.payType').text(data.payType != null ? getPayType(data.payType) : '');
  $('.payeeName').text(data.payeeName != null ? data.payeeName : '');
  $('.bank').text(data.bank != null ? data.bank : '');
  $('.invoiceAmount').text(data.invoiceAmount != null ? data.invoiceAmount : '');
  $('.description').text(data.description != null ? data.description : '');
});
//表格2
$.get('./table-2.json', function (data) {
  var data = data.data;
  var money = 0;
  var str = '';
  for (var i = 0; i < data.length; i++) {
    var ele = data[i];
    str += '<tr>';
    str += '<td>' + (i + 1) + '</td>';
    str += '<td>' + (ele.mbl != null ? ele.mbl : '') + '</td>';
    str += '<td>' + (ele.type != null ? getAmountType(ele.type) : '') + '</td>';
    str += '<td>' + (ele.amountDesc != null ? ele.amountDesc : '') + '</td>';
    str += '<td>' + (ele.amountNotes != null ? ele.amountNotes : '') + '</td>';
    str += '<td>' + (ele.currency != null ? ele.currency : '') + '</td>';
    str += '<td>' + (ele.payableAmount != null ? ele.payableAmount : '') + '</td>';
    str += '<td>' + (ele.paymentAmount != null ? ele.paymentAmount : '') + '</td>';
    str += '<td>' + (ele.invoiceNo != null ? ele.invoiceNo : '') + '</td>';
    str += '<td>' + (ele.submitInvoiceAmount != null ? ele.submitInvoiceAmount : '') + '</td>';
    str += '<td>' + (ele.invoiceAmount != null ? ele.invoiceAmount : '') + '</td>';
    str += '<td>' + (ele.projectName != null ? ele.projectName : '') + '</td>';
    str += '<td>' + (ele.custName != null ? ele.custName : '') + '</td>';
    str += '<td>' + (ele.supplierName != null ? ele.supplierName : '') + '</td>';
    str += ' </tr>';
    money += ele.paymentAmount;
  };
  $('.table-2 tbody').html(str);
  //将数字金额转化为人民币格式
  var arrMoney = (money + '').split('.');
  var strlen = arrMoney[0].length;
  var arrMoneys = [];
  //前面的位数
  var temp = strlen - Math.floor(strlen / 3) * 3;
  arrMoneys.push(arrMoney[0].substr(0, temp));
  //剩下的加,
  var newstr = arrMoney[0].substr(temp);
  var newarr = newstr.split('');
  for (var i = 0; i < Math.floor(strlen / 3); i++) {
    newarr[3 * i] = ',' + newarr[3 * i];
  }
  $('.realpayment').text(arrMoneys.concat(newarr).join('') + '.' + (arrMoney[1] ? arrMoney[1] : '00'));
  //将数字金额转化为中文大写
  $('.realpay-dx').text(chineseNumber(money));
});
//表格3
$.get('./table-3.json', function (data) {
  var data = data.data;
  var str = '';
  for (var i = 0; i < data.length; i++) {
    var ele = data[i];
    str += '<tr>';
    str += '<td>' + (ele.createBy != null ? ele.createBy : '') + '</td>';
    str += '<td>' + (ele.createDate != null ? ele.createDate : '') + '</td>';
    str += '<td>' + (ele.content != null ? ele.content : '') + '</td>';
    str += '<td>' + (ele.remark != null ? ele.remark : '') + '</td>';
    str += '</tr>';
  };
  // $('.table-3 tbody').html(str);
});

//审核流程
function getApplyType(value) {
  switch (value) {
    case "01":
      return "对公支付申请";
      break;
    case "02":
      return "预付款申请";
      break;
    case "03":
      return "预付款核销申请";
      break;
    default:
      return "其它";
      break;
  }
};

//费用类型
function getAmountType(value) {
  switch (value) {
    case "01":
      return "海运费";
      break;
    case "02":
      return "起运港拖车费";
      break;
    case "03":
      return "目的港拖车费";
      break;
    case "04":
      return "起运港清关费";
      break;
    case "05":
      return "目的港清关费";
      break;
    case "06":
      return "保险费";
      break;
    default:
      return "未知";
      break;
  }
};

//付款方式
function getPayType(value) {
  switch (value) {
    case "01":
      return "同城转帐/珠三角地区转帐";
      break;
    case "02":
      return "汇款";
      break;
    case "03":
      return "信用证";
      break;
    case "04":
      return "贷记凭证";
      break;
    case "05":
      return "现金";
      break;
    case "06":
      return "支票";
      break;
    case "07":
      return "跟单托收、光票托收";
      break;
    case "08":
      return "银行承兑汇票、商业承兑汇票";
      break;
    case "09":
      return "预付货款、工程款等";
      break;
    case "10":
      return "信用卡";
      break;
    case "11":
      return "见提单日期60天付款";
      break;
    case "12":
      return "信用证";
      break;
    case "13":
      return "即期信用证";
      break;
    case "14":
      return "远期信用证";
      break;
    case "15":
      return "转账";
      break;
    case "16":
      return "银行托收";
      break;
    case "17":
      return "银行汇票";
      break;
    case "18":
      return "汇款（对公）";
      break;
    case "19":
      return "汇款（员工）";
      break;
    default:
      return "其它";
      break;
  }
};