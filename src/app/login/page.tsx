'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import api from "@/lib/axios";

export default function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // const handleLogin = async () => {
    //     try {
    //         // const res = await api.post('users/login'), {
    //         //     loginId:id,
    //         //     password:password,
    //         // }
    //     }
    // }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-xs space-y-8">
                <h1 className="text-2xl font-bold text-left">로그인</h1>

                {/*아이디입력*/}
                <div className="space-y-2">
                    <label className="text-sm font-medium">아이디 or 사업자 등록 번호</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디 입력"
                        className="flex w-full h-14 px-5 py-[18px] items-center gap-[10px] rounded-full border border-[#B3B3B3] text-sm"
                    />
                </div>
                {/*비밀번호 입력*/}
                <div className="space-y-2">
                    <label className="text-sm font-medium">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 입력"
                        className="flex w-full h-14 px-5 py-[18px] items-center gap-[10px] rounded-full border border-[#B3B3B3] text-sm"
                    />
                </div>

                <div className="space-y-4">
                    <button className="w-full h-14 px-5 py-[18px] rounded-full border border-[#B3B3B3] bg-[#2948FF] text-white text-sm font-semibold">로그인하기</button>
                    <button
                        onClick={() => router.push('/signup/user-type')}
                        className="w-full h-14 px-5 py-[18px] rounded-full border border-[#B3B3B3] bg-white text-black text-sm font-semibold">이메일로 가입하기</button>
                </div>
                <div className="flex justify-between text-xs text-gray-400 pt-4">
                    <button>계정찾기</button>
                    <button>비밀번호 찾기</button>
                    <button>문의하기</button>
                </div>
            </div>
        </main>
    );
}