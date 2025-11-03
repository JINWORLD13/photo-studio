import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 환경변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다!');
  console.error('.env.local 파일을 확인하세요:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...');
  console.error('');
  console.error('설정 가이드: SETUP_GUIDE.md 참조');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  user_id?: string | null;  // ⭐ 추가: 사용자 ID
  created_at: string;
}

export interface Portfolio {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
  created_at: string;
}

