//dependencies
import React from "react";
import {Link} from "react-router";
import request from "superagent";
import {
  GoogleMapLoader, GoogleMap, Marker
}
from "react-google-maps";

//our variables
import geolocation from '../geolocation' 

import styles from '../styles';

import EventEmitter from '../event-emitter';

/*var Main = React.createClass({
  render: function() {
    return (
      <a
        href="#"
        onTouchTap={this.handleTouchTap}
        onClick={this.handleClick}>
        Tap Me
      </a>
    );
  },
 
  handleClick: function(e) {
    console.log("click", e);
  },
 
  handleTouchTap: function(e) {
    console.log("touchTap", e);
  }
});
 
ReactDOM.render(<Main />, document.getElementById("container"));*/



export default React.createClass({
  getInitialState: function() {
    return {

      crumbs: [{
        position: {
          lat: 45.5088400,
          lng: -73.5878100,
        },
        key: `Montreal`,
        defaultAnimation: 1,
      }],
      clicked: false
    };
  },
  componentDidMount: function() {
      var that = this;
      EventEmitter.subscribe("hideMenu", function(){
        that.props.crumbs.forEach((crumb, i)=>{
          that.props.clickMarker(i, "false");
        })
      })
      EventEmitter.subscribe("dragged", function(){
        that.props.crumbs.forEach((crumb, i)=>{
          that.props.clickMarker(i, "false");
        })
      })
      geolocation.getCurrentPosition((position) => {
      
      this.setState({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          })
    })
  },
  
  handleBoundsChanged: function() {
    var center = this._googleMapComponent.getCenter();
    if (center) {
      this.state.center = {
        lat: center.lat(),
        lng: center.lng()
      };      
    }
  },
  
  menuMarker: function(i) {
    EventEmitter.dispatch('markerClick', i)
    this.props.clickMarker(i, "true");
  },
  
  onDragend: function(i, e) {
    //e is the gogle event
    //e has a function that gets you the lat and lng
    console.log(i, "INDEX")
    console.log(e, "EVENT")
    
    
    //This will get you the lat
    console.log('from event ' +e.latLng.lat())
    //This will get you the lng
   console.log('from event ' +e.latLng.lng())
   
   //Find a way to chnage thwe positiuion of the markes 
   
    EventEmitter.dispatch('dragged', {
      index:i, 
      position: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    }) 
    console.log('it emmits, i guess')
      //this.props.onDragend(index, e)
    
    
   
   // EventEmitter.dispatch('dragged', i, loc)
  },
  
  render: function(i) {
    var defaultImage = '/images/puffin-marker_44x64_default.png';
    var menuImage = '/images/puffin-marker_44x64_info3.png';
    var img = defaultImage;
  
    
    var defaultImage = new google.maps.MarkerImage(defaultImage,
                    new google.maps.Size(44, 64),
                    new google.maps.Point(0, 0));
                    
                      var menuImage = new google.maps.MarkerImage(menuImage,
                    new google.maps.Size(44, 64),
                    new google.maps.Point(0, 0));
                    
    return ( < GoogleMapLoader containerElement = { < div {...this.props
        }
        style = {
          {
            height: `100vh`,
          }
        }
        />
      }
      googleMapElement = {
        <GoogleMap
            
            ref={(map) => (this._googleMapComponent = map)}
            defaultZoom={20}
            center={this.state.center}
            //styles={{styles}}
            defaultOptions={{
          styles: styles,
        }}
            // onGeoUpdate={true}
            // autoUpdate= {false}
            onClick={this.props.onClick}
            onBoundsChanged={this.handleBoundsChanged}
          >
          
            {this.props.crumbs.map((crumb, index) => {
              return (
                <Marker
                  {...crumb}
                  //animation= {google.maps.Animation.DROP} * was making multiple markers drop (again)
                  draggable={true}
                  onDragend={this.onDragend.bind(this, index)}
                  icon= {crumb.clicked ? menuImage : defaultImage}
                  onClick={this.menuMarker.bind(this, index)}
                  size= {60,60}
                />
              );
            })}
          </GoogleMap>
      }
      />
    );
  }
});
