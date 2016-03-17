import React from "react";
import {Link} from "react-router";
export default React.createClass({

  render: function() {
    return (
      <div className="homePage">
        <div className="hPWhite">
          <div className="emptyHP">
          <img className="homeImage" src="/images/puffin-logo-300x251.png"/>
          </div>
            <div className="homeButtonsDiv">
              <Link to="/create"><button className="homeButton"><i className="fa fa-map-marker"></i> Create a Path</button></Link>
              <Link to="/list"><button className="homeButton"><i className="fa fa-list"></i> View Paths</button></Link>
            </div>
        </div>  
      </div>
      
      )
  }
})