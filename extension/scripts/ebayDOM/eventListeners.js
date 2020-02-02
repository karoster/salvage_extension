//event listener to install on each listing's button.
let buttonEventListener = parent => () => {
    chrome.storage.sync.get(['cart', 'total'], function(response) {
      //using title as key is space efficient, and almost always unique
      //runs into problems if two listings have exactly identical titles (unlikely for app purpose)
  
      let titleKey = parent.querySelector(".s-item__title").innerHTML
      if(parent.classList.contains("salvage-extension-selected")){
  
        let price = response['cart'][titleKey][0];
        delete response['cart'][titleKey]
  
        chrome.storage.sync.set({cart: response['cart'],
          total: response['total'] - parseFloat(price.replace(/,/g, ""))},
          function() {
            parent.classList.remove("salvage-extension-selected");
        });
  
      } else {
        let priceArr = getPrices(parent);
        response['cart'][titleKey] = priceArr;
  
        chrome.storage.sync.set({cart: response['cart'],
          total: response['total'] + parseFloat(priceArr[0].replace(/,/g, ""))},
          function() {
            parent.classList.add("salvage-extension-selected");
        });
      }
    });
}