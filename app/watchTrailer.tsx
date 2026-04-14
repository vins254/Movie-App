import { RouteProp, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, HomeIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

type WatchTrailerRouteParams = {
    params: {
        key: string;
        title?: string;
    };
};

const WatchTrailer = () => {
    const router = useRouter();
    const { params } = useRoute<RouteProp<WatchTrailerRouteParams, 'params'>>();
    const trailerKey = params?.key;
    const title = params?.title || 'Trailer';
    const [embedError, setEmbedError] = React.useState('');
    const fallbackWatchUrl = trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : '';

    const openInYouTube = async () => {
        if (!fallbackWatchUrl) return;
        await Linking.openURL(fallbackWatchUrl);
    };

    if (!trailerKey) {
        return (
            <View className='flex-1 bg-neutral-900 items-center justify-center px-6'>
                <Text className='text-neutral-300 text-center'>Trailer is not available.</Text>
                <TouchableOpacity onPress={() => router.back()} className='mt-4 rounded-full bg-amber-500 px-5 py-2'>
                    <Text className='text-white font-semibold'>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className='flex-1 bg-black'>
            <SafeAreaView className='px-4 py-2'>
                <View className='flex-row items-center justify-between px-3 py-2 rounded-2xl bg-neutral-900/80 border border-neutral-700'>
                    <TouchableOpacity onPress={() => router.back()} className='h-11 w-11 rounded-xl bg-neutral-800 items-center justify-center'>
                        <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
                    </TouchableOpacity>
                    <Text className='text-white font-semibold text-base' numberOfLines={1}>{title}</Text>
                    <TouchableOpacity onPress={() => router.push('/')} className='h-11 w-11 rounded-xl bg-neutral-800 items-center justify-center'>
                        <HomeIcon size="24" color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <WebView
                source={{ uri: `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&playsinline=1` }}
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled
                domStorageEnabled
                style={{ flex: 1 }}
                onHttpError={() => setEmbedError('This trailer cannot be embedded in-app.')}
                onError={() => setEmbedError('Playback failed in-app for this trailer.')}
            />
            {embedError ? (
                <View className='absolute bottom-6 left-4 right-4 rounded-xl bg-neutral-900/95 border border-neutral-700 px-4 py-3'>
                    <Text className='text-neutral-200 text-sm'>{embedError}</Text>
                    <TouchableOpacity onPress={openInYouTube} className='mt-3 rounded-full bg-amber-500 px-4 py-2 self-start'>
                        <Text className='text-white font-semibold'>Open in YouTube</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
};

export default WatchTrailer;
