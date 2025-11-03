# 고아 브랜치를 사용하여 Git 히스토리를 깨끗하게 초기화하는 스크립트 (PowerShell)

Write-Host "🔄 Git 히스토리 초기화 시작..." -ForegroundColor Cyan
Write-Host ""

# 1. 새로운 고아 브랜치 생성
Write-Host "📝 Step 1: 새로운 고아 브랜치 생성 (latest_branch)" -ForegroundColor Yellow
git checkout --orphan latest_branch

# 2. 모든 파일 스테이징
Write-Host "📦 Step 2: 모든 파일 스테이징" -ForegroundColor Yellow
git add -A

# 3. 새로운 초기 커밋
Write-Host "💾 Step 3: Initial commit 생성" -ForegroundColor Yellow
git commit -m "Initial commit"

# 4. 기존 main 브랜치 삭제
Write-Host "🗑️  Step 4: 기존 main 브랜치 삭제" -ForegroundColor Yellow
git branch -D main

# 5. 현재 브랜치 이름을 main으로 변경
Write-Host "✏️  Step 5: 브랜치 이름을 main으로 변경" -ForegroundColor Yellow
git branch -m main

# 6. 원격 저장소에 강제 푸시 (주의!)
Write-Host "🚀 Step 6: 원격 저장소에 강제 푸시" -ForegroundColor Yellow
Write-Host "⚠️  경고: 이 작업은 원격 저장소의 히스토리를 덮어씁니다!" -ForegroundColor Red
$confirmation = Read-Host "계속하시겠습니까? (y/N)"

if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
    git push -f origin main
    Write-Host "✅ Git 히스토리 초기화 완료!" -ForegroundColor Green
} else {
    Write-Host "❌ 푸시가 취소되었습니다." -ForegroundColor Red
    Write-Host "💡 로컬에서는 히스토리가 초기화되었습니다." -ForegroundColor Cyan
    Write-Host "💡 원격 저장소에 반영하려면 다음 명령어를 실행하세요:" -ForegroundColor Cyan
    Write-Host "   git push -f origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "✨ 완료!" -ForegroundColor Green

