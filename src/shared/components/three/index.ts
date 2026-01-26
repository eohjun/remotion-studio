/**
 * Three.js 3D Components for Remotion
 *
 * Provides 3D visualization capabilities using @remotion/three.
 *
 * @example
 * import { ThreeCanvas, DeviceMockup, Text3D } from './shared/components/three';
 *
 * <ThreeCanvas cameraPosition={[0, 0, 5]}>
 *   <DeviceMockup device="phone" />
 *   <Text3D text="Hello" position={[0, 2, 0]} />
 * </ThreeCanvas>
 */

// Canvas wrapper
export { ThreeCanvas } from "./ThreeCanvas";
export type { ThreeCanvasProps } from "./ThreeCanvas";

// 3D Text components
export { Text3D, FloatingText3D } from "./Text3D";
export type { Text3DProps, FloatingText3DProps } from "./Text3D";

// Device mockup components
export {
  DeviceMockup,
  PhoneMockup,
  TabletMockup,
  LaptopMockup,
} from "./DeviceMockup";
export type { DeviceMockupProps, DeviceType } from "./DeviceMockup";

// Lazy-loaded versions (for performance optimization)
export {
  LazyThreeCanvas,
  LazyText3D,
  LazyFloatingText3D,
  LazyDeviceMockup,
  DelayedThreeCanvas,
  ThreeLoadingPlaceholder,
  preloadThreeComponents,
  usePreloadThree,
} from "./LazyThree";
