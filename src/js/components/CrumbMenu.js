import React from "react";
import ReactDOM from "react-dom";
import EventEmitter from '../event-emitter';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export const CreateMenu = React.createClass({
     
    
    componentDidMount(){
        
        var that = this;
        
        EventEmitter.subscribe("markerClick", function(index){
            that.showMenu(index)
        })
    },
    
    showMenu: function(index) {
        this.refs.edit.show(index);
    },

    render: function() {
        return (
        <div>
            <EditMenu ref="edit" alignment="left"/>
        </div>
        );
    }
});

export const EditMenu = React.createClass({
   getInitialState: function() {
        return {
            visible: false  
        };
    },


    show: function(index) {
    this.setState({ visible: true, index: index });
    var that = this;
    setTimeout(function() {
        document.addEventListener("click", that.hide);
    }, 0);
    },

    hide: function() {
        
        EventEmitter.dispatch("hideMenu");
        
        document.removeEventListener("click", this.hide);
        this.setState({ visible: false });
    },
    render: function() {
        return (
            <ReactCSSTransitionGroup transitionName="appear" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                {this.state.visible ?
                <div key="menu" className="menu">
                    <div className="top_menu">
                        <MenuItem onClick={() =>EventEmitter.dispatch('addMessage', this.state.index)}><i className="fa fa-exclamation-circle"></i> Add Hint</MenuItem>
                        <MenuItem onClick={() => EventEmitter.dispatch('deleteCrumb', this.state.index)}><i className="fa fa-trash"></i> Delete Crumb</MenuItem>
                        <MenuItem><i className="fa fa-times-circle"></i> Close Menu</MenuItem>
                    </div>
                </div> : null}
            </ReactCSSTransitionGroup>
        );
    }
});

export const MenuItem = React.createClass({
    navigate: function(hash) {
        window.location.hash = hash;
    },

    render: function() {
        return <div className="menuItem" onClick={this.props.onClick || function() {}}>{this.props.children}</div>;
    }
});


//other example >
/*import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";

//Component on which context-menu must be triggred
const MyComponent = ContextMenuLayer("crumbMenu")(
    React.createClass({
        render() {
            <div></div>
        }
    })
);*/

//The context-menu to be triggered
/*const MyContextMenu = React.createClass({
    render() {
        <ContextMenu identifier="crumbMenu" currentItem={this.currentItem}>
            <MenuItem data={"some_data"} onClick={this.handleClick}>
                ContextMenu Item 1
            </MenuItem>
            <MenuItem data={"some_data"} onClick={this.handleClickClick}>
                ContextMenu Item 2
            </MenuItem>
            <MenuItem divider />
            <MenuItem data={"some_data"} onClick={this.handleClickClick}>
                ContextMenu Item 3
            </MenuItem>
        </ContextMenu>
    },
    handleClick(e, data) {
        console.log(data);
    }
});*/