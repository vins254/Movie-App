import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width, height } = Dimensions.get('window');


interface MovieListProps {
    title: string;
    data: any[];
    hideSeeAll?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ title, data, hideSeeAll }) => {
    const router = useRouter();

    return (
        <View className='mb-8 space-y-4'>
            <View className='mx-4 flex-row justify-between items-center'>
                <Text className='text-white text-xl'>
                    {title}
                </Text>
                {
                    !hideSeeAll && (
                        <TouchableOpacity>
                            <Text className='text-lg text-amber-500'>
                                See All
                            </Text>
                        </TouchableOpacity>
                    )
                }

            </View>

            {/* movie row */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {
                    data.map((item: any, index: number) => {
                        // In a real app, item would have a title property
                        const movieName = typeof item === 'string' ? item : (item.title || 'Movie Title');

                        return (
                            <TouchableWithoutFeedback
                                key={index}
                                onPress={() => router.push({
                                    pathname: '/movieDetails',
                                    params: item
                                })}
                            >
                                <View className='space-y-1 mr-4'>
                                    <Image
                                        source={require('../assets/images/movie_poster2.jpg')}
                                        style={{
                                            width: width * 0.33,
                                            height: height * 0.22,
                                        }}
                                        className="rounded-3xl"
                                    />


                                    <Text className='text-neutral-300 ml-1'>
                                        {movieName.length > 14 ? movieName.slice(0, 14) + '...' : movieName}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }

            </ScrollView>
        </View>
    )
}

export default MovieList;