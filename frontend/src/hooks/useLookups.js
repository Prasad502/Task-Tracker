import { useEffect, useState } from "react";
import api from "../api";

export default function useLookups() {
  const [peopleMap, setPeopleMap] = useState({});
  const [sprintMap, setSprintMap] = useState({});

  useEffect(() => {
    const load = async () => {
      const peopleRes = await api.get("/people");
      const sprintRes = await api.get("/sprints");

      const pMap = {};
      peopleRes.data.forEach(p => {
        pMap[p.id] = p.name;
      });

      const sMap = {};
      sprintRes.data.forEach(s => {
        sMap[s.id] = s.name;
      });

      setPeopleMap(pMap);
      setSprintMap(sMap);
    };

    load();
  }, []);

  return { peopleMap, sprintMap };
}
