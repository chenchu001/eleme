//存
export function saveTolocal(key,value) {
    var seller = localStorage.__seller__
    if(!seller) {
        var seller = {};
    }else{
        seller = JSON.parse(seller);
        console.log(seller);
    }
    seller[key] = value;
    localStorage.__seller__ = JSON.stringify(seller);
}

//取
export function loadFromLocal(key,def){
    var seller = localStorage.__seller__;
    if(!seller){
        return def;
    }
    seller = JSON.parse(seller);
    if(!seller){
        return def;
    }
    var ret = seller[key];
    return ret || def;
}
