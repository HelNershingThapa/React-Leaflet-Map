import React from 'react';
import Map from './Map'
import jsonData from '../assets/schooldata.js'
import osmtogeojson from 'osmtogeojson'
import Filter from './Filter'


let geoData = osmtogeojson(jsonData)

let geoData2= geoData.features.filter(a=>a.properties["isced:level"]==="primary")

class Main extends React.Component{
constructor(props) {
        super()   
        this.state = {
        	geoData: geoData
        }     
			this.onHandleChange = this.onHandleChange.bind(this)             
    }

onHandleChange(event) {
	console.log(event.target.value)	
	if (event.target.value === "private")		
}

render(){  	
  	return (
    <div className="Main">
      
      <Filter onChange={this.onHandleChange}/>
      <Map geoData={this.state.geoData}/>
      
    </div>
  	);	
 }
} 

export default Main;
