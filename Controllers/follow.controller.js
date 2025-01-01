import User_Model from "../Models/user.model.js";
import Follow_Model from "../Models/follow.model.js";
export const followUnfollow = async (req, res) => {
  const { _id } = req.user;
  const Tid = req.params.id;
  try {
    let userFollow = await Follow_Model.findOne({ user: _id });
    if (!userFollow) {
      userFollow = new Follow_Model({
        user: _id,
        followers: [],
        following: [],
      });
    }
    let targetUserFollow = await Follow_Model.findOne({ user: Tid });
    if (!targetUserFollow) {
      targetUserFollow = new Follow_Model({
        user: Tid,
        followers: [],
        following: [],
      });
    }

    // Check if user is already following the target user
    if (userFollow.following.includes(Tid)) {
      userFollow.following.pull(Tid);
      targetUserFollow.follower.pull(_id);

      await userFollow.save();
      await targetUserFollow.save();

      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      // Follow logic: add to both arrays
      userFollow.following.push(Tid);
      targetUserFollow.follower.push(_id);

      await userFollow.save();
      await targetUserFollow.save();

      return res
        .status(200)
        .json({ message: "Followed successfully", success: true });
    }
  } catch (err) {
    console.log(`Error in followUnfollow: ${err.message}`);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
export const getFollowers = async (req, res) => {
  try {
    const { _id } = req.user;
    const result = await Follow_Model.findOne({ user: _id }).populate(
      `follower`,
      `name imageDetails.imageURL`
    );
    if (!result || result.follower.length === 0) {
      return res
        .status(200)
        .json({ message: `No followers found`, follower: [], success: false });
    }
    return res
      .status(200)
      .json({
        message: `Followers found`,
        follower: result.follower,
        success: true,
      });
  } catch (error) {
    console.log(`Error in getFollowers: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Internal Server Error`, success: false });
  }
};
export const getFollowings = async (req, res) => {
  try {
    const { _id } = req.user;
    const result = await Follow_Model.findOne({ user: _id }).populate(
      `following`,
      `name imageDetails.imageURL`
    );
    if (!result || result.following.length === 0) {
      return res
        .status(200)
        .json({ message: `No following found`, following: [], success: false });
    }
    return res
      .status(200)
      .json({
        message: `Following found`,
        following: result.following,
        success: true,
      });
  } catch (error) {
    console.log(`Error in getFollowing: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Internal Server Error`, success: false });
  }
};
export const checkIfUserFollows = async (req, res) => {
  const { _id } = req.user;
  const Tid = req.params.id;
  try {
    const userFollow = await Follow_Model.findOne({ user: _id });
    if (!userFollow) {
      return res
        .status(404)
        .json({ message: "Follow record not found", success: false });
    }

    const isFollowing = userFollow.following.includes(Tid);

    // Return the result as a boolean response
    return res.status(200).json({ isFollowing, success: true });
  } catch (error) {
    console.log(`Error in checkIfUserFollows: ${error.message}`);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

export const numbers = async (req, res) => {
  try {
    const { _id } = req.user;
    const result = await Follow_Model.findOne({ user: _id });
    if (!result) {
      return res
        .status(404)
        .json({ message: `No record found`, success: false });
    }
    return res.status(200).json({
        message:`Numbers found`,
        numbers:{
            followers : result.follower.length,
            followings : result.following.length,
        },
        success:true
    });
  } catch (error) {
    console.log(`Error in numbers: ${error.message}`);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};
