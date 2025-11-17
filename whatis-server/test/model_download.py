from huggingface_hub import snapshot_download

from consts.colors import CYAN, RESET
from consts.paths import LOCAL_MODEL_PATH, HUB_MODEL_ID

# 'google/vit-base-patch16-224' 모델의 모든 파일을 해당 경로에 다운로드합니다.
snapshot_download(repo_id=HUB_MODEL_ID,
                  local_dir=LOCAL_MODEL_PATH,
                  local_dir_use_symlinks=False)

print(f"{CYAN}INFO{RESET}:  모델 다운로드 완료: {LOCAL_MODEL_PATH} 폴더 확인")