import React, {Component} from 'react';


const style = {
   padding: '20px',
  background: 'white',
  color: '#3590f3',
  fontSize: '30px',
  borderBottom: '3px solid #e4e4e4',
  boxShadow: '4px -1px 3px 0px white',
}

class Header extends Component{
render(){
	return(
		<div className="header" style={style}>
			OSM Data Visualization
		</div>
		)
}
}

export default Header
