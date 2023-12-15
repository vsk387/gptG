"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewTour,
  generateTourResponse,
  getExistingTour,
} from "@/utils/action";

import toast from "react-hot-toast";
import TourInfo from "@/components/TourInfo";

//data returned in mutation is true or false. if T, means that city is found by chatGPT and therefore it will invoke
//TourInfo.jsx and provide info about that city
//or else, it will say no matching city found mate
const NewTour = () => {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const exisitingTour = await getExistingTour(destination); //check if city already exists in db
      if (exisitingTour) return exisitingTour; //if it does, then returns something

      const newTour = await generateTourResponse(destination); //passed the test that it  doesnt exist in db therefore it moves on to create new tour and post in the db
      if (newTour) {
        //check if city exists (openai can find city in that country)
        await createNewTour(newTour); //pushes new city in db
        queryClient.invalidateQueries({ queryKey: ["tours"] });
        return newTour;
      }
      toast.error("No matching city found mate");
      return null;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());
    mutate(destination);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className=" mb-4">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="city"
            name="city"
            required
          />
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="country"
            name="country"
            required
          />
          <button className="btn btn-primary join-item" type="submit">
            generate tour
          </button>
        </div>
      </form>
      <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
    </>
  );
};
export default NewTour;
