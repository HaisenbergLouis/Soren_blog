"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

type CommentAuthor = {
  id: string;
  name: string | null;
  image: string | null;
};

type Reply = {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  replies: Reply[];
};

export default function CommentList({ postId }: { postId: string }) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      });
  }, [postId]);

  const handleSubmit = async (parentId?: string) => {
    if (!content.trim()) return;
    setSubmitting(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        content: content.trim(),
        parentId: parentId || null,
      }),
    });

    if (res.ok) {
      setContent("");
      setReplyTo(null);
      // 重新加载评论
      const data = await fetch(`/api/comments?postId=${postId}`).then((r) =>
        r.json(),
      );
      setComments(data);
      router.refresh();
    }

    setSubmitting(false);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        评论 {!loading && `(${comments.length})`}
      </h2>

      {/* 发表评论 */}
      <div className="mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="写下你的评论..."
          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => handleSubmit()}
            disabled={submitting || !content.trim()}
            className="rounded-xl bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {submitting ? "发表中..." : "发表评论"}
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-8">加载中...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-8">
          还没有评论，来发表第一条吧
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id}>
              {/* 顶级评论 */}
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden shrink-0">
                  {comment.author.image ? (
                    <img
                      src={comment.author.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm font-medium text-neutral-500">
                      {(comment.author.name ?? "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {comment.author.name ?? "匿名"}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {comment.content}
                  </p>
                  <button
                    onClick={() =>
                      setReplyTo(replyTo === comment.id ? null : comment.id)
                    }
                    className="text-xs text-neutral-400 hover:text-neutral-600 mt-1"
                  >
                    {replyTo === comment.id ? "取消回复" : "回复"}
                  </button>

                  {/* 回复输入框 */}
                  {replyTo === comment.id && (
                    <div className="mt-3">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={2}
                        placeholder={`回复 @${comment.author.name ?? "匿名"}...`}
                        className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
                      />
                      <div className="flex justify-end mt-1">
                        <button
                          onClick={() => handleSubmit(comment.id)}
                          disabled={submitting || !content.trim()}
                          className="rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                          {submitting ? "发表中..." : "回复"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 回复列表 */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-neutral-200 dark:border-neutral-700">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden shrink-0">
                            {reply.author.image ? (
                              <img
                                src={reply.author.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs font-medium text-neutral-500">
                                {(reply.author.name ?? "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                                {reply.author.name ?? "匿名"}
                              </span>
                              <span className="text-xs text-neutral-400">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-0.5">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
