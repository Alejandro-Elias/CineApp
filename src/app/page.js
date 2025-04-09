"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "animate.css"

import { GetMovies } from "./lib/getMovies";

export default function Home() {
  const [moviesDB, setMoviesDB] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ruta, setRuta] = useState("movie/popular?page=1");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (pagina < totalPages) {
          setPagina(pagina + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pagina, totalPages]);

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
        setMoviesDB((prevMovies) =>
          pagina === 1 ? data.results : [...prevMovies, ...data.results]
        );
        setLoading(false);
        console.log(data);
        setTotalPages(data.total_pages);
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
      imageUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/logo.png",
      imageWidth: 120,
      imageAlt: "Custom image",
      background: "rgba(11, 12, 25, 0.8)",
      width: 800,
      color: "rgba(228, 239, 123, 0.8)",
      showClass: {
        popup: 'animate__animated animate__flipInX'
      },
      hideClass: {
        popup: 'animate__animated animate__flipOutX'
      }
    });
  };
  const searchMovie = (e) => {
    e.preventDefault();
    setPagina(1);
    setMoviesDB([]);
    setSearch(e.target.value);
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
          className="px-4 py-2 border border-gray-300 rounded w-[300px]"
          onChange={(e) => searchMovie(e)}
        />
      </div>

      <div className="w-full flex flex-row justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 w-7/8">
          {moviesDB.map((movie, index) => (
            <div style={{ "--animate-duration": "3.5s" }} className=" animate__animated animate__fadeIn" key={movie.id + index + movie.title}>
              <div className="flex flex-col items-center pb-4 min-h-[370px] justify-between ">
                <div className="relative">
                  <div className="flex justify-center items-center min-h-[320px] pb-5">
                    <Image
                      className="rounded-lg mx-auto "
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/logo.png"
                      }
                      alt={movie.title}
                      width={200}
                      height={280}
                    />
                  </div>

                  <div className="w-full flex justify-center bg-black opacity-65 absolute top-0 text-amber-200 ">
                    <h2>{`Rating: ${
                      movie.vote_average
                        ? movie.vote_average.toFixed(1) + " / 10"
                        : "N/A"
                    }`}</h2>
                  </div>
                  <div className="w-full flex justify-center bg-black opacity-65 absolute bottom-5 text-amber-200">
                    <p
                      onClick={() => modal(index)}
                      className="text-center w-[200px] cursor-pointer"
                    >
                      Ver descripción
                    </p>
                  </div>
                </div>

                <h2 className="text-center mt-2">{movie.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*<div className="flex justify-center my-10">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
        >
          Anterior
        </button>
        <p className="px-4 py-2">
          Página {pagina} / {totalPages}
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPagina((prev) => Math.min(prev + 1, totalPages))}
        >
          Siguiente
        </button>
      </div>*/}
    </>
  );
}
