import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Perf from 'react-addons-perf'
window.Perf = Perf

import DevTools from './containers/DevTools'
import App from './containers/App'
import configureStore from './configureStore'
import rootSaga from './sagas'


const Root = () => (
    <div>
        <App/>
        <DevTools />
    </div>
)

const store = configureStore()
store.runSaga(rootSaga)

ReactDOM.render(<Provider store={store}><Root/></Provider>, document.getElementById('app'))
