const { createClient } = require("@supabase/supabase-js");

const getUpload = (req, res, next) => {
  res.status(200).render("upload", { errors: null });
};

const uploadFile = async (req, res, next) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded.");
  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.PROJECT_URL,
      process.env.SUPABASE_API_KEY
    );

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`server/${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) {
      console.error(error);
      return res.status(500).send("Upload failed.");
    } else {
      // Get public URL
      const { data: publicData } = supabase.storage
        .from("uploads")
        .getPublicUrl(`server/${file.originalname}`);

      console.log(publicData.publicUrl);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong during upload" });
  }
};

module.exports = { getUpload, uploadFile };
