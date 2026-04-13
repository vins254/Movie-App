import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import CastMembers from '../components/castMembers';
import Loading from '../components/loading';
import MovieList from '../components/movieList';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : 'mt-3';

const MovieDetails = () => {
    const { params: item } = useRoute();
    const router = useRouter();
    const [isFavourite, toggleFavourite] = useState(false);
    const cast = [1, 2, 3, 4, 5];
    const similarMovies = [1, 2, 3, 4, 5];
    const loading = false;

    let movieName = 'Ant-Man and the Wasp';

    useEffect(() => {
        //call the movie details api
    }, [item])
    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            className='flex-1 bg-neutral-900'
        >

            {/* back button and movie poster */}
            <View className='w-full'>
                <SafeAreaView className={`absolute z-20 w-full flex-row justify-between items-center px-4 ${topMargin}`}>
                    <TouchableOpacity onPress={() => router.back()} className='rounded-xl p-1 bg-amber-500'>
                        <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
                        <HeartIcon size="35" color={isFavourite ? theme.background : "white"} />
                    </TouchableOpacity>
                </SafeAreaView>

                {
                    loading ? (
                        <Loading />
                    ) : (
                        <View>
                            <Image
                                source={require('../assets/images/movie_poster1.png')}
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
            <View style={{ marginTop: -(height * 0.09) }} className='space-y-3'>
                {/* title */}
                <Text className='text-white text-center text-3xl font-bold tracking-wider'>
                    {movieName}
                </Text>
                {/* status, release, runtime */}
                <Text className='text-neutral-400 font-semibold text-base text-center'>
                    Released . 2020 . 170 min
                </Text>

                {/* genres */}
                <View className='flex-row justify-center mx-4 space-x-2'>
                    <Text className='text-neutral-400 font-semibold text-base text-center'>
                        Action .
                    </Text>
                    <Text className='text-neutral-400 font-semibold text-base text-center'>
                        Thrill .
                    </Text>
                    <Text className='text-neutral-400 font-semibold text-base text-center'>
                        Comedy .
                    </Text>
                </View>
                {/* desription */}
                <Text className='text-neutral-400 mx-4 tracking tracking-wide'>
                    Super-Hero partners Scott Lang and Hope van Dyne, along with Hope&apos;s parents Janet van Dyne and Hank Pyth, and Scott&apos;s daughter Cassie Lang, find themselves exploring the Quantum Realm, interacting with stranger new creatures and embarking on an adventure that will push them beyonnd the limits of what they thought possible.
                </Text>
            </View>

            {/* cast members */}
            <CastMembers cast={cast} />

            {/* similar movies */}
            <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovies} />
        </ScrollView >
    )
}

export default MovieDetails