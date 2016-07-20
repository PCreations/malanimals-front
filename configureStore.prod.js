import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers'

export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware()

    const store = createStore(
        reducer,
        initialState,
        compose(
            applyMiddleware(
                sagaMiddleware,
            )
        )
    )

    store.runSaga = sagaMiddleware.run
    return store
}