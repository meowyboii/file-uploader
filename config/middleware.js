const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const setRootFolderId = async (req, res, next) => {
  try {
    const rootFolder = await prisma.folder.findFirst({
      where: { parentFolderId: null },
    });
    res.locals.rootFolderId = rootFolder ? rootFolder.id : null;
    next();
  } catch (error) {
    console.error("Error fetching root folder:", error);
    next();
  }
};

const setCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

module.exports = { setCurrentUser, setRootFolderId };
