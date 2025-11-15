from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch
import requests
import io

# 1. 모델이 다운로드된 로컬 폴더 경로
LOCAL_MODEL_PATH = "../models/vit-base-patch16-224"

# 2. 테스트에 사용할 이미지 준비 (로컬 파일이나 웹에서 임시 다운로드)
# 여기서는 테스트를 위해 이전처럼 웹에서 임시 이미지를 가져옵니다.
# 실제 서비스에서는 'Image.open("your_local_image.jpg")'를 사용합니다.
try:
    url = 'http://images.cocodataset.org/val2017/000000039769.jpg'
    image_data = requests.get(url).content
    image = Image.open(io.BytesIO(image_data))
except Exception as e:
    print(f"이미지 다운로드 실패: {e}. 로컬 이미지 파일 경로로 대체해주세요.")
    # 실제 로컬 파일 테스트 시: image = Image.open("path/to/your/image.jpg")
    exit()

print("--- 모델 로드 시작 (로컬 폴더에서) ---")

# 3. 로컬 폴더 경로를 사용하여 프로세서와 모델 로드
# 모델 ID 대신 로컬 폴더 경로를 입력합니다.
processor = ViTImageProcessor.from_pretrained(LOCAL_MODEL_PATH)
model = ViTForImageClassification.from_pretrained(LOCAL_MODEL_PATH)

print("--- 모델 로드 성공 ---")

# 4. 이미지 전처리 및 예측 수행
inputs = processor(images=image, return_tensors="pt")
with torch.no_grad():  # 예측 시 메모리 및 속도 최적화를 위해 사용
    outputs = model(**inputs)

logits = outputs.logits

# 5. 예측 결과 확인 (가장 높은 점수의 클래스 인덱스 찾기)
predicted_class_idx = logits.argmax(-1).item()

# 6. 클래스 ID를 레이블(이름)로 변환
predicted_label = model.config.id2label[predicted_class_idx]

print("---------------------------------------")
print(f"✅ 예측 결과 (ID): {predicted_class_idx}")
print(f"✅ 예측 결과 (레이블): **{predicted_label}**")
print("---------------------------------------")