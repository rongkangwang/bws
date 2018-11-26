import React from "react"
import ReactDom from "react-dom"
import {Route, Switch, Redirect, BrowserRouter,withRouter, Link} from 'react-router-dom';
import MainPage from "./page/MainPage"
import HomePage from "./page/HomePage"

class App extends React.Component{
	render(){
		return (
			<BrowserRouter>
				<Switch>
  					<Route exact path='/' component={HomePage}/>
                    <Route path='/main' component={MainPage}/>
  					<Redirect to="/" />
				</Switch>
			</BrowserRouter>
		);
	}
}
ReactDom.render(<App/>,document.getElementById("app"));

