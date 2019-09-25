import React from 'react';
import Map from './Map'
import jsonData from '../assets/schooldata.js'
import osmtogeojson from 'osmtogeojson'
import Filter from './Filter'


const bigGeoData = osmtogeojson(jsonData)

class Main extends React.Component{

	constructor(props) {
	        super()
	        this.state = {        	
	        	geoData: osmtogeojson(jsonData),
	        } 
	         
			this.onHandleChange = this.onHandleChange.bind(this) 		             
	}
	    
	onHandleChange(event) {				
		if (event.target.value !== "all"){			
			this.setState({
				geoData: {type: "FeatureCollection", features: bigGeoData.features.filter(a=> a.properties["operator:type"]===event.target.value)}
			})				
		}
		else
		{
			this.setState({
				geoData: bigGeoData
			})	
		}		
		
	}

	render(){  	
	  	return (
	    <div className="Main">          
	      <Filter onHandleChange={this.onHandleChange}/>
	      <Map geoData={this.state.geoData}/>      
	    </div>
	  	);	
	}
	} 

export default Main;
