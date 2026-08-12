import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { jwtDecode } from "jwt-decode";
import { City, Country, State } from "country-state-city";

import AddressService from "../../../services/AddressService";
import { AddressRequest, AddressResponse, AddressType } from "../../../services/Address";
import UserService from "../../../services/UserService";
import { UpdateUserRequest, UserResponse } from "../../../services/User";

interface JwtPayload {
  id: number;
}

type EditableAddress = AddressRequest & { addressId?: string };

const includeSelectedOption = (options: string[], selected: string) =>
  selected && !options.includes(selected) ? [selected, ...options] : options;

const emptyAddress = (): EditableAddress => ({
  alternatePhoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  addressType: AddressType.HOME,
  defaultAddress: false,
});

const addressToForm = (address: AddressResponse): EditableAddress => ({
  addressId: address.addressId,
  alternatePhoneNumber: address.alternatePhoneNumber ?? "",
  addressLine1: address.addressLine1 ?? "",
  addressLine2: address.addressLine2 ?? "",
  landmark: address.landmark ?? "",
  city: address.city ?? "",
  state: address.state ?? "",
  country: address.country ?? "",
  postalCode: address.postalCode ?? "",
  addressType: address.addressType ?? AddressType.HOME,
  defaultAddress: Boolean(address.defaultAddress),
});

const toAddressRequest = ({ addressId: _addressId, ...address }: EditableAddress): AddressRequest => address;

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString() : "—";

const MyProfile = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [addressFormData, setAddressFormData] = useState<EditableAddress[]>([]);
  const [profileImage, setProfileImage] = useState<File | undefined>();
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  let userId: number | undefined;
  try {
    userId = token ? jwtDecode<JwtPayload>(token).id : undefined;
  } catch {
    userId = undefined;
  }

  const populateForm = (profile: UserResponse, profileAddresses: AddressResponse[]) => {
    setUser(profile);
    setAddresses(profileAddresses);
    setFormData({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
    });
    setAddressFormData(profileAddresses.map(addressToForm));
  };

  const loadProfile = async () => {
    if (!userId) {
      setError("Your session is invalid. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [userResponse, addressResult] = await Promise.all([
        UserService.getUserById(userId),
        AddressService.getAddressesByUser().catch(() => null),
      ]);
      const profile = userResponse.data.data;
      populateForm(profile, addressResult?.data.data ?? profile.addresses ?? []);
    } catch (requestError) {
      console.error(requestError);
      setError("Could not load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleAddressChange = (
    index: number,
    field: keyof EditableAddress,
    value: string | boolean,
  ) => {
    setAddressFormData((previous) =>
      previous.map((address, addressIndex) =>
        addressIndex === index ? { ...address, [field]: value } : address,
      ),
    );
  };

  const handleCountryChange = (index: number, country: string) => {
    setAddressFormData((previous) =>
      previous.map((address, addressIndex) =>
        addressIndex === index ? { ...address, country, state: "", city: "" } : address,
      ),
    );
  };

  const handleStateChange = (index: number, state: string) => {
    setAddressFormData((previous) =>
      previous.map((address, addressIndex) =>
        addressIndex === index ? { ...address, state, city: "" } : address,
      ),
    );
  };

  const handleCancel = () => {
    if (user) populateForm(user, addresses);
    setProfileImage(undefined);
    setProfileImagePreview("");
    setError("");
    setSuccess("");
    setEditMode(false);
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    if (!image) return;

    setProfileImage(image);
    setProfileImagePreview(URL.createObjectURL(image));
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const userResponse = await UserService.updateUser(userId, formData, profileImage);
      const savedAddresses = await Promise.all(
        addressFormData.map((address) =>
          address.addressId
            ? AddressService.updateAddress(address.addressId, toAddressRequest(address))
            : AddressService.addAddress(toAddressRequest(address)),
        ),
      );
      const updatedAddresses = savedAddresses.map((response) => response.data.data);
      populateForm(userResponse.data.data, updatedAddresses);
      setProfileImage(undefined);
      setProfileImagePreview("");
      setEditMode(false);
      setSuccess("Your profile and addresses have been updated.");
    } catch (requestError) {
      console.error(requestError);
      setError("Could not save your profile. Please review the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>;
  }

  if (!user) return <Typography sx={{ p: 3 }}>Profile not found.</Typography>;

  const profileFields = [
    ["User ID", user.id],
    ["Full Name", user.fullName || `${user.firstName} ${user.lastName}`],
    ["Role", user.role],
    ["Created", formatDate(user.createdAt)],
    ["Last Updated", formatDate(user.updatedAt)],
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1050, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h5">My Profile</Typography>
        {!editMode ? (
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>Edit Profile</Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" color="inherit" startIcon={<CloseIcon />} onClick={handleCancel} disabled={saving}>Cancel</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </Box>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              src={profileImagePreview || user.profileImageUrl}
              alt={user.fullName || `${user.firstName} ${user.lastName}`}
              sx={{
                width: 92,
                height: 92,
                border: "3px solid #1976d2",
                bgcolor: "primary.main",
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              {(user.firstName || user.email || "U").charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">Personal details</Typography>
              <Typography color="text.secondary">{user.fullName || `${user.firstName} ${user.lastName}`}</Typography>
              {editMode && (
                <Button component="label" size="small" sx={{ mt: 0.5 }}>
                  Upload profile picture
                  <input hidden accept="image/*" type="file" onChange={handleProfileImageChange} />
                </Button>
              )}
            </Box>
          </Box>
          <Grid container spacing={3}>
            {(["firstName", "lastName", "email", "phoneNumber"] as const).map((field) => (
              <Grid size={{ xs: 12, md: 6 }} key={field}>
                <Typography color="text.secondary">{({ firstName: "First Name", lastName: "Last Name", email: "Email", phoneNumber: "Phone Number" })[field]}</Typography>
                {editMode ? <TextField fullWidth required={field !== "phoneNumber"} type={field === "email" ? "email" : "text"} name={field} value={formData[field]} onChange={handleUserChange} sx={{ mt: 1 }} /> : <Typography sx={{ fontWeight: "bold" }}>{formData[field] || "—"}</Typography>}
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary" sx={{ mb: 1 }}>Status</Typography>
              <Chip label={user.status} color={user.status === "ACTIVE" ? "success" : "error"} />
            </Grid>
            {profileFields.map(([label, value]) => (
              <Grid size={{ xs: 12, md: 6 }} key={label as string}>
                <Typography color="text.secondary">{label}</Typography>
                <Typography sx={{ fontWeight: "bold", wordBreak: "break-word" }}>{value || "—"}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2 }}>
            <Typography variant="h6">Addresses</Typography>
            {editMode && <Button startIcon={<AddIcon />} onClick={() => setAddressFormData((previous) => [...previous, emptyAddress()])}>Add Address</Button>}
          </Box>
          {!addressFormData.length ? (
            <Typography color="text.secondary">No address has been added yet.</Typography>
          ) : addressFormData.map((address, index) => (
            <Box key={address.addressId ?? `new-address-${index}`}>
              {index > 0 && <Divider sx={{ my: 3 }} />}
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Address {index + 1}</Typography>
              {!editMode && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Address ID: {address.addressId ?? "—"}
                  {addresses[index]?.createdAt && ` · Created: ${formatDate(addresses[index].createdAt)}`}
                  {addresses[index]?.updatedAt && ` · Last updated: ${formatDate(addresses[index].updatedAt)}`}
                </Typography>
              )}
              <Grid container spacing={2}>
                {(
                  [
                    ["addressLine1", "Address Line 1"], ["addressLine2", "Address Line 2"], ["landmark", "Landmark"],
                    ["postalCode", "Postal Code"], ["alternatePhoneNumber", "Alternate Phone Number"],
                  ] as const
                ).map(([field, label]) => (
                  <Grid size={{ xs: 12, md: 6 }} key={field}>
                    <Typography color="text.secondary">{label}</Typography>
                    {editMode ? <TextField fullWidth required={field === "addressLine1" || field === "postalCode"} value={address[field]} onChange={(event) => handleAddressChange(index, field, event.target.value)} sx={{ mt: 1 }} /> : <Typography sx={{ fontWeight: "bold" }}>{address[field] || "—"}</Typography>}
                  </Grid>
                ))}
                {(() => {
                  const countries = Country.getAllCountries();
                  const selectedCountry = countries.find((country) => country.name === address.country);
                  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
                  const selectedState = states.find((state) => state.name === address.state);
                  const cities = selectedCountry && selectedState
                    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
                    : [];

                  return (
                    <>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography color="text.secondary">Country</Typography>
                        {editMode ? (
                          <TextField select fullWidth required value={address.country} onChange={(event) => handleCountryChange(index, event.target.value)} sx={{ mt: 1 }}>
                            <MenuItem value="" disabled>Select country</MenuItem>
                            {includeSelectedOption(countries.map((country) => country.name), address.country).map((country) => <MenuItem key={country} value={country}>{country}</MenuItem>)}
                          </TextField>
                        ) : <Typography sx={{ fontWeight: "bold" }}>{address.country || "—"}</Typography>}
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography color="text.secondary">State</Typography>
                        {editMode ? (
                          <TextField select fullWidth required disabled={!selectedCountry} value={address.state} onChange={(event) => handleStateChange(index, event.target.value)} sx={{ mt: 1 }}>
                            <MenuItem value="" disabled>Select state</MenuItem>
                            {includeSelectedOption(states.map((state) => state.name), address.state).map((state) => <MenuItem key={state} value={state}>{state}</MenuItem>)}
                          </TextField>
                        ) : <Typography sx={{ fontWeight: "bold" }}>{address.state || "—"}</Typography>}
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography color="text.secondary">City</Typography>
                        {editMode ? (
                          <TextField select fullWidth required disabled={!selectedState} value={address.city} onChange={(event) => handleAddressChange(index, "city", event.target.value)} sx={{ mt: 1 }}>
                            <MenuItem value="" disabled>Select city</MenuItem>
                            {includeSelectedOption(cities.map((city) => city.name), address.city).map((city) => <MenuItem key={city} value={city}>{city}</MenuItem>)}
                          </TextField>
                        ) : <Typography sx={{ fontWeight: "bold" }}>{address.city || "—"}</Typography>}
                      </Grid>
                    </>
                  );
                })()}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography color="text.secondary">Address Type</Typography>
                  {editMode ? <TextField select fullWidth value={address.addressType} onChange={(event) => handleAddressChange(index, "addressType", event.target.value)} sx={{ mt: 1 }}><MenuItem value={AddressType.HOME}>Home</MenuItem><MenuItem value={AddressType.OFFICE}>Office</MenuItem><MenuItem value={AddressType.WORK}>Work</MenuItem><MenuItem value={AddressType.OTHER}>Other</MenuItem></TextField> : <Typography sx={{ fontWeight: "bold" }}>{address.addressType}</Typography>}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "end" }}>
                  {editMode ? <FormControlLabel control={<Switch checked={address.defaultAddress} onChange={(event) => handleAddressChange(index, "defaultAddress", event.target.checked)} />} label="Set as default address" /> : <Chip label={address.defaultAddress ? "Default Address" : "Additional Address"} color={address.defaultAddress ? "primary" : "default"} />}
                </Grid>
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyProfile;
