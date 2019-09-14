import React from 'react';
import L from 'leaflet';
import jsonData from '../assets/schooldata.js'
import osmtogeojson from 'osmtogeojson'
import _ from 'lodash'
import markerClusterGroup from 'leaflet.markercluster'
import '../assets/cluster.css'


let geoData = osmtogeojson(jsonData)
class Map extends React.Component {

  const config = {
    params: {
      center: [27.7172,  85.3240],
      minZoom: 11,
      maxZoom: 17,
      zoom: 12,
      layers: [osmMap] // only add one!
    }
  }

  constructor(){
    super()
    this.state = {
      map: null,
      tileLayer: null,
      geojsonLayer: null,
      geoData: null
    }
  }

  getData(){
    this.setState({
      geoData

    })
  }

  componentDidMount() {
    this.getData();
        var osmLink = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';
        
        var osmUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            osmAttrib = '&copy; ' + osmLink + ' Contributors',
            landUrl = 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
            thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink;

        var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib}),
            landMap = L.tileLayer(landUrl, {attribution: thunAttrib});

        var map = L.map('map', config.mapParams);

    var baseLayers = {
      "Carto Dark": osmMap,
      "Landscape": landMap
    };

    L.control.layers(baseLayers).addTo(map);

  var myIcon = L.icon({
  iconUrl: 'https://cdn1.iconfinder.com/data/icons/leto-blue-map-pins/64/pin_marker_location-24-512.png',
  iconSize: [45, 50],
  iconAnchor: [16, 37],
  popupAnchor: [0, -28]
    });
  //GeoJSON layer
    let geojsonLayer = L.geoJson(geoData, {
      pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: myIcon});
      },
      filter: (feature, _layer) => {
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
      },
      onEachFeature: (feature, layer) => {
        let popupContent = "";
        let keys = Object.keys(feature.properties);
        keys.forEach(function(key) {
          popupContent = `${popupContent}<dt>${_.capitalize(key)}:</dt><dd>${_.capitalize(feature.properties[key])}</dd>`;
        });
        popupContent = popupContent + "</dl>";
        layer.bindPopup(popupContent);
      }
    });

    // Marker Clustering
    var markers = L.markerClusterGroup({
         disableClusteringAtZoom: 18,
         maxClusterRadius: 80,
         spiderfyDistanceMultiplier: 1,
     });
     markers.addLayer(resultLayer);
     map.addLayer(markers);

}

  render() {
    return(
           <div id="map"></div>
    )
  }
}


export default Map;
