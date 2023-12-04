import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

const adminEmails = ["alexey.sinelnik2015@gmail.com"];

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.JWT_SECRET,
    callback: {
        session: ({ session }) => {
            if (adminEmails.includes(session?.user?.email)) {
                return session;
            } else {
                return false;
            }
        }
    }
};
export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!adminEmails.includes(session?.user?.email)) {
        res.status(401);
        res.end();
        throw "Not an admin";
    }
}
