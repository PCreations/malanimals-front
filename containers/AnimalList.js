import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
import lifecycle from 'recompose/lifecycle'
import renderComponent from 'recompose/renderComponent'
import branch from 'recompose/branch'
import Infinite from 'react-infinite'
import {
    Spinner,
    Checkbox,
    List,
    ListItem,
    SubDiv,
    RaisedButton
} from 'react-redux-mdl'
import {
    getAnimalsIds,
    areAllAnimalsFetched,
    areAllSetToDelete,
    areAnySetToDelete
} from '../selectors'
import {
    fetchAll,
    toDeleteAll,
    batchDelete
} from '../actions'

import AnimalItemContainer from './AnimalItemContainer'
import { EmptyState } from '../components'

class AnimalList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        if (this.props.ids.length == 0) {
            this.props.fetchAll()
        }
    }

    render() {
        return this.props.areAllAnimalsFetched ? (
            this.props.ids.length == 0 ? (
                <EmptyState handleAdd={this.props.handleAdd}/>
            ) : (
                <List>
                    <ListItem>
                        <SubDiv type='primary'>
                            {'Animal\'s name'}
                        </SubDiv>
                        {this.props.areAnySetToDelete && (
                            <SubDiv type='secondary' href="#">
                                <RaisedButton
                                    primary
                                    colored
                                    accent
                                    style={{
                                        marginLeft: '20px'
                                    }}
                                    onClick={this.props.batchDelete}>
                                    {'Delete selected'}
                                </RaisedButton>
                            </SubDiv>
                        )}
                        <SubDiv type='action' href="#">
                            <Checkbox
                                checked={this.props.areAllSetToDelete}
                                onChange={(e) => this.props.toggleAll(e.target.checked)}/>
                        </SubDiv>
                    </ListItem>
                    <Infinite
                        containerHeight={800}
                        elementHeight={68}
                        useWindowAsScrollContainer>
                        {this.props.ids.map(id => <AnimalItemContainer key={id} id={id}/>)}
                    </Infinite>
                </List>
            )
        ) : <Spinner active/>
    }
}

export default connect(
    (state) => ({
        ids: getAnimalsIds(state),
        areAllAnimalsFetched: areAllAnimalsFetched(state),
        areAllSetToDelete: areAllSetToDelete(state),
        areAnySetToDelete: areAnySetToDelete(state)
    }),
    (dispatch) => ({
        fetchAll() {
            dispatch(fetchAll())
        },
        toggleAll(toDelete) {
            dispatch(toDeleteAll({ toDelete }))
        },
        batchDelete() {
            dispatch(batchDelete())
        }
    })
)(AnimalList)