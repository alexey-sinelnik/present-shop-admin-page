import Layout from "../components/layout";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import {
    CategoryChangeType,
    CategoryType,
    PropertyType
} from "@/common/types/category";
import { useAppDispatch, useAppSelector } from "@/store";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory
} from "@/store/thunks/categories";

function Categories({ swal }: any) {
    const [categoryName, setCategoryName] = useState("");
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [parentCategory, setParentCategory] = useState<string>("");
    const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
        null
    );
    const { categories } = useAppSelector((state) => state.categories);
    const dispatch = useAppDispatch();

    const fetchCategories = useCallback(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const data = {
            name: categoryName,
            parent: parentCategory,
            properties: properties.map(
                (element: { name: string; values: any }) => ({
                    name: element.name,
                    values: element.values.split(",")
                })
            )
        };

        if (editedCategory) {
            dispatch(updateCategory({ ...data, _id: editedCategory._id }));
            setEditedCategory(null);
        } else {
            dispatch(createCategory(data));
            setParentCategory("");
        }

        setCategoryName("");
        setParentCategory("");
        setProperties([]);
        return fetchCategories();
    };

    const handleEditCategory = (category: CategoryType) => {
        setEditedCategory(category);
        setCategoryName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(
                ({ name, values }: { name: string; values: any }) => ({
                    name,
                    values: values.join(",")
                })
            )
        );
    };

    const handleDeleteCategory = (category: CategoryType) => {
        swal.fire({
            title: "Are you sure?",
            text: `Do you want delete category ${category.name}`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes. Delete!",
            confirmButtonColor: "#d55",
            reverseButtons: true
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                dispatch(deleteCategory(category._id));
                fetchCategories();
            }
        });
    };

    const handleAddNewProperty = () => {
        setProperties((prevState: any) => {
            return [...prevState, { name: "", values: "" }];
        });
    };

    const handlePropertyNameChange = (args: CategoryChangeType) => {
        setProperties((prevState) => {
            const properties = [...prevState];
            properties[args.index].name = args.newName;
            return properties;
        });
    };

    const handlePropertyValuesChange = (args: CategoryChangeType) => {
        setProperties((prevState: any) => {
            const properties = [...prevState];
            properties[args.index].values = args.newName;
            return properties;
        });
    };

    const handleRemoveProperty = (indexToRemove: number) => {
        setProperties((prevState) => {
            return [...prevState].filter((property, propertyIndex) => {
                return propertyIndex !== indexToRemove;
            });
        });
    };

    return (
        <Layout>
            <h1>Categories page</h1>
            <label>
                {editedCategory
                    ? `Edit category ${editedCategory.name}`
                    : "Create new categories"}
            </label>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder="Category name"
                        value={categoryName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCategoryName(e.target.value)
                        }
                    />
                    <select
                        value={parentCategory}
                        onChange={(e) => setParentCategory(e.target.value)}
                    >
                        <option value="">No parent category</option>
                        {categories.length > 0 &&
                            categories.map((category: CategoryType) => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block">Properties</label>
                    <button
                        type="button"
                        className="btn-default text-sm mb-2"
                        onClick={handleAddNewProperty}
                    >
                        Add new property
                    </button>
                    {properties.length > 0 &&
                        properties.map((property, index) => (
                            <div className="flex gap-1 mb-2" key={index}>
                                <input
                                    type="text"
                                    placeholder="Property name"
                                    className="mb-0"
                                    value={property.name}
                                    onChange={(e) =>
                                        handlePropertyNameChange({
                                            index,
                                            property,
                                            newName: e.target.value
                                        })
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Values"
                                    className="mb-0"
                                    value={property.values}
                                    onChange={(e) =>
                                        handlePropertyValuesChange({
                                            index,
                                            property,
                                            newName: e.target.value
                                        })
                                    }
                                />
                                <button
                                    onClick={() => handleRemoveProperty(index)}
                                    className="btn-default"
                                    type="button"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                </div>
                <div className="flex gap-1 items-center">
                    <div className="flex gap-1">
                        {editedCategory && (
                            <button
                                onClick={() => {
                                    setEditedCategory(null);
                                    setCategoryName("");
                                    setParentCategory("");
                                    setProperties([]);
                                }}
                                type="button"
                                className="btn-default"
                            >
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="btn-primary">
                            Save
                        </button>
                    </div>
                </div>
            </form>
            {!editedCategory && (
                <table className="basic mt-2">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td />
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 &&
                            categories.map((category: CategoryType) => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() =>
                                                    handleEditCategory(category)
                                                }
                                                className="btn-primary"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-red"
                                                onClick={() =>
                                                    handleDeleteCategory(
                                                        category
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}

export default withSwal(({ swal }: any) => <Categories swal={swal} />);
