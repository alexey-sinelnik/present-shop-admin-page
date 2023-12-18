import { Product } from "@/models/products";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(
    req: { body?: any; query?: any; method?: any },
    res: { json: (arg0: boolean | any[]) => void }
) {
    const { method } = req;
    await mongooseConnect();

    const { title, description, price, images, category, properties, _id } =
        req.body;

    if (method === "POST") {
        const product = await Product.create({
            title,
            description,
            price,
            images,
            category,
            properties
        });
        res.json(product);
    }

    if (method === "GET") {
        if (req.query.id) {
            // @ts-ignore
            res.json(await Product.findOne({ _id: req.query.id }));
        } else {
            res.json(await Product.find());
        }
    }

    if (method === "PUT") {
        await Product.updateOne(
            { _id },
            { title, description, price, images, category, properties }
        );
        res.json(true);
    }

    if (method === "DELETE") {
        if (req.query.id) {
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }
}
