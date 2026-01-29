import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const login = async (req, res) => {
const user = await User.findOne({ email: req.body.email });
if (!user || !user.isVerified)
return res.status(401).json({ message: "User not verified" });


const isMatch = await bcrypt.compare(req.body.password, user.password);
if (!isMatch) return res.status(401).json({ message: "Wrong credentials" });


const token = jwt.sign(
{ id: user._id, role: user.role },
process.env.JWT_SECRET_KEY,
{ expiresIn: "1h" }
);


res.cookie("access_token", token, { httpOnly: true })
.json({ success: true, user });
};


export default login;