import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchMovieVideos, fetchSeriesCredits, fetchSeriesDetails, fetchSeriesVideos, fetchSimilarMovies, fetchSimilarSeries, image500 } from '@/api/moviedb';
import { RouteProp, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, HomeIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import CastMembers from '../components/castMembers';
import Loading from '../components/loading';
import MovieList from '../components/movieList';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : 'mt-3';

/** TMDB movie details response (fields used in this screen only). */
type MovieDetailsData = {
    id?: number;
    title?: string;
    name?: string;
    status?: string;
    release_date?: string;
    first_air_date?: string;
    runtime?: number;
    episode_run_time?: number[];
    overview?: string;
    genres?: { id: number; name: string }[];
    poster_path?: string | null;
};

type MovieRouteParams = {
    params: {
        id: string | number;
        media_type?: 'movie' | 'tv';
    };
};

const MovieDetails = () => {
    const { params: item } = useRoute<RouteProp<MovieRouteParams, 'params'>>();
    const router = useRouter();
    const [isFavourite, toggleFavourite] = useState(false);
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([1, 2, 3, 4, 5]);
    const [loading, setLoading] = useState(false);
    const [movie, setMovie] = useState<MovieDetailsData>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [watchError, setWatchError] = useState('');
    const genres = movie.genres ?? [];
    const mediaType = item?.media_type === 'tv' ? 'tv' : 'movie';

    let movieName = 'Ant-Man and the Wasp';

    useEffect(() => {
        // Parse route id once and skip API calls when it's invalid.
        const parsedId = typeof item?.id === 'string' ? Number(item.id) : item?.id;
        if (!parsedId || Number.isNaN(parsedId)) {
            setLoading(false);
            setErrorMessage('Invalid movie selected.');
            return;
        }
        setErrorMessage('');
        setLoading(true);
        getMovieDetails(parsedId);
        getMovieCredits(parsedId);
        getSimilarMovies(parsedId);
        getMovieTrailer(parsedId);
    }, [item]);
    
    const getMovieDetails = async (id: number | string) => {
        const numericId = typeof id === 'string' ? Number(id) : id;
        if (Number.isNaN(numericId)) {
            setLoading(false);
            return;
        }
        const data = mediaType === 'tv' ? await fetchSeriesDetails(numericId) : await fetchMovieDetails(numericId);
        //console.log('got movie details: ', data);
        if (data && data.id) setMovie(data);
        else setErrorMessage('Unable to load movie details right now.');
        setLoading(false);
    };


    const getMovieCredits = async (id: number) => {
        const data = mediaType === 'tv' ? await fetchSeriesCredits(id) : await fetchMovieCredits(id);
        //console.log('got credits: ', data);
        if(data && data.cast) setCast(data.cast);
    }
    
    const getSimilarMovies = async (id: number) => {
        const data = mediaType === 'tv' ? await fetchSimilarSeries(id) : await fetchSimilarMovies(id);
        //console.log('got similar movies: ', data);
        if(data && data.results) setSimilarMovies(data.results.map((result: any) => ({ ...result, media_type: mediaType })));
    }

    const getMovieTrailer = async (id: number) => {
        const data = mediaType === 'tv' ? await fetchSeriesVideos(id) : await fetchMovieVideos(id);
        const videos = data?.results ?? [];
        const trailer =
            videos.find((video: any) => video?.site === 'YouTube' && video?.type === 'Trailer' && video?.official) ||
            videos.find((video: any) => video?.site === 'YouTube' && video?.type === 'Trailer') ||
            videos.find((video: any) => video?.site === 'YouTube');

        if (trailer?.key) {
            setTrailerKey(trailer.key);
            setWatchError('');
        } else {
            setTrailerKey(null);
            setWatchError('Trailer is not available for this movie yet.');
        }
    };

    const onWatchMovie = () => {
        if (!trailerKey) return;
        router.push({
            pathname: '/watchTrailer',
            params: {
                key: trailerKey,
                title: movie?.title || movie?.name || 'Trailer',
            },
        });
    };

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            className='flex-1 bg-neutral-900'
        >

            {/* back button and movie poster */}
            <View className='w-full'>
                <SafeAreaView className={`absolute z-20 w-full flex-row justify-between items-center px-4 ${topMargin}`}>
                    <TouchableOpacity onPress={() => router.back()} className='h-11 w-11 rounded-xl bg-neutral-900/85 border border-neutral-600 items-center justify-center'>
                        <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />

                    </TouchableOpacity>
                    <View className='flex-row items-center gap-3'>
                        <TouchableOpacity onPress={() => router.push('/')} className='h-11 w-11 rounded-xl bg-neutral-900/85 border border-neutral-600 items-center justify-center'>
                            <HomeIcon size="24" color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)} className='h-11 w-11 rounded-xl bg-neutral-900/85 border border-neutral-600 items-center justify-center'>
                            <HeartIcon size="24" color={isFavourite ? theme.background : "white"} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                {
                    loading ? (
                        <Loading />
                    ) : errorMessage ? (
                        <View className='items-center justify-center py-24 px-8'>
                            <Text className='text-neutral-300 text-base text-center'>{errorMessage}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    const parsedId = typeof item?.id === 'string' ? Number(item.id) : item?.id;
                                    if (parsedId && !Number.isNaN(parsedId)) getMovieDetails(parsedId);
                                }}
                                className='mt-4 rounded-full bg-amber-500 px-5 py-2'
                            >
                                <Text className='text-white font-semibold'>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <Image
                                source={{ uri: image500(movie.poster_path ?? null) || fallbackMoviePoster }}
                                style={{ width, height: height * 0.55 }}
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23,1)']}
                                style={{ width, height: height * 0.40 }}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                className="absolute bottom-0"
                            />
                        </View>
                    )
                }


            </View>

            {/* movie details */}
            <View style={{ marginTop: -(height * 0.09) }} className='space-y-3 px-1'>
                {/* title */}
                <Text className='text-white text-center text-3xl font-bold tracking-wider'>
                    {movie.title || movie.name}
                </Text>
                {/* status, release, runtime */}
                {
                    movie?.id?(
                        <>
                            <Text className='text-neutral-400 font-semibold text-base text-center'>
                                {movie?.status} . {(movie?.release_date || movie?.first_air_date)?.split('-')[0]} . {(movie?.runtime || movie?.episode_run_time?.[0])} min
                            </Text>
                            <View className='items-center mt-4'>
                                <TouchableOpacity
                                    onPress={onWatchMovie}
                                    disabled={!trailerKey}
                                    className={`rounded-full px-6 py-3 ${trailerKey ? 'bg-amber-500' : 'bg-neutral-700'}`}
                                >
                                    <Text className='text-white font-semibold'>Watch Trailer</Text>
                                </TouchableOpacity>
                                {watchError ? <Text className='text-neutral-400 mt-2 text-sm'>{watchError}</Text> : null}
                            </View>
                        </>
                    ):null
                }
                
                {/* genres */}
                <View className='flex-row justify-center mx-4 space-x-2'>
                    {
                        genres.map((genre: { id: number; name: string }, index: number)=> {
                            let showDot = index+1 != genres.length;
                            return (
                                <Text key={index} className='text-neutral-400 font-semibold text-base text-center'>
                                    {genre?.name} {showDot? ".":null}
                                </Text>
                            )
                        })
                    }
                    
                    {/*<Text className='text-neutral-400 font-semibold text-base text-center'>
                        Thrill .
                    </Text>
                    <Text className='text-neutral-400 font-semibold text-base text-center'>
                        Comedy .
                    </Text> 
                    */}
                </View>
                {/* desription */}
                <Text className='text-neutral-400 mx-4 tracking tracking-wide'>
                    {movie?.overview}
                </Text>
            </View>

            {/* cast members */}
            {cast.length>0 && <CastMembers cast={cast} />}

            {/* similar movies */}
            {similarMovies.length>0 &&<MovieList title={`Similar ${mediaType === 'tv' ? 'Series' : 'Movies'}`} hideSeeAll={true} data={similarMovies} />}
        </ScrollView >
    )
}

export default MovieDetails