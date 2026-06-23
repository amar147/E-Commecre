"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import Link from "next/link";

type Address = {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
};

type AddressSelectionCardProps = {
  isAddressesLoading: boolean;
  isAddressesError: boolean;
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
  onUseManualAddress: () => void;
};

export default function AddressSelectionCard({
  isAddressesLoading,
  isAddressesError,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onUseManualAddress,
}: AddressSelectionCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <LockKeyhole className="size-4 text-green-700" />
        Saved Addresses
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Select a saved address or enter a new one below
      </p>

      {isAddressesLoading ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <Loader2 className="size-4 animate-spin text-green-600" />
          Loading saved addresses...
        </div>
      ) : null}

      {!isAddressesLoading && isAddressesError ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load saved addresses right now.
        </div>
      ) : null}

      {!isAddressesLoading && !isAddressesError && addresses.length > 0 ? (
        <div className="mt-4 space-y-3">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address._id;

            return (
              <button
                key={address._id}
                type="button"
                onClick={() => onSelectAddress(address._id)}
                className={`w-full rounded-xl border p-4 text-left shadow-sm transition ${
                  isSelected
                    ? "border-green-600 bg-green-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <svg viewBox="0 0 24 24" className="size-4 fill-current">
                      <path d="M12 2C8.14 2 5 5.14 5 9c0 4.25 5.2 11.1 6.15 12.34.44.57 1.29.57 1.73 0C13.8 20.1 19 13.25 19 9c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {address.name}
                    </p>
                    <p className="text-xs text-slate-500">{address.details}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>{address.phone}</span>
                      <span>{address.city}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      {!isAddressesLoading && !isAddressesError && addresses.length === 0 ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No saved addresses yet. You can add one now or manage your addresses
          from{" "}
          <Link href="/account/addresses" className="font-semibold underline">
            your account
          </Link>
          .
        </div>
      ) : null}

      <button
        type="button"
        onClick={onUseManualAddress}
        className="mt-3 flex w-full items-center gap-3 rounded-xl border border-dashed border-green-400 bg-green-50 px-4 py-4 text-left text-sm font-semibold text-green-700 transition hover:bg-green-100"
      >
        <span className="flex size-9 items-center justify-center rounded-lg bg-green-600 text-white">
          +
        </span>
        <span>
          <span className="block">Use a different address</span>
          <span className="block text-xs font-normal text-green-700/80">
            Enter a new shipping address manually
          </span>
        </span>
      </button>
    </div>
  );
}
