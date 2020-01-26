

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

//button event listener helper to get the prices/sold status from a listing
//returns [price, saleType] saleType can be STRIKETHROUGH, ACTIVE, or POSITIVE
//STRIKETHROUGH --> bestoffer was taken, ACTIVE --> listing is still live, POSITIVE --> Item sold for that amount
function getPrices(parent){
  let result = [];
  let priceIfActive = parent.querySelector(".s-item__price");
  //if user is looking at sold listings, "priceIfActive" will have a child span with class "POSITIVE [, ITALIC, STRIKETHROUGH]"
  let priceIfSold = priceIfActive.firstElementChild
  if (priceIfSold){
    result.push(priceIfSold.innerHTML.slice(1, priceIfSold.length));
    if (priceIfSold.classList.contains("STRIKETHROUGH")){
      result.push("STRIKETHROUGH")
    } else {result.push("POSITIVE")}

  }else{
    result.push(priceIfActive.innerHTML.slice(1,priceIfActive.length));
    result.push("ACTIVE")
  }
  return result
}

// function getTitle(parent){
//   let title = parent.querySelector("s-item__title")
//   return title
}

//event listener to install on each listing's button.
let buttonEventListener = parent => () => {
  chrome.storage.sync.get(['cart'], function(response) {
    //using title as key is space efficient, and almost always unique
    //runs into problems if two listings have exactly identical titles (unlikely for app purpose)
    let titleKey = parent.querySelector("s-item__title").innerHTML;
    if(parent.classList.contains("salvage-extension-selected")){
      delete response['cart'][titleKey]
      chrome.storage.sync.set({cart: response['cart']}, function() {
        parent.classList.remove("salvage-extension-selected");
      });
    }else{
      response['cart'][titleKey] = getPrices(parent)
      chrome.storage.sync.set({cart: response['cart']}, function() {
        parent.classList.add("salvage-extension-selected");
      });
    }
  });
}

//function to add the javascript of the extension to the browser's DOM
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

//updates the extension DOM when action is fired to storage

//use sets to get diff, make changes. or RERENDER all...
chrome.storage.onChanged.addListener(function(changes, namespace) {
  let extensionOpenChange = changes['extensionStatus'];
  let extensionListeningChange = changes['extensionListening'];
  let extensionCartChange = changes['cart'];
  if(extensionOpenChange){ toggleIframe() }
    
  if(extensionListeningChange){
    if(extensionListeningChange.newValue == "on"){
      injectExtensionListeners();
    } else{
      removeExtensionListeners();
    }
  }

  if (extensionCartChange){
    console.log(extensionCartChange)
  }
});

//install the right sidebar for the extension, and give it 0 width
let iframe = document.createElement('iframe');
iframe.className = "salvage-extension-iframe salvage-extension-iframe-off";
iframe.id = "salvage-sidebar";
iframe.src = chrome.extension.getURL("./../popup.html");
document.body.appendChild(iframe);

//get the initial state of the extension
//(i.e. add extension iframe and event listeners on page refresh if extension is originally open and on)
chrome.storage.sync.get(['extensionStatus', 'extensionListening'], function(response) {
  if (response['extensionStatus'] == 'active'){
    iframe.classList.remove("salvage-extension-iframe-off");
    iframe.classList.add("salvage-extension-iframe-on");
  }

  if(response['extensionListening'] == 'on'){
    injectExtensionListeners();
  }
});

// When the user scrolls the page, execute stickySidebar
window.onscroll = function() {(stickySidebar())};

let sticky = iframe.offsetTop;
// update iframe distance from top on scroll
function stickySidebar() {
  if (window.pageYOffset >= sticky) {
    iframe.style.top = "0px";
  } else {
    iframe.style.top = (sticky - window.pageYOffset).toString() + "px";
  }
}



console.log("script has run...")