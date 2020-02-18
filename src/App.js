import React from 'react';
import Routes from './routers';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store/store'

function App() {
  return (
  	<Provider store={store}>
	    <BrowserRouter>
			  <Routes />
	    </BrowserRouter>
	  </Provider>
  )
}

export default App;