# Git 히스토리 초기화 가이드

## 개요

고아 브랜치(orphan branch)를 사용하여 Git 커밋 히스토리를 깨끗하게 초기화하고 새로운 Initial commit을 만드는 가이드입니다.

## 왜 필요한가?

- 불필요한 커밋 히스토리 정리
- 민감한 정보가 포함된 이전 커밋 제거
- 프로젝트를 깨끗한 상태로 재시작

## ⚠️ 주의사항

**이 작업은 되돌릴 수 없습니다!**

- 모든 커밋 히스토리가 삭제됩니다
- 협업 중인 프로젝트에서는 팀원과 상의 후 진행하세요
- 백업을 먼저 만드는 것을 권장합니다

## 사용 방법

### Windows (PowerShell)

```powershell
# photo-studio 디렉토리에서
.\reset-git-history.ps1
```

### Mac/Linux (Bash)

```bash
# photo-studio 디렉토리에서
chmod +x reset-git-history.sh
./reset-git-history.sh
```

### 수동 실행 (모든 OS)

```bash
# 1. 새로운 고아 브랜치 생성
git checkout --orphan latest_branch

# 2. 모든 파일 스테이징
git add -A

# 3. 새로운 초기 커밋
git commit -m "Initial commit"

# 4. 기존 main 브랜치 삭제
git branch -D main

# 5. 현재 브랜치 이름을 main으로 변경
git branch -m main

# 6. 원격 저장소에 강제 푸시
git push -f origin main
```

## 깃배포포

```bash
# 1. 모든 파일 스테이징
git add .

# 2. 새로운 초기 커밋
git commit -m "modified"

# 3. 원격 저장소에 강제 푸시
git push -u origin main
```

## 실행 과정

스크립트는 다음 단계를 자동으로 수행합니다:

1. **고아 브랜치 생성**: 히스토리가 없는 새로운 브랜치 생성
2. **파일 스테이징**: 현재 작업 디렉토리의 모든 파일 추가
3. **Initial commit**: 깨끗한 첫 커밋 생성
4. **기존 브랜치 삭제**: 이전 main 브랜치 제거
5. **브랜치 이름 변경**: 새 브랜치를 main으로 변경
6. **원격 푸시**: GitHub에 강제 푸시 (확인 필요)

## 실행 전 체크리스트

- [ ] 중요한 변경사항이 모두 커밋되어 있는지 확인
- [ ] `.gitignore`가 올바르게 설정되어 있는지 확인
- [ ] README.md를 제외한 MD 파일들이 `.gitignore`에 포함되어 있는지 확인
- [ ] 백업이 필요한 경우 현재 상태를 다른 곳에 백업
- [ ] 협업 중이라면 팀원에게 공지

## 실행 후 확인사항

```bash
# 커밋 히스토리 확인 (1개만 있어야 함)
git log --oneline

# 원격 저장소 확인
git remote -v

# GitHub에서 확인
# https://github.com/JINWORLD13/photo-studio/commits/main
```

## 문제 해결

### 스크립트 실행 권한 오류 (Mac/Linux)

```bash
chmod +x reset-git-history.sh
```

### PowerShell 실행 정책 오류 (Windows)

```powershell
# 현재 세션에서만 실행 허용
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\reset-git-history.ps1
```

### 원격 푸시 실패

```bash
# 원격 저장소 URL 확인
git remote -v

# 원격 저장소 재설정
git remote set-url origin https://github.com/JINWORLD13/photo-studio.git

# 다시 푸시
git push -f origin main
```

## 백업 방법 (선택사항)

깨끗한 히스토리로 초기화하기 전에 백업하려면:

```bash
# 현재 브랜치를 backup으로 복사
git branch backup-$(date +%Y%m%d)

# 또는 다른 디렉토리에 복사
cp -r ../photo-studio ../photo-studio-backup
```

## FAQ

### Q: 로컬에서만 초기화하고 원격은 나중에 푸시할 수 있나요?

A: 네, 스크립트 실행 시 푸시를 거부하면 로컬만 초기화됩니다. 나중에 `git push -f origin main`으로 푸시할 수 있습니다.

### Q: 이미 푸시한 후 되돌릴 수 있나요?

A: 불가능합니다. 백업 브랜치를 만들어두지 않았다면 복구할 수 없습니다.

### Q: .gitignore에 추가한 파일들도 커밋되나요?

A: 네, `.gitignore`는 아직 추적되지 않은 파일에만 적용됩니다. 이미 추적 중인 파일은 먼저 `git rm --cached`로 제거해야 합니다.

### Q: 다른 브랜치들은 어떻게 되나요?

A: 이 스크립트는 main 브랜치만 초기화합니다. 다른 브랜치들은 그대로 유지됩니다.

## 참고 자료

- [Git Orphan Branch 공식 문서](https://git-scm.com/docs/git-checkout#Documentation/git-checkout.txt---orphanltnewbranchgt)
- [GitHub 히스토리 정리 가이드](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
