//install the right sidebar for the extension, and give it 0 width
let iframe = document.createElement('iframe');
iframe.className = "salvage-extension-iframe salvage-extension-iframe-off";
iframe.id = "salvage-iframe";
iframe.src = chrome.extension.getURL("./../sidebar.html");
document.body.appendChild(iframe);

window.onscroll = function() {(stickySidebar())};

let sticky = iframe.offsetTop;

//in case of refreshed page and not loading at top of page
stickySidebar();

// update iframe distance from top on scroll
function stickySidebar() {
  if (window.pageYOffset >= sticky) {
    iframe.style.top = "0px";
  } else {
    iframe.style.top = (sticky - window.pageYOffset).toString() + "px";
  }
}


//switches width of iframe from 0px to XXXpx and vice-versa
function toggleIframe(){
  if(iframe.className == "salvage-extension-iframe salvage-extension-iframe-off"){
      iframe.classList.remove("salvage-extension-iframe-off");
      iframe.classList.add("salvage-extension-iframe-on");
  }
  else{
      iframe.classList.remove("salvage-extension-iframe-on");
      iframe.classList.add("salvage-extension-iframe-off");
  }
}



//event listener to install on each listing's button.
let buttonEventListener = parent => () => {
  chrome.storage.sync.get(['cart', 'total'], function(response) {
    //using title as key is space efficient, and almost always unique
    //runs into problems if two listings have exactly identical titles (unlikely for app purpose)

    let titleKey = parent.querySelector(".s-item__title").innerHTML//.replace(/ /g, "-")
    if(parent.classList.contains("salvage-extension-selected")){

      let price = response['cart'][titleKey][0];
      delete response['cart'][titleKey]

      chrome.storage.sync.set({cart: response['cart'],
        total: response['total'] - parseFloat(price.replace(/,/g, ""))},
        function() {
          parent.classList.remove("salvage-extension-selected");
      });

    }else{
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


//updates the extension DOM when action is fired to storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
  let extensionOpenChange = changes['extensionStatus'];
  let extensionListeningChange = changes['extensionListening'];
  let extensionCartChange = changes['cart'];


  //if multiple tabs are open, update the 'salvage-extension-selected' for all tabs when a
  //change is made on one. (can be slow if displaying many results on a page or have many items in cart -> O(n*m))
  if(extensionCartChange){
    let parents = document.getElementsByClassName('s-item')
    let listingTitles = symmetricDifference(Object.keys(extensionCartChange.newValue), Object.keys(extensionCartChange.oldValue));
    for(let parent of parents){
      for (let listingTitle of listingTitles){
        let parentTitle = parent.querySelector(".s-item__title")
        if(!parentTitle){ continue; }

        parentTitle = parentTitle.innerHTML;

        if(listingTitle == parentTitle && parent.classList.contains('salvage-extension-selected')){
          parent.classList.remove('salvage-extension-selected')
        } else if(listingTitle == parentTitle){
          parent.classList.add('salvage-extension-selected')
        }
      }
    }
    
  }
  //handle extension opening
  if(extensionOpenChange){ toggleIframe(); }
    
  //handle extension activation
  if(extensionListeningChange){
    if(extensionListeningChange.newValue == "on"){
      injectExtensionListeners();
    } else{
      removeExtensionListeners();
    }
  }

});


//////////////////////
/* HELPER FUNCTIONS */
//////////////////////

function symmetricDifference(newValues, oldValues) {
  let setB = new Set(oldValues);
  let difference = new Set(newValues);

  for (let elem of setB) {
      if (difference.has(elem)) {
          difference.delete(elem)
      } else {
          difference.add(elem)
      }
  }
  return difference
}


//function to add the event listeners of the extension to the browser's DOM
function injectExtensionListeners(){
  let parents = document.getElementsByClassName("s-item"); //s-item is the class for listings on ebay.

  for (let parent of parents) {
    let button = document.createElement("button");
    button.innerHTML = "BUTTON";
    button.className = "toggleCartButton";
    button.addEventListener("click", buttonEventListener(parent), false);

    parent.appendChild(button);
  }
}

//function to remove extension webpage buttons and associated event listeners
function removeExtensionListeners(){
  let buttons = document.getElementsByClassName("toggleCartButton");
  for(let i = buttons.length-1; i>0; i--){
    let parent = buttons[i].parentNode;
    parent.classList.remove("salvage-extension-selected");
    parent.removeChild(buttons[i]);
  }
}

//button event listener helper to get the prices/sold status from a listing
//returns [price, saleType] saleType can be STRIKETHROUGH, ACTIVE, or POSITIVE
//STRIKETHROUGH --> bestoffer was taken, ACTIVE --> listing is still live, POSITIVE --> Item sold for that amount
function getPrices(parent){
  let result = [];
  let priceIfActive = parent.querySelector(".s-item__price");
  //if user is looking at sold listings, "priceIfActive" will have a child span with class "POSITIVE [, ITALIC, STRIKETHROUGH]"
  let priceIfSold = priceIfActive.firstElementChild;
  if (priceIfSold){
    result.push(priceIfSold.innerHTML.slice(1, priceIfSold.length));
    if (priceIfSold.classList.contains("STRIKETHROUGH")){
      result.push("STRIKETHROUGH");
    } else {result.push("POSITIVE")}

  }else{
    result.push(priceIfActive.innerHTML.slice(1,priceIfActive.length));
    result.push("ACTIVE");
  }
  return result
}


///////////////////////////
/* INITIALIZATION SCRIPT */
///////////////////////////

//get the initial state of the extension
//(i.e. add extension iframe and event listeners on page refresh if extension is originally open and on)
chrome.storage.sync.get(['extensionStatus', 'extensionListening', 'cart'], function(response) {
  if (response['extensionStatus'] == 'active'){
    iframe.classList.remove("salvage-extension-iframe-off");
    iframe.classList.add("salvage-extension-iframe-on");
  }

  if(response['extensionListening'] == 'on'){
    injectExtensionListeners();
  }

  //don't perform costly initialization if cart is empty
  if(response['cart']){
    let parents = document.getElementsByClassName('s-item')

    for(let parent of parents){
      for (let listingTitle in response['cart']){ 
        let parentTitle = parent.querySelector(".s-item__title")
        if(!parentTitle){ continue; }
        parentTitle = parentTitle.innerHTML;

        if(listingTitle == parentTitle){
          parent.classList.add('salvage-extension-selected')
        }
      }
    }
  }
});





