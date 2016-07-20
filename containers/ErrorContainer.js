import React from 'react'
import { connect } from 'react-redux'
import pure from 'recompose/pure'

import { getError } from '../selectors'


const ErrorContainer = pure(({ error }) => (
    <p>{error != '' && <span style={{ color: 'red' }}>{error}</span>}</p>
))

export default connect(
    (state) => ({
        error: getError(state)
    })
)(ErrorContainer)
