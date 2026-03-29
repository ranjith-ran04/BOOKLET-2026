import React from 'react'

function Submit({props,onclick}) {
    return (
        <button
            className="form-control text-white"
            style={props.style}
            type="submit"
            onclick={onclick}
        >
            {props.name}
        </button>
    )
}

export default Submit;