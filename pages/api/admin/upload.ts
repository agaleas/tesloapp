import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return uploadFile(req, res);

    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imageUrl = await parseFiles(req);
  if (imageUrl) {
    return res.status(200).json({ message: imageUrl });
  } else {
    return res.status(400).json({ message: 'Error al subir imagen' });
  }
};

const parseFiles = async (req: NextApiRequest): Promise<string | undefined> => {
  const form = formidable({});
  let fields;
  let files;
  try {
    [fields, files] = await form.parse(req);
    const filePath = await saveFileToCloud(files.file![0]);
    return filePath;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

const saveFileonFileSystem = async (file: formidable.File) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${file.originalFilename}`, data);
  fs.unlinkSync(file.filepath);
  return;
};

const saveFileToCloud = async (file: formidable.File): Promise<string> => {
  const { secure_url } = await cloudinary.uploader.upload(file.filepath);
  return secure_url;
};
