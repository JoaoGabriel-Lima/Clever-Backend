const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getPosts = async function (req, res, next) {
  try {
    let posts = await prisma.post.findMany({
      select: {
        id: true,
        content: true,
        likes: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        updatedAt: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });
    res.status(201).json({ data: posts });
  } catch (error) {
    next(error);
  }
};

exports.addPost = async function (req, res, next) {
  if (!req.userId) {
    return res.status(500).json({ message: "Role system was ignored" });
  }
  const { content } = req.body;
  try {
    let post = await prisma.post.create({
      data: {
        content: content,
        userId: req.userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(201).json({ data: post });
  } catch (error) {
    next(error);
  }
};
exports.deletePost = async function (req, res, next) {
  if (!req.userId) {
    return res.status(500).json({ message: "Role system was ignored" });
  }
  const postId = req.params.id;

  try {
    if (req.role === "ADMIN") {
      let post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
        },
      });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      post = await prisma.post.delete({
        where: {
          id: Number(postId),
        },
      });
      res.status(201).json({ message: "Deleted", data: post });
    }
    if (req.role === "USER") {
      let post = await prisma.post.findMany({
        where: {
          AND: [
            {
              id: Number(postId),
              userId: req.userId,
            },
          ],
        },
      });
      if (post.length > 0) {
        post = await prisma.post.delete({
          where: {
            id: Number(postId),
          },
        });
        res.status(201).json({ message: "Deleted", data: post });
      } else {
        res.status(401).json({
          message: "This post doesn't exist or probably doesn't belong to you",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.likePost = async function (req, res, next) {
  if (!req.userId) {
    return res.status(500).json({ message: "Role system was ignored" });
  }
  const { postId } = req.body;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = await prisma.like.findMany({
      where: {
        AND: [
          {
            postId: postId,
            userId: req.userId,
          },
        ],
      },
    });

    if (isLiked.length > 0) {
      let post = await prisma.like.deleteMany({
        where: {
          AND: [
            {
              postId: postId,
              userId: req.userId,
            },
          ],
        },
      });
      res.status(201).json({ message: "Unliked", data: post });
    } else {
      let post = await prisma.like.create({
        data: {
          postId: postId,
          userId: req.userId,
        },
        select: {
          id: false,
          user: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      });
      res.status(201).json({ message: "Liked", data: post });
    }
  } catch (error) {
    next(error);
  }
};
