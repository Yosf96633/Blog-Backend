import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: `Unauthorized`, success: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: `Unauthorized`, success: false });
  }
};
