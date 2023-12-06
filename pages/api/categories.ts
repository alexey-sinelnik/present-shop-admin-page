import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/categories";
import { isAdminRequest } from "./auth/[...nextauth]";
import { UpdateWriteOpResult } from "mongoose";

export default async function handle(
    req: { body?: any; query?: any; method?: any },
    res: {
        json: (
            arg0: boolean | UpdateWriteOpResult | Omit<any, never>[]
        ) => void;
    }
) {
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
