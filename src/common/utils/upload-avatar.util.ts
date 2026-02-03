export const avatarPath = (file: Express.Multer.File) => {
  return `/img/avatar/${file.filename}`;
};
