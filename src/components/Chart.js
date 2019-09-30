import React, {Component} from 'react';
import c3 from 'c3'

class Chart extends Component{
	constructor(props){
		super()		
		console.log("Chart Props>>", props)
		this.state = {
					 
		}		
		this.createMap = this.createMap.bind(this)
	}
	
	componentDidMount() {        
        this.createMap()               
    }

    createMap(){
    	console.log("Props Chart", this.props.chartCount)
	    let chart = c3.generate({
		    bindto: this.node,
		    data: {
	        json: { value: this.props.chartCount.percent },
	        type: 'bar',
      	},
		    axis: {
        rotated: true,
        x: {
          show: false,
          type: 'category',
        },
        y: {
          show: false,
          max: 90,
        },
      	},
		    color: {
        pattern: ['#000'],
      	},
	      legend: {
	        show: false,
	      },
	      padding: {
	        right: 10,
	      },
	      regions: [
        	// {axis: 'y', end: 1, class: 'regionY'},
	        {
	          axis: 'x', start: -0.32, end: 0.3, class: 'region1',
	        },
      	],
      	tooltip: {
        show: false,
      	},
		});
    }

	render(){
		return(		
			<div id="chart" style={{color:"red", height:'25px', width:'250px'}}
			ref={node => this.node = node}			
			>			
			</div>
			)
	}	

}

export default Chart