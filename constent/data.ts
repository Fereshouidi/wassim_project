import { CollectionType, ProductType } from "@/types";

export const fakeProducts = Array.from({ length: 8 }, (_, i) => ({
  _id: (i + 1).toString(),
  name: { fr: `Produit ${i + 1}`, en: `Product ${i + 1}` },
  price: 0.0,
  thumbNail: "",
  images: [
    { 
      uri: "", 
      // تم التغيير من [] إلى كائن فارغ أو قيم افتراضية ليطابق الكائن الواحد
      specification: { color: "", colorHex: "", size: "", type: "", price: 0, quantity: 0 } 
    }
  ],
  description: { fr: "", en: "" },
  collections: [],
  stock: 0,
  specifications: [
    { color: "", colorHex: "", size: "", type: "", price: 0.0, quantity: 0 },
  ],
})) as ProductType[];

const loadingPlaceholder: ProductType = {
  _id: null,
  name: { fr: null, en: null },
  price: null,
  thumbNail: null,
  images: [
    { 
      uri: '', 
      specification: { color: null, colorHex: null, size: null, type: null, price: null, quantity: null } 
    }
  ],
  description: { fr: null, en: null },
  collections: [],
  stock: null,
  specifications: [
    { color: null, colorHex: null, size: null, type: null, price: null, quantity: null },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const productsLoading: ProductType[] = Array.from({ length: 10 }, (_, i) => ({
  ...loadingPlaceholder,
  _id: (i + 1).toString(),
}));

export const collectionsLoading: CollectionType[] = Array.from({ length: 6 }, (_, i) => ({
  _id: (i + 1).toString(),
  name: { en: null, fr: null },
  thumbNail: null,
  type: "private",
  display: i === 0 ? "horizontal" : "vertical"
}));

// export const defaultEvaluation = {
//   client?: string
//   product?: string
//   number?: number
//   note?: string
// }
