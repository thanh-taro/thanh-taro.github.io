var list = [];
var parents = [];

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], {
    type: mimeString
  });
  return blob;
}

(function (root) {
  var default_numbers = " hai ba bốn năm sáu bảy tám chín";
  var currency = "đồng";
  var units = ("1 một" + default_numbers).split(" ");
  var ch = "lẻ mười" + default_numbers;
  var tr = "không một" + default_numbers;
  var tram = tr.split(" ");
  var u = "2 nghìn triệu tỉ".split(" ");
  var chuc = ch.split(" ");

  function tenth(a) {
    var sl1 = units[a[1]];
    var sl2 = chuc[a[0]];
    var append = "";
    if (a[0] > 0 && a[1] == 5) sl1 = "lăm";
    if (a[0] > 1) {
      append = " mươi";
      if (a[1] == 1) sl1 = " mốt"
    }
    var str = sl2 + "" + append + " " + sl1;
    return str
  }

  function block_of_three(d) {
    _a = d + "";
    if (d == "000") return "";
    switch (_a.length) {
      case 0:
        return "";
      case 1:
        return units[_a];
      case 2:
        return tenth(_a);
      case 3:
        sl12 = "";
        if (_a.slice(1, 3) != "00") sl12 = tenth(_a.slice(1, 3));
        sl3 = tram[_a[0]] + " trăm";
        return sl3 + " " + sl12
    }
  }

  function formatnumber(nStr) {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2")
    }
    return x1 + x2
  }
  root.to_vietnamese = function (str) {
    var str = parseInt(str) + "";
    var i = 0,
      j = 3;
    var arr = [];
    var index = str.length;
    if (index == 0 || str == "NaN") return "";
    var string = "";
    while (index >= 0) {
      arr.push(str.substring(index, Math.max(index - 3, 0)));
      index -= 3
    }
    for (i = arr.length - 1; i >= 0; i--) {
      if (arr[i] != "" && arr[i] != "000") string += " " + block_of_three(arr[i]) + " " + u[i]
    }
    return string.replace(/[0-9]/g, "").replace(/  /g, " ") + " " + currency
  }
})(window);

function render(list) {
  $('table#datatable tbody#list').html(null);
  var parents = {};
  var index = 0;
  for (var item, mv, m, price, i = 0; i < list.length; i++) {
    item = list[i];
    if (item.parentName && item.parentName.length > 0) {
      if (!parents[item.parentName]) {
        parents[item.parentName] = [];
      }
      parents[item.parentName].push(item);
      continue;
    }
    index ++;
    kt = '';
    price = 0;
    if (item.width > 0 && item.height > 0 && item.tall > 0) {
      mk = item.width * item.height * item.tall * item.count;
      kt = mk.toFixed(2) + ' m³';
      price = parseFloat(mk.toFixed(2)) * item.unitPrice;
    } else if (item.width > 0 && item.height > 0) {
      mv = item.width * item.height * item.count;
      kt = mv.toFixed(2) + ' m²';
      price = parseFloat(mv.toFixed(2)) * item.unitPrice;
    } else if (item.width > 0 && item.tall) {
      mv = item.width * item.tall * item.count;
      kt = mv.toFixed(2) + ' m²';
      price = parseFloat(mv.toFixed(2)) * item.unitPrice;
    } else if (item.height > 0 && item.tall) {
      mv = item.height * item.tall * item.count;
      kt = mv.toFixed(2) + ' m²';
      price = parseFloat(mv.toFixed(2)) * item.unitPrice;
    } else if (item.meter > 0) {
      m = item.meter * item.count;
      kt = m.toFixed(2) + ' m';
      price = parseFloat(m.toFixed(2)) * item.unitPrice;
    } else {
      price = item.count * item.unitPrice;
    }
    price = Math.floor(price);
    var newRow = '<tr>' +
      '<th scope="row" class="text-right nowrap"><button type="button" class="remove-it btn btn-danger btn-sm no-print" data-item-id="' + item.id + '">xóa</button>' + index + '</th>' +
      '<td>' + item.name + '</td>' +
      '<td class="nowrap text-right">' + (item.width > 0 ? (item.width.toFixed(2) + ' m') : '') + '</td>' +
      '<td class="nowrap text-right">' + (item.tall > 0 ? (item.tall.toFixed(2) + ' m') : '') + '</td>' +
      '<td class="nowrap text-right">' + (item.height > 0 ? (item.height.toFixed(2) + ' m') : '') + '</td>' +
      '<td class="nowrap text-right">' + (item.meter > 0 ? (item.meter.toFixed(2) + ' m') : '') + '</td>' +
      '<td class="text-right">' + item.count + '</td>' +
      '<td class="nowrap text-right">' + kt + '</td>' +
      '<td class="currency nowrap" data-value="' + item.unitPrice + '">' + item.unitPrice + '</td>' +
      '<td class="total currency nowrap" data-value="' + price + '">' + price + '</td>' +
      '</tr>';
    $('table#datatable tbody#list').append(newRow);
  }
  for (var parentName in parents) {
    var count = parents[parentName].length;
    index ++;
    var newRow = '<tr class="parent">' +
    '<th scope="row" class="text-right nowrap">' + index + '</th>' +
    '<td><b><i>' + parentName + '</i></b></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '<td></td>' +
    '</tr>';
    $('table#datatable tbody#list').append(newRow);
    for (i = 0; i < count; i++) {
      item = parents[parentName][i];
      kt = '';
      price = 0;
      if (item.width > 0 && item.height > 0 && item.tall > 0) {
        mk = item.width * item.height * item.tall * item.count;
        kt = mk.toFixed(2) + ' m³';
        price = mk * item.unitPrice;
      } else if (item.width > 0 && item.height > 0) {
        mv = item.width * item.height * item.count;
        kt = mv.toFixed(2) + ' m²';
        price = mv * item.unitPrice;
      } else if (item.width > 0 && item.tall) {
        mv = item.width * item.tall * item.count;
        kt = mv.toFixed(2) + ' m²';
        price = mv * item.unitPrice;
      } else if (item.height > 0 && item.tall) {
        mv = item.height * item.tall * item.count;
        kt = mv.toFixed(2) + ' m²';
        price = mv * item.unitPrice;
      } else if (item.meter > 0) {
        m = item.meter * item.count;
        kt = m.toFixed(2) + ' m';
        price = m * item.unitPrice;
      } else {
        price = item.count * item.unitPrice;
      }
      newRow = '<tr class="child">' +
        '<td class="text-right nowrap"><button type="button" class="remove-it btn btn-danger btn-sm no-print" data-item-id="' + item.id + '">xóa</button></td>' +
        '<td> - ' + item.name + '</td>' +
        '<td class="nowrap text-right">' + (item.width > 0 ? (item.width.toFixed(2) + ' m') : '') + '</td>' +
        '<td class="nowrap text-right">' + (item.tall > 0 ? (item.tall.toFixed(2) + ' m') : '') + '</td>' +
        '<td class="nowrap text-right">' + (item.height > 0 ? (item.height.toFixed(2) + ' m') : '') + '</td>' +
        '<td class="nowrap text-right">' + (item.meter > 0 ? (item.meter.toFixed(2) + ' m') : '') + '</td>' +
        '<td class="text-right">' + item.count + '</td>' +
        '<td class="nowrap text-right">' + kt + '</td>' +
        '<td class="currency nowrap" data-value="' + item.unitPrice + '">' + item.unitPrice + '</td>' +
        '<td class="total currency nowrap" data-value="' + price + '">' + price + '</td>' +
        '</tr>';
      $('table#datatable tbody#list').append(newRow);
    }
  }
  $('.currency').each(function () {
    $(this).text(accounting.formatMoney($(this).data('value'), {
      symbol: "₫",
      format: "%v %s",
      precision: 0
    }));
  });
  countTotal();
}

function countTotal() {
  var total = 0;
  $('.total').each(function () {
    total += parseInt($(this).data('value'));
  });
  $('.main-total').text(accounting.formatMoney(total, {
    symbol: "₫",
    format: "%v %s",
    precision: 0,
    thousand: ".",
    decimal : ","
  }));
  $('.main-total-text').text(to_vietnamese(total).trim().capitalize() + '.');
  return total;
}

(function () {
  $(document).on('click', '.remove-it', function () {
    var id = $(this).data('item-id');
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        list.splice(i, 1);
        break;
      }
    }
    render(list);
  });

  $('.pdf-it').click(function () {
    $('.no-print, .no-print > *').hide();
    $('textarea').css('border-width', 0);
    $('.datepicker').css('border-width', 0);
    $('.datepicker').css('background-color', 'transparent');
    $('*').css('font-family', "'Times New Roman', Times, serif");
    var filename = 'phieu-giao-hang ' + moment().format('HH-mm DD-MM-YY') + '.pdf';
    html2pdf(document.body, {
      margin: 0.5,
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        dpi: 300,
        letterRendering: true
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      }
    });
    $('.no-print, .no-print > *').show();
    $('textarea').css('border-width', 1);
    $('.datepicker').css('border-width', 1);
    $('.datepicker').css('background-color', '');
    $('*').css('font-family', '');
  });

  $('.save-it').click(function () {
    $('.no-print, .no-print > *').hide();
    $('textarea').css('border-width', 0);
    $('.datepicker').css('border-width', 0);
    $('.datepicker').css('background-color', 'transparent');
    $('*').css('font-family', "'Times New Roman', Times, serif");
    html2canvas(document.body, {
      dpi: 300,
      letterRendering: true,
      onrendered: function (canvas) {
        $('.no-print, .no-print > *').show();
        $('textarea').css('border-width', 1);
        $('.datepicker').css('border-width', 1);
        $('.datepicker').css('background-color', '');
        $('*').css('font-family', '');
        imageBase64 = canvas.toDataURL('image/jpeg', 1.0);
        var filename = 'phieu-giao-hang ' + moment().format('HH-mm DD-MM-YY') + '.jpg';
        download(dataURItoBlob(imageBase64), filename, 'image/jpeg');
      }
    });
  });

  $('.print-it').click(function () {
    window.print();
  });

  $('.add-it').click(function () {
    var name = $('input#productName').val();
    var parentName = $('select#productParent').val();
    var tall = $('input#sizeTall').val();
    var width = $('input#sizeWidth').val();
    var height = $('input#sizeHeight').val();
    var meter = $('input#sizeMeter').val();
    var count = $('input#productNumber').val();
    var unitPrice = $('input#unitPrice').autoNumeric('get');

    list.push({
      id: shortid.gen(),
      parentName: parentName,
      name: name,
      tall: parseFloat(tall),
      width: parseFloat(width),
      height: parseFloat(height),
      meter: parseFloat(meter),
      count: parseInt(count),
      unitPrice: parseFloat(unitPrice)
    });
    $('#newModal input').val(null);
    $('#newModal input#productNumber').val(1);
    $('#newModal').modal('hide');
    render(list);
  });

  $('.add-parent-it').click(function () {
    var name = $('input#productParentName').val();
    parents.push(name.trim());
    $('#newParentModal input').val(null);
    $('#newParentModal').modal('hide');
  });

  $('.datepicker').datepicker({
    format: 'DD, ngày dd/mm/yyyy',
    language: 'vi',
    todayBtn: true,
    todayHighlight: true,
    autoclose: true
  });

  render(list);

  $('#unitPrice').autoNumeric('init', {
    aSep: '.',
    aDec: ',',
    aSign: ' đ',
    pSign: 's',
    aPad: false
  });

  $('#newModal').on('show.bs.modal', function (e) {
    $('#productParent').html(null);
    $('#productParent').append('<option value=""></option>');
    for (var i = 0; i < parents.length; i++) {
      $('#productParent').append('<option value="' + parents[i] + '">' + parents[i] + '</option>');
    }
  });
  $('#newModal').on('shown.bs.modal', function (e) {
    $('#productName').focus();
  });
  $('#newParentModal').on('shown.bs.modal', function (e) {
    $('#productParentName').focus();
  });
})();