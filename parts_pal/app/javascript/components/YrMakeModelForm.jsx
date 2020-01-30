import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { Link } from 'react-router-dom';

class YrMakeModelForm extends React.Component{
    constructor(props){
        super(props)

        this.state = {year: "year",
            make: "make",
            makeList: [],
            model: "model",
            modelList: [],
            submodel: "submodel",
            submodelList: [],
            activeInput: 0};

        this.activeInputMap = {'year': 1, 'make':2, 'model':3 };

        this.formatOptions = this.formatOptions.bind(this);
        this.yearRange = this.yearRange.bind(this);
        this.updateMakeList = this.updateMakeList.bind(this);
        this.updateModelList = this.updateModelList.bind(this);
        this.updateSubmodelList = this.updateSubmodelList.bind(this);
        this.updateSubmodel = this.updateSubmodel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event){
        event.preventDefault;
    }


    formatOptions(selectionField){
        // let fieldList = this.state[selectionField].map( (motorcycle) => motorcycle[selectionField])
        let fieldList = this.state[selectionField]
        return fieldList.map( (item, idx) => <option key={idx} value={item}>{item}</option>)
    }

    yearRange(){
        let years = Array.from(new Array(117), (x,i) => 2020 - i)
        return years.map(year => <option value={year} key={year}>{year}</option>)
    }


    getNewState(event){
        let newFormState = cloneDeep(this.state);
        let newActiveInput = this.activeInputMap[event.target.id];
        newFormState[event.target.id] = event.target.value
        newFormState.activeInput = newActiveInput
        switch(newActiveInput){
            case 1:
                newFormState.make = "make"
                newFormState.makeList = []
            case 2:
                newFormState.model = "model"
                newFormState.modelList = []
            case 3:
                newFormState.submodel = "submodel"
                newFormState.submodelList = []
                break
        }
        return newFormState
    }

    uniq(arr) {
        var seen = {};
        return arr.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }

    updateMakeList(event){
        let newFormState = this.getNewState(event)
        let url = `http://localhost:3000/api/v1/motorcycles?year=${newFormState.year}`
        fetch(url).then( response => response.json())
            .then((responseJson) => {
                return responseJson.map( motorcycle => motorcycle['make'])
            }).then(list => {
                newFormState.makeList = this.uniq(list).sort()
                this.setState(newFormState)
            })
    }

    updateModelList(event){
        let newFormState = this.getNewState(event)
        let url = `http://localhost:3000/api/v1/motorcycles?year=${newFormState.year}&make=${newFormState.make}`
        fetch(url).then( response => response.json() )
            .then((responseJson) => {
                return responseJson.map( motorcycle => motorcycle['model'])
            }).then(list => {
                newFormState.modelList = this.uniq(list).sort()
                this.setState(newFormState)
            })

    }

    updateSubmodelList(event){
        let newFormState = this.getNewState(event)
        let url = `http://localhost:3000/api/v1/motorcycles?year=${newFormState.year}&make=${newFormState.make}&model=${newFormState.model}`
        fetch(url).then( response => response.json() )
            .then((responseJson) => {
                return responseJson.map( motorcycle => motorcycle['submodel'])
            }).then(list => {
                newFormState.submodelList = this.uniq(list).sort().filter(submodel => submodel != "--")
                this.setState(newFormState)
            })
    }


    updateSubmodel(event){
        this.setState({submodel: event.target.value})
    }

    getMotorcycles(newFormState, url){
        fetch(url).then( response => response.json() )
            .then((responseJson) => {
                newFormState.motorcycles = responseJson;
                this.setState(newFormState)
            })

    }


    render(){
        let activeInput = this.state.activeInput
        return (
            <div className="year-make-model-form">
                <form className="form-inline">

                    <div className="form-group">
                        <select className="form-control" id="year" onChange={this.updateMakeList}
                            value={this.state.year}>
                            <option disabled hidden value="year">Year</option>
                            {this.yearRange()}
                        </select>
                    </div>

                    <div className="form-group">
                        <select className="form-control" id="make" onChange={this.updateModelList}
                            disabled={activeInput >=1 ? false : true}
                            value={this.state.make}>
                            <option disabled hidden value="make">Make</option>
                            {this.formatOptions('makeList')}
                        </select>
                    </div>

                    <div className="form-group">
                        <select className="form-control" id="model" onChange={this.updateSubmodelList}
                            disabled={activeInput >=2 ? false : true}
                            value={this.state.model}>
                            <option disabled hidden value="model">Model</option>
                            {this.formatOptions('modelList')}
                        </select>
                    </div>

                    <div className="form-group">
                        <select className="form-control" id="submodel" onChange={this.updateSubmodel}
                        disabled={activeInput >=3 ? false : true}
                        value={this.state.submodel}>
                            <option disabled hidden value="submodel">Submodel</option>
                            {this.formatOptions('submodelList')}
                        </select>
                    </div>


                    <Link to={{
                        pathname: '/search',
                        state: {year: this.state.year, make: this.state.make, model: this.state.model, submodel:this.state.submodel}
                        }}>Submit</Link>

                </form>
            </div>
        )
    }

}

export default YrMakeModelForm
