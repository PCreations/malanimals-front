import React from 'react'
import { connect } from 'react-redux'

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
import AnimalList from './AnimalList'
import ErrorContainer from './ErrorContainer'


export const App = ({ handleAdd }) => (
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
        <LayoutContent>
            <RippleEffect>
                <FabButton
                    onClick={handleAdd}
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
            <Grid>
                <Cell col={4} offsetDesktop={4}>
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