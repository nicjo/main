//dependencies
import React from "react";
import {Link} from "react-router";
import request from "superagent";
import {
  GoogleMapLoader, GoogleMap, Marker
}
from "react-google-maps";

//our variables
import geolocation from '../geolocation'; 

var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr; // This is a React Element.
// For Non ES6...
// var ToastContainer = ReactToastr.ToastContainer;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

export default React.createClass({
    getInitialState: function(){
      var centerLat = (45.5);
      var centerLng = (-73.5);
      return {
        markers: [],
        zoom: 16,
        center: {lat: centerLat, lng: centerLng}
      }
    },
// this gets the data for a specific path based on the ID which is passed through the query string (params)
    componentWillMount: function(){
      var id = this.props.params.id;
      
      request.get('/paths/' + id)
      .end((err, response) => {
        
        response.body.points.forEach(function(point) {
          point.lat = point.latitude;
          point.lng = point.longitude;
          
          if (Math.floor(Math.random() * 10) < 5) {
              point.text = "this is exactly where it's supposed to be!"
          }
        });
        console.log(response.body.points)
        
        this.setState({
          path: response.body
        });
        
      });
      
    },
    
   fitBounds: function(){
     if (!this._googleMapComponent || this.state.started) {
       return;
     }
     
    var bounds = new google.maps.LatLngBounds();
    this.state.path.points.forEach(
      function(point) {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
      }
    );
    this._googleMapComponent.fitBounds(bounds);
  },
  
  //this will be the button that geo-locates a user
  handleLocateButton: function() {
    geolocation.getCurrentPosition((position) => {
      this._googleMapComponent.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, (reason) => {
        content: `Error: The Geolocation service failed (${ reason }).`
      });
  },
  
  
  // this will send an alert when clicked, only if the marker contains text
  handleMarkerClick: function(e) {
    console.log()
    var txt = this.state.path.points[e].text;
      if (txt !==  undefined){
      console.log('Oh, Hello');
      this.refs.container.success(
      txt,
      "Apparently this need 2 values " + Date.now(),
      {
      timeOut: 3000,
      extendedTimeOut: 1000,
    });
    }
  },
  

  //this will 'start' the map by centering on the first marker and changing its colour
  handleStartButton: function(e) {
    console.log(this.state.path.points[0])
    this._googleMapComponent.panTo(this.state.path.points[0]);
    this.setState({
      started: true,
      current: 0,
      zoom: 20
    });
  },
  
    //this will 'start' the map by centering on the first marker and changing its colour
  handleNextButton: function(e) {
    
    if (this.state.current === this.state.path.points.length - 1) {
      alert("You finished the path!");
      this.setState({
        started: false,
        current: undefined
      });
    } else {
      this._googleMapComponent.panTo(this.state.path.points[this.state.current + 1]);
    this.setState({
      zoom: 20,
      current: this.state.current + 1
    })
    }
  },
  
  
    render: function() {
      
      if (!this.state.path) {
        return <div>loading</div>;
      }
      
    var content = this.state.content
      
    let { id } = this.props.params;

    var zoom = this.state.zoom;
    
    var center = this.state.center;

    var image = '/images/puffin-marker.png';
    var image2 = '/images/NyanCat.gif';
    var image3 = '/images/bread-cat-72px.png';



      return (
        <div className="map_div" >
            <div className="titleDiv">
              <h1>{this.state.path.title}</h1>
            </div>
            <section className="map">
                <GoogleMapLoader
                  containerElement={
                    <div
                      {...this.props}
                      style={{
                        height: `100vh`,
                      }}
                    />
                  }
                  
                  googleMapElement={
                    <GoogleMap
                      ref={(map) => {this._googleMapComponent = map; this.fitBounds(); }}
                      zoom={zoom}
                      >
                      <ToastContainer ref="container"
                        toastMessageFactory={ToastMessageFactory}
                        className="toast-top-right"
                        onClick={this.handleOnClick}
                        tapToDismiss={true}
                        />
                      {
                        this.state.path.points.map((soloMarker, i) => (
                          <Marker
                            onClick={this.handleMarkerClick.bind(this, i)}
                            key={i}
                            position={{ lat: soloMarker.lat, lng: soloMarker.lng }}
                            title={i.toString()}
                            icon={(isFinite(this.state.current) ? this.state.current : -1) >= i ? image2 : soloMarker.text ? image3 : image}
                          />
                        ))
                      }
                    </GoogleMap>
                  }
                />
                </section>
            
            <div id="buttonsDiv">
              <button className="locate" onClick={this.handleLocateButton} alt="Locate Me!"><i className="fa fa-location-arrow"></i></button>
              {this.state.started ? <button className="nextButton" onClick={this.handleNextButton}>Next!</button>  : <button className="startButton" onClick={this.handleStartButton}>Start!</button>}
            </div>
            
        </div>
    );
  }  
})