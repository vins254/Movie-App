import { fallbackMoviePoster, image185 } from '@/api/moviedb';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width, height } = Dimensions.get('window');


interface MovieListProps {
    title: string;
    data: any[];
    hideSeeAll?: boolean;
    seeAllCategory?: 'movie_upcoming' | 'movie_top_rated' | 'movie_trending' | 'tv_airing_today' | 'tv_top_rated' | 'tv_trending';
}

const MovieList: React.FC<MovieListProps> = ({ title, data, hideSeeAll, seeAllCategory }) => {
    const router = useRouter();
    const handleMoviePress = (item: any) => {
        if (!item?.id) return;
        router.push({
            pathname: '/movieDetails',
            params: item,
        });
    };

    return (
        <View className='mb-8 space-y-4'>
            <View className='mx-4 flex-row justify-between items-center'>
                <Text className='text-white text-xl font-semibold tracking-wide'>
                    {title}
                </Text>
                {
                    !hideSeeAll && seeAllCategory && (
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/seeAll',
                                    params: {
                                        category: seeAllCategory,
                                        title,
                                    },
                                })
                            }
                            className='px-3 py-1 rounded-full border border-amber-500/70 bg-amber-500/10'
                        >
                            <Text className='text-sm font-semibold text-amber-400 tracking-wide'>
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
                                onPress={() => handleMoviePress(item)}
                            >
                                <View className='space-y-2 mr-4'>
                                    <Image
                                        source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
                                        style={{
                                            width: width * 0.33,
                                            height: height * 0.22,
                                        }}
                                        className="rounded-2xl border border-neutral-700"
                                    />


                                    <Text className='text-neutral-300 ml-1 text-xs font-medium tracking-wide'>
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