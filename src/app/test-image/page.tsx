'use client';

export default function TestImagePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">이미지 테스트 페이지</h1>
      
      <div className="space-y-8">
        {/* 테스트 1: 기본 이미지 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">테스트 1: 기본 img 태그</h2>
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"
            alt="Test"
            className="w-64 h-64"
          />
        </div>

        {/* 테스트 2: 인라인 스타일 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">테스트 2: 인라인 스타일</h2>
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"
            alt="Test"
            style={{ width: '256px', height: '256px', objectFit: 'cover' }}
          />
        </div>

        {/* 테스트 3: 배경 이미지 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">테스트 3: 배경 이미지</h2>
          <div 
            className="w-64 h-64 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80)' }}
          />
        </div>

        {/* 테스트 4: 다른 Unsplash 이미지 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">테스트 4: 다른 이미지</h2>
          <img 
            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800"
            alt="Test"
            className="w-64 h-64 object-cover"
          />
        </div>
      </div>
    </div>
  );
}

