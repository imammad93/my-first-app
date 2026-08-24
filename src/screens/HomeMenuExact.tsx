import React, { useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

type MenuRoute =
  | "word-train"
  | "motion-quiz"
  | "numbers"
  | "colors"
  | "world"
  | "compare"
  | "falling-letters"
  | "math"
  | "clock"
  | "shapes"
  | "home"
  | "achievements"
  | "learn"
  | "daily"
  | "store"
  | "parent"
  | "gift"
  | "music"
  | "settings";

type Props = {
  onNavigate?: (route: MenuRoute) => void;
};

type Hotspot = {
  route: MenuRoute;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

const HOTSPOTS: Hotspot[] = [
  { route: "gift", label: "Hədiyyə", left: 58.0, top: 2.0, width: 6.5, height: 10.5 },
  { route: "music", label: "Musiqi", left: 81.0, top: 2.5, width: 7.5, height: 10.5 },
  { route: "settings", label: "Ayarlar", left: 89.5, top: 2.5, width: 7.0, height: 10.5 },

  { route: "word-train", label: "Söz qatarı", left: 6.5, top: 25.0, width: 16.8, height: 28.0 },
  { route: "motion-quiz", label: "Hərəkəti tap", left: 24.0, top: 25.0, width: 16.2, height: 28.0 },
  { route: "numbers", label: "Sayıları öyrən", left: 41.0, top: 25.0, width: 16.2, height: 28.0 },
  { route: "colors", label: "Rənglər", left: 58.5, top: 25.0, width: 15.0, height: 28.0 },
  { route: "world", label: "Dünyanı kəşf et", left: 75.0, top: 25.0, width: 16.5, height: 28.0 },

  { route: "compare", label: "Daha çox və ya az", left: 6.5, top: 55.0, width: 16.8, height: 27.0 },
  { route: "falling-letters", label: "Hərf yarpaqları", left: 24.0, top: 55.0, width: 16.2, height: 27.0 },
  { route: "math", label: "Hesabla", left: 41.0, top: 55.0, width: 16.2, height: 27.0 },
  { route: "clock", label: "Saatı öyrən", left: 58.5, top: 55.0, width: 15.0, height: 27.0 },
  { route: "shapes", label: "Formalar", left: 75.0, top: 55.0, width: 16.5, height: 27.0 },

  { route: "home", label: "Əsas səhifə", left: 4.0, top: 84.0, width: 14.0, height: 15.5 },
  { route: "achievements", label: "Nailiyyətlər", left: 20.0, top: 84.0, width: 14.0, height: 15.5 },
  { route: "learn", label: "Öyrən", left: 36.0, top: 84.0, width: 13.5, height: 15.5 },
  { route: "daily", label: "Gündəlik", left: 51.0, top: 84.0, width: 13.5, height: 15.5 },
  { route: "store", label: "Mağaza", left: 66.0, top: 84.0, width: 13.5, height: 15.5 },
  { route: "parent", label: "Valideyn", left: 81.0, top: 84.0, width: 15.0, height: 15.5 },
];

export default function HomeMenuExact({ onNavigate }: Props) {
  const { width } = useWindowDimensions();
  const [pressedRoute, setPressedRoute] = useState<MenuRoute | null>(null);

  const canvasWidth = Math.min(width, 1536);
  const canvasHeight = canvasWidth / 1.5;

  const safeNavigate = (route: MenuRoute) => {
    if (onNavigate) {
      onNavigate(route);
      return;
    }
    console.log("[Öyrən və Oyna] navigate:", route);
  };

  const hotspots = useMemo(() => HOTSPOTS, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]}>
          <ImageBackground
            source={require("./assets/menu/menu-home.png")}
            resizeMode="contain"
            style={styles.image}
          >
            {hotspots.map((item) => {
              const isPressed = pressedRoute === item.route;
              return (
                <Pressable
                  key={`${item.route}-${item.label}`}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  onPressIn={() => setPressedRoute(item.route)}
                  onPressOut={() => setPressedRoute(null)}
                  onPress={() => safeNavigate(item.route)}
                  style={[
                    styles.hotspot,
                    {
                      left: `${item.left}%`,
                      top: `${item.top}%`,
                      width: `${item.width}%`,
                      height: `${item.height}%`,
                    },
                    isPressed && styles.hotspotPressed,
                  ]}
                />
              );
            })}
          </ImageBackground>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#5BCBFF",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5BCBFF",
  },
  canvas: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#5BCBFF",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  hotspot: {
    position: "absolute",
    borderRadius: 20,
  },
  hotspotPressed: {
    backgroundColor: "rgba(255,255,255,0.14)",
    transform: [{ scale: 0.975 }],
  },
});
