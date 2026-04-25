// Mock react-native-gesture-handler (must come before any import that touches it)
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: require('react-native').ScrollView,
    Slider: View,
    Switch: View,
    TextInput: require('react-native').TextInput,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: require('react-native').FlatList,
    gestureHandlerRootHOC: jest.fn((component) => component),
    Directions: {},
    Gesture: {
      Pan: jest.fn().mockReturnThis(),
      Tap: jest.fn().mockReturnThis(),
      onStart: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
    },
    GestureDetector: View,
  };
});

// Mock react-native-worklets (must come before reanimated)
jest.mock('react-native-worklets', () => ({
  init: jest.fn(),
  createWorklet: jest.fn(),
  defaultContext: {},
}));

// Mock react-native-reanimated with inline mock (avoid requiring reanimated/mock
// which triggers native module resolution for worklets)
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  const noOp = () => {};
  const returnSelf = (v) => v;
  const mockSharedValue = (initialValue) => ({
    value: initialValue,
    addListener: noOp,
    removeListener: noOp,
    modify: noOp,
  });
  const mockAnimation = {
    duration: jest.fn().mockReturnThis(),
    delay: jest.fn().mockReturnThis(),
    springify: jest.fn().mockReturnThis(),
    damping: jest.fn().mockReturnThis(),
    stiffness: jest.fn().mockReturnThis(),
    mass: jest.fn().mockReturnThis(),
    overshootClamping: jest.fn().mockReturnThis(),
    restDisplacementThreshold: jest.fn().mockReturnThis(),
    restSpeedThreshold: jest.fn().mockReturnThis(),
    easing: jest.fn().mockReturnThis(),
    build: jest.fn(),
  };
  return {
    __esModule: true,
    default: {
      createAnimatedComponent: (comp) => comp,
      addWhitelistedNativeProps: noOp,
      addWhitelistedUIProps: noOp,
      View,
      Text: require('react-native').Text,
      Image: require('react-native').Image,
      ScrollView: require('react-native').ScrollView,
      FlatList: require('react-native').FlatList,
    },
    useSharedValue: mockSharedValue,
    useAnimatedStyle: (cb) => cb(),
    useAnimatedProps: (cb) => cb(),
    useDerivedValue: (cb) => ({ value: cb() }),
    useAnimatedScrollHandler: () => noOp,
    useAnimatedGestureHandler: () => ({}),
    useAnimatedRef: () => ({ current: null }),
    useAnimatedReaction: noOp,
    withTiming: returnSelf,
    withSpring: returnSelf,
    withDecay: returnSelf,
    withDelay: (_delay, anim) => anim,
    withSequence: (...args) => args[0],
    withRepeat: (anim) => anim,
    cancelAnimation: noOp,
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    createAnimatedComponent: (comp) => comp,
    interpolate: jest.fn(),
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    Easing: {
      linear: returnSelf,
      ease: returnSelf,
      bezier: () => returnSelf,
      in: returnSelf,
      out: returnSelf,
      inOut: returnSelf,
    },
    FadeIn: mockAnimation,
    FadeOut: mockAnimation,
    FadeInDown: mockAnimation,
    FadeInUp: mockAnimation,
    FadeOutDown: mockAnimation,
    FadeOutUp: mockAnimation,
    SlideInRight: mockAnimation,
    SlideOutRight: mockAnimation,
    SlideInLeft: mockAnimation,
    SlideOutLeft: mockAnimation,
    ZoomIn: mockAnimation,
    ZoomOut: mockAnimation,
    Layout: mockAnimation,
    LinearTransition: mockAnimation,
    EntryExitTransition: mockAnimation,
    combineTransition: mockAnimation,
    ReduceMotion: { System: 0, Always: 1, Never: 2 },
    measure: jest.fn(() => ({
      x: 0, y: 0, width: 100, height: 100, pageX: 0, pageY: 0,
    })),
    scrollTo: noOp,
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const View = require('react-native').View;
  return {
    enableScreens: jest.fn(),
    Screen: View,
    ScreenContainer: View,
    ScreenStack: View,
    ScreenStackHeaderConfig: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    SearchBarCommands: {},
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 0, height: 0 };
  const SafeAreaInsetsContext = React.createContext(insets);
  const SafeAreaFrameContext = React.createContext(frame);
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(insets),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    SafeAreaView: require('react-native').View,
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    initialWindowMetrics: { insets, frame },
  };
});

// Mock @react-native-community/blur
jest.mock('@react-native-community/blur', () => ({
  BlurView: require('react-native').View,
}));

// Mock react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => {
  return require('react-native').View;
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: View,
    Svg: View,
    Circle: View,
    Rect: View,
    Path: View,
    G: View,
    Defs: View,
    LinearGradient: View,
    Stop: View,
    ClipPath: View,
    Line: View,
    Polygon: View,
    Polyline: View,
    Text: View,
  };
});

// Mock phosphor-react-native
jest.mock('phosphor-react-native', () => {
  const View = require('react-native').View;
  return new Proxy(
    {},
    {
      get: () => View,
    },
  );
});
