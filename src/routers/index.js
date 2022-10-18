import React from 'react'
import { Route, Redirect, withRouter, Switch} from 'react-router-dom'

import { connect } from 'react-redux';

import Index from '../pages/index'
import Submit from '../pages/submit'
import SubmitArrange from '../pages/submitArrange'
import Signin from '../commonComponents/signin'
import Logon from '../commonComponents/logon'
import Photos from '../commonComponents/photos'
import EditInit from '../commonComponents/editinit'
import Story from '../commonComponents/story'
import PhotosInput from '../commonComponents/photosInput'
import PhotosEdit from '../commonComponents/photosEdit'
import TotalStorys from '../commonComponents/totalStorys'
import TotalTrips from '../commonComponents/totalTrips'
import Client from '../commonComponents/client'
import Edit from '../commonComponents/edit'

const RouteController = ({user, path, component: Component, ...rest}) => {
	//console.log(user,path)
	return(
		<Route 
			{...rest}
			render = {
				(props) =>  (user ? <Component {...props} /> : <Redirect to="/signin" />)
			}
		/>
	)
}

const EditController = ({trip, component: Component, ...rest}) => {
	//console.log({...rest})
	return(
		<Route 
			{...rest}
			render = {
				(props) =>  (props.location.params || trip ? <Component {...props} /> : <Redirect to="/editinit" />)
			}
		/>
	)
}

const InjectedRoute = withRouter(connect(function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(RouteController))

const InjectedEditRoute = withRouter(connect(function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(EditController))

export default () => 
	<Switch>
		<InjectedRoute path='/' component ={Index} exact key='main'/>,
		<InjectedRoute path='/submit' component ={Submit} exact key='submit'/>,
		<InjectedRoute path='/submitArrange' component ={SubmitArrange} exact key='submitArrange'/>,
		<Route path='/signin' component ={Signin} exact key='signin'/>,
		<Route path='/logon' component ={Logon} exact key='logon'/>,
		<Route path='/photos' component ={Photos} exact key='photos'/>,
		<InjectedRoute path='/photosInput' component ={PhotosInput} exact key='photosInput'/>,
		<InjectedRoute path='/photosEdit' component ={PhotosEdit} exact key='photosEdit'/>,
		<InjectedRoute path='/story' component ={Story} exact key='story'/>,
		<InjectedRoute path='/totalStorys' component ={TotalStorys} exact key='totalstorys'/>,
		<InjectedRoute path='/client' component ={Client} exact key='client'/>,
		<InjectedRoute path='/editinit' component ={EditInit} exact key='editinit'/>,
		<InjectedRoute path='/totalTrips' component ={TotalTrips} exact key='totalTrips'/>,
		<InjectedEditRoute path='/edit' component ={Edit} exact key='edit'/>,
		<Route path='*' exact key='404' render = {() => (<Redirect to="/signin" />)}/>,
	</Switch>
