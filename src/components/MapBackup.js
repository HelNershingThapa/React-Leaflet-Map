import React from 'react';
import L from 'leaflet';
import _ from 'lodash'
import markerClusterGroup from 'leaflet.markercluster'
import '../assets/cluster.css'
import '../App.css'


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

class Map extends React.Component {
    constructor(props) {
        super()        
        this.state = {
            map: null,                        
            geojsonLayer: null,
            geoData: props.geoData                                
        }
        this.onEachFeature = this.onEachFeature.bind(this)
        this.pointToLayer = this.pointToLayer.bind(this)
        this.filterFeatures = this.filterFeatures.bind(this)  
        this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this)                      
    }

    componentDidMount() {        
        this.init();                     
    }

    componentDidUpdate(prevProps, prevState) {            
        if (prevProps.geoData !== this.props.geoData) { 
          
        console.log("COmponent Did Update")       
          this.filterGeoJSONLayer();
      }              
    }
  
    filterGeoJSONLayer() {  
        console.log(this.state.geojsonLayer, "clear")              
        this.state.geojsonLayer.clearLayers();       
        this.state.geojsonLayer.addData(this.props.geoData);           
    }

    init() {
        console.log("initialized")        
        let osmMap = L.tileLayer(config.tileLayer.osmUrl, { attribution: config.tileLayer.osmAttrib }),
            landMap = L.tileLayer(config.tileLayer.landUrl, { attribution: config.tileLayer.thunAttrib });

        let baseLayers = {
            "Carto Dark": osmMap,
            "Landscape": landMap
        };
        let map =  L.map('map', { ...config.mapParams, layers: [osmMap] });
        L.control.layers(baseLayers).addTo(map);                
        
        let geojsonLayer = L.geoJson(this.state.geoData, {
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
        map.addLayer(markers);        
        this.setState({ geojsonLayer })
    }

    pointToLayer(feature, latlng) {
        return L.marker(latlng, { icon: L.icon(iconConfig)});
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
        return true;        
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

    render() {        
        return (
            <div id="map">
                
            </div>
        )
    }
}


export default Map;