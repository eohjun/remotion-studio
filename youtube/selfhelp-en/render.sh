#!/bin/bash
# YouTube 영상 렌더링 스크립트

echo "🎬 영상 렌더링 시작..."
npx remotion render SelfHelpCritiqueEN youtube/selfhelp-en/video_1080p.mp4 --width=1920 --height=1080 --crf=18
echo "✅ 렌더링 완료: youtube/selfhelp-en/video_1080p.mp4"

echo "🖼️  썸네일 생성 중..."
npx remotion still SelfHelpCritiqueEN youtube/selfhelp-en/thumbnail.png --frame=60
echo "✅ 썸네일 생성 완료"
