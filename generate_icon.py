#!/usr/bin/env python3
"""
앱 아이콘 생성 스크립트
YouTube 플레이 버튼 + 문서 아이콘 조합
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_app_icon(size):
    """앱 아이콘 생성"""
    # 배경 생성 (그라데이션 효과)
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 배경 - 부드러운 그라데이션 (연한 빨간색)
    for i in range(size):
        alpha = int(255 * (1 - i / size * 0.3))
        color = (255, 240, 240, alpha)
        draw.rectangle([0, i, size, i+1], fill=color)
    
    # 둥근 사각형 배경
    padding = size // 10
    draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=size // 8,
        fill=(255, 255, 255, 255),
        outline=(220, 220, 220, 255),
        width=2
    )
    
    # YouTube 플레이 버튼 (빨간색 둥근 사각형)
    youtube_size = size // 2
    youtube_x = size // 4
    youtube_y = size // 3
    
    # YouTube 빨간 배경
    draw.rounded_rectangle(
        [youtube_x, youtube_y, youtube_x + youtube_size, youtube_y + youtube_size * 0.7],
        radius=size // 16,
        fill=(255, 0, 0, 255)
    )
    
    # 흰색 플레이 버튼 (삼각형)
    play_size = youtube_size // 3
    play_x = youtube_x + youtube_size // 2 - play_size // 3
    play_y = youtube_y + youtube_size * 0.35
    
    triangle = [
        (play_x, play_y - play_size // 2),
        (play_x, play_y + play_size // 2),
        (play_x + play_size, play_y)
    ]
    draw.polygon(triangle, fill=(255, 255, 255, 255))
    
    # 문서 아이콘 (아래쪽)
    doc_width = size // 2.5
    doc_height = size // 3
    doc_x = size // 2 - doc_width // 2
    doc_y = size * 0.55
    
    # 문서 배경
    draw.rectangle(
        [doc_x, doc_y, doc_x + doc_width, doc_y + doc_height],
        fill=(240, 240, 240, 255),
        outline=(100, 100, 100, 255),
        width=2
    )
    
    # 문서 접힌 모서리
    corner_size = doc_width // 5
    corner_points = [
        (doc_x + doc_width - corner_size, doc_y),
        (doc_x + doc_width, doc_y + corner_size),
        (doc_x + doc_width - corner_size, doc_y + corner_size)
    ]
    draw.polygon(corner_points, fill=(200, 200, 200, 255))
    
    # 문서 내용 (선)
    line_width = doc_width * 0.6
    line_x = doc_x + doc_width * 0.2
    line_spacing = doc_height // 6
    
    for i in range(3):
        line_y = doc_y + doc_height * 0.3 + i * line_spacing
        draw.rectangle(
            [line_x, line_y, line_x + line_width, line_y + 2],
            fill=(150, 150, 150, 255)
        )
    
    return img

def generate_all_icons():
    """모든 크기의 아이콘 생성"""
    # Android 아이콘 크기
    android_sizes = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192
    }
    
    # 아이콘 생성 경로
    base_path = '/Users/seonggukpark/youtube-summarizer/frontend/android/app/src/main/res'
    
    for folder, size in android_sizes.items():
        # 디렉토리 생성
        dir_path = os.path.join(base_path, folder)
        os.makedirs(dir_path, exist_ok=True)
        
        # 일반 아이콘
        icon = create_app_icon(size)
        icon_path = os.path.join(dir_path, 'ic_launcher.png')
        icon.save(icon_path, 'PNG')
        print(f"생성: {icon_path} ({size}x{size})")
        
        # 둥근 아이콘 (동일한 이미지 사용)
        round_icon_path = os.path.join(dir_path, 'ic_launcher_round.png')
        icon.save(round_icon_path, 'PNG')
        print(f"생성: {round_icon_path} ({size}x{size})")
    
    # 플레이스토어용 고해상도 아이콘
    store_icon = create_app_icon(512)
    store_path = os.path.join(base_path, '..', '..', 'ic_launcher-playstore.png')
    store_icon.save(store_path, 'PNG')
    print(f"생성: {store_path} (512x512)")

if __name__ == '__main__':
    try:
        generate_all_icons()
        print("\n✅ 모든 아이콘이 성공적으로 생성되었습니다!")
    except Exception as e:
        print(f"\n❌ 아이콘 생성 중 오류 발생: {e}")