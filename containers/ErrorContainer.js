import React from 'react'
import { connect } from 'react-redux'
import pure from 'recompose/pure'

import { getError } from '../selectors'


const ErrorContainer = pure(({ error }) => (
    <p style={{ textAlign: 'center', marginTop: '20px' }}>{error != '' && <span style={{ color: 'red' }}>{`Oops, an error occured : "${error}"`}</span>}</p>
))

export default connect(
    (state) => ({
        error: getError(state)
    })
)(ErrorContainer)
