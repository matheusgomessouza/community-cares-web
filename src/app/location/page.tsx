"use client";

import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { useForm, SubmitHandler } from "react-hook-form";
import * as interfaces from "@/interfaces/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Location() {
  const [githubUserData, setGithubUserData] = useState<string>();
  const { handleSubmit } = useForm<interfaces.LocationInputProps>();
  const onSubmit: SubmitHandler<interfaces.LocationInputProps> = (data) =>
    console.log(data);
  const router = useRouter();

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
        setGithubUserData(res.avatar_url);
      }
    });
  }, []);

  return (
    <main className="p-10">
      <header className="w-full flex justify-between items-center">
        <h1 className="text-orange text-2xl text-center w-full">
          Share a location
        </h1>

        <Image
          src={githubUserData ? githubUserData : ""}
          alt=""
          className="bg-gray rounded-full cursor-pointer"
          width={64}
          height={64}
          onClick={() => {
            localStorage.removeItem("github-token");
            router.push("/");
          }}
        />
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
          name="establishment-name"
          required
          value={""}
          onChange={() => {}}
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
          name="establishment-type"
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
          name="establishment-address"
          required
          value={""}
          onChange={() => {}}
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
          name="establishment-telephone"
          required
          value={""}
          onChange={() => {}}
          placeholder="Establishment telephone"
          className="outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
        />

        <label className="text-orange font-bold mb-2">Coordinates</label>
        <input
          type="text"
          name="establishment-latitude"
          required
          value={""}
          onChange={() => {}}
          placeholder="Latitude"
          className="outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-5"
        />
        <input
          type="text"
          name="establishment-longitude"
          required
          value={""}
          onChange={() => {}}
          placeholder="Longitude"
          className="outline-orange border-solid border-gray border-2 rounded-lg px-2 h-10 mb-10"
        />
        <button
          type="submit"
          className="bg-orange rounded-lg h-10 flex items-center justify-center gap-2 w-24 ml-auto"
        >
          <p className="font-bold">Send</p>
          <IoIosSend />
        </button>
      </form>
    </main>
  );
}
