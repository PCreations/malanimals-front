import React from 'react'

const Label = ({ text }) => (
    <span>{ text }</span>
)

Label.propTypes = {
    text: React.PropTypes.string
}

export default Label