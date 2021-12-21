import { ICartItem } from "./Cart";

const CartItem = ({ cartItem }: { cartItem: ICartItem }) => (
  <div className="p-6 mt-5 w-full max-w-xlg mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
    <img className="h-20 w-20" src={`/assets/${cartItem.imageUrl}`} />
    <div className="md:flex justify-between w-full">
      <div className="flex flex-col justify-center">
        <p className="text-xl font-medium text-indigo-900">{cartItem.name}</p>
        <p className="text-gray-500 text-sm">{cartItem.description}</p>
        <p className="text-gray-500 text-sm">Price: ${cartItem.price}</p>
        <p className="text-gray-500 text-sm">Quantity: {cartItem.quantity}</p>
      </div>
      <p className="flex items-center text-gray-500 mt-6 md:m-6">
        ${cartItem.price * cartItem.quantity}
      </p>
    </div>
  </div>
);

export { CartItem };
