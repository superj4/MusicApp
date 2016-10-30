function fillContent(data) {

  const list = [];
    for(var i=0; i<data.length; i++){
      for(var j=0; j<data[i].artists.length; j++){
        var key=data[i].artists[j].id;
        list.push(musicians[key]);
      }
    }

    const listItems = list.map((listItem, index) =>
      <li className="list-group-item">
        <div className = "list-group-item-heading">{listItem.name}</div>
        <div style={{backgroundImage: 'url('+listItem.images[0].url+')'}} className="covers col-sm-12 col-md-12 list-group-item-text">
            <div className="play_control">
            <img src="resources/play.png" className="cover col-sm-12 col-md-12 center-block" id={listItem.id} onClick={preview} />
            </div>
        </div>
      </li>
     );
   
const element = (  
  <div className="panel panel-default">
    <div className="panel-heading">
      <h4 className="panel-title">
        <a data-toggle="collapse" href="#artist_panel">
          <i className="fa fa-list-alt" />
          Artist List
        </a>
      </h4>
    </div>
    <div id="artist_list" className="panel">
      <div className="panel-body">
        <ul className="list-group scrollable">{listItems}</ul>
      </div>
    </div>
  </div>
);

  ReactDOM.render(
    element,
    document.getElementById('artist_panel')
  );
}