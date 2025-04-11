const { createClient } = require("@supabase/supabase-js");
const { getFolderById } = require("./folderController");
const { PrismaClient } = require("@prisma/client");
const { CustomError, BadRequestError } = require("../config/error");

const prisma = new PrismaClient();

const getUpload = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const folderId = req.params.folderId;
    const folder = await getFolderById(userId, parseInt(folderId));
    // Render the upload page with the root folder passed as a context
    res.status(200).render("upload", { folder });
  } catch (error) {
    console.error("Cannot get upload page: ", error);
    return next(error);
  }
};

const uploadFile = async (file, username) => {
  const timestamp = Date.now();
  // Append timestamp to file name to avoid duplicate file names
  const fileName = `${timestamp}-${file.originalname}`;
  // Create Supabase client
  const supabase = createClient(
    process.env.PROJECT_URL,
    process.env.SUPABASE_API_KEY
  );

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(`${username}/${fileName}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new CustomError("Failed to upload file to cloud", 500);
  }
  // Get public URL
  const { data: publicData } = supabase.storage
    .from("uploads")
    .getPublicUrl(`${username}/${fileName}`);

  return publicData.publicUrl;
};

const createFile = async (req, res, next) => {
  const file = req.file;
  if (!file) throw new BadRequestError("Failed to create new file");

  const username = req.user.username;
  const publicUrl = await uploadFile(file, username);
  const folderId = req.body.folderId;
  const userId = req.user.id;

  try {
    const newFile = await prisma.file.create({
      data: {
        name: file.originalname,
        path: publicUrl,
        size: file.size,
        userId: userId,
        folderId: parseInt(folderId),
      },
    });
    if (!newFile) {
      throw new CustomError("Failed to create new file", 500);
    }
    return res.status(201).redirect(`/upload/${folderId}`);
  } catch (error) {
    console.error("Error creating the new file", error);
    return next(error);
  }
};

module.exports = { getUpload, createFile };
