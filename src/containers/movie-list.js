import React from 'react'
import MovieListItem from '../components/movie-list-item'

const MovieList = (props) => {
    return (
        <div>
             <h3 className="title_list_item_title">Vous aimerez aussi ...</h3>
            <ul className="list-group">
               {props.movies.map(movie => {
                  return <MovieListItem key={movie.id} movie={movie} callBackMovieClick={callBackMovieClick} /> 
               })}
            </ul>
        </div>
    ) 
    function callBackMovieClick(movie){
        props.callBackMovieClick(movie);
    }
}

export default MovieList