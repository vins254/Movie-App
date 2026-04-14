import axios from 'axios';
const API_KEY = (process.env.EXPO_PUBLIC_API_KEY || process.env.API_KEY || '').trim();

//endpoints
const apiBaseUrl = 'https://api.themoviedb.org/3';
const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day`;
const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming`;
const topRatedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated`;
const trendingSeriesEndpoint = `${apiBaseUrl}/trending/tv/day`;
const airingTodaySeriesEndpoint = `${apiBaseUrl}/tv/airing_today`;
const topRatedSeriesEndpoint = `${apiBaseUrl}/tv/top_rated`;
const searchMoviesEndpoint = `${apiBaseUrl}/search/movie`;


//dynamic endpoints
const movieDetailsEndpoint = (id: number) => `${apiBaseUrl}/movie/${id}?api_key=${API_KEY}`;
const movieCreditsEndpoint = (id: number) => `${apiBaseUrl}/movie/${id}/credits?api_key=${API_KEY}`;
const similarMoviesEndpoint = (id: number) => `${apiBaseUrl}/movie/${id}/similar?api_key=${API_KEY}`;
const movieVideosEndpoint = (id: number) => `${apiBaseUrl}/movie/${id}/videos?api_key=${API_KEY}`;
const seriesDetailsEndpoint = (id: number) => `${apiBaseUrl}/tv/${id}?api_key=${API_KEY}`;
const seriesCreditsEndpoint = (id: number) => `${apiBaseUrl}/tv/${id}/credits?api_key=${API_KEY}`;
const similarSeriesEndpoint = (id: number) => `${apiBaseUrl}/tv/${id}/similar?api_key=${API_KEY}`;
const seriesVideosEndpoint = (id: number) => `${apiBaseUrl}/tv/${id}/videos?api_key=${API_KEY}`;




const personDetailsEndpoint = (id: number) => `${apiBaseUrl}/person/${id}`;
const personMoviesEndpoint = (id: number) => `${apiBaseUrl}/person/${id}/movie_credits`;


export const image500 = (path: string | null) => path? `https://image.tmdb.org/t/p/w500${path}` : null;
export const image342 = (path: string | null) => path? `https://image.tmdb.org/t/p/w342${path}` : null;
export const image185 = (path: string | null) => path? `https://image.tmdb.org/t/p/w185${path}` : null;

export const fallbackMoviePoster = 'https://via.placeholder.com/150';
export const fallbackPersonImage = 'https://picsum.photos/200/300';

const apiCall = async (endpoint: string, params?: Record<string, string | number | boolean>) => {
    if (!API_KEY) {
        console.log('TMDB API key missing. Set EXPO_PUBLIC_API_KEY in .env');
        return {};
    }

    const options = {
        method: 'GET',
        url: endpoint,
        params: {
            api_key: API_KEY,
            ...(params || {})
        }
    };
    try {
        const response = await axios.request(options);
        return response.data;
    }
    catch (error) {
        console.log('error', error);
        return {};
    }
}

export const fetchTrendingMovies = (page = 1) => {
    return apiCall(trendingMoviesEndpoint, { page });
}
export const fetchUpcomingMovies = (page = 1) => {
    return apiCall(upcomingMoviesEndpoint, { page });
}
export const fetchTopRatedMovies = (page = 1) => {
    return apiCall(topRatedMoviesEndpoint, { page });
}
export const fetchTrendingSeries = (page = 1) => {
    return apiCall(trendingSeriesEndpoint, { page });
}
export const fetchAiringTodaySeries = (page = 1) => {
    return apiCall(airingTodaySeriesEndpoint, { page });
}
export const fetchTopRatedSeries = (page = 1) => {
    return apiCall(topRatedSeriesEndpoint, { page });
}


export const fetchMovieDetails = (id: number) => {
    return apiCall(movieDetailsEndpoint(id));
}
export const fetchMovieCredits = (id: number) => {
    return apiCall(movieCreditsEndpoint(id));
}
export const fetchSimilarMovies = (id: number) => {
    return apiCall(similarMoviesEndpoint(id));
}
export const fetchMovieVideos = (id: number) => {
    return apiCall(movieVideosEndpoint(id));
}
export const fetchSeriesDetails = (id: number) => {
    return apiCall(seriesDetailsEndpoint(id));
}
export const fetchSeriesCredits = (id: number) => {
    return apiCall(seriesCreditsEndpoint(id));
}
export const fetchSimilarSeries = (id: number) => {
    return apiCall(similarSeriesEndpoint(id));
}
export const fetchSeriesVideos = (id: number) => {
    return apiCall(seriesVideosEndpoint(id));
}



export const fetchPersonDetails = (id: number) => {
    return apiCall(personDetailsEndpoint(id));
}
export const fetchPersonMovies = (id: number) => {
    return apiCall(personMoviesEndpoint(id));
}

export const searchMovies = (params: Record<string, string | number | boolean>) => {
    return apiCall(searchMoviesEndpoint, params);
}