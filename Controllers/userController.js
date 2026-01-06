const { clerkClient } = require("@clerk/clerk-sdk-node");
const User = require("../Models/userModel");

const addUser = async(req,res,next)=>{

    // console.log("yha phuch rha hai ?")
    const userId = req.auth.userId; 

    const clerkUser = await clerkClient.users.getUser(userId);

    const name = `${clerkUser.firstName} ${clerkUser.lastName}`;
    const email = clerkUser.emailAddresses[0].emailAddress;
    const pic = clerkUser.imageUrl;

    try{
        let existingUser = await User.findOne({email : email});

        if(!existingUser){
            existingUser = User.create({
                clerkId : userId ,
                name ,
                email ,
                pic 
            });
        }

        const user = await User.findOne({email : email}).populate("trips");

        res.json({user : user});
    }catch(err){
        const error = new Error("User authentication failed !");
        next(error);
    }
}

module.exports=addUser;