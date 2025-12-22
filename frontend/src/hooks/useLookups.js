import { useEffect, useState } from "react";
import axios from "axios";

export default function useLookups() {
  const [peopleMap, setPeopleMap] = useState({});
  const [sprintMap, setSprintMap] = useState({});

  useEffect(() => {
    const load = async () => {
      const peopleRes = await axios.get("http://localhost:4000/people");
      const sprintRes = await axios.get("http://localhost:4000/sprints");

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
