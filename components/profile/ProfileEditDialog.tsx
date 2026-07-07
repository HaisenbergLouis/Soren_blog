"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Upload } from "lucide-react";

type ProfileData = {
  name: string | null;
  bio: string | null;
  image: string | null;
  bgImage: string | null;
};

export default function ProfileEditDialog({
  profile,
  open,
  onClose,
}: {
  profile: ProfileData;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(profile.name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [image, setImage] = useState(profile.image ?? "");
  const [bgImage, setBgImage] = useState(profile.bgImage ?? "");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const uploadFile = async (file: File, target: "avatar" | "bg") => {
    const setUploading =
      target === "avatar" ? setUploadingAvatar : setUploadingBg;
    const setUrl = target === "avatar" ? setImage : setBgImage;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setUrl(data.url);
    }

    setUploading(false);
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "avatar" | "bg",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file, target);
    // 清空 input 以便重复选择同一文件
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim() || null,
        bio: bio.trim() || null,
        image: image.trim() || null,
        bgImage: bgImage.trim() || null,
      }),
    });

    if (res.ok) {
      router.refresh();
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-xl mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
          编辑个人资料
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              昵称
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="输入昵称"
            />
          </div>

          {/* 个人简介 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              个人简介
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
              placeholder="介绍一下自己..."
            />
          </div>

          {/* 头像 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              头像
            </label>
            <div className="flex items-center gap-4">
              {/* 预览 */}
              <div className="h-16 w-16 rounded-full border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                {image ? (
                  <img
                    src={image}
                    alt="头像预览"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-lg font-bold text-neutral-400">
                    {(name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* 上传按钮 */}
              <div className="flex-1">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, "avatar")}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingAvatar ? "上传中..." : "本地上传"}
                </button>
                <p className="text-xs text-neutral-400 mt-1">
                  支持 JPG、PNG、GIF、WebP，最大 5MB
                </p>
              </div>
            </div>
            {/* URL 输入 */}
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="或输入图片 URL"
            />
          </div>

          {/* 背景图 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              背景图
            </label>
            {/* 上传按钮 */}
            <div className="flex items-center gap-3 mb-2">
              <input
                ref={bgInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => handleFileSelect(e, "bg")}
              />
              <button
                type="button"
                onClick={() => bgInputRef.current?.click()}
                disabled={uploadingBg}
                className="flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {uploadingBg ? "上传中..." : "本地上传"}
              </button>
              <p className="text-xs text-neutral-400">
                支持 JPG、PNG、GIF、WebP，最大 5MB
              </p>
            </div>
            {/* URL 输入 */}
            <input
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="或输入图片 URL"
            />
            {bgImage && (
              <img
                src={bgImage}
                alt="背景预览"
                className="mt-2 h-20 w-full rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>

          {/* 按钮 */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {loading ? "保存中..." : "保存"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
