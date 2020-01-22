export let injectExtension = function(){
let greeting = "hi "
let parents = document.getElementsByClassName("s-item")
let eventListening = () => { alert(greeting + button.person_name + ".")};
console.log('made it to injectextension..')
for (let element of parents) {
  let button = document.createElement("button");
  button.innerHTML = "BUTTON"
  button.className = "toggleCartButton";
  button.person_name = "test";
  button.addEventListener("click", eventListening, false);
  
  element.appendChild(button)
}
}

export let removeExtension = function(){

}