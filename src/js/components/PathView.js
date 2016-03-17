//dependencies
import React from "react";
import {Link} from "react-router";
import request from "superagent";
import {
  GoogleMapLoader, GoogleMap, Marker
}
from "react-google-maps";
import styles from '../styles';

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
        
        // response.body.points.forEach(function(point) {
        //   point.lat = point.latitude;
        //   point.lng = point.longitude;
        // console.log(response.body)
        this.setState({
          path: response.body
        });
        
      // });
      
    });
    },
    
   fitBounds: function(){
     if (!this._googleMapComponent || this.state.started) {
       return;
     }
     
    var bounds = new google.maps.LatLngBounds();
    this.state.path.points.forEach(
      function(point) {
        bounds.extend(new google.maps.LatLng(point.latitude, point.longitude));
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
    var txt = this.state.path.points[e].message;
      if (txt !==  null){
      // console.log('Oh, Hello');
      this.refs.container.info(
      txt,
      "",
      {
        timeOut: 5000
      });
    }
  },
  

  //this will 'start' the map by centering on the first marker and changing its colour
  handleStartButton: function(e) {
    console.log(this.state.path.points[0])
    this._googleMapComponent.panTo({
        lat: this.state.path.points[0].latitude,
        lng: this.state.path.points[0].longitude
      });
    this.setState({
      started: true,
      current: 0,
      zoom: 20
    });
  },
  
  // handleHomeBut: function() {
  //   return <Link to="/"></Link>
  // },
  
    //this will 'start' the map by centering on the first marker and changing its colour
  handleNextButton: function(e) {
    
    if (this.state.current === this.state.path.points.length - 1) {
      // alert("You finished the path!");
      
      this.refs.container.success(
      "You made it to the end!",
      "Congrats!",
      {
        timeOut: 5000
      });
      this.setState({
        started: false,
        current: undefined
      });
    } else {
      this._googleMapComponent.panTo({
        lat: this.state.path.points[this.state.current + 1].latitude,
        lng: this.state.path.points[this.state.current + 1].longitude
      });
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

    var defaultImage = '/images/puffin-marker_44x64_default.png';
    var infoImage = '/images/puffin-marker_44x64_info3.png';
    var visitedImage = '/images/puffin-marker_44x64_visited.png';

      return (
        <div className="map_div" >
            <div className="viewTitleDiv">
              <h1>{this.state.path.title}</h1>
              {/*<Link to="/"><button className="homeBut" alt="Home!" ><i className="fa fa-home"></i></button></Link>*/}
            </div>
            <section className="map">
                <GoogleMapLoader
                  containerElement={
                    <div
                      {...this.props}
                      style={{
                        height: `100vh`
                      }}
                    />
                  }
                  
                  googleMapElement={
                    <GoogleMap
                      ref={(map) => {this._googleMapComponent = map; this.fitBounds(); }}
                      zoom={zoom}
                      defaultOptions={{
                        styles: styles,
                      }}
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
                            position={{ lat: soloMarker.latitude, lng: soloMarker.longitude }}
                            title={i.toString()}
                            icon={(isFinite(this.state.current) ? this.state.current : -1) >= i ? visitedImage : soloMarker.message ? infoImage : defaultImage}
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
              <Link className="homeLink" to="/"><button className="homeBut" alt="Home!" ><i className="fa fa-home"></i></button></Link>
            </div>
            
        </div>
    );
  }  
})