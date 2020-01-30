import { createStore } from 'redux';

const initialState = {
    auction: []
};

//reducer to handle adding and removing auctions from the state.
//auctions in the state will be rendered in the "total" column 
function auctionReducer(state = initialState, action){
    console.log(action.type)
    switch(action.type){
        default:
            return state
    }
}


export default function configureStore(){
    const store = createStore(auctionReducer, initialState)
    return store
}