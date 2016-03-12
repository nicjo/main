import React from "react";
import {Link} from "react-router";
export default React.createClass({

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