"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Pencil,
  Plus,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  AddAddressRequestBody,
  Address,
  ChangePasswordRequestBody,
  UpdateMeRequestBody,
} from "@/types/api";
import { useAuthState } from "@/hooks/useAuthState";
import {
  useAddAddressMutation,
  useChangePasswordMutation,
  useGetAddressesQuery,
  useRemoveAddressMutation,
  useUpdateAddressMutation,
  useUpdateMeMutation,
  useVerifyTokenQuery,
} from "@/store/apiSlice";

type AccountTab = "addresses" | "settings";

type AddressFormState = AddAddressRequestBody;

type PasswordFormState = ChangePasswordRequestBody;

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: unknown }).data === "object" &&
    (error as { data?: unknown }).data !== null &&
    "message" in ((error as { data?: unknown }).data as { message?: unknown })
  ) {
    const message = (
      (error as { data?: unknown }).data as { message?: unknown }
    ).message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return "Something went wrong. Please try again.";
}

function SidebarTabButton({
  icon,
  label,
  href,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
        isActive
          ? "bg-[#E5F5EC] text-[#16A34A]"
          : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`inline-flex size-10 items-center justify-center rounded-xl ${
            isActive ? "bg-[#22C55E] text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </span>
        <span className="text-base font-semibold leading-none sm:text-lg">
          {label}
        </span>
      </span>
      <ChevronRight
        className={`size-5 ${isActive ? "text-[#16A34A]" : "text-slate-400"}`}
      />
    </Link>
  );
}

function AddressCardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="size-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="space-y-3">
            <div className="h-5 w-28 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-48 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-36 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="size-9 animate-pulse rounded-xl bg-slate-100" />
          <div className="size-9 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuthState();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState<AddressFormState>({
    name: "",
    details: "",
    phone: "",
    city: "",
  });

  const [profileForm, setProfileForm] = useState<UpdateMeRequestBody>({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    password: "",
    rePassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const activeTab: AccountTab = pathname.endsWith("/settings")
    ? "settings"
    : "addresses";

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isAuthLoading, isLoggedIn, router]);

  const {
    data: addressesResponse,
    isLoading: isAddressesLoading,
    isFetching: isAddressesFetching,
  } = useGetAddressesQuery(undefined, {
    skip: !isLoggedIn,
  });

  const { data: verifyTokenResponse } = useVerifyTokenQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] =
    useUpdateAddressMutation();
  const [removeAddress, { isLoading: isRemovingAddress }] =
    useRemoveAddressMutation();
  const [updateMe, { isLoading: isUpdatingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const addresses = addressesResponse?.data ?? [];

  const isAddressBusy =
    isAddingAddress ||
    isUpdatingAddress ||
    isRemovingAddress ||
    isAddressesFetching;

  const modalTitle = editingAddressId ? "Edit Address" : "Add New Address";
  const modalActionText = editingAddressId ? "Save Changes" : "Add Address";

  const roleLabel = useMemo(() => {
    const roleValue = verifyTokenResponse?.decoded?.role;
    if (!roleValue) {
      return "User";
    }

    return roleValue.charAt(0).toUpperCase() + roleValue.slice(1).toLowerCase();
  }, [verifyTokenResponse?.decoded?.role]);
  const resolvedProfileName =
    profileForm?.name?.trim() && profileForm.name.trim().length > 0
      ? profileForm.name
      : (verifyTokenResponse?.decoded?.name ?? "");

  const openAddModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      name: "",
      details: "",
      phone: "",
      city: "",
    });
    setIsAddressModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddressId(address._id);
    setAddressForm({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city,
    });
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !addressForm.name.trim() ||
      !addressForm.details.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.city.trim()
    ) {
      toast.error("Please fill in all address fields.");
      return;
    }

    try {
      if (editingAddressId) {
        await updateAddress({
          id: editingAddressId,
          body: addressForm,
        }).unwrap();
        toast.success("Address updated successfully.");
      } else {
        await addAddress(addressForm).unwrap();
        toast.success("Address added successfully.");
      }

      setIsAddressModalOpen(false);
      setEditingAddressId(null);
      setAddressForm({
        name: "",
        details: "",
        phone: "",
        city: "",
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleAddressDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );
    if (!confirmed) {
      return;
    }

    try {
      await removeAddress(id).unwrap();
      toast.success("Address removed successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await updateMe({
        ...profileForm,
        name: resolvedProfileName,
      }).unwrap();

      setProfileForm({
        name: response.user.name ?? "",
        email: response.user.email ?? "",
        phone: response.user.phone ?? "",
      });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleChangePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (passwordForm.password.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.password !== passwordForm.rePassword) {
      toast.error("Password confirmation does not match.");
      return;
    }

    try {
      await changePassword(passwordForm).unwrap();
      toast.success("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        password: "",
        rePassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isAuthLoading || !isLoggedIn) {
    return <main className="min-h-screen bg-[#F8F9FB]" />;
  }

  return (
    <>
      <main className="min-h-screen bg-[#F8F9FB] pb-12">
        <section className="bg-linear-to-r from-[#16A34A] to-[#34D06D] text-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
            <div className="text-base text-green-50/90">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <span className="px-2">/</span>
              <span className="font-semibold text-white">My Account</span>
            </div>

            <div className="mt-6 flex items-start gap-4 sm:items-center">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                <User className="size-9 text-white" />
              </div>
              <div>
                <h1 className="text-[30px] font-bold tracking-tight text-white">
                  My Account
                </h1>
                <p className="mt-1 text-sm text-green-100 md:text-base">
                  Manage your addresses and account settings
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[290px_1fr] lg:items-start">
            <aside className="rounded-3xl border border-slate-200 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="text-2xl font-semibold text-slate-900">
                  My Account
                </h2>
              </div>
              <div className="space-y-2 p-3">
                <SidebarTabButton
                  icon={<MapPin className="size-5" />}
                  label="My Addresses"
                  href="/account/addresses"
                  isActive={activeTab === "addresses"}
                />
                <SidebarTabButton
                  icon={<Settings className="size-5" />}
                  label="Settings"
                  href="/account/settings"
                  isActive={activeTab === "settings"}
                />
              </div>
            </aside>

            <div className="space-y-6">
              {activeTab === "addresses" ? (
                <section>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 md:text-[26px]">
                        My Addresses
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Manage your saved delivery addresses
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={openAddModal}
                      disabled={isAddressBusy}
                      className="h-11 rounded-2xl bg-[#16A34A] px-6 text-base font-semibold text-white hover:bg-[#15803D]"
                    >
                      <Plus className="size-4" />
                      Add Address
                    </Button>
                  </div>

                  {isAddressesLoading || isAddressesFetching ? (
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <AddressCardSkeleton key={index} />
                      ))}
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-[0_6px_24px_rgba(15,23,42,0.05)] sm:px-8 sm:py-16">
                      <div className="mx-auto mb-6 flex size-22 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <MapPin className="size-9" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        No Addresses Yet
                      </h3>
                      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
                        Add your first delivery address to make checkout faster
                        and easier.
                      </p>
                      <Button
                        type="button"
                        onClick={openAddModal}
                        className="mt-7 h-11 rounded-2xl bg-[#16A34A] px-8 text-base font-semibold text-white hover:bg-[#15803D]"
                      >
                        <Plus className="size-4" />
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <article
                          key={address._id}
                          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex gap-3">
                              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#16A34A]">
                                <MapPin className="size-5" />
                              </div>

                              <div>
                                <h3 className="text-xl font-semibold text-slate-900">
                                  {address.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                  {address.details}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                  <span className="inline-flex items-center gap-1.5">
                                    <User className="size-4" />
                                    {address.phone}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5">
                                    <Building2 className="size-4" />
                                    {address.city}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(address)}
                                className="inline-flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-[#E6F7ED] hover:text-[#16A34A]"
                                aria-label={`Edit ${address.name}`}
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddressDelete(address._id)}
                                disabled={isRemovingAddress}
                                className="inline-flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                                aria-label={`Delete ${address.name}`}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 md:text-[26px]">
                      Account Settings
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Update your profile information and change your password
                    </p>
                  </div>

                  <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
                    <div className="px-5 py-6 sm:px-8">
                      <div className="mb-6 flex items-start gap-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E6F7ED] text-[#16A34A]">
                          <User className="size-7" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-slate-900">
                            Profile Information
                          </h3>
                          <p className="text-sm text-slate-500">
                            Update your personal details
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={handleProfileSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label
                            htmlFor="fullName"
                            className="text-sm font-medium text-slate-800"
                          >
                            Full Name
                          </label>
                          <Input
                            id="fullName"
                            value={resolvedProfileName}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                name: event.target.value,
                              }))
                            }
                            className="h-12 rounded-xl border-slate-200 px-4 text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-slate-800"
                          >
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={profileForm.email ?? ""}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                email: event.target.value,
                              }))
                            }
                            placeholder="Enter your email"
                            className="h-12 rounded-xl border-slate-200 px-4 text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium text-slate-800"
                          >
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            value={profileForm.phone ?? ""}
                            onChange={(event) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                phone: event.target.value,
                              }))
                            }
                            placeholder="01xxxxxxxxx"
                            className="h-12 rounded-xl border-slate-200 px-4 text-base"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="mt-2 h-11 rounded-2xl bg-[#16A34A] px-7 text-base font-semibold text-white hover:bg-[#15803D]"
                        >
                          {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </div>

                    <div className="border-t border-slate-200 bg-slate-50 px-5 py-6 sm:px-8">
                      <h4 className="text-2xl font-semibold text-slate-900">
                        Account Information
                      </h4>
                      <div className="mt-4 grid gap-3 text-base text-slate-600 md:grid-cols-[140px_1fr]">
                        <span className="font-medium text-slate-700">
                          User ID
                        </span>
                        <span className="font-mono text-slate-600">
                          {verifyTokenResponse?.decoded?.id ?? "-"}
                        </span>

                        <span className="font-medium text-slate-700">Role</span>
                        <span>
                          <span className="inline-flex items-center rounded-full bg-[#DDF7E8] px-3 py-1 text-sm font-semibold text-[#16A34A]">
                            {roleLabel}
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-[0_6px_24px_rgba(15,23,42,0.05)] sm:px-8">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#FFF3D6] text-[#D97706]">
                        <Lock className="size-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-900">
                          Change Password
                        </h3>
                        <p className="text-sm text-slate-500">
                          Update your account password
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleChangePasswordSubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label
                          htmlFor="currentPassword"
                          className="text-sm font-medium text-slate-800"
                        >
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(event) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                currentPassword: event.target.value,
                              }))
                            }
                            placeholder="Enter your current password"
                            className="h-12 rounded-xl border-slate-200 px-4 pr-12 text-base"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword((prev) => !prev)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                            aria-label="Toggle current password visibility"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="size-5" />
                            ) : (
                              <Eye className="size-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="newPassword"
                          className="text-sm font-medium text-slate-800"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.password}
                            onChange={(event) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                password: event.target.value,
                              }))
                            }
                            placeholder="Enter your new password"
                            className="h-12 rounded-xl border-slate-200 px-4 pr-12 text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                            aria-label="Toggle new password visibility"
                          >
                            {showNewPassword ? (
                              <EyeOff className="size-5" />
                            ) : (
                              <Eye className="size-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-slate-500">
                          Must be at least 6 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-slate-800"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.rePassword}
                            onChange={(event) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                rePassword: event.target.value,
                              }))
                            }
                            placeholder="Confirm your new password"
                            className="h-12 rounded-xl border-slate-200 px-4 pr-12 text-base"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                            aria-label="Toggle password confirmation visibility"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="size-5" />
                            ) : (
                              <Eye className="size-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="mt-2 h-11 rounded-2xl bg-[#D97706] px-7 text-base font-semibold text-white hover:bg-[#B45309]"
                      >
                        {isChangingPassword ? "Updating..." : "Change Password"}
                      </Button>
                    </form>
                  </article>
                </section>
              )}
            </div>
          </div>
        </section>
      </main>

      {isAddressModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-117.5 rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)] sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold text-slate-900">
                {modalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Close address modal"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="addressName"
                  className="text-base font-medium text-slate-700"
                >
                  Address Name
                </label>
                <Input
                  id="addressName"
                  value={addressForm.name}
                  onChange={(event) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Home, Office"
                  className="h-11 rounded-xl border-slate-200 px-4"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="addressDetails"
                  className="text-base font-medium text-slate-700"
                >
                  Full Address
                </label>
                <Textarea
                  id="addressDetails"
                  value={addressForm.details}
                  onChange={(event) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      details: event.target.value,
                    }))
                  }
                  placeholder="Street, building, apartment..."
                  className="min-h-22 rounded-xl border-slate-200 px-4 py-3"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="addressPhone"
                    className="text-base font-medium text-slate-700"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="addressPhone"
                    value={addressForm.phone}
                    onChange={(event) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="01xxxxxxxxx"
                    className="h-11 rounded-xl border-slate-200 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="addressCity"
                    className="text-base font-medium text-slate-700"
                  >
                    City
                  </label>
                  <Input
                    id="addressCity"
                    value={addressForm.city}
                    onChange={(event) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        city: event.target.value,
                      }))
                    }
                    placeholder="Cairo"
                    className="h-11 rounded-xl border-slate-200 px-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="h-11 rounded-2xl border-slate-200 bg-slate-100 text-base font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isAddressBusy}
                  className="h-11 rounded-2xl bg-[#16A34A] text-base font-semibold text-white hover:bg-[#15803D]"
                >
                  {isAddressBusy ? "Saving..." : modalActionText}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
