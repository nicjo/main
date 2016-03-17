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
      }]
    };
  },
  componentDidMount: function() {
    
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
    this.state.center = {
      lat: center.lat(),
      lng: center.lng()
    };
  },
  
  render: function() {
    var markerImage = new google.maps.MarkerImage('../images/puffin-marker_44x64_default.png',
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
                  icon= {markerImage}
                  onClick={() => EventEmitter.dispatch('markerClick', index)}
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
