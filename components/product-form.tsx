import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";
import Spinner from "@/components/spinner";
import { ProductFormProps } from "@/common/types/product";
import { useAppDispatch, useAppSelector } from "@/store";
import { getCategories } from "@/store/thunks/categories";
import { createProduct, updateProduct } from "@/store/thunks/products";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties
}: ProductFormProps) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [images, setImages] = useState(existingImages || []);
    const [productProperties, setProductProperties] = useState(
        assignedProperties || {}
    );
    const [category, setCategory] = useState(assignedCategory || "");
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { categories } = useAppSelector((state) => state.categories);
    const { push } = useRouter();
    const dispatch = useAppDispatch();
    const propertiesToFill = [];

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = {
            title,
            description,
            price,
            images,
            category,
            properties: productProperties
        };
        if (_id) {
            dispatch(updateProduct({ ...data, _id }));
        } else {
            dispatch(createProduct(data));
        }
        setGoToProducts(true);
    };

    if (goToProducts) {
        push("/products");
    }

    const uploadImages = async (e: any) => {
        setIsUploading(true);
        const files = e.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/upload", data);
            setImages((prevState) => {
                return [...prevState, ...res.data.links];
            });
            setIsUploading(false);
        }
    };

    const updateImagesOrder = (images: SetStateAction<string[]>) => {
        setImages(images);
    };

    const setProductProperty = (
        propertyName: string | number,
        value: string
    ) => {
        setProductProperties((prevState: any) => {
            const newProductProps = { ...prevState };
            newProductProps[propertyName] = value;
            return newProductProps;
        });
    };

    if (categories.length > 0 && category) {
        let categoryInfo = categories.find(({ _id }) => _id === category);
        if (categoryInfo) propertiesToFill.push(...categoryInfo.properties);

        while (categoryInfo?.parent?._id) {
            const parentCategory = categories.find(
                ({ _id }) => _id === categoryInfo?.parent?._id
            );
            parentCategory &&
                propertiesToFill.push(...parentCategory.properties);
            categoryInfo = parentCategory;
        }
    }

    // TODO Разобраться с ReactSortable компонентом

    return (
        <form onSubmit={handleSubmit}>
            <label>Product name</label>
            <input
                type="text"
                placeholder="Product name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <label>Category</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="">Uncategorized</option>
                {categories.length > 0 &&
                    categories.map((category) => (
                        <option value={category._id} key={category._id}>
                            {category.name}
                        </option>
                    ))}
            </select>
            {propertiesToFill.length > 0 &&
                propertiesToFill.map((property, index) => (
                    <div key={index}>
                        <label>
                            {property.name[0].toUpperCase() +
                                property.name.substring(1)}
                        </label>
                        <div>
                            <select
                                value={productProperties[property.name]}
                                onChange={(e) =>
                                    setProductProperty(
                                        property.name,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">None</option>
                                {property.values.map((value: string) => (
                                    <option value={value} key={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            <label>Images</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    // @ts-ignore
                    list={images}
                    // @ts-ignore
                    setList={updateImagesOrder}
                    className="flex flex-wrap gap-1"
                >
                    {!!images?.length &&
                        images.map((image) => (
                            <div
                                key={image}
                                className="h-24 border border-gray-200 bg-white p-4 shadow-md rounded-md "
                            >
                                <img
                                    src={image}
                                    alt="Product image"
                                    className="rounded-md"
                                />
                            </div>
                        ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 p-1 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 test-sm bg-white shadow-md cursor-pointer text-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                    </svg>
                    <div>Add image</div>
                    <input
                        type="file"
                        onChange={uploadImages}
                        className="hidden"
                    />
                </label>
            </div>
            <label>Description</label>
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <label>Price</label>
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <button type="submit" className="btn-primary">
                Save
            </button>
        </form>
    );
}
