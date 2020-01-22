
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
  for (let parent of parents) {
    let button = document.createElement("button");
    button.innerHTML = "BUTTON";
    button.className = "toggleCartButton";
    button.addEventListener("click", ()=>{
      parent.className += " salvage-extension-selected";
    } , false);
    parent.appendChild(button);
  }
}
//function to remove content
let removeExtensionListeners = function(){
  console.log('should remove extension listeners...')
}

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



let iframe = document.createElement('iframe');
iframe.className = "salvage-extension-iframe-off"
iframe.src = chrome.extension.getURL("./../popup.html")
document.body.appendChild(iframe);

//get the initial state of the extension (i.e. add extension iframe if extension is open and user refreshes page)
chrome.storage.sync.get(['extensionStatus', 'extensionActive'], function(response) {
  if (response['extensionStatus'] == 'active'){
    iframe.className="salvage-extension-iframe-on"
  }

  if(response['extensionActive'] == 'on'){
    injectExtensionListeners()
  }
});


console.log("script has run...")