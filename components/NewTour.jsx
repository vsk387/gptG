"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import TourInfo from "./TourInfo";
import toast from "react-hot-toast";
import {
  getExistingTour,
  generateTourResponse,
  createNewTour,
} from "@/utils/action";

/*So, the const formData line essentially collects all the form data from the form element that triggered the submission, 
and this data is then used to create an object (destination) that contains key-value pairs 
representing the form fields and their values. 
This can be useful for further processing or sending the form data to a server.
Object.fromEntries converts the formdata into basic js object
*/
const NewTour = () => {
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const newTour = await generateTourRespone(destination);
      if (newTour) {
        return newTour;
      }
      toast.error("No matching city found :(");
      return null;
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget); //creates formData object
    const destination = Object.fromEntries(formData.entries()); //converts formData obj into JS obj named destination using Object.fromEntries method
    mutate(destination);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2l">
        <h2 className="Select your destination"></h2>
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="city"
            name="city"
            required
          ></input>
          <input
            type="text"
            className="input input-bordered join-item w full"
            placeholder="country"
            name="country"
            requried
          ></input>
        </div>
        <button className="btn btn-primary join-item" type="submit">
          Generate tour
        </button>
      </form>
      <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
    </>
  );
};

export default NewTour;
