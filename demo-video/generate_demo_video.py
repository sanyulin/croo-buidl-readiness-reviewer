from __future__ import annotations

import io
import struct
import textwrap
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH = 1280
HEIGHT = 720
FPS = 1
ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "demo-video"
LOGO_PATH = ROOT / "assets" / "buidl-readiness-logo.png"
VIDEO_PATH = OUT_DIR / "buidl-readiness-demo.avi"
COVER_PATH = OUT_DIR / "youtube-cover.png"
SUBTITLE_PATH = OUT_DIR / "subtitles.srt"


@dataclass(frozen=True)
class Slide:
    duration: int
    kicker: str
    title: str
    bullets: tuple[str, ...]
    code: tuple[str, ...] = ()
    caption: str = ""


SLIDES: tuple[Slide, ...] = (
    Slide(
        18,
        "CROO Agent Hackathon Demo",
        "BUIDL Readiness Reviewer",
        (
            "A developer tooling agent for checking hackathon submission readiness.",
            "Repo: github.com/sanyulin/croo-buidl-readiness-reviewer",
            "Status: local demo ready, CROO provider template prepared.",
        ),
        caption="This is BUIDL Readiness Reviewer, a CROO developer tooling agent for hackathon submissions.",
    ),
    Slide(
        24,
        "Problem",
        "Hackathon builders miss submission details",
        (
            "A good idea is not enough for a strong DoraHacks BUIDL.",
            "Builders also need a public repo, README, license, demo video, CAP notes, and store listing.",
            "First-time teams often discover missing requirements too late.",
        ),
        caption="The problem is simple: builders can have working code but still miss required submission evidence.",
    ),
    Slide(
        26,
        "Product",
        "One readiness report before submission",
        (
            "The agent reviews repo and project details.",
            "It returns a score, blockers, quick fixes, checklist items, CAP notes, and a demo script.",
            "The output is designed for both humans and other CROO agents.",
        ),
        code=(
            "type ReviewReport = {",
            "  score: number;",
            "  blockers: string[];",
            "  quickFixes: string[];",
            "  submissionChecklist: string[];",
            "  capIntegrationNotes: string[];",
            "  demoScript: string;",
            "};",
        ),
        caption="The result is a structured ReviewReport that turns submission rules into clear next actions.",
    ),
    Slide(
        24,
        "GitHub Package",
        "Open-source project assets are ready",
        (
            "README explains the product value, setup, demo flow, and CROO integration path.",
            "MIT license is included for open-source eligibility.",
            "The project logo is included under assets/buidl-readiness-logo.png.",
        ),
        code=(
            "Repository",
            "https://github.com/sanyulin/croo-buidl-readiness-reviewer",
            "",
            "Core files",
            "README.md  LICENSE  src/  submission/  assets/",
        ),
        caption="The public GitHub repository contains the README, license, source code, submission copy, and logo.",
    ),
    Slide(
        44,
        "Local Demo",
        "Build and run the reviewer",
        (
            "The local demo shows the submission-review workflow without requiring secrets.",
            "The pre-submit gate confirms the project is conditionally feasible.",
            "The demo command prints the full ReviewReport JSON.",
        ),
        code=(
            "$ pnpm build",
            "> tsc -p tsconfig.json",
            "",
            "$ pnpm pre-submit",
            "> verdict: CONDITIONALLY_FEASIBLE",
            "",
            "$ pnpm demo",
            "> score, blockers, quickFixes, submissionChecklist,",
            "> capIntegrationNotes, demoScript",
        ),
        caption="The local commands are pnpm build, pnpm pre-submit, and pnpm demo.",
    ),
    Slide(
        40,
        "Review Output",
        "The agent returns actionable submission evidence",
        (
            "Blockers show what could prevent a valid submission.",
            "Quick fixes prioritize the fastest improvements.",
            "CAP integration notes explain what remains before a live CROO store launch.",
        ),
        code=(
            "{",
            '  "score": 80,',
            '  "blockers": ["CROO Agent Store listing not verified"],',
            '  "quickFixes": ["Upload a sub-5-minute demo video"],',
            '  "submissionChecklist": ["Public repo", "README", "MIT license"],',
            '  "capIntegrationNotes": ["Wire handleBuidlReview into provider callback"],',
            '  "demoScript": "Problem, product, local demo, CROO integration..."',
            "}",
        ),
        caption="The output makes it obvious what is ready and what still needs evidence.",
    ),
    Slide(
        38,
        "CROO Service Design",
        "Reusable handler for Provider integration",
        (
            "src/croo/service.ts defines the service name, price, input schema, and output schema.",
            "handleBuidlReview() is the function to connect to the official provider callback.",
            "Requester and Provider templates are included for follow-up CROO Dashboard testing.",
        ),
        code=(
            'export const SERVICE_NAME = "BUIDL Readiness Reviewer";',
            'export const SERVICE_PRICE_USDC = "0.10";',
            "",
            "export async function handleBuidlReview(input) {",
            "  return reviewBuidlReadiness(input, { fetchRepoSignals: false });",
            "}",
        ),
        caption="The service layer is separated so it can be wired into the CROO provider SDK callback.",
    ),
    Slide(
        34,
        "Security",
        "Secrets stay local and out of the video",
        (
            "The repository commits .env.example only.",
            "Real CROO_API_KEY values must stay in local .env.",
            "No GitHub token, wallet private key, or CROO key is shown or committed.",
        ),
        code=(
            "CROO_API_URL=https://api.croo.network",
            "CROO_WS_URL=wss://api.croo.network/ws",
            "CROO_API_KEY=croo_sk_replace_with_dashboard_key",
            "CROO_TARGET_SERVICE_ID=replace_with_target_service_id",
        ),
        caption="The demo uses placeholders only. Real keys are never pasted into chat, code, screenshots, or the video.",
    ),
    Slide(
        24,
        "Honest Current Status",
        "Template-ready, not claiming live CAP yet",
        (
            "This version is a complete local MVP and submission helper.",
            "Prize-critical CROO evidence still needs Dashboard verification.",
            "Once Provider Online and Requester success are captured, the video can be updated.",
        ),
        caption="The current video is honest: local demo ready, provider template prepared, live CAP evidence still pending.",
    ),
    Slide(
        18,
        "Close",
        "Why this helps CROO",
        (
            "It helps builders submit cleaner BUIDLs with fewer missing requirements.",
            "It can become a paid developer tooling agent on CROO.",
            "Next: register in CROO Agent Store and verify the Provider/Requester flow.",
        ),
        caption="BUIDL Readiness Reviewer helps CROO builders turn submission requirements into a clear, callable review.",
    ),
)


def font(size: int, *, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    candidates = []
    if mono:
        candidates = [
            r"C:\Windows\Fonts\consola.ttf",
            r"C:\Windows\Fonts\cascadiacode.ttf",
        ]
    elif bold:
        candidates = [
            r"C:\Windows\Fonts\seguisb.ttf",
            r"C:\Windows\Fonts\arialbd.ttf",
        ]
    else:
        candidates = [
            r"C:\Windows\Fonts\segoeui.ttf",
            r"C:\Windows\Fonts\arial.ttf",
        ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


FONT_KICKER = font(22, bold=True)
FONT_TITLE = font(54, bold=True)
FONT_BODY = font(29)
FONT_CODE = font(24, mono=True)
FONT_SMALL = font(19)
FONT_CAPTION = font(26, bold=True)


def text_width(draw: ImageDraw.ImageDraw, value: str, used_font: ImageFont.ImageFont) -> int:
    bbox = draw.textbbox((0, 0), value, font=used_font)
    return bbox[2] - bbox[0]


def wrap_by_pixels(draw: ImageDraw.ImageDraw, value: str, used_font: ImageFont.ImageFont, max_width: int) -> list[str]:
    output: list[str] = []
    for paragraph in value.split("\n"):
        if not paragraph:
            output.append("")
            continue
        words = paragraph.split(" ")
        current = ""
        for word in words:
            candidate = word if not current else f"{current} {word}"
            if text_width(draw, candidate, used_font) <= max_width:
                current = candidate
            else:
                if current:
                    output.append(current)
                    current = word
                else:
                    output.extend(textwrap.wrap(word, width=28))
                    current = ""
        if current:
            output.append(current)
    return output


def rounded_rectangle(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def load_logo(size: int) -> Image.Image:
    if LOGO_PATH.exists():
        logo = Image.open(LOGO_PATH).convert("RGBA")
        logo.thumbnail((size, size), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (255, 255, 255, 0))
        canvas.alpha_composite(logo, ((size - logo.width) // 2, (size - logo.height) // 2))
        return canvas
    fallback = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    draw = ImageDraw.Draw(fallback)
    draw.ellipse((24, 24, size - 24, size - 24), fill=(19, 115, 71), outline=(7, 44, 30), width=6)
    draw.text((size // 2 - 42, size // 2 - 22), "BRR", fill=(255, 255, 255), font=font(36, bold=True))
    return fallback


def draw_slide(slide: Slide, second: int, total_seconds: int, absolute_second: int) -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), (248, 250, 247))
    draw = ImageDraw.Draw(img)

    draw.rectangle((0, 0, WIDTH, 92), fill=(12, 36, 29))
    draw.rectangle((0, HEIGHT - 94, WIDTH, HEIGHT), fill=(12, 36, 29))
    draw.rectangle((0, 92, 18, HEIGHT - 94), fill=(42, 166, 97))
    draw.rectangle((18, 92, 23, HEIGHT - 94), fill=(236, 199, 76))

    logo = load_logo(118)
    img.paste(logo, (WIDTH - 158, 18), logo)

    draw.text((54, 26), slide.kicker.upper(), fill=(151, 240, 185), font=FONT_KICKER)
    draw.text((54, 122), slide.title, fill=(8, 34, 27), font=FONT_TITLE)

    y = 214
    for bullet in slide.bullets:
        wrapped = wrap_by_pixels(draw, bullet, FONT_BODY, 690)
        draw.ellipse((58, y + 10, 72, y + 24), fill=(42, 166, 97))
        line_y = y
        for line in wrapped:
            draw.text((88, line_y), line, fill=(32, 44, 42), font=FONT_BODY)
            line_y += 39
        y = line_y + 18

    code_x, code_y, code_w, code_h = 745, 175, 470, 360
    if slide.code:
        rounded_rectangle(draw, (code_x, code_y, code_x + code_w, code_y + code_h), 18, (17, 28, 31), (42, 166, 97), 2)
        draw.rectangle((code_x, code_y, code_x + code_w, code_y + 42), fill=(24, 48, 43))
        draw.ellipse((code_x + 18, code_y + 15, code_x + 30, code_y + 27), fill=(255, 95, 87))
        draw.ellipse((code_x + 40, code_y + 15, code_x + 52, code_y + 27), fill=(255, 189, 46))
        draw.ellipse((code_x + 62, code_y + 15, code_x + 74, code_y + 27), fill=(39, 201, 63))
        draw.text((code_x + 96, code_y + 11), "demo", fill=(187, 211, 203), font=FONT_SMALL)
        line_y = code_y + 66
        for line in slide.code:
            for wrapped_line in wrap_by_pixels(draw, line, FONT_CODE, code_w - 44):
                draw.text((code_x + 24, line_y), wrapped_line, fill=(228, 241, 234), font=FONT_CODE)
                line_y += 31
                if line_y > code_y + code_h - 36:
                    break
            if line_y > code_y + code_h - 36:
                break
    else:
        rounded_rectangle(draw, (770, 204, 1150, 476), 26, (255, 255, 255), (203, 224, 212), 2)
        big_logo = load_logo(194)
        img.paste(big_logo, (863, 228), big_logo)
        draw.text((844, 438), "Developer Tooling Agent", fill=(18, 80, 56), font=font(25, bold=True))

    caption = slide.caption
    caption_lines = wrap_by_pixels(draw, caption, FONT_CAPTION, 1120)
    caption_y = HEIGHT - 78
    for line in caption_lines[:2]:
        draw.text((54, caption_y), line, fill=(245, 252, 247), font=FONT_CAPTION)
        caption_y += 33

    progress_w = int((absolute_second + 1) / total_seconds * WIDTH)
    draw.rectangle((0, HEIGHT - 8, WIDTH, HEIGHT), fill=(27, 68, 55))
    draw.rectangle((0, HEIGHT - 8, progress_w, HEIGHT), fill=(151, 240, 185))
    timestamp = f"{absolute_second // 60}:{absolute_second % 60:02d} / {total_seconds // 60}:{total_seconds % 60:02d}"
    draw.text((WIDTH - 154, HEIGHT - 58), timestamp, fill=(188, 214, 204), font=FONT_SMALL)
    return img


def riff_chunk(fourcc: bytes, payload: bytes) -> bytes:
    pad = b"\x00" if len(payload) % 2 else b""
    return fourcc + struct.pack("<I", len(payload)) + payload + pad


def riff_list(list_type: bytes, payload: bytes) -> bytes:
    data = list_type + payload
    pad = b"\x00" if len(data) % 2 else b""
    return b"LIST" + struct.pack("<I", len(data)) + data + pad


def write_mjpeg_avi(path: Path, frames: list[bytes]) -> None:
    total_frames = len(frames)
    max_frame_size = max(len(frame) for frame in frames)
    microseconds_per_frame = int(1_000_000 / FPS)
    max_bytes_per_second = max_frame_size * FPS

    avih = struct.pack(
        "<IIIIIIIIII4I",
        microseconds_per_frame,
        max_bytes_per_second,
        0,
        0x10,
        total_frames,
        0,
        1,
        max_frame_size,
        WIDTH,
        HEIGHT,
        0,
        0,
        0,
        0,
    )

    strh = struct.pack(
        "<4s4sIHHIIIIIIIIiiii",
        b"vids",
        b"MJPG",
        0,
        0,
        0,
        0,
        1,
        FPS,
        0,
        total_frames,
        max_frame_size,
        0xFFFFFFFF,
        0,
        0,
        0,
        WIDTH,
        HEIGHT,
    )

    strf = struct.pack(
        "<IiiHH4sIiiII",
        40,
        WIDTH,
        HEIGHT,
        1,
        24,
        b"MJPG",
        max_frame_size,
        0,
        0,
        0,
        0,
    )

    hdrl = riff_list(b"hdrl", riff_chunk(b"avih", avih) + riff_list(b"strl", riff_chunk(b"strh", strh) + riff_chunk(b"strf", strf)))

    movi_payload = bytearray()
    index_payload = bytearray()
    for frame in frames:
        offset = 4 + len(movi_payload)
        movi_payload.extend(riff_chunk(b"00dc", frame))
        index_payload.extend(struct.pack("<4sIII", b"00dc", 0x10, offset, len(frame)))

    movi = riff_list(b"movi", bytes(movi_payload))
    idx1 = riff_chunk(b"idx1", bytes(index_payload))
    riff_payload = b"AVI " + hdrl + movi + idx1
    path.write_bytes(b"RIFF" + struct.pack("<I", len(riff_payload)) + riff_payload)


def format_srt_time(seconds: int) -> str:
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d},000"


def write_subtitles() -> None:
    current = 0
    blocks: list[str] = []
    for index, slide in enumerate(SLIDES, start=1):
        start = current
        end = current + slide.duration
        blocks.append(f"{index}\n{format_srt_time(start)} --> {format_srt_time(end)}\n{slide.caption}\n")
        current = end
    SUBTITLE_PATH.write_text("\n".join(blocks), encoding="utf-8")


def make_frames() -> list[bytes]:
    total_seconds = sum(slide.duration for slide in SLIDES)
    frames: list[bytes] = []
    absolute_second = 0
    for slide in SLIDES:
        for second in range(slide.duration):
            image = draw_slide(slide, second, total_seconds, absolute_second)
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG", quality=88, optimize=True)
            frames.append(buffer.getvalue())
            absolute_second += 1
    return frames


def main() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    cover = draw_slide(SLIDES[0], 0, sum(slide.duration for slide in SLIDES), 0)
    cover.save(COVER_PATH, format="PNG", optimize=True)
    write_subtitles()
    frames = make_frames()
    write_mjpeg_avi(VIDEO_PATH, frames)
    print(f"Generated: {VIDEO_PATH}")
    print(f"Generated: {COVER_PATH}")
    print(f"Generated: {SUBTITLE_PATH}")
    print(f"Duration: {len(frames) // FPS}s")


if __name__ == "__main__":
    main()
