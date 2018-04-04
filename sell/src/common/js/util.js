export function urlParse(){
    var url = window.location.search;
    var obj = {};
    var reg = /[?&][^?&]+=[^?&]+/g;
    var arr = url.match(reg);
    if(arr) {
        arr.forEach(function(item) {
            var tempArr = item.substring(1).split('=');
            var key = decodeURIComponent(tempArr[0]);
            var value = decodeURIComponent(tempArr[1]);
            obj[key] = value;
        })
    }
    return obj;
}