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
    if (newFolder) {
      return res.status(201).redirect(`/upload/${parentFolderId}`);
    }
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

const deleteFolder = async (req, res, next) => {
  const folderId = parseInt(req.params.folderId);

  try {
    const deletedFolder = await prisma.folder.delete({
      where: { id: folderId },
    });

    res.status(200).json({
      message: "Folder deleted",
      parentFolderId: deletedFolder.parentFolderId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
};

const renameFolder = async (req, res, next) => {
  const folderId = parseInt(req.params.folderId);
  const name = req.body.folderName;

  try {
    const updatedFolder = await prisma.folder.update({
      where: { id: folderId },
      data: {
        name,
      },
    });
    res.status(200).redirect(`/upload/${updatedFolder.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
};

const getRootFolder = async (userId) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        userId: userId,
        parentFolderId: null,
      },
      include: {
        subfolders: true,
        files: true,
      },
    });
    if (folder) {
      console.log("Folder found:", folder.name);
      return folder;
    } else {
      console.log("Folder not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching root folder:", error);
    throw error;
  }
};

const getFolderById = async (userId, folderId) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        userId: userId,
        id: folderId,
      },
      include: {
        subfolders: true,
        files: true,
      },
    });

    if (folder) {
      console.log("Folder found:", folder.name);
      return folder;
    } else {
      console.log("Folder not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching folder:", error);
    throw error;
  }
};

module.exports = {
  createFolder,
  createRootFolder,
  getRootFolder,
  getFolderById,
  deleteFolder,
  renameFolder,
};
