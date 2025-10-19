import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: 'Không thể thiếu username, password, email, firstName, lastName' });
    }

    // kiểm tra username tồn tại chưa
    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res.status(409).json({ message: 'username đã tồn tại' });
    }

    // mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

    // tạo user mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    // return
    return res.status(204);
  } catch (error) {
    console.error('Lỗi khi gọi signUp', error);
    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};
