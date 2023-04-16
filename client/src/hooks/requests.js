const API_URL = "https://localhost:4000/v1";

// Load planets and return as JSON.
async function httpGetPlanets() {
  try {
    return await fetch(`${API_URL}/planets`)
      .then((res) => res.json())
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  return await fetch(`${API_URL}/launches`)
    .then((res) => res.json())
    .then((res) => res.sort((a, b) => a.flighNumber - b.flighNumber))
    .catch((err) => console.log(err));
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (error) {
    console.log("there was an error");
    console.log(error);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
