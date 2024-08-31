"use client";

import axios from "axios";
import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as interfaces from "@/interfaces/index";
import ProfileBoxContainer from "@/components/ProfileBoxContainer/ProfileBoxContainer";

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
  const { handleSubmit, register } = useForm<interfaces.LocationInputProps>();
  const onSubmit: SubmitHandler<interfaces.LocationInputProps> = (data) =>
    postLocation(data);
  const [isLoading, setIsLoading] = useState(false);

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
          "https://community-cares-server.onrender.com/pending-location",
          {
            name: data.name,
            type: data.type,
            address: data.address,
            contact: data.telephone,
            coords: data.coords,
            provider: githubToken ? "github" : "google",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200)
          toast.success(
            "Location successfully shared! Thank you for helping 🤗"
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
        const { data } = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${githubToken}`,
          },
        });

        return data;
      } else {
        const { data } = await axios.get<interfaces.GooglePeopleAPIProps>(
          "https://people.googleapis.com/v1/people/me?personFields=names,photos",
          {
            headers: {
              Authorization: `Bearer ${parsedGoogleInfo.access_token}`,
            },
          }
        );

        return {
          name: data.names[0].displayName,
          avatar_url: data.photos[0].url,
        };
      }
    } catch (error) {
      console.error("Unable to retrieve user data [getUserData]", error);
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
    <main className="p-10 bg-white">
      <header className="relative w-full flex justify-end items-center">
        <h1 className="absolute text-orange text-2xl text-center w-full">
          Share a location
        </h1>

        <div className="relative flex flex-col items-end">
          <Image
            src={userData ? userData.avatar_url : ""}
            alt={userData.name}
            className="bg-orange rounded-full cursor-pointer"
            width={64}
            height={64}
            onMouseOver={() => setHover(true)}
            ref={imageRef}
          />
          <ProfileBoxContainer isHovered={hover} />
        </div>
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-64 mx-auto mt-14"
      >
        <label
          htmlFor="establishment-name"
          className="text-orange font-bold mb-2"
        >
          Name
        </label>
        <input
          type="text"
          required
          {...register("name")}
          placeholder="Establishment name"
          className="text-gray outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
        />

        <label
          htmlFor="establishment-type"
          className="text-orange font-bold mb-2"
        >
          Type
        </label>
        <select
          {...register("type")}
          className="outline-orange text-gray border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10 relative"
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

        <label
          htmlFor="establishment-address"
          className="text-orange font-bold mb-2"
        >
          Address
        </label>
        <input
          type="text"
          required
          {...register("address")}
          placeholder="Establishment address"
          className="text-gray outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
        />

        <label
          htmlFor="establishment-telephone"
          className="text-orange font-bold mb-2"
        >
          Telephone
        </label>
        <input
          type="text"
          required
          {...register("telephone")}
          placeholder="Establishment telephone"
          className="text-gray outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
        />

        <label className="text-orange font-bold mb-2">Coordinates</label>
        <input
          type="text"
          required
          {...register("coords.latitude")}
          placeholder="Latitude"
          className="text-gray outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-5"
        />
        <input
          type="text"
          required
          {...register("coords.longitude")}
          placeholder="Longitude"
          className="text-gray outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
        />
        <button
          type="submit"
          className="bg-orange rounded-lg px-4 h-10 flex items-center justify-center gap-2 ml-auto"
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
    </main>
  );
}
