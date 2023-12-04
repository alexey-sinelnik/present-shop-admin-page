import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import axios from "axios";

function Categories({ swal }) {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [editedCategory, setEditedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        return axios.get("/api/categories").then((response) => {
            setCategories(response.data);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name: categoryName,
            parent: parentCategory,
            properties: properties.map((property) => ({
                name: property.name,
                values: property.values.split(",")
            }))
        };

        if (editedCategory) {
            await axios.put("/api/categories", {
                ...data,
                _id: editedCategory._id
            });
            setEditedCategory(null);
        } else {
            await axios.post("/api/categories", data);
            setParentCategory("");
        }

        setCategoryName("");
        setParentCategory("");
        setProperties([]);
        return fetchCategories();
    };

    const handleEditCategory = (category) => {
        setEditedCategory(category);
        setCategoryName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(",")
            }))
        );
    };

    const handleDeleteCategory = (category) => {
        swal.fire({
            title: "Are you sure?",
            text: `Do you want delete category ${category.name}`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes. Delete!",
            confirmButtonColor: "#d55",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`/api/categories?_id=${category._id}`);
                fetchCategories();
            }
        });
    };

    const handleAddNewProperty = () => {
        setProperties((prevState) => {
            return [...prevState, { name: "", values: "" }];
        });
    };

    const handlePropertyNameChange = (index, property, newName) => {
        setProperties((prevState) => {
            const properties = [...prevState];
            properties[index].name = newName;
            return properties;
        });
    };

    const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties((prevState) => {
            const properties = [...prevState];
            properties[index].values = newValues;
            return properties;
        });
    };

    const handleRemoveProperty = (indexToRemove) => {
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
                    : "Create new category"}
            </label>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder="Category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <select
                        value={parentCategory}
                        onChange={(e) => setParentCategory(e.target.value)}
                    >
                        <option value="">No parent category</option>
                        {categories.length > 0 &&
                            categories.map((category) => (
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
                                        handlePropertyNameChange(
                                            index,
                                            property,
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Values"
                                    className="mb-0"
                                    value={property.values}
                                    onChange={(e) =>
                                        handlePropertyValuesChange(
                                            index,
                                            property,
                                            e.target.value
                                        )
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
                            categories.map((category) => (
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

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
