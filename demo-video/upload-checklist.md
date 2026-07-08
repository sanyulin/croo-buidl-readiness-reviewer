# Upload Checklist

## Before Upload

- Run `pnpm build`.
- Run `pnpm pre-submit`.
- Run `pnpm demo`.
- Regenerate the video with `python demo-video/generate_demo_video.py`.
- Open the generated video locally and confirm it plays.
- Confirm no API key, GitHub token, wallet private key, or seed phrase appears in the video.
- Confirm the video does not claim live CROO CAP settlement unless Dashboard evidence is included.

## YouTube Studio

- Upload `demo-video/buidl-readiness-demo.avi`.
- Add thumbnail `demo-video/youtube-cover.png`.
- Add `demo-video/subtitles.srt` as English subtitles.
- Use the title and description from `demo-video/youtube-metadata.md`.
- Set visibility to `Unlisted`.
- Copy the final YouTube URL.

## After Upload

- Open the YouTube URL in a private or logged-out browser window.
- Confirm it is not `Private`.
- Paste the URL into the DoraHacks BUIDL demo video field.
- Keep the GitHub repository URL as `https://github.com/sanyulin/croo-buidl-readiness-reviewer`.

