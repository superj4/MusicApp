class Player_panel extends React.Component{
  render(){
    return (<div>
        <div className="panel-heading">
          <h4 className="panel-title">
            <a data-toggle="collapse">
              <i className="fa fa-list-alt" />
              Music Player
            </a>
            <span className="pull-right slide-submenu">
              <i className="fa fa-chevron-left" />
            </span>
          </h4>
        </div>
        <div id="layers" className="panel-collapse collapse in">
          <div className="panel-body list-group">
            <div id="player">player</div>
            <div id="login">
              <a href="/login" id="spotify" type="button" className="btn btn-info">Login With Spotify</a>
            </div>
          </div>
        </div>
      </div>);
  }
}

ReactDOM.render(
  <Player_panel />,
  document.getElementById('player_panel')
);