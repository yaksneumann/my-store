export interface Product {
    id: number;
    name: string;          // required, max 30 chars
    description?: string;  // optional, max 200 chars
    price: number;         // required, > 0
    creationDate: Date;    // required
    imageUrl?: string;     // optional, for static images
}