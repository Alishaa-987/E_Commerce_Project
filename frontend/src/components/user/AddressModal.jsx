import React, { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25 focus:bg-white/[0.05]";

const initialForm = {
  firstName: "",
  lastName: "",
  phone: "",
  country: "",
  countryCode: "",
  city: "",
  address1: "",
  address2: "",
  zipCode: "",
  addressType: "Default",
};

const getInitialForm = (address = null) =>
  address
    ? {
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        phone: address.phone || "",
        country: address.country || "",
        countryCode: address.countryCode || "",
        city: address.city || "",
        address1: address.address1 || "",
        address2: address.address2 || "",
        zipCode: address.zipCode || "",
        addressType: address.isDefault ? "Default" : address.addressType || "Home",
      }
    : initialForm;

const AddressModal = ({
  isOpen = false,
  isSubmitting = false,
  initialAddress = null,
  onClose,
  onSubmitAddress,
}) => {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [locationApi, setLocationApi] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const isEditing = Boolean(initialAddress?._id);

  useEffect(() => {
    let isMounted = true;

    if (!isOpen || locationApi) {
      return () => {
        isMounted = false;
      };
    }

    setIsLocationLoading(true);
    import("country-state-city")
      .then((module) => {
        if (!isMounted) {
          return;
        }

        setLocationApi(module);
        setCountries(module.Country.getAllCountries());
        setIsLocationLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setIsLocationLoading(false);
          setFormError("Location data could not be loaded. Please try again.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, locationApi]);

  useEffect(() => {
    if (!locationApi) {
      return;
    }

    if (!form.countryCode) {
      setCities([]);
      return;
    }

    setCities(locationApi.City.getCitiesOfCountry(form.countryCode));
  }, [form.countryCode, locationApi]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(getInitialForm(initialAddress));
    setFormError("");
  }, [initialAddress, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setForm(getInitialForm());
    setFormError("");
    onClose?.();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "countryCode") {
      const selectedCountry = countries.find((country) => country.isoCode === value);
      setForm((current) => ({
        ...current,
        countryCode: value,
        country: selectedCountry?.name || "",
        city: "",
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.countryCode || !form.city || !form.address1.trim() || !form.zipCode.trim()) {
      setFormError("Country, city, address line 1, and zip code are required.");
      return;
    }

    const result = await onSubmitAddress?.({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      country: form.country,
      countryCode: form.countryCode,
      city: form.city.trim(),
      address1: form.address1.trim(),
      address2: form.address2.trim(),
      zipCode: form.zipCode.trim(),
      addressType: form.addressType,
    });

    if (!result?.success) {
      setFormError(result?.message || "Address could not be saved.");
      return;
    }

    setForm(getInitialForm());
    setFormError("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#111114] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.65)] lg:p-8">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close add address form"
        >
          <FiX size={16} />
        </button>

        <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">Address Book</p>
        <h3 className="mt-3 text-3xl font-Playfair font-semibold text-white">
          {isEditing ? "Edit Address" : "Add New Address"}
        </h3>
        <p className="mt-3 text-sm text-white/50">
          {isEditing
            ? "Update your saved address details and keep your address book clean."
            : "Save an address once and choose it quickly during checkout."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              First Name
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Alisha"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              Last Name
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Fatima"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+1 (555) 000-0000"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              Country
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className={inputClass}
                disabled={isLocationLoading}
              >
                <option value="" className="bg-[#111114]">
                  {isLocationLoading ? "Loading countries..." : "Choose your country"}
                </option>
                {countries.map((country) => (
                  <option
                    key={country.isoCode}
                    value={country.isoCode}
                    className="bg-[#111114]"
                  >
                    {country.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-white/70">
              Choose your City
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
                disabled={!form.countryCode || isLocationLoading}
              >
                <option value="" className="bg-[#111114]">
                  {isLocationLoading
                    ? "Loading cities..."
                    : form.countryCode
                    ? "Choose your city"
                    : "Select country first"}
                </option>
                {cities.map((city) => (
                  <option
                    key={`${city.countryCode}-${city.name}`}
                    value={city.name}
                    className="bg-[#111114]"
                  >
                    {city.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-white/70 md:col-span-2">
              Address 1
              <input
                name="address1"
                value={form.address1}
                onChange={handleChange}
                className={inputClass}
                placeholder="851 SE 6th Avenue #101"
              />
            </label>

            <label className="space-y-2 text-sm text-white/70 md:col-span-2">
              Address 2
              <input
                name="address2"
                value={form.address2}
                onChange={handleChange}
                className={inputClass}
                placeholder="Delray Beach"
              />
            </label>

            <label className="space-y-2 text-sm text-white/70">
              Zip Code
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                className={inputClass}
                placeholder="33483"
              />
            </label>

            <label className="space-y-2 text-sm text-white/70">
              Address Type
              <select
                name="addressType"
                value={form.addressType}
                onChange={handleChange}
                className={inputClass}
              >
                {["Default", "Home", "Office"].map((type) => (
                  <option key={type} value={type} className="bg-[#111114]">
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {formError ? (
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
              {formError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiPlus size={16} />
            {isSubmitting ? "Saving..." : isEditing ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
