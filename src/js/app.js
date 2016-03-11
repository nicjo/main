var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;

import {
  default as update
}
from "react-addons-update";
import {
  default as _
}
from "lodash";

import {
  GoogleMapLoader, GoogleMap, Marker, Circle, InfoWindow
}
from "react-google-maps";

import {
  default as canUseDOM,
}
from "can-use-dom";

import {
  default as raf
}
from "raf";

import {
  triggerEvent
}
from "react-google-maps/lib/utils";

var request = require('superagent');

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
        {/*<Navigation/>*/}
        {this.props.children}
      </main>
    );
  }
});



var PlotMap = React.createClass({
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
  
  // componentWillReceiveProps: function(props){
  //   this.setState({
  //     center: props.center
  //   })
  // },
  componentDidMount: function() {
    if (!canUseDOM) {
      return;
    }
    // window.addEventListener(`resize`, this.handleWindowResize);
    console.log("THIS BE PROPS")
      geolocation.getCurrentPosition((position) => {
      
      this.setState({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          })
          
    })
    
      
    
  },
  componentWillUnmount: function() {
    if (!canUseDOM) {
      return;
    }
    // window.removeEventListener('resize', this.handleWindowResize);
  },

  handleBoundsChanged: function() {
    var center = this._googleMapComponent.getCenter();
    this.state.center = {
      lat: center.lat(),
      lng: center.lng()
    };
  },
  render: function() {
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
            // onGeoUpdate={true}
            // autoUpdate= {false}
            onClick={this.props.onClick}
            onBoundsChanged={this.handleBoundsChanged}
            
          >
          
            {this.props.crumbs.map((crumb, index) => {
              return (
                <Marker
                  {...crumb}
                  animation= 'google.maps.Animation.DROP'
                  icon= '../icons/Bags_of_Breadcrumbs-icon.png'
                  onRightclick={this.props.onRightClick.bind(null, index)} //.bind(this, index) now passed to onRightclick call
                />
              );
            })}
          </GoogleMap>
      }
      />
    );
  }
});

var Home = React.createClass({

  render: function() {
    return (
      <div>
        <button><Link to="/create">Create a Path</Link></button>
        <button><Link to="/list">View Paths</Link></button>
        <img src="../icons/birdy.png"/>
      </div>
      
      )
  }
});
var PathList = React.createClass({

  render: function() {
    return <p>Path List</p>
  }
});
var PathView = React.createClass({

  render: function() {
    return <p>Path View</p>
  }
});

var PlotPage = React.createClass({
  // var title = 'untitled';
  // var bcrumbs = [];
  
  getInitialState: function() {
   return {
     title: 'untitled',
     bcrumbs: [],
     crumbs: [],
     center: {}
   }
  },
  handleKey: function(e) {
    var formtitle = 'untitled'
    if (e.target.value.length>0) {
      formtitle=e.target.value
    };
    this.setState({title: formtitle});
  },
  handleClick: function(e) {
    e.preventDefault()
    var path = {
      title: this.state.title,
      points: this.state.crumbs
    }
    console.log(path);
    request.post('/create')
        .send(path) //send back an object
        .end(function(err, res){
         
       if (err || !res.ok) {
         alert('Oh no! error');
       } else {
         alert('yay got ' + JSON.stringify(res.body));
       }
       browserHistory.push("/list");  /////////legit??
     });
    
    this.setState({
      crumbs: [],
      title: "untitled"
    })
  
    
    

  },
  handleMapClick: function(e) {
    // e.stopPropagation();
    
    if(e.latLng){
 
      let {crumbs} = this.state ///ES6 destructuring === var crumbs = this.state.crumbs
    //in ES5->
    crumbs.push({position: {lat: e.latLng.lat(), lng: e.latLng.lng()}, key: Date.now()})
    /*crumbs = update(crumbs, {
      $push: [{
        position: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        },
        key: Date.now()
      }, ],
    });*/
    
    // console.log(crumbs)
    
    // var center = {lat:this.state.crumbs[this.state.crumbs.length-1].position.lat, lng:this.state.crumbs[this.state.crumbs.length-1].position.lng}

    
    this.setState({
      crumbs: crumbs
    });
    // this.bcrumbs = {crumbs};
    /*if (crumbs.length === 3) {
      this.props.toast(
        `Right click on the crumb to remove it`,
        `Also check the code!`
      );
    }*/
    }
    
  },
  handleCrumbRightClick: function(i) {
    
    //console.log(i);
    
    var crumbs = this.state.crumbs;
    crumbs.splice(i,1);
    this.setState({crumbs:crumbs});
    /*let {
      crumbs
    } = this.state;*/
    /*crumbs = update(crumbs, {
      $splice: [
        [i, 1],
      ],
    });
    this.setState({
      crumbs
    });*/
  },
  render: function() {
    var formtitle = this.state.title;
    return (
      <div>
        <form action="create">
          <input className= "titleInput" onKeyUp={this.handleKey} type="text" name="pathTitle" ref= "title" placeholder="Name your path"/>
        </form>
       <PlotMap className= "map" center={this.state.center} crumbs={this.state.crumbs} onClick= {this.handleMapClick} onRightClick= {this.handleCrumbRightClick}/>
       <button onClick={this.handleClick}>Create</button>
     </div>
    )
  }
});

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
  <Route path="create" component={PlotPage}/>
  <Route path="list" component={PathList}/>
  <Route path="view/:id" component={PathView}/>
  <Route path="*" component={NotFound}/>
</Route>
</Router>
);
// If this line of code is not here, nothing gets displayed!
ReactDOM.render(routes, document.querySelector('#app'));
