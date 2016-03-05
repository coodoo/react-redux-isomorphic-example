var React = require('react');

export default React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <div className="shop-wrap">
        <h2 className="uk-h2">{this.props.title}</h2>
        <div>{this.props.children}</div>
      </div>
    );
  }
});
