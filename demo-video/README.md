# Demo Video Package

This folder contains the assets for a sub-5-minute DoraHacks/CROO demo video.

Generated locally:

- `buidl-readiness-demo.avi` - silent English caption demo video, not committed.
- `youtube-cover.png` - 1280x720 upload thumbnail.
- `subtitles.srt` - matching subtitles for YouTube.
- `UPLOAD.zh-CN.md` - beginner-friendly Chinese upload steps.

Regenerate the video package:

```powershell
& "C:\Users\三雨林\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" demo-video\generate_demo_video.py
```

The video intentionally presents the current project as a local-ready CROO provider template. It does not claim live CAP settlement or a live CROO Agent Store listing until those steps are verified in the CROO Dashboard.
