import { VideoView, useVideoPlayer } from 'expo-video';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type DogAnimationProps = {
  /** Kartın en ölçüsü. Video 16:9 nisbətini avtomatik qoruyur. */
  width?: number;
  /** Komponenti kart və ya menyu bölməsində yerləşdirmək üçün əlavə stil. */
  style?: StyleProp<ViewStyle>;
};

// MP4 faylını bu qovluğa köçürün:
// assets/animations/playful_puppy_loop.mp4
const DOG_VIDEO = require('../assets/animations/playful_puppy_loop.mp4');

export function DogAnimation({ width = 260, style }: DogAnimationProps) {
  const player = useVideoPlayer(DOG_VIDEO, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View style={[styles.container, { width, height: width * (9 / 16) }, style]}>
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
    backgroundColor: '#BDEBFF',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

/*
İSTİFADƏ NÜMUNƏSİ

import { DogAnimation } from './components/DogAnimation';

export default function MovementCard() {
  return <DogAnimation width={280} />;
}
*/
