"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player_panel = function (_React$Component) {
  _inherits(Player_panel, _React$Component);

  function Player_panel() {
    _classCallCheck(this, Player_panel);

    return _possibleConstructorReturn(this, (Player_panel.__proto__ || Object.getPrototypeOf(Player_panel)).apply(this, arguments));
  }

  _createClass(Player_panel, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "panel-heading" },
          React.createElement(
            "h4",
            { className: "panel-title" },
            React.createElement(
              "a",
              { "data-toggle": "collapse" },
              React.createElement("i", { className: "fa fa-list-alt" }),
              "Music Player"
            ),
            React.createElement(
              "span",
              { className: "pull-right slide-submenu" },
              React.createElement("i", { className: "fa fa-chevron-left" })
            )
          )
        ),
        React.createElement(
          "div",
          { id: "layers", className: "panel-collapse collapse in" },
          React.createElement(
            "div",
            { className: "panel-body list-group" },
            React.createElement(
              "div",
              { id: "player" },
              "player"
            ),
            React.createElement(
              "div",
              { id: "login" },
              "login"
            )
          )
        )
      );
    }
  }]);

  return Player_panel;
}(React.Component);

ReactDOM.render(React.createElement(Player_panel, null), document.getElementById('player_panel'));

