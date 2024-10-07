import React from "react";

export const Card = ({
  id,
  name,
  ppg = "",
}: {
  id: string;
  name: string;
  ppg: string;
}) => {
  const generatePlayerImg = (id: string) => {
    // let [first, ...second] = name.split(" ")
    // const base = "https://www.basketball-reference.com/req/202106291/images/headshots/";
    // const _name = String(second[0].toLowerCase() + first.slice(0,2).toLowerCase() + String("01"));
    // console.log(`${base}${_name}.jpg`);
    // return `${base}${_name}.jpg`;
    return `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${id}.png`;
  };
  return (
    <div className="w-full flex flex-row space-x-4 items-center text-center text-black">
      <img src={generatePlayerImg(id)} width={80} height={80} />
      <h3 className="text-xl font-medium">{name}</h3>
      <h2>{ppg}</h2>
    </div>
  );
};
