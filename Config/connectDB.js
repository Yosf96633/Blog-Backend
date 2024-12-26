import {connect} from "mongoose"

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI)
        console.log("MongoDB connection SUCCESS")
    } catch (error) {
        console.error("MongoDB connection FAIL")
    }
}

export default connectDB;