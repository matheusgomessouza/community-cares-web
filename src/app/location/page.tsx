"use client";

import axios from "axios";
import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { useForm, SubmitHandler } from "react-hook-form";
import * as interfaces from "@/interfaces/index";
import { useEffect, useState, useRef } from "react";
import ProfileBoxContainer from "@/components/ProfileBoxContainer.tsx/ProfileBoxContainer";

export default function Location() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [githubUserData, setGithubUserData] = useState<{
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

  async function postLocation(data: interfaces.LocationInputProps) {
    try {
      const token = localStorage.getItem("github-token");

      if (token) {
        await axios.post(
          "https://community-cares-server.onrender.com/location",
          {
            name: data.name,
            type: data.type,
            address: data.address,
            contact: data.telephone,
            coords: data.coords,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Unable to post new location /postLocation");
    }
  }

  async function getUserData() {
    try {
      const token = localStorage.getItem("github-token");

      if (token) {
        const { data } = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return data;
      }
    } catch (error) {
      console.error("Unable to retrieve user data [getUserData]", error);
    }
  }

  useEffect(() => {
    getUserData().then((res) => {
      if (res) {
        setGithubUserData({
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
            src={githubUserData ? githubUserData.avatar_url : ""}
            alt={githubUserData.name}
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
          className="outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
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
          className="outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
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
          className="outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
        />

        <label className="text-orange font-bold mb-2">Coordinates</label>
        <input
          type="text"
          required
          {...register("coords.latitude")}
          placeholder="Latitude"
          className="outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-5"
        />
        <input
          type="text"
          required
          {...register("coords.longitude")}
          placeholder="Longitude"
          className="outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
        />
        <button
          type="submit"
          className="bg-orange rounded-lg h-10 flex items-center justify-center gap-2 w-24 ml-auto"
        >
          <p className="font-bold text-white">Send</p>
          <IoIosSend fill="white" />
        </button>
      </form>
    </main>
  );
}
