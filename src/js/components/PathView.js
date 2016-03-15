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
        });
        
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
  
  
  
  //this will 'start' the map by centering on the first marker and changing its colour
  handleStartButton: function(e) {
    console.log(this.state.path.points[0])
    this._googleMapComponent.panTo(this.state.path.points[0]);
    this.setState({
      started: true,
      current: 0,
      zoom: 20
    });
    // this.setState({
    //   center: this.state.path.points[0],
    //   zoom: 20,
    //   started: true,
    //   current: 0
      
    // })
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
      // console.log(this.__proto__)
      // console.log(this.refs.map)
      
      var content = this.state.content
      
    let { id } = this.props.params;

    var zoom = this.state.zoom;
    
    var center = this.state.center;



    // var image = (this.state.path.points[i] <= this.state.current ? 'https://bredcrumbz-nicjo.c9users.io/images/bread-cat-72px.png' : 'https://bredcrumbz-nicjo.c9users.io/images/NyanCat.gif');
    var image = '/images/bread-cat-72px.png';
    var image2 = '/images/NyanCat.gif';

    // var image2 = for (var i in this.state.path.points) {
    //                   if (this.state.path.points[i] <= this.state.current) {
    //                             return 'https://bredcrumbz-nicjo.c9users.io/images/bread-cat-72px.png'} 
    //                               else {return }
    // }
    
    
    // style={{height: "100vh"}}
// document.getElementById('body').clientHeight + 'px'

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
                      // onClick={this.handleClick}
                      ref={(map) => {this._googleMapComponent = map; this.fitBounds(); }}
                      zoom={zoom}
                      onBoundsChanged={this.handleBoundsChanged}
                      >
                      
                      {
                        this.state.path.points.map((soloMarker, i) => (
                          <Marker
                            key={i}
                            position={{ lat: soloMarker.lat, lng: soloMarker.lng }}
                            title={`Position: ` + i}
                            icon={(isFinite(this.state.current) ? this.state.current : -1) >= i ? image2 : image}
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