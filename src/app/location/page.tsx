"use client";

import axios from "axios";
import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { formatPhoneNumber } from "react-phone-number-input";

import * as interfaces from "@/interfaces/index";
import ProfileBoxContainerComponent from "@/components/ProfileBoxContainer/ProfileBoxContainerComponent";
import { InputTelephoneIntlComponent } from "@/components/InputTelephoneIntl/InputTelephoneIntlComponent";
import { MapPickerComponent } from "@/components/MapPicker/MapPickerComponent";

export default function Location() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [userData, setUserData] = useState<{
    name: string;
    avatar_url: string;
  }>({
    name: "",
    avatar_url: "",
  });
  const [hover, setHover] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<interfaces.LocationInputProps>({
    resolver: zodResolver(interfaces.LocationInputSchema),
  });
  const onSubmit: SubmitHandler<interfaces.LocationInputProps> = (data) =>
    postLocation(data);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setValue("coords.latitude", lat);
    setValue("coords.longitude", lng);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setImagePreview(null);
  };

  async function postLocation(data: interfaces.LocationInputProps) {
    try {
      setIsLoading(true);
      const githubToken = localStorage.getItem("github-token");
      const googleToken = localStorage.getItem("google-token");
      const parsedGoogleInfo = googleToken && JSON.parse(googleToken);

      const token = githubToken
        ? githubToken
        : String(parsedGoogleInfo.access_token);

      if (token) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/pending-locations`,
          {
            name: data.name,
            type: data.type,
            address: data.address,
            contact: data.telephone
              ? formatPhoneNumber(data.telephone)
              : data.telephone,
            coords: data.coords,
            provider: githubToken ? "github" : "google",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 200)
          toast.success(
            "Location successfully shared! Thank you for helping 🤗",
          );
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Unable to share location, please try again. 😓");
      console.error("Unable to post new location /postLocation");
    } finally {
      setIsLoading(false);
    }
  }

  async function getUserData() {
    try {
      const githubToken = localStorage.getItem("github-token");
      const googleToken = localStorage.getItem("google-token");
      const parsedGoogleInfo = googleToken && JSON.parse(googleToken);

      if (githubToken) {
        try {
          const { data } = await axios.get("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${githubToken}`,
            },
          });

          return data;
        } catch (error) {
          console.error(
            "Unable to retrieve user data from GitHub API [getUserData]",
            error,
          );
        }
      } else {
        try {
          const { data } = await axios.get<interfaces.GooglePeopleAPIProps>(
            "https://people.googleapis.com/v1/people/me?personFields=names,photos",
            {
              headers: {
                Authorization: `Bearer ${parsedGoogleInfo.access_token}`,
              },
            },
          );

          return {
            name: data.names[0].displayName,
            avatar_url: data.photos[0].url,
          };
        } catch (error) {
          console.error(
            "Unable to retrieve user data from Google API [getUserData]",
            error,
          );
        }
      }
    } catch (error) {
      console.error("Unable to retrieve user user token [getUserData]", error);
    }
  }

  useEffect(() => {
    getUserData().then((res) => {
      if (res) {
        setUserData({
          name: res.name,
          avatar_url: res.avatar_url,
        });
      }
    });

    function handleClickOutside(event: MouseEvent) {
      if (
        imageRef.current &&
        !imageRef.current.contains(event.target as Node)
      ) {
        setHover(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <main
      className="min-h-screen bg-[#E67E22] p-4 md:p-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #E67E22 0%, #D35400 50%, #CA6F1E 100%)",
      }}
    >
      <div className="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/3 -translate-y-1/3">
        <svg viewBox="0 0 600 600" className="w-full h-full" aria-hidden="true">
          <path
            d="M300,50 Q500,100 550,300 T300,550 Q100,500 50,300 T300,50"
            fill="#D35400"
            opacity="0.4"
          />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[700px] h-[700px] translate-x-1/3 -translate-y-1/3">
        <svg viewBox="0 0 700 700" className="w-full h-full" aria-hidden="true">
          <path
            d="M350,50 Q600,150 650,350 T350,650 Q100,550 50,350 T350,50"
            fill="#F39C12"
            opacity="0.3"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-[650px] h-[650px] -translate-x-1/3 translate-y-1/3">
        <svg viewBox="0 0 650 650" className="w-full h-full" aria-hidden="true">
          <path
            d="M325,50 Q575,125 625,325 T325,625 Q75,550 25,325 T325,50"
            fill="#C0652C"
            opacity="0.35"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-[550px] h-[550px] translate-x-1/4 translate-y-1/4">
        <svg viewBox="0 0 550 550" className="w-full h-full" aria-hidden="true">
          <path
            d="M275,50 Q475,100 525,275 T275,525 Q75,475 25,275 T275,50"
            fill="#E67E22"
            opacity="0.3"
          />
        </svg>
      </div>
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        aria-hidden="true"
      >
        <path
          d="M -100,200 Q 100,150 200,250"
          stroke="#B85C1B"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 1440,100 Q 1300,150 1200,50"
          stroke="#B85C1B"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M -50,600 Q 150,550 250,650"
          stroke="#B85C1B"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 1490,700 Q 1350,650 1250,750"
          stroke="#B85C1B"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 300,0 Q 400,-50 500,50"
          stroke="#B85C1B"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 900,900 Q 1000,850 1100,950"
          stroke="#B85C1B"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </svg>

      <section
        className="relative max-w-4xl mx-auto mb-24 mt-24 text-center px-4"
        aria-labelledby="hero-heading"
      >
        <h1
          id="hero-heading"
          className="text-white text-4xl md:text-5xl font-paragraph font-bold mb-4"
        >
          Building communities that care.
        </h1>
        <p className="text-white text-lg md:text-xl font-paragraph max-w-3xl mx-auto leading-relaxed">
          A reimagined platform to connect people. Simple, accessible and
          focused on what really matters: human connections.
        </p>
      </section>

      <article
        className="relative max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-10"
        aria-labelledby="form-heading"
      >
        <h2
          id="form-heading"
          className="text-darkOrange text-2xl md:text-3xl text-center mb-8 font-heading font-bold"
        >
          Share a location
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full"
        >
          <label
            htmlFor="establishment-name"
            className="text-orange font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            autoComplete="on"
            {...register("name")}
            placeholder="Establishment name"
            className={
              errors.name
                ? "text-gray outline-red-500 border-red-500 border-solid border-2 rounded-lg px-2 h-10 mb-2"
                : "text-gray outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
            }
          />
          {errors.name && (
            <span className="font-sans font-bold text-red-500 mb-4">
              {errors.name.message}
            </span>
          )}

          <label
            htmlFor="establishment-type"
            className="text-orange font-bold mb-2"
          >
            Type
          </label>
          <select
            {...register("type")}
            className={
              errors.type
                ? "text-gray outline-red-500 border-red-500 border-solid border-2 rounded-lg px-2 h-10 mb-2"
                : "outline-orange text-gray border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10 relative"
            }
          >
            <option value="" className="text-gray">
              -- Please choose an option --
            </option>
            <option value="community-kitchen" className="text-gray">
              Community kitchen
            </option>
            <option value="solidarity-kitchen" className="text-gray">
              Solidarity kitchen
            </option>
            <option value="shelter" className="text-gray">
              Shelter
            </option>
            <option value="hospital" className="text-gray">
              Hospital
            </option>
          </select>
          {errors.type && (
            <span className="font-sans font-bold text-red-500 mb-4">
              {errors.type.message}
            </span>
          )}

          <label
            htmlFor="establishment-address"
            className="text-orange font-bold mb-2"
          >
            Address
          </label>
          <input
            type="text"
            autoComplete="on"
            {...register("address")}
            placeholder="Establishment address"
            className={
              errors.address
                ? "text-gray outline-red-500 border-red-500 border-solid border-2 rounded-lg px-2 h-10 mb-2"
                : "text-gray outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
            }
          />
          {errors.address && (
            <span className="font-sans font-bold text-red-500 mb-4">
              {errors.address.message}
            </span>
          )}

          <label
            htmlFor="establishment-telephone"
            className="text-orange font-bold mb-2"
          >
            Telephone
          </label>
          <Controller
            name="telephone"
            control={control}
            render={({ field }) => <InputTelephoneIntlComponent {...field} />}
          />
          {errors.telephone && (
            <span className="font-sans font-bold text-red-500 mb-4">
              {errors.telephone.message}
            </span>
          )}

          <label className="text-orange font-bold mb-2">Location</label>
          <p className="text-gray text-sm mb-4">
            Click on the map to select the establishment location
          </p>
          <MapPickerComponent
            onLocationSelect={handleLocationSelect}
            initialLat={selectedCoords?.lat}
            initialLng={selectedCoords?.lng}
          />

          <fieldset className="grid grid-cols-2 gap-4 mb-10">
            <legend className="sr-only">Coordinates</legend>
            <div>
              <label className="text-orange font-bold mb-2 block">
                Latitude
              </label>
              <input
                type="text"
                readOnly
                {...register("coords.latitude")}
                placeholder="Click on map"
                className="text-gray bg-gray-100 outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 w-full"
              />
              {errors.coords?.latitude && (
                <span className="font-sans font-bold text-red-500 text-sm mt-1 block">
                  {errors.coords.latitude?.message}
                </span>
              )}
            </div>
            <div>
              <label className="text-orange font-bold mb-2 block">
                Longitude
              </label>
              <input
                type="text"
                readOnly
                {...register("coords.longitude")}
                placeholder="Click on map"
                className="text-gray bg-gray-100 outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 w-full"
              />
              {errors.coords?.longitude && (
                <span className="font-sans font-bold text-red-500 text-sm mt-1 block">
                  {errors.coords.longitude?.message}
                </span>
              )}
            </div>
          </fieldset>

          <label className="text-orange font-bold mb-2">Image (Optional)</label>
          <p className="text-gray text-sm mb-4">
            Upload a photo of the establishment
          </p>

          {!imagePreview ? (
            <label
              htmlFor="image-upload"
              className="border-2 border-dashed border-orange rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-orange hover:bg-opacity-5 transition-all mb-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-orange mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-orange font-semibold">
                Click to upload image
              </span>
              <span className="text-gray text-sm mt-1">
                PNG, JPG up to 10MB
              </span>
              <input
                id="image-upload"
                disabled
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative mb-10 rounded-lg overflow-hidden border-2 border-orange">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          <button
            type="submit"
            className="bg-darkOrange rounded-lg px-4 h-12 w-full flex items-center justify-center gap-2 mt-5"
          >
            {isLoading ? (
              <section className="flex gap-2 items-center justify-center">
                <p className="font-semibold text-white">Sharing</p>
                <svg
                  width="100"
                  height="100"
                  className="animate-spin h-5 w-5 mr-3 border-white rounded-full border-4 border-dotted"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="green"
                    strokeWidth="4"
                    fill="yellow"
                  />
                </svg>
              </section>
            ) : (
              <>
                <p className="font-bold text-white">Share</p>
                <IoIosSend fill="white" />
              </>
            )}
          </button>
          <ToastContainer />
        </form>
      </article>
    </main>
  );
}
