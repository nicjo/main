var React = require('react');
var ReactDOM = require('react-dom');
var Component = React.Component;

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

// Placeholder data for user generated paths. they include a title + the coordinates for each marker/crumb
var pathData = [
    {
      id: 0,
      title: "First Map",
      points: [
        {lat: 45.5034125, lng: -73.5694394},
        {lat: 45.5034501, lng: -73.5695359},
        {lat: 45.5028636, lng: -73.5701233},
        {lat: 45.5032283, lng: -73.5708851},
        {lat: 45.5028786, lng: -73.5713142},
        {lat: 45.5029012, lng: -73.5714215},
        {lat: 45.5025402, lng: -73.5717890},
        {lat: 45.5025647, lng: -73.5718238}
      ]
    },
    {
      id: 1,
      title: "Sweet MTL map",
      points: [
        {lat: 45.4952833, lng: -73.5698068},
        {lat: 45.4955240, lng: -73.5694420},
        {lat: 45.4954225, lng: -73.5691470},
        {lat: 45.4961670, lng: -73.5681465},
        {lat: 45.4967611, lng: -73.5673955},
        {lat: 45.4974624, lng: -73.5687125},
        {lat: 45.4975940, lng: -73.5685301},
        {lat: 45.4978572, lng: -73.5672963},
        {lat: 45.4982859, lng: -73.5669529},
        {lat: 45.4984513, lng: -73.5669208},
        {lat: 45.4991206, lng: -73.5663199},
        {lat: 45.4993688, lng: -73.5666847},
        {lat: 45.5000756, lng: -73.5676074},
        {lat: 45.5004366, lng: -73.5683692},
        {lat: 45.5006171, lng: -73.5689056},
        {lat: 45.5007261, lng: -73.5690880},
        {lat: 45.5009385, lng: -73.5689244},
        {lat: 45.5012393, lng: -73.5694528},
        {lat: 45.5013446, lng: -73.5694286},
        {lat: 45.5015570, lng: -73.5697666},
        {lat: 45.5017601, lng: -73.5695815}
      ]
    },
    {
      id: 2,
      title: "Secret Party Location",
      points: [
        {lat: 45.4953341, lng: -73.5628062},
        {lat: 45.4940255, lng: -73.5593891},
        {lat: 45.4957553, lng: -73.5581070},
        {lat: 45.4955936, lng: -73.5576135}
      ]
    },
    {
      id: 3,
      title: "Tresure Trail ;)",
      points: [
        {lat: 45.4987371, lng: -73.5528338},
        {lat: 45.4963757, lng: -73.5530055},
        {lat: 45.4952777, lng: -73.5509777},
        {lat: 45.4910134, lng: -73.5515785},
        {lat: 45.4909006, lng: -73.5502696},
        {lat: 45.4905245, lng: -73.5501945},
        {lat: 45.4894565, lng: -73.5440576},
        {lat: 45.4930365, lng: -73.5450876},
        {lat: 45.5014518, lng: -73.5441864},
        {lat: 45.5013239, lng: -73.5428989},
        {lat: 45.5003313, lng: -73.5428560},
      ]
    },
    {
      id: 4,
      title: "Grandma's house",
      points: [
        {lat: 45.5226873, lng: -73.6017841},
        {lat: 45.5252655, lng: -73.5994291},
        {lat: 45.5232811, lng: -73.5950518},
        {lat: 45.5229541, lng: -73.5953414}
      ]
      },
      {
        id: 5,
        title: "Last Map",
        points: [
          {lat: 45.5055555, lng: -73.5},
      ]
      }
    ]
  
var PathList = React.createClass ({
  
  render: function(Data) {
    return (
      <div>
        <p>Derpington</p>
        <ul className="path-list">
          {pathData.map(item => (
              <li key={item.id} className="listItem"><Link to={`/view/${item.id}`}><button className="itemButton">{item.title}</button></Link></li>
            ))}
        </ul>
      </div>
      );
  }
})

// Component that renders the view for a selected path from the PathList component.
// At the time of this writting, it centers on the first latlng. 
var PathView = React.createClass({
    getInitialState: function(){
      var centerLat = (45.5);
      var centerLng = (73.5);
      return {
        markers: [],
        zoom: 16,
        center: {lat: centerLat, lng: centerLng}
      }
    },
// this gets the data for a specific path based on the ID which is passed through the query string (params)
    componentWillMount: function(){
      var id = this.props.params.id;
     var path = pathData.filter(function(point){
        if (point.id === Number(id)) {
          // console.log(point)
          return point
        }
      })[0]

      this.setState({
        path: path
      })
      
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
      // console.log(this.__proto__)
      // console.log(this.refs.map)
      
      var content = this.state.content
      
    let { id } = this.props.params;

    var zoom = this.state.zoom;
    
    var center = this.state.center;



    // var image = (this.state.path.points[i] <= this.state.current ? 'https://bredcrumbz-nicjo.c9users.io/images/bread-cat-72px.png' : 'https://bredcrumbz-nicjo.c9users.io/images/NyanCat.gif');
    var image = 'https://bredcrumbz-nicjo.c9users.io/images/bread-cat-72px.png';
    var image2 = 'https://bredcrumbz-nicjo.c9users.io/images/NyanCat.gif';

    // var image2 = for (var i in this.state.path.points) {
    //                   if (this.state.path.points[i] <= this.state.current) {
    //                             return 'https://bredcrumbz-nicjo.c9users.io/images/bread-cat-72px.png'} 
    //                               else {return }
    // }

      return (
        <div>
            <h1>{this.state.path.title}</h1>
            {this.state.started ? <button className="nextButton" onClick={this.handleNextButton}>Next!</button>  : <button className="startButton" onClick={this.handleStartButton}>Start!</button>}
            <button className="locate" onClick={this.handleLocateButton}>Find Me!</button>
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
                      // onClick={this.handleClick}
                      ref={(map) => {this._googleMapComponent = map; this.fitBounds(); }}
                      zoom={zoom}
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
            
        </div>
    );
  }  
})


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
})

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
