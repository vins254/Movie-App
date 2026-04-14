import { fallbackMoviePoster, fetchAiringTodaySeries, fetchTopRatedMovies, fetchTopRatedSeries, fetchTrendingMovies, fetchTrendingSeries, fetchUpcomingMovies, image185 } from '@/api/moviedb';
import Loading from '@/components/loading';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ChevronLeftIcon, HomeIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type SeeAllRouteParams = {
    params: {
        category: 'movie_upcoming' | 'movie_top_rated' | 'movie_trending' | 'tv_airing_today' | 'tv_top_rated' | 'tv_trending';
        title?: string;
    };
};

const CARD_HEIGHT = height * 0.3 + 46;

// Memoized card keeps FlatList updates fast on long infinite-scroll feeds.
const MovieGridCard = React.memo(({ item, onPress }: { item: any; onPress: (item: any) => void }) => {
    return (
        <TouchableWithoutFeedback onPress={() => onPress(item)}>
            <View className='mb-5'>
                <Image
                    source={{ uri: image185(item?.poster_path ?? null) || fallbackMoviePoster }}
                    style={{ width: width * 0.44, height: height * 0.3 }}
                    className='rounded-2xl border border-neutral-700'
                />
                <Text className='text-neutral-300 mt-2 ml-1 text-xs font-medium tracking-wide'>
                    {(item?.title || item?.name)?.length > 22 ? (item.title || item.name).slice(0, 22) + '...' : (item?.title || item?.name)}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
});

const SeeAll = () => {
    const router = useRouter();
    const { params } = useRoute<RouteProp<SeeAllRouteParams, 'params'>>();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [movies, setMovies] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const openMovieDetails = useCallback((item: any) => {
        if (!item?.id) return;
        router.push({
            pathname: '/movieDetails',
            params: item,
        });
    }, [router]);

    const screenTitle = params?.title || 'Movies';

    useEffect(() => {
        // Reset pagination when category changes (e.g., Movie Top Rated -> TV Trending).
        setMovies([]);
        setPage(1);
        setTotalPages(1);
        loadMovies(1, true);
    }, [params?.category]);

    const loadMovies = async (targetPage: number, reset = false) => {
        if (reset) {
            setLoading(true);
            setErrorMessage('');
        } else {
            setLoadingMore(true);
        }
        let data: any = {};

        if (params?.category === 'movie_upcoming') data = await fetchUpcomingMovies(targetPage);
        else if (params?.category === 'movie_top_rated') data = await fetchTopRatedMovies(targetPage);
        else if (params?.category === 'movie_trending') data = await fetchTrendingMovies(targetPage);
        else if (params?.category === 'tv_airing_today') data = await fetchAiringTodaySeries(targetPage);
        else if (params?.category === 'tv_top_rated') data = await fetchTopRatedSeries(targetPage);
        else data = await fetchTrendingSeries(targetPage);

        if (data?.results) {
            // Normalize item shape so downstream screens can route by media_type.
            const mediaType = params?.category?.startsWith('tv_') ? 'tv' : 'movie';
            const normalized = data.results.map((item: any) => ({ ...item, media_type: mediaType }));
            setMovies((prev) => (reset ? normalized : [...prev, ...normalized]));
            setPage(targetPage);
            setTotalPages(data.total_pages || 1);
        } else if (reset) {
            setErrorMessage('Unable to load movies right now.');
        }

        if (reset) setLoading(false);
        setLoadingMore(false);
    };

    const loadMoreMovies = useCallback(() => {
        // Guard against duplicate requests and stop at API last page.
        if (loading || loadingMore) return;
        if (page >= totalPages) return;
        loadMovies(page + 1);
    }, [loading, loadingMore, page, totalPages]);

    const renderMovieItem = useCallback(({ item }: { item: any }) => (
        <MovieGridCard item={item} onPress={openMovieDetails} />
    ), [openMovieDetails]);

    const keyExtractor = useCallback((item: any, index: number) => `${item?.id ?? 'movie'}-${index}`, []);

    return (
        <View className='flex-1 bg-neutral-900'>
            <SafeAreaView className='mb-3'>
                <View className='flex-row items-center justify-between mx-4 mt-2 px-3 py-2 rounded-2xl bg-neutral-900/80 border border-neutral-700'>
                    <TouchableOpacity onPress={() => router.back()} className='h-11 w-11 rounded-xl bg-neutral-800 items-center justify-center'>
                        <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
                    </TouchableOpacity>
                    <Text className='text-white text-xl font-semibold tracking-wide'>{screenTitle}</Text>
                    <TouchableOpacity onPress={() => router.push('/')} className='h-11 w-11 rounded-xl bg-neutral-800 items-center justify-center'>
                        <HomeIcon size="24" color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {loading ? (
                <Loading />
            ) : errorMessage ? (
                <View className='items-center justify-center px-8'>
                    <Text className='text-neutral-300 text-center'>{errorMessage}</Text>
                    <TouchableOpacity onPress={() => loadMovies(1, true)} className='mt-4 rounded-full bg-amber-500 px-5 py-2'>
                        <Text className='text-white font-semibold'>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={movies}
                    keyExtractor={keyExtractor}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 25 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMoreMovies}
                    onEndReachedThreshold={0.4}
                    initialNumToRender={10}
                    maxToRenderPerBatch={8}
                    windowSize={7}
                    removeClippedSubviews
                    getItemLayout={(_, index) => ({
                        length: CARD_HEIGHT,
                        offset: CARD_HEIGHT * Math.floor(index / 2),
                        index,
                    })}
                    ListFooterComponent={
                        loadingMore ? (
                            <View className='py-4'>
                                <ActivityIndicator size="small" color="#f59e0b" />
                            </View>
                        ) : null
                    }
                    renderItem={renderMovieItem}
                />
            )}
        </View>
    );
};

export default SeeAll;
