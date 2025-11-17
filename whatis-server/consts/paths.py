import os

project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 모델이 다운로드된 로컬 폴더 경로
LOCAL_MODEL_PATH = os.path.abspath(os.path.join(project_dir, 'models//vit-base-patch16-224'))

# 모델 아이디 → 모델을 내려받지 않고 허깅페이스 저장소로부터 불러온 원본을 사용하고자 할 때 사용
HUB_MODEL_ID = 'google/vit-base-patch16-224'