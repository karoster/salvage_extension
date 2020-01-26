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


//function to add the javascript of the extension to the browser's DOM
let injectExtensionListeners = function(){
  let parents = document.getElementsByClassName("s-item") //s-item is the class for listings on ebay.
  let buttonEventListener = parent => () => parent.className += " salvage-extension-selected"

  for (let parent of parents) {
    let button = document.createElement("button");
    button.innerHTML = "BUTTON";
    button.className = "toggleCartButton";
    button.addEventListener("click", buttonEventListener(parent), false);

    parent.appendChild(button);
  }
}

//function to remove extension webpage buttons and associated event listeners
let removeExtensionListeners = function(){
  let buttons = document.getElementsByClassName("toggleCartButton");
  for(let i = buttons.length-1; i>0; i--){
    buttons[i].parentNode.removeChild(buttons[i]);
  }
}

//updates the website DOM when there is a change in extension DOM
chrome.storage.onChanged.addListener(function(changes, namespace) {
  let extensionOpenChange = changes['extensionStatus'];
  let extensionListeningChange = changes['extensionListening']
  //return if the change to storage was something else
  if(extensionOpenChange){ toggleIframe() }
    
  if(extensionListeningChange){
    if(extensionListeningChange.newValue == "on"){
      injectExtensionListeners();
    } else{
      removeExtensionListeners();
    }
  }
});

//install the right sidebar for the extension, and give it 0 width
let iframe = document.createElement('iframe');
iframe.className = "salvage-extension-iframe salvage-extension-iframe-off"
iframe.id = "salvage-sidebar"
iframe.src = chrome.extension.getURL("./../popup.html")
document.body.appendChild(iframe);

//get the initial state of the extension
//(i.e. add extension iframe and event listeners on page refresh if extension is originally open and on)
chrome.storage.sync.get(['extensionStatus', 'extensionListening'], function(response) {
  if (response['extensionStatus'] == 'active'){
    iframe.classList.remove("salvage-extension-iframe-off");
    iframe.classList.add("salvage-extension-iframe-on");
  }

  if(response['extensionListening'] == 'on'){
    injectExtensionListeners()
  }
});

// When the user scrolls the page, execute stickySidebar
window.onscroll = function() {(stickySidebar())};

// Get the offset position of the iframe
let sticky = iframe.offsetTop;
// Add the sticky class to the iframe when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickySidebar() {
  if (window.pageYOffset >= sticky) {
    iframe.style.top = "0px"
    // iframe.classList.add("sticky")
  } else {
    iframe.style.top = (sticky - window.pageYOffset).toString() + "px";
    // iframe.classList.remove("sticky");
  }
}



console.log("script has run...")