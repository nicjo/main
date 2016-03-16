import React from "react";
import {Link} from "react-router"
import request from "superagent";


export default React.createClass ({
  getInitialState: function() {
    return {
      pathData: []
    }
  },
  componentDidMount: function() {
    request.get('/paths')
    .end((err, response) => {
      this.setState({
        pathData: response.body
      })
    });
  },
  render: function() {
    return (
      <div>
        <h1>BredCrumbz List</h1>
        <ul className="path-list">
          {this.state.pathData.map(item => (
              <li key={item.id} className="listItem"><Link to={`/view/${item.id}`}><button className="itemButton">{item.title}</button></Link></li>
            ))}
        </ul>
      </div>
      );
  }
})