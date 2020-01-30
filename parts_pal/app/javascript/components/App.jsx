import React from "react";
import Routes from "../routes/Index";
import configureStore from "./../store/configureStore"
import { Provider } from "react-redux";
store = configureStore()

class App extends React.Component{
    render(){
        return(
            <Provider store={store}>
                <>{Routes}</>
            </Provider>
        )
    }

}


export default App