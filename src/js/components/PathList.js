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
      <div className="list_div">
      <div className="listTitleDiv">
        <h1>BredCrumbz List</h1>
        {/*<Link to="/"><button className="homeBut" alt="Home!" ><i className="fa fa-home"></i></button></Link>*/}
      </div>
      <section className="list">
        <ul className="path-list">
          {this.state.pathData.map(item => (
              <li key={item.id} className="listItem"><Link to={`/view/${item.id}`}><button className="itemButton">{item.title}</button></Link></li>
            ))}
        </ul>
        </section>
        <div id="buttonsDiv">
              <Link className="createLink" to="/create"><button className="createButton" >Create a Path!</button></Link>
              <Link className="homeLink" to="/"><button className="homeBut" alt="Home!" ><i className="fa fa-home"></i></button></Link>
        </div>
      </div>
      );
  }
})