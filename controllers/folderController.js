const { PrismaClient } = require("@prisma/client");
const { NotFoundError, CustomError } = require("../config/error");

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
    if (!newFolder) {
      throw new CustomError("Failed to create folder", 500);
    }
    return res.status(201).redirect(`/upload/${parentFolderId}`);
  } catch (error) {
    console.log("Error creating new folder");
    return next(error);
  }
};

const createRootFolder = async (name, userId) => {
  const newFolder = await prisma.folder.create({
    data: {
      name,
      userId,
      parentFolderId: null,
    },
  });

  if (!newFolder) {
    throw new CustomError("Failed to create root folder", 500);
  }

  return newFolder;
};

const deleteFolder = async (req, res, next) => {
  const folderId = parseInt(req.params.folderId);

  try {
    const folderToDelete = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folderToDelete) {
      throw new NotFoundError("Folder not found");
    }

    const deletedFolder = await prisma.folder.delete({
      where: { id: folderId },
    });

    res.status(200).json({
      message: "Folder deleted",
      parentFolderId: deletedFolder.parentFolderId,
    });
  } catch (error) {
    console.log("Failed to delete folder");
    return next(error);
  }
};

const renameFolder = async (req, res, next) => {
  const folderId = parseInt(req.params.folderId);
  const name = req.body.folderName;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    if (!folder) {
      throw new NotFoundError("Folder not found");
    }
    const updatedFolder = await prisma.folder.update({
      where: { id: folderId },
      data: {
        name,
      },
    });
    res.status(200).redirect(`/upload/${updatedFolder.id}`);
  } catch (error) {
    console.log("Failed to rename folder");
    return next(error);
  }
};

const getRootFolderId = async (userId) => {
  const folder = await prisma.folder.findFirst({
    where: {
      userId,
      parentFolderId: null,
    },
  });
  if (!folder) {
    throw new NotFoundError("Root folder not found");
  }
  return folder.id;
};

const getFolderById = async (userId, folderId) => {
  const folder = await prisma.folder.findFirst({
    where: {
      userId,
      id: folderId,
    },
    include: {
      subfolders: true,
      files: true,
    },
  });

  if (!folder) {
    throw new NotFoundError("Folder not found or you do not have access to it");
  }
  return folder;
};

module.exports = {
  createFolder,
  createRootFolder,
  getRootFolderId,
  getFolderById,
  deleteFolder,
  renameFolder,
};
