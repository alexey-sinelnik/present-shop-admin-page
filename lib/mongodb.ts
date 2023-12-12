import { MongoClient } from "mongodb";

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri: string = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {};

let client;
let clientPromise;

let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
};
if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
}
clientPromise = globalWithMongo._mongoClientPromise;
export default clientPromise;
