import React from 'react'
import {
    FlatButton,
    Card,
    CardTitle,
    CardText,
    RippleEffect,
    CardActions,
} from 'react-redux-mdl'


const EmptyState = ({ handleAdd }) => (
    <Card depth={2} style={{
        width: '100%',
        height: '320px',
        marginBottom: '10px'
    }}>
        <CardTitle style={{
            height: '199px',
            color: '#fff',
            background: 'url("https://getmdl.io/assets/demos/dog.png") bottom right 15% no-repeat #46B6AC'
        }}>{'There is no animal yet :('}</CardTitle>
        <CardText>{'Let\'s change that !'}</CardText>
        <CardActions>
            <RippleEffect>
                <FlatButton colored onClick={handleAdd}>{'Add an animal'}</FlatButton>
            </RippleEffect>
        </CardActions>
    </Card>
)

export default EmptyState