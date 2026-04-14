import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAiringTodaySeries, fetchTopRatedMovies, fetchTopRatedSeries, fetchTrendingMovies, fetchTrendingSeries, fetchUpcomingMovies } from '../api/moviedb';
import Loading from '../components/loading';
import MovieList from '../components/movieList';
import TrendingMovies from '../components/trendingMovies';

const ios = Platform.OS === 'ios';
type ContentType = 'movie' | 'tv';
type FilterType = 'all' | 'trending' | 'secondary' | 'top_rated';

const HomeScreen = () => {
    const [movieTrending, setMovieTrending] = useState<any[]>([]);
    const [movieUpcoming, setMovieUpcoming] = useState<any[]>([]);
    const [movieTopRated, setMovieTopRated] = useState<any[]>([]);
    const [tvTrending, setTvTrending] = useState<any[]>([]);
    const [tvAiringToday, setTvAiringToday] = useState<any[]>([]);
    const [tvTopRated, setTvTopRated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [homeError, setHomeError] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [contentType, setContentType] = useState<ContentType>('movie');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const router = useRouter();

    useEffect(() => {
        loadHomeData();
    }, []);

    useEffect(() => {
        if (!homeError) return;
        const timer = setTimeout(() => setHomeError(''), 3500);
        return () => clearTimeout(timer);
    }, [homeError]);

    const loadHomeData = async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        else setLoading(true);
        setHomeError('');

        const outcomes = await Promise.all([
            getTrendingMovies(),
            getUpcomingMovies(),
            getTopRatedMovies(),
            getTrendingSeries(),
            getAiringTodaySeries(),
            getTopRatedSeries(),
        ]);
        if (outcomes.some((ok) => !ok)) {
            setHomeError('Some sections failed to update. Pull down to retry.');
        }

        if (isRefreshing) setRefreshing(false);
        else setLoading(false);
    };

    const getTrendingMovies = async () => {
        const data = await fetchTrendingMovies();
        //console.log('got trending movies', data);
        if(data && data.results) {
            setMovieTrending(data.results.map((item: any) => ({ ...item, media_type: 'movie' })));
            return true;
        }
        return false;
    }

    const getUpcomingMovies = async () => {
        const data = await fetchUpcomingMovies();
        //console.log('got upcoming movies', data);
        if(data && data.results) {
            setMovieUpcoming(data.results.map((item: any) => ({ ...item, media_type: 'movie' })));
            return true;
        }
        return false;
    }

    const getTopRatedMovies = async () => {

        const data = await fetchTopRatedMovies();
        //console.log('got top rated movies', data);
        if(data && data.results) {
            setMovieTopRated(data.results.map((item: any) => ({ ...item, media_type: 'movie' })));
            return true;
        }
        return false;
    }
    const getTrendingSeries = async () => {
        const data = await fetchTrendingSeries();
        if (data && data.results) {
            setTvTrending(data.results.map((item: any) => ({ ...item, media_type: 'tv' })));
            return true;
        }
        return false;
    }
    const getAiringTodaySeries = async () => {
        const data = await fetchAiringTodaySeries();
        if (data && data.results) {
            setTvAiringToday(data.results.map((item: any) => ({ ...item, media_type: 'tv' })));
            return true;
        }
        return false;
    }
    const getTopRatedSeries = async () => {
        const data = await fetchTopRatedSeries();
        if (data && data.results) {
            setTvTopRated(data.results.map((item: any) => ({ ...item, media_type: 'tv' })));
            return true;
        }
        return false;
    }

    const isMovie = contentType === 'movie';
    const primaryTrending = isMovie ? movieTrending : tvTrending;
    const secondaryList = isMovie ? movieUpcoming : tvAiringToday;
    const topRatedList = isMovie ? movieTopRated : tvTopRated;
    const secondaryTitle = isMovie ? 'Upcoming' : 'Airing Today';
    const secondaryCategory = isMovie ? 'movie_upcoming' : 'tv_airing_today';
    const topRatedCategory = isMovie ? 'movie_top_rated' : 'tv_top_rated';

    return (
        <View className="flex-1 bg-neutral-800">
            {/* search bar logo */}
            <SafeAreaView className={ios ? "-mb-2" : 'mb-3'}>
                <StatusBar style='light' />
                <View className='mx-4 mt-2 px-3 py-2 rounded-2xl bg-neutral-900/80 border border-neutral-700 flex-row justify-between items-center'>
                    <TouchableOpacity
                        onPress={() => setMenuVisible(true)}
                        className='h-11 w-11 rounded-xl bg-neutral-800 items-center justify-center'
                    >
                        <Bars3CenterLeftIcon size="24" strokeWidth={2.2} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-extrabold tracking-wide">
                        <Text className="text-amber-500">M</Text>ovies
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/searchScreen',
                            })
                        }
                        className='h-11 w-11 rounded-xl bg-neutral-800 items-center justify-center'
                    >
                        <MagnifyingGlassIcon size="24" strokeWidth={2.2} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        {homeError ? (
                            <View className='mx-4 mb-3 rounded-xl bg-red-500/20 px-4 py-3 border border-red-400/40'>
                                <Text className='text-red-200 text-sm'>{homeError}</Text>
                            </View>
                        ) : null}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => loadHomeData(true)}
                                    tintColor="white"
                                />
                            }
                        >
                            <View className='mx-4 mb-4'>
                                <View className='flex-row bg-neutral-900/80 border border-neutral-700 rounded-xl p-1'>
                                    <TouchableOpacity onPress={() => setContentType('movie')} className={`flex-1 py-2 rounded-lg ${isMovie ? 'bg-amber-500' : ''}`}>
                                        <Text className={`text-center font-semibold ${isMovie ? 'text-white' : 'text-neutral-300'}`}>Movies</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setContentType('tv')} className={`flex-1 py-2 rounded-lg ${!isMovie ? 'bg-amber-500' : ''}`}>
                                        <Text className={`text-center font-semibold ${!isMovie ? 'text-white' : 'text-neutral-300'}`}>Series</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10 }}>
                                    {[
                                        { key: 'all', label: 'All' },
                                        { key: 'trending', label: 'Trending' },
                                        { key: 'secondary', label: secondaryTitle },
                                        { key: 'top_rated', label: 'Top Rated' },
                                    ].map((filter) => (
                                        <TouchableOpacity
                                            key={filter.key}
                                            onPress={() => setActiveFilter(filter.key as FilterType)}
                                            className={`mr-2 px-4 py-2 rounded-full border ${activeFilter === filter.key ? 'bg-amber-500 border-amber-500' : 'bg-neutral-900/70 border-neutral-700'}`}
                                        >
                                            <Text className={`text-sm font-semibold ${activeFilter === filter.key ? 'text-white' : 'text-neutral-300'}`}>{filter.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Trending movies carousel */}
                            {(activeFilter === 'all' || activeFilter === 'trending') && primaryTrending.length > 0 && (
                                <TrendingMovies data={primaryTrending} />
                            )}

                            {/* upcoming movies row */}
                            {(activeFilter === 'all' || activeFilter === 'secondary') && secondaryList.length > 0 && (
                                <MovieList
                                    title={secondaryTitle}
                                    data={secondaryList}
                                    seeAllCategory={secondaryCategory}
                                />
                            )}

                            {/* top rated movies row */}
                            {(activeFilter === 'all' || activeFilter === 'top_rated') && topRatedList.length > 0 && (
                                <MovieList
                                    title="Top Rated"
                                    data={topRatedList}
                                    seeAllCategory={topRatedCategory}
                                />
                            )}
                        </ScrollView>
                    </>
                )
            }

            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className='flex-1 bg-black/50'
                    onPress={() => setMenuVisible(false)}
                >
                    <View className='mt-24 mx-4 rounded-2xl bg-neutral-900 border border-neutral-700 p-4'>
                        <Text className='text-white text-lg font-semibold mb-3'>Quick Actions</Text>
                        <TouchableOpacity
                            className='py-3 border-b border-neutral-700'
                            onPress={() => {
                                setMenuVisible(false);
                                router.push('/searchScreen');
                            }}
                        >
                            <Text className='text-neutral-200'>Go to Search</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='py-3 border-b border-neutral-700'
                            onPress={() => {
                                setMenuVisible(false);
                                loadHomeData(true);
                            }}
                        >
                            <Text className='text-neutral-200'>Refresh Home Feed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='py-3'
                            onPress={() => setMenuVisible(false)}
                        >
                            <Text className='text-amber-400'>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>


        </View >

    )
}

export default HomeScreen;
