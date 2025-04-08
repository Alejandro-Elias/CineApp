"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";
import "swiper/css/navigation";
import Swal from "sweetalert2";

import { GetMovies } from "./lib/getMovies";

export default function Home() {
  const [moviesDB, setMoviesDB] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ruta, setRuta] = useState("movie/popular?page=1");

  useEffect(() => {
    if (search.length > 0) {
      setRuta(`search/movie?query=${search}&page=${pagina}`);
    } else {
      setRuta(`movie/popular?page=${pagina}`);
    }
  }, [search, pagina]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await GetMovies(ruta);
        setMoviesDB(data?.results || []);
        setLoading(false);
        console.log(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, [ruta]);

  const modal = (i) => {
    const movie = moviesDB[i];
    const fecha = movie.release_date.split("-").reverse().join("/");
    Swal.fire({
      title: movie.title + " (" + fecha + ")",
      text: movie.overview,
      imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: "/logo.png",
      imageWidth: 120,
      imageAlt: "Custom image",
      background: "rgba(11, 12, 25, 0.8)",
      width: 800,
      color: "rgba(228, 239, 123, 0.8)",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Image
          className="animate-spin"
          src="/loading.png"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
        <h1>loading...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex justify-center p-10 pb-5">
        <Image src="/logo.png" alt="Logo" width={300} height={300} priority />
      </div>
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Buscar película..."
          className="px-4 py-2 border border-gray-300 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-full flex flex-row justify-center">
        <div className="flex w-full justify-center mx-auto">
          <Swiper
            className="w-7/8"
            modules={[Pagination, Grid]}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={4}
            grid={{
              rows: 5,
              fill: "row",
            }}
          >
            {moviesDB.map((movie, index) => (
              <SwiperSlide
                key={movie.id + index + movie.title}
                className="flex flex-col items-center pb-4"
              >
                <div className="relative">
                  <div className="flex justify-center items-center min-h-[300px]" >
                    <Image
                    className="rounded-lg mx-auto"
                    src={ movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: "/logo.png"}
                    alt={movie.title}
                    width={200}
                    height={300}
                  />
                  </div>
                  
                  <div className="w-full flex justify-center bg-black opacity-65 absolute top-0 text-amber-200 ">
                    <h2>{`Rating: ${movie.vote_average.toFixed(1)} / 10`}</h2>
                  </div>
                  <div className="w-full flex justify-center bg-black opacity-65 absolute bottom-0 text-amber-200">
                    <p
                      onClick={() => modal(index)}
                      className="text-center w-[200px] py-1 cursor-pointer"
                    >
                      Ver descripción
                    </p>
                  </div>
                </div>

                <h2 className="text-center mt-2">{movie.title}</h2>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="flex justify-center my-10">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
        >
          Anterior
        </button>
        <p className="px-4 py-2">Página {pagina}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPagina((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
