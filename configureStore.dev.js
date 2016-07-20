import { createStore, applyMiddleware, compose } from 'redux'
import { persistState } from 'redux-devtools'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import DevTools from './containers/DevTools'
import reducer from './reducers'
import sagaMonitor from './sagaMonitor'

export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware({ sagaMonitor })

    const store = createStore(
        reducer,
        initialState,
        compose(
            applyMiddleware(
                sagaMiddleware,
            ),
            DevTools.instrument(),
            persistState(
                window.location.href.match(
                  /[?&]debug_session=([^&#]+)\b/
                )
            )
        )
    )

    store.runSaga = sagaMiddleware.run
    return store
}