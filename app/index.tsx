import Loading from '@/components/loading';
import MovieList from '@/components/movieList';
import TrendingMovies from '@/components/trendingMovies';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

const ios = Platform.OS === 'ios';

const HomeScreen = () => {
    const trending = [
        { title: 'Ant-Man and the Wasp' },
        { title: 'Thor: Love and Thunder' },
        { title: 'Black Panther' }
    ];
    const upcoming = [
        { title: 'Spider-Man: No Way Home' },
        { title: 'Doctor Strange' },
        { title: 'Eternals' }
    ];
    const topRated = [1, 2, 3];
    const loading = false;
    const router = useRouter();

    return (
        <View className="flex-1 bg-neutral-800">
            {/* search bar logo */}
            <SafeAreaView className={ios ? "-mb-2" : 'mb-3'}>
                <StatusBar style='light' />
                <View className='flex-row justify-between items-center mx-4'>
                    <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
                    <Text className="text-white text-3xl font-bold">
                        <Text className="text-amber-500">M</Text>ovies
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/searchScreen',
                            })
                        }>
                        <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {
                loading ? (
                    <Loading />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    >
                        {/* Trending movies carousel */}
                        <TrendingMovies data={trending} />

                        {/* upcoming movies row */}
                        <MovieList title="Upcoming" data={upcoming} />

                        {/* top rated movies row */}
                        <MovieList title="Top Rated" data={topRated} />
                    </ScrollView>
                )
            }


        </View >

    )
}

export default HomeScreen;
