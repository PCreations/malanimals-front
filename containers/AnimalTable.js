import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
import lifecycle from 'recompose/lifecycle'
import renderComponent from 'recompose/renderComponent'
import branch from 'recompose/branch'
import {
    Spinner,
    Checkbox,
    MDLtable,
    MDLthead,
    MDLtr,
    MDLth,
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

import { AnimalList } from '../components/'

class AnimalTable extends React.Component {
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
            <MDLtable>
                <MDLthead>
                    <MDLtr>
                        <MDLth>
                            <Checkbox
                                checked={this.props.areAllSetToDelete}
                                onChange={(e) => this.props.toggleAll(e.target.checked)}/>
                        </MDLth>
                        <MDLth nonNumeric>
                            {'Animal\'s name'}
                            {this.props.areAnySetToDelete && (
                                <RaisedButton
                                    primary
                                    colored
                                    accent
                                    style={{
                                        marginLeft: '20px'
                                    }}
                                    onClick={this.props.batchDelete}>{'Delete selected'}</RaisedButton>
                            )}
                        </MDLth>
                    </MDLtr>
                </MDLthead>
                <AnimalList ids={this.props.ids}/>
            </MDLtable>
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
)(AnimalTable)