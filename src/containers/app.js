import React, { Component } from 'react'
import axios from 'axios';
import _ from 'lodash'
import SearchBar from '../components/search-bar'
import MovieDetail from '../components/movie-detail'
import MovieVideo from '../components/movie-video'
import MovieList from './movie-list'

const API_END_POINT = "https://api.themoviedb.org/3/";
const API_KEY = "ee52528a3d2bfff0312880daeaee21b3";
const DEFAULT_TYPE_SEARCH ="discover";
const DEFAULT_PARAM = "language=fr&include_adult=false";

class App extends Component {

    constructor (props) {
        super(props)
        this.state = ({
            movies:[],
            currentMovie:{},
            isSearch:false
        })
    }
    
    componentWillMount () {
       this.initMovies();
    }
    
    initMovies(){
        const request = axios.get(`${API_END_POINT}${DEFAULT_TYPE_SEARCH}/movie?api_key=${API_KEY}&sort_by=popularity.desc&${DEFAULT_PARAM}`).then(function(response){
        this.setState({
            movies:response.data.results.slice(1,6),
            currentMovie:response.data.results[0]
        }, function() {
              this.applyVideoToCurrentMovie();
        });
      
        }.bind(this));
    }
   

   applyVideoToCurrentMovie(){
        const request = axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?api_key=${API_KEY}&append_to_response=videos&include_adult=false`).then(function(response){
            if(response.data.videos.results[0] && response.data.videos.results[0].key){ 
                 const youtube_key =response.data.videos.results[0].key;
                 let currentMovieWithVideo = this.state.currentMovie;
                 currentMovieWithVideo.videoId = youtube_key;
                 this.setState({currentMovie:currentMovieWithVideo});
            }
        }.bind(this));
    }

callBackMovieClick(movie){
    this.setState({currentMovie:movie}, function() {
         this.applyVideoToCurrentMovie();
         this.setRecommendation();
    });
}

 searchMovie(textSearch){
     if(textSearch){
        const request = axios.get(`${API_END_POINT}search/movie?api_key=${API_KEY}&${DEFAULT_PARAM}&query=${textSearch}`).then(function(response){
           //si on trouve des data
            if(response.data && response.data.results[0]){
                //si le film trouvé est different de l actuel
                if(response.data.results[0].id!=this.state.currentMovie.id){
                    this.updateAfterSearch(response);
                }
            }
        }.bind(this));
    }
  }

updateAfterSearch(response){
    this.setState({currentMovie:response.data.results[0]}, () => {
          this.applyVideoToCurrentMovie();
          this.setRecommendation();
    }); 
}

setRecommendation(){    
     const request = axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?api_key=${API_KEY}&language=fr`).then(function(response){
        if(response.data && response.data.results.length>5){
            this.setState({movies:response.data.results.slice(1,6)});
       }
     }.bind(this)); 
}
shouldComponentUpdate (nextProps, nextState) {
    if(!nextState.currentMovie.videoId){
        return false;
    }else{
        return true;
    }
}

 render () {  
       const renderMovieList = () => {
           if(!this.state.movies>=5){return <div>Chargement</div>}
           return <MovieList movies={this.state.movies} callBackMovieClick={this.callBackMovieClick.bind(this)} />
       }
       const renderMovie = () => {
           if(this.state.currentMovie.videoId)
                return (<div><MovieVideo videoId={this.state.currentMovie.videoId}/><MovieDetail title={this.state.currentMovie.title} description={this.state.currentMovie.overview}/></div>) ;  
            else
                return <div>Pas de donnée</div> ;  
        }               
        return ( 
            <div>
                <div className="search_bar">
                    <SearchBar callBackRequest={this.searchMovie.bind(this)}/>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        {renderMovie()}
                    </div>
                    <div className="col-md-4">
                        {renderMovieList()}
                    </div>
                </div>
            </div>
        )
    }
    
}

export default App

