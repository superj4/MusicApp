"use strict";

function fillContent(data) {

  var list = [];
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].artists.length; j++) {
      var key = data[i].artists[j].id;
      list.push(musicians[key]);
    }
  }

  var listItems = list.map(function (listItem, index) {
    return React.createElement(
      "li",
      { className: "list-group-item" },
      React.createElement(
        "div",
        { className: "list-group-item-heading" },
        listItem.name
      ),
      React.createElement(
        "div",
        { style: { backgroundImage: 'url(' + listItem.images[0].url + ')' }, className: "covers col-sm-12 col-md-12 list-group-item-text" },
        React.createElement(
          "div",
          { className: "play_control" },
          React.createElement("img", { src: "resources/play.png", className: "cover col-sm-12 col-md-12 center-block", id: listItem.id, onClick: preview })
        )
      )
    );
  });

  var element = React.createElement(
    "div",
    { className: "panel panel-default" },
    React.createElement(
      "div",
      { className: "panel-heading" },
      React.createElement(
        "h4",
        { className: "panel-title" },
        React.createElement(
          "a",
          { "data-toggle": "collapse", href: "#artist_panel" },
          React.createElement("i", { className: "fa fa-list-alt" }),
          "Artist List"
        )
      )
    ),
    React.createElement(
      "div",
      { id: "artist_list", className: "panel" },
      React.createElement(
        "div",
        { className: "panel-body" },
        React.createElement(
          "ul",
          { className: "list-group scrollable" },
          listItems
        )
      )
    )
  );

  ReactDOM.render(element, document.getElementById('artist_panel'));
}

