from huggingface_hub import snapshot_download

# 저장할 로컬 폴더 경로를 지정하세요. (예: C:\models\vit-base)
local_model_path = "../models/vit-base-patch16-224"

# 'google/vit-base-patch16-224' 모델의 모든 파일을 해당 경로에 다운로드합니다.
snapshot_download(repo_id="google/vit-base-patch16-224",
                  local_dir=local_model_path,
                  local_dir_use_symlinks=False)

print(f"모델 다운로드 완료: {local_model_path} 폴더 확인")