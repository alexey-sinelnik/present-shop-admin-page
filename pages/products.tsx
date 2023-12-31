import Layout from "@/components/layout";
import { useCallback, useEffect } from "react";
import { withSwal } from "react-sweetalert2";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/store";
import { deleteProduct, getProducts } from "@/store/thunks/products";
import { ProductType } from "@/common/types/product";
import { deleteProductFromState } from "@/store/slices/products";

function Products({ swal }: any) {
    const { products } = useAppSelector((state) => state.products);
    const { push } = useRouter();
    const dispatch = useAppDispatch();

    const fetchProducts = useCallback(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteProduct = (product: ProductType) => {
        swal.fire({
            title: "Are you sure?",
            text: `Do you want delete category ${product.title}`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes. Delete!",
            confirmButtonColor: "#d55",
            reverseButtons: true
        }).then(async (result: { isConfirmed: boolean }) => {
            if (result.isConfirmed) {
                dispatch(deleteProduct(product._id));
                dispatch(deleteProductFromState({ id: product._id }));
            }
        });
    };

    console.log("URL from mongo", process.env.NEXT_PUBLIC_MONGODB_URI);

    return (
        <Layout>
            <button
                className="btn-primary"
                type="button"
                onClick={() => push("/products/new")}
            >
                Add new product
            </button>

            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Product name</td>
                        <td />
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: ProductType) => (
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td className="flex gap-1">
                                <button
                                    className="btn-primary flex justify-center items-center"
                                    onClick={() => {
                                        push(`/products/edit/${product._id}`);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                        />
                                    </svg>
                                    Edit
                                </button>

                                <button
                                    className="btn-red flex justify-center items-center"
                                    onClick={() => handleDeleteProduct(product)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }: any, ref: any) => <Products swal={swal} />);
