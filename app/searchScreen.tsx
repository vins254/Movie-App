import Loading from '@/components/loading';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SearchScreen = () => {
    const router = useRouter();
    const results = [1, 2, 3, 4];
    const loading = false;
    let movieName = 'Ant-Man and the Wasp: Quantumania';


    return (
        <SafeAreaView className='bg-neutral-800 flex-1'>
            <View className='mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full'>
                <TextInput
                    placeholder='Search Movie'
                    placeholderTextColor={'lightgray'}
                    className='pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider'
                />
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/',
                        })
                    }
                    className='rounded-full p-3 m-1 bg-neutral-500'
                >
                    <XMarkIcon size="25" color="white" />
                </TouchableOpacity>
            </View>

            {/* results */}

            {
                loading ? (
                    <Loading />
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
                                                onPress={() => router.push({
                                                    pathname: '/movieDetails',
                                                    params: item
                                                })}
                                            >
                                                <View className='space-y-2 mb-4'>
                                                    <Image className='rounded-3xl'
                                                        source={require('../assets/images/movie_poster2.jpg')}
                                                        style={{ width: width * 0.44, height: height * 0.3 }}
                                                    />
                                                    <Text className='text-neutral-300 ml-1'>
                                                        {
                                                            movieName.length > 22 ? movieName.slice(0, 22) + '...' : movieName
                                                        }
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    ) : (
                        <View className='flex-row justify-center'>
                            <Image className='h-96 w-96'
                                source={require('../assets/images/movie_poster1.png')}
                            />
                        </View>
                    )
            }



        </SafeAreaView>
    )
}

export default SearchScreen