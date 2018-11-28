import React from "react"
import ReactDom from "react-dom"
import {Route, Switch, Redirect, BrowserRouter,withRouter, Link} from 'react-router-dom';
import MainPage from "./page/MainPage"
import {LocaleProvider} from "antd"
import zh_CN from "antd/lib/locale-provider/zh_CN"

class App extends React.Component{
	render(){
		return (
			<BrowserRouter>
				<MainPage/>
			</BrowserRouter>
		);
	}
}
ReactDom.render(<LocaleProvider locale={zh_CN}><App/></LocaleProvider>,document.getElementById("app"));

