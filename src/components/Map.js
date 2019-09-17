import React from 'react';
import L from 'leaflet';
import jsonData from '../assets/schooldata.js'
import osmtogeojson from 'osmtogeojson'
import _ from 'lodash'
import markerClusterGroup from 'leaflet.markercluster'
import '../assets/cluster.css'

const config = {
    mapParams: {
        center: [27.7172, 85.3240],
        minZoom: 11,
        maxZoom: 17,
        zoom: 12,        
    },
    tileLayer: {
        osmLink: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        thunLink: '<a href="http://thunderforest.com/">Thunderforest</a>',
        osmUrl: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        osmAttrib: '&copy; ' + '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ' Contributors',
        landUrl: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
        thunAttrib: '&copy; ' + '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ' Contributors & ' + '<a href="http://thunderforest.com/">Thunderforest</a>',
    },
}

const iconConfig = {
    iconUrl: 'https://cdn1.iconfinder.com/data/icons/leto-blue-map-pins/64/pin_marker_location-24-512.png',
    iconSize: [45, 50],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28]
}

let geoData = osmtogeojson(jsonData)
class Map extends React.Component {
    constructor() {
        super()
        this.state = {
            map: null,
            osmMap: null,
            landMap: null,
            geojsonLayer: null,
            geoData: null,            
            selectedFilter: null,
            schoolFilters: { government: false, private: false },
        }

        this.onEachFeature = this.onEachFeature.bind(this)
        this.pointToLayer = this.pointToLayer.bind(this)
        this.filterFeatures = this.filterFeatures.bind(this)
        this.onOperatorChange = this.onOperatorChange.bind(this)
        this.addGeoJSONLayer = this.addGeoJSONLayer.bind(this)
    }

    getData() {
        console.log("from getData")
        this.setState({
            geoData
        })
    }

    async componentDidMount() {
        console.log("from componentDidMount")
        this.getData();
        await this.init();        
        this.addGeoJSONLayer(this.state.geoData) 
        }     
     
     addGeoJSONLayer(geoData){        
        let geojsonLayer = L.geoJson(geoData, {
            pointToLayer: this.pointToLayer,
            filter: this.filterFeatures,
            onEachFeature: this.onEachFeature
        });
        // Marker Clustering
        let markers = L.markerClusterGroup({
            disableClusteringAtZoom: 18,
            maxClusterRadius: 80,
            spiderfyDistanceMultiplier: 1,
        });        
        markers.addLayer(geojsonLayer);
        this.state.map.addLayer(markers);         
     }   
        
    init() {
        console.log("initialized")
        if (this.state.map) return;
        let osmMap = L.tileLayer(config.tileLayer.osmUrl, { attribution: config.tileLayer.osmAttrib }),
            landMap = L.tileLayer(config.tileLayer.landUrl, { attribution: config.tileLayer.thunAttrib });

        let baseLayers = {
            "Carto Dark": osmMap,
            "Landscape": landMap
        };
        let map =  L.map('map', { ...config.mapParams, layers: [osmMap] });
        L.control.layers(baseLayers).addTo(map);
        this.setState({ map})
    }

    pointToLayer(feature, latlng) {
        return L.marker(latlng, { icon: L.icon(iconConfig) });
    }
    
    filterFeatures(feature, _layer) {
        let isPolygon =
            feature.geometry &&
            feature.geometry.type &&
            feature.geometry.type === "Polygon";
        if (isPolygon) {
            feature.geometry.type = "Point";
            let polygonCenter = L.latLngBounds(
                feature.geometry.coordinates[0]
            ).getCenter();
            feature.geometry.coordinates = [polygonCenter.lat, polygonCenter.lng];
        }        
        if (this.state.schoolFilters[this.state.selectedFilter]) {
            if (feature.properties["operator:type"] === this.state.selectedFilter) {                
                return true;
            }
        } else return true       
    }

    onEachFeature(feature, layer) {
        let popupContent = "";
        let keys = Object.keys(feature.properties);
        keys.forEach(function(key) {
            popupContent = `${popupContent}<dt>${_.capitalize(key)}:</dt><dd>${_.capitalize(feature.properties[key])}</dd>`;
        });
        popupContent = popupContent + "</dl>";
        layer.bindPopup(popupContent);
    }

    onOperatorChange(event){        
        console.log(event.target.value)
        this.setState({
            selectedFilter: event.target.value
        })        
    }

    render() {
        console.log("from render")
      const style = {
        position: 'absolute',
        zIndex: 9999,
        height: 100,
        width: 60,
        background: 'black',
        color: 'white',
        left: '50%'
      }
        return (
            <div id="map">
              <div style={style}>
                <input type="radio" name="school" value="private" onChange={this.onOperatorChange} />Private
                <input type="radio" name="school" value="government" onChange={this.onOperatorChange} />Government
                <input type="radio" name="school" value="all" onChange={this.onOperatorChange} /> All
              </div>
            </div>
        )
    }
}


export default Map;