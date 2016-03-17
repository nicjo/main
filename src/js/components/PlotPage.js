//dependencies

import EventEmitter from '../event-emitter';

import React from "react";
import {browserHistory} from "react-router";
import request from "superagent";

import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

//Child Components
import PlotMap from "./PlotMap";

import {CreateMenu} from "./CrumbMenu"

export default React.createClass({

  getInitialState: function() {
   return {
     title: 'untitled',
     crumbs: [],
     center: {},
   }
  },
  componentDidMount: function() {
    EventEmitter.subscribe('deleteCrumb', this.deleteCrumb);
    EventEmitter.subscribe('addMessage', this.addMessage);
  },
  deleteCrumb: function(index) {
    console.log('delete', index);
    this.state.crumbs.splice(index, 1);
    this.forceUpdate();
  },
  addMessage: function(index) {
    console.log('addText', index);
    var currentMessage = this.state.crumbs[index].txt || "Watch out for the trap door beneath you!";
    var message = prompt("Leave a secret instruction", currentMessage);
    this.state.crumbs[index].txt = message;
    this.forceUpdate();
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
       } 
       browserHistory.push("/list");  
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
  ___JUSTTOHAVECODEAVAILABLE: function() {
    
   // console.log(this.refs.createMenu)
    //console.log(this.refs.createMenu.refs.edit);
   // this.refs.createMenu.showMenu().bind(this.refs.createMenu);
    /*var currentMessage = this.state.crumbs[i].txt || "Watch out for the trap door beneath you!";
    var message = prompt("Leave a secret instruction", currentMessage);
    //going to give a context menu with var crumbs (delete) + add a note var message = prompt("Leave a secret instruction", "Watch out for the trap door beneath you!");-> message:message
    //by setting state for menu display:false > true?
    this.state.crumbs[i].txt = message;
    this.forceUpdate();*/
    // var crumbs = this.state.crumbs;
  
    // crumbs.splice(i,1);
    // this.setState({crumbs:crumbs, message: message});
    // console.log(this.state);
    // let {
    //   crumbs
    // } = this.state;
    // crumbs = update(crumbs, {
    //   $splice: [
    //     [i, 1],
    //   ],
    // });
    // this.setState({
    //   crumbs
    // });
    //state to dislay the menu
  },

  render: function() {
    return (
      <div className="plotPage">
        <CreateMenu ref="createMenu"/>
        <form action="create">
          <input className= "titleInput" onKeyUp={this.handleKey} type="text" name="pathTitle" ref= "title" placeholder="Name your path"/>
        </form>
       <PlotMap className= "map" center={this.state.center} crumbs={this.state.crumbs} onClick= {this.handleMapClick} />
       <button className="create" onClick={this.handleClick}>Leave a trail</button>
     </div>
    )
  }
});





