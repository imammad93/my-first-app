import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, PanResponder } from 'react-native';
import { Bbox, FIT_PADDING, MAX_SCALE, MIN_SCALE, VB_WIDTH, ZOOM_STEP } from './mapData';

function distance(t1: { pageX: number; pageY: number }, t2: { pageX: number; pageY: number }): number {
  return Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
}

export function useMapTransform() {
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [zoomed, setZoomed] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const scaleRef = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const gestureBase = useRef({ scale: 1, x: 0, y: 0, pinchDist: 0 });

  useEffect(() => {
    scale.addListener(({ value }) => (scaleRef.current = value));
    translateX.addListener(({ value }) => (translateRef.current.x = value));
    translateY.addListener(({ value }) => (translateRef.current.y = value));
    return () => {
      scale.removeAllListeners();
      translateX.removeAllListeners();
      translateY.removeAllListeners();
    };
  }, [scale, translateX, translateY]);

  const pxPerUnit = frameSize.width > 0 ? frameSize.width / VB_WIDTH : 0;

  const animateTo = (nextScale: number, nextX: number, nextY: number, duration: number) => {
    Animated.parallel([
      Animated.timing(scale, { toValue: nextScale, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(translateX, { toValue: nextX, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(translateY, { toValue: nextY, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  };

  const fitToBbox = (bb: Bbox, duration: number) => {
    if (pxPerUnit <= 0) return;
    const wPx = (bb.maxX - bb.minX) * pxPerUnit * FIT_PADDING;
    const hPx = (bb.maxY - bb.minY) * pxPerUnit * FIT_PADDING;
    const targetScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, Math.min(frameSize.width / Math.max(wPx, 1), frameSize.height / Math.max(hPx, 1)))
    );
    const centerXpx = ((bb.minX + bb.maxX) / 2) * pxPerUnit;
    const centerYpx = ((bb.minY + bb.maxY) / 2) * pxPerUnit;
    // The animated view's transform-origin defaults to its own center (frameSize/2,
    // not the top-left corner), so translate must compensate for that origin offset
    // in addition to recentering on the target — otherwise small/high-zoom countries
    // end up translated far outside the visible frame.
    const targetX = targetScale * (frameSize.width / 2 - centerXpx);
    const targetY = targetScale * (frameSize.height / 2 - centerYpx);
    setZoomed(true);
    animateTo(targetScale, targetX, targetY, duration);
  };

  const resetView = (duration: number) => {
    setZoomed(false);
    animateTo(1, 0, 0, duration);
  };

  const zoomByStep = (direction: 1 | -1) => {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleRef.current * (direction === 1 ? ZOOM_STEP : 1 / ZOOM_STEP)));
    setZoomed(next > 1.01);
    animateTo(next, translateRef.current.x, translateRef.current.y, 260);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gesture) => {
        const touches = evt.nativeEvent.touches;
        return touches.length === 2 || Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8;
      },
      onPanResponderGrant: (evt) => {
        gestureBase.current.scale = scaleRef.current;
        gestureBase.current.x = translateRef.current.x;
        gestureBase.current.y = translateRef.current.y;
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          gestureBase.current.pinchDist = distance(touches[0], touches[1]);
        }
      },
      onPanResponderMove: (evt, gesture) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2 && gestureBase.current.pinchDist > 0) {
          const newDist = distance(touches[0], touches[1]);
          const ratio = newDist / gestureBase.current.pinchDist;
          const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, gestureBase.current.scale * ratio));
          scale.setValue(nextScale);
        } else if (touches.length === 1) {
          translateX.setValue(gestureBase.current.x + gesture.dx);
          translateY.setValue(gestureBase.current.y + gesture.dy);
        }
      },
      onPanResponderRelease: () => {
        setZoomed(scaleRef.current > 1.01);
      },
    })
  ).current;

  const onFrameLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setFrameSize({ width, height });
  };

  return { scale, translateX, translateY, zoomed, fitToBbox, resetView, zoomByStep, panHandlers: panResponder.panHandlers, onFrameLayout };
}
