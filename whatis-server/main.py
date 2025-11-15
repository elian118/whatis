from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from service import classify_image

app = FastAPI(
    title="ViT Image Classification API",
    description="이미지 URL 또는 파일을 입력받아 사물을 예측합니다."
)

# CORS 미들웨어 추가
origins = [
    "http://localhost:3000",  # Next.js 기본 개발 포트
    "http://127.0.0.1:3000",
    # 추후 프로덕션 환경의 프론트엔드 도메인도 여기에 추가
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# -----------------
# 1. 응답 모델 정의
# -----------------
class ClassificationResult(BaseModel):
    label: str
    description: str = "예측된 ImageNet 클래스 레이블입니다."


# -----------------
# 2. URL 기반 API 엔드포인트
# -----------------
class ImageUrlRequest(BaseModel):
    url: str


@app.get('/')
async def health_check():
    """
    서버 연결 상태를 확인 엔드포인트
    """
    return {"status": "ok", "message": "ViT Classification API is running successfully."}


@app.post("/classify/url", response_model=ClassificationResult)
async def classify_by_url(request: ImageUrlRequest):
    """
    이미지 URL을 입력받아 사물을 분류합니다.
    """
    try:
        # URL에서 이미지 데이터 다운로드
        response = requests.get(request.url, stream=True, timeout=10)
        response.raise_for_status()  # HTTP 오류 발생 시 예외 발생

        # Service 계층 호출
        image_bytes = response.content
        predicted_label = classify_image(image_bytes)

        return ClassificationResult(label=predicted_label)

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"이미지 URL 다운로드 실패: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서비스 처리 중 오류 발생: {e}")


# -----------------
# 3. 파일 업로드 기반 API 엔드포인트
# -----------------
@app.post("/classify/upload", response_model=ClassificationResult)
async def classify_by_upload(file: UploadFile = File(...)):
    """
    이미지 파일을 업로드 받아 사물을 분류합니다.
    """
    try:
        # 업로드된 파일을 바이트 데이터로 읽기
        image_bytes = await file.read()

        # Service 계층 호출
        predicted_label = classify_image(image_bytes)

        return ClassificationResult(label=predicted_label)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서비스 처리 중 오류 발생: {e}")