import React from 'react';
import Routes from './routers';
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux';
import store, { history } from './store/store'

function App() {
	//console.log('start')
	return (
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<Routes />
		</ConnectedRouter>
	</Provider>
	)
}

export default App;