import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../components/product-form";
import { ProductFormProps } from "@/common/types/product";

export default function EditProductPage() {
    const [product, setProduct] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            axios.get("/api/products?id=" + id).then((response) => {
                setProduct(response.data);
            });
        }
    }, [id]);

    return (
        <Layout>
            <h1>Edit Product</h1>
            {product && <ProductForm {...(product as ProductFormProps)} />}
        </Layout>
    );
}
