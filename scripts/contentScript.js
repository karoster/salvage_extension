
function toggleIframe(){
  if(iframe.className == "salvage-extension-iframe-off"){
      iframe.className="salvage-extension-iframe-on";
  }
  else{
      iframe.className="salvage-extension-iframe-off";
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
  for(let button of buttons){
    button.parentNode.removeChild(button);
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
iframe.className = "salvage-extension-iframe-off"
iframe.src = chrome.extension.getURL("./../popup.html")
document.body.appendChild(iframe);

//get the initial state of the extension
//(i.e. add extension iframe and event listeners on page refresh if extension is originally open and on)
chrome.storage.sync.get(['extensionStatus', 'extensionListening'], function(response) {
  if (response['extensionStatus'] == 'active'){
    iframe.className="salvage-extension-iframe-on"
  }

  if(response['extensionListening'] == 'on'){
    injectExtensionListeners()
  }
});


console.log("script has run...")