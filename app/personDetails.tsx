import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image342 } from '@/api/moviedb';
import Loading from '@/components/loading';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, HomeIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieList from '../components/movieList';


const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';
const verticalMargin = ios ? '' : 'my-3'

type PersonDetailsData = {
    name?: string;
    place_of_birth?: string;
    gender?: number;
    birthday?: string;
    known_for_department?: string;
    popularity?: number;
    biography?: string;
    profile_path?: string | null;
};

type PersonRouteParams = {
    params: {
        id: string | number;
    };
};

const PersonDetails = () => {
    const { params: item } = useRoute<RouteProp<PersonRouteParams, 'params'>>();
    const router = useRouter();
    const [isFavourite, toggleFavourite] = useState(false);
    const [personMovies, setPersonMovies] = useState([]);
    const [person, setPerson] = useState<PersonDetailsData>({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=> {
        setLoading(true);
        //console.log('person: ',item);
        const parsedId = typeof item?.id === 'string' ? Number(item.id) : item?.id;
        if (!parsedId || Number.isNaN(parsedId)) {
            setLoading(false);
            setErrorMessage('Invalid person selected.');
            return;
        }
        setErrorMessage('');
        getPersonDetails(parsedId);
        getPersonMovies(parsedId);
    },[item]);

    const getPersonDetails = async (id: number) => {
        const data = await fetchPersonDetails(id);
        //console.log('got person details: ',data);
        if(data && data.id) setPerson(data);
        else setErrorMessage('Unable to load person details right now.');
        setLoading(false);
    }

    const getPersonMovies = async (id: number) => {
        const data = await fetchPersonMovies(id);
        //console.log('got person movies: ',data);
        if(data && data.cast) setPersonMovies(data.cast);
    }

    return (
        <ScrollView className='flex-1 bg-neutral-900' contentContainerStyle={{ paddingBottom: 20 }}>
            {/* back button */}
            <SafeAreaView className={`absolute z-20 w-full flex-row justify-between items-center px-4 ${verticalMargin}`}>
                <TouchableOpacity onPress={() => router.back()} className='h-11 w-11 rounded-xl bg-neutral-900/85 border border-neutral-600 items-center justify-center'>
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />

                </TouchableOpacity>
                <View className='flex-row items-center gap-3'>
                    <TouchableOpacity onPress={() => router.push('/')} className='h-11 w-11 rounded-xl bg-neutral-900/85 border border-neutral-600 items-center justify-center'>
                        <HomeIcon size="24" color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)} className='h-11 w-11 rounded-xl bg-neutral-900/85 border border-neutral-600 items-center justify-center'>
                        <HeartIcon size="24" color={isFavourite ? 'red' : "white"} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* person details */}
            {
                loading ? (
                    <Loading />
                ) : errorMessage ? (
                    <View className='items-center justify-center py-24 px-8'>
                        <Text className='text-neutral-300 text-base text-center'>{errorMessage}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                const parsedId = typeof item?.id === 'string' ? Number(item.id) : item?.id;
                                if (parsedId && !Number.isNaN(parsedId)) {
                                    setLoading(true);
                                    setErrorMessage('');
                                    getPersonDetails(parsedId);
                                    getPersonMovies(parsedId);
                                }
                            }}
                            className='mt-4 rounded-full bg-amber-500 px-5 py-2'
                        >
                            <Text className='text-white font-semibold'>Retry</Text>
                        </TouchableOpacity>
                    </View>
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
                                    source={{ uri: image342(person?.profile_path ?? null) || fallbackPersonImage }}
                                    style={{ height: height * 0.43, width: width * 0.74 }}
                                />
                            </View>
                        </View>

                        <View className='mt-6'>
                            <Text className='text-3xl text-white font-bold text-center'>
                                {person?.name}
                            </Text>
                            <Text className='text-base text-neutral-500 text-center'>
                                {person?.place_of_birth}
                            </Text>
                        </View>
                        <View className='mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-800 border border-neutral-700 rounded-2xl'>
                            <View className='border-r-2 border-r-neutral-400 px-2 items-center'>
                                <Text className='text-white font-semibold'>Gender</Text>
                                <Text className='text-neutral-300 text-sm'>
                                    {
                                        person?.gender==1? 'Female': 'Male'
                                    }
                                </Text>
                            </View>
                            <View className='border-r-2 border-r-neutral-400 px-2 items-center'>
                                <Text className='text-white font-semibold'>Birthday</Text>
                                <Text className='text-neutral-300 text-sm'>{person?.birthday}</Text>
                            </View>
                            <View className='border-r-2 border-r-neutral-400 px-2 items-center'>
                                <Text className='text-white font-semibold'>Known for</Text>
                                <Text className='text-neutral-300 text-sm'>{person?.known_for_department}</Text>
                            </View>
                            <View className='px-2 items-center'>
                                <Text className='text-white font-semibold'>Popularity</Text>
                                <Text className='text-neutral-300 text-sm'>{person?.popularity?.toFixed(2)} %</Text>
                            </View>
                        </View>
                        <View className='my-6 mx-4 space-y-2'>
                            <Text className='text-white text-lg'>Biography</Text>
                            <Text className='text-neutral-400 tracking-wide'>
                                {
                                    person?.biography || 'N/A'
                                }
                            </Text>
                        </View>

                        {/* movies */}
                        {personMovies.length > 0 && <MovieList title={'Movies'} hideSeeAll={true} data={personMovies} />}

                    </View>
                )
            }

        </ScrollView>
    )
}

export default PersonDetails