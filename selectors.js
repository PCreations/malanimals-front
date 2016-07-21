import { ANIMAL_STATE } from './reducers'

export const areAllAnimalsFetched = (state) => state.allFetched

export const getError = (state) => state.error.message || ''

export const getAnimalsIds = (state) => state.ids

export const getAnimal = (state, id) => state.animals.get(String(id)).toJS()

export const isNew = (state, id) => getAnimal(state, id).state == ANIMAL_STATE.NEW

export const areAllSetToDelete = (state) => (
    state.animals.every(a => a.get('toDelete'))
)

export const areAnySetToDelete = (state) => (
    state.animals.some(a => a.get('toDelete'))
)

export const getToDeleteIds = (state) => (
    state.animals.toList().filter(a => a.get('toDelete')).map(a => a.get('id'))
)