import React from 'react'
import { Link } from 'react-router-dom'

function Back({props}){
    return(
        <Link to={props.path} className='form-control text-white' style={props.style}>Back</Link>  
    )
}

export default Back;