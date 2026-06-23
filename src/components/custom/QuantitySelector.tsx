"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  maxQuantity?: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantitySelector({
  maxQuantity = 50,
  onQuantityChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleMinus = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handlePlus = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">Quantity</span>
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={handleMinus}
          disabled={quantity <= 1}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={18} className="text-gray-600" />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 1;
            if (val >= 1 && val <= maxQuantity) {
              setQuantity(val);
              onQuantityChange(val);
            }
          }}
          className="w-16 border-0 text-center font-semibold outline-none bg-white"
          min="1"
          max={maxQuantity}
        />
        <button
          onClick={handlePlus}
          disabled={quantity >= maxQuantity}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={18} className="text-gray-600" />
        </button>
      </div>
      <span className="text-sm text-gray-500">{maxQuantity} available</span>
    </div>
  );
}
