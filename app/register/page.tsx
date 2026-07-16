"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkPasswordStrength } from "@/lib/password-strength";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const [touched, setTouched] = useState(false);

  const strengthResult = useMemo(
    () => checkPasswordStrength(password),
    [password],
  );
  const isWeak = strengthResult.strength === "weak";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    setError("");

    if (password !== confirm) {
      setError("两次密码不一致");
      return;
    }

    if (isWeak) {
      setError("密码强度不足，请设置更强的密码");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password,
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
        <div className="space-y-1.5">
          <input
            name="password"
            type="password"
            placeholder="密码"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!touched) setShowRequirements(true);
            }}
            onFocus={() => setShowRequirements(true)}
            className="w-full rounded-xl border px-4 py-2.5 text-sm"
          />
          {/* 强度指示条 */}
          {password && (
            <div className="space-y-1">
              <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strengthResult.barColor}`}
                  style={{ width: `${strengthResult.score}%` }}
                />
              </div>
              <p className={`text-xs ${strengthResult.color}`}>
                密码强度：{strengthResult.label}
              </p>
            </div>
          )}
          {/* 密码要求列表 */}
          {showRequirements && password && (
            <ul className="space-y-0.5">
              {[
                { key: "minLength" as const, text: "至少 8 个字符" },
                { key: "hasUpperCase" as const, text: "至少一个大写字母" },
                { key: "hasLowerCase" as const, text: "至少一个小写字母" },
                { key: "hasNumber" as const, text: "至少一个数字" },
                { key: "hasSpecialChar" as const, text: "至少一个特殊字符" },
              ].map(({ key, text }) => (
                <li
                  key={key}
                  className={`text-xs flex items-center gap-1 ${
                    strengthResult.requirements[key]
                      ? "text-green-500"
                      : "text-neutral-400"
                  }`}
                >
                  {strengthResult.requirements[key] ? "✓" : "○"} {text}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          name="confirm"
          type="password"
          placeholder="确认密码"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-xl border px-4 py-2.5 text-sm"
        />
        {confirm && password !== confirm && (
          <p className="text-xs text-red-500 -mt-3">两次密码不一致</p>
        )}
        <button
          type="submit"
          className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!!password && isWeak}
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
