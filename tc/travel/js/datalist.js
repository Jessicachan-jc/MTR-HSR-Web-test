var LOAD_STATUS = false;
var DATA_PATH   = './data/';
let topmenu, footmenu, banners, aside, language, agency ;

var date  = new Date(),
    month = date.getMonth() + 1,
    day   = date.getDate(),
    now   = date.getFullYear() + (month < 10 ? '0' : '') + month + (day < 10 ? '0' : '') + day;


$.getJSON(DATA_PATH+'menu.json?_='+now).then(function(data){topmenu = data}.bind(this));
$.getJSON(DATA_PATH+'menu-footer.json?_='+now).then(function(data){footmenu = data}.bind(this));
$.getJSON(DATA_PATH+'banners.json?_='+now).then(function(data){banners = data}.bind(this));
$.getJSON(DATA_PATH+'aside.json?_='+now).then(function(data){aside = data}.bind(this));
$.getJSON(DATA_PATH+'agency-list.json?_='+now).then(function(data){agency = data}.bind(this));