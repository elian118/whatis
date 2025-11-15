from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch
import requests
import io

# 모델 및 프로세서 로드
# LOCAL_MODEL_PATH = "./models/vit-base-patch16-224"
HUB_MODEL_ID = 'google/vit-base-patch16-224'

# 서버 시작 시 한 번만 로드되도록 전역 변수로 설정
try:
    processor = ViTImageProcessor.from_pretrained(HUB_MODEL_ID)
    model = ViTForImageClassification.from_pretrained(HUB_MODEL_ID)
    print(f"Service 계층: 모델 로드 완료 ({HUB_MODEL_ID})")
except Exception as e:
    # 로컬 모델 경로가 잘못되었거나 파일이 없을 경우 대비
    print(f"경고: 로컬 모델 로드 실패. 허깅페이스 허브에서 로드 시도 중: {e}")
    processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
    model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')
    print("Service 계층: 허브 모델 로드 완료")


def classify_image(image_input: bytes) -> str:
    """
    이미지 바이트 데이터를 입력받아 predicted_label 리턴

    Args:
        image_input: 이미지 파일의 바이트 데이터.

    Returns:
        예측된 클래스 레이블 문자열.
    """
    try:
        # 1. 이미지 바이트를 PIL Image 객체로 변환
        image = Image.open(io.BytesIO(image_input))

        # 2. 이미지 전처리
        inputs = processor(images=image, return_tensors="pt")

        # 3. 모델 예측
        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()

        # 4. 레이블 리턴
        predicted_label = model.config.id2label[predicted_class_idx]
        return predicted_label

    except Exception as e:
        print(f"이미지 분류 중 오류 발생: {e}")
        return "Classification Error"