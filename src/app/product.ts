export class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: HTMLImageElement;
    category: string;
}

export class Cart{
    id: number;
    name: string;
    amount: number;
    price: number;
}