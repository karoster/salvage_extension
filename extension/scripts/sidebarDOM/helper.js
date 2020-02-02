//////////////////////////////
/* SIDEBAR HELPER FUNCTIONS */
//////////////////////////////

function getPostData(object){
    returnList = [];
    for(let item in object){
      returnList.push({part_id: item,
        sale_type: object[item][1],
        sale_price: object[item][0] 
      });
    }
    return returnList
}


//this function returns all elements in newValues not in oldValues unioned with
//all elements in oldValues not in newValues (symmetric difference)
function symmetricDifference(newValues, oldValues) {
    let setB = new Set(oldValues);
    let difference = new Set(newValues);
  
    for (let elem of setB) {
      if (difference.has(elem)) {
          difference.delete(elem);
      } else {
          difference.add(elem);
      }
    }
    return difference
}
  
//rewrites a float as a number with commas for displaying.
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  