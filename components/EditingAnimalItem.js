import React from 'react'
import { TextField } from 'react-redux-mdl'

import {
    RaisedButton
} from 'react-redux-mdl'

const EditingAnimalItem = ({
    name = '',
    onChange,
    ...otherProps
}) => (
    <div style={{ display: 'inline-block' }}>
        <TextField
            value={name}
            onChange={(e) => onChange(e.target.value)}
            placeholder={'Name'}
            required
            floatingLabel
            autoFocus
            style={{
                width: '150px',
            }}/>
    </div>
)

export default EditingAnimalItem
