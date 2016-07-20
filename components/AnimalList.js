import React from 'react'
import { connect } from 'react-redux'
import {
    MDLtbody,
    MDLtr,
    MDLtd,
    Checkbox
} from 'react-redux-mdl'

import AnimalRowContainer from '../containers/AnimalRowContainer'


const AnimalList = ({
    ids,
}) => (
    <MDLtbody>
        {ids.length > 0 ? (
            ids.map(id => (
                <AnimalRowContainer key={id} id={id} />
            ))
        ) : <MDLtr><MDLtd colSpan={2}>{'Empty :('}</MDLtd></MDLtr>}
    </MDLtbody>
)

export default AnimalList