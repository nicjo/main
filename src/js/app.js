var React = require('react');
var ReactDOM = require('react-dom');
var Component = React.Component;

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;

import '../css/app.css'; 

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
  default as raf
}
from "raf";

import {
  triggerEvent
}
from "react-google-maps/lib/utils";

var request = require('superagent');

import geolocation from "./geolocation";

import PathList from "./components/PathList";

import PathView from "./components/PathView";

import PlotPage from "./components/PlotPage";

import Home from "./components/Home";

import NotFound from "./components/NotFound";



// Here we redefine the set() method.
// If it is called for map option, we hide the InfoWindow, if "noSuppress"  
// option is not true. As Google Maps does not know about this option,  
// its InfoWindows will not be opened.

var set = google.maps.InfoWindow.prototype.set;

google.maps.InfoWindow.prototype.set = function (key, val) {
    if (key === 'map' && ! this.get('noSupress')) {
        console.warn('This InfoWindow is supressed.');
        console.log('To enable it, set "noSupress" option to true.');
        return;
    }

    set.apply(this, arguments);
}

var App = React.createClass({
  render: function() {
    return (
      <main className="main">
        {/*<Navigation/>*/}
        {this.props.children}
      </main>
    );
  }
});
  
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