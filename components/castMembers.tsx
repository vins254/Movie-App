import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
const CastMembers = ({ cast }: { cast: any[] }) => {
    const router = useRouter();
    let personName = 'Keanu Reevs';
    let characterName = 'John Wick';



    return (
        <View className='my-6'>
            <Text className='text-white text-lg mx-4 mb-5'>
                Top Cast
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {
                    cast && cast.map((person, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                className='mr-4 items-center'
                                onPress={() =>
                                    router.push({
                                        pathname: '/personDetails',
                                        params: { id: String(index) },
                                    })
                                }
                            >
                                <View className='overflow-hidden rounded-full h-20 w-20 items-center border border-neutral-500'>
                                    <Image
                                        className='rounded-2xl h-24 w-20'
                                        source={require('../assets/images/movie_poster1.png')}
                                    />
                                </View>
                                <Text className='text-white text-xs mt-1'>
                                    {
                                        characterName.length > 10 ? characterName.slice(0, 10) + '...' : characterName
                                    }

                                </Text>
                                <Text className='text-neutral-400 text-xs mt-1'>
                                    {
                                        personName.length > 10 ? personName.slice(0, 10) + '...' : personName
                                    }

                                </Text>
                            </TouchableOpacity>
                        )
                    })
                }

            </ScrollView>

        </View>
    )
};

export default CastMembers;