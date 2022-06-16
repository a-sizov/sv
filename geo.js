(function(){
    var COOKIE_VALUE = "GEO_CITY";
    var debug = true;

    var cities = [
        {
            key: "msk",
            short: "Москва ↓",
            long: "Москва"
        },
        {
            key: "spb",
            short: "Петербург ↓",
            long: "Санкт—Петербург"
        },
        {
            key: "nn",
            short: "Нижний ↓",
            long: "Нижний Новгород"
        },
        {
            key: "sch",
            short: "Сочи ↓",
            long: "Сочи"
        },
        {
            key: "glk",
            short: "Геленджик ↓",
            long: "Геленджик"
        },
        {
            key: "vl",
            short: "Владивосток ↓",
            long: "Владивосток"
        },
        {
            key: "mnk",
            short: "Минск ↓",
            long: "Минск"
        },
        {
            key: "yar",
            short: "Ярославль ↓",
            long: "Ярославль"
        },
    ];

    function getCookie(name) {
        var parts = ("; " + document.cookie).split("; " + name + "=");
        var value = parts.length === 2 ? parts.pop().split(";").shift() : undefined;
        return value ? decodeURIComponent(value) : "";
    }

    function setCookie(name, value) {
        var now = new Date()
        var expires = new Date(now.setMonth(now.getMonth() + 11)).toUTCString();
        document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; expires=' + expires + "; path=/; secure;";
    }

    function selectorToArray(x) {
        if(!x) return []
        else if(Array.isArray(x)) return x;
        else if (typeof x === 'string' || x instanceof String) return [x];
        else return [];
    }

    /**
     *
     * @param {{short: string, key: string, long: string}} city
     */
    function reloadGeo(city) {

        var label = city.short;
        var value = city.key;

        if($(".geo_city_label a").length > 0) $(".geo_city_label a").first().text(label);
        else $(".geo_city_label").text(label);

        $(".geo_city_label a, .geo_show_opacity").show().animate({opacity: 1}, 300)

        if(!window.GEO) return;
        var toShow = selectorToArray(window.GEO[value]);
        var toHide = [];
        Object.keys(window.GEO).forEach(function(key) {
            if(key !== value) toHide = toHide.concat(selectorToArray(window.GEO[key]));
        })

        $(toShow.join(", ")).show();
        $(toHide.join(", ")).not(toShow.join(", ")).hide();
    }

    function findCityByKey(currentCityKey) {
        var currentCity;
        cities.forEach(function (x) {
            if(x.key === currentCityKey) currentCity = x;
        });
        return currentCity;
    }

    /**
     *
     * @returns {{short: string, key: string, long: string}}
     */
    function getCurrentCity() {
        var currentCity;
        var cookieKey = getCookie(COOKIE_VALUE);
        var hashKey = (window.location.hash + "").replace("#", "");

        if(hashKey) currentCity = findCityByKey(hashKey);
        if(!currentCity && cookieKey) currentCity = findCityByKey(cookieKey);

        if(!currentCity) {
            var websiteCityName = $(".geo_city_label a").text();
            if(websiteCityName) {
                cities.forEach(function (x) {
                    if(x.short === websiteCityName) currentCity = x;
                });
            }
        }

        return currentCity || cities[0];
    }

    function init(){
        var currentCity = getCurrentCity();

        if(debug) console.log("Начальный город: "+currentCity.key+" "+currentCity.short+" "+currentCity.long);

        reloadGeo(currentCity);

        cities.forEach(function (x) {
           $("a[href=#"+x.key+"]").click(function() {
               setCookie(COOKIE_VALUE, x.key);
               if(debug) console.log("Клик по городу: "+x.key+" "+x.short+" "+x.long);
               reloadGeo(x);
           });
        });
    }

    $(document).ready(init)
})();