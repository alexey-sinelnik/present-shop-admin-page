import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/orders";

export default async function handle(
    req: any,
    res: { json: (arg0: any[]) => void }
) {
    await mongooseConnect();
    res.json(await Order.find().sort({ createdAt: -1 }));
}
