function extend(src, dst) {
    for (var key in src) {
        dst[key] = src[key];
    }
}

// step 1
function combineOptions(src, dst) {
    for (var optionKey in src.options) {
        if (dst.options[optionKey]) {
            extend(src.options[optionKey], dst.options[optionKey]);
        }
    }

    return dst;
}
//cars variable from the json file, prices variable from the 2nd json file. 
cars = combineOptions(prices, cars);

// step 2
function collectDisplayableOptions(obj) {
    var options = obj.options;
    var result = [];

    for (var optionKey in options) {
        var option = options[optionKey];
        if (option.price > 0 || (option.is_default === true && option.no_ui === undefined)) {
            result.push({
                key: optionKey,
                option: option,
                price: option.price,
                currency_code: obj.currency_code
            });
        }
    }
    //returns an array for sorting. 
    return result;
}

//an array. 
var displayableOptions = collectDisplayableOptions(cars);


// step 3
displayableOptions.sort(function(a, b) {
    return b.price - a.price;
});

// an alternate way to sort an object by keys:   reference: http://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
//   var orderedKeysHash = {};
//   //sort the keys, iterate over the sorted keys and set keys to sorted keys with respective value from original hash.
//   Object.keys(hash).sort().forEach(function (key) {
//     orderedKeysHash[key] = hash[key];
//   });

//   return orderedKeysHash;
// }

// console.log("OPTIONS REVESRE SORTED BY PRICE", displayableOptions);
// console.log('---');

//put the displayable options on the original cars object. 
cars.displayableOptions = displayableOptions;

// console.log('CARS', cars);

function outputOptions(optionsList) {
    var ul = document.getElementById("configurator");
    // console.log(ul);
    var currency = cars.currency_code;
    var sum = 0;
    for (var i = 0; i < optionsList.length; i++) {
        var option = optionsList[i].option;
        var key = optionsList[i].key;
        var name = option.name;
        var price = option.price;
        var formattedPrice = (price > 0) ? currency + price : '-';
        sum += Number(price);
        // console.log(sum);
        var li = document.createElement('li');
        li.innerHTML = '<span class="itemName">' + name + '</span>' + '<span class="itemPrice">' + formattedPrice + '</span>';
        ul.appendChild(li);



    }
    var base = prices.base_price;
    var inspect = cars.inspect_prep_price;
    var deliver = cars.personal_delivery_price;

    sum = sum + base + inspect + deliver;

    var basePrice = document.createElement('li');
    ul.appendChild(basePrice);
    basePrice.innerHTML = 'Base Price: ' + '<span class="itemPrice">' + currency + base + '</span>';

    var prepPrice = document.createElement('li');
    ul.appendChild(prepPrice);
    prepPrice.innerHTML = 'Preparation: ' + '<span class="itemPrice">' + currency + inspect + '</span>';

    var deliveryPrice = document.createElement('li');
    ul.appendChild(deliveryPrice);
    deliveryPrice.innerHTML = 'Delivery: ' + '<span class="itemPrice">' + currency + deliver + '</span>';

    var total = document.createElement('li');
    ul.appendChild(total);
    total.innerHTML = '<b>Total: </b>' + '<span class="itemPrice">' + currency + sum + '</span>';



}

var span = document.getElementById("showPrices");
var hidePrices = function() {
    var prices = document.getElementsByClassName('itemPrice');
    // console.log(prices);
    for (var i = 0; i < prices.length; i++) {
        prices[i].classList.toggle('hide');
    }

};
span.addEventListener('click', hidePrices);

//call the function with the displayableOptions array as an input.  
outputOptions(cars.displayableOptions);