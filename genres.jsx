class Genres extends React.Component {

	constructor(){
        super()
        this.state = {data: []};
    }

	componentDidMount() {
		$.ajax({
	      	url: this.props.url,
	      	dataType: 'json',
	      	cache: false,
      		success: function(data) {
        		this.setState({data: data});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
	}

	getList() {
		const list = this.state.data;


		const listItems = list.map((listItem, index) =>
    		<option key={index} value={listItem}>{listItem}</option>
 		 );
     return( 
        <div id="dropdown" className="navbar-form" >
        <select id="select" className="form-control text-uppercase">
          <option value="all">ALL</option>
          {listItems}       
        </select>
      </div>
      );
	}	

  render() {
  	return this.getList();
  }
}

const genre_list = <Genres url='/genres' />;

ReactDOM.render(
  genre_list,
  document.getElementById('select_genre')
);
