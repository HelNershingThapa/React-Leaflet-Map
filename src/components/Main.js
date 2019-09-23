import React from 'react';
import Map from './Map'
import jsonData from '../assets/schooldata.js'
import osmtogeojson from 'osmtogeojson'
import Filter from './Filter'


let geoData = osmtogeojson(jsonData)

let geoData2= geoData.features.filter(a=>a.properties["isced:level"]==="primary")
debugger



class Main extends React.Component{
constructor(props) {
        super()        
			this.onHandleChange = this.onHandleChange.bind(this)             
    }

onHandleChange() {
	console.log("Changed")
}
  render(){  	
  	return (
    <div className="Main">
      <Map geoData={geoData.features}/>
      <Filter onChange={this.onHandleChange}/>
      
    </div>
  	);	
 }
} 

export default Main;
