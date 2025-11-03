#!/bin/bash
# 고아 브랜치를 사용하여 Git 히스토리를 깨끗하게 초기화하는 스크립트

echo "🔄 Git 히스토리 초기화 시작..."
echo ""

# 1. 새로운 고아 브랜치 생성
echo "📝 Step 1: 새로운 고아 브랜치 생성 (latest_branch)"
git checkout --orphan latest_branch

# 2. 모든 파일 스테이징
echo "📦 Step 2: 모든 파일 스테이징"
git add -A

# 3. 새로운 초기 커밋
echo "💾 Step 3: Initial commit 생성"
git commit -m "Initial commit"

# 4. 기존 main 브랜치 삭제
echo "🗑️  Step 4: 기존 main 브랜치 삭제"
git branch -D main

# 5. 현재 브랜치 이름을 main으로 변경
echo "✏️  Step 5: 브랜치 이름을 main으로 변경"
git branch -m main

# 6. 원격 저장소에 강제 푸시 (주의!)
echo "🚀 Step 6: 원격 저장소에 강제 푸시"
echo "⚠️  경고: 이 작업은 원격 저장소의 히스토리를 덮어씁니다!"
read -p "계속하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git push -f origin main
    echo "✅ Git 히스토리 초기화 완료!"
else
    echo "❌ 푸시가 취소되었습니다."
    echo "💡 로컬에서는 히스토리가 초기화되었습니다."
    echo "💡 원격 저장소에 반영하려면 다음 명령어를 실행하세요:"
    echo "   git push -f origin main"
fi

echo ""
echo "✨ 완료!"

