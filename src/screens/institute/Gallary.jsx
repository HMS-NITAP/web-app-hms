import React from 'react';
import { View, Dimensions, Image, FlatList, Animated, StyleSheet } from 'react-native';
import image1 from '../../assets/gallary/img1.jpg';
import image2 from '../../assets/gallary/img2.jpg';
import image3 from '../../assets/gallary/img6.jpg';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Gallery = () => {
    const data = [
        { image: image1 },
        { image: image2 },
        { image: image3 }
    ];

    const { width, height } = Dimensions.get('screen');
    const imageWidth = width * 0.8;
    const imageHeight = height * 0.6;

    const scrollX = React.useRef(new Animated.Value(0)).current;

    return (
        <View style={{ flex : 1, gap : 20, justifyContent:"center" }}>
            <View>
                <AnimatedFlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                renderItem={({ item }) => (
                    <View style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={item.image}
                            style={{ width: imageWidth, height: imageHeight, borderRadius: 10, resizeMode: 'cover' }}
                        />
                    </View>
                )}
            />
            </View>
            <View style={styles.pagination}>
                {data.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const dotOpacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    });

                    return (
                        <Animated.View
                            key={i.toString()}
                            style={[styles.dot, { opacity: dotOpacity }]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#595959',
        marginHorizontal : 5,
    }
});

export default Gallery;
