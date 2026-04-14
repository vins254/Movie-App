import { fallbackMoviePoster, image185, searchMovies } from '@/api/moviedb';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { HomeIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

const SearchScreen = () => {
    const router = useRouter();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchError, setSearchError] = useState('');
    const skeletonOpacity = useRef(new Animated.Value(0.4)).current;
    const handleOpenMovie = (item: any) => {
        if (!item?.id) return;
        router.push({
            pathname: '/movieDetails',
            params: item,
        });
    };

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(skeletonOpacity, {
                    toValue: 1,
                    duration: 650,
                    useNativeDriver: true,
                }),
                Animated.timing(skeletonOpacity, {
                    toValue: 0.4,
                    duration: 650,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [skeletonOpacity]);

    useEffect(() => {
        if (!searchError) return;
        const timer = setTimeout(() => setSearchError(''), 3500);
        return () => clearTimeout(timer);
    }, [searchError]);

    const handleSearch = async (value: string) => {
        //console.log('value: ', value);
        setSearchError('');
        if (value && value.length>2){
            setLoading(true);
            try {
                const data = await searchMovies({
                    query:value,
                    include_adults: 'false',
                    language: 'en-US',
                    page: '1'
                });
                setLoading(false);
                //console.log('got movies: ',data);
                if(data && data.results) setResults(data.results);
                else {
                    setResults([]);
                    setSearchError('Unable to fetch search results right now.');
                }
            } catch (e) {
                setLoading(false);
                setResults([]);
                setSearchError('Unable to fetch search results right now.');
            }
        }else {
            setLoading(false);
            setResults([]);
            setSearchError('');
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    return (
        <SafeAreaView className='bg-neutral-800 flex-1'>
            <View className='mx-4 mt-2 mb-3 px-3 py-2 rounded-2xl bg-neutral-900/80 border border-neutral-700 flex-row justify-between items-center'>
                <TouchableOpacity onPress={() => router.push('/')} className='h-10 w-10 rounded-xl bg-neutral-800 items-center justify-center'>
                    <HomeIcon size="21" color="white" />
                </TouchableOpacity>
                <TextInput
                    value={searchText}
                    onChangeText={(text) => {
                        setSearchText(text);
                        handleTextDebounce(text);
                    }}
                    placeholder='Search Movie'
                    placeholderTextColor={'lightgray'}
                    className='pb-1 pl-4 flex-1 text-base font-semibold text-white tracking-wider'
                />
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/',
                        })
                    }
                    className='h-10 w-10 rounded-xl bg-neutral-800 items-center justify-center'
                >
                    <XMarkIcon size="21" color="white" />
                </TouchableOpacity>
            </View>

            {/* results */}
            {searchError ? (
                <View className='mx-4 mb-3 rounded-xl bg-red-500/20 px-4 py-3 border border-red-400/40'>
                    <Text className='text-red-200 text-sm'>{searchError}</Text>
                </View>
            ) : null}

            {
                loading ? (
                    <View className='px-4 pt-2'>
                        <Text className='text-neutral-300 mb-3'>Searching...</Text>
                        <View className='flex-row flex-wrap justify-between'>
                            {[0, 1, 2, 3].map((item) => (
                                <Animated.View key={item} className='mb-4' style={{ opacity: skeletonOpacity }}>
                                    <View className='bg-neutral-700 rounded-3xl' style={{ width: width * 0.44, height: height * 0.3 }} />
                                    <View className='bg-neutral-700 rounded-md mt-2 ml-1' style={{ width: width * 0.35, height: 14 }} />
                                </Animated.View>
                            ))}
                        </View>
                    </View>
                ) :

                    results.length > 0 ? (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                            className='space-y-3'
                        >
                            <Text className='text-white font-semibold ml-1'>
                                Results ({results.length})
                            </Text>
                            <View className="flex-row justify-between flex-wrap">
                                {
                                    results.map((item: any, index: number) => {
                                        return (
                                            <TouchableWithoutFeedback
                                                key={index}
                                                onPress={() => handleOpenMovie(item)}
                                            >
                                                <View className='space-y-2 mb-4'>
                                                    <Image className='rounded-3xl'
                                                        //source={require('../assets/images/movie_poster2.jpg')}
                                                        source={{ uri: image185(item?.poster_path ?? null) || fallbackMoviePoster }}
                                                        style={{ width: width * 0.44, height: height * 0.3 }}
                                                    />
                                                    <Text className='text-neutral-300 ml-1'>
                                                        {
                                                            item?.title.length > 22 ? item?.title.slice(0, 22) + '...' : item?.title
                                                        }
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    ) : searchText.length > 2 ? (
                        <View className="flex-1 justify-center items-center px-4">
                            <Image
                                className="h-64 w-64 opacity-90"
                                resizeMode="contain"
                                source={require('../assets/images/movie_poster3.png')}
                            />

                            <Text className="mt-6 text-lg font-semibold text-white text-center">
                                No results found
                            </Text>

                            <Text className="mt-2 text-gray-400 text-sm text-center">
                                Try searching for another movie
                            </Text>
                        </View>
                    ) : (
                        <View className="flex-1 justify-center items-center px-6">
                            <Text className="text-neutral-300 text-base text-center">
                                Type at least 3 characters to search.
                            </Text>
                            <Text className="mt-2 text-gray-500 text-sm text-center">
                                Example: Interstellar, Dune, or Inception
                            </Text>
                        </View>
                    )
            }



        </SafeAreaView>
    )
}

export default SearchScreen