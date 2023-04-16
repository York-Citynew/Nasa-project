import { useMemo } from "react";
import { Appear, Table, Paragraph } from "arwes";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
const History = (props) => {
  // const navigate = useNavigate();
  const fetchSecretInfo = async () =>
    await fetch("https://localhost:4000/v1/secret")
      .then((res) => res.json())
      .then(console.log)
      .catch(console.log);
  // const logIn = () => {
  // navigate("https://localhost:4000/auth/google");
  // };
  const logOut = () => {};
  const tableBody = useMemo(() => {
    return props.launches
      ?.filter((launch) => !launch.upcoming)
      .map((launch) => {
        return (
          <tr key={String(launch.flightNumber)}>
            <td>
              <span style={{ color: launch.success ? "greenyellow" : "red" }}>
                █
              </span>
            </td>
            <td>{launch.flightNumber}</td>
            <td>{new Date(launch.launchDate).toDateString()}</td>
            <td>{launch.mission}</td>
            <td>{launch.rocket}</td>
            <td>{launch.customers?.join(", ")}</td>
          </tr>
        );
      });
  }, [props.launches]);
  return (
    <article id='history'>
      <button onClick={fetchSecretInfo}>show sensitive info</button>
      <a href='https://localhost:4000/auth/google'>log in</a>
      <button onClick={logOut}>log out</button>
      <Appear
        animate
        show={props.entered}
      >
        <Paragraph>
          History of mission launches including SpaceX launches starting from
          the year 2006.
        </Paragraph>
        <Table animate>
          <table style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ width: "2rem" }}></th>
                <th style={{ width: "3rem" }}>No.</th>
                <th style={{ width: "9rem" }}>Date</th>
                <th>Mission</th>
                <th style={{ width: "7rem" }}>Rocket</th>
                <th>Customers</th>
              </tr>
            </thead>
            <tbody>{tableBody}</tbody>
          </table>
        </Table>
      </Appear>
    </article>
  );
};

export default History;
