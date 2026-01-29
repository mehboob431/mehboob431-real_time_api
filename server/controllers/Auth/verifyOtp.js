import OTP from "../../models/task.js";
import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";


const verifyOtp = async (req, res) => {
const { name, email, password, otp } = req.body;


const record = await OTP.findOne({ email, otp });
if (!record || record.expiresAt < Date.now())
return res.status(400).json({ message: "Invalid OTP" });


const hash = bcrypt.hashSync(password, 10);


await User.create({ name, email, password: hash, isVerified: true });
await OTP.deleteMany({ email });


res.json({ message: "User Registered Successfully" });
};


export default verifyOtp;