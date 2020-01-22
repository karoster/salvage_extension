
chrome.storage.onChanged.addListener(function(changes, namespace) {
  let extensionChange = changes['extensionStatus'];
  //return if the change to storage was something else
  if(!extensionChange){return}
  toggleIframe();
});



function toggleIframe(){
  if(iframe.className == "salvage-extension-iframe-off"){
      iframe.className="salvage-extension-iframe-on";
  }
  else{
      iframe.className="salvage-extension-iframe-off";
  }
}

let iframe = document.createElement('iframe');
iframe.className = "salvage-extension-iframe-off"
iframe.src = chrome.extension.getURL("./../popup.html")

document.body.appendChild(iframe);

//get the initial state of the extension (i.e. add extension content if extension is open and user refreshes page)
chrome.storage.sync.get(['extensionStatus'], function(response) {
  if (response['extensionStatus'] == 'active'){
    iframe.className="salvage-extension-iframe-on"
  }
});


// //function to add the javascript of the extension to the browser's DOM
// let injectExtension = function(){
//   let parents = document.getElementsByClassName("s-item") //s-item is the class for listings on ebay.
//   for (let parent of parents) {
//     let button = document.createElement("button");
//     button.innerHTML = "BUTTON"
//     button.className = "toggleCartButton";
//     button.addEventListener("click", ()=>{
//       parent.className += " salvage-extension-selected";
//     } , false);
//     parent.appendChild(button)
//   }
// }
// //function to remove content
// let removeExtension = function(){

// }


// //set the initial state of the extension (i.e. add extension content if extension is activated and user refreshes page)
// chrome.storage.sync.get(['extensionStatus'], function(response) {
//   if (response['extensionStatus'] == 'active'){
//     injectExtension()
//   }
// });

// //add or remove content if toggle switch is used
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   let extensionChange = changes['extensionStatus']
//   //return if the change to storage was something else
//   if(!extensionChange){return}
  
//   if (extensionChange.newValue == 'active'){
//     injectExtension()
//   }
//   else{
//     removeExtension()
//   }

// });


// console.log("script has run...")