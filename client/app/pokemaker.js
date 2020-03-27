let pokeRenderer;
let pokeForm;
let PokeFormClass;
let PokeListClass;

const handlePoke = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({ width: 'hide' }, 350);
  
  if($("#pokeName").val() == '' || $("#pokeLevel").val() == '' || $("#pokeDexNumber").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  sendAjax('POST', $("#pokeForm").attr("action"), $("#pokeForm").serialize(), function() {
    pokeRenderer.loadPokesFromServer();
  });
  
  return false;
};

const renderPoke = function() {
  return (
   <form id="pokeForm" 
      onSubmit={this.handleSubmit}
      name="pokeForm"
      action="/pokemaker"
      method="POST"
      className="pokeForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="pokeName" type="text" name="name" placeholder="Poke Name"/>
      <label htmlFor="level">Level: </label>
      <input id="pokeLevel" type="text" name="level" placeholder="Current Level"/>
      <label htmlFor="pokeDexNumber">Number (1-151): </label>
      <input id="pokeDexNumber" type="text" name="pokeDexNumber" placeholder="pokeDex # (1-151)"/>
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="makePokeSubmit" type="submit" value="Make Poke" />
    </form>  
  );
};


const renderPokeList = function() {
  if(this.state.data.length === 0) {
    return (
      <div className="pokeList">
        <h3 className="emptyPoke">No Pokes yet</h3>
      </div>
    );
  }
  
  const pokeNodes = this.state.data.map(function(poke) {
    return (
    <div key={poke._id} className="poke">
      <img src="/assets/img/pokeIcon.png" alt="pokeball" className="pokeFace" />
      <h3 className="pokeName"> Name: {poke.name} </h3>
      <h3 className="pokeLevel"> Level: {poke.level} </h3>
      <h3 className="pokeDexNumber"> PokeDex Number: {poke.pokeDexNumber} </h3>
    </div>
    );    
  });
  
  return (
    <div className="pokeList">
      {pokeNodes}
    </div>
  );
};

const setupPoke = function(csrf) {
  PokeFormClass = React.createClass({
    handleSubmit: handlePoke,
    render: renderPoke,
  });
    
  PokeListClass = React.createClass({
    loadPokesFromServer: function() {
      sendAjax('GET', '/getPokes', null, function(data) {
        this.setState({data:data.pokes});
      }.bind(this));
    },
    getInitialState: function() {
      return {data: []};
    },
    componentDidMount: function() {
      this.loadPokesFromServer();
    },
    render: renderPokeList
  });
  
  pokeForm = ReactDOM.render(
    <PokeFormClass csrf={csrf} />, document.querySelector("#makePoke")
  );
  
  pokeRenderer = ReactDOM.render(
    <PokeListClass />, document.querySelector("#pokes")
  );
};

const getTokenPoke = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupPoke(result.csrfToken);
  });
};

$(document).ready(function() {
  getTokenPoke();
});


























