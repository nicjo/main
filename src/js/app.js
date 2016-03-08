var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;

import { default as update } from "react-addons-update";
import { default as _ } from "lodash";

import {GoogleMapLoader, GoogleMap, Marker, Circle, InfoWindow} from "react-google-maps";

import {
  default as canUseDOM,
} from "can-use-dom";

import { default as raf } from "raf";

import { triggerEvent } from "react-google-maps/lib/utils";

var geolocation = (
  canUseDOM && navigator.geolocation || {
    getCurrentPosition: (success, failure) => {
      failure(`Your browser doesn't support geolocation.`);
    },
  }
);

var Navigation = React.createClass({
  render: function() {
    return (
      <nav className="main-menu">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/create">Plot Map</Link>
          </li>
          <li>
            <Link to="/list">Path List</Link>
          </li>
          <li>
            <Link to="/view/:id">Choose Path</Link>
          </li>
          <li>FUTURE: near m/in use</li>
        </ul>
      </nav>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <main>
        <Navigation/>
        {this.props.children}
      </main>
    );
  }
});

var Geolocation = React.createClass ({

  getInitialState: function() {
    return {
    center: null,
    content: null,
    radius: 60,
    crumbs: [],
    }
  },
  
  addCrumb: function(crumb) {
    var crumbs = this.state.crumbs;
    crumbs.push(crumb);
    this.forceUpdate();
    
  },
  
  /*touchMap: function(e) {
    
  },*/
  
  componentDidMount: function() {
    geolocation.getCurrentPosition((position) => {
      this.setState({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        content: `Location found using HTML5.`,
      });

      const tick = () => {
        this.setState({ radius: Math.max(this.state.radius - 20, 0) });

        if (this.state.radius > 100) {
          raf(tick);
        }
      };
      raf(tick);
    }, (reason) => {
      this.setState({
        center: {
          lat: 60,
          lng: 105,
        },
        content: `Error: The Geolocation service failed (${ reason }).`,
      });
    });
  },
  render: function() {
    
    const { center, content, radius } = this.state;
    let contents = [];

    if (center) {
      contents = contents.concat([
        (<InfoWindow key="info" position={center} content={content} />),
        (<Circle key="circle" center={center} radius={radius} options={{
          fillColor: `red`,
          fillOpacity: 0.20,
          strokeColor: `red`,
          strokeOpacity: 1,
          strokeWeight: 1,
        }}
        />),
      ]);
    }

    return (
        <GoogleMap
          containerProps={{
            ...this.props,  //requires stage-2 preset
            style: {
              height: `100vh`,
            },
          }}
          defaultZoom={17}
          center={center}
          onClick={this.addCrumb}
        >
          {contents}
        </GoogleMap>
    );
  }
});

var SimpleMap = React.createClass({
  
  render: function() {
    // var that = this;
      return (
    <section style={{height: "100vh"}}>
      <GoogleMapLoader
        containerElement={
          <div
            {...this.props}
            style={{
              height: "100%",
            }}
          />
        }
        googleMapElement={
          <GoogleMap
          
            ref={(map) => console.log(map)}
            defaultZoom={12}
            defaultCenter={{lat: 45.5088400, lng: -73.5878100}}
            // onClick={::this.handleMapClick}>
            >
            
            {/*{that.state.markers.map((marker, index) => {
              return (
                <Marker
                  {...marker}
                  onRightclick={that.handleMarkerRightclick.bind(that, index)} />
              );
            })}*/}
          </GoogleMap>
        }
      />
    </section>
  );
  }  
  
})

var PlotMap = React.createClass({
    getInitialState: function() {
      return {
        markers: [{
      position: {
        lat: 25.0112183,
        lng: 121.52067570000001,
      },
      key: `Montreal`,
      defaultAnimation: 2,
    }]
    };
    },
    
  componentDidMount: function() {
    if (!canUseDOM) {
      return;
    }
    window.addEventListener(`resize`, this.handleWindowResize);
  },
  componentWillUnmount: function() {
    if (!canUseDOM) {
      return;
    }
    window.removeEventListener('resize', this.handleWindowResize);
  }, 
  
  handleMapClick: function(e) {
    let { markers } = this.state;
    markers = update(markers, {
      $push: [
        {
          position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
          key: Date.now()
        },
      ],
    });
    this.setState({ markers });
    
    /*if (markers.length === 3) {
      this.props.toast(
        `Right click on the marker to remove it`,
        `Also check the code!`
      );
    }*/
  },
  handleMarkerRightclick: function(i,e) {
    let { markers } = this.state;
    markers = update(markers, {
      $splice: [
        [i, 1],
      ],
    });
    this.setState({ markers });
  },
  render: function() {
    return (
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
            ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
            defaultZoom={3}
            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
            onClick={this.handleMapClick}
            
          >
            {this.state.markers.map((marker, index) => {
              return (
                <Marker
                  {...marker}
                  onRightclick={this.handleMarkerRightclick.bind(this, index)}
                />
              );
            })}
          </GoogleMap>
        }
      />
    );
  }
  
  
})

var Home = React.createClass({
  
  render: function() {
    return <p>HOME</p>
  }
})
var PathList = React.createClass({
  
  render: function() {
    return <p>Path List</p>
  }
})
var PathView = React.createClass({
  
  render: function() {
    return <p>Path View</p>
  }
  
  
})




// not found "page"
var NotFound = React.createClass({
  render: function() {
    return (
      <div>Not Found!</div>
    );
  }
});
/*
The routes. This section says:
  - If the route starts with /, load the App component
  - If the route IS /, load the Home component INSIDE App as this.props.children
  - If the route is /about, load the About component INSIDE App as this.props.children
  - If the route is /team, load the Team component INSIDE App as this.props.children
  - If the route is /about, load the About component INSIDE App as this.props.children
  - If the route is anything else, load the NotFound component INSIDE App as this.props.children
The whole process lets us create **complex, nested user interfaces** with minimal effort,
by simply nesting `Route` components.
*/
var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="create" component={PlotMap}/>
      <Route path="list" component={PathList}/>
      <Route path="view/:id" component={PathView}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);
// If this line of code is not here, nothing gets displayed!
ReactDOM.render(routes, document.querySelector('#app'));
