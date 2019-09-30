import React, {Component} from 'react'
import '../App.css'

const style = {
    position: 'absolute',
    zIndex: 9999,    
    background: '#948e8e40',
    color: 'white',
    top: '34%',
    left: '33.6%',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '4px',    
    transform: 'translate(-50%, -50%)',
    alignItems: 'flex-start'
}

class Filter extends Component{
	constructor(props) {
        super()           
    }
	render(){
		return(					
		  <div className="filterClass" style={style}>				
          <div>
          <input type="radio" name="school" value="private" onChange={this.props.onHandleChange}/>Private
          </div>
          <div>
          <input type="radio" name="school" value="government" onChange={this.props.onHandleChange}/>Government
          </div>
          <div>
          <input type="radio" name="school" value="all" onChange={this.props.onHandleChange}/> All
          </div>
      </div>
		)		
	}
}

export default Filter