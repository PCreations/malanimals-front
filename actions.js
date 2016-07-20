import * as types from './types'


export const fetchAll = () => ({
    type: types.FETCH_ALL_ANIMALS_REQUESTED
})

export const receiveAll = ({ animals }) => ({
    type: types.ALL_ANIMALS_RECEIVED,
    animals
})

export const fetchAllFailed = ({ error }) => ({
    type: types.FETCH_ALL_ANIMALS_FAILED,
    error
})

export const rehydrate = ({ id, name }) => ({
    type: types.ANIMAL_REHYDRATED,
    id,
    name
})

export const update = ({ id }) => ({
    type: types.UPDATE_ANIMAL_REQUESTED,
    id
})

export const receiveUpdated = ({ id, animal }) => ({
    type: types.ANIMAL_UPDATED,
    id,
    animal
})

export const updateFailed = ({ id, error }) => ({
    type: types.UPDATE_ANIMAL_FAILED,
    id,
    error
})

export const createTemp = () => ({
    type: types.CREATE_TEMP_ANIMAL_REQUESTED
})

export const tempCreated = ({ tempId }) => ({
    type: types.TEMP_ANIMAL_CREATED,
    tempId
})

export const batchDelete = () => ({
    type: types.BATCH_DELETE_REQUESTED,
})

export const toDelete = ({ id, toDelete }) => ({
    type: types.ANIMAL_SET_TO_DELETE_FLAG,
    id,
    toDelete
})

export const toDeleteAll = ({ toDelete }) => ({
    type: types.ANIMAL_SET_TO_DELETE_FLAG_ALL,
    toDelete
})

export const del = ({ id }) => ({
    type: types.ANIMAL_DELETION_REQUESTED,
    id
})

export const deleteSuccess = ({ id }) => ({
    type: types.ANIMAL_DELETION_SUCCESS,
    id
})

export const deleteFailed = ({ id, error }) => ({
    type: types.ANIMAL_DELETION_FAILED,
    id,
    error
})
