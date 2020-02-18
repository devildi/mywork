import React from 'react'
import { Route, Redirect, withRouter} from 'react-router-dom'

import { connect } from 'react-redux';

import Index from '../pages/index'
import Submit from '../pages/submit'
import SubmitArrange from '../pages/submitArrange'
import Signin from '../commonComponents/signin'


const RouteController = ({user, component: Component, ...rest}) => {
	return(
		<Route 
			{...rest}
			render = {
				(props) =>  (user
					? <Component {...props} />
					: <Redirect to="/signin" />
				)
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

export default () => [
	<Route path='/' component = {Index} exact key='main'/>,
	<Route path='/submit' component = {Submit} exact key='submit'/>,
	<Route path='/submitArrange' component = {SubmitArrange} exact key='submitArrange'/>,
	<Route path='/signin' component = {Signin} exact key='signin'/>,
]