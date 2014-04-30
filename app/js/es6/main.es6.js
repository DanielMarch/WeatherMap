/* global google:true */
/* jshint unused:false, camelcase:false */
/* global AmCharts:true */

(function(){
  'use strict';

  $(document).ready(init);

  var map;
  var zip;
  var chart;

  function init(){
    initMap(39, -98, 3);
    $('#add').click(getZip);
  }

  function getZip(){
    zip = $('#zip').val();
    if(zip.length === 5){
      show();
      getWeather();
      makeChart();
    }else{
      alert('Enter Valid Zipcode');
    }
  }

  function getWeather(){
    let url = 'http://api.wunderground.com/api/d61566ba7c8e6c69/forecast10day/q/'+zip+'.json?callback=?';
    $.getJSON(url, weather);
  }

  function weather(conditions){
    conditions.forecast.simpleforecast.forecastday.forEach(m=>chart.dataProvider.push({high:m.high.fahrenheit, low:m.low.fahrenheit, date:m.date.weekday_short}));
    chart.validateData();
  }

  function initMap(lat, lng, zoom){
    let styles = [{'elementType':'labels.text.stroke','stylers':[{'color':'#ffffff'}]},{'elementType':'labels.text.fill','stylers':[{'color':'#000000'}]},{'featureType':'water','elementType':'geometry','stylers':[{'color':'#0000ff'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#ff0000'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#000100'}]},{'featureType':'road.highway.controlled_access','elementType':'geometry.fill','stylers':[{'color':'#ffff00'}]},{'featureType':'road.highway.controlled_access','elementType':'geometry.stroke','stylers':[{'color':'#ff0000'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#ffa91a'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#000000'}]},{'featureType':'landscape.natural','stylers':[{'saturation':36},{'gamma':0.55}]},{'featureType':'road.local','elementType':'geometry.stroke','stylers':[{'color':'#000000'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'landscape.man_made','elementType':'geometry.stroke','stylers':[{'lightness':-100},{'weight':2.1}]},{'featureType':'landscape.man_made','elementType':'geometry.fill','stylers':[{'invert_lightness':true},{'hue':'#ff0000'},{'gamma':3.02},{'lightness':20},{'saturation':40}]},{'featureType':'poi.attraction','stylers':[{'saturation':100},{'hue':'#ff00ee'},{'lightness':-13}]},{'featureType':'poi.government','stylers':[{'saturation':100},{'hue':'#eeff00'},{'gamma':0.67},{'lightness':-26}]},{'featureType':'poi.medical','elementType':'geometry.fill','stylers':[{'hue':'#ff0000'},{'saturation':100},{'lightness':-37}]},{'featureType':'poi.medical','elementType':'labels.text.fill','stylers':[{'color':'#ff0000'}]},{'featureType':'poi.school','stylers':[{'hue':'#ff7700'},{'saturation':97},{'lightness':-41}]},{'featureType':'poi.sports_complex','stylers':[{'saturation':100},{'hue':'#00ffb3'},{'lightness':-71}]},{'featureType':'poi.park','stylers':[{'saturation':84},{'lightness':-57},{'hue':'#a1ff00'}]},{'featureType':'transit.station.airport','elementType':'geometry.fill','stylers':[{'gamma':0.11}]},{'featureType':'transit.station','elementType':'labels.text.stroke','stylers':[{'color':'#ffc35e'}]},{'featureType':'transit.line','elementType':'geometry','stylers':[{'lightness':-100}]},{'featureType':'administrative','stylers':[{'saturation':100},{'gamma':0.35},{'lightness':20}]},{'featureType':'poi.business','elementType':'geometry.fill','stylers':[{'saturation':-100},{'gamma':0.35}]},{'featureType':'poi.business','elementType':'labels.text.stroke','stylers':[{'color':'#69ffff'}]},{'featureType':'poi.place_of_worship','elementType':'labels.text.stroke','stylers':[{'color':'#c3ffc3'}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function show(){
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: zip}, (results, status)=>{
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      let name = results[0].formatted_address;
      addMarker(lat, lng, name);
      let latLng = new google.maps.LatLng(lat, lng);
      map.setCenter(latLng);
      map.setZoom(5);
    });
  }

  function addMarker(lat, lng, name){
    let latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name});
  }

  function makeChart(){
    chart = AmCharts.makeChart('graph', {
    'type': 'serial',
    'theme': 'none',
    'pathToImages': 'http://www.amcharts.com/lib/3/images/',
    'legend': {
        'useGraphSettings': true
    },
    'dataProvider': [],
    'valueAxes': [{
        'id':'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#FF6600',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left'
    }],
    'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#FF6600',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'High Temp',
        'valueField': 'high',
        'fillAlphas': 0
    }, {
        'valueAxis': 'v1',
        'lineColor': '#B0DE09',
        'bullet': 'triangleUp',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'Low Temp',
        'valueField': 'low',
        'fillAlphas': 0
    }],
    'chartCursor': {
        'cursorPosition': 'mouse'
    },
    'categoryField': 'date',
    'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true
    }
    });
  }
})();
