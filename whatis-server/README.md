Whatis server
--

1. 실행환경(uv 기준) 
   - 파이썬 개발환경만 설정하면 되므로, uv 말고 다른 걸로 설정해도 무관
   - 순서
      1. 가상환경 설치
         - [UV 설치 및 사용법](https://wikidocs.net/287359)
      2. 가상환경 생성
          ```shell
           uv venv [가상환경 이름] 
          ```
      3. 가상환경 활성화
          ```shell
          source [가상환경 이름]/bin/activate
          ```
      3. 의존성 설치
         - 아래 명령은 `requirements.txt`로부터 의존성 정보를 불러와 자동설치 진행 
         ```shell
           uv pip install -r requirements.txt
         ```

2. 실행
    - main.py 실행
    - 실행 시 아래 코드가 호출되며 서버 가동
        ```python
            uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_config=LOGGING_CONFIG)
        ```