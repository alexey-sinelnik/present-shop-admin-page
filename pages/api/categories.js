import { mongooseConnect } from "../../lib/mongoose";
import { Category, CategoryParent } from "../../models/categories";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    const { name, parent, _id, properties } = req.body;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === "POST") {
        const category = await Category.create({
            name,
            parent: parent || undefined,
            properties
        });
        res.json(category);
    }

    if (method === "GET") {
        const categories = await Category.find().populate("parent");
        res.json(categories);
    }

    if (method === "PUT") {
        const category = await Category.updateOne(
            { _id },
            { name, parent: parent || undefined, properties }
        );
        res.json(category);
    }

    if (method === "DELETE") {
        const { _id } = req.query;
        await Category.deleteOne({ _id });
        res.json(true);
    }
}
