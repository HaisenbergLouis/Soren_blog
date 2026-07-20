import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

// POST /api/follow — 关注/取消关注
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const { targetUserId } = await request.json();
  if (!targetUserId || targetUserId === session.user.id) {
    return Response.json({ error: "无效操作" }, { status: 400 });
  }

  // 检查目标用户是否存在
  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) {
    return Response.json({ error: "用户不存在" }, { status: 404 });
  }

  // 检查是否已关注
  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    // 已关注 → 取消关注
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });
    return Response.json({ followed: false });
  } else {
    // 未关注 → 关注
    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    });
    return Response.json({ followed: true });
  }
}

// GET /api/follow?userId=xxx — 获取用户的关注数/粉丝数/是否已关注
export async function GET(request: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "缺少 userId" }, { status: 400 });
  }

  const [followingCount, followerCount, isFollowing] = await Promise.all([
    prisma.follow.count({ where: { followerId: userId } }),
    prisma.follow.count({ where: { followingId: userId } }),
    // 如果当前登录用户，检查是否已关注该用户
    session?.user?.id
      ? prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: session.user.id,
              followingId: userId,
            },
          },
        })
      : null,
  ]);

  return Response.json({
    followingCount,
    followerCount,
    isFollowing: !!isFollowing,
  });
}
