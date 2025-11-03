'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * 🔍 디버그 페이지
 * 
 * 이 페이지는 Supabase 연결 상태를 확인하기 위한 것입니다.
 * URL: http://localhost:3000/debug
 * 
 * 배포 시에는 이 페이지를 삭제하거나 접근을 제한하세요!
 */
export default function DebugPage() {
  const [status, setStatus] = useState<any>({
    envCheck: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    connectionTest: null,
    tableTest: null,
    authTest: null,
    rlsTest: null,
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    console.log('Supabase 진단 시작...');

    // 1. 환경변수 확인
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setStatus((prev: any) => ({
      ...prev,
      envCheck: {
        url: !!url,
        key: !!key,
        urlValue: url ? `${url.substring(0, 30)}...` : '❌ 없음',
        keyValue: key ? `${key.substring(0, 30)}...` : '❌ 없음',
      },
    }));

    if (!url || !key) {
      setStatus((prev: any) => ({
        ...prev,
        connectionTest: { success: false, error: '환경변수 없음' },
      }));
      return;
    }

    // 2. 연결 테스트
    try {
      const { data, error } = await supabase.from('contacts').select('count');
      
      if (error) {
        setStatus((prev: any) => ({
          ...prev,
          connectionTest: {
            success: false,
            error: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          },
        }));
      } else {
        setStatus((prev: any) => ({
          ...prev,
          connectionTest: { success: true, result: 'contacts 테이블 연결 성공' },
        }));
      }
    } catch (err: any) {
      setStatus((prev: any) => ({
        ...prev,
        connectionTest: { success: false, error: err.message },
      }));
    }

    // 3. 테이블 구조 확인
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .limit(1);

      if (error) {
        setStatus((prev: any) => ({
          ...prev,
          tableTest: {
            success: false,
            error: error.message,
            code: error.code,
          },
        }));
      } else {
        setStatus((prev: any) => ({
          ...prev,
          tableTest: {
            success: true,
            columns: data && data.length > 0 ? Object.keys(data[0]) : '테이블이 비어있음',
            rowCount: data?.length || 0,
          },
        }));
      }
    } catch (err: any) {
      setStatus((prev: any) => ({
        ...prev,
        tableTest: { success: false, error: err.message },
      }));
    }

    // 4. 인증 상태 확인
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      setStatus((prev: any) => ({
        ...prev,
        authTest: {
          success: !error,
          loggedIn: !!user,
          userId: user?.id,
          email: user?.email,
          role: user?.user_metadata?.role,
          error: error?.message,
        },
      }));

      // 5. RLS 테스트 (로그인한 경우)
      if (user) {
        const { data, error: rlsError } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', user.id);

        setStatus((prev: any) => ({
          ...prev,
          rlsTest: {
            success: !rlsError,
            canReadOwnContacts: !rlsError,
            contactCount: data?.length || 0,
            error: rlsError?.message,
            errorCode: rlsError?.code,
          },
        }));
      } else {
        setStatus((prev: any) => ({
          ...prev,
          rlsTest: { success: false, error: '로그인 필요' },
        }));
      }
    } catch (err: any) {
      setStatus((prev: any) => ({
        ...prev,
        authTest: { success: false, error: err.message },
      }));
    }

    console.log('진단 완료');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Supabase 진단</h1>

        <div className="space-y-6">
          {/* 환경변수 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {status.envCheck.url && status.envCheck.key ? '[OK]' : '[ERROR]'} 1. 환경변수
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(status.envCheck, null, 2)}
            </pre>
          </div>

          {/* 연결 테스트 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {status.connectionTest?.success ? '[OK]' : '[ERROR]'} 2. 연결 테스트
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(status.connectionTest, null, 2)}
            </pre>
          </div>

          {/* 테이블 테스트 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {status.tableTest?.success ? '[OK]' : '[ERROR]'} 3. 테이블 구조
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(status.tableTest, null, 2)}
            </pre>
          </div>

          {/* 인증 테스트 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {status.authTest?.success ? '[OK]' : '[ERROR]'} 4. 인증 상태
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(status.authTest, null, 2)}
            </pre>
          </div>

          {/* RLS 테스트 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {status.rlsTest?.success ? '[OK]' : '[WARN]'} 5. RLS 정책 테스트
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(status.rlsTest, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-8 bg-yellow-900 border-2 border-yellow-600 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">[WARNING] 보안 경고</h3>
          <p className="text-yellow-100">
            이 페이지는 디버깅 전용입니다. 배포 전에 삭제하거나 접근을 제한하세요!
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={runDiagnostics}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            다시 진단하기
          </button>

          <a
            href="/mypage"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            마이페이지로 이동
          </a>

          <a
            href="/auth"
            className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            로그인 페이지로 이동
          </a>
        </div>
      </div>
    </div>
  );
}

