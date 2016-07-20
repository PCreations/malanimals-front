import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './configureStore'
import App from './containers/App'
import rootSaga from './sagas'

const Root = () => (
    <div>
        <App/>
    </div>
)

const store = configureStore()
store.runSaga(rootSaga)

ReactDOM.render(<Provider store={store}><Root/></Provider>, document.getElementById('app'))
