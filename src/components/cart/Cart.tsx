import { CartItem } from "./CartItem";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface ICartItem extends IProduct {
  quantity: number;
}

export function Cart({ items }: { items: ICartItem[] }) {
  return (
    <>
      {items.map((cartItem) => (
        <CartItem cartItem={cartItem} />
      ))}
      <div className="bg-gray-200 rounded-md mt-5 w-full lg:w-1/2 self-end text-right px-12 py-4 ml-auto">
        Total: $340
      </div>
    </>
  );
}
