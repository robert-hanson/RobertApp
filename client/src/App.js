import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  state = {
    data: null
  };

  componentDidMount(){
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({data: res.express}))
      .catch(err => console.error(err));
  };

  callBackendAPI = async() => {
    debugger;
    const response = await fetch('/react/backend-test');
    console.log('response: ' + response);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {/* Render the newly fetched data inside of this.state.data */}
        <p className="App-intro">{this.state.data}</p>
      </div>
      );
  };
}








// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
