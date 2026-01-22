// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";

// 이미지 포맷: PNG (무손실)
Config.setVideoImageFormat("png");

// 출력 덮어쓰기 허용
Config.setOverwriteOutput(true);

// 렌더링 시 CLI 옵션으로 고품질 설정 가능:
// npx remotion render SelfHelpCritiqueV2 out/video.mp4 --codec h264 --crf 18
// npx remotion render SelfHelpCritiqueV2 out/video.mov --codec prores --prores-profile 4444
