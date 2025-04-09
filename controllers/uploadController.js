const { createClient } = require("@supabase/supabase-js");
const { getFolderById } = require("./folderController");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUpload = async (req, res, next) => {
  console.log("ROOT FOLDER ID: " + req.session.rootFolderId);
  const userId = req.user.id;
  const folderId = req.params.folderId;
  const rootFolderId = req.session.rootFolderId;
  const folder = await getFolderById(userId, parseInt(folderId));
  if (!folder) {
    return res.status(404).json({ message: "Folder not found." });
  }
  // Render the upload page with the root folder passed as a context
  res.status(200).render("upload", { folder, rootFolderId });
};

const uploadFile = async (file, username) => {
  const timestamp = Date.now();
  // Append timestamp to file name to avoid duplicate file names
  const fileName = `${timestamp}-${file.originalname}`;
  try {
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
      console.error(error);
      return null;
    } else {
      // Get public URL
      const { data: publicData } = supabase.storage
        .from("uploads")
        .getPublicUrl(`${username}/${fileName}`);

      console.log(publicData.publicUrl);
      return publicData.publicUrl;
    }
  } catch (error) {
    console.log(error);
  }
};

const createFile = async (req, res, next) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded.");
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
    if (newFile) {
      console.log(newFile);
      return res.redirect(`/upload/${folderId}`);
    }
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUpload, createFile };
