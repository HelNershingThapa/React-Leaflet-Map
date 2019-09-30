import React from 'react'
import Map from './Map'
import jsonData from '../assets/schooldata.js'
import osmtogeojson from 'osmtogeojson'
import Filter from './Filter'
import Chart from './Chart'
import _ from 'lodash'
import '../App.css'
import Header from './Header'

const bigGeoData = osmtogeojson(jsonData)
console.log(bigGeoData)

class Main extends React.Component{
	constructor(props) {
	        super()
	        this.state = {        	
	        	geoData: osmtogeojson(jsonData),	
	        	chartCount: null        	
	        } 
			this.onHandleChange = this.onHandleChange.bind(this) 		     
			this.getIscedCount = this.getIscedCount.bind(this)        
	}	
	    
	componentWillMount(){		
		this.getIscedCount()
	}

	onHandleChange(event) {				
		if (event.target.value !== "all"){			
			this.setState({
				geoData: {type: "FeatureCollection", features: bigGeoData.features.filter(a=> a.properties["operator:type"]===event.target.value)}
			})				
		}
		else
		{
			this.setState({geoData: bigGeoData})	
		}		
	}

	getIscedCount() {
		console.log("isced chart")
		let allisced = this.state.geoData.features.map(a=>a.properties['isced:level'])
		let uniqisced = _.uniq(allisced)
		let finalData = {}
		let chartarray = []
		uniqisced.forEach(a=> finalData = { ...finalData, [a]:allisced.filter(b=> b===a).length })		
		_.forEach(finalData, (value, key)=> {
			chartarray = [...chartarray, {title: key, maxValue: allisced.length, value, percent: ((value/allisced.length)*100).toFixed(0)}]
		})
			chartarray = chartarray.sort((a,b)=> b.percent-a.percent)		
			this.setState({ chartCount: chartarray })
	}

	render() {  	
	  console.log("Time to Main Rerender")
	  return (	 


	    <div className="Main">          
	    <Header />
	      <div className="schoolWrapper">
	      <div className="insights">    
	      	<div className="insightText"> Insights </div> 
					{Object.values(this.state.chartCount).map((item, i) => {
					return (
						<div className="chartContainer" key={i}>
							<div className="title">{_.capitalize(this.state.chartCount[i].title.split("_").join(" "))}</div>
							<div className="barWrapper">
								<Chart key={i} chartCount={item} />
								<div className="percent">{this.state.chartCount[i].percent}%</div>
							</div>
							<div className="value">{this.state.chartCount[i].value} of {this.state.chartCount[i].maxValue}</div>
						</div>
					);
          })}
          </div>
	      <Map geoData={this.state.geoData}/>  
	      </div>
	      <Filter onHandleChange={this.onHandleChange}/>	      
	    </div>
	  	);	
	}
	} 

export default Main;