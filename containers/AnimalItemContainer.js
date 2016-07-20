import React from 'react'
import { connect } from 'react-redux'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'

import {
    RaisedButton,
    ListItem,
    SubDiv,
    Checkbox
} from 'react-redux-mdl'

import {
    rehydrate,
    update,
    del,
    toDelete
} from '../actions'
import { ANIMAL_STATE } from '../reducers'
import { getAnimal } from '../selectors'
import {
    AnimalItem,
    EditingAnimalItem
} from '../components'


const animalCellStyle = {
    display: 'inline-block',
    width: '150px',
    textAlign: 'left',
    fontSize: '16px'
}

const AnimalItemContainer = ({
    id,
    name,
    state,
    toDelete,
    handleChange,
    handleDelete,
    handleSave,
    handleSetToDelete,
    setEditMode
}) => (
    <ListItem>
        <SubDiv type='primary'>
            {state == ANIMAL_STATE.NOT_SAVED || state == ANIMAL_STATE.NEW ? (
                <EditingAnimalItem
                    name={name}
                    state={state}
                    onChange={handleChange}/>
            ) : (
                <span>
                    {name}
                </span>
            )}
        </SubDiv>
        <SubDiv type='secondary'>
            {(state != ANIMAL_STATE.NOT_SAVED && state != ANIMAL_STATE.NEW) ? (
                <RaisedButton
                    onClick={() => setEditMode(name)}
                    style={{
                        marginLeft: '10px'
                    }}>
                    {'Edit'}
                </RaisedButton>
            ) : (
                <RaisedButton
                    onClick={() => handleSave(id)}
                    disabled={name.length == 0}
                    primary
                    colored
                    accent
                    style={{
                        marginLeft: '10px'
                    }}>
                    {'Save'}
                </RaisedButton>
            )}
        </SubDiv>
        <SubDiv type='secondary'>
            <Checkbox
                checked={toDelete}
                onChange={(e) => handleSetToDelete(e.target.checked)}/>
        </SubDiv>
    </ListItem>
)


const enhance = onlyUpdateForKeys(['id','name','state','toDelete'])


export default enhance(connect(
    (_, { id }) => (state) => ({
        ...getAnimal(state, id)
    }),
    (_, { id }) => (dispatch) => ({
        handleChange(name) {
            dispatch(rehydrate({ id, name }))
        },
        handleSave() {
            dispatch(update({ id }))
        },
        handleDelete() {
            dispatch(del({ id }))
        },
        handleSetToDelete(checked) {
            dispatch(toDelete({ id, toDelete: checked }))
        },
        setEditMode(name) {  // quick way to set in edit mode
            dispatch(rehydrate({ id, name }))
        }
    })
)(AnimalItemContainer))
