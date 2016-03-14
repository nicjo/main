import React from "react";
import {Link} from "react-router";
export default React.createClass({

  render: function() {
    return (
      <div className="homePage">
        <div className="hPWhite">
          <div className="emptyHP"></div>
          <button className="homeButton"><Link to="/create">Create a Path</Link></button>
          <button className="homeButton"><Link to="/list">View Paths</Link></button>
          <div className="emptyHP"></div>
        </div>  
      </div>
      
      )
  }
})