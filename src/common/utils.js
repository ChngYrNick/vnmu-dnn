const tryCatch = async (promise) => {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export { tryCatch };
