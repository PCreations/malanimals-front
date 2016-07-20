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
import AnimalTable from './AnimalTable'
import ErrorContainer from './ErrorContainer'


export const App = ({ handleAdd }) => (
    <Layout style={{
        backgroundColor: 'white',
        width: '100%',
    }} fixedHeader>
        <LayoutHeader style={{
            color: 'white'
        }}>
            <LayoutHeaderRow>
                <LayoutTitle>{'Malanimals'}</LayoutTitle>
                <LayoutSpacer/>
                <LayoutNav>
                    <LayoutNavLink href>{'Dogs'}</LayoutNavLink>
                    <LayoutNavLink href>{'Cats'}</LayoutNavLink>
                    <LayoutNavLink href>{'Small pets'}</LayoutNavLink>
                    <LayoutNavLink href>{'Birds'}</LayoutNavLink>
                </LayoutNav>
            </LayoutHeaderRow>
        </LayoutHeader>
        <Drawer>
            <LayoutTitle>{'Malanimals'}</LayoutTitle>
            <LayoutNav>
                <LayoutNavLink href>{'Dogs'}</LayoutNavLink>
                <LayoutNavLink href>{'Cats'}</LayoutNavLink>
                <LayoutNavLink href>{'Small pets'}</LayoutNavLink>
                <LayoutNavLink href>{'Birds'}</LayoutNavLink>
            </LayoutNav>
        </Drawer>
        <LayoutContent>
            <RippleEffect>
                <FabButton
                    onClick={handleAdd}
                    colored
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px'
                    }}>
                    {'+'}
                </FabButton>
            </RippleEffect>
            <Grid>
                <Cell col={4} offsetDesktop={4}>
                    <AnimalTable />
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