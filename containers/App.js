import React from 'react'
import { connect } from 'react-redux'
if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React)
}

import {
    Layout,
    LayoutHeader,
    LayoutTitle,
    LayoutSpacer,
    LayoutNav,
    LayoutNavLink,
    LayoutHeaderRow,
    Drawer,
    LayoutContent,
    Grid,
    Cell,
    RippleEffect,
    FabButton
} from 'react-redux-mdl'

import { createTemp } from '../actions'
import { getError } from '../selectors'
import AnimalList from './AnimalList'
import ErrorContainer from './ErrorContainer'


export const App = ({ handleAdd, error }) => (
    <Layout style={{
        backgroundColor: 'white',
        width: '100%',
        minHeight: '800px'
    }}>
        <LayoutHeader style={{
            color: 'white'
        }}>
            <LayoutHeaderRow>
                <LayoutTitle>{'Malanimals'}</LayoutTitle>
                <LayoutSpacer/>
            </LayoutHeaderRow>
        </LayoutHeader>
        <LayoutContent style={{ zIndex: 'initial' }}>
            <RippleEffect>
                <FabButton
                    onClick={() => {
                        window.scrollTo(0,0)
                        handleAdd()
                    }}
                    colored
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 2
                    }}>
                    {'+'}
                </FabButton>
            </RippleEffect>
            <ErrorContainer/>
            <Grid>
                <Cell col={4} tablet={8} offsetDesktop={4}>
                    <AnimalList handleAdd={handleAdd}/>
                </Cell>
            </Grid>
        </LayoutContent>
    </Layout>
)

export default connect(
    null,
    (dispatch) => ({
        handleAdd() {
            dispatch(createTemp())
        }
    })
)(App)