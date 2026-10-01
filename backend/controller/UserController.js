import User from "../models/User.js";
import Location from "../models/Location.js";

export const createUser = async (req, res) => {
  try {
    const { name, mobile, email, role, locations, zone } = req.body;

    // Admin accounts can ONLY be created via direct server terminal SSH access
    const allowedRoles = ["supervisor", "caretaker", "driver"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Only 'supervisor', 'caretaker', or 'driver' can be created here. Admin accounts can only be provisioned via server terminal CLI.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ mobile }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Mobile or Email already exists",
      });
    }

 const user = await User.create({
  name,
  mobile,
  email,
  role,

  ...(role === "caretaker" && {
    locations,
    zone
  }),

});
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// Get All Users
export const getAllUsers = async (req,res) => {
  try {

    const users = await User.find({
      role: {
        $ne: "admin",
      },
    });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};



// Delete User
// export const deleteUser = async (req,res) => {
//   try {

//     const { id } = req.params;

//     await User.findByIdAndDelete(id);

//     res.status(200).json({
//       message: "User Deleted",
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: "Server Error",
//     });

//   }
// };



export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    console.log("Delete User ID:", id);

    const user = await User.findById(id);

    console.log("User:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === "caretaker") {

      await Location.updateOne(
        { caretaker: user._id },
        {
          $set: {
            caretaker: null
          }
        }
      );
    }


    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
