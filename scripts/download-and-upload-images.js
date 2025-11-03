/**
 * Unsplash 이미지 자동 다운로드 & Supabase 업로드 스크립트
 * 
 * 사용법:
 * 1. npm install (프로젝트 루트에서)
 * 2. .env.local 파일에 Supabase 키 설정 확인
 * 3. node scripts/download-and-upload-images.js
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[ERROR] .env.local 파일에서 Supabase 설정을 찾을 수 없습니다!');
  console.error('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 다운로드할 이미지 정보 (프로젝트에서 사용 중인 Unsplash 이미지)
const portfolioImages = [
  // 웨딩 (Wedding)
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    category: 'wedding',
    title: '봄날의 웨딩',
    description: '아름다운 봄날의 야외 웨딩 촬영',
  },
  {
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200',
    category: 'wedding',
    title: '로맨틱 웨딩',
    description: '감성 가득한 웨딩 스냅',
  },
  {
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200',
    category: 'wedding',
    title: '클래식 웨딩',
    description: '우아한 실내 웨딩 촬영',
  },
  
  // 커플 (Couple)
  {
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200',
    category: 'couple',
    title: '커플 데이트',
    description: '자연스러운 커플 스냅',
  },
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200',
    category: 'couple',
    title: '로맨틱 커플',
    description: '사랑스러운 순간 포착',
  },
  
  // 프로필 (Profile)
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
    category: 'profile',
    title: '비즈니스 프로필',
    description: '전문적인 프로필 촬영',
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200',
    category: 'profile',
    title: '여성 프로필',
    description: '세련된 프로필 사진',
  },
  
  // 가족 (Family)
  {
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200',
    category: 'family',
    title: '가족 사진',
    description: '따뜻한 가족 촬영',
  },
  
  // 제품 (Product)
  {
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
    category: 'product',
    title: '제품 촬영',
    description: '고품질 제품 사진',
  },
];

// 임시 폴더 생성
const TEMP_DIR = path.join(__dirname, '../temp_images');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * 이미지 다운로드 함수
 */
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(TEMP_DIR, filename);
    const file = fs.createWriteStream(filepath);
    
    console.log(`  다운로드 중: ${filename}...`);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`  다운로드 완료: ${filename}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.error(`  다운로드 실패: ${err.message}`);
      reject(err);
    });
  });
}

/**
 * Supabase Storage에 업로드
 */
async function uploadToSupabase(filepath, category) {
  const filename = path.basename(filepath);
  const fileBuffer = fs.readFileSync(filepath);
  
  // Supabase Storage 경로
  const storagePath = `public/${category}/${filename}`;
  
  console.log(`  Supabase 업로드 중: ${storagePath}...`);
  
  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .upload(storagePath, fileBuffer, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: true, // 같은 파일이 있으면 덮어쓰기
    });
  
  if (error) {
    console.error(`  업로드 실패: ${error.message}`);
    throw error;
  }
  
  console.log(`  업로드 완료!`);
  
  // Public URL 생성
  const { data: urlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(storagePath);
  
  return urlData.publicUrl;
}

/**
 * DB에 포트폴리오 정보 저장
 */
async function saveToDatabase(imageUrl, item) {
  console.log(`  DB 저장 중: ${item.title}...`);
  
  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      title: item.title,
      category: item.category,
      description: item.description,
      image_url: imageUrl,
    });
  
  if (error) {
    console.error(`  DB 저장 실패: ${error.message}`);
    throw error;
  }
  
  console.log(`  DB 저장 완료!`);
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('포트폴리오 이미지 자동 업로드 시작!\n');
  console.log(`총 ${portfolioImages.length}개의 이미지를 처리합니다.\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < portfolioImages.length; i++) {
    const item = portfolioImages[i];
    console.log(`\n[${i + 1}/${portfolioImages.length}] ${item.title}`);
    console.log(`카테고리: ${item.category}`);
    
    try {
      // 1. 이미지 다운로드
      const filename = `${item.category}-${Date.now()}-${i}.jpg`;
      const filepath = await downloadImage(item.url, filename);
      
      // 2. Supabase Storage에 업로드
      const imageUrl = await uploadToSupabase(filepath, item.category);
      
      // 3. DB에 저장
      await saveToDatabase(imageUrl, item);
      
      // 4. 임시 파일 삭제
      fs.unlinkSync(filepath);
      
      successCount++;
      console.log(`완료!`);
      
      // API Rate Limit 방지를 위한 지연
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      failCount++;
      console.error(`실패: ${error.message}`);
    }
  }
  
  // 임시 폴더 삭제
  try {
    fs.rmdirSync(TEMP_DIR);
  } catch (e) {
    // 폴더에 파일이 남아있을 수 있음
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('처리 완료!');
  console.log(`성공: ${successCount}개`);
  console.log(`실패: ${failCount}개`);
  console.log('='.repeat(50));
  
  if (successCount > 0) {
    console.log('\n이제 http://localhost:3000/portfolio 에서 확인하세요!');
  }
}

// 실행
main().catch((error) => {
  console.error('[ERROR] 치명적 에러:', error);
  process.exit(1);
});

