import { ANIMAL_STATE } from './reducers'

export const areAllAnimalsFetched = (state) => state.allFetched

export const getError = (state) => state.error

export const getAnimals = (state) => state.animals.toList().toJS()

export const getAnimalsIds = (state) => getAnimals(state).map(a => a.id)

export const getAnimal = (state, id) => state.animals.get(String(id)).toJS()

export const isNew = (state, id) => getAnimal(state, id).state == ANIMAL_STATE.NEW

export const areAllSetToDelete = (state) => getAnimals(state).every(a => a.toDelete)

export const areAnySetToDelete = (state) => getAnimals(state).some(a => a.toDelete)

export const getToDeleteIds = (state) => getAnimals(state).filter(a => a.toDelete).map(a => a.id)