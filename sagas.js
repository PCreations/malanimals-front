import { put, call, select, take, fork, actionChannel } from 'redux-saga/effects'
import { takeEvery, buffers } from 'redux-saga'
import uniqueid from 'lodash.uniqueid'

import * as api from './api'
import * as actions from './actions'
import * as types from './types'
import * as selectors from './selectors'
import { ANIMAL_STATE } from './reducers'


export function *fetchAll() {
    try {
        const animals = yield call(api.fetchAll)
        yield put(actions.receiveAll({ animals }))
    } catch(error) {
        yield put(actions.fetchAllFailed({ error }))
    }
}

export function *fetchAllWatcher() {
    while (true) {
        yield take(types.FETCH_ALL_ANIMALS_REQUESTED)
        const areAllAnimalsFetched = yield select(selectors.areAllAnimalsFetched)
        if (!areAllAnimalsFetched) {
            yield call(fetchAll)
        }
    }
}


export function *updateAnimal(id) {
    let animal = yield select(selectors.getAnimal, id)
    try {
        if (animal.state == ANIMAL_STATE.NEW) {
            animal = yield call(api.createAnimal, animal)
        }
        else {
            animal = yield call(api.updateAnimal, id, animal)
        }
        yield put(actions.receiveUpdated({ id, animal }))
    } catch(error) {
        yield put(actions.updateFailed({ id, error }))
    }
}

export function *updateAnimalWatcher() {
    while (true) {
        const { id } = yield take(types.UPDATE_ANIMAL_REQUESTED)
        yield call(updateAnimal, id)
    }
}


export function *createTemp() {
    const tempId = yield call(uniqueid, 'animal')
    yield put(actions.tempCreated({ tempId }))
}

export function *createTempWatcher() {
    yield call(takeEvery, types.CREATE_TEMP_ANIMAL_REQUESTED, createTemp)
}


export function *deleteFlow(id) {
    const isNew = yield select(selectors.isNew, id)
    if (isNew) {
        yield put(actions.deleteSuccess({ id }))
    } else {
        try {
            yield call(api.del, id)
            yield put(actions.deleteSuccess({ id }))
        } catch(error) {
            yield put(actions.deleteFailed({ id, error }))
        }
    }
}

export function *deleteWatcher() {
    while (true) {
        const { id } = yield take(types.ANIMAL_DELETION_REQUESTED)
        yield call(deleteFlow, id)
    }
}

export function *batchDelete() {
    const batchDeleteChan = yield actionChannel(types.BATCH_DELETE_REQUESTED)
    while (true) {
        yield take(batchDeleteChan)
        const toDeleteIds = yield select(selectors.getToDeleteIds)
        for (let id of toDeleteIds) {
            yield call(deleteFlow, id)
        }
    }
}

export default function *root() {
    yield [
        fork(fetchAllWatcher),
        fork(updateAnimalWatcher),
        fork(createTempWatcher),
        fork(deleteWatcher),
        fork(batchDelete),
    ]
}