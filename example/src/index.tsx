import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import logo from './images/test_shop_logo.png';

import * as serviceWorker from "./serviceWorker";

import { CMSApp, EntitySchema, EnumValues } from "firecms";

import { firebaseConfig } from "./firebase_config";

const locales: EnumValues<string> = {
    "de-DE": "German",
    "en-US": "English (United States)",
    "es-ES": "Spanish (Spain)",
    "es-419": "Spanish (South America)"
};

export const productSchema: EntitySchema = {
    customId: true,
    name: "Product",
    properties: {
        name: {
            title: "Name",
            validation: { required: true },
            dataType: "string",
            includeInListView: true,
            includeAsMapPreview: true
        },
        price: {
            title: "Price",
            validation: { required: true },
            dataType: "number",
            includeInListView: true
        },
        status: {
            title: "Status",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                private: "Private",
                public: "Public"
            },
            includeInListView: true
        },
        categories: {
            title: "Categories",
            validation: { required: true },
            dataType: "array",
            of: {
                dataType: "string",
                enumValues: {
                    electronics: "Electronics",
                    books: "Books",
                    furniture: "Furniture",
                    clothing: "Clothing",
                    food: "Food"
                }
            },
            includeInListView: true
        },
        image: {
            title: "Image",
            dataType: "string",
            storageMeta: {
                mediaType: "image",
                storagePath: "images",
                acceptedFiles: ["image/*"]
            },
            includeInListView: true,
            includeAsMapPreview: true
        },
        tags: {
            title: "Tags",
            description: "Example of generic array",
            validation: { required: true },
            dataType: "array",
            of: {
                dataType: "string"
            },
            includeInListView: true
        },
        description: {
            title: "Description",
            description: "Not mandatory but it'd be awesome if you filled this up",
            dataType: "string",
            includeInListView: false
        },
        published: {
            title: "Published",
            dataType: "boolean",
            includeInListView: true
        },
        expires_on: {
            title: "Expires on",
            dataType: "timestamp",
            includeInListView: false
        },
        publisher: {
            title: "Publisher",
            description: "This is an example of a map property",
            dataType: "map",
            properties: {
                name: {
                    title: "Name",
                    includeInListView: true,
                    dataType: "string"
                },
                external_id: {
                    title: "External id",
                    includeInListView: true,
                    dataType: "string"
                }
            },
            includeInListView: true
        },
        available_locales: {
            title: "Available locales",
            description:
                "This is an example of a disable field",
            dataType: "array",
            disabled: true,
            of: {
                dataType: "string"
            },
            includeInListView: true
        }
    },
    subcollections: [
        {
            name: "Locales",
            relativePath: "locales",
            schema: {
                customId: locales,
                name: "Locale",
                properties: {
                    title: {
                        title: "Title",
                        validation: { required: true },
                        dataType: "string",
                        includeInListView: true
                    },
                    selectable: {
                        title: "Selectable",
                        description: "Is this locale selectable",
                        dataType: "boolean",
                        includeInListView: true
                    },
                    video: {
                        title: "Video",
                        dataType: "string",
                        validation: { required: false },
                        storageMeta: {
                            mediaType: "video",
                            storagePath: "videos",
                            acceptedFiles: ["video/*"]
                        },
                        includeInListView: true
                    }
                }
            }
        }
    ]
};

const blogSchema: EntitySchema = {
    name: "Blog entry",
    properties: {
        name: {
            title: "Name",
            validation: { required: true },
            dataType: "string",
            includeInListView: true
        },
        content: {
            title: "Content",
            validation: { required: true },
            dataType: "array",
            of: {
                dataType: "string"
            },
            includeInListView: false
        },
        status: {
            title: "Status",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                published: "Published",
                draft: "Draft"
            },
            includeInListView: true
        },
        products: {
            title: "Products",
            validation: { required: true },
            dataType: "array",
            of: {
                dataType: "reference",
                collectionPath: "products",
                schema: productSchema
            },
            includeInListView: true
        },

        image: {
            title: "Image",
            dataType: "string",
            storageMeta: {
                mediaType: "image",
                storagePath: "images",
                acceptedFiles: ["image/*"]
            },
            includeInListView: true
        }
    }
};


ReactDOM.render(
    <CMSApp
        name={"Test shop CMS"}
        authentication={false}
        logo={logo}
        navigation={[
            {
                relativePath: "products",
                schema: productSchema,
                name: "Products"
            },
            {
                relativePath: "blog",
                schema: blogSchema,
                name: "Blog"
            }
        ]}
        firebaseConfig={firebaseConfig}
    />,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
serviceWorker.unregister();
