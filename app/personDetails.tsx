import Loading from '@/components/loading';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieList from '../components/movieList';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';
const verticalMargin = ios ? '' : 'my-3'

const PersonDetails = () => {
    const router = useRouter();
    const [isFavourite, toggleFavourite] = useState(false);
    const personMovies = [1, 2, 3, 4];
    const loading = false;

    return (
        <ScrollView className='flex-1 bg-neutral-900' contentContainerStyle={{ paddingBottom: 20 }}>
            {/* back button */}
            <SafeAreaView className={`absolute z-20 w-full flex-row justify-between items-center px-4 ${verticalMargin}`}>
                <TouchableOpacity onPress={() => router.back()} className='rounded-xl p-1 bg-amber-500'>
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />

                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
                    <HeartIcon size="35" color={isFavourite ? 'red' : "white"} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* person details */}
            {
                loading ? (
                    <Loading />
                ) : (
                    <View>
                        <View className='flex-row justify-center'
                            style={{
                                shadowColor: 'gray',
                                shadowRadius: 40,
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 1
                            }}
                        >
                            <View className='items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-500'>
                                <Image
                                    source={require('../assets/images/movie_poster1.png')}
                                    style={{ height: height * 0.43, width: width * 0.74 }}
                                />
                            </View>
                        </View>

                        <View className='mt-6'>
                            <Text className='text-3xl text-white font-bold text-center'>
                                Keanu Reeves
                            </Text>
                            <Text className='text-base text-neutral-500 text-center'>
                                London, United Kingdom
                            </Text>
                        </View>
                        <View className='mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full'>
                            <View className='border-r-2 border-r-neutral-400 px-2 items-center'>
                                <Text className='text-white font-semibold'>Gender</Text>
                                <Text className='text-neutral-300 text-sm'>Male</Text>
                            </View>
                            <View className='border-r-2 border-r-neutral-400 px-2 items-center'>
                                <Text className='text-white font-semibold'>Birthday</Text>
                                <Text className='text-neutral-300 text-sm'>1964-09-02</Text>
                            </View>
                            <View className='border-r-2 border-r-neutral-400 px-2 items-center'>
                                <Text className='text-white font-semibold'>Known for</Text>
                                <Text className='text-neutral-300 text-sm'>Acting</Text>
                            </View>
                            <View className='px-2 items-center'>
                                <Text className='text-white font-semibold'>Popularity</Text>
                                <Text className='text-neutral-300 text-sm'>64.23</Text>
                            </View>
                        </View>
                        <View className='my-6 mx-4 space-y-2'>
                            <Text className='text-white text-lg'>Biography</Text>
                            <Text className='text-neutral-400 tracking-wide'>
                                Super-Hero partners Scott Lang and Hope van Dyne, along with Hope&apos;s parents Janet van Dyne and Hank Pyth, and Scott&apos;s daughter Cassie Lang, find themselves exploring the Quantum Realm, interacting with stranger new creatures and embarking on an adventure that will push them beyonnd the limits of what they thought possible.
                            </Text>
                        </View>

                        {/* movies */}
                        <MovieList title={'Movies'} hideSeeAll={true} data={personMovies} />

                    </View>
                )
            }

        </ScrollView>
    )
}

export default PersonDetails