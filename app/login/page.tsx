"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.ok) {
      window.location.href = "/";
    } else {
      setError("邮箱或密码错误");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-bold text-center">登录</h1>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <input
          name="email"
          type="email"
          placeholder="邮箱"
          required
          className="w-full rounded-xl border px-4 py-2.5 text-sm"
        />
        <input
          name="password"
          type="password"
          placeholder="密码"
          required
          className="w-full rounded-xl border px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white"
        >
          登录
        </button>
        <p className="text-sm text-center text-neutral-500">
          没有账号？
          <Link href="/register" className="underline">
            注册
          </Link>
        </p>
      </form>
    </div>
  );
}
