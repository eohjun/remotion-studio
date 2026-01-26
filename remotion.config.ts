// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";

// 이미지 포맷: PNG (무손실)
Config.setVideoImageFormat("png");

// 출력 덮어쓰기 허용
Config.setOverwriteOutput(true);

// BT.709 컬러 스페이스 설정 (정확한 색재현)
// 대부분의 HD 콘텐츠 및 YouTube에서 사용하는 표준 컬러 스페이스
Config.setColorSpace("bt709");

// 하드웨어 가속 (가능한 경우 사용)
// macOS에서 VideoToolbox, Windows에서 NVENC 등 활용
// Config.setHardwareAcceleration("if-possible");

// 고품질 렌더링 예시:
// npx remotion render SelfHelpCritiqueV2 out/video.mp4 --codec h264 --crf 18 --color-space bt709
// npx remotion render SelfHelpCritiqueV2 out/video.mov --codec prores --prores-profile 4444
// npx remotion render SelfHelpCritiqueV2 out/video.mp4 --codec h265 --crf 20 --color-space bt709
