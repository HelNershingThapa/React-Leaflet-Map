import React, {Component} from 'react'

const style = {
            position: 'absolute',
            zIndex: 9999,
            height: 100,
            width: 60,
            background: 'black',
            color: 'white',
            // left: '50%',            
      }

class Filter extends Component{
	render(){
		return(					
			<div style={style}>				
            <input type="radio" name="school" value="private" onChange={this.props.onChange}/>Private
            <input type="radio" name="school" value="government" onChange={this.props.onChange}/>Government
            <input type="radio" name="school" value="all" onChange={this.props.onChange}/> All
          	</div>

		)		
	}
}

export default Filter