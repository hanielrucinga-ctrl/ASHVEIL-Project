import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { clampCartQty } from "./cart.ts";
import { useCart } from "./cart.ts";
import { slugifyProductName } from "../products.ts";

describe("cart quantity handling", () => {
  it("clamps quantity to at least one item when adding to cart", () => {
    const cart = useCart.getState();
    cart.clear();

    cart.add(
      {
        slug: "test-piece",
        size: "M",
        name: "Test Piece",
        image: "/products/test.jpg",
        unitPrice: 5000,
      },
      0,
    );

    assert.equal(useCart.getState().lines.length, 1);
    assert.equal(useCart.getState().lines[0]?.qty, 1);
  });

  it("removes a cart line when quantity is set to zero", () => {
    const cart = useCart.getState();
    cart.clear();
    cart.add(
      {
        slug: "test-piece",
        size: "M",
        name: "Test Piece",
        image: "/products/test.jpg",
        unitPrice: 5000,
      },
      2,
    );

    cart.setQty("test-piece", "M", 0);

    assert.deepEqual(useCart.getState().lines, []);
  });

  it("never exceeds the available stock for a cart line", () => {
    assert.equal(clampCartQty(9, 3), 3);
    assert.equal(clampCartQty(0, 8), 1);
    assert.equal(clampCartQty(5, 10), 5);
  });

  it("slugifies product names into stable storefront URLs", () => {
    assert.equal(slugifyProductName("Ashveil / Studio Tee"), "ashveil-studio-tee");
    assert.equal(slugifyProductName("  Fallen Angel   Tee  "), "fallen-angel-tee");
  });
});
