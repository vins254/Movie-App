import { fallbackMoviePoster, image500 } from '@/api/moviedb';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width, height } = Dimensions.get('window');

type CarouselItemProps = {
    item: any;
    animationValue: SharedValue<number>;
    onPress: () => void;
};

const TrendingMovies = ({ data }: { data: any[] }) => {
    const router = useRouter();

    const handleClick = (item: any) => {
        if (!item?.id) return;
        router.push({
            pathname: '/movieDetails',
            params: item,
        });
    };

    return (
        <View className="mb-0">
            <Text className="text-white text-xl mx-4 mb-5">Trending</Text>
            <Carousel
                loop
                autoPlay
                defaultIndex={1}
                width={width}
                height={height * 0.45}
                data={data}
                scrollAnimationDuration={1800}
                style={{
                    overflow: 'visible'
                }}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: width * 0.45,
                }}
                renderItem={({ item, animationValue }) => {
                    return (
                        <CarouselItem
                            item={item}
                            animationValue={animationValue}
                            onPress={() => handleClick(item)}
                        />
                    );
                }}
            />
        </View>
    );
};

const CarouselItem = ({ item, animationValue, onPress }: CarouselItemProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(animationValue.value, [-1, 0, 1], [0.88, 1, 0.88]);
        const opacity = interpolate(animationValue.value, [-1, 0, 1], [0.6, 1, 0.6]);

        return {
            width,
            alignItems: 'center',
            transform: [{ perspective: 1000 }, { scale }],
            opacity,
        };
    }, [animationValue]);

    return (
        <Animated.View style={animatedStyle}>
            <MovieCard item={item} handleClick={onPress} />
        </Animated.View>
    );
};

const MovieCard = ({ item, handleClick }: { item: any, handleClick: () => void }) => {
    return (
        <TouchableWithoutFeedback onPress={handleClick}>
            <Image
                // source={require('../assets/images/movie_poster1.png')}
                source={{ uri: image500(item.poster_path) || fallbackMoviePoster }}
                style={{
                    width: width * 0.62,
                    height: height * 0.4,
                }}
                className="rounded-3xl"
            />
        </TouchableWithoutFeedback>
    );
};

export default TrendingMovies;