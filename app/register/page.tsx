"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { hash } from "bcryptjs";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("两次密码不一致");
      return;
    }

    const hashedPassword = await hash(password, 12);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: hashedPassword,
      }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "注册失败");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-bold text-center">注册</h1>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <input
          name="name"
          placeholder="昵称"
          className="w-full rounded-xl border px-4 py-2.5 text-sm"
        />
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
        <input
          name="confirm"
          type="password"
          placeholder="确认密码"
          required
          className="w-full rounded-xl border px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white"
        >
          注册
        </button>
        <p className="text-sm text-center text-neutral-500">
          已有账号？
          <Link href="/login" className="underline">
            登录
          </Link>
        </p>
      </form>
    </div>
  );
}
