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