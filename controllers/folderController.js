const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createFolder = async (req, res, next) => {
  const { folderName, parentFolderId } = req.body;
  const userId = req.user.id;
  try {
    const newFolder = await prisma.folder.create({
      data: {
        name: folderName,
        userId,
        parentFolderId: parseInt(parentFolderId),
      },
    });
    return res.redirect(`/${newFolder.name}/upload`);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createRootFolder = async (name, userId) => {
  try {
    const newFolder = await prisma.folder.create({
      data: {
        name,
        userId,
        parentFolderId: null,
      },
    });
    if (newFolder) {
      return newFolder;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error creating root folder:", error);
    throw error;
  }
};

const getFolderByName = async (userId, folderName) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        userId: userId,
        name: folderName,
      },
    });

    if (folder) {
      console.log("Folder found:", folder);
      return folder;
    } else {
      console.log("Folder not found." + folderName + userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching folder:", error);
    throw error;
  }
};

module.exports = { createFolder, createRootFolder, getFolderByName };
