function Panel() {
  const update = async () => {
    const response = await fetch(process.env.REACT_APP_API + "/update", {
      credentials: "include",
    });
  };

  return (
    <>
    <button onClick={update}>Actualizar profesores</button>
    </>
  )
}

export default Panel