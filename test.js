import 'babel-core/register'
import 'babel-polyfill'
import { Map, List, fromJS, is } from 'immutable'
import { put, call, select, take, fork, actionChannel } from 'redux-saga/effects'
import { takeEvery, buffers, channel } from 'redux-saga'
import uniqueid from 'lodash/uniqueid'
import expect from 'expect'

import * as api from './api'
import * as actions from './actions'
import * as types from './types'
import * as selectors from './selectors'
import * as sagas from './sagas'
import {
    Animal as AnimalRecord,
    ANIMAL_STATE,
    default as reducer
} from './reducers'

const initialAnimal = new AnimalRecord().toJS()
// some properties are immutable iterable so we need to convert the
// whole object to an Immutable map in order to convert it back to
// a plain JS object to perform a deep equal comparison since we're
// not testing for reference equality here
const toJS = (iterable) => fromJS(iterable).toJS()


describe('actions', () => {
    it('should create an action to request a fetch of animals', () => {
        const expectedAction = {
            type: types.FETCH_ALL_ANIMALS_REQUESTED
        }
        expect(actions.fetchAll()).toEqual(expectedAction)
    })
    it('should create an action for receiving all animals', () => {
        const animals = ['foo','bar']  //content here is not relevant
        const expectedAction = {
            type: types.ALL_ANIMALS_RECEIVED,
            animals
        }
        expect(actions.receiveAll({ animals })).toEqual(expectedAction)
    })
    it('should create an action to notify an error when fetching all animals', () => {
        const error = 'Error when fetching all animals'
        const expectedAction = {
            type: types.FETCH_ALL_ANIMALS_FAILED,
            error
        }
        expect(actions.fetchAllFailed({ error })).toEqual(expectedAction)
    })
    it('should create an action for rehydrating an animal', () => {
        const id = 'foo'
        const name = 'a dog'
        const expectedAction = {
            type: types.ANIMAL_REHYDRATED,
            id,
            name
        }
        expect(actions.rehydrate({ id, name })).toEqual(expectedAction)
    })
    it('should create an action to trigger an update request', () => {
        const id = 'foo'
        const expectedAction = {
            type: types.UPDATE_ANIMAL_REQUESTED,
            id,
        }
        expect(actions.update({ id })).toEqual(expectedAction)
    })
    it('should create an action for receiving an updated animal', () => {
        const id = 'foo'
        const animal = {'foo':'bar'}
        const expectedAction = {
            type: types.ANIMAL_UPDATED,
            id,
            animal
        }
        expect(actions.receiveUpdated({ id, animal })).toEqual(expectedAction)
    })
    it('should create an action to notify an error when updating an animal', () => {
        const id = 'foo'
        const error = 'Error when updating animal'
        const expectedAction = {
            type: types.UPDATE_ANIMAL_FAILED,
            id,
            error
        }
        expect(actions.updateFailed({ id, error })).toEqual(expectedAction)
    })
    it('should create an action to initiate the creation of a temp animal', () => {
        const expectedAction = {
            type: types.CREATE_TEMP_ANIMAL_REQUESTED
        }
        expect(actions.createTemp()).toEqual(expectedAction)
    })
    it('should create an action for receiving the created animal with a tempId', () => {
        const tempId = '42'
        const expectedAction = {
            type: types.TEMP_ANIMAL_CREATED,
            tempId
        }
        expect(actions.tempCreated({ tempId })).toEqual(expectedAction)
    })
    it('should create an action to set a toDelete flag on an animal', () => {
        const id = 'foo'
        const toDelete = true
        const expectedAction = {
            type: types.ANIMAL_SET_TO_DELETE_FLAG,
            id,
            toDelete
        }
        expect(actions.toDelete({ id, toDelete })).toEqual(expectedAction)
    })
    it('should create an action to set a toDelete flat on all animals', () => {
        const toDelete = true
        const expectedAction = {
            type: types.ANIMAL_SET_TO_DELETE_FLAG_ALL,
            toDelete
        }
        expect(actions.toDeleteAll({ toDelete })).toEqual(expectedAction)
    })
    it('should create an action to request a batch delete', () => {
        const expectedAction = {
            type: types.BATCH_DELETE_REQUESTED,
        }
        expect(actions.batchDelete()).toEqual(expectedAction)
    })
    it('should create an action to request for an animal deletion', () => {
        const id = 'foo'
        const expectedAction = {
            type: types.ANIMAL_DELETION_REQUESTED,
            id
        }
        expect(actions.del({ id })).toEqual(expectedAction)
    })
    it('should create an action when the deletion request succeed', () => {
        const id = 'foo'
        const expectedAction = {
            type: types.ANIMAL_DELETION_SUCCESS,
            id
        }
        expect(actions.deleteSuccess({ id })).toEqual(expectedAction)
    })
    it('should create an action to notify the failure of a deletion request', () => {
        const id = 'foo'
        const error = 'Error when trying to delete the animal object'
        const expectedAction = {
            type: types.ANIMAL_DELETION_FAILED,
            id,
            error
        }
        expect(actions.deleteFailed({ id, error })).toEqual(expectedAction)
    })
})


describe('reducers', () => {
    it('should return the initial state', () => {
        expect(
            toJS(reducer(undefined, {}))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {}
        })
    })
    it('should handle FETCH_ALL_ANIMALS_REQUESTED', () => {
        expect(
            toJS(reducer(undefined, actions.fetchAll()))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {}
        })
    })
    it('should handle ALL_ANIMALS_RECEIVED', () => {
        const animals = [{
            id: '1',
            name: 'a dog'
        }, {
            id: '2',
            name: 'a cat'
        }]
        expect(
            toJS(reducer(undefined, actions.receiveAll({ animals })))
        ).toEqual({
            allFetched: true,
            error: '',
            animals: {
                '1': {
                    ...initialAnimal,
                    id: '1',
                    name: 'a dog',
                    state: ANIMAL_STATE.SAVED
                },
                '2': {
                    ...initialAnimal,
                    id: '2',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED
                }
            }
        })
    })
    it('should handle FETCH_ALL_ANIMALS_FAILED', () => {
        const action = actions.fetchAllFailed({ error: 'some error' })
        expect(
            toJS(reducer(undefined, action))
        ).toEqual({
            allFetched: false,
            error: 'some error',
            animals: {}
        })
    })
    it('should handle ANIMAL_REHYDRATED when animal is not new', () => {
        const action = actions.rehydrate({ id: '42', name: 'a dog' })
        const previousState = {
            allFetched: false,
            error: '',
            animals: fromJS({
                '42': {
                    id: '42',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED
                }
            })
        }
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NOT_SAVED
                }
            }
        })
    })
    it('should handle ANIMAL_REHYDRATED when animal is new', () => {
        const action = actions.rehydrate({ id: '42', name: 'a dog' })
        const previousState = {
            allFetched: false,
            error: '',
            animals: fromJS({
                '42': {
                    id: '42',
                    name: 'a cat',
                    state: ANIMAL_STATE.NEW
                }
            })
        }
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NEW
                }
            }
        })
    })
    it('should handle ANIMAL_UPDATED when animal is not new', () => {
        const action = actions.receiveUpdated({ id: '42', animal: {
            id: '42',
            name: 'a dog'
        } })
        const previousState = {
            allFetched: false,
            error: '',
            animals: fromJS({
                '42': {
                    ...initialAnimal,
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NOT_SAVED
                }
            })
        }
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {
                '42': {
                    ...initialAnimal,
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.SAVED
                }
            }
        })
    })
    it('should handle ANIMAL_UPDATED when animal was new', () => {
        const action = actions.receiveUpdated({ id: 'tempId', animal: {
            id: '42',
            name: 'a dog'
        } })
        const previousState = {
            allFetched: false,
            error: '',
            animals: fromJS({
                'foo': {
                    ...initialAnimal,
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED
                },
                'tempId': {
                    ...initialAnimal,
                    id: 'tempId',
                    name: 'a dog',
                    state: ANIMAL_STATE.NEW
                }
            })
        }
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {
                'foo': {
                    ...initialAnimal,
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED
                },
                '42': {
                    ...initialAnimal,
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.SAVED
                }
            }
        })
    })
    it('should handle UPDATE_ANIMAL_FAILED', () => {
        const action = actions.updateFailed({ id: '42', error: 'error when trying to update animal' })
        const previousState = {
            allFetched: false,
            error: '',
            animals: fromJS({
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NOT_SAVED
                }
            })
        }
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: false,
            error: 'error when trying to update animal',
            animals: {
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NOT_SAVED
                }
            }
        })
    })
    it('should handle TEMP_ANIMAL_CREATED', () => {
        const action = actions.tempCreated({ tempId: 'tempId' })
        expect(
            toJS(reducer(undefined, action))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {
                'tempId': {
                    ...initialAnimal,
                    id: 'tempId',
                    state: ANIMAL_STATE.NEW
                }
            }
        })
    })
    it('should handle ANIMAL_SET_TO_DELETE_FLAG', () => {
        const previousState = {
            allFetched: false,
            error: '',
            animals: fromJS({
                'foo': {
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED,
                    toDelete: false
                },
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NOT_SAVED,
                    toDelete: false
                }
            })
        }
        const action = actions.toDelete({ id: '42', toDelete: true })
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {
                'foo': {
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED,
                    toDelete: false
                },
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NOT_SAVED,
                    toDelete: true
                }
            }
        })
    })
    it('should handle ANIMAL_SET_TO_DELETE_FLAG_ALL', () => {
        const previousState = {
            allFetched: false,
            error: '',
            animals: fromJS({
                'foo': {
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED,
                    toDelete: false
                },
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NOT_SAVED,
                    toDelete: false
                }
            })
        }
        const action = actions.toDeleteAll({ toDelete: true })
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {
                'foo': {
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED,
                    toDelete: true
                },
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.NOT_SAVED,
                    toDelete: true
                }
            }
        })
    })
    it('should handle ANIMAL_DELETION_SUCCESS', () => {
        const previousState = {
            allFetched: false,
            error: '',
            animals: fromJS({
                'foo': {
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED
                },
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.DELETING
                }
            })
        }
        const action = actions.deleteSuccess({ id: '42' })
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: false,
            error: '',
            animals: {
                'foo': {
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED
                }
            }
        })
    })
    it('should handle ANIMAL_DELETION_FAILED', () => {
        const previousState = {
            allFetched: true,
            error: '',
            animals: fromJS({
                'foo': {
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED
                },
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.DELETING
                }
            })
        }
        const error = 'Error when trying to delete the animal object'
        const action = actions.deleteFailed({ id: '42', error })
        expect(
            toJS(reducer(previousState, action))
        ).toEqual({
            allFetched: true,
            error,
            animals: {
                'foo': {
                    id: 'foo',
                    name: 'a cat',
                    state: ANIMAL_STATE.SAVED
                },
                '42': {
                    id: '42',
                    name: 'a dog',
                    state: ANIMAL_STATE.SAVED
                }
            }
        })
    })
})


describe('selectors', () => {
    const state = {
        allFetched: false,
        error: 'Some error',
        animals: fromJS({
            'foo': {
                id: 'foo',
                name: 'a cat',
                state: 'saved',
                toDelete: true
            },
            '42': {
                id: '42',
                name: 'a dog',
                state: 'deleting',
                toDelete: true
            },
            'bar': {
                id: 'bar',
                name: 'a snake',
                state: 'new',
                toDelete: true
            },
            'baz': {
                id: 'baz',
                name: 'a frog',
                state: 'not_saved',
                toDelete: false
            }
        })
    }
    it('should select if all animals are fetched', () => {
        expect(selectors.areAllAnimalsFetched(state)).toEqual(false)
    })
    it('should select the error', () => {
        expect(selectors.getError(state)).toEqual('Some error')
    })
    it('should select the animals list', () => {
        const expectedAnimals = [{
                id: 'foo',
                name: 'a cat',
                state: 'saved',
                toDelete: true
            }, {
                id: '42',
                name: 'a dog',
                state: 'deleting',
                toDelete: true
            }, {
                id: 'bar',
                name: 'a snake',
                state: 'new',
                toDelete: true
            }, {
                id: 'baz',
                name: 'a frog',
                state: 'not_saved',
                toDelete: false
            }
        ]
        const animals = selectors.getAnimals(state)
        for (let a of expectedAnimals) {
            expect(animals).toInclude(a)
        }
    })
    it('should select the animals ids list', () => {
        const animalsIds = selectors.getAnimalsIds(state)
        const expectedIds = ['foo','42','bar','baz']
        for (let id of expectedIds) {
            expect(animalsIds).toInclude(id)
        }
    })
    it('should select the animals set to delete ids', () => {
        const animalsIds = selectors.getToDeleteIds(state)
        const expectedIds = ['foo','42','bar']
        for (let id of expectedIds) {
            expect(animalsIds).toInclude(id)
        }
    })
    it('should select an animal', () => {
        expect(selectors.getAnimal(state, 'foo')).toEqual({
            id: 'foo',
            name: 'a cat',
            state: 'saved',
            toDelete: true
        })
    })
    it('should select whether an animal is new or not', () => {
        expect(selectors.isNew(state, 'bar')).toEqual(true, 'bar should be new')
        expect(selectors.isNew(state, 'foo')).toEqual(false, 'foo should not be new')
    })
    it('should select whether all animals are set toDelete or not', () => {
        expect(selectors.areAllSetToDelete(state)).toEqual(false)
        expect(selectors.areAllSetToDelete({
            ...state,
            animals: state.animals.updateIn(['baz','toDelete'], () => true)
        })).toEqual(true)
    })
    it('should select whether any animals are set toDelete or not', () => {
        expect(selectors.areAnySetToDelete(state)).toEqual(true)
        expect(selectors.areAnySetToDelete({
            ...state,
            animals: state.animals.map(a => a.set('toDelete', false))
        })).toEqual(false)
    })
})


describe('sagas', () => {
    it('fetchAll flow should trigger a request to fetch all animals and trigger the receiveAll action or the fetchAllFailed whether the request succeed or failed', () => {
        let gen = sagas.fetchAll()

        let next = gen.next()
        expect(next.value).toEqual(call(api.fetchAll))

        const error = 'some error'
        expect(gen.throw(error).value).toEqual(put(actions.fetchAllFailed({ error })))

        const animals = [{
            "id": 1,
            "name": "a dog"
        }, {
            "id": 2,
            "name": "a cat"
        }]

        gen = sagas.fetchAll()
        gen.next()
        next = gen.next(animals)
        expect(next.value).toEqual(put(actions.receiveAll({ animals })))
    })
    it('fetchAllWatcher should only yield fetchAll if all animals are not already fetched', () => {
        let gen = sagas.fetchAllWatcher()

        let next = gen.next()
        expect(next.value).toEqual(take(types.FETCH_ALL_ANIMALS_REQUESTED), 'should take FETCH_ALL_ANIMALS_REQUESTED')

        next = gen.next({})
        expect(next.value).toEqual(select(selectors.areAllAnimalsFetched), 'should select areAllAnimalsFetched')

        next = gen.next(false)
        expect(next.value).toEqual(call(sagas.fetchAll), 'should yield fetchAll saga')


        gen = sagas.fetchAllWatcher()

        next = gen.next()
        expect(next.value).toEqual(take(types.FETCH_ALL_ANIMALS_REQUESTED), 'should take FETCH_ALL_ANIMALS_REQUESTED')

        next = gen.next()
        expect(next.value).toEqual(select(selectors.areAllAnimalsFetched), 'should select areAllAnimalsFetched')

        next = gen.next(true)
        expect(next.value).toEqual(take(types.FETCH_ALL_ANIMALS_REQUESTED))

    })

    it('updateAnimal flow should trigger a request to update animal if the animal is already on server and trigger the receiveUpdated or the updateFailed action whether the request succeed or failed', () => {
        const id = 1
        let selectedAnimal = {
            id: '1',
            name: 'foo',
            state: ANIMAL_STATE.NOT_SAVED
        }
        let gen = sagas.updateAnimal(id)

        let next = gen.next()
        expect(next.value).toEqual(select(selectors.getAnimal, id), 'should select animal')

        next = gen.next(selectedAnimal)
        expect(next.value).toEqual(call(api.updateAnimal, id, selectedAnimal), 'should call api.updateAnimal')

        const error = 'some error'
        expect(gen.throw(error).value).toEqual(put(actions.updateFailed({ id, error })), 'should put updateFailed')

        const animal = {
            "id": 1,
            "name": "foo"
        }

        gen = sagas.updateAnimal(id)
        gen.next()
        gen.next(selectedAnimal)

        next = gen.next(animal)
        expect(next.value).toEqual(put(actions.receiveUpdated({ id, animal })), 'should put receiveUpdated')
    })

    it('updateAnimal flow should trigger a create request if the animal is new and trigger the receiveUpdated or the updateFailed action whether the request succeed or failed', () => {
        const id = 1
        const selectedAnimal = {
            id: '1',
            name: 'foo',
            state: ANIMAL_STATE.NEW
        }
        let gen = sagas.updateAnimal(id)

        let next = gen.next()
        expect(next.value).toEqual(select(selectors.getAnimal, id))

        next = gen.next(selectedAnimal)
        expect(next.value).toEqual(call(api.createAnimal, selectedAnimal))

        const error = 'some error'
        expect(gen.throw(error).value).toEqual(put(actions.updateFailed({ id, error })))

        const animal = {
            "id": 1,
            "name": "foo"
        }

        gen = sagas.updateAnimal(id)
        gen.next()
        gen.next(selectedAnimal)
        next = gen.next(animal)
        expect(next.value).toEqual(put(actions.receiveUpdated({ id, animal })))
    })

    it('updateAnimalWatcher should watch for UPDATE_ANIMAL_REQUESTED action and yield the updateAnimal saga', () => {
        const gen = sagas.updateAnimalWatcher()

        let next = gen.next()
        expect(next.value).toEqual(take(types.UPDATE_ANIMAL_REQUESTED))

        next = gen.next(actions.update({ id: "foo" }))
        expect(next.value).toEqual(call(sagas.updateAnimal, "foo"))
    })

    it('createTemp should generate a unique temp id and trigger the tempCreated action', () => {
        const gen = sagas.createTemp()
        const tempId = 'foo'

        let next = gen.next()
        expect(next.value).toEqual(call(uniqueid, 'animal'))

        next = gen.next(tempId)
        expect(next.value).toEqual(put(actions.tempCreated({ tempId })))
    })

    it('createTempWatcher should watch for CREATE_TEMP_ANIMAL_REQUESTED and yield the createTemp saga', () => {
        const gen = sagas.createTempWatcher()

        let next = gen.next()
        expect(next.value).toEqual(call(takeEvery, types.CREATE_TEMP_ANIMAL_REQUESTED, sagas.createTemp))
    })

    it('batchDelete should yield as many deleteFlow sagas as necessary', () => {
        const gen = sagas.batchDelete()
        const toDeleteIds = ['foo','bar']
        const mockChan = channel()

        let next = gen.next()
        expect(next.value).toEqual(actionChannel(types.BATCH_DELETE_REQUESTED))

        next = gen.next(mockChan)
        expect(next.value).toEqual(take(mockChan))

        next = gen.next()
        expect(next.value).toEqual(select(selectors.getToDeleteIds))

        next = gen.next(toDeleteIds)
        expect(next.value).toEqual(call(sagas.deleteFlow, 'foo'))
        next = gen.next()
        expect(next.value).toEqual(call(sagas.deleteFlow, 'bar'))

        next = gen.next()
        expect(next.value).toEqual(take(mockChan))
    })

    it('deleteFlow should put a deleteSuccess action if animal is not yet on the server', () => {
        const id = 'foo'
        const gen = sagas.deleteFlow(id)

        let next = gen.next()
        expect(next.value).toEqual(select(selectors.isNew, 'foo'), 'should select isNew')

        next = gen.next(true)
        expect(next.value).toEqual(put(actions.deleteSuccess({ id: 'foo' })), 'should put deleteSuccess')

        next = gen.next()
        expect(next.value).toEqual(undefined, 'should not yield anything')
    })
    it('deleteFlow should trigger a delete request if the animal is on the server + putting the resulting action whether the request failed or succeed', () => {
        const id = 'foo'
        let gen = sagas.deleteFlow(id)

        let next = gen.next()
        expect(next.value).toEqual(select(selectors.isNew, 'foo'), 'should select isNew')

        next = gen.next(false)
        expect(next.value).toEqual(call(api.del, 'foo'), 'should call api.del')
        expect(gen.throw('some error').value).toEqual(put(actions.deleteFailed({ id: 'foo', error: 'some error' })), 'should put deleteFailed')

        gen = sagas.deleteFlow(id)
        gen.next()
        gen.next(false)
        next = gen.next()
        expect(next.value).toEqual(put(actions.deleteSuccess({ id: 'foo' })))
    })
    it('deleteWatcher should watch for ANIMAL_DELETION_REQUESTED and yield the delete saga', () => {
        const gen = sagas.deleteWatcher()

        let next = gen.next()
        expect(next.value).toEqual(take(types.ANIMAL_DELETION_REQUESTED))

        next = gen.next({ id: 'foo' })
        expect(next.value).toEqual(call(sagas.deleteFlow, 'foo'))
    })
})