import { fallbackPersonImage, image185 } from '@/api/moviedb';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const CastMembers = ({ cast }: { cast: any[] }) => {
    const router = useRouter();
    
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
                                onPress={() => {
                                    if (!person?.id) return;
                                    // Opens the dedicated person profile page with TMDB person id.
                                    router.push({
                                        pathname: '/personDetails',
                                        params: { id: String(person.id) },
                                    });
                                }}
                            >
                                <View className='overflow-hidden rounded-full h-20 w-20 items-center border border-neutral-500'>
                                    <Image
                                        className='rounded-2xl h-24 w-20'
                                        source={{uri: image185(person?.profile_path) || fallbackPersonImage}}
                                    />
                                </View>
                                <Text className='text-white text-xs mt-1'>
                                    {
                                        (person?.character || '').length > 10 ? person?.character.slice(0, 10) + '...' : person?.character
                                    }

                                </Text>
                                <Text className='text-neutral-400 text-xs mt-1'>
                                    {
                                        (person?.original_name || '').length > 10 ? person?.original_name.slice(0, 10) + '...' : person?.original_name
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