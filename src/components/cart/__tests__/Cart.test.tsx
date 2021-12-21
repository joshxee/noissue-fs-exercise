import { render, screen } from "@testing-library/react";
import { Cart, ICartItem } from "../Cart";

test("renders learn react link", () => {
  const cartItems: ICartItem[] = [
    {
      price: 120,
      name: "noissue Tissue",
      description: "Compostable tissue paper",
      imageUrl: "noissue-tissue.jpeg",
      quantity: 2,
    },
    {
      price: 100,
      name: "Compostable mailer",
      description: "The perfect alternative to plastic poly mailer bags.",
      imageUrl: "noissue-mailer.png",
      quantity: 1,
    },
  ];

  render(<Cart items={cartItems} />);

  const total = screen.getByText("Total: $340");
  expect(total).toBeInTheDocument();
});
