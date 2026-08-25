import React from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  source: number;
  width?: number;
  square?: boolean;
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Plays a short looping real-animal clip. Muted by default since screens often show several at once. */
export default function AnimalVideo({ source, width = 96, square, muted = true, style }: Props) {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.muted = muted;
    player.play();
  });

  return (
    <View style={[styles.container, { width, height: square ? width : width * (9 / 16) }, style]}>
      <VideoView
        player={player}
        style={styles.video}
        nativeControls={false}
        contentFit="cover"
        allowsPictureInPicture={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
