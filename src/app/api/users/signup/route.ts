
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";


connect()
export async function POST(request: NextRequest) {
   // console.log('Hereee d',);
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody;
        console.log(reqBody);
        // if the user already exists
        const user = await User.findOne({ email })
        console.log('user', user);

        if (user) {
            return NextResponse.json({ error: "user already exists" }, { status: 400 })
        }
        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        return NextResponse.json({
            message: " User Created Successfully",
            success: true,
            savedUser,
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}