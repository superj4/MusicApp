"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Genres = function (_React$Component) {
  _inherits(Genres, _React$Component);

  function Genres() {
    _classCallCheck(this, Genres);

    var _this = _possibleConstructorReturn(this, (Genres.__proto__ || Object.getPrototypeOf(Genres)).call(this));

    _this.state = { data: [] };
    return _this;
  }

  _createClass(Genres, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: function (data) {
          this.setState({ data: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  }, {
    key: "getList",
    value: function getList() {
      var list = this.state.data;

      var listItems = list.map(function (listItem, index) {
        return React.createElement(
          "option",
          { key: index, value: listItem },
          listItem
        );
      });
      return React.createElement(
        "div",
        { id: "dropdown", className: "navbar-form" },
        React.createElement(
          "select",
          { id: "select", className: "form-control text-uppercase" },
          React.createElement(
            "option",
            { value: "all" },
            "ALL"
          ),
          listItems
        )
      );
    }
  }, {
    key: "render",
    value: function render() {
      return this.getList();
    }
  }]);

  return Genres;
}(React.Component);

var genre_list = React.createElement(Genres, { url: "/genres" });

ReactDOM.render(genre_list, document.getElementById('select_genre'));

