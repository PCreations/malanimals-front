import { combineReducers } from 'redux'
import { OrderedMap, List, fromJS, Record } from 'immutable'
import * as types from './types'

export const ANIMAL_STATE = {
    NEW: 'new',
    SAVED: 'saved',
    NOT_SAVED: 'not_saved'
}

export const Animal = Record({
    id: '',
    name: '',
    state: ANIMAL_STATE.NEW,
    toDelete: false
})


const switcher = (cases, state, action) => {
    const { type, ...payload } = action
    if (action.hasOwnProperty('type') && typeof type === "undefined") {
        throw 'action type should not be undefined'
    }
    return cases.hasOwnProperty(type) ? cases[type](payload) : state
}


const allFetched = (_allFetched = false, action = {}) => switcher({

    [types.FETCH_ALL_ANIMALS_REQUESTED]: (payload) => false,

    [types.ALL_ANIMALS_RECEIVED]: (payload) => true,

}, _allFetched, action)


const error = (_error = '', action = {}) => switcher({

    [types.FETCH_ALL_ANIMALS_FAILED]: ({ error }) => error,

    [types.UPDATE_ANIMAL_FAILED]: ({ error }) => error,

    [types.ANIMAL_DELETION_FAILED]: ({ error }) => error

}, _error, action)


const animal = (_animal = new Animal(), action = {}) => switcher({

    [types.ANIMAL_REHYDRATED]: ({ name }) => (
        _animal
            .update('name', n => name)
            .update('state', (state) => (
                state == ANIMAL_STATE.NEW ? ANIMAL_STATE.NEW : ANIMAL_STATE.NOT_SAVED)
            )
    ),

    [types.ANIMAL_UPDATED]: ({ ['animal']: a }) => new Animal({
        ...a,
        state: ANIMAL_STATE.SAVED
    }),

    // resetting to "saved" `state` value here is
    // safe since this action is only triggered if
    // a deletion request failed thus indicating
    // this record exists on the server
    [types.ANIMAL_DELETION_FAILED]: (payload) => _animal.set('state', ANIMAL_STATE.SAVED),

    [types.ANIMAL_SET_TO_DELETE_FLAG]: ({ toDelete }) => _animal.set('toDelete', toDelete),

    [types.ANIMAL_SET_TO_DELETE_FLAG_ALL]: ({ toDelete }) => _animal.set('toDelete', toDelete)

}, _animal, action)


const animals = (_animals = OrderedMap(), action = {}) => switcher({

    [types.ALL_ANIMALS_RECEIVED]: ({ animals }) => {
        for (let a of animals) {
            _animals = _animals.set(String(a.id), new Animal({
                ...a,
                state: ANIMAL_STATE.SAVED
            }))
        }
        return _animals
    },

    [types.ANIMAL_REHYDRATED]: ({ id }) => _animals.update(
        String(id),
        a => animal(a, action)
    ),

    [types.ANIMAL_UPDATED]: ({ id, ['animal']: a }) => {
        if (String(id) != String(a.id)) {
            _animals = _animals
                .set(String(a.id), animal(_animals.get(String(a.id)), action))
                .remove(String(id))
        }
        else {
            _animals = _animals.update(
                String(id),
                a => animal(a, action)
            )
        }
        return _animals
    },

    [types.TEMP_ANIMAL_CREATED]: ({ tempId }) => _animals.set(
        String(tempId),
        new Animal({ id: tempId })
    ),

    [types.ANIMAL_SET_TO_DELETE_FLAG]: ({ id, toDelete }) => _animals.update(
        String(id),
        a => animal(a, action)
    ),

    [types.ANIMAL_SET_TO_DELETE_FLAG_ALL]: ({ toDelete }) => _animals.map(
        a => animal(a, action)
    ),

    [types.ANIMAL_DELETION_REQUESTED]: ({ id }) => _animals.update(
        String(id),
        a => animal(a, action)
    ),

    [types.ANIMAL_DELETION_SUCCESS]: ({ id }) => _animals.remove(String(id)),

    [types.ANIMAL_DELETION_FAILED]: ({ id }) => _animals.update(
        String(id),
        a => animal(a, action)
    )

}, _animals, action)


const ids = (ids = List(), action = {}) => switcher({

    [types.ALL_ANIMALS_RECEIVED]: ({ animals }) => List(animals.map(a => a.id)),

    [types.ANIMAL_DELETION_SUCCESS]: ({ id }) => ids.remove(ids.indexOf(id)),

    [types.TEMP_ANIMAL_CREATED]: ({ tempId }) => ids.unshift(tempId),

    [types.ANIMAL_UPDATED]: ({ id, animal }) => {
        if (String(id) != String(animal.id)) {
            return ids.remove(ids.indexOf(id)).unshift(String(animal.id))
        }
        return ids
    }

}, ids, action)


const reducer = combineReducers({
    allFetched,
    error,
    animals,
    ids
})

export default reducer