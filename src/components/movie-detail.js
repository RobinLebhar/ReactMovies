
import React  from 'react'

const MovieDetail = ({title,description}) => {
        return (
            <div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        )
}

export default MovieDetail