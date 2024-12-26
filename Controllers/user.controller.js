import User_model from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../Config/cloudinary.js";
export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User_model.create({
      name,
      email,
      password: hashedPassword,
    });
    if (user) {
      return res
        .status(201)
        .json({ message: `User Registered Successfully`, userData:{id: user._id , name: user.name} ,   success: true });
    } else {
      return res
        .status(400)
        .json({ message: `User Registration Failed`, success: false });
    }
  } catch {
    console.log(`Error in Register: ${error.message}`);
    return res
      .staus(500)
      .json({ message: `Internal Server Error`, success: false });
  }
};
export const getInfo = async (req , res) => {
  try {
    let profile_pic = null;
    let result = null;
       const {id} = req.params;
       const {bio , DOB} = req.body;
        profile_pic = req.files?.profile_pic;
        const user = await User_model.findById(id);
        if(!user)
          return res.status(404).json({message:`User not found` , success:false});
        if (profile_pic)
         result = await cloudinary.uploader.upload(profile_pic.tempFilePath , {folder:`Profile_Images`});
        console.log(DOB);
        
         user.DOB =  DOB
         user.bio = bio;
         user.imageDetails.imageURL = result?.secure_url;
         user.imageDetails.imageId = result?.public_id;
         await user.save();
         return res.status(201).json({message:`Congratulations, Your profile is set` , success:true});

        
  } catch (error) {
    console.log(`Error at getInfo: ${error.message}`);
    return res.status(500).json({message:`Internal Server Error` , success:false})
  }
}
export const Login = async (req, res) => {
  try {
    const { email } = req.body;
    const { _id, name , bio , DOB , imageDetails} = req.userData;
    const token = jwt.sign(
      { _id, name, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    if(!token)
      return res.status(400).json({message:`Error in during login` , success:false})
    res.cookie("token" , token , {
      maxAge:1000*60*60*24*7,
    })
    return res.status(200).json({message:`Login successfull` , userData:{name , id:_id , DOB , bio , imageDetails } , success:true})
  } catch (error) {
    console.log(`Error in Login ${error.message}`);
    return res
      .status(500)
      .json({ message: `Internal Server Error`, success: false });
  }
};
export const Logout = async (req , res) => {
  try {
      res.clearCookie("token");
      return res.status(200).json({message:`Logout successfull` , success:true})
  } catch (error) {
    console.log(`Error in Logout ${error.message}`);
    return res.status(500).json({message:`Internal server error` , success:false})
  }
}
export const Delete = async (req , res) => {
  try {
      const {_id , name , email} = req.userData;
      const data = await User_model.deleteOne({email});
      if(!data){
        return res.status(400).json({message:`User not found` , success:false})
      }
      res.clearCookie("token")
      await cloudinary.uploader.destroy(data.imageDetails.imageId);
      return res.status(200).json({message:`Account delete successfully` , success:true})
  } catch (error) {
    console.log(`Error in Delete ${error.message}`);
    return res.status(500).json({message:`Internal server error` , success:false})
  }
}