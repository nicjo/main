import React from "react";
import ReactDOM from "react-dom";

export const CreateMenu = React.createClass({
    
    componentDidMount(){
        
        var that = this;
        
        this.props.EventEmitter.subscribe("markerClick", function(index){
            that.showMenu(index)
        })
    },
    
    showMenu: function(index) {
        this.refs.edit.show();
    },

    render: function() {
        return (
        <div>
            <button onClick={this.showMenu}>Show Crumb Menu!</button> {/*will be marker*/}

            <EditMenu ref="edit" alignment="left">
                <MenuItem hash="addMessage">Add a hint</MenuItem>
                <MenuItem hash="deleteCrumb">Delete this crumb</MenuItem>
            </EditMenu>

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


    show: function() {
    this.setState({ visible: true });
    var that = this;
    setTimeout(function() {
        document.addEventListener("click", that.hide);
    }, 0);
    
    console.log(this,"THIS SHIT IS THE THIS")
    },

    hide: function() {
        document.removeEventListener("click", this.hide);
        this.setState({ visible: false });
    },
    render: function() {
        return <div className="menu">
            <div className={(this.state.visible === true ? "visible " : "")}>{this.props.children}</div>
        </div>;
    }
});

export const MenuItem = React.createClass({
    navigate: function(hash) {
        window.location.hash = hash;
    },

    render: function() {
        return <div className="menuItem" onClick={this.navigate.bind(this, this.props.hash)}>{this.props.children}</div>;
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