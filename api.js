import Request from './request'

export const fetchAll = () => Request.get(MALANIMALS_API).then(res => res.body)

export const updateAnimal = (id, animal) => Request.put(`${MALANIMALS_API}${id}/`, animal).then(res => res.body)

export const createAnimal = (animal) => Request.post(MALANIMALS_API, animal).then(res => res.body)

export const del = (id) => Request.del(`${MALANIMALS_API}${id}/`).then(res => res.body)