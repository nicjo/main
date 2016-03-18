var title = 'untitled';
var bcrumbs = [];

var PlotMap = React.createClass({
  getInitialState: function() {
    return {
      crumbs: [{
        position: {
          lat: 25.0112183,
          lng: 121.5206757000001,
        },
        key: `Montreal`,
        defaultAnimation: 2,
      }]
    };
  },

  componentDidMount: function() {
    if (!canUseDOM) {
      return;
    }
    window.addEventListener(`resize`, this.handleWindowResize);
  },
  componentWillUnmount: function() {
    if (!canUseDOM) {
      return;
    }
    window.removeEventListener('resize', this.handleWindowResize);
  },

  handleMapClick: function(e) {
    let {
      crumbs
    } = this.state;
    crumbs = update(crumbs, {
      $push: [{
        position: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        },
        key: Date.now()
      }, ],
    });
    this.setState({
      crumbs
    });
    bcrumbs = crumbs;
    /*if (crumbs.length === 3) {
      this.props.toast(
        `Right click on the crumb to remove it`,
        `Also check the code!`
      );
    }*/
  },
  handleCrumbRightclick: function(i, e) {
    let {
      crumbs
    } = this.state;
    crumbs = update(crumbs, {
      $splice: [
        [i, 1],
      ],
    });
    this.setState({
      crumbs
    });
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
            defaultZoom={16}
            defaultCenter={{ lat: 45.5088400, lng: -73.5878100 }}
            onClick={this.handleMapClick}
            
          >
            {this.state.crumbs.map((crumb, index) => {
              return (
                <Marker
                  {...crumb}
                  onRightclick={this.handleCrumbRightclick.bind(this, index)}
                />
              );
            })}
          </GoogleMap>
      }
      />
    );
  }
});

var Title = React.createClass({
  getInitialState: function() {
   return {title: 'untitled'}
  },
  handleKey: function(e) {
    var formtitle = 'untitled'
    if (e.target.value.length>0) {
      formtitle=e.target.value
    };
    this.setState({title: formtitle});
    this.forceUpdate();
    title = formtitle;
  },
  
  render: function() {
    var formtitle = this.state.title;
    return (
      <form action="create">
        <p>{formtitle}</p>
        <input onKeyUp={this.handleKey} type="text" name="pathTitle" ref= "title" placeholder="Name your path"/>
      </form>
    );
  }
});

var Create = React.createClass({

  handleClick: function(e) {
    e.preventDefault()
    var path = {
      title: title,
      points: bcrumbs
    }
    console.log(path);
    title = 'untitled';
    bcrumbs = [];
    browserHistory.push("/list");

  },

  render: function() {
    return (
      <button onClick={this.handleClick}>Create</button>
    );
  }
});


var Geolocation = React.createClass({

      getInitialState: function() {
        return {
          center: null,
          content: null,
          radius: 6000,
          crumbs: [],
        }
      },

      addCrumb: function(crumb) {
        var crumbs = this.state.crumbs;
        crumbs.push(crumb);
        this.forceUpdate();

      },

      /*touchMap: function(e) {
        
      },*/

      componentDidMount: function() {
        geolocation.getCurrentPosition((position) => {
          this.setState({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            content: `Location found using HTML5.`,
          });

          const tick = () => {
            this.setState({
              radius: Math.max(this.state.radius - 20, 0)
            });

            if (this.state.radius > 100) {
              raf(tick);
            }
          };
          raf(tick);
        }, (reason) => {
          this.setState({
            center: {
              lat: 60,
              lng: 105,
            },
            content: `Error: The Geolocation service failed (${ reason }).`,
          });
        });
      },
      render: function() {

        const {
          center, content, radius
        } = this.state;
        let contents = [];

        if (center) {
          contents = contents.concat([
              (<InfoWindow key="info" position={center} content={content} />), ( < Circle key = "circle"
                center = {
                  center
                }
                radius = {
                  radius
                }
                options = {
                  {
                    fillColor: `red`,
                    fillOpacity: 0.20,
                    strokeColor: `red`,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                  }
                }
                />),
              ]);
          }

          return ( < GoogleMap containerProps = {
              {
                ...this.props, //requires stage-2 preset
                  style: {
                    height: `100vh`,
                  },
              }
            }
            defaultZoom = {
              17
            }
            center = {
              center
            }
            onClick = {
              this.addCrumb
            } > {
              contents
            } < /GoogleMap>
          );
        }
      });

var SimpleMap = React.createClass({

  render: function() {
    // var that = this;
    return (
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
      
        ref={(map) => console.log(map)}
        defaultZoom={12}
        defaultCenter={{lat: 45.5088400, lng: -73.5878100}}
        // onClick={::this.handleMapClick}>
        >
        
        {/*{that.state.crumbs.map((crumb, index) => {
          return (
            <Marker
              {...crumb}
              onRightclick={that.handleCrumbRightclick.bind(that, index)} />
          );
        })}*/}
      </GoogleMap>
    }
  />
</section>
    );
  }
});

