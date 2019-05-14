import React, { Component } from 'react'

class SearchBar extends Component {
    constructor (props) {
        super(props)
        this.state ={
            lockRequestCall:false,
            intervalBeforeRequest:1000,
            searchText:"",
            };
    }
    render () {
        return (
            <div className="row">
                <div className="col-lg-8">
                     <input onKeyUp={this.handleChange.bind(this)} type="text" className="form-control input-lg" placeholder="Rechercher un film..." />
                </div>
            </div>
        )
    }

  handleChange(e) {
      this.setState({searchText:e.target.value});
      if(!this.state.lockRequestCall){
        this.setState({lockRequestCall:true})
        setTimeout(function() { this.search(this.state.searchText) }.bind(this), this.state.intervalBeforeRequest);
      }
  }


search(inputText){
    this.setState({lockRequestCall:false});
    this.props.callBackRequest(inputText);
}
 
}

export default SearchBar