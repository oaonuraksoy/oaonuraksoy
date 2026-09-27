#!/usr/bin/env python3
"""
prnu_sensor_noise_injector.py
Production Engineering Tool — Anti-Detection Media Pipeline

Injects deterministic CMOS camera sensor noise (Photo-Response Non-Uniformity - PRNU)
and ISO-dependent photon shot noise into synthetic AI renders (FLUX, Midjourney, SDXL)
to bypass automated content moderation, Coordinated Inauthentic Behavior (CIB) filters,
and platform synthetic perceptual scanners.

Usage:
  python prnu_sensor_noise_injector.py -i input.png -o output.jpg --iso 400 --seed 42
"""

import argparse
import sys
import os

try:
    import numpy as np
except ImportError:
    print("Error: numpy is required. Install with: pip install numpy", file=sys.stderr)
    sys.exit(1)

try:
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False
    try:
        from PIL import Image
    except ImportError:
        print("Error: Either opencv-python or Pillow is required. Install with: pip install opencv-python Pillow", file=sys.stderr)
        sys.exit(1)


def inject_prnu(
    image_path: str,
    output_path: str,
    iso_level: int = 400,
    prnu_sigma: float = 1.85,
    camera_seed: int = 42,
    jpeg_quality: int = 97
) -> bool:
    """
    Applies deterministic PRNU sensor fingerprint and ISO photon shot noise to an image.
    """
    if not os.path.exists(image_path):
        print(f"Error: Input file not found: {image_path}", file=sys.stderr)
        return False

    print(f"[*] Processing image: {image_path}")
    print(f"[*] Parameters: ISO={iso_level}, PRNU Sigma={prnu_sigma}, Camera Seed={camera_seed}")

    if HAS_CV2:
        img = cv2.imread(image_path)
        if img is None:
            print(f"Error: Could not decode image with OpenCV: {image_path}", file=sys.stderr)
            return False
        img = img.astype(np.float32)
        h, w, c = img.shape
    else:
        pil_img = Image.open(image_path).convert('RGB')
        img = np.array(pil_img, dtype=np.float32)
        h, w, c = img.shape

    # 1. Deterministic Sensor Matrix (Fixed silicon defect pattern per camera body)
    np.random.seed(camera_seed)
    prnu_pattern = np.random.normal(0, prnu_sigma, (h, w, c)).astype(np.float32)

    # 2. Shot Noise Dependent on Pixel Luminance and Sensor ISO
    shot_scale = np.sqrt(np.maximum(img, 0.0) * (iso_level / 100.0) * 0.012)
    np.random.seed(None)
    shot_noise = np.random.normal(0, 1.0, (h, w, c)).astype(np.float32) * shot_scale

    # 3. Superposition & Dynamic Range Clamping
    synthesized = img + prnu_pattern + shot_noise
    synthesized = np.clip(synthesized, 0.0, 255.0).astype(np.uint8)

    # 4. Export with High-Fidelity Quantization
    out_dir = os.path.dirname(output_path)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir, exist_ok=True)

    if HAS_CV2:
        ext = os.path.splitext(output_path)[1].lower()
        if ext in ('.jpg', '.jpeg'):
            cv2.imwrite(output_path, synthesized, [cv2.IMWRITE_JPEG_QUALITY, jpeg_quality])
        else:
            cv2.imwrite(output_path, synthesized)
    else:
        out_pil = Image.fromarray(synthesized)
        out_pil.save(output_path, quality=jpeg_quality, optimize=True)

    print(f"[✓] Hardened render successfully saved to: {output_path}")
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Injects CMOS sensor PRNU noise into synthetic AI renders."
    )
    parser.add_argument("-i", "--input", required=True, help="Path to input synthetic render (PNG/JPG)")
    parser.add_argument("-o", "--output", required=True, help="Path to output sensor-injected image")
    parser.add_argument("--iso", type=int, default=400, help="Camera ISO sensitivity (default: 400)")
    parser.add_argument("--prnu-sigma", type=float, default=1.85, help="PRNU sensor noise amplitude (default: 1.85)")
    parser.add_argument("--seed", type=int, default=42, help="Fixed camera silicon seed for multi-shot consistency")
    parser.add_argument("--quality", type=int, default=97, help="Output JPEG quality (1-100, default: 97)")

    args = parser.parse_args()
    success = inject_prnu(
        image_path=args.input,
        output_path=args.output,
        iso_level=args.iso,
        prnu_sigma=args.prnu_sigma,
        camera_seed=args.seed,
        jpeg_quality=args.quality
    )
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
